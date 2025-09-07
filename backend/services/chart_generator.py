import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
import io
import base64
from typing import Dict, List, Optional, Any, Literal
import json

class ChartGenerator:
    def __init__(self):
        try:
            plt.style.use('default')
            sns.set_palette("husl")
            # Set matplotlib to non-interactive backend
            plt.switch_backend('Agg')
        except Exception:
            pass  # Fallback if style setting fails
    
    def _fig_to_base64(self, fig) -> str:
        """Convert matplotlib figure to base64 string"""
        try:
            buffer = io.BytesIO()
            fig.savefig(buffer, format='png', dpi=150, bbox_inches='tight', facecolor='white')
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.getvalue()).decode()
            buffer.close()
            plt.close(fig)
            return f"data:image/png;base64,{image_base64}"
        except Exception as e:
            plt.close(fig)
            raise Exception(f"Failed to convert chart to image: {str(e)}")
    
    def generate_bar_chart(self, df: pd.DataFrame, x_col: str, y_col: str, 
                          orientation: str = "vertical", title: str = "") -> str:
        """Generate bar chart"""
        try:
            fig, ax = plt.subplots(figsize=(10, 6))
            
            # Handle categorical x-axis by aggregating
            if df[x_col].dtype == 'object' or df[x_col].nunique() < len(df) * 0.5:
                grouped = df.groupby(x_col)[y_col].mean().reset_index()
                x_data, y_data = grouped[x_col], grouped[y_col]
            else:
                x_data, y_data = df[x_col], df[y_col]
            
            if orientation == "horizontal":
                ax.barh(x_data, y_data)
                ax.set_xlabel(y_col)
                ax.set_ylabel(x_col)
            else:
                ax.bar(x_data, y_data)
                ax.set_xlabel(x_col)
                ax.set_ylabel(y_col)
            
            ax.set_title(title or f"{y_col} by {x_col}")
            plt.xticks(rotation=45)
            plt.tight_layout()
            return self._fig_to_base64(fig)
        except Exception as e:
            plt.close('all')
            raise Exception(f"Bar chart generation failed: {str(e)}")
    
    def generate_scatter_plot(self, df: pd.DataFrame, x_col: str, y_col: str,
                            color_col: Optional[str] = None, title: str = "") -> str:
        """Generate scatter plot"""
        try:
            fig, ax = plt.subplots(figsize=(10, 6))
            
            # Remove NaN values
            clean_df = df[[x_col, y_col]].dropna()
            if color_col and color_col in df.columns:
                clean_df = df[[x_col, y_col, color_col]].dropna()
            
            if clean_df.empty:
                raise Exception("No valid data points after removing NaN values")
            
            if color_col and color_col in df.columns:
                scatter = ax.scatter(clean_df[x_col], clean_df[y_col], c=clean_df[color_col], alpha=0.6)
                plt.colorbar(scatter, label=color_col)
            else:
                ax.scatter(clean_df[x_col], clean_df[y_col], alpha=0.6)
            
            ax.set_xlabel(x_col)
            ax.set_ylabel(y_col)
            ax.set_title(title or f"{y_col} vs {x_col}")
            plt.tight_layout()
            return self._fig_to_base64(fig)
        except Exception as e:
            plt.close('all')
            raise Exception(f"Scatter plot generation failed: {str(e)}")
    
    def generate_line_chart(self, df: pd.DataFrame, x_col: str, y_col: str, title: str = "") -> str:
        """Generate line chart"""
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.plot(df[x_col], df[y_col], marker='o')
        ax.set_xlabel(x_col)
        ax.set_ylabel(y_col)
        ax.set_title(title or f"{y_col} over {x_col}")
        plt.xticks(rotation=45)
        return self._fig_to_base64(fig)
    
    def generate_histogram(self, df: pd.DataFrame, col: str, bins: int = 30, title: str = "") -> str:
        """Generate histogram"""
        try:
            fig, ax = plt.subplots(figsize=(10, 6))
            data = df[col].dropna()
            
            if data.empty:
                raise Exception(f"No valid data in column '{col}'")
            
            # Ensure numeric data for histogram
            if not pd.api.types.is_numeric_dtype(data):
                raise Exception(f"Column '{col}' must be numeric for histogram")
            
            ax.hist(data, bins=bins, alpha=0.7, edgecolor='black')
            ax.set_xlabel(col)
            ax.set_ylabel('Frequency')
            ax.set_title(title or f"Distribution of {col}")
            plt.tight_layout()
            return self._fig_to_base64(fig)
        except Exception as e:
            plt.close('all')
            raise Exception(f"Histogram generation failed: {str(e)}")
    
    def generate_pie_chart(self, df: pd.DataFrame, col: str, title: str = "") -> str:
        """Generate pie chart"""
        fig, ax = plt.subplots(figsize=(8, 8))
        value_counts = df[col].value_counts()
        ax.pie(value_counts.values, labels=value_counts.index, autopct='%1.1f%%')
        ax.set_title(title or f"Distribution of {col}")
        return self._fig_to_base64(fig)
    
    def generate_box_plot(self, df: pd.DataFrame, col: str, group_col: Optional[str] = None, title: str = "") -> str:
        """Generate box plot"""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        if group_col and group_col in df.columns:
            df.boxplot(column=col, by=group_col, ax=ax)
            ax.set_title(title or f"{col} by {group_col}")
        else:
            ax.boxplot(df[col].dropna())
            ax.set_title(title or f"Box Plot of {col}")
            ax.set_xlabel(col)
        
        return self._fig_to_base64(fig)
    
    def generate_heatmap(self, df: pd.DataFrame, title: str = "") -> str:
        """Generate correlation heatmap"""
        fig, ax = plt.subplots(figsize=(10, 8))
        numeric_df = df.select_dtypes(include=[np.number])
        
        if numeric_df.empty:
            ax.text(0.5, 0.5, 'No numeric columns for correlation', 
                   ha='center', va='center', transform=ax.transAxes)
        else:
            corr = numeric_df.corr()
            sns.heatmap(corr, annot=True, cmap='coolwarm', center=0, ax=ax)
        
        ax.set_title(title or "Correlation Heatmap")
        return self._fig_to_base64(fig)

# Global instance
chart_generator = ChartGenerator()