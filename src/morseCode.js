const morseCodeDictionary = {
    "a": ".-",
    "b": "-...",
    "c": "-.-.",
    "d": "-..",
    "e": ".",
    "f": "..-.",
    "g": "--.",
    "h": "....",
    "i": "..",
    "j": ".---",
    "k": "-.-",
    "l": ".-..",
    "m": "--",
    "n": "-.",
    "o": "---",
    "p": ".--.",
    "q": "--.-",
    "r": ".-.",
    "s": "...",
    "t": "-",
    "u": "..-",
    "v": "...-",
    "w": ".--",
    "x": "-..-",
    "y": "-.--",
    "z": "--..",
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
    " ": "/"
}

const shipNameAbbreviations = {
    "stop talking":"ddd",
    "this is":"de",
    "old man":"om",
    "titanic":"mgy",
    "cape race":"mce",
    "sable island":"msd",
    "cape cod":"mcc",
    "amerika":"ddr",
    "asian":"mkl",
    "baltic":"mbc",
    "birma":"sba",
    "californian":"mwl",
    "cincinnati":"ddc",
    "carpathia":"mpa",
    "frankfurt":"dft",
    "la provence":"mlp",
    "mount temple":"mlq",
    "minnehaha":"mma",
    "minnewaska":"mnw",
    "noordam":"mra",
    "olympic":"mkc",
    "prinz friedrich wilhelm":"dkf",
    "virginian":"mgn"
}

function replaceShipNameAbbreviations(text){
    Object.keys(shipNameAbbreviations).forEach((shipName) => {
        text = text.replaceAll(shipName,shipNameAbbreviations[shipName])
    })
    return text;
}

function toMorseCodeFromText(text){
    let morse = "";
    text = text.toLowerCase();
    text = replaceShipNameAbbreviations(text);
    for (let i = 0; i < text.length; i++){
        morse += morseCodeDictionary[text[i]] + " ";
    }
    return morse;
}

export {toMorseCodeFromText}
