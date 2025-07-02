# NeighborFit Backend API

Flask-based REST API for the NeighborFit neighborhood matching application.

## Features

- **Neighborhood Matching Algorithm**: Intelligent scoring based on user preferences
- **Data Processing Pipeline**: Automated data fetching, cleaning, and validation
- **RESTful API**: Clean endpoints for frontend integration
- **Data Validation**: Comprehensive input validation and error handling
- **CORS Support**: Cross-origin requests enabled for frontend integration

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Process Data

```bash
python run_data_pipeline.py
```

### 4. Start the Server

```bash
python app.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### POST /match
Find neighborhood matches based on user preferences.

**Request Body:**
```json
{
  "budget": "low|medium|high",
  "safetyImportance": 1-5,
  "walkabilityImportance": 1-5,
  "familyFriendly": true|false,
  "quietEnvironment": true|false
}
```

**Response:**
```json
{
  "success": true,
  "matches": [
    {
      "id": "1",
      "name": "Green Valley Heights",
      "matchScore": 85,
      "matchReasons": ["Great budget fit", "Excellent safety rating"],
      "avgRent": 1200,
      "safetyScore": 4.8,
      "walkabilityScore": 4.2,
      "familyFriendlyScore": 4.9,
      "noiseLevel": 2.1,
      "description": "A peaceful suburban neighborhood...",
      "highlights": ["Top-rated schools", "Multiple parks"]
    }
  ],
  "total_neighborhoods": 12
}
```

### GET /neighborhoods
Get all available neighborhoods.

### GET /health
Health check endpoint.

## Data Processing

The backend includes a complete data processing pipeline:

### 1. Data Fetching (`data_processing/fetch_data.py`)
- Simulates fetching from multiple data sources
- Combines API data and web scraping results
- Saves raw data for processing

### 2. Data Cleaning (`data_processing/clean_data.py`)
- Handles missing values
- Validates data types and ranges
- Removes duplicates
- Generates data quality reports

### 3. Pipeline Runner (`run_data_pipeline.py`)
- Orchestrates the complete data processing workflow
- Provides detailed logging and error handling

## Matching Algorithm

The neighborhood matching algorithm (`matching.py`) considers:

- **Budget Compatibility (30%)**: How well rent fits user's budget range
- **Safety Score (25%)**: Weighted by user's safety importance rating
- **Walkability Score (20%)**: Weighted by user's walkability importance
- **Family Friendliness (15%)**: Bonus for family-oriented users
- **Noise Level (10%)**: Penalty for users preferring quiet environments

## Configuration

Environment variables (see `.env.example`):

- `FLASK_ENV`: Environment (development/production)
- `SECRET_KEY`: Flask secret key
- `CORS_ORIGINS`: Allowed CORS origins
- `MAX_RESULTS`: Maximum neighborhoods to return
- `DATA_PATH`: Path to data files

## Production Deployment

### Using Gunicorn

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using Docker

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

## Development

### Running Tests

```bash
python -m pytest tests/
```

### Code Quality

```bash
flake8 .
black .
```

### Data Pipeline

To regenerate neighborhood data:

```bash
python run_data_pipeline.py
```

## File Structure

```
backend/
├── app.py                 # Main Flask application
├── matching.py            # Neighborhood matching algorithm
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── run_data_pipeline.py  # Data processing pipeline
├── data/
│   └── neighborhood_data.csv  # Processed neighborhood data
└── data_processing/
    ├── fetch_data.py     # Data fetching module
    └── clean_data.py     # Data cleaning module
```