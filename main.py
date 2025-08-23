import os
import random
import argparse

from datasets import load_dataset
from ultralytics import YOLO


def test_custom_image(image_path, model):
    """Test model on a custom image file."""
    print(f"Testing custom image: {image_path}")
    
    if not os.path.exists(image_path):
        print(f"Error: Image file not found: {image_path}")
        return
    
    # Run prediction
    results = model.predict(image_path, conf=0.25, save=True, project="custom_test_results")
    result = results[0]
    
    # Display results
    if result.masks is not None:
        print(f"Found {len(result.masks)} objects:")
        for i, (box, mask, conf, cls) in enumerate(zip(result.boxes.xyxy, result.masks.data, result.boxes.conf, result.boxes.cls)):
            class_id = int(cls.item())
            class_name = model.names[class_id] if hasattr(model, 'names') else f"class_{class_id}"
            confidence = conf.item()
            print(f"  Detection {i+1}: {class_name} (confidence: {confidence:.2f})")
    else:
        print("No objects detected")
    
    print(f"Results saved to: custom_test_results/predict/")
    return result


def test_random(model):
    print("Loading  dataset...")
    dataset = load_dataset("Zesky665/TACO")
    
    # Get random image from train split
    train_split = dataset['train']
    random_index = random.randint(0, len(train_split) - 1)
    sample = train_split[random_index]
    
    print(f"Selected random sample {random_index} from train split")
    print(f"Image size: {sample['image'].size}")
    print(f"Label: {sample.get('label', 'N/A')}")
    
    # Save and test
    image_path = "random_sample_original.jpg"
    sample['image'].save(image_path)
    
    return test_custom_image(image_path, model)


def main():
    parser = argparse.ArgumentParser(description="Test YOLOv8 segmentation model")
    parser.add_argument("--image", "-i", help="Path to custom image file")
    parser.add_argument("--random", "-r", action="store_true", help="Test on random TrashNet image")
    
    args = parser.parse_args()
    
    # Load model
    print("Loading YOLOv8 segmentation model...")
    model = YOLO("yolov8m-seg.pt")
    print("Model loaded successfully!")
    
    # Display model categories
    if hasattr(model, 'names'):
        print(f"Model can classify {len(model.names)} categories:")
        for class_id, class_name in model.names.items():
            print(f"  {class_id:2d}: {class_name}")
    
    # Test based on arguments
    if args.image:
        test_custom_image(args.image, model)
    elif args.random:
        test_random(model)
    else:
        print("Please provide --image <path> or --random")
        print("Examples:")
        print("  python main.py --image my_image.jpg")
        print("  python main.py --random")


if __name__ == "__main__":
    main()