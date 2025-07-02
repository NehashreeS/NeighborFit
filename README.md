# NeighborFit - Complete Neighborhood Matching Application

A full-stack web application that helps users find the perfect neighborhoods based on their lifestyle preferences, budget, and priorities.

##  Architecture

### Frontend (React + TypeScript)
- **Modern React** with TypeScript and Tailwind CSS
- **Responsive Design** with mobile-first approach
- **State Management** using custom hooks and React state
- **Error Handling** with error boundaries and user-friendly messages
- **API Integration** with loading states and retry mechanisms

### Backend (Flask + Python)
- **RESTful API** with comprehensive endpoints
- **Intelligent Matching Algorithm** with weighted scoring
- **Data Processing Pipeline** for cleaning and validation
- **CORS Support** for frontend integration
- **Error Handling** with detailed validation

##  Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ and pip
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd neighborfit
```

### 2. Set Up Frontend
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### 3. Set Up Backend
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Run data processing pipeline
python run_data_pipeline.py

# Start Flask server
python app.py
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health**: http://localhost:5000/health

## 📊 Features

### User Experience
- **Intuitive Landing Page** with clear value proposition
- **Interactive Preferences Form** with star ratings and visual selections
- **Smart Results Display** with match scores and detailed explanations
- **Responsive Design** that works on all devices
- **Real-time API Status** indicator

### Matching Algorithm
- **Budget Compatibility** (30% weight) - Matches rent to user's budget range
- **Safety Scoring** (25% weight) - Weighted by user's safety importance
- **Walkability Assessment** (20% weight) - Based on user's walkability needs
- **Family Friendliness** (15% weight) - Bonus for family-oriented users
- **Noise Level Consideration** (10% weight) - Accounts for quiet preferences

### Data Processing
- **Automated Data Pipeline** for fetching and cleaning neighborhood data
- **Data Validation** with comprehensive error handling
- **Quality Reporting** with detailed statistics
- **Flexible Data Sources** ready for real API integration

## 🛠 Development

### Frontend Development
```bash
# Start development server with hot reload
npm install

npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Development
```bash
cd backend

pip install -r requirements.txt

# Run data pipeline
python run_data_pipeline.py

# Run with different configurations
python app.py
```

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

#### Backend (.env)
```env
FLASK_ENV=development
FLASK_DEBUG=true
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
MAX_RESULTS=3
```

## 📁 Project Structure

```
neighborfit/
├── src/                          # Frontend React application
│   ├── components/              # React components
│   │   ├── LandingPage.tsx     # Landing page component
│   │   ├── PreferencesForm.tsx # User preferences form
│   │   ├── ResultsPage.tsx     # Results display
│   │   ├── ApiStatus.tsx       # API status indicator
│   │   └── ErrorBoundary.tsx   # Error handling component
│   ├── hooks/                   # Custom React hooks
│   │   └── useApi.ts           # API interaction hooks
│   ├── services/               # API services
│   │   └── api.ts              # API client functions
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts            # Shared types
│   ├── utils/                  # Utility functions
│   │   └── matching.ts         # Client-side matching (fallback)
│   └── data/                   # Static data
│       └── neighborhoods.ts    # Neighborhood data (fallback)
├── backend/                     # Flask backend application
│   ├── app.py                  # Main Flask application
│   ├── matching.py             # Neighborhood matching algorithm
│   ├── config.py               # Configuration settings
│   ├── requirements.txt        # Python dependencies
│   ├── run_data_pipeline.py    # Data processing pipeline
│   ├── data/                   # Data files
│   │   └── neighborhood_data.csv # Processed neighborhood data
│   └── data_processing/        # Data processing modules
│       ├── fetch_data.py       # Data fetching
│       └── clean_data.py       # Data cleaning and validation
├── public/                     # Static assets
├── package.json               # Frontend dependencies
└── README.md                  # This file
```

## 🔌 API Endpoints

### POST /match
Find neighborhood matches based on user preferences.

**Request:**
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
  "matches": [...],
  "total_neighborhoods": 12
}
```

### GET /neighborhoods
Get all available neighborhoods.

### GET /health
API health check with status information.



## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues:

1. Check the API status indicator in the top-right corner
2. Ensure both frontend and backend servers are running
3. Check the browser console for error messages
4. Verify environment variables are set correctly
5. Run the data pipeline if you're getting "no neighborhoods" errors

For additional help, please open an issue in the repository.
