# Generated by Django 3.1.5 on 2021-04-05 18:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=30)),
                ('last_name', models.CharField(max_length=30)),
                ('email', models.EmailField(max_length=254)),
                ('username', models.CharField(max_length=30)),
                ('password', models.CharField(max_length=30)),
                ('date_of_birth', models.DateField()),
                ('buying_power', models.DecimalField(decimal_places=2, default=0, max_digits=19)),
                ('cash', models.DecimalField(decimal_places=2, default=0, max_digits=19)),
            ],
        ),
        migrations.CreateModel(
            name='Stock',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ticker', models.CharField(max_length=5)),
                ('company_name', models.CharField(max_length=100)),
                ('market_price', models.DecimalField(blank=True, decimal_places=2, max_digits=19, null=True)),
                ('ipo_price', models.DecimalField(decimal_places=2, default=0, max_digits=19)),
                ('shares_outstanding', models.DecimalField(decimal_places=2, default=1000000, max_digits=19)),
                ('industry', models.CharField(choices=[('tech', 'Information Technology'), ('energy', 'Energy'), ('materials', 'Materials'), ('utilities', 'Utilities'), ('healthcare', 'Healthcare'), ('financial', 'Financial')], max_length=30)),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='market.user')),
            ],
        ),
    ]
