import * as THREE from "three"
import { OrbitControls } from "./OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import {toMorseCodeFromText} from "./morseCode.js"

let scene = null;
let renderer = null;
let controls = null;
let camera = null;
let font = null;
let labelRenderer = null;

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

    labelRenderer = new CSS2DRenderer();
	labelRenderer.setSize( window.innerWidth, window.innerHeight );
	labelRenderer.domElement.style.position = 'absolute';
	labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.className = "no-raycast"
	document.body.appendChild( labelRenderer.domElement );
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    controls = new OrbitControls( camera, renderer.domElement );
    camera.position.set(0, 114.7584, 176.51072);
    controls.target.set(0, -34.59784, 28)
    controls.update();
}

function spawn2DText(parentObject, text, position, extraTextClass){

    const div = document.createElement('div');

    if (extraTextClass == null){
        div.className = 'label';
    } else {
        div.className = "label " + extraTextClass;
    }
	
    let textHolder = document.createElement('div');
    textHolder.className = "label-toggle text";
    textHolder.textContent = text;
    div.appendChild(textHolder);

    let morseHolder = document.createElement('div');
    morseHolder.className = "label-toggle morse";
    morseHolder.textContent = toMorseCodeFromText(text);
    div.appendChild(morseHolder);

    if (position == null){
        position = [0,0,0];
    }
	const label = new CSS2DObject(div);
	label.position.set(position[0],position[1],position[2]);
	label.center.set( 0.5, 1 );
	parentObject.add(label);
	label.layers.set( 0 );

    return [parentObject, label];
}

export {createScene,scene,renderer,controls,camera, spawn2DText,labelRenderer}