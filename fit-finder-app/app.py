from flask import Flask, render_template
import requests

app = Flask(__name__)

@app.route('/')
def hello():
    point_url = "https://api.weather.gov/points/44.97997%2C-93.26384"
    point_response = requests.get(point_url)
    forecast_url = point_response.json()["properties"]["forecast"]
    forecast_response = requests.get(forecast_url)
    forecast_response.json()
    return render_template("index.html")