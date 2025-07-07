from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os
from api.cao_selection import cao_selection_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Register blueprints
app.register_blueprint(cao_selection_bp)

# Serve static files from frontend
@app.route('/')
def serve_frontend():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    # Check if file exists in frontend directory
    frontend_path = os.path.join('../frontend', path)
    if os.path.exists(frontend_path):
        return send_from_directory('../frontend', path)
    
    # If not found, return 404
    return jsonify({'error': 'File not found'}), 404

# Health check endpoint
@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'CAO Tracker API is running'
    })

# API info endpoint
@app.route('/api/info')
def api_info():
    return jsonify({
        'name': 'CAO Tracker API',
        'version': '1.0.0',
        'endpoints': {
            'cao_selection': {
                'GET /api/cao-selection': 'Get current CAO selection',
                'POST /api/cao-selection': 'Save CAO selection',
                'DELETE /api/cao-selection': 'Clear CAO selection'
            },
            'health': {
                'GET /api/health': 'Health check'
            }
        }
    })

if __name__ == '__main__':
    # Create data directory if it doesn't exist
    os.makedirs('data', exist_ok=True)
    
    # Run the Flask app
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )