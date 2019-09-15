// Grab references to each control.
const soundButton = document.querySelector("#sound-button");
const filterSlider = document.querySelector("#muffler-slider");
const batcaveButton = document.querySelector("#batcave-button")
const BATCAVE_AUDIO_URL = "./batcave.wav";

let context;
let oscillator;
let filter;
let reverb;
let reverbConnected = false;


function linMap(value, iMin, iMax, oMin, oMax) {
  const fraction = (value - iMin) / (iMax - iMin);
  return oMin + fraction * (oMax - oMin);
}


function setFilterFrequency(value) {
  if (!filter) return;
  const newValue = linMap(value, 0, 100, 0, 8000);
  filter.frequency.setValueAtTime(newValue, context.currentTime);
}


async function fetchBatcaveAudio() {
  const response = await fetch(BATCAVE_AUDIO_URL);
  const arrayBuffer = await response.arrayBuffer();
  return await context.decodeAudioData(arrayBuffer);
}


function createFilter() {
  filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.gain.setValueAtTime(3, 0);
  filter.Q.setValueAtTime(1.5, 0);
  filter.frequency.setValueAtTime(800, 0);
  filter.connect(context.destination);
}


async function createReverb() {
  reverb = context.createConvolver();
  reverb.buffer = await fetchBatcaveAudio();
  filter.connect(reverb);
}


function toggleReverb() {
  if (reverbConnected) {
    reverb.disconnect();
    reverbConnected = false;
  } else {
    reverb.connect(context.destination);
    reverbConnected = true;
  }
}


async function toggle() {
  if (context == null) {
    context = new AudioContext();
    await context.resume();
    await createFilter();
    await createReverb();
  }

  if (oscillator) {
    oscillator.disconnect();
    oscillator = null;
  }
  else {
    oscillator = context.createOscillator();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(0, 440);
    oscillator.connect(filter);
    oscillator.start(0);
  }
}


soundButton.addEventListener("click", toggle);
filterSlider.addEventListener("input", event => {
  const value = parseFloat(event.target.value);
  setFilterFrequency(value);
});


function keyListener(event) {
  if (event.key === "s") {
    toggle();
  }
}

document.addEventListener("keydown", keyListener);
document.addEventListener("keyup", keyListener);

batcaveButton.addEventListener("click", toggleReverb);