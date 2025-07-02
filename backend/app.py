from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
from matching import calculate_neighborhood_matches

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load neighborhood data on startup
def load_neighborhood_data():
    """Load neighborhood data from CSV file"""
    try:
        data_path = os.path.join(os.path.dirname(__file__), 'data', 'neighborhood_data.csv')
        df = pd.read_csv(data_path)
        return df.to_dict('records')
    except FileNotFoundError:
        print("Warning: neighborhood_data.csv not found. Using empty dataset.")
        return []
    except Exception as e:
        print(f"Error loading data: {e}")
        return []

# Global variable to store neighborhood data
NEIGHBORHOOD_DATA = load_neighborhood_data()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'neighborhoods_loaded': len(NEIGHBORHOOD_DATA)
    })

@app.route('/match', methods=['POST'])
def find_matches():
    """
    Main endpoint to find neighborhood matches based on user preferences
    
    Expected JSON payload:
    {
        "budget": "low|medium|high",
        "safetyImportance": 1-5,
        "walkabilityImportance": 1-5,
        "familyFriendly": true|false,
        "quietEnvironment": true|false
    }
    """
    try:
        # Validate request
        if not request.is_json:
            return jsonify({'error': 'Request must be JSON'}), 400
        
        preferences = request.get_json()
        
        # Validate required fields
        required_fields = ['budget', 'safetyImportance', 'walkabilityImportance', 'familyFriendly', 'quietEnvironment']
        for field in required_fields:
            if field not in preferences:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Validate field values
        if preferences['budget'] not in ['low', 'medium', 'high']:
            return jsonify({'error': 'Budget must be low, medium, or high'}), 400
        
        if not (1 <= preferences['safetyImportance'] <= 5):
            return jsonify({'error': 'Safety importance must be between 1 and 5'}), 400
        
        if not (1 <= preferences['walkabilityImportance'] <= 5):
            return jsonify({'error': 'Walkability importance must be between 1 and 5'}), 400
        
        if not isinstance(preferences['familyFriendly'], bool):
            return jsonify({'error': 'Family friendly must be true or false'}), 400
        
        if not isinstance(preferences['quietEnvironment'], bool):
            return jsonify({'error': 'Quiet environment must be true or false'}), 400
        
        # Calculate matches
        matches = calculate_neighborhood_matches(NEIGHBORHOOD_DATA, preferences)
        
        return jsonify({
            'success': True,
            'matches': matches,
            'total_neighborhoods': len(NEIGHBORHOOD_DATA)
        })
    
    except Exception as e:
        print(f"Error in find_matches: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/neighborhoods', methods=['GET'])
def get_all_neighborhoods():
    """Get all available neighborhoods"""
    return jsonify({
        'neighborhoods': NEIGHBORHOOD_DATA,
        'count': len(NEIGHBORHOOD_DATA)
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print(f"Starting NeighborFit API server...")
    print(f"Loaded {len(NEIGHBORHOOD_DATA)} neighborhoods")
    app.run(debug=True, host='0.0.0.0', port=5000)