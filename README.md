Satellite Image Super-Resolution using ESRGAN

This project applies ESRGAN (Enhanced Super-Resolution Generative Adversarial Network) to improve the resolution of satellite images collected from Google Earth Engine (Sentinel-2 dataset).

The model learns to convert low-resolution satellite tiles into high-resolution images with sharper edges and better visual quality.

Features

Fetches real satellite images using Google Earth Engine

Creates low-resolution images by 4× downscaling

Trains ESRGAN deep learning model in PyTorch

Evaluates performance using:PSNR,SSIM,Edge loss

Compares results with Bicubic interpolation

Saves trained model for future use

Tech Stack:
Python
PyTorch
OpenCV
Google Earth Engine
NumPy
Matplotlib

📂 Project Workflow

1.Fetch satellite tiles from Sentinel-2 dataset

2.Generate LR–HR image pairs

3.Train ESRGAN generator network

4.Apply super-resolution on unseen city images

5.Evaluate and visualize results

🧪 Dataset Source

Satellite imagery from:

COPERNICUS Sentinel-2 (Surface Reflectance)
via Google Earth Engine

Cities used for training:

Kanpur

Delhi

Ahmedabad

Mumbai

📊 Evaluation Metrics
Metric	Purpose
PSNR	Image quality measurement
SSIM	Structural similarity
Edge Loss	Sharpness preservation
▶️ How to Run
1. Install dependencies
pip install torch opencv-python geemap earthengine-api matplotlib numpy

2. Authenticate Google Earth Engine
import ee
ee.Authenticate()
ee.Initialize()

3. Run the notebook
jupyter notebook

📁 Model Output

Trained model is saved as:

esrgan_satellite_2.pth

📈 Sample Results

The model produces sharper satellite images compared to bicubic upscaling, improving road edges, buildings, and land textures.

🔮 Future Improvements

Add discriminator for full ESRGAN training

Train on larger geographic regions

Deploy as web app

Use multi-spectral bands
## 🚀 Web Application

The project now includes a beautiful, premium web interface to interact with the ESRGAN model in real-time.

### Running the Web App Locally

1. **Start the Backend**:
   ```bash
   python3 app.py
   ```
   *The backend uses Apple Silicon GPU acceleration (MPS) for high performance.*

2. **Start the Frontend**:
   ```bash
   python3 -m http.server 8080
   ```

3. **Open Browser**:
   Go to [http://localhost:8080](http://localhost:8080)

## 🖥️ Terminal CLI

You can also enhance images directly from your terminal using the provided script.

```bash
python3 cli_enhance.py your_input_image.png your_output_image.png
```

## 📁 Model Weights

The model weights `esrgan_satellite.pth` are required to run the backend. If you are cloning this repo, ensure you have the `.pth` file in the root directory.
