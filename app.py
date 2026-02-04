import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import cv2
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
import io
from PIL import Image

# --- Model Architecture (from esrgan.ipynb) ---

class DenseBlock(nn.Module):
    def __init__(self, c):
        super().__init__()
        self.act = nn.LeakyReLU(0.2, inplace=True)

        self.c1 = nn.Conv2d(c, c, 3, 1, 1)
        self.c2 = nn.Conv2d(c*2, c, 3, 1, 1)
        self.c3 = nn.Conv2d(c*3, c, 3, 1, 1)
        self.c4 = nn.Conv2d(c*4, c, 3, 1, 1)
        self.c5 = nn.Conv2d(c*5, c, 3, 1, 1)

    def forward(self, x):
        x1 = self.act(self.c1(x))
        x2 = self.act(self.c2(torch.cat([x, x1], 1)))
        x3 = self.act(self.c3(torch.cat([x, x1, x2], 1)))
        x4 = self.act(self.c4(torch.cat([x, x1, x2, x3], 1)))
        x5 = self.c5(torch.cat([x, x1, x2, x3, x4], 1))
        return x + 0.2 * x5

class RRDB(nn.Module):
    def __init__(self, c):
        super().__init__()
        self.d1 = DenseBlock(c)
        self.d2 = DenseBlock(c)
        self.d3 = DenseBlock(c)

    def forward(self, x):
        return x + 0.2 * self.d3(self.d2(self.d1(x)))

class ESRGAN_Generator(nn.Module):
    def __init__(self):
        super().__init__()
        self.start = nn.Conv2d(3, 64, 3, 1, 1)
        self.body = nn.Sequential(*[RRDB(64) for _ in range(16)])
        self.refine = nn.Conv2d(64, 64, 3, 1, 1)
        self.up = nn.Sequential(
            nn.Conv2d(64, 256, 3, 1, 1),
            nn.PixelShuffle(2),
            nn.LeakyReLU(0.2),
            nn.Conv2d(64, 256, 3, 1, 1),
            nn.PixelShuffle(2),
            nn.LeakyReLU(0.2)
        )
        self.end = nn.Conv2d(64, 3, 3, 1, 1)

    def forward(self, x):
        f = self.start(x)
        r = self.refine(self.body(f))
        f = f + r
        return self.end(self.up(f))

# --- FastAPI App ---

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = ESRGAN_Generator().to(device)

# Load weights
try:
    checkpoint = torch.load("esrgan_satellite.pth", map_location=device)
    # Check if it's a state dict or a wrapped dict
    if "model_state" in checkpoint:
        model.load_state_dict(checkpoint["model_state"])
    else:
        model.load_state_dict(checkpoint)
    model.eval()
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")

@app.post("/enhance")
async def enhance_image(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    
    # Preprocessing
    img_np = np.array(image)
    img_tensor = torch.tensor(img_np / 255.0).permute(2, 0, 1).float().unsqueeze(0).to(device)
    
    # Inference
    with torch.no_grad():
        sr_tensor = model(img_tensor)
    
    # Postprocessing
    sr_img = sr_tensor.squeeze().permute(1, 2, 0).cpu().numpy()
    sr_img = (sr_img * 255).clip(0, 255).astype(np.uint8)
    
    # Convert back to image
    output_image = Image.fromarray(sr_img)
    img_byte_arr = io.BytesIO()
    output_image.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()
    
    return Response(content=img_byte_arr, media_type="image/png")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
