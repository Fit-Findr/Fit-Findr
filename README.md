
# Fit Finder

## Overview
This project is a Virtual Wardrobe application that allows users to upload images of their clothing items and visualize their outfits. The project consists of a frontend built with React and a backend powered by Flask.

## Project Structure
```
/virtual-wardrobe
│
├── /frontend          # React application
│   ├── ...            # Frontend code and assets
│   └── ...
│
└── /server           # Flask backend application
    ├── main.py         # Main Flask application
    ├── uploads/       # Folder to store uploaded images
```

## Prerequisites
Before running the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (includes npm)
- [Python](https://www.python.org/downloads/) (version 3.6 or higher)
- [pip](https://pip.pypa.io/en/stable/) (Python package installer)

## Getting Started

### Frontend Setup
1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the React application**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

### Backend Setup
1. **Navigate to the backend directory**:
   ```bash
   cd ../server
   ```

2. **Create a virtual environment (optional but recommended)**:
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install Flask and other dependencies**:
   ```bash
   pip install Flask Flask-CORS
   ```

5. **Run the Flask application**:
   ```bash
   python main.py
   ```
   The backend will be accessible at `http://localhost:8080`.

### Communication Between Frontend and Backend
The frontend communicates with the backend using API URLs. Ensure that the frontend is configured to make requests to `http://localhost:8080`.

## Additional Notes
- The `uploads` folder in the backend is where all uploaded images are stored. This folder is not included in version control (git) and will be created automatically when images are uploaded.
- Be sure to include any necessary API endpoints in your frontend code to connect with the backend functionalities.


