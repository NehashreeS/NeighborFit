#!/usr/bin/env python3
"""
Complete data pipeline runner for NeighborFit
Fetches, cleans, and prepares neighborhood data
"""

import sys
import os
from datetime import datetime

# Add the current directory to Python path
sys.path.append(os.path.dirname(__file__))

from data_processing.fetch_data import fetch_all_data, save_raw_data
from data_processing.clean_data import clean_all_data, save_clean_data

def run_complete_pipeline():
    """Run the complete data processing pipeline"""
    print("=" * 60)
    print("NEIGHBORFIT DATA PROCESSING PIPELINE")
    print("=" * 60)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    try:
        # Step 1: Fetch raw data
        print("STEP 1: Fetching raw data...")
        raw_data = fetch_all_data()
        raw_file = save_raw_data(raw_data)
        print(f"✓ Raw data saved: {raw_file}")
        print()
        
        # Step 2: Clean and process data
        print("STEP 2: Cleaning and processing data...")
        clean_data = clean_all_data()
        clean_file = save_clean_data(clean_data)
        print(f"✓ Clean data saved: {clean_file}")
        print()
        
        # Step 3: Validation
        print("STEP 3: Final validation...")
        print(f"✓ Total neighborhoods processed: {len(clean_data)}")
        print(f"✓ Data columns: {list(clean_data.columns)}")
        
        # Check data quality
        required_columns = ['id', 'name', 'avg_rent', 'safety_score', 'walkability', 'family_friendly', 'noise_level']
        missing_columns = [col for col in required_columns if col not in clean_data.columns]
        
        if missing_columns:
            print(f"⚠ Warning: Missing required columns: {missing_columns}")
        else:
            print("✓ All required columns present")
        
        print()
        print("=" * 60)
        print("PIPELINE COMPLETED SUCCESSFULLY!")
        print("=" * 60)
        print(f"Finished at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Pipeline failed with error: {e}")
        print("=" * 60)
        return False

if __name__ == "__main__":
    success = run_complete_pipeline()
    sys.exit(0 if success else 1)