#!/bin/bash

# Step 1: Install frontend dependencies and build the frontend
# cd front-end
# npm install
# npm run build

# Step 2: Install backend dependencies
cd server
pip install -r requirements.txt

# Step 3: Start Flask app (or use gunicorn)
#python app.py
flask run