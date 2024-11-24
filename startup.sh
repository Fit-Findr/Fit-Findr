#!/bin/bash
cd ./server  # Navigate to the directory with your app
gunicorn --bind 0.0.0.0:8000 app:app