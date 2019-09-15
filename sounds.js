const soundButton = document.querySelector("#sound-button");


let context;
let oscillator;


async function toggleSound() {
  if (!context) {
    context = await new AudioContext();
    await context.resume();
  }

  if (oscillator) {
    oscillator.disconnect();
    oscillator = null;
  } else {
    oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(0, 440);
    oscillator.connect(context.destination);
    oscillator.start(0);
  }

}


function keyListener(event) {
  if (event.key === "s") {
    toggleSound();
  }
}


soundButton.addEventListener("click", toggleSound);
document.addEventListener("keydown", keyListener);
document.addEventListener("keyup", keyListener);