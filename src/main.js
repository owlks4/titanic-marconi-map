import "./style.css";
import { GLTFLoader } from "./GLTFLoader.js";
import {createScene,scene,renderer,controls,camera,spawn2DText,labelRenderer} from "./scene3d.js";
import atlantic from "/atlantic.gltf?url"
import { isObject } from "tone";
import marconiMessagesUrl from "/marconiMessages.json?url"
import {toMorseCodeFromText} from "./morseCode.js"

createScene();

let TIME_DISPLAY = document.getElementById("time-display")
let TIME_RANGE = document.getElementById("time-range");
TIME_RANGE.value = 0;

TIME_RANGE.oninput = (e) => {
  let newValue = e.target.value;
  titanic_time_minutes_since_midnight = STARTING_TIME_IN_MINUTES_SINCE_MIDNIGHT + (newValue * (END_TIME_IN_MINUTES_SINCE_MIDNIGHT - STARTING_TIME_IN_MINUTES_SINCE_MIDNIGHT))
  displayCurrentMarconiMessage()
  updateVisualClock();
  }

let loader = new GLTFLoader();
let marconiMessages = null

const STARTING_TIME_IN_MINUTES_SINCE_MIDNIGHT = 15.0;
const END_TIME_IN_MINUTES_SINCE_MIDNIGHT= 141;

const TIMESCALE = 4;

let titanic_time_minutes_since_midnight = STARTING_TIME_IN_MINUTES_SINCE_MIDNIGHT;
let clockRunning = true;
let lastTimeClockUpdated = Date.now()

let currentMessage = null;
let currentMessageMorseCode = null;
let currentMessageTextElements = null;

let participantNames = [];

const response = await fetch(marconiMessagesUrl);
marconiMessages = await response.json();
marconiMessages.messages.forEach(message => {
  message.content = message.content.toUpperCase()
  message.time = string_time_to_minutes_since_midnight(message.time)
  console.log(message.time)
  if (!participantNames.includes(message.sender)){
    participantNames.push(message.sender);
  }
  if (!message.intended_recipient == "" && !participantNames.includes(message.intended_recipient)){
    participantNames.push(message.intended_recipient);
  }
});

start();

function string_time_to_minutes_since_midnight(str_time) {
  let split_str_time = str_time.trim().split(":");
  let output = parseInt(split_str_time[1]); //get minutes (no conversion needed)
  output += parseFloat(split_str_time[2]) / 60.0; //get seconds and convert into minutes
  output += parseInt(split_str_time[0]) * 60; //get hours and convert into minutes
  return output;
}

function minutes_since_midnight_to_string_time(input) {

  let minutes = Math.floor(input);
  let seconds = ((input - minutes) * 60);

  let hours = Math.floor(minutes / 60);
  minutes = (minutes - (hours * 60))

  if (seconds >= 60){
    seconds = 0;
    minutes++;
  }

  if (minutes >= 60){
    minutes = 0;
    hours++;
  }

  if (hours == 0){
    hours = 12;
  }

  return String(Math.floor(hours)).padStart(2,"0") + ":" + String(Math.floor(minutes)).padStart(2,"0") + "." + String(Math.floor(seconds)).padStart(2,"0") + " am";
}

function displayCurrentMarconiMessage(){
  let potentialMessageForDisplay = null;

  for (let i = 0; i < marconiMessages.messages.length; i++){
    if (titanic_time_minutes_since_midnight >= marconiMessages.messages[i].time){
      potentialMessageForDisplay = marconiMessages.messages[i];
    }
  }

  if (potentialMessageForDisplay != currentMessage){

    if (currentMessage != null){
      currentMessageTextElements[0].remove(currentMessageTextElements[1])
    }

    currentMessage = potentialMessageForDisplay;
    currentMessageMorseCode = toMorseCodeFromText(currentMessage.content)
    console.log(currentMessage.sender + ":")
    console.log(currentMessage.content);
    console.log(currentMessageMorseCode);
    currentMessageTextElements = spawn2DText(scene.getObjectByName(currentMessage.sender.replace(" ","_")),currentMessage.content.toUpperCase(),[0,15,0],"message-box")
  }
}
  
function updateVisualClock(){
  TIME_DISPLAY.innerText = minutes_since_midnight_to_string_time(titanic_time_minutes_since_midnight);
}

async function start() {
    updateVisualClock();
    loader.load(atlantic,async function (gltf) {
        await scene.add(gltf.scene);
        console.log(scene)
        participantNames.forEach(participantName => {
          let obj = scene.getObjectByName(participantName.replace(" ","_"));
          if (obj != null){
            spawn2DText(obj, participantName, [0,6,0], "name-bold")
          } else {
            console.log("Was expecting an object called "+participantName+" to be in the scene... but couldn't find it!")
          }
        });         
      });                                 

    function animate() {
      requestAnimationFrame( animate );
      let now = Date.now()
      if (clockRunning && titanic_time_minutes_since_midnight < END_TIME_IN_MINUTES_SINCE_MIDNIGHT && now - lastTimeClockUpdated >= 1000/TIMESCALE){
        titanic_time_minutes_since_midnight += 0.01666666666; //tick clock by one second
        console.log("tick")
        displayCurrentMarconiMessage()
        lastTimeClockUpdated = now;
        updateVisualClock()
        TIME_RANGE.value = (titanic_time_minutes_since_midnight - STARTING_TIME_IN_MINUTES_SINCE_MIDNIGHT) / (END_TIME_IN_MINUTES_SINCE_MIDNIGHT - STARTING_TIME_IN_MINUTES_SINCE_MIDNIGHT)
      }
      controls.update();
      renderer.render( scene, camera );
      labelRenderer.render( scene, camera );
    }
    animate();
}