#!/bin/sh
set -e

HOST=${HOST:-0.0.0.0}
PORT=${PORT:-8000}

# Run DB Migrations
echo "Running DB Migrations"
alembic upgrade head

# Run Data Migrations
echo "Running Data Migrations"
python migrate_managed.py

# Start the server
echo "Starting the server"
uvicorn main:app --host "$HOST" --port "$PORT"
