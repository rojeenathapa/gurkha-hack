# Litterly Waste Classification  

Just as a strong AI model relies on clean, prepared data, a healthy environment relies on clean, sorted waste.
**Litterly** is the "Data Preparation" for the planet — ensuring a clean base for efficient recycling and a healthier environment.

This project provides a **FastAPI server** powered by **YOLOv8 segmentation models** to classify waste from text and images.

---

## Features

* **Image Classification**: Upload images for automatic waste detection and classification
* **Text Classification**: Describe waste items for keyword-based classification
* **ML Integration**: Uses YOLOv8 segmentation model for accurate object detection
* **RESTful API**: Clean, documented API endpoints with automatic OpenAPI docs
* **CORS Enabled**: Frontend-friendly with CORS support for localhost:3000
* **Cross-Platform**: The web app runs on **desktop and mobile devices** for easy accessibility
* **No Database Needed**: All classified data is stored **locally in the browser** (no backend DB)

---

## 🔗 API Endpoints

* `GET /` → Root endpoint and health check
* `GET /health` → Detailed health status
* `POST /predict` → Main endpoint (accepts text or image)
* `POST /predict/text` → Text-only classification
* `POST /predict/image` → Image-only classification
* `GET /docs` → Interactive API documentation (Swagger UI)

---

## ⚙️ Setup

### 1. Install Dependencies

```bash
cd gurkha-hack
pip install -r requirements.txt
```

### 2. Start the Server

**Option 1: Using the startup script**

```bash
python start_server.py
```

**Option 2: Direct uvicorn command**

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### 3. Verify Server is Running

* Server: [http://127.0.0.1:8000](http://127.0.0.1:8000)
* API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* Health Check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## 🚀 Usage Examples

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

---

## 📦 Response Format

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

---

## 🖥️ Frontend Integration

* The API is configured with **CORS** to allow requests from `http://localhost:3000`.
* Frontend works on **React/Next.js** and is fully compatible with **mobile browsers**.
* Since there’s **no backend database**, all results and history are stored **locally in the browser (IndexedDB/localStorage)**.

---

## 🛠️ Troubleshooting

### Model Loading Issues

* Ensure `yolov8m-seg.pt` model file is present.
* Verify all dependencies are installed.
* Check system RAM for model loading.

### CORS Issues

* Default: `localhost:3000` is allowed.
* Update `main.py` if using a different port.

### Performance

* First request may be slow (model warmup).
* Large images increase processing time → resize before uploading.

---

## 👨‍💻 Development

* Server runs with **auto-reload** (`--reload`).
* Edits in `main.py` restart the server automatically.
* Check console logs for detailed error messages.

