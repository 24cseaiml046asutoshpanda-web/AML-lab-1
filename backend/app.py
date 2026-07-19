from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator, model_validator
from typing import List, Dict, Any
import numpy as np

app = FastAPI(title="Linear Regression API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RegressionRequest(BaseModel):
    x: List[float]
    y: List[float]

    @field_validator('x', 'y')
    @classmethod
    def check_non_empty(cls, v: List[float], info) -> List[float]:
        if not v:
            raise ValueError(f"The list for '{info.field_name}' cannot be empty.")
        return v

class MultiLinearRegressionRequest(BaseModel):
    x: List[List[float]]
    y: List[float]

    @field_validator('x')
    @classmethod
    def check_x(cls, v: List[List[float]]) -> List[List[float]]:
        if not v:
            raise ValueError("The list for 'x' cannot be empty.")
        for i, row in enumerate(v):
            if not row:
                raise ValueError(f"Row {i} in 'x' cannot be empty.")
        first_len = len(v[0])
        for i, row in enumerate(v):
            if len(row) != first_len:
                raise ValueError("All rows in 'x' must have the same number of features.")
        return v

    @field_validator('y')
    @classmethod
    def check_y(cls, v: List[float]) -> List[float]:
        if not v:
            raise ValueError("The list for 'y' cannot be empty.")
        return v

    @model_validator(mode='after')
    def check_lengths_match(self) -> 'MultiLinearRegressionRequest':
        if len(self.x) != len(self.y):
            raise ValueError(f"X and Y must be of equal length. Got X length: {len(self.x)}, Y length: {len(self.y)}.")
        return self


@app.post("/api/linear-regression")
async def calculate_regression(request: RegressionRequest):
    x = request.x
    y = request.y

    if len(x) != len(y):
        raise HTTPException(
            status_code=400,
            detail=f"X and Y must be of equal length. Got X length: {len(x)}, Y length: {len(y)}."
        )

    if len(x) < 2:
        raise HTTPException(
            status_code=400,
            detail="At least 2 data points are required to fit a linear regression model."
        )

    try:
        x_arr = np.array(x, dtype=float)
        y_arr = np.array(y, dtype=float)
    except (ValueError, TypeError) as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid data points. X and Y must contain numeric values only. Error: {str(e)}"
        )

    if np.all(x_arr == x_arr[0]):
        raise HTTPException(
            status_code=400,
            detail="X values must contain at least two distinct numbers. Fitting a line to identical X values results in a vertical line with undefined slope."
        )

    try:
        slope, intercept = np.polyfit(x_arr, y_arr, 1)
        slope = float(slope)
        intercept = float(intercept)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fitting the regression model: {str(e)}"
        )

    pred_arr = slope * x_arr + intercept
    predictions = pred_arr.tolist()

    mae = float(np.mean(np.abs(y_arr - pred_arr)))
    
    mse = float(np.mean((y_arr - pred_arr) ** 2))
    
    rmse = float(np.sqrt(mse))
    
    y_mean = np.mean(y_arr)
    ss_tot = np.sum((y_arr - y_mean) ** 2)
    ss_res = np.sum((y_arr - pred_arr) ** 2)
    r2 = float(1.0 - (ss_res / ss_tot) if ss_tot != 0 else 1.0)

    return {
        "slope": slope,
        "intercept": intercept,
        "predictions": predictions,
        "metrics": {
            "mae": mae,
            "mse": mse,
            "rmse": rmse,
            "r2": r2
        }
    }

@app.post("/api/multi-linear-regression")
async def calculate_multi_regression(request: MultiLinearRegressionRequest):
    x = request.x
    y = request.y

    try:
        x_arr = np.array(x, dtype=float)
        y_arr = np.array(y, dtype=float)
    except (ValueError, TypeError) as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid data points. X and Y must contain numeric values only. Error: {str(e)}"
        )

    n_samples, n_features = x_arr.shape

    if n_samples < n_features + 1:
        raise HTTPException(
            status_code=400,
            detail=f"At least {n_features + 1} data points (samples) are required to fit a multi-linear regression model with {n_features} features."
        )

    try:
        # Add a column of ones to handle intercept: y = X*beta + c
        X_design = np.column_stack((np.ones(n_samples), x_arr))
        
        # Solve OLS: X_design * beta = y_arr
        beta, residuals, rank, s = np.linalg.lstsq(X_design, y_arr, rcond=None)
        
        intercept = float(beta[0])
        coefficients = beta[1:].tolist()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fitting the multi-linear regression model: {str(e)}"
        )

    pred_arr = np.dot(X_design, beta)
    predictions = pred_arr.tolist()

    mae = float(np.mean(np.abs(y_arr - pred_arr)))
    mse = float(np.mean((y_arr - pred_arr) ** 2))
    rmse = float(np.sqrt(mse))

    y_mean = np.mean(y_arr)
    ss_tot = np.sum((y_arr - y_mean) ** 2)
    ss_res = np.sum((y_arr - pred_arr) ** 2)
    r2 = float(1.0 - (ss_res / ss_tot) if ss_tot != 0 else 1.0)

    return {
        "coefficients": coefficients,
        "intercept": intercept,
        "predictions": predictions,
        "metrics": {
            "mae": mae,
            "mse": mse,
            "rmse": rmse,
            "r2": r2
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
