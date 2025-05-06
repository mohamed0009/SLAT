import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

class SignLanguageModel {
  private static instance: SignLanguageModel;
  private modelLoaded: boolean = false;
  private processingFrame: boolean = false;
  private model: tf.LayersModel | null = null;

  private constructor() {}

  static getInstance(): SignLanguageModel {
    if (!SignLanguageModel.instance) {
      SignLanguageModel.instance = new SignLanguageModel();
    }
    return SignLanguageModel.instance;
  }

  private async createTestModel(): Promise<tf.LayersModel> {
    // Create a simple CNN model for testing
    const model = tf.sequential();

    // Add convolutional layers
    model.add(
      tf.layers.conv2d({
        inputShape: [224, 224, 3],
        filters: 32,
        kernelSize: 3,
        activation: "relu",
      })
    );
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

    model.add(
      tf.layers.conv2d({
        filters: 64,
        kernelSize: 3,
        activation: "relu",
      })
    );
    model.add(tf.layers.maxPooling2d({ poolSize: 2 }));

    // Flatten and add dense layers
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 128, activation: "relu" }));
    model.add(tf.layers.dropout({ rate: 0.5 }));
    model.add(tf.layers.dense({ units: 26, activation: "softmax" }));

    // Compile the model
    model.compile({
      optimizer: "adam",
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    return model;
  }

  async loadModel(): Promise<void> {
    if (this.modelLoaded) return;

    try {
      // Set the backend to WebGL for better performance
      await tf.setBackend("webgl");

      try {
        // Try to load the pre-trained model
        this.model = await tf.loadLayersModel(
          "/models/sign_language_model/model.json"
        );
        console.log("Loaded pre-trained model");
      } catch (modelError) {
        console.warn(
          "Failed to load pre-trained model, creating test model:",
          modelError
        );
        // Create a test model if loading fails
        this.model = await this.createTestModel();
        console.log("Created test model");
      }

      this.modelLoaded = true;
    } catch (error) {
      console.error("Failed to initialize model:", error);
      this.modelLoaded = false;
      throw error;
    }
  }

  async detectSign(imageData: ImageData): Promise<{
    gesture: string;
    confidence: number;
  }> {
    if (!this.modelLoaded || !this.model) {
      await this.loadModel();
    }

    if (this.processingFrame) {
      return { gesture: "", confidence: 0 };
    }

    this.processingFrame = true;

    try {
      // Convert ImageData to tensor
      const tensor = tf.tidy(() => {
        return tf.browser
          .fromPixels(imageData)
          .resizeBilinear([224, 224])
          .toFloat()
          .div(255.0)
          .expandDims(0);
      });

      // Get prediction
      const prediction = (await this.model!.predict(tensor)) as tf.Tensor;
      const probabilities = await prediction.data();

      // Cleanup tensors
      tensor.dispose();
      prediction.dispose();

      // Get the index of the highest probability
      const maxProbIndex = Array.from(probabilities).indexOf(
        Math.max(...Array.from(probabilities))
      );

      // Map index to gesture name
      const gestures = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

      return {
        gesture: gestures[maxProbIndex] || "Unknown",
        confidence: probabilities[maxProbIndex],
      };
    } catch (error) {
      console.error("Detection error:", error);
      return { gesture: "", confidence: 0 };
    } finally {
      this.processingFrame = false;
    }
  }
}

export const signLanguageModel = SignLanguageModel.getInstance();
export default signLanguageModel;
