// Grab references to each control.
const soundButton = document.querySelector("#sound-button");
const filterSlider = document.querySelector("#muffler-slider");


let context;
let oscillator;
let filter;


function linMap(value, iMin, iMax, oMin, oMax) {
  const fraction = (value - iMin) / (iMax - iMin);
  return oMin + fraction * (oMax - oMin);
}


function changeFilter(value) {
  if (!filter) return;
  const newValue = linMap(value, 0, 100, 0, 8000);
  console.log(newValue);
  filter.frequency.setValueAtTime(newValue, context.currentTime);
}


function createFilter() {
  filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.gain.setValueAtTime(3, 0);
  filter.Q.setValueAtTime(1.5, 0);
  filter.frequency.setValueAtTime(4000, 0);
  filter.connect(context.destination);
}


async function toggle() {
  if (context == null) {
    context = new AudioContext();
    await context.resume();
    await createFilter();
  }

  if (oscillator) {
    oscillator.disconnect();
    oscillator = null;
  }
  else {
    oscillator = context.createOscillator();
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(0, 440);
    oscillator.connect(filter);
    oscillator.start(0);
  }
}


soundButton.onclick = toggle;
filterSlider.addEventListener("input", event => {
  const value = parseFloat(event.target.value);
  changeFilter(value);
});


function keyListener(event) {
  if (event.key === "s") {
    toggle();
  }
}

document.addEventListener("keydown", keyListener);
document.addEventListener("keyup", keyListener);