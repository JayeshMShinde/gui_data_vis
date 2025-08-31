from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal
from services.data_processing import data_processor
from services.chart_generator import chart_generator

router = APIRouter()

class ChartRequest(BaseModel):
    session_id: str
    chart_type: Literal["bar", "scatter", "line", "histogram", "pie", "box", "heatmap"]
    x_column: Optional[str] = None
    y_column: Optional[str] = None
    color_column: Optional[str] = None
    group_column: Optional[str] = None
    orientation: Optional[str] = "vertical"
    bins: Optional[int] = 30
    title: Optional[str] = ""

@router.post("/generate")
async def generate_chart(request: ChartRequest):
    try:
        df = data_processor.get_dataframe(request.session_id)
        if df is None:
            raise HTTPException(status_code=404, detail="Session not found")
        
        if request.chart_type == "bar":
            if not request.x_column or not request.y_column:
                raise HTTPException(status_code=400, detail="Bar chart requires x_column and y_column")
            chart_data = chart_generator.generate_bar_chart(
                df, request.x_column, request.y_column, request.orientation, request.title
            )
        
        elif request.chart_type == "scatter":
            if not request.x_column or not request.y_column:
                raise HTTPException(status_code=400, detail="Scatter plot requires x_column and y_column")
            chart_data = chart_generator.generate_scatter_plot(
                df, request.x_column, request.y_column, request.color_column, request.title
            )
        
        elif request.chart_type == "line":
            if not request.x_column or not request.y_column:
                raise HTTPException(status_code=400, detail="Line chart requires x_column and y_column")
            chart_data = chart_generator.generate_line_chart(
                df, request.x_column, request.y_column, request.title
            )
        
        elif request.chart_type == "histogram":
            if not request.x_column:
                raise HTTPException(status_code=400, detail="Histogram requires x_column")
            chart_data = chart_generator.generate_histogram(
                df, request.x_column, request.bins or 30, request.title
            )
        
        elif request.chart_type == "pie":
            if not request.x_column:
                raise HTTPException(status_code=400, detail="Pie chart requires x_column")
            chart_data = chart_generator.generate_pie_chart(
                df, request.x_column, request.title
            )
        
        elif request.chart_type == "box":
            if not request.x_column:
                raise HTTPException(status_code=400, detail="Box plot requires x_column")
            chart_data = chart_generator.generate_box_plot(
                df, request.x_column, request.group_column, request.title
            )
        
        elif request.chart_type == "heatmap":
            chart_data = chart_generator.generate_heatmap(df, request.title)
        
        else:
            raise HTTPException(status_code=400, detail="Unsupported chart type")
        
        return {
            "chart_data": chart_data,
            "chart_type": request.chart_type,
            "title": request.title
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))