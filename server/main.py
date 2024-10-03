from flask import Flask, request, jsonify
from flask import send_from_directory
from flask_cors import CORS
import os

if not os.path.exists('./uploads'):
    os.makedirs('./uploads')
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
    if 'image' not in request.files:
        return jsonify({'error': 'No file in the request'}), 400

    file = request.files['image']  # Get the uploaded file
    file.save(f'./uploads/{file.filename}')  # Save file to a directory
    return jsonify({'message': 'Image uploaded successfully!', 'filename': file.filename}), 200


@app.route('/uploads/<filename>', methods=['GET'])
def get_image(filename):
    return send_from_directory('uploads', filename)

@app.route('/api/images', methods=['GET'])
def list_images():
    uploads_dir = 'uploads' 
    images = os.listdir(uploads_dir)  # Get list of files in uploads directory
    return jsonify(images)

if __name__ == "__main__":
    app.run(debug=True, port=8080)