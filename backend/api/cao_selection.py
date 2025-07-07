from flask import Blueprint, request, jsonify
import json
import os
from datetime import datetime

cao_selection_bp = Blueprint('cao_selection', __name__)

# Simple file-based storage for CAO selections
SELECTION_FILE = 'data/cao_selections.json'

def ensure_data_directory():
    """Ensure the data directory exists"""
    os.makedirs('data', exist_ok=True)

def load_selections():
    """Load CAO selections from file"""
    ensure_data_directory()
    try:
        if os.path.exists(SELECTION_FILE):
            with open(SELECTION_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading selections: {e}")
    return {'selectedCAOs': [], 'lastUpdated': None}

def save_selections(data):
    """Save CAO selections to file"""
    ensure_data_directory()
    try:
        with open(SELECTION_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error saving selections: {e}")
        return False

@cao_selection_bp.route('/api/cao-selection', methods=['GET'])
def get_cao_selection():
    """Get current CAO selection"""
    try:
        data = load_selections()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cao_selection_bp.route('/api/cao-selection', methods=['POST'])
def save_cao_selection():
    """Save CAO selection"""
    try:
        request_data = request.get_json()
        
        if not request_data or 'selectedCAOs' not in request_data:
            return jsonify({'error': 'selectedCAOs field is required'}), 400
        
        selected_caos = request_data['selectedCAOs']
        
        # Validate that selectedCAOs is a list
        if not isinstance(selected_caos, list):
            return jsonify({'error': 'selectedCAOs must be a list'}), 400
        
        # Create data structure
        data = {
            'selectedCAOs': selected_caos,
            'lastUpdated': datetime.now().isoformat(),
            'count': len(selected_caos)
        }
        
        # Save to file
        if save_selections(data):
            return jsonify({
                'message': 'CAO selection saved successfully',
                'selectedCAOs': selected_caos,
                'count': len(selected_caos)
            }), 200
        else:
            return jsonify({'error': 'Failed to save CAO selection'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cao_selection_bp.route('/api/cao-selection', methods=['DELETE'])
def clear_cao_selection():
    """Clear CAO selection"""
    try:
        data = {
            'selectedCAOs': [],
            'lastUpdated': datetime.now().isoformat(),
            'count': 0
        }
        
        if save_selections(data):
            return jsonify({'message': 'CAO selection cleared successfully'}), 200
        else:
            return jsonify({'error': 'Failed to clear CAO selection'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500