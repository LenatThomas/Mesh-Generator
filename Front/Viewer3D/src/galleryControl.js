import { SceneControl } from './sceneControl'
/**
 * Gallery Control controls the events and feeds the obj files to the scene to display
 */
export class GalleryControl{
    constructor() {
        this.SceneControl = new SceneControl('mainCanvas');
        this.meshData = [];
        this.currentIndex = -1;
        this.totalIndex = 0;
        this.API_BASE_URL = 'http://127.0.0.1:5000'; 
        this.API_TIMEOUT = 50000; 
        console.log('Checkpoint1');

        this.modelInfoElement = document.querySelector('.model-info');
        this.downloadBtn = document.querySelector('#downloadBtn');
        this.generateBtn = document.getElementById('generateBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');

        this.initEventListeners();
        this.update();
        console.log('Gallery Controller Initialized')
    }
    initEventListeners(){
        this.generateBtn.addEventListener('click', () => this.generate());
        this.prevBtn.addEventListener('click', () => this.previous());
        this.nextBtn.addEventListener('click', () => this.next());
        this.downloadBtn.addEventListener('click', () => this.download());
    }
    async generate(){
        try{
            const prompt = document.getElementById('prompt').value;
            const batchSize = parseInt(document.getElementById('batchSize').value);
            const guidance = parseFloat(document.getElementById('guidance').value);
            const modelType = document.getElementById('modelType').value;
            console.log(prompt , batchSize , guidance, modelType)
            if (!prompt.trim()) {
                throw new Error('Please enter a prompt');
            }
            if (isNaN(batchSize) || batchSize < 1 || batchSize > 10) {
                throw new Error('Please enter a valid batch size (1-10)');
            }
            if (isNaN(guidance)) {
                throw new Error('Please enter a valid guidance scale');
            }
            
            this.SceneControl.clearScene();
            this.meshData = [];
            this.currentIndex = -1;
            this.totalIndex = 0;
            this.update;
            
            document.getElementById('generateBtn').disabled = true;
            document.getElementById('generateBtn').textContent = 'Generating';
            this.modelInfoElement.textContent = `Generating with ${modelType}...`;

            const response = await this.makeApiRequest({
                prompt,
                batch_size: batchSize,
                guidance_scale: guidance,
                model_type: modelType
            });

            if (response && response.meshes && response.meshes.length > 0) {
                this.meshData = response.meshes;
                this.totalIndex = response.count;
                this.currentIndex = 0;
                this.show(0);
            } else {
                throw new Error('No meshes were generated');
            }
            console.log(`Generated ${this.totalIndex}`)

        } catch (error){
            console.error('Error:', error);
            alert(error.message);
        } finally {
            document.getElementById('generateBtn').disabled = false
            document.getElementById('generateBtn').textContent = 'Generate'
        }
    }
    async makeApiRequest(requestData) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.API_TIMEOUT);
        
        try {
            const response = await fetch(`${this.API_BASE_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'API request failed');
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out');
            }
            throw error;
        }
    }
    show(index){
        if (this.meshData.length === 0 || index < 0 || index >= this.meshData.length) return;
        this.currentIndex = index;
        const mesh = this.meshData[index]
        this.SceneControl.updateObject(mesh.data, index);
        this.update();
    }
    next() {
        const index = (this.currentIndex + 1) % this.totalIndex;
        this.show(index);        
    }
    previous(){
        const index = (this.currentIndex - 1) % this.totalIndex;
        this.show(index);
    }
    async download(){ // Need work
        if (this.meshData.length === 0 || this.currentIndex < 0){
            console.warn('No mesh to download');
            return;
        }
        const mesh = this.meshData[this.currentIndex];
        try {
            this.downloadBtn.disabled = true;
            this.downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
            let objData;
            if (typeof mesh.data == 'string') {
                objData = mesh.data;
            } else {
                objData = this.meshToObj(this.SceneControl.mesh);
            }
            
            const filename = mesh.name || `mesh_${Date.now()}.obj`;
            const blob = new Blob([objData], {type: 'text/plain'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a)
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 100); 
        } catch (error){
            console.error('Download Failed', error);
            this.modelInfoElement.textContent = `Export failed: ${error.message}`;
        } finally {
            console.log("Downloaded")
            this.download.disabled = false;
            this.download.innerHTML = '<i class="fas fa-download"></i> Download';
        }
    }
    update(){
        console.log('Update')
        const minfo = document.querySelector('.model-info');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        if (this.totalIndex > 0){
            minfo.textContent = `Mesh ${this.currentIndex + 1} of ${this.totalIndex}`;
            prevBtn.disabled = this.totalIndex <= 1;
            nextBtn.disabled = this.totalIndex <= 1;
            downloadBtn.disabled = false;
        } else {
            minfo.textContent = 'No mesh generated';
            prevBtn.disabled = true
            nextBtn.disabled = true
            downloadBtn.disabled = true
        }
    }
    meshToObj(){
        let objString = '';
        mesh.traverse((child) => {
            if (child.isMesh) {
                const geometry = child.geometry;
                const vertices = geometry.attributes.position.array;
                const indices = geometry.index?.array || null;
                for (let i = 0; i < vertices.length; i += 3){
                    objString += `v${vertices[i]} ${vertices[i+1]} ${vertices[i+2]}\n`;
                }
                if (indices) {
                    for (let i = 0; i < indices.length; i += 3){
                        objString += `f ${indices[i]+1} ${indices[i+1]+1} ${indices[i+2]+1}\n`;
                    }
                } else {
                const vertexCount = vertices.length / 3;
                for (let i = 0; i < vertexCount; i += 3) {
                    objString += `f ${i+1} ${i+2} ${i+3}\n`;
                }
                }
            }
        })
    }
}