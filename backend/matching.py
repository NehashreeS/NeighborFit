"""
Neighborhood matching algorithm for NeighborFit
Calculates compatibility scores based on user preferences
"""

def get_budget_range(budget):
    """Convert budget category to rent range"""
    budget_ranges = {
        'low': (0, 1200),
        'medium': (1200, 2000),
        'high': (2000, float('inf'))
    }
    return budget_ranges.get(budget, (0, float('inf')))

def calculate_budget_score(rent, budget):
    """Calculate how well the rent fits the budget preference"""
    min_rent, max_rent = get_budget_range(budget)
    
    if min_rent <= rent <= max_rent:
        return 1.0
    elif rent < min_rent:
        # Rent is lower than preferred range (still good)
        return max(0.5, 1 - (min_rent - rent) / min_rent)
    else:
        # Rent is higher than preferred range (penalty)
        if max_rent == float('inf'):
            return max(0, 1 - (rent - 2000) / 2000)  # Use 2000 as reference for high budget
        return max(0, 1 - (rent - max_rent) / max_rent)

def normalize_score(score, max_value=5):
    """Normalize a score to 0-1 range"""
    return min(score / max_value, 1)

def calculate_safety_score(neighborhood_safety, importance):
    """Calculate weighted safety score"""
    normalized_safety = normalize_score(neighborhood_safety)
    weight = importance / 5.0
    return normalized_safety * weight

def calculate_walkability_score(neighborhood_walkability, importance):
    """Calculate weighted walkability score"""
    normalized_walkability = normalize_score(neighborhood_walkability)
    weight = importance / 5.0
    return normalized_walkability * weight

def calculate_family_score(neighborhood_family_score, user_wants_family_friendly):
    """Calculate family-friendliness score"""
    if user_wants_family_friendly:
        return normalize_score(neighborhood_family_score) * 0.8
    else:
        # If user doesn't care about family-friendliness, give neutral score
        return 0.5

def calculate_quiet_score(neighborhood_noise_level, user_wants_quiet):
    """Calculate quietness score (lower noise = higher score for quiet preference)"""
    if user_wants_quiet:
        # Invert noise level (lower noise = higher score)
        quiet_score = (5 - neighborhood_noise_level) / 5
        return quiet_score * 0.7
    else:
        # If user doesn't mind noise, give neutral score
        return 0.5

def generate_match_reasons(neighborhood, preferences, scores):
    """Generate human-readable reasons why this neighborhood matches"""
    reasons = []
    
    # Budget reasons
    if scores['budget'] > 0.8:
        reasons.append("Great budget fit")
    elif scores['budget'] > 0.6:
        reasons.append("Good value for money")
    
    # Safety reasons
    if scores['safety'] > 0.7 and preferences['safetyImportance'] >= 4:
        reasons.append("Excellent safety rating")
    elif scores['safety'] > 0.5 and preferences['safetyImportance'] >= 3:
        reasons.append("Good safety record")
    
    # Walkability reasons
    if scores['walkability'] > 0.7 and preferences['walkabilityImportance'] >= 4:
        reasons.append("Highly walkable")
    elif scores['walkability'] > 0.5 and preferences['walkabilityImportance'] >= 3:
        reasons.append("Good walkability")
    
    # Family reasons
    if preferences['familyFriendly'] and neighborhood['family_friendly'] > 4.0:
        reasons.append("Very family-friendly")
    elif preferences['familyFriendly'] and neighborhood['family_friendly'] > 3.5:
        reasons.append("Family-friendly amenities")
    
    # Quiet reasons
    if preferences['quietEnvironment'] and neighborhood['noise_level'] < 2.5:
        reasons.append("Very peaceful environment")
    elif preferences['quietEnvironment'] and neighborhood['noise_level'] < 3.5:
        reasons.append("Quiet neighborhood")
    
    return reasons

def calculate_neighborhood_matches(neighborhoods, preferences):
    """
    Main function to calculate neighborhood matches
    
    Args:
        neighborhoods: List of neighborhood dictionaries
        preferences: User preferences dictionary
    
    Returns:
        List of top 3 matching neighborhoods with scores and reasons
    """
    matches = []
    
    for neighborhood in neighborhoods:
        try:
            # Calculate individual component scores
            budget_score = calculate_budget_score(neighborhood['avg_rent'], preferences['budget'])
            safety_score = calculate_safety_score(neighborhood['safety_score'], preferences['safetyImportance'])
            walkability_score = calculate_walkability_score(neighborhood['walkability'], preferences['walkabilityImportance'])
            family_score = calculate_family_score(neighborhood['family_friendly'], preferences['familyFriendly'])
            quiet_score = calculate_quiet_score(neighborhood['noise_level'], preferences['quietEnvironment'])
            
            # Store individual scores for reason generation
            component_scores = {
                'budget': budget_score,
                'safety': safety_score,
                'walkability': walkability_score,
                'family': family_score,
                'quiet': quiet_score
            }
            
            # Calculate weighted total score
            # Weights: Budget (30%), Safety (25%), Walkability (20%), Family (15%), Quiet (10%)
            total_score = (
                budget_score * 0.30 +
                safety_score * 0.25 +
                walkability_score * 0.20 +
                family_score * 0.15 +
                quiet_score * 0.10
            )
            
            # Convert to percentage
            match_percentage = round(total_score * 100)
            
            # Generate match reasons
            match_reasons = generate_match_reasons(neighborhood, preferences, component_scores)
            
            # Create match object
            match = {
                'id': neighborhood['id'],
                'name': neighborhood['name'],
                'description': neighborhood['description'],
                'avgRent': neighborhood['avg_rent'],
                'safetyScore': neighborhood['safety_score'],
                'walkabilityScore': neighborhood['walkability'],
                'familyFriendlyScore': neighborhood['family_friendly'],
                'noiseLevel': neighborhood['noise_level'],
                'highlights': neighborhood['highlights'].split(';') if isinstance(neighborhood['highlights'], str) else neighborhood['highlights'],
                'matchScore': match_percentage,
                'matchReasons': match_reasons,
                'componentScores': {
                    'budget': round(budget_score * 100),
                    'safety': round(safety_score * 100),
                    'walkability': round(walkability_score * 100),
                    'family': round(family_score * 100),
                    'quiet': round(quiet_score * 100)
                }
            }
            
            matches.append(match)
            
        except KeyError as e:
            print(f"Missing field in neighborhood data: {e}")
            continue
        except Exception as e:
            print(f"Error processing neighborhood {neighborhood.get('name', 'Unknown')}: {e}")
            continue
    
    # Sort by match score (highest first) and return top 3
    matches.sort(key=lambda x: x['matchScore'], reverse=True)
    return matches[:3]

def get_match_quality_label(score):
    """Convert match score to quality label"""
    if score >= 80:
        return "Excellent Match"
    elif score >= 60:
        return "Good Match"
    elif score >= 40:
        return "Fair Match"
    else:
        return "Poor Match"