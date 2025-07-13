import os
from glob import glob
from model import Generators
from utils import logg
from flask import Flask
from flask import render_template, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

downloadFolder = 'static/outputs'
os.makedirs(downloadFolder, exist_ok = True)
logger = logg.configureLogger(__name__)

# All the models below are placeholders
#instantModel = Generators.Instant3DPipe()
#zero123Model = Generators.Zero123Pipe()
#dreamFusionModel = Generators.DreamfusionPipe()
#hyungyuanModel = Generators.HyungyuanPipe()

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/generate' , methods=['POST'])
def generate():
    logger.info("Received generate request")
    data = request.get_json()
    if not data:
        logger.error("data missing")
        return jsonify({'status': 'error' , 'message' : 'No data provided'}), 400
    prompt = data.get('prompt')
    if not prompt:
        logger.error("Prompt missing")
        return jsonify({'status': 'error', 'message' : 'Prompt is required'}), 400
    try:
        batchSize = int(data.get('batch_size', 1))
        guidanceScale = float(data.get('guidance_scale', 15.0))
        modelType = data.get('model_type', 'shapE')  
        validModels = ['ShapE', 'Instant3D', 'DreamFusion', 'Zero123', 'Hyungyuan']
        if modelType not in validModels:
            logger.error('Wrong model provided')
            return jsonify({'status': 'error', 'message': 'Invalid model type'}), 400
        if modelType != 'ShapE':
            logger.error(f'Requested model {modelType} not yet implemented')
            return jsonify({'status' : 'error' , 'message' : f'Model {modelType} not yet implemented'}, 500)
        logger.info(f"Generating with model: {modelType}")
    except (TypeError, ValueError):
        logger.error('Wrong input type')
        return jsonify({'status': 'error', 'message' : 'batch size and guidance must be numbers'}), 400
    try:
        logger.info('Starting generation')
        logger.info('Using placeholder generation function')
        pipe = Generators.ShapEPipe()
        logger.info(f'Using {str(pipe.name)} pipe')
        logger.info(f'Using device {str(pipe.device)}')
        pipe.generatedummy(
            prompt=prompt,
            batch_size = batchSize,
            guidance = guidanceScale 
            )
        logger.info('Generation done')
        files = sorted(glob(
            os.path.join(downloadFolder, '*obj')),
            key=os.path.getmtime, 
            reverse=True)[:batchSize]

        if not files :
            logger.error('Generated Objects missing')
            return jsonify({'status' : 'error' , 'message' : 'Objects not found'}, 500)

        objects3D = []
        for i , item in enumerate(files) :
            try :
                with open(item, 'r') as f:
                    objects3D.append({
                        'name' : os.path.basename(item), 
                        'data' : f.read()
                        })
            except IOError as e:
                logger.error(f'Generated object {i} failed to loads')
                continue
        
        logger.info(f'Request success, Generated {len(objects3D)} meshes')
        return jsonify({
            'status' : 'success',
            'count' : len(objects3D),
            'meshes' : objects3D
        })
    except Exception as e :
        logger.error(str(e))
        return jsonify({'status' : 'error', 'message' : str(e)}), 500

@app.route('/status')
def status():
    response = {
        'status'  : 'online',
        'version' : '0.1',
        'model'   : 'zero123',
    }
    return response

if __name__ == "__main__":
    app.run(debug=True)