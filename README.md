# DataViz Pro - Full-Stack Data Visualization & ML Platform

A comprehensive data science platform for data visualization, machine learning, and analytics with intelligent recommendations and session management.

## 🚀 Features

### 📊 **Data Management**
- **File Upload** - CSV, XLSX support with drag-and-drop
- **Data Cleaning** - Remove duplicates, handle missing values, type conversion
- **Data Preview** - Interactive table with pagination
- **Session Management** - Save and restore work sessions

### 📈 **Visualization Engine**
- **7 Chart Types** - Bar, Scatter, Line, Histogram, Pie, Box, Heatmap
- **Interactive Configuration** - Dynamic column selection
- **Smart Recommendations** - AI-powered chart suggestions
- **Export Ready** - High-quality chart generation

### 🤖 **Machine Learning**
- **Supervised Learning** - 5 algorithms (Linear, Random Forest, SVM, KNN, Decision Tree)
- **Unsupervised Learning** - K-Means, DBSCAN clustering
- **Dimensionality Reduction** - PCA analysis
- **Model Explanations** - Plain-language insights

### 📋 **Comprehensive Reports**
- **Data Summary** - Statistics and overview
- **Data Quality** - Issues and recommendations
- **Statistical Analysis** - Correlations and distributions
- **Visualization Recommendations** - Smart chart suggestions

### 🎨 **Professional UI**
- **Dark/Light Mode** - System preference support
- **6 Color Palettes** - Customizable themes
- **Responsive Design** - Works on all devices
- **Modern Interface** - Professional gradient design

## 🏗️ Architecture

```
gui_data_vis/
├── frontend/          # Next.js 14 React application
├── backend/           # FastAPI Python server
├── README.md         # This file
└── .gitignore        # Git ignore rules
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.8+ and pip
- **Git**

### Installation

1. **Clone Repository**
```bash
git clone <repository-url>
cd gui_data_vis
```

2. **Setup Backend**
```bash
cd backend
pip install -r requirements.txt
python main.py
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

4. **Access Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📱 Usage

### 1. **Upload Data**
- Go to Data Management
- Upload CSV/XLSX files
- Preview and clean data

### 2. **Create Visualizations**
- Navigate to Visualizations
- Use smart recommendations
- Generate interactive charts

### 3. **Train ML Models**
- Go to Machine Learning
- Select features and targets
- Train and evaluate models

### 4. **Generate Reports**
- Access Reports section
- Choose report type
- Export results

### 5. **Save Sessions**
- Save work for later
- Manage multiple projects
- Generate reports anytime

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **TanStack Query** - Data fetching
- **Radix UI** - Component library

### **Backend**
- **FastAPI** - Python web framework
- **SQLAlchemy** - Database ORM
- **Pandas** - Data manipulation
- **Scikit-learn** - Machine learning
- **Matplotlib/Seaborn** - Visualization

### **Database**
- **SQLite** - Session storage
- **In-memory** - Data processing

## 📊 API Endpoints

### **Data Management**
- `POST /api/data/upload` - Upload files
- `POST /api/data/clean` - Clean data
- `GET /api/data/info/{session_id}` - Get data info

### **Visualization**
- `POST /api/charts/generate` - Generate charts

### **Machine Learning**
- `POST /api/ml/train` - Train models
- `POST /api/ml/cluster` - Clustering
- `POST /api/ml/pca` - PCA analysis

### **Reports**
- `POST /api/reports/generate` - Generate reports

### **Sessions**
- `GET /api/sessions` - List sessions
- `POST /api/sessions/save` - Save session
- `DELETE /api/sessions/{id}` - Delete session

### **Recommendations**
- `GET /api/recommendations/ml/{session_id}` - ML suggestions
- `GET /api/recommendations/visualization/{session_id}` - Chart suggestions

## 🔧 Configuration

### **Environment Variables**
```bash
# Backend
DATABASE_URL=sqlite:///sessions.db
CORS_ORIGINS=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📝 Development

### **Backend Development**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### **Frontend Development**
```bash
cd frontend
npm install
npm run dev
```

### **Database Migration**
```bash
# Database auto-creates on first run
# No manual migration needed
```

## 🧪 Testing

### **Backend Tests**
```bash
cd backend
pytest
```

### **Frontend Tests**
```bash
cd frontend
npm test
```

## 📦 Deployment

### **Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### **Manual Deployment**
1. Build frontend: `npm run build`
2. Setup Python environment
3. Configure environment variables
4. Run with production server

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Check README files in each directory
- **Issues**: Create GitHub issues
- **API Docs**: Visit `/docs` endpoint

## 🎯 Roadmap

- [ ] Real-time collaboration
- [ ] Advanced ML algorithms
- [ ] Custom visualization types
- [ ] Data source connectors
- [ ] Automated insights
- [ ] Export to various formats

---

**DataViz Pro** - Making data science accessible and powerful! 🚀