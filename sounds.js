// Grab references to each control.
const soundButton = document.querySelector("#sound-button");



let context;
let oscillator;


async function toggle() {
  if (context == null) {
    context = new AudioContext();
    await context.resume();
  }

  if (oscillator) {
    oscillator.disconnect();
    oscillator = null;
  }
  else {
    oscillator = context.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(0, 440);
    oscillator.connect(context.destination);
    oscillator.start(0);
  }
}


soundButton.onclick = toggle;
