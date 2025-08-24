<div align="center">

# ♻️ Litterly – AI-Powered Waste Classification

Just as a strong AI model relies on clean, prepared data, a healthy environment relies on clean, sorted waste. Litterly is the "Data Preparation" for the planet — ensuring a clean base for efficient recycling and a healthier environment.

This project provides a FastAPI server powered by YOLOv8 segmentation models to classify waste from text and images.

AI segmentation + smart text inference for instant, accurate waste sorting.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688)](https://fastapi.tiangolo.com/) [![YOLOv8](https://img.shields.io/badge/YOLOv8-Segmentation-red)](https://github.com/ultralytics/ultralytics) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 1. Project Overview

Manual waste sorting is slow, costly, and error‑prone—leading to recyclable material ending up in landfills. Litterly acts like a “data preparation layer for the planet,” transforming raw, unstructured waste inputs (photos / descriptions) into structured, actionable classifications in seconds.

### Core Value

Better sorting → higher recycling rates → reduced contamination → measurable sustainability impact.

### Key Capabilities

* Image segmentation (YOLOv8) with bounding boxes & masks
* Text description fallback classification
* Mobile‑friendly camera capture (PWA‑ready)
* Local (browser) storage of history—no backend DB needed
* API-first design for integrations

## 2. Architecture

```
User (Web/Mobile Browser)
	 └── Next.js Frontend (camera, upload, history UI)
				└── REST Calls → FastAPI Backend (CORS enabled)
					 └── YOLOv8 Segmentation Model (yolov8m-seg.pt)
						 └── Torch / OpenCV / Pillow
```

State (predictions/history) persists client-side (IndexedDB/localStorage) keeping backend stateless and simple to deploy.

## 3. Features

* 📸 Real‑time image classification (upload or live capture)
* 🧠 Text-based keyword inference when no image
* 🟢 Health & docs endpoints (`/health`, `/docs`)
* 📦 Structured JSON output (classes, confidence, bounding boxes)
* 🔐 Zero server-side user data retention
* 🌐 Cross-origin ready for multiple deployment domains

## 4. Tech Stack

| Layer       | Tools / Libraries                                                                            |
| ----------- | -------------------------------------------------------------------------------------------- |
| Frontend    | Next.js 14, React 18, TypeScript, Tailwind CSS, Radix UI, Lucide Icons, Zod, React Hook Form |
| Backend     | FastAPI, Uvicorn, Gunicorn (prod), Pydantic, python-multipart                                |
| ML / Vision | Ultralytics YOLOv8 Segmentation, Torch, Torchvision, OpenCV, Pillow, NumPy                   |
| Tooling     | Node.js, pip / virtualenv, curl                                                              |

## 5. Repository Structure

```
root/                 # Next.js frontend
	app/, components/, lib/, ...
	package.json
gurkha-hack/          # FastAPI backend (+ model file)
	main.py, start_server.py, requirements.txt, yolov8m-seg.pt
	env.example
```

## 6. Environment Variables

Copy `gurkha-hack/env.example` to `.env` (backend) and `.env.local` (frontend if needed):

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
PORT=8000
MODEL_PATH=yolov8m-seg.pt
ENVIRONMENT=development
```

## 7. Quick Start

### Prerequisites

Node.js 18+, Python 3.8+, Git.

### Backend (FastAPI)

```powershell
cd gurkha-hack
python -m venv .venv ; .\.venv\Scripts\Activate
pip install --upgrade pip
pip install -r requirements.txt
python start_server.py
```

Server: [http://127.0.0.1:8000](http://127.0.0.1:8000)  |  Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Frontend (Next.js)

```powershell
cd .
npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000) (ensure `NEXT_PUBLIC_API_URL` points to backend).

## 8. API Endpoints

| Method | Path             | Purpose                                |
| ------ | ---------------- | -------------------------------------- |
| GET    | `/`              | Basic info / model status              |
| GET    | `/health`        | Health + endpoint list                 |
| POST   | `/predict`       | Multipart (image optional) + text form |
| POST   | `/predict/image` | Image-only upload                      |
| POST   | `/predict/text`  | JSON `{ "text": "..." }`               |
| GET    | `/docs`          | Swagger UI                             |

### Example (Text)

```bash
curl -X POST http://127.0.0.1:8000/predict/text \
	-H "Content-Type: application/json" \
	-d '{"text":"plastic bottle"}'
```

### Example (Image)

```bash
curl -X POST http://127.0.0.1:8000/predict/image \
	-F "image=@example.jpg"
```

## 9. Sample Response

```json
{
	"success": true,
	"predictions": [
		{"id":1,"class_name":"plastic","class_id":0,"confidence":0.95,
		 "bbox":{"x1":100.5,"y1":150.2,"x2":300.8,"y2":400.1}}
	],
	"message": "Found 1 waste objects",
	"processing_time": 0.234
}
```

## 10. Model & Performance

* Default model: `yolov8m-seg.pt` (balanced speed/accuracy)
* Warmup: First inference slower (model load into memory)
* Optimize: Downscale very large images client-side for faster turnaround.

## 11. Deployment Notes

* Backend: Railway / Render / DigitalOcean / Docker (ensure model file included)
* Frontend: Vercel / Netlify (set `NEXT_PUBLIC_API_URL`)
* Add custom domains to CORS list in `main.py`.

## 12. Troubleshooting

| Issue               | Cause                         | Fix                                        |
| ------------------- | ----------------------------- | ------------------------------------------ |
| Model not loading   | Missing file / Torch mismatch | Confirm `yolov8m-seg.pt`, reinstall deps   |
| CORS blocked        | Origin not allowed            | Update `allow_origins` in `main.py`        |
| Slow inference      | Large image / cold start      | Resize image; warm model with test request |
| 415 / 400 on upload | Wrong form key                | Use `image` field in multipart form        |

## 13. Dependencies (Highlights)

Python: ultralytics, torch, torchvision, fastapi, uvicorn\[standard], opencv-python, Pillow, numpy, pydantic, python-multipart.
JS: next, react, tailwindcss, radix UI components, zod, react-hook-form, lucide-react.

## 14. Roadmap

* Short term: Advanced analytics, multilingual labels, API key auth.
* Mid term: Mobile app wrapper, enterprise dashboards, batch ingestion.
* Long term: IoT bin integration, continual training pipeline, sustainability scoring API.

## 15. Team Members & Roles

| Name     | Role                   | Responsibilities                                           |
| -------- | ---------------------- | ---------------------------------------------------------- |
| Prashant | Backend & UX           | FastAPI, backend integration, frontend UI & UX             |
| Rojeena  | Model Fine-Tuning & UX | Model fine-tuning, frontend UI                             |
| Brahmee  | ML & Data              | Prepared dataset, acquired model, data cleaning, test data |

## 16. Contributing

1. Fork repo
2. Create feature branch: `feat/<short-desc>`
3. Commit with conventional messages
4. Open PR with context & screenshots (if UI)

## 17. License

MIT – see `LICENSE` (add if missing).

## 18. Acknowledgments

Ultralytics (YOLOv8), FastAPI community, Next.js & Vercel, Open source maintainers.

---

Made with purpose for a cleaner, data-driven planet. *Every sorted item counts.*
