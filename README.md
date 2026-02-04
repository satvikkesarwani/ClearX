# 🛰️ ClearX ESRGAN: Satellite Image Super-Resolution

[![PyTorch](https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white)](https://pytorch.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**ClearX** leverages state-of-the-art **ESRGAN** (Enhanced Super-Resolution Generative Adversarial Network) architecture to redefine remote sensing. By utilizing **16 Residual-in-Residual Dense Blocks (RRDB)**, we deliver 4x super-resolution for satellite data with industry-leading clarity.

---

## ✨ Key Features

- **🌐 Real-World Data**: Automated fetching of high-fidelity satellite imagery via Google Earth Engine (Sentinel-2).
- **🧠 Advanced AI**: Deep learning model trained with RRDB blocks for superior edge preservation.
- **🚀 Dual-Interface Deployment**:
  - **Premium Web App**: A glassmorphic, interactive UI for real-time model interaction.
  - **Powerful CLI**: Fast, terminal-based processing for batch workflows.
- **⚡ Hardware Optimized**: Native support for **Apple Silicon (Metal/MPS)** and **NVIDIA (CUDA)** acceleration.
- **📊 Scientific Accuracy**: Benchmarked using PSNR, SSIM, and Edge Loss metrics.

---

## 🛠️ Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" />
  <img src="https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white" />
  <img src="https://img.shields.io/badge/fastapi-109989?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" />
  <img src="https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white" />
</p>

---

## � Getting Started

### 1️⃣ Installation

```bash
# Clone the repository
git clone https://github.com/satvikkesarwani/ClearX.git
cd klaymo_website

# Install dependencies
pip install -r requirement.txt
```

### 2️⃣ Running the Web Application

To experience the interactive interface, you need to run both the inference engine and the frontend server.

**Start the Inference Backend:**
```bash
python3 app.py
```

**Start the Web Interface:**
```bash
python3 -m http.server 8080
```
> Visit: **[http://localhost:8080](http://localhost:8080)**

### 3️⃣ Using the Terminal CLI

Enhance images directly from your command line:
```bash
python3 cli_enhance.py path/to/low_res.png path/to/output.png
```

---

## � Model Performance

The ClearX model significantly outperforms standard upscaling methods, preserving critical structural details in urban and coastal environments.

| Metric | Bicubic | **ClearX ESRGAN** |
| :--- | :--- | :--- |
| **PSNR** | ~28.5 dB | **32.86 dB** |
| **SSIM** | 0.824 | **0.933** |
| **Edge Loss** | High | **Minimal** |

---

## 📂 Project Structure

- `app.py`: FastAPI backend loading the trained `.pth` model.
- `script.js`: Intelligent frontend handling async API calls and UI state.
- `cli_enhance.py`: Lightweight terminal tool for direct interaction.
- `esrgan.ipynb`: Full training pipeline and evaluation logic.
- `esrgan_satellite.pth`: Pre-trained model weights (16 RRDB Blocks).

---

## 🔮 Future Roadmap

- [ ] Implementation of Discriminator for GAN-based perceptual training.
- [ ] Integration of multi-spectral band analysis.
- [ ] Cloud-native GPU deployment via AWS/GCP.

---

<p align="center">Built for the future of Earth Observation. 🌍</p>
