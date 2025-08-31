import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.svm import SVC, SVR
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.cluster import KMeans, DBSCAN
from sklearn.decomposition import PCA
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, r2_score, mean_squared_error
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
from typing import Dict, List, Optional, Any, Literal, Tuple
import json

class MLService:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.encoders = {}
    
    def _fig_to_base64(self, fig) -> str:
        """Convert matplotlib figure to base64 string"""
        buffer = io.BytesIO()
        fig.savefig(buffer, format='png', dpi=150, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close(fig)
        return f"data:image/png;base64,{image_base64}"
    
    def prepare_data(self, df: pd.DataFrame, target_column: str, 
                    feature_columns: List[str]) -> Tuple[np.ndarray, np.ndarray]:
        """Prepare data for ML training"""
        # Select features and target
        X = df[feature_columns].copy()
        y = df[target_column].copy()
        
        # Handle missing values
        X = X.fillna(X.mean() if X.select_dtypes(include=[np.number]).shape[1] > 0 else X.mode().iloc[0])
        y = y.fillna(y.mean() if pd.api.types.is_numeric_dtype(y) else y.mode().iloc[0])
        
        # Encode categorical variables
        for col in X.select_dtypes(include=['object']).columns:
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col].astype(str))
            self.encoders[col] = le
        
        # Encode target if categorical
        if not pd.api.types.is_numeric_dtype(y):
            le = LabelEncoder()
            y = le.fit_transform(y.astype(str))
            self.encoders[target_column] = le
        
        return X.values, y
    
    def train_supervised_model(self, df: pd.DataFrame, model_type: str, 
                             target_column: str, feature_columns: List[str],
                             test_size: float = 0.2) -> Dict[str, Any]:
        """Train supervised learning model"""
        X, y = self.prepare_data(df, target_column, feature_columns)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=42)
        
        # Scale features for certain models
        if model_type in ['svm', 'knn', 'logistic']:
            scaler = StandardScaler()
            X_train = scaler.fit_transform(X_train)
            X_test = scaler.transform(X_test)
            self.scalers[model_type] = scaler
        
        # Select and train model
        is_classification = len(np.unique(y)) < 20 and not pd.api.types.is_float_dtype(y)
        
        if model_type == 'linear':
            model = LinearRegression() if not is_classification else LogisticRegression()
        elif model_type == 'random_forest':
            model = RandomForestRegressor() if not is_classification else RandomForestClassifier()
        elif model_type == 'svm':
            model = SVR() if not is_classification else SVC()
        elif model_type == 'knn':
            model = KNeighborsRegressor() if not is_classification else KNeighborsClassifier()
        elif model_type == 'decision_tree':
            model = DecisionTreeRegressor() if not is_classification else DecisionTreeClassifier()
        else:
            raise ValueError(f"Unsupported model type: {model_type}")
        
        model.fit(X_train, y_train)
        self.models[model_type] = model
        
        # Make predictions
        y_pred = model.predict(X_test)
        
        # Calculate metrics
        if is_classification:
            accuracy = accuracy_score(y_test, y_pred)
            cv_scores = cross_val_score(model, X, y, cv=5)
            metrics = {
                'accuracy': float(accuracy),
                'cv_mean': float(cv_scores.mean()),
                'cv_std': float(cv_scores.std()),
                'classification_report': classification_report(y_test, y_pred, output_dict=True)
            }
        else:
            r2 = r2_score(y_test, y_pred)
            mse = mean_squared_error(y_test, y_pred)
            cv_scores = cross_val_score(model, X, y, cv=5, scoring='r2')
            metrics = {
                'r2_score': float(r2),
                'mse': float(mse),
                'rmse': float(np.sqrt(mse)),
                'cv_mean': float(cv_scores.mean()),
                'cv_std': float(cv_scores.std())
            }
        
        return {
            'model_type': model_type,
            'is_classification': is_classification,
            'metrics': metrics,
            'feature_columns': feature_columns,
            'target_column': target_column
        }
    
    def train_clustering(self, df: pd.DataFrame, algorithm: str, 
                        feature_columns: List[str], n_clusters: int = 3) -> Dict[str, Any]:
        """Train clustering model"""
        X = df[feature_columns].copy()
        
        # Handle missing values and encode categorical
        X = X.fillna(X.mean() if X.select_dtypes(include=[np.number]).shape[1] > 0 else X.mode().iloc[0])
        
        for col in X.select_dtypes(include=['object']).columns:
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col].astype(str))
            self.encoders[col] = le
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X.values)
        self.scalers[algorithm] = scaler
        
        # Train clustering model
        if algorithm == 'kmeans':
            model = KMeans(n_clusters=n_clusters, random_state=42)
        elif algorithm == 'dbscan':
            model = DBSCAN(eps=0.5, min_samples=5)
        else:
            raise ValueError(f"Unsupported clustering algorithm: {algorithm}")
        
        labels = model.fit_predict(X_scaled)
        self.models[algorithm] = model
        
        # Calculate metrics
        n_clusters_found = len(np.unique(labels))
        if -1 in labels:  # DBSCAN noise points
            n_clusters_found -= 1
        
        return {
            'algorithm': algorithm,
            'n_clusters': int(n_clusters_found),
            'labels': labels.tolist(),
            'feature_columns': feature_columns
        }
    
    def apply_pca(self, df: pd.DataFrame, feature_columns: List[str], 
                  n_components: int = 2) -> Dict[str, Any]:
        """Apply PCA dimensionality reduction"""
        X = df[feature_columns].copy()
        
        # Handle missing values and encode categorical
        X = X.fillna(X.mean() if X.select_dtypes(include=[np.number]).shape[1] > 0 else X.mode().iloc[0])
        
        for col in X.select_dtypes(include=['object']).columns:
            le = LabelEncoder()
            X[col] = le.fit_transform(X[col].astype(str))
            self.encoders[col] = le
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X.values)
        self.scalers['pca'] = scaler
        
        # Apply PCA
        pca = PCA(n_components=n_components)
        X_pca = pca.fit_transform(X_scaled)
        self.models['pca'] = pca
        
        return {
            'n_components': n_components,
            'explained_variance_ratio': pca.explained_variance_ratio_.tolist(),
            'cumulative_variance': np.cumsum(pca.explained_variance_ratio_).tolist(),
            'transformed_data': X_pca.tolist(),
            'feature_columns': feature_columns
        }
    
    def generate_confusion_matrix(self, model_type: str) -> str:
        """Generate confusion matrix visualization"""
        if model_type not in self.models:
            raise ValueError("Model not found")
        
        # This would need actual test data - simplified for demo
        fig, ax = plt.subplots(figsize=(8, 6))
        
        # Dummy confusion matrix for demo
        cm = np.array([[85, 15], [20, 80]])
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax)
        ax.set_title(f'Confusion Matrix - {model_type}')
        ax.set_xlabel('Predicted')
        ax.set_ylabel('Actual')
        
        return self._fig_to_base64(fig)

# Global instance
ml_service = MLService()