"""
Data cleaning module for NeighborFit
Handles missing values, data validation, and normalization
"""

import pandas as pd
import numpy as np
import os
from datetime import datetime

def load_raw_data(filename='raw_neighborhood_data.csv'):
    """Load raw neighborhood data from CSV"""
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    filepath = os.path.join(data_dir, filename)
    
    try:
        df = pd.read_csv(filepath)
        print(f"Loaded {len(df)} records from {filepath}")
        return df
    except FileNotFoundError:
        print(f"File {filepath} not found. Creating sample data...")
        # If no raw data exists, create sample data
        from fetch_data import generate_sample_neighborhoods
        sample_data = generate_sample_neighborhoods()
        df = pd.DataFrame(sample_data)
        return df

def validate_data_types(df):
    """Validate and convert data types"""
    print("Validating data types...")
    
    # Ensure numeric columns are numeric
    numeric_columns = ['avg_rent', 'safety_score', 'walkability', 'family_friendly', 'noise_level']
    
    for col in numeric_columns:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # Ensure string columns are strings
    string_columns = ['id', 'name', 'description', 'highlights']
    
    for col in string_columns:
        if col in df.columns:
            df[col] = df[col].astype(str)
    
    return df

def handle_missing_values(df):
    """Handle missing or invalid values"""
    print("Handling missing values...")
    
    initial_count = len(df)
    
    # Remove rows with missing essential data
    essential_columns = ['name', 'avg_rent']
    df = df.dropna(subset=essential_columns)
    
    # Fill missing scores with median values
    score_columns = ['safety_score', 'walkability', 'family_friendly', 'noise_level']
    
    for col in score_columns:
        if col in df.columns:
            median_value = df[col].median()
            df[col] = df[col].fillna(median_value)
            print(f"Filled {col} missing values with median: {median_value:.2f}")
    
    # Fill missing descriptions
    if 'description' in df.columns:
        df['description'] = df['description'].fillna('Neighborhood description not available.')
    
    # Fill missing highlights
    if 'highlights' in df.columns:
        df['highlights'] = df['highlights'].fillna('General amenities')
    
    # Generate IDs if missing
    if 'id' in df.columns:
        # Create a Series from the index to use with fillna
        index_series = pd.Series(df.index.astype(str), index=df.index)
        df['id'] = df['id'].fillna(index_series)
    else:
        df['id'] = df.index.astype(str)
    
    final_count = len(df)
    print(f"Removed {initial_count - final_count} rows with missing essential data")
    
    return df

def validate_score_ranges(df):
    """Validate that scores are within expected ranges"""
    print("Validating score ranges...")
    
    # Define expected ranges for each score
    score_ranges = {
        'safety_score': (1, 5),
        'walkability': (1, 5),
        'family_friendly': (1, 5),
        'noise_level': (1, 5)
    }
    
    for col, (min_val, max_val) in score_ranges.items():
        if col in df.columns:
            # Clip values to valid range
            original_min = df[col].min()
            original_max = df[col].max()
            
            df[col] = df[col].clip(min_val, max_val)
            
            if original_min < min_val or original_max > max_val:
                print(f"Clipped {col} values to range [{min_val}, {max_val}]")
    
    return df

def validate_rent_values(df):
    """Validate rent values are reasonable"""
    print("Validating rent values...")
    
    if 'avg_rent' in df.columns:
        # Remove unrealistic rent values
        min_rent = 300  # Minimum reasonable rent
        max_rent = 10000  # Maximum reasonable rent
        
        initial_count = len(df)
        df = df[(df['avg_rent'] >= min_rent) & (df['avg_rent'] <= max_rent)]
        final_count = len(df)
        
        if initial_count != final_count:
            print(f"Removed {initial_count - final_count} rows with unrealistic rent values")
    
    return df

def normalize_highlights(df):
    """Normalize and clean highlights data"""
    print("Normalizing highlights...")
    
    if 'highlights' in df.columns:
        # Ensure highlights are properly formatted
        def clean_highlights(highlights):
            if pd.isna(highlights) or highlights == 'nan':
                return 'General amenities'
            
            # If it's already a semicolon-separated string, keep it
            if isinstance(highlights, str) and ';' in highlights:
                return highlights
            
            # If it's a list, join with semicolons
            if isinstance(highlights, list):
                return ';'.join(highlights)
            
            # Otherwise, return as is
            return str(highlights)
        
        df['highlights'] = df['highlights'].apply(clean_highlights)
    
    return df

def add_derived_fields(df):
    """Add derived fields for better analysis"""
    print("Adding derived fields...")
    
    # Add rent category
    if 'avg_rent' in df.columns:
        def categorize_rent(rent):
            if rent < 1200:
                return 'low'
            elif rent < 2000:
                return 'medium'
            else:
                return 'high'
        
        df['rent_category'] = df['avg_rent'].apply(categorize_rent)
    
    # Add overall quality score
    score_columns = ['safety_score', 'walkability', 'family_friendly']
    if all(col in df.columns for col in score_columns):
        df['overall_quality'] = df[score_columns].mean(axis=1)
    
    # Add quietness score (inverse of noise level)
    if 'noise_level' in df.columns:
        df['quietness_score'] = 6 - df['noise_level']  # Invert noise level
    
    return df

def remove_duplicates(df):
    """Remove duplicate neighborhoods"""
    print("Removing duplicates...")
    
    initial_count = len(df)
    
    # Remove duplicates based on name (case-insensitive)
    df['name_lower'] = df['name'].str.lower()
    df = df.drop_duplicates(subset=['name_lower'], keep='first')
    df = df.drop('name_lower', axis=1)
    
    final_count = len(df)
    
    if initial_count != final_count:
        print(f"Removed {initial_count - final_count} duplicate neighborhoods")
    
    return df

def generate_data_quality_report(df):
    """Generate a data quality report"""
    print("\n=== DATA QUALITY REPORT ===")
    print(f"Total neighborhoods: {len(df)}")
    print(f"Columns: {list(df.columns)}")
    
    # Check for missing values
    missing_values = df.isnull().sum()
    if missing_values.sum() > 0:
        print("\nMissing values:")
        for col, count in missing_values.items():
            if count > 0:
                print(f"  {col}: {count}")
    else:
        print("\nNo missing values found!")
    
    # Summary statistics for numeric columns
    numeric_columns = df.select_dtypes(include=[np.number]).columns
    if len(numeric_columns) > 0:
        print(f"\nNumeric column statistics:")
        print(df[numeric_columns].describe())
    
    # Rent distribution
    if 'avg_rent' in df.columns:
        print(f"\nRent distribution:")
        print(f"  Min: ${df['avg_rent'].min():,.0f}")
        print(f"  Max: ${df['avg_rent'].max():,.0f}")
        print(f"  Mean: ${df['avg_rent'].mean():,.0f}")
        print(f"  Median: ${df['avg_rent'].median():,.0f}")
    
    print("=== END REPORT ===\n")

def clean_all_data():
    """Main function to clean all neighborhood data"""
    print("Starting data cleaning process...")
    
    # Load raw data
    df = load_raw_data()
    
    # Apply all cleaning steps
    df = validate_data_types(df)
    df = handle_missing_values(df)
    df = validate_score_ranges(df)
    df = validate_rent_values(df)
    df = normalize_highlights(df)
    df = remove_duplicates(df)
    df = add_derived_fields(df)
    
    # Generate quality report
    generate_data_quality_report(df)
    
    return df

def save_clean_data(df, filename='neighborhood_data.csv'):
    """Save cleaned data to CSV"""
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(data_dir, exist_ok=True)
    
    filepath = os.path.join(data_dir, filename)
    df.to_csv(filepath, index=False)
    print(f"Clean data saved to {filepath}")
    return filepath

if __name__ == "__main__":
    # Clean and save data
    clean_df = clean_all_data()
    save_clean_data(clean_df)
    print("Data cleaning complete!")