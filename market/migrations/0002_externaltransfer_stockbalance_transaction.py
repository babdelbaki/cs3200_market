# Generated by Django 3.1.5 on 2021-04-13 19:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('market', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExternalTransfer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deposit', models.BooleanField()),
                ('quantity', models.DecimalField(blank=True, decimal_places=2, max_digits=19, null=True)),
                ('date', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.DecimalField(blank=True, decimal_places=2, max_digits=19, null=True)),
                ('price', models.DecimalField(blank=True, decimal_places=2, max_digits=19, null=True)),
                ('pending', models.BooleanField()),
                ('bid', models.BooleanField()),
                ('date_submitted', models.DateTimeField()),
                ('date_completed', models.DateTimeField()),
                ('from_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='submitted_transactions', to='market.user')),
                ('stock', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='market.stock')),
                ('to_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='completed_transactions', to='market.user')),
            ],
        ),
        migrations.CreateModel(
            name='StockBalance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.DecimalField(blank=True, decimal_places=2, max_digits=19, null=True)),
                ('available_quantity', models.DecimalField(blank=True, decimal_places=2, max_digits=19, null=True)),
                ('stock', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='market.stock')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='market.user')),
            ],
        ),
    ]
