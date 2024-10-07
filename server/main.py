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

def get_dominant_color(image_path, k=1):
    # Load the image
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert to RGB

    # Reshape image to a 2D array of pixels
    image = image.reshape((-1, 3))

    # Perform KMeans clustering to find dominant color
    kmeans = KMeans(n_clusters=k)
    kmeans.fit(image)

    # Get the dominant color
    dominant_color = kmeans.cluster_centers_.astype(int)
    
    return dominant_color[0]  # Return RGB tuple


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
    app.run(debug=True, port=8080)