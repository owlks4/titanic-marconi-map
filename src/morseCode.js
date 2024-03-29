import * as Tone from 'tone'
import {TIMESCALE} from "./consts.js"

const osc = new Tone.Synth({
    volume: -10,
    frequency:440,
    envelope : {
        attack : 0.005 ,
        decay : 0.1 ,
        sustain : 0.3 ,
        release : 0.005
    } ,
    oscillator: {
        modulationType: "sine"
    }
}).toDestination();                                                

const morseCodeDictionary = {
    "A": ".-",
    "B": "-...",
    "C": "-.-.",
    "D": "-..",
    "E": ".",
    "F": "..-.",
    "G": "--.",
    "H": "....",
    "I": "..",
    "J": ".---",
    "K": "-.-",
    "L": ".-..",
    "M": "--",
    "N": "-.",
    "O": "---",
    "P": ".--.",
    "Q": "--.-",
    "R": ".-.",
    "S": "...",
    "T": "-",
    "U": "..-",
    "V": "...-",
    "W": ".--",
    "X": "-..-",
    "Y": "-.--",
    "Z": "--..",
    "0": "-----",
    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----.",
    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "'": ".----.",
    "!": "-.-.--",
    ":": "---...",
    " ": "/"
}

const shipNameAbbreviations = {
    "received":"RD",
    "end of message":"TIS",
    "attention all stations":"CQ",
    "all stations":"CQ",
    "stop talking":"DDD",
    "this is":"DE",
    "old man":"OM",
    "Titanic":"MGY",
    "Cape Race":"MCE",
    "Sable Island":"MSD",
    "Cape Cod":"MCC",
    "Amerika":"DDR",
    "Asian":"MKL",
    "Baltic":"MBC",
    "Birma":"SBA",
    "Californian":"MWL",
    "Cincinnati":"DDC",
    "Carpathia":"MPA",
    "Frankfurt":"DFT",
    "Ypiranga":"DFR",
    "La Provence":"MLP",
    "Mount Temple":"MLQ",
    "Minnehaha":"MMA",
    "Minnewaska":"MNW",
    "Noordam":"MRA",
    "Olympic":"MKC",
    "Prinz Friedrich Wilhelm":"DKF",
    "Virginian":"MGN",
    "Parisian":"MZH",
    "Antillian":"MJL"
}

function toSentenceCase(str) {
    return str.replace(/\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

function replaceShipNameAbbreviations(text){
    Object.keys(shipNameAbbreviations).forEach((shipName) => {
        text = text.replaceAll(shipName.toUpperCase(),shipNameAbbreviations[shipName])
    })
    return text;
}

function toMorseCodeFromText(text){
    let morse = "";
    text = text.toUpperCase();
    text = replaceShipNameAbbreviations(text);
    for (let i = 0; i < text.length; i++){
        morse += morseCodeDictionary[text[i]] + " ";
    }
    return morse;
}

let currentlyPlayingMorseMessage = null;

async function playMorseCodeAsTone(morse, message, overrideTimeScale){
    Tone.start();
    currentlyPlayingMorseMessage = message;

    let DIT_LENGTH = 30;

    for (let i = 0; i < morse.length; i++){
        switch (morse[i]){
            case ".":
                osc.triggerAttack("C4", Tone.now())
                await new Promise(r => setTimeout(r, DIT_LENGTH / (overrideTimeScale ? 1 : TIMESCALE)));
                osc.triggerRelease(Tone.now())
                break;
            case "-":
                osc.triggerAttack("C4", Tone.now())
                await new Promise(r => setTimeout(r, (DIT_LENGTH * 3) / (overrideTimeScale ? 1 : TIMESCALE)));
                osc.triggerRelease(Tone.now())
                break;
            case "/":
                await new Promise(r => setTimeout(r, DIT_LENGTH / (overrideTimeScale ? 1 : TIMESCALE)));
                break;
            default:
                break;
        }
        if (currentlyPlayingMorseMessage != message){ //if another message has begun playing, cease this one
            return;
        }
        await new Promise(r => setTimeout(r, (DIT_LENGTH * 3) / (overrideTimeScale ? 1 : TIMESCALE)));
    }
}

export {toMorseCodeFromText,shipNameAbbreviations, playMorseCodeAsTone}
