import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional
from services.data_processing import data_processor

class RecommendationService:
    def __init__(self):
        pass
    
    def get_ml_recommendations(self, session_id: str) -> Dict[str, Any]:
        """Generate ML column recommendations"""
        df = data_processor.get_dataframe(session_id)
        if df is None:
            raise ValueError("Session not found")
        
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
        
        recommendations = {
            'target_recommendations': [],
            'feature_recommendations': [],
            'model_suggestions': []
        }
        
        # Target column recommendations
        for col in numeric_cols:
            unique_ratio = df[col].nunique() / len(df)
            missing_ratio = df[col].isnull().sum() / len(df)
            
            if unique_ratio < 0.1 and df[col].nunique() <= 10:  # Classification target
                recommendations['target_recommendations'].append({
                    'column': col,
                    'type': 'classification',
                    'reason': f'Low unique values ({df[col].nunique()}) suitable for classification',
                    'score': 0.9 - missing_ratio
                })
            elif unique_ratio > 0.5:  # Regression target
                recommendations['target_recommendations'].append({
                    'column': col,
                    'type': 'regression',
                    'reason': f'Continuous values suitable for regression',
                    'score': 0.8 - missing_ratio
                })
        
        for col in categorical_cols:
            if df[col].nunique() <= 20:  # Classification target
                recommendations['target_recommendations'].append({
                    'column': col,
                    'type': 'classification',
                    'reason': f'Categorical with {df[col].nunique()} classes',
                    'score': 0.85 - (df[col].isnull().sum() / len(df))
                })
        
        # Feature recommendations
        for col in numeric_cols + categorical_cols:
            missing_ratio = df[col].isnull().sum() / len(df)
            if missing_ratio < 0.3:  # Less than 30% missing
                score = 1.0 - missing_ratio
                if col in numeric_cols:
                    variance = df[col].var() if df[col].var() is not None else 0
                    if variance > 0:  # Has variance
                        score += 0.2
                recommendations['feature_recommendations'].append({
                    'column': col,
                    'reason': f'Good data quality ({(1-missing_ratio)*100:.1f}% complete)',
                    'score': score
                })
        
        # Model suggestions based on data characteristics
        if len(numeric_cols) > 5:
            recommendations['model_suggestions'].append({
                'model': 'random_forest',
                'reason': 'Good for mixed data types with many numeric features'
            })
        
        if len(df) > 1000:
            recommendations['model_suggestions'].append({
                'model': 'svm',
                'reason': 'Suitable for larger datasets'
            })
        
        if len(categorical_cols) > len(numeric_cols):
            recommendations['model_suggestions'].append({
                'model': 'decision_tree',
                'reason': 'Handles categorical features well'
            })
        
        # Sort by score
        recommendations['target_recommendations'].sort(key=lambda x: x['score'], reverse=True)
        recommendations['feature_recommendations'].sort(key=lambda x: x['score'], reverse=True)
        
        return recommendations
    
    def get_visualization_recommendations(self, session_id: str) -> Dict[str, Any]:
        """Generate visualization column recommendations"""
        df = data_processor.get_dataframe(session_id)
        if df is None:
            raise ValueError("Session not found")
        
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
        
        recommendations = {
            'x_axis_recommendations': [],
            'y_axis_recommendations': [],
            'color_recommendations': [],
            'chart_combinations': []
        }
        
        # X-axis recommendations (good for grouping/categories)
        for col in categorical_cols:
            unique_count = df[col].nunique()
            if unique_count <= 15:  # Not too many categories
                recommendations['x_axis_recommendations'].append({
                    'column': col,
                    'reason': f'Categorical with {unique_count} distinct values - good for grouping',
                    'score': 1.0 - (unique_count / 20)  # Prefer fewer categories
                })
        
        for col in numeric_cols:
            unique_count = df[col].nunique()
            if unique_count <= 10:  # Discrete numeric
                recommendations['x_axis_recommendations'].append({
                    'column': col,
                    'reason': f'Discrete numeric values - good for categories',
                    'score': 0.8
                })
        
        # Y-axis recommendations (numeric values for measurement)
        for col in numeric_cols:
            missing_ratio = df[col].isnull().sum() / len(df)
            variance = df[col].var() if df[col].var() is not None else 0
            
            if variance > 0 and missing_ratio < 0.2:
                recommendations['y_axis_recommendations'].append({
                    'column': col,
                    'reason': f'Numeric with good variance - suitable for measurement',
                    'score': 1.0 - missing_ratio + (0.2 if variance > df[col].mean() else 0)
                })
        
        # Color recommendations (for additional grouping)
        for col in categorical_cols:
            unique_count = df[col].nunique()
            if 2 <= unique_count <= 8:  # Good range for color coding
                recommendations['color_recommendations'].append({
                    'column': col,
                    'reason': f'{unique_count} categories - perfect for color coding',
                    'score': 1.0 - abs(unique_count - 4) / 4  # Prefer ~4 categories
                })
        
        # Chart combination recommendations
        if len(categorical_cols) > 0 and len(numeric_cols) > 0:
            best_cat = min(categorical_cols, key=lambda x: df[x].nunique()) if categorical_cols else None
            best_num = max(numeric_cols, key=lambda x: df[x].var() if df[x].var() is not None else 0) if numeric_cols else None
            
            if best_cat and best_num:
                recommendations['chart_combinations'].append({
                    'chart_type': 'bar',
                    'x_column': best_cat,
                    'y_column': best_num,
                    'reason': f'Compare {best_num} across {best_cat} categories'
                })
        
        if len(numeric_cols) >= 2:
            # Find best correlation pair
            corr_pairs = []
            for i, col1 in enumerate(numeric_cols):
                for col2 in numeric_cols[i+1:]:
                    try:
                        corr = df[col1].corr(df[col2])
                        if not np.isnan(corr):
                            corr_pairs.append((col1, col2, abs(corr)))
                    except:
                        continue
            
            if corr_pairs:
                corr_pairs.sort(key=lambda x: x[2], reverse=True)
                best_pair = corr_pairs[0]
                recommendations['chart_combinations'].append({
                    'chart_type': 'scatter',
                    'x_column': best_pair[0],
                    'y_column': best_pair[1],
                    'reason': f'Strong correlation ({best_pair[2]:.2f}) between variables'
                })
        
        # Sort recommendations
        for key in ['x_axis_recommendations', 'y_axis_recommendations', 'color_recommendations']:
            recommendations[key].sort(key=lambda x: x['score'], reverse=True)
        
        return recommendations

# Global instance
recommendation_service = RecommendationService()