const canvas = document.querySelector("#wave");
const context = canvas.getContext("2d");
const mid = 75/2;

context.strokeStyle = "white";
context.lineWidth = 4;
let offset = 0;
let timestamp;

let stop = true;

function animate(newTime) {
  const timeDelta = timestamp ? newTime - timestamp : 0;
  timestamp = newTime;
  offset = offset - timeDelta * 0.003 % 100;
  context.clearRect(0, 0, 75, 75);
  context.beginPath();
  for (let i=0; i<75; i++) {
    const angle = i/75 * 2 * Math.PI;
    const sin = Math.sin(angle+offset);
    const value = mid + sin * mid * 0.5;
    context.lineTo(i, value);
    context.stroke();
  }
  if (!stop) requestAnimationFrame(animate);
}
requestAnimationFrame(animate);


const button = document.querySelector("#sound-button");


function toggle() {
  if (stop) {
    stop = false;
    console.log(button);
    button.classList.add(["active"]);
    timestamp = null;
    requestAnimationFrame(animate);
  } else {
    stop = true;
    button.classList.remove("active");
  }
}

function animateKeyListener(event) {
  if (event.key === "s") {
    toggle()
  }
}


document.querySelector("#sound-button")
  .addEventListener("click", toggle);


document.addEventListener("keydown", animateKeyListener);
document.addEventListener("keyup", animateKeyListener);



let active = false;
const batButton = document.querySelector("#batcave-button");
batButton.addEventListener("click", event => {
  if (active) {
    batButton.classList.remove("active");
    active = false;
  } else {
    batButton.classList.add("active");
    active = true;
  }
});