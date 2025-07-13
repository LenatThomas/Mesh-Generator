import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {OBJLoader} from 'three/addons/loaders/OBJLoader';
export class SceneControl{
    constructor(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.mesh = null;
        this.index = 0;
        this.objFile = null;
        this.loader = new THREE.ObjectLoader();
        this.wireframe = true;
        this.material = new THREE.MeshStandardMaterial({wireframe : this.wireframe});

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xb6b6b6)
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        this.camera.position.z = 30;
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias:true});
        this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
        this.camera.aspect = this.canvas.offsetWidth / this.canvas.offsetHeight;
        this.camera.updateProjectionMatrix();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.pointlight = new THREE.PointLight(0xffffff, 1000 , 10000);
        this.ambientlight = new THREE.AmbientLight(0xffffff);
        this.pointlight.position.set(20 , 20, 0);
        this.scene.add(this.pointlight, this.ambientlight);

        this.loader = new OBJLoader();
        this.animate()
        console.log('Scene Controller inilizaed')
    }
    animate = () => {
        requestAnimationFrame(this.animate);
        if (!this.mesh) return;
        this.mesh.rotation.y += 0.01;
        this.mesh.rotation.x += 0.005;
        this.mesh.rotation.z += 0.0035;
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    updateObject(meshData , index){
        if (this.mesh){
            this.scene.remove(this.mesh);
        }
        this.mesh = this.loader.parse(meshData);
        this.mesh.position.set(0 , 0 , 0);
        const box = new THREE.Box3().setFromObject(this.mesh);
        const size = box.getSize(new THREE.Vector3()).length();
        this.mesh.scale.setScalar(2 / size)
        
        this.mesh.traverse(child =>{
            if (child.isMesh){
                child.meterial = this.material;
            }
        });
        this.scene.add(this.mesh);
        this.index = index;
    }
    clearScene(){
        if (this.mesh){
            this.scene.remove(this.mesh);
            this.mesh = null;
            this.index = 0;
        }
        this.renderer.render(this.scene, this.camera);
    }
}