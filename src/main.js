import "./style.css";
import { GLTFLoader } from "./GLTFLoader.js";
import {createScene,scene,renderer,controls,camera} from "./scene3d.js";

createScene();

let loader = new GLTFLoader();

start();

async function start() {
    loader.load("/atlantic.gltf",function ( gltf ) {scene.add(gltf.scene);});

    function animate() {
      requestAnimationFrame( animate );
      controls.update();
      renderer.render( scene, camera );
    }
    animate();
}