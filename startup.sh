#!/bin/bash
cd ./server  # Navigate to the directory with your app
pip install -r requirements.txt
gunicorn --bind 0.0.0.0:8000 app:app