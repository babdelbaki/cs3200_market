# Generated by Django 3.1.5 on 2021-04-13 20:27

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('market', '0004_externaltransfer_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='externaltransfer',
            name='date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='date_completed',
            field=models.DateTimeField(null=True),
        ),
    ]
