# 🪄 3D Mesh Generator

![Demo](samples/demo.gif)  
*Generate 3D models from text prompts with real-time preview*

## 🌟 Features
- **Text-to-3D** generation using AI models
- **Interactive 3D viewer** with orbit controls
- **OBJ export** 

### Prerequisites
- Python 3.9+
- Node.js 18+

### Local Setup
```bash
# Clone repository
git clone https://github.com/LenatThomas/Mesh-Generator.git
cd Mesh-Generator

# Backend setup (Flask)
pip install -r App/requirements.txt

# Frontend setup (Vite + Three.js)
cd Front/Viewer3D
npm install

# Terminal 1: Start backend (Flask)
cd Mesh-Generator/App
python app.py  # Runs on http://localhost:5000

# Terminal 2: Start frontend (Vite)
cd ../Front/Viewer3D
npm run dev  # Runs on http://localhost:5173
```
### Sample Input Output
#### Prompt: "A mini train"
![Prompt: "A mini train"](outputs/train1.gif)
#### Prompt: "A sword with neaon lights"
![Prompt: "A sword with neaon lights"](outputs/sword1.gif)
#### Prompt: "A dragonfly"
![Prompt: "A dragonfly"](outputs/dragon1.gif)
#### Prompt: "bookworm"
![Prompt: "bookworm"](outputs/book1.gif)
#### Prompt: "A tower with pointy roof"
![Prompt: "A tower with pointy roof"](outputs/tower5.gif)
