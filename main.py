import os
import base64
import io
from typing import List, Optional
import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import numpy as np
from ultralytics import YOLO

# Initialize FastAPI app
app = FastAPI(
    title="Litterly Waste Classification API",
    description="AI-powered waste classification using YOLOv8 segmentation",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "http://localhost:3001", 
        "http://127.0.0.1:3001", 
        "https://litterly.ai", 
        "http://litterly.ai",
        "https://litterly.vercel.app",
        "https://litterly.netlify.app",
        "https://*.vercel.app",
        "https://*.netlify.app",
        "https://*.ondigitalocean.app",
        "https://*.digitaloceanspaces.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API requests/responses
class TextInput(BaseModel):
    text: str

class PredictionResult(BaseModel):
    success: bool
    predictions: List[dict]
    message: str
    processing_time: Optional[float] = None

class ErrorResponse(BaseModel):
    success: bool
    error: str
    message: str

# Global model variable
model = None

def load_model():
    """Load the YOLOv8 model once when the server starts."""
    global model
    try:
        print("Loading YOLOv8 segmentation model...")
        model = YOLO("yolov8m-seg.pt")
        print("Model loaded successfully!")
        
        # Display model categories
        if hasattr(model, 'names'):
            print(f"Model can classify {len(model.names)} categories:")
            for class_id, class_name in model.names.items():
                print(f"  {class_id:2d}: {class_name}")
        
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

def classify_waste_image(image_path: str) -> dict:
    """Classify waste in an image using the YOLOv8 model."""
    try:
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")
        
        # Run prediction
        results = model.predict(image_path, conf=0.25, save=False)
        result = results[0]
        
        predictions = []
        
        if result.masks is not None:
            for i, (box, mask, conf, cls) in enumerate(zip(result.boxes.xyxy, result.masks.data, result.boxes.conf, result.boxes.cls)):
                class_id = int(cls.item())
                class_name = model.names[class_id] if hasattr(model, 'names') else f"class_{class_id}"
                confidence = conf.item()
                
                # Convert box coordinates to list
                box_coords = box.tolist()
                
                predictions.append({
                    "id": i + 1,
                    "class_name": class_name,
                    "class_id": class_id,
                    "confidence": round(confidence, 3),
                    "bbox": {
                        "x1": round(box_coords[0], 2),
                        "y1": round(box_coords[1], 2),
                        "x2": round(box_coords[2], 2),
                        "y2": round(box_coords[3], 2)
                    }
                })
        
        return {
            "success": True,
            "predictions": predictions,
            "total_detections": len(predictions),
            "message": f"Found {len(predictions)} waste objects"
        }
        
    except Exception as e:
        return {
            "success": False,
            "predictions": [],
            "error": str(e),
            "message": "Failed to classify image"
        }

def classify_waste_text(text: str) -> dict:
    """Classify waste based on text description using keyword matching."""
    text_lower = text.lower()
    
    # Define waste categories and keywords
    waste_categories = {
        "plastic": ["plastic", "bottle", "bag", "container", "wrapper", "packaging", "straw", "cup"],
        "organic": ["organic", "food", "banana", "apple", "peel", "core", "vegetable", "compost", "biodegradable"],
        "electronic": ["electronic", "phone", "computer", "battery", "laptop", "tablet", "charger", "circuit"],
        "paper": ["paper", "cardboard", "newspaper", "magazine", "box", "book", "document"],
        "metal": ["metal", "aluminum", "steel", "can", "foil", "wire", "nail"],
        "glass": ["glass", "bottle", "jar", "window", "mirror", "lens"],
        "general": ["general", "mixed", "trash", "garbage", "waste", "rubbish"]
    }
    
    # Find matching categories
    matches = []
    for category, keywords in waste_categories.items():
        for keyword in keywords:
            if keyword in text_lower:
                confidence = 0.8 if keyword in text_lower else 0.6
                matches.append({
                    "class_name": category.capitalize(),
                    "confidence": confidence,
                    "matched_keyword": keyword
                })
                break  # Only match once per category
    
    if matches:
        return {
            "success": True,
            "predictions": matches,
            "total_detections": len(matches),
            "message": f"Identified {len(matches)} waste categories from text description"
        }
    else:
        return {
            "success": True,
            "predictions": [{
                "class_name": "General",
                "confidence": 0.5,
                "matched_keyword": "unknown"
            }],
            "total_detections": 1,
            "message": "Could not determine specific waste type from description"
        }

@app.on_event("startup")
async def startup_event():
    """Load the ML model when the server starts."""
    success = load_model()
    if not success:
        print("WARNING: Failed to load ML model. Image classification will not work.")

@app.get("/")
async def root():
    """Root endpoint for API health check."""
    return {
        "message": "Litterly Waste Classification API",
        "status": "running",
        "model_loaded": model is not None
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "endpoints": ["/", "/health", "/predict", "/predict/image", "/predict/text"]
    }

@app.post("/predict", response_model=PredictionResult)
async def predict_waste(
    text: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None)
):
    """
    Main prediction endpoint that accepts either text or image input.
    If both are provided, image takes precedence.
    """
    import time
    start_time = time.time()
    
    try:
        if image:
            # Handle image classification
            if not model:
                raise HTTPException(status_code=500, detail="ML model not loaded")
            
            # Save uploaded image temporarily
            temp_image_path = f"temp_upload_{image.filename}"
            with open(temp_image_path, "wb") as buffer:
                content = await image.read()
                buffer.write(content)
            
            # Classify the image
            result = classify_waste_image(temp_image_path)
            
            # Clean up temporary file
            try:
                os.remove(temp_image_path)
            except:
                pass
            
            processing_time = round(time.time() - start_time, 3)
            
            if result["success"]:
                return PredictionResult(
                    success=True,
                    predictions=result["predictions"],
                    message=result["message"],
                    processing_time=processing_time
                )
            else:
                raise HTTPException(status_code=500, detail=result["error"])
                
        elif text:
            # Handle text classification
            result = classify_waste_text(text)
            processing_time = round(time.time() - start_time, 3)
            
            return PredictionResult(
                success=True,
                predictions=result["predictions"],
                message=result["message"],
                processing_time=processing_time
            )
        else:
            raise HTTPException(status_code=400, detail="Please provide either text or image input")
            
    except HTTPException:
        raise
    except Exception as e:
        processing_time = round(time.time() - start_time, 3)
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/text", response_model=PredictionResult)
async def predict_waste_text(input_data: TextInput):
    """Text-only prediction endpoint."""
    import time
    start_time = time.time()
    
    try:
        result = classify_waste_text(input_data.text)
        processing_time = round(time.time() - start_time, 3)
        
        return PredictionResult(
            success=True,
            predictions=result["predictions"],
            message=result["message"],
            processing_time=processing_time
        )
        
    except Exception as e:
        processing_time = round(time.time() - start_time, 3)
        raise HTTPException(status_code=500, detail=f"Text prediction failed: {str(e)}")

@app.post("/predict/image", response_model=PredictionResult)
async def predict_waste_image(image: UploadFile = File(...)):
    """Image-only prediction endpoint."""
    import time
    start_time = time.time()
    
    try:
        if not model:
            raise HTTPException(status_code=500, detail="ML model not loaded")
        
        # Validate image file
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Save uploaded image temporarily
        temp_image_path = f"temp_upload_{image.filename}"
        with open(temp_image_path, "wb") as buffer:
            content = await image.read()
            buffer.write(content)
        
        # Classify the image
        result = classify_waste_image(temp_image_path)
        
        # Clean up temporary file
        try:
            os.remove(temp_image_path)
        except:
            pass
        
        processing_time = round(time.time() - start_time, 3)
        
        if result["success"]:
            return PredictionResult(
                success=True,
                predictions=result["predictions"],
                message=result["message"],
                processing_time=processing_time
            )
        else:
            raise HTTPException(status_code=500, detail=result["error"])
            
    except HTTPException:
        raise
    except Exception as e:
        processing_time = round(time.time() - start_time, 3)
        raise HTTPException(status_code=500, detail=f"Image prediction failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)