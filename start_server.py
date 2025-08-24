#!/usr/bin/env python3
"""
Startup script for the Litterly Waste Classification API server.
Run this script to start the FastAPI server with uvicorn.
"""

import uvicorn
import os
import sys

def main():
    """Start the FastAPI server."""
    print("🚀 Starting Litterly Waste Classification API Server...")
    print("📍 Server will be available at: http://127.0.0.1:8000")
    print("📖 API documentation: http://127.0.0.1:8000/docs")
    print("🔍 Health check: http://127.0.0.1:8000/health")
    print("")
    print("Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        uvicorn.run(
            "main:app",
            host="127.0.0.1",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
