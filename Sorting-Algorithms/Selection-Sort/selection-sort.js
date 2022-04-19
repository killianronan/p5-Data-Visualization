let values = [];
let states = [];
let w = 8;
let simulationSpeed = 10;

let a = 0;
let b = a + 1;
let positionMin = a;

function setup() {
  createCanvas(720, 400);
  for (let i = 0; i < width / w; i++) {
    values.push(floor(random(height)));
    states.push(-1);
  }
}

function draw() {
  background(255);
  selectionSort();
  simulateSorting();
}

function selectionSort() {
  for (let k = 0; k < simulationSpeed; k++) {
    if (a < values.length) {
      if (values[positionMin] > values[b]) {
        states[a] = 0;
        positionMin = b;
      }
      b++;

      if (b >= values.length) {
        let temp = values[a];
        values[a] = values[positionMin];
        values[positionMin] = temp;

        a++;
        b = a + 1;
        positionMin = a;
        states[a] = 0;

      }
    } else {
      noLoop();
    }
  }
}

function simulateSorting() {
  for (let i = 0; i < values.length; i++) {
    stroke(0);
    if(states[i]==-1){
      fill(255,0,0);
    }
    else{
      fill('lightblue');
    }
    rect(i * w, height, w, -values[i]);
  }
}