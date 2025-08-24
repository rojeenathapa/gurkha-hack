<div align="center">

# ♻️ Litterly –  Waste Classification

This project provides a FastAPI server powered by YOLOv8 segmentation models to classify waste from images.



[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688)](https://fastapi.tiangolo.com/) ![YOLOv8](https://img.shields.io/badge/YOLOv8-Segmentation-red)

</div>

---

## 1. Project Overview

Just as a strong AI model relies on clean, prepared data, a healthy environment relies on clean, sorted waste. Litterly is the "Data Preparation" for the planet, ensuring a clean base for efficient recycling and a healthier environment.


### Core Value

Better sorting → higher recycling rates → reduced contamination → measurable sustainability impact.

### Key Capabilities

* Image segmentation (YOLOv8) with bounding boxes & masks
* Mobile‑friendly camera capture (PWA‑ready)
* Local (browser) storage of history—no backend DB needed
* API-first design for integrations

---

## 2. Setup and Run Instructions

### Prerequisites

* Node.js 18+
* Python 3.8+
* Git

### Backend (FastAPI)

```bash
cd gurkha-hack
python -m venv .venv
source .venv/bin/activate  # On Windows, use .\.venv\Scripts\Activate
pip install --upgrade pip
pip install -r requirements.txt
python start_server.py
```

Server: [http://127.0.0.1:8000](http://127.0.0.1:8000)
Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Frontend (Next.js)

```bash
cd ..
npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)
Ensure `NEXT_PUBLIC_API_URL` points to the backend.

---

## 3. Dependencies and Tools Used

### Backend

* FastAPI
* Uvicorn
* Gunicorn (production)
* YOLOv8 (Ultralytics)
* Torch
* OpenCV
* Pillow
* Pydantic
* python-multipart

### Frontend

* Next.js 14
* React 18
* TypeScript
* Tailwind CSS
* Radix UI
* Lucide Icons
* Zod
* React Hook Form

### Tooling

* Node.js
* pip / virtualenv
* curl

---

## 4. Team Contributions

| Name     | Role                        | Responsibilities                                           |
| -------- | --------------------------- | ---------------------------------------------------------- |
| Prashant | Backend & UX                | FastAPI, backend integration, frontend UI & UX             |
| Rojeena  | ML & Model Fine-Tuning & UX | Model fine-tuning, frontend UI                             |
| Brahmee  | ML & Data                   | Prepared dataset, acquired model, data cleaning, test data |









