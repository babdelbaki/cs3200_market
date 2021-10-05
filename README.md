# Stock Market
DB Design Final Project (Django + React + MySQL)

# Struture Notes
Working example can be found at https://www.naturewallpapers.xyz/market/users

Database connection settings found in core/settings.py

URL routing found in core/urls.py

Models defined in market/models.py

Serializers (similar to DAO) found in market/serializers.py (convert Django objects to JSON and vice versa)

API endpoints found in market/views.py 

Front-end implementation found in js directory

Base HTML template found in templates/market/hello_webpack.html

I used Django (a Python ORM) to create these databases then performed an export using the console so all of the sql commands are in a single file


# Additional Notes
I have some experience with Django, was really using this as an opportunity to learn more React, tried to make components reusable across all endpoints. 

I have developed this using pythonanywhere.com, not my local system, so there may be some slight changes required before deploying on a local machine. 
Working example can be found at https://www.naturewallpapers.xyz/market/users

Data model: found in db_design_final_project_database.pdf

# Problem statement 

This project is modelling a stock market. Users can buy and sell shares of different stocks to each other. They can also deposit and withdraw cash in order to fund these purchases. Histories of all transactions and external transfers are logged, and the appropriate calculations are made to ensure cash and stock actually moves in between users.
A few questions this project could answer: What is Jeff Bezos's current cash balance? How many shares of Amazon did Cathie Wood buy from Jeff Bezos, and what was the price per share? How many shares of Apple does Tim Cook have? How much cash did Elon Musk withdraw?

# Solution statement

To incorporate this stock market along with a graphical interface, there are a few components. First is the Django (Python) backend. Here models for each of the domain objects are defined, along with helper functions to ensure transactions actually move cash and shares around. Django's migration features were then used to construct the tables. Using the Django REST Framework toolkit, API endpoints were set up for each of the objects so that the models can be accessed and manipulated via HTTP. This was used for a React front-end, where the "administrator" can create, read, update, and delete users, stocks, incomplete transactions, and external transfers. The administrator can also view stock balances and completed transactions, but they cannot be directly updated or deleted to represent the real-world implementation of this. 

The answers to the questions above can be easily found using the GUI

Jeff Bezos currently has $17,610,000.00 in cash

Cathie Wood purchased 5000 shares of Amazon at $3,100 each

Tim Cook has $1,000,000 shares of Apple

Elon Musk withdrew $500 

# User 

The solution as it stands could be used by stock brokers to manage their clients' stocks and by the clients to view their portfolio. It could also be used by companies looking to go public, as this gives them a way for others to buy and sell shares of their stock. If this solution were to be extended with sign-up/login features and restrictions on permissions, the users themselves could submit transactions and this could be used by any individual looking to invest in stocks, similar to a Robinhood type application.  This solution could also be easily extended to any kind of auction-based marketplace. Stocks are what I thought of but this structure could be used for something like administrating eBay auctions or the StockX clothing collection.

# Domain objects and Relationships

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
