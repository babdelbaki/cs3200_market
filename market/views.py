from django.shortcuts import render
from .models import User, Stock, StockBalance, Transaction, ExternalTransfer
from .serializers import UserSerializer, StockSerializer, StockBalanceSerializer, TransactionSerializer, ExternalTransferSerializer
from django.views.generic import ListView

from rest_framework import viewsets

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed, created, or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [permissions.IsAuthenticated]


class StockViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows stocks to be viewed, created, or edited.
    """
    queryset = Stock.objects.all()
    serializer_class = StockSerializer

class StockBalanceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows stock balances to be viewed, created, or edited.
    """
    queryset = StockBalance.objects.all()
    serializer_class = StockBalanceSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows transactions to be viewed, created, or edited.
    """
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class ExternalTransferViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows external transfers to be viewed, created, or edited.
    """
    queryset = ExternalTransfer.objects.all()
    serializer_class = ExternalTransferSerializer

class UserListView(ListView):
    pass