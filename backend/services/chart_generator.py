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
    
    def generate_bar_chart(self, df: pd.DataFrame, x_col: str, y_col: str, 
                          orientation: str = "vertical", title: str = "") -> str:
        """Generate bar chart"""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        if orientation == "horizontal":
            ax.barh(df[x_col], df[y_col])
            ax.set_xlabel(y_col)
            ax.set_ylabel(x_col)
        else:
            ax.bar(df[x_col], df[y_col])
            ax.set_xlabel(x_col)
            ax.set_ylabel(y_col)
        
        ax.set_title(title or f"{y_col} by {x_col}")
        plt.xticks(rotation=45)
        return self._fig_to_base64(fig)
    
    def generate_scatter_plot(self, df: pd.DataFrame, x_col: str, y_col: str,
                            color_col: Optional[str] = None, title: str = "") -> str:
        """Generate scatter plot"""
        fig, ax = plt.subplots(figsize=(10, 6))
        
        if color_col and color_col in df.columns:
            scatter = ax.scatter(df[x_col], df[y_col], c=df[color_col], alpha=0.6)
            plt.colorbar(scatter, label=color_col)
        else:
            ax.scatter(df[x_col], df[y_col], alpha=0.6)
        
        ax.set_xlabel(x_col)
        ax.set_ylabel(y_col)
        ax.set_title(title or f"{y_col} vs {x_col}")
        return self._fig_to_base64(fig)
    
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
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.hist(df[col].dropna(), bins=bins, alpha=0.7, edgecolor='black')
        ax.set_xlabel(col)
        ax.set_ylabel('Frequency')
        ax.set_title(title or f"Distribution of {col}")
        return self._fig_to_base64(fig)
    
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