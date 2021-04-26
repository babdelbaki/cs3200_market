from rest_framework import serializers
from rest_framework.metadata import SimpleMetadata

from .models import User, Stock, StockBalance, Transaction, ExternalTransfer

class ForeignKeyChoices(serializers.PrimaryKeyRelatedField):
    # subclass to easily identify when a field is of this type
    pass

class AllUsersForeignKey(ForeignKeyChoices):
    def get_queryset(self):
        return (User.objects.all())

class AllStocksForeignKey(ForeignKeyChoices):
    def get_queryset(self):
        return (Stock.objects.all())

class CustomMetadata(SimpleMetadata):
    # displays correct choices with user-friendly display names
    def get_field_info(self, field):
        field_info = super().get_field_info(field)

        if (not field_info.get('read_only') and
                (isinstance(field, ForeignKeyChoices))
                and
                hasattr(field, 'choices')):
            choice_list = [
                {
                    'value': choice_value,
                    'display_name': choice_name
                }
                for choice_value, choice_name in field.choices.items()
            ]

            # choice_list.append({"value": None, "display_name": "----"})

            field_info['choices'] = choice_list

        return field_info

def get_all_users():
    all_users = [(u.id, u) for u in User.objects.all()]
    return all_users

class StockBalanceSerializer(serializers.ModelSerializer):
    user = AllUsersForeignKey()
    stock = AllStocksForeignKey()

    username = serializers.ReadOnlyField(source = "user.username")
    stock_ticker =  serializers.ReadOnlyField(source = "stock.ticker")
    stock_company_name =  serializers.ReadOnlyField(source = "stock.company_name")

    class Meta:
        model = StockBalance
        fields = ["id", "user", "stock", "quantity", "available_quantity",
                    "username", "stock_ticker", "stock_company_name"]


class BooleanChoiceField(serializers.ChoiceField):
    def __init__(self, choices, **kwargs):
        self._choices = choices
        super(BooleanChoiceField, self).__init__(choices, **kwargs)

    def to_representation(self, obj):
        return self._choices[obj]

    def to_internal_value(self, data):
        # convert from js to python
        if data == "true":
            return True
        elif data == "false":
            return False

class TransactionSerializer(serializers.ModelSerializer):
    from_user = AllUsersForeignKey()
    to_user = AllUsersForeignKey(required = False, allow_null = True)
    stock = AllStocksForeignKey()
    bid = BooleanChoiceField(choices = [(True, "Bid"), (False, "Sell")], label = "Transaction Type")
    price = serializers.DecimalField(required = True, max_digits = 19, decimal_places = 2)
    quantity = serializers.DecimalField(required = True, max_digits = 19, decimal_places = 2)

    from_username = serializers.ReadOnlyField(source = "from_user.username", label = "Submitted By")
    to_username = serializers.ReadOnlyField(source = "to_user.username", label = "Completed By")
    stock_ticker =  serializers.ReadOnlyField(source = "stock.ticker", label = "Ticker")
    stock_company_name =  serializers.ReadOnlyField(source = "stock.company_name")

    class Meta:
        model = Transaction
        fields = ["id", "from_user", "to_user", "stock", "price", "quantity", "bid", "from_username",
                    "to_username", "stock_ticker", "stock_company_name"]

class ExternalTransferSerializer(serializers.ModelSerializer):
    user = AllUsersForeignKey()
    deposit = BooleanChoiceField([(True, "Deposit"), (False, "Withdrawal")], label = "Type")

    username = serializers.ReadOnlyField(source = "user.username")

    class Meta:
        model = ExternalTransfer
        fields = ["id", "user", "deposit", "quantity", "username"]

class UserSerializer(serializers.ModelSerializer):
    completed_transactions = TransactionSerializer(many = True, read_only = True)
    submitted_transactions = TransactionSerializer(many = True, read_only = True)
    externaltransfer_set = ExternalTransferSerializer(many = True, read_only = True)
    stockbalance_set = StockBalanceSerializer(many = True, read_only = True)

    class Meta:
        model = User
        fields = ["id", "username", "password", "first_name", "last_name", "email", "date_of_birth", "buying_power", "cash",
                    "completed_transactions", "submitted_transactions", "stock", "externaltransfer_set", "stockbalance_set"]
        depth = 1

class StockSerializer(serializers.ModelSerializer):
    industry = serializers.ChoiceField(choices = Stock.INDUSTRY_CHOICES)
    owner = AllUsersForeignKey()
    transaction_set = TransactionSerializer(many = True, read_only = True)
    stockbalance_set = StockBalanceSerializer(many = True, read_only = True)

    class Meta:
        model = Stock
        fields = ["id", "ticker", "company_name", "market_price", "ipo_price", "shares_outstanding", "industry", "owner", "transaction_set", "stockbalance_set"]
        depth = 1