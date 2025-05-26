#!/usr/bin/env python3
"""
Script to convert the hand_landmarks.keras model to TensorFlow.js format
"""

import os
import sys
import tensorflow as tf
import tensorflowjs as tfjs
import numpy as np
from pathlib import Path

def check_dependencies():
    """Check if all required dependencies are installed."""
    try:
        import tensorflow
        import tensorflowjs
        print(f"✓ TensorFlow version: {tensorflow.__version__}")
        print(f"✓ TensorFlow.js converter version: {tensorflowjs.__version__}")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please install required packages:")
        print("pip install tensorflow tensorflowjs")
        return False

def load_and_convert_model(input_path, output_path):
    """Load the Keras model and convert it to TensorFlow.js format."""
    try:
        print(f"📂 Loading model from: {input_path}")
        
        # Load the Keras model
        model = tf.keras.models.load_model(input_path)
        
        print("✓ Model loaded successfully")
        print(f"📊 Model summary:")
        print(f"   - Input shape: {model.input_shape}")
        print(f"   - Output shape: {model.output_shape}")
        print(f"   - Total parameters: {model.count_params():,}")
        
        # Create output directory if it doesn't exist
        os.makedirs(output_path, exist_ok=True)
        
        print(f"🔄 Converting to TensorFlow.js format...")
        
        # Convert to TensorFlow.js
        tfjs.converters.save_keras_model(
            model, 
            output_path,
            quantization_bytes=2,  # Quantize to reduce model size
            metadata={
                "description": "Hand landmarks sign language detection model",
                "input_type": "hand_landmarks",
                "input_shape": model.input_shape,
                "output_classes": 26,  # A-Z
                "preprocessing": "normalized_landmarks"
            }
        )
        
        print(f"✅ Model converted successfully!")
        print(f"📁 Output saved to: {output_path}")
        
        # Verify the converted model
        verify_converted_model(output_path)
        
        return True
        
    except Exception as e:
        print(f"❌ Error converting model: {e}")
        return False

def verify_converted_model(model_path):
    """Verify that the converted model can be loaded."""
    try:
        print("🔍 Verifying converted model...")
        
        # Check if the required files exist
        model_json = os.path.join(model_path, "model.json")
        weights_bin = os.path.join(model_path, "weights.bin")
        
        if os.path.exists(model_json) and os.path.exists(weights_bin):
            print("✓ Required files found:")
            print(f"   - model.json: {os.path.getsize(model_json):,} bytes")
            print(f"   - weights.bin: {os.path.getsize(weights_bin):,} bytes")
        else:
            print("❌ Missing required files")
            return False
        
        # Read and display model.json structure
        import json
        with open(model_json, 'r') as f:
            model_data = json.load(f)
            
        print("📋 Model structure verified:")
        print(f"   - Format: {model_data.get('format', 'unknown')}")
        print(f"   - Model topology available: {'modelTopology' in model_data}")
        print(f"   - Weights manifest available: {'weightsManifest' in model_data}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error verifying model: {e}")
        return False

def create_sample_test():
    """Create a sample test for the converted model."""
    test_code = '''
// Sample test code for the converted model
import * as tf from "@tensorflow/tfjs";

async function testModel() {
    try {
        // Load the converted model
        const model = await tf.loadLayersModel('/models/hand_landmarks_model/model.json');
        console.log('✓ Model loaded successfully');
        
        // Create sample input (21 landmarks * 3 coordinates + 5 distance features = 68)
        const sampleInput = tf.randomNormal([1, 68]);
        
        // Make prediction
        const prediction = model.predict(sampleInput);
        const result = await prediction.data();
        
        console.log('✓ Prediction successful');
        console.log('Prediction shape:', prediction.shape);
        console.log('Top prediction:', Math.max(...result));
        
        // Cleanup
        sampleInput.dispose();
        prediction.dispose();
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testModel();
'''
    
    with open('test_converted_model.js', 'w') as f:
        f.write(test_code)
    
    print("📝 Sample test code created: test_converted_model.js")

def main():
    """Main conversion function."""
    print("🤖 Hand Landmarks Model Converter")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    # Define paths
    input_model = "hand_landmarks.keras"
    output_dir = "sign-language-tool/public/models/hand_landmarks_model"
    
    # Check if input model exists
    if not os.path.exists(input_model):
        print(f"❌ Input model not found: {input_model}")
        print("Please ensure the hand_landmarks.keras file exists in the current directory")
        sys.exit(1)
    
    # Convert the model
    if load_and_convert_model(input_model, output_dir):
        print("\n🎉 Conversion completed successfully!")
        print("\n📋 Next steps:")
        print("1. The model is now available at:", output_dir)
        print("2. The web application will automatically use this model")
        print("3. Restart the Next.js development server to see changes")
        print("4. Test the model using the created test file")
        
        # Create sample test
        create_sample_test()
        
    else:
        print("\n❌ Conversion failed!")
        sys.exit(1)

if __name__ == "__main__":
    main() 