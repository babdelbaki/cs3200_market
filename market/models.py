from django.db import models
from django.utils import timezone
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.db.models import F

class User(models.Model):
    first_name = models.CharField(max_length = 30)
    last_name = models.CharField(max_length = 30)

    # built-in Django validator that makes sure email addresses are valid
    email = models.EmailField()
    username = models.CharField(max_length = 30)
    password = models.CharField(max_length = 30)

    date_of_birth = models.DateField()

    # when depositing, both buying power and cash increase
    # when withdrawing, both buying power and cash decrease
    # when submitting a bid, buying power decreases but cash will not change
        # when cancelling a bid, buying power increases, no change in cash
    # 2 decimal places for standard currency convention
    buying_power = models.DecimalField(default = 0, null = False, blank = False, max_digits = 19, decimal_places = 2)
    cash = models.DecimalField(default = 0, null = False, blank = False, max_digits = 19, decimal_places = 2)

    def __str__(self):
        return self.first_name + self.last_name + "(" + self.username + ")"

class Stock(models.Model):
    INDUSTRY_CHOICES = (
        ("tech", "Information Technology"),
        ("energy", "Energy"),
        ("materials", "Materials"),
        ("utilities", "Utilities"),
        ("healthcare", "Healthcare"),
        ("financial", "Financial")
    )


    ticker = models.CharField(max_length = 5)
    company_name = models.CharField(max_length = 100)
    market_price = models.DecimalField(null=True, blank = True, max_digits=19, decimal_places=2)
    ipo_price = models.DecimalField(default = 0, null = False, blank=False, max_digits=19, decimal_places=2)
    shares_outstanding = models.DecimalField(default = 1000000, null=False, blank=False, max_digits=19, decimal_places=2)
    industry = models.CharField(max_length = 30, choices = INDUSTRY_CHOICES)

    # assume one owner for simplicity, they will receive all the shares outstanding upon IPO
    owner = models.ForeignKey(User, related_name = "stock", on_delete=models.SET_NULL, null = True)

    def __str__(self):
        return self.ticker + " (" + self.company_name + ")"

class StockBalance(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null = True)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, null = True)
    quantity = models.DecimalField(default = 0, blank = False, max_digits=19, decimal_places=2)
    available_quantity = models.DecimalField(default = 0, blank = False, max_digits=19, decimal_places=2)

class Transaction(models.Model):
    quantity = models.DecimalField(null=False, blank = False, default = 0, max_digits=19, decimal_places=2)
    price = models.DecimalField(null=False, blank = False, default = 0, max_digits=19, decimal_places=2)
    bid = models.BooleanField()
    from_user = models.ForeignKey(User, related_name = "submitted_transactions", on_delete=models.SET_NULL, null = True)
    to_user = models.ForeignKey(User, related_name = "completed_transactions", on_delete=models.SET_NULL, null = True, blank = True)

    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, null = True)

    date_submitted = models.DateTimeField(default = timezone.now)
    date_completed = models.DateTimeField(null = True, blank = True)

class ExternalTransfer(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null = True)
    deposit = models.BooleanField()
    quantity = models.DecimalField(null=True, blank = True, max_digits=19, decimal_places=2)
    date = models.DateTimeField(default = timezone.now)


# create stock balances when a new user is created
@receiver(post_save, sender = User)
def create_stock_balances_on_new_user(sender, instance, created, **kwargs):
    for stock in Stock.objects.all():
        StockBalance.objects.get_or_create(
            user = instance,
            stock = stock
        )

@receiver(post_save, sender = Stock)
# create stock balances when a new stock is created
def create_stock_balances_on_new_stock(sender, instance, created, **kwargs):
    for user in User.objects.all():
        StockBalance.objects.get_or_create(
            user = user,
            stock = instance
        )

    if created:
        owner_balance = StockBalance.objects.get(user = instance.owner, stock = instance)
        owner_balance.quantity = instance.shares_outstanding
        owner_balance.available_quantity = instance.shares_outstanding
        owner_balance.save()

@receiver(post_save, sender = ExternalTransfer)
# update cash balances when a new external transfer is created
def update_cash_balances_external_transfer(sender, instance, created, **kwargs):
    if created:
        if instance.deposit:
            multiplier = 1
        else:
            multiplier = -1

        # update balances

        # F statement makes sure that value is updated correctly upon saving
        # (non repeatable read)
        instance.user.cash = F("cash") + instance.quantity * multiplier
        instance.user.buying_power = F("buying_power") + instance.quantity * multiplier
        instance.user.save()
        instance.user.refresh_from_db()

@receiver(post_save, sender = Transaction)
# update cash/stock balances when a transaction is submitted or completed
def update_balances_transaction(sender, instance, created, **kwargs):
    # determine sign of cash/stock change for each user

    dollar_quantity = instance.quantity * instance.price
    stock_quantity = instance.quantity

    if created:
        # transaction first submitted
        if instance.bid:
            # if bid
            # subtract buying power of from user
            instance.from_user.buying_power = F("buying_power") - dollar_quantity

            instance.from_user.save()
            instance.from_user.refresh_from_db()
        else:
            # if sell
            # subtract available quantity of from user's stock balance
            from_user_balance_obj = StockBalance.objects.get(user = instance.from_user, stock = instance.stock)
            from_user_balance_obj.available_quantity = F("available_quantity") - stock_quantity

            from_user_balance_obj.save()
            from_user_balance_obj.refresh_from_db()

    elif instance.to_user:
        # transaction completed
        from_user_balance_obj = StockBalance.objects.get(user = instance.from_user, stock = instance.stock)
        to_user_balance_obj = StockBalance.objects.get(user = instance.to_user, stock = instance.stock)
        if instance.bid:
            # if bid, subtract cash of from user and increase stock balance
            instance.from_user.cash = F("cash") - dollar_quantity

            from_user_balance_obj.available_quantity = F("available_quantity") + stock_quantity
            from_user_balance_obj.quantity = F("quantity") + stock_quantity

            # increase cash balance and decrease stock balance of to user
            instance.to_user.cash = F("cash") + dollar_quantity
            instance.to_user.buying_power = F("buying_power") + dollar_quantity

            from_user_balance_obj.available_quantity = F("available_quantity") - stock_quantity
            from_user_balance_obj.quantity = F("quantity") - stock_quantity
        else:
            # if sell order, increase cash of from user and decrease stock balance
            instance.from_user.cash = F("cash") + dollar_quantity
            instance.from_user.buying_power = F("buying_power") + dollar_quantity

            from_user_balance_obj.quantity = F("quantity") - stock_quantity

            # decrease cash balance and increase stock balance of to user
            instance.to_user.cash = F("cash") - dollar_quantity
            instance.to_user.buying_power = F("buying_power") - dollar_quantity

            to_user_balance_obj.available_quantity = F("available_quantity") + stock_quantity
            to_user_balance_obj.quantity = F("quantity") + stock_quantity

        instance.from_user.save()
        instance.from_user.refresh_from_db()

        instance.to_user.save()
        instance.to_user.refresh_from_db()

        from_user_balance_obj.save()
        from_user_balance_obj.refresh_from_db()

        to_user_balance_obj.save()
        to_user_balance_obj.refresh_from_db()

        instance.stock.market_price = instance.price
        instance.stock.save()

# when transaction is cancelled, return buying power and available quantity as appropriate
@receiver(pre_delete, sender = Transaction)
def update_balances_on_cancel(sender, instance, *args, **kwargs):
    if not instance.to_user:
        dollar_quantity = instance.quantity * instance.price
        stock_quantity = instance.quantity

        if instance.bid:
            # return buying power
            instance.from_user.buying_power = F("buying_power") + dollar_quantity

            instance.from_user.save()
            instance.from_user.refresh_from_db()
        else:
            # return available quantity
            from_user_balance_obj = StockBalance.objects.get(user = instance.from_user, stock = instance.stock)
            from_user_balance_obj.available_quantity = F("available_quantity") + stock_quantity

            from_user_balance_obj.save()
            from_user_balance_obj.refresh_from_db()
