#!/bin/sh

# Activate virtual environment
. /opt/venv/bin/activate

# Wait for database to be ready
./wait-for-db.sh

# Run migrations
python manage.py migrate

# Create superuser
python manage.py create_superuser

# Start server
exec python manage.py runserver 0.0.0.0:8000 