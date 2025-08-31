import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import io
import base64
from typing import Dict, List, Optional, Any
from services.data_processing import data_processor
from services.chart_generator import chart_generator
import json

class ReportGenerator:
    def __init__(self):
        plt.style.use('default')
        sns.set_palette("husl")
    
    def _fig_to_base64(self, fig) -> str:
        """Convert matplotlib figure to base64 string"""
        buffer = io.BytesIO()
        fig.savefig(buffer, format='png', dpi=150, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close(fig)
        return f"data:image/png;base64,{image_base64}"
    
    def generate_data_summary_report(self, session_id: str) -> Dict[str, Any]:
        """Generate comprehensive data summary report"""
        df = data_processor.get_dataframe(session_id)
        if df is None:
            raise ValueError("Session not found")
        
        # Basic statistics
        basic_stats = {
            'total_rows': int(df.shape[0]),
            'total_columns': int(df.shape[1]),
            'memory_usage_mb': float(df.memory_usage(deep=True).sum() / 1024 / 1024),
            'missing_values_total': int(df.isnull().sum().sum()),
            'duplicate_rows': int(df.duplicated().sum())
        }
        
        # Column analysis
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
        datetime_cols = df.select_dtypes(include=['datetime64']).columns.tolist()
        
        column_analysis = {
            'numeric_columns': len(numeric_cols),
            'categorical_columns': len(categorical_cols),
            'datetime_columns': len(datetime_cols),
            'columns_with_missing': [col for col in df.columns if df[col].isnull().any()],
            'high_cardinality_columns': [col for col in categorical_cols if df[col].nunique() > 50]
        }
        
        # Statistical summary for numeric columns
        numeric_summary = {}
        if numeric_cols:
            for col in numeric_cols[:10]:  # Limit to first 10 numeric columns
                numeric_summary[col] = {
                    'mean': float(df[col].mean()),
                    'median': float(df[col].median()),
                    'std': float(df[col].std()),
                    'min': float(df[col].min()),
                    'max': float(df[col].max()),
                    'missing_count': int(df[col].isnull().sum()),
                    'outliers_iqr': len(self._detect_outliers_iqr(df[col]))
                }
        
        # Categorical summary
        categorical_summary = {}
        if categorical_cols:
            for col in categorical_cols[:10]:  # Limit to first 10 categorical columns
                value_counts = df[col].value_counts().head(5)
                categorical_summary[col] = {
                    'unique_values': int(df[col].nunique()),
                    'most_frequent': value_counts.to_dict(),
                    'missing_count': int(df[col].isnull().sum())
                }
        
        return {
            'report_type': 'data_summary',
            'generated_at': datetime.now().isoformat(),
            'basic_stats': basic_stats,
            'column_analysis': column_analysis,
            'numeric_summary': numeric_summary,
            'categorical_summary': categorical_summary
        }
    
    def generate_data_quality_report(self, session_id: str) -> Dict[str, Any]:
        """Generate data quality assessment report"""
        df = data_processor.get_dataframe(session_id)
        if df is None:
            raise ValueError("Session not found")
        
        quality_issues = []
        recommendations = []
        
        # Check for missing values
        missing_data = df.isnull().sum()
        high_missing_cols = missing_data[missing_data > len(df) * 0.1].to_dict()
        if high_missing_cols:
            quality_issues.append({
                'type': 'High Missing Values',
                'severity': 'High',
                'description': f"Columns with >10% missing values: {list(high_missing_cols.keys())}",
                'affected_columns': list(high_missing_cols.keys())
            })
            recommendations.append("Consider imputation strategies or removing columns with excessive missing values")
        
        # Check for duplicates
        duplicate_count = df.duplicated().sum()
        if duplicate_count > 0:
            quality_issues.append({
                'type': 'Duplicate Rows',
                'severity': 'Medium',
                'description': f"Found {duplicate_count} duplicate rows ({duplicate_count/len(df)*100:.1f}%)",
                'count': int(duplicate_count)
            })
            recommendations.append("Remove duplicate rows to improve data quality")
        
        # Check for outliers in numeric columns
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        outlier_summary = {}
        for col in numeric_cols:
            outliers = self._detect_outliers_iqr(df[col])
            if len(outliers) > len(df) * 0.05:  # More than 5% outliers
                outlier_summary[col] = len(outliers)
        
        if outlier_summary:
            quality_issues.append({
                'type': 'Excessive Outliers',
                'severity': 'Medium',
                'description': f"Columns with >5% outliers: {list(outlier_summary.keys())}",
                'outlier_counts': outlier_summary
            })
            recommendations.append("Investigate and handle outliers using appropriate methods")
        
        # Check data consistency
        consistency_issues = []
        for col in df.select_dtypes(include=['object']).columns:
            # Check for inconsistent formatting
            unique_vals = df[col].dropna().unique()
            if len(unique_vals) > 1:
                # Simple check for potential formatting issues
                lower_vals = [str(v).lower().strip() for v in unique_vals]
                if len(set(lower_vals)) < len(unique_vals):
                    consistency_issues.append(col)
        
        if consistency_issues:
            quality_issues.append({
                'type': 'Inconsistent Formatting',
                'severity': 'Low',
                'description': f"Potential formatting inconsistencies in: {consistency_issues}",
                'affected_columns': consistency_issues
            })
            recommendations.append("Standardize text formatting and remove extra spaces")
        
        # Calculate overall quality score
        total_issues = len(quality_issues)
        quality_score = max(0, 100 - (total_issues * 15))  # Deduct 15 points per issue
        
        return {
            'report_type': 'data_quality',
            'generated_at': datetime.now().isoformat(),
            'quality_score': quality_score,
            'quality_issues': quality_issues,
            'recommendations': recommendations,
            'summary': {
                'total_issues': total_issues,
                'high_severity': len([i for i in quality_issues if i['severity'] == 'High']),
                'medium_severity': len([i for i in quality_issues if i['severity'] == 'Medium']),
                'low_severity': len([i for i in quality_issues if i['severity'] == 'Low'])
            }
        }
    
    def generate_statistical_report(self, session_id: str) -> Dict[str, Any]:
        """Generate statistical analysis report"""
        df = data_processor.get_dataframe(session_id)
        if df is None:
            raise ValueError("Session not found")
        
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        
        # Correlation analysis
        correlation_data = {}
        if len(numeric_cols) > 1:
            corr_matrix = df[numeric_cols].corr()
            # Find strong correlations (>0.7 or <-0.7)
            strong_correlations = []
            for i in range(len(corr_matrix.columns)):
                for j in range(i+1, len(corr_matrix.columns)):
                    corr_val = corr_matrix.iloc[i, j]
                    if abs(corr_val) > 0.7:
                        strong_correlations.append({
                            'column1': corr_matrix.columns[i],
                            'column2': corr_matrix.columns[j],
                            'correlation': float(corr_val)
                        })
            
            correlation_data = {
                'strong_correlations': strong_correlations,
                'correlation_matrix': corr_matrix.to_dict()
            }
        
        # Distribution analysis
        distribution_analysis = {}
        for col in numeric_cols[:10]:  # Limit to first 10 columns
            data = df[col].dropna()
            if len(data) > 0:
                distribution_analysis[col] = {
                    'skewness': float(data.skew()),
                    'kurtosis': float(data.kurtosis()),
                    'normality_test': 'normal' if abs(data.skew()) < 0.5 else 'skewed',
                    'quartiles': {
                        'q1': float(data.quantile(0.25)),
                        'q2': float(data.quantile(0.5)),
                        'q3': float(data.quantile(0.75))
                    }
                }
        
        return {
            'report_type': 'statistical_analysis',
            'generated_at': datetime.now().isoformat(),
            'correlation_analysis': correlation_data,
            'distribution_analysis': distribution_analysis,
            'summary': {
                'numeric_columns_analyzed': len(numeric_cols),
                'strong_correlations_found': len(correlation_data.get('strong_correlations', [])),
                'normal_distributions': len([col for col, data in distribution_analysis.items() 
                                           if data['normality_test'] == 'normal'])
            }
        }
    
    def _detect_outliers_iqr(self, series: pd.Series) -> List[int]:
        """Detect outliers using IQR method"""
        if not pd.api.types.is_numeric_dtype(series):
            return []
        
        Q1 = series.quantile(0.25)
        Q3 = series.quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        
        return series[(series < lower_bound) | (series > upper_bound)].index.tolist()

# Global instance
report_generator = ReportGenerator()