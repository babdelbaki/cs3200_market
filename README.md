# cs3200_market
DB Design Final Project (Django + React + MySQL)

# Struture Notes
Database connection settings found in core/settings.py

URL routing found in core/urls.py

Models defined in market/models.py

Serializers (similar to DAO) found in market/serializers.py (convert Django objects to JSON and vice versa)

API endpoints found in market/views.py 

Front-end implementation found in js directory

Base HTML template found in templates/market/hello_webpack.html

I used Django (a Python ORM) to create these databases then performed an export using the console so all of the sql commands are in a single file


# Additional Notes
Have some experience with Django, was really using this as an opportunity to learn more React, tried to make components reusable across all endpoints. 

I have developed this using pythonanywhere.com, not my local system, so there may be some slight changes required before deploying on a local machine. 
Working example can be found at https://www.naturewallpapers.xyz/market/users

# Problem statement - describe the problem that your project is trying to solve

This project is modelling a stock market

# Solution statement - describe the solution you implemented to solve the problem
# User - describe the typical user(s) that would use your solution
# Domain objects - describe at least two of the domain objects you implemented in your solution

Team members: Bassel Abdelbaki (solo, section 3)

Project Name: Stock Market



Brief Description: This project is meant to model the administrator of a stock market. 
Users can buy or sell stock from each other, and they have cash balances and stock 
balances that reflect the appropriate transactions.

Data model: found in db_design_final_project_database.pdf

User data model: Users can create accounts, then they can deposit or withdraw cash to these
accounts. The users can buy and sell stock from other users. 

Stock data model: Represents a listing in the stock market. Has a defined number of shares which
is first given to the Stock's owner, then these shares can be traded among users. Includes stock
ticker, company name, and industry type (portable enumeration)

Stockbalance data model: Represents a user's ownership in a stock. This has two foreign keys,
user and stock, and two fields that represent the user's total and available shares.

Transaction data model: Represents a trade between two users. Can be a buy or sell
transaction that is executed at a defined price with a certain number of shares. Must include
a from_user, will remain "pending" until the transaction is completed by a to_user. 
A user's cash and stock balance will not change until the transaction is completed, but
submissions are tracked with the "buying_power" field on user and "available_quantity" field
on StockBalance. Keeps track of submission and completion date.

ExternalTransfer data model: Represents a cash deposit or withdrawal by a user. Records the
quantity and date of this transaction.

User <-> Stockbalance <-> Stock relationship:
Every user has stock balances for each stock. These are initialized with quantities of 0
that can be increased by purchasing stock or by being assigned the owner of a stock.

Stock <-> User relationship: 
Each stock has an owner, who is given all the shares when the stock is created. This 
is a one-to-one relationship. 

User <-> (Transaction <-> Stock) <-> User
Users can submit buy or sell orders for specific stocks, which can be completed by another
user. This will also include corresponding changes in stock balances and cash balances.

Portable enumeration:
I incorporated the portable enumeration for a Stock's industry using the following:

INDUSTRY_CHOICES = (
        ("tech", "Information Technology"),
        ("energy", "Energy"),
        ("materials", "Materials"),
        ("utilities", "Utilities"),
        ("healthcare", "Healthcare"),
        ("financial", "Financial")
    )
industry = models.CharField(max_length = 30, choices = INDUSTRY_CHOICES)


I know we were instructed to use a separate lookup table to ensure functionality across different vendors
but Django's "choices" argument allows for easy implementation of this across  multiple vendors so I thought 
this captured the spirit of the task

User interface requirement: The administrator can create, read, update, or delete users from a list view,
and access their profile using links. The profile shows their transactions, stock balances, 
and external transfers. The administrator can create, read, update, or delete stocks from a list 
view and access a detailed view using links. This includes a transaction list, stock balance list, and link to the owner's profile.
The administrator can create, update, or delete incomplete transactions from a list view, which
includes links to a detail view with additional links to its participating users and relevant stock.
The administrator can read stock balances in a list view. All changes will be handled by 
changes to the transaction. The administrator can create and read external transfers in a list view.
I have been selective about the permissions to replicate what the real-world for this might look like.
