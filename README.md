# Litterly Waste Classification API

Just as a strong AI model relies on clean, prepared data, a healthy environment relies on clean, sorted waste. Our project, Litterly, is the "Data Preparation" for the planet, ensuring a clean base for efficient recycling and a healthier environment.

A FastAPI server that provides AI-powered waste classification using YOLOv8 segmentation models.

## Features

- **Image Classification**: Upload images for automatic waste detection and classification
- **Text Classification**: Describe waste items for keyword-based classification
- **ML Integration**: Uses YOLOv8 segmentation model for accurate object detection
- **RESTful API**: Clean, documented API endpoints with automatic OpenAPI docs
- **CORS Enabled**: Frontend-friendly with CORS support for localhost:3000

## API Endpoints

- `GET /` - Root endpoint and health check
- `GET /health` - Detailed health status
- `POST /predict` - Main endpoint (accepts text or image)
- `POST /predict/text` - Text-only classification
- `POST /predict/image` - Image-only classification
- `GET /docs` - Interactive API documentation (Swagger UI)

## Setup

### 1. Install Dependencies

```bash
cd gurkha-hack
pip install -r requirements.txt
```

### 2. Start the Server

```bash
# Option 1: Using the startup script
python start_server.py

# Option 2: Direct uvicorn command
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Verify Server is Running

- Server will be available at: http://127.0.0.1:8000
- API documentation: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

## Usage Examples

### Text Classification

```bash
curl -X POST "http://127.0.0.1:8000/predict/text" \
     -H "Content-Type: application/json" \
     -d '{"text": "plastic water bottle"}'
```

### Image Classification

```bash
curl -X POST "http://127.0.0.1:8000/predict/image" \
     -F "image=@your_image.jpg"
```

### Combined Endpoint

```bash
curl -X POST "http://127.0.0.1:8000/predict" \
     -F "text=plastic bottle" \
     -F "image=@your_image.jpg"
```

## Response Format

```json
{
  "success": true,
  "predictions": [
    {
      "id": 1,
      "class_name": "plastic",
      "class_id": 0,
      "confidence": 0.95,
      "bbox": {
        "x1": 100.5,
        "y1": 150.2,
        "x2": 300.8,
        "y2": 400.1
      }
    }
  ],
  "message": "Found 1 waste objects",
  "processing_time": 0.234
}
```

## Frontend Integration

The API is configured with CORS to allow requests from `http://localhost:3000`. See the frontend examples below for how to integrate with React/Next.js.

## Troubleshooting

### Model Loading Issues
- Ensure the `yolov8m-seg.pt` model file is present in the directory
- Check that all dependencies are installed correctly
- Verify sufficient RAM for model loading

### CORS Issues
- The server is configured to allow requests from localhost:3000
- If using a different port, update the CORS configuration in `main.py`

### Performance
- First request may be slower due to model loading
- Image processing time depends on image size and complexity
- Consider using smaller images for faster processing

## Development

- The server runs with auto-reload enabled
- Changes to `main.py` will automatically restart the server
- Check the console for detailed logs and error messages

