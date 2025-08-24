#!/usr/bin/env python3
"""
Simple test script to verify the FastAPI endpoints are working.
Run this after starting the server to test the API.
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_health():
    """Test the health endpoint."""
    print("🏥 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data['status']}")
            print(f"   Model loaded: {data['model_loaded']}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_text_classification():
    """Test text classification endpoint."""
    print("\n📝 Testing text classification...")
    try:
        data = {"text": "plastic water bottle"}
        response = requests.post(f"{BASE_URL}/predict/text", json=data)
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Text classification successful!")
            print(f"   Message: {result['message']}")
            print(f"   Predictions: {len(result['predictions'])}")
            for pred in result['predictions']:
                print(f"   - {pred['class_name']} ({pred['confidence']:.2f})")
            return True
        else:
            print(f"❌ Text classification failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Text classification error: {e}")
        return False

def test_root_endpoint():
    """Test the root endpoint."""
    print("\n🏠 Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Root endpoint working: {data['message']}")
            return True
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
        return False

def main():
    """Run all tests."""
    print("🧪 Testing Litterly Waste Classification API")
    print("=" * 50)
    
    tests = [
        test_root_endpoint,
        test_health,
        test_text_classification,
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
        print()
    
    print("=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! The API is working correctly.")
        print("\n📖 You can now:")
        print("   - View API docs at: http://127.0.0.1:8000/docs")
        print("   - Test endpoints manually")
        print("   - Integrate with your frontend")
    else:
        print("⚠️  Some tests failed. Check the server logs for details.")
    
    return passed == total

if __name__ == "__main__":
    main()
