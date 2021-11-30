function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(150);
  fill(0);
  values = [41, 54, 65, 76, 13];
  for (var i = 0; i < values.length; i++) {
    rect(i * 25 + 10, 490-values[i], 20, values[i])
  }
}