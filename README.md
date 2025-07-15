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
pip install -r requirements.txt

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
![Prompt: "A mini train"](outputs/train2.gif)
#### Prompt: "A sword with neaon lights"
![Prompt: "A sword with neaon lights"](outputs/sword1.gif)
![Prompt: "A sword with neaon lights"](outputs/sword2.gif)
![Prompt: "A sword with neaon lights"](outputs/sword3.gif)
#### Prompt: "A dragonfly"
![Prompt: "A dragonfly"](outputs/dragon1.gif)
![Prompt: "A dragonfly"](outputs/dragon2.gif)
![Prompt: "A dragonfly"](outputs/dragon3.gif)
#### Prompt: "bookworm"
![Prompt: "bookworm"](outputs/book2.gif)
![Prompt: "bookworm"](outputs/book3.gif)
![Prompt: "bookworm"](outputs/book4.gif)
#### Prompt: "A tower with pointy roof"
![Prompt: "A tower with pointy roof"](outputs/tower6.gif)
![Prompt: "A tower with pointy roof"](outputs/tower5.gif)
![Prompt: "A tower with pointy roof"](outputs/tower7.gif)

### Interface 
![Interface](outputs/Interface.png)
A demo is provided in the outputs folder. outputs/Mesh View.mp4

Currently, only Shap-E is implemented. Support for additional models is planned, including models capable of refining a mesh based on a text prompt.
