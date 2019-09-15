const soundButton = document.querySelector("#sound-button");
const filterSlider = document.querySelector("#muffler-slider");

let context;
let oscillator;
let filter;


function createFilter() {
  filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.setValueAtTime(1.5, 0);
  filter.frequency.setValueAtTime(400, 0);
  filter.connect(context.destination);
}


async function toggleSound() {
  if (!context) {
    context = await new AudioContext();
    await context.resume();
    createFilter();
  }

  if (oscillator) {
    oscillator.disconnect();
    oscillator = null;
  } else {
    oscillator = context.createOscillator();
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(0, 440);
    oscillator.connect(filter);
    oscillator.start(0);
  }

}


function keyListener(event) {
  if (event.key === "s") {
    toggleSound();
  }
}


filterSlider.addEventListener("input", event => {
  const value = parseFloat(event.target.value);
  const frequency = value * 80;
  filter.frequency.setValueAtTime(frequency, 0);
});


soundButton.addEventListener("click", toggleSound);
document.addEventListener("keydown", keyListener);
document.addEventListener("keyup", keyListener);