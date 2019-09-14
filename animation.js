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


document.querySelector("#sound-button")
  .addEventListener("click", e => {
  if (stop) {
    stop = false;
    e.target.classList.add(["active"]);
    requestAnimationFrame(animate);
  } else {
    stop = true;
    e.target.classList.remove(["active"]);
  }
});