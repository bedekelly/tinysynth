const soundButton = document.querySelector("#sound-button");
const filterSlider = document.querySelector("#muffler-slider");
const batcaveButton = document.querySelector("#batcave-button");

let context;
let oscillator;
let filter;
let reverb;
let reverbConnected = false;


function createFilter() {
  filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.setValueAtTime(1.5, 0);
  filter.frequency.setValueAtTime(400, 0);
  filter.connect(context.destination);
}


async function fetchBatcaveAudio() {
  const response = await fetch("batcave.wav");
  const buffer = await response.arrayBuffer();
  return context.decodeAudioData(buffer);
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


async function toggleSound(frequency) {
  if (!context) {
    context = await new AudioContext();
    await context.resume();
    createFilter();
    await createReverb()
  }

  if (oscillator) {
    oscillator.disconnect();
    oscillator = null;
  } else {
    oscillator = context.createOscillator();
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(frequency, 0);
    oscillator.connect(filter);
    oscillator.start(0);
  }

}


function keyListener(event) {
  switch(event.key) {
    case "a": toggleSound(440); break;
    case "s": toggleSound(493.88); break;
    case "e": toggleSound(523.25); break;
    case "f": toggleSound(587.32); break;
    case "g": toggleSound(659.25); break;
    default: break;
  }
}


filterSlider.addEventListener("input", event => {
  const value = parseFloat(event.target.value);
  const frequency = value * 80;
  filter.frequency.setValueAtTime(frequency, 0);
});


soundButton.addEventListener("click", () => toggleSound(440));
document.addEventListener("keydown", keyListener);
document.addEventListener("keyup", keyListener);
batcaveButton.addEventListener("click", toggleReverb);