import * as THREE from "three"
import { OrbitControls } from "./OrbitControls.js";
import {Text} from 'troika-three-text'

let scene = null;
let renderer = null;
let controls = null;
let camera = null;
let font = null;

function createScene(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#111121");
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const light = new THREE.AmbientLight( 0xabc8ff);
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    scene.add( directionalLight.target );
    directionalLight.target.position.set(10,-10,-10)
    scene.add( directionalLight );
    scene.add( light );
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    controls = new OrbitControls( camera, renderer.domElement );
    camera.position.set(135.4146, 134.7584, 146.51072);
    controls.target.set(72, -34.59784, 28)
    controls.update();
}

function spawn3DText(worldPosition,str){
    let text = new Text()
    scene.add(text)
    text.text = str;
    text.fontSize = 1;
    text.position.set(worldPosition[0],worldPosition[1],worldPosition[2]);
    text.rotation.x = -Math.PI/2;
    text.color = "rgb(0,15,159)";
    text.anchorX = "center";    
    text.sync();
}

export {createScene,scene,renderer,controls,camera, spawn3DText}