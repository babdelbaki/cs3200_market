"""wallpapers URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.views.generic.base import TemplateView

from rest_framework import routers
from market import views as market_views

urlpatterns = [

    path("market/", TemplateView.as_view(template_name = "market/hello_webpack.html")),
    path("market/<path:path>", TemplateView.as_view(template_name = "market/hello_webpack.html"))
]



router = routers.DefaultRouter()
router.register(r'api/users', market_views.UserViewSet)
router.register(r'api/stocks', market_views.StockViewSet)
router.register(r'api/stockbalances', market_views.StockBalanceViewSet)
router.register(r'api/transactions', market_views.TransactionViewSet)
router.register(r'api/externaltransfers', market_views.ExternalTransferViewSet)
urlpatterns += router.urls


