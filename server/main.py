from flask import Flask, request, jsonify
from flask import send_from_directory
from flask_cors import CORS
import os
import json

if not os.path.exists('./uploads'):
    os.makedirs('./uploads')

metadata_file = './uploads/image_metadata.json'
if not os.path.exists(metadata_file):
    with open(metadata_file, 'w') as f:
        json.dump([], f)

app = Flask(__name__)
CORS(app)

# @app.route("/api/users", methods=["GET"])

# def users():
#     return jsonify(
#         {
#             "users": ["Alice", "Bob", "Charlie"]
#         }
#     )

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files or 'category' not in request.form:
        return jsonify({'error': 'No file or category in the request'}), 400

    file = request.files['image']  # Get the uploaded file
    category = request.form['category']  # Get the category

    # Save the file to the uploads folder
    file.save(f'./uploads/{file.filename}')

    # Load the current metadata from the JSON file
    with open(metadata_file, 'r') as f:
        metadata = json.load(f)

    # Add the new image's filename and category to the metadata
    metadata.append({'filename': file.filename, 'category': category})

    # Save the updated metadata back to the JSON file
    with open(metadata_file, 'w') as f:
        json.dump(metadata, f)

    return jsonify({'message': 'Image and category uploaded successfully!', 'filename': file.filename, 'category': category}), 200


@app.route('/uploads/<filename>', methods=['GET'])
def get_image(filename):
    return send_from_directory('uploads', filename)

@app.route('/api/images', methods=['GET'])
def list_images():
    uploads_dir = 'uploads' 
    images = os.listdir(uploads_dir)  # Get list of files in uploads directory
    return jsonify(images)

@app.route('/api/metadata', methods=['GET'])
def get_image_metadata():
    # Return the image metadata from the JSON file
    with open(metadata_file, 'r') as f:
        metadata = json.load(f)
    return jsonify(metadata)


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

if __name__ == "__main__":
    app.run(debug=True, port=8080)