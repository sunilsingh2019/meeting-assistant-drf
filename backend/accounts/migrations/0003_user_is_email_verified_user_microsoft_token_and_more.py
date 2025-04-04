# Generated by Django 4.2.7 on 2025-03-25 11:16

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_user_email_verification_token_user_email_verified'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_email_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='microsoft_token',
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.CreateModel(
            name='UserPreferences',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('working_hours_start', models.TimeField(default='09:00')),
                ('working_hours_end', models.TimeField(default='17:00')),
                ('work_days', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=10), default=['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], size=None)),
                ('preferred_meeting_duration', models.IntegerField(default=30)),
                ('has_completed_onboarding', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='preferences', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'User preferences',
            },
        ),
    ]
