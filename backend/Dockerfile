FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    dos2unix \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Create and activate virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies
COPY requirements.txt .
RUN . /opt/venv/bin/activate && \
    pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy wait-for-db script and make it executable
COPY wait-for-db.sh .
COPY entrypoint.sh .
RUN chmod +x wait-for-db.sh && \
    chmod +x entrypoint.sh && \
    dos2unix wait-for-db.sh && \
    dos2unix entrypoint.sh

# Copy project files
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Run entrypoint script
CMD ["sh", "./entrypoint.sh"]