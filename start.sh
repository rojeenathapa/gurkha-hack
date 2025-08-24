#!/bin/bash
# Startup script for Render.com deployment

echo "Starting Litterly Waste Classification API..."

# Install dependencies
pip install -r requirements.txt

# Start the application with Gunicorn
gunicorn --config gunicorn_config.py wsgi:app 