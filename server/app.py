from flask import Flask, request, jsonify
from flask import send_from_directory
from flask_cors import CORS
import os
import json
from colorthief import ColorThief  # For color detection
from PIL import Image

if not os.path.exists('./uploads'):
    os.makedirs('./uploads')

metadata_file = './uploads/image_metadata.json'
if not os.path.exists(metadata_file):
    with open(metadata_file, 'w') as f:
        json.dump([], f)

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files or 'category' not in request.form:
        return jsonify({'error': 'No file or category in the request'}), 400

    file = request.files['image']
    category = request.form['category']
    subcategory = request.form.get('subcategory')

    # Save the file to the uploads folder
    image_path = f'./uploads/{file.filename}'
    file.save(image_path)

    # Perform color detection on the uploaded image
    dominant_colors = detect_colors(image_path)
    
    # Load the current metadata from the JSON file
    with open(metadata_file, 'r') as f:
        metadata = json.load(f)

    # Add the new image's filename, category, and detected colors to the metadata
    metadata.append({
        'filename': file.filename,
        'category': category,
        'subcategory': subcategory,
        'colors': dominant_colors  # Store the detected colors
    })

    # Save the updated metadata back to the JSON file
    with open(metadata_file, 'w') as f:
        json.dump(metadata, f)

    return jsonify({
        'message': 'Image, category, and colors uploaded successfully!',
        'filename': file.filename,
        'category': category,
        'subcategory': subcategory,
        'colors': dominant_colors
    }), 200


def detect_colors(image_path):
    """
    Detect dominant colors using the ColorThief library.
    Returns a list of RGB color tuples.
    """
    color_thief = ColorThief(image_path)
    # Get the dominant color
    dominant_color = color_thief.get_color(quality=1)

    return dominant_color

@app.route('/uploads/<filename>', methods=['GET'])
def get_image(filename):
    return send_from_directory('uploads', filename)


@app.route('/api/images/tops', methods=['GET'])
def get_tops():
    # Load the current metadata from the JSON file
    with open(metadata_file, 'r') as f:
        metadata = json.load(f)
    
    # Filter for images in the 'top' category
    tops = [item for item in metadata if item['category'] == 'top']
    return jsonify(tops)

@app.route('/api/images/bottoms', methods=['GET'])
def get_bottoms():
    # Load the current metadata from the JSON file
    with open(metadata_file, 'r') as f:
        metadata = json.load(f)

    # Filter for images in the 'bottom' category
    bottoms = [item for item in metadata if item['category'] == 'bottom']
    return jsonify(bottoms)

@app.route('/api/images/layers', methods=['GET'])
def get_layers():
    # Load the current metadata from the JSON file
    with open(metadata_file, 'r') as f:
        metadata = json.load(f)

    # Filter for images in the 'layer' category
    layers = [item for item in metadata if item['category'] == 'layer']
    return jsonify(layers)

@app.route('/api/save-fit', methods=['POST'])
def save_fit():
    data = request.json
    top = data.get('top')
    bottom = data.get('bottom')
    layer = data.get('layer')

    if not top or not bottom or not layer:
        return jsonify({'error': 'Incomplete fit data'}), 400

    # Load the current fits from the JSON file
    fits_file = './uploads/fits.json'
    if not os.path.exists(fits_file):
        with open(fits_file, 'w') as f:
            json.dump([], f)

    with open(fits_file, 'r') as f:
        fits = json.load(f)

    # Add the new fit to the JSON data
    fits.append({
        'layer': layer,
        'top': top,
        'bottom': bottom
    })

    # Save the updated fits back to the JSON file
    with open(fits_file, 'w') as f:
        json.dump(fits, f)

    return jsonify({'message': 'Fit saved successfully!'}), 200


@app.route('/api/saved-fits', methods=['GET'])
def get_saved_fits():

    with open('./uploads/fits.json', 'r') as f:
        fits = json.load(f)
    return jsonify(fits)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080)