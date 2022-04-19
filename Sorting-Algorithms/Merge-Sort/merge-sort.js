var values = [];
var numLines = 100;

function setup() {
  createCanvas(900, 600);
  // colorMode(HSB, height);
  for (i = 0; i < numLines; i++) {
    values[i] = (round(random(height)));
  }
  frameRate(1);
 }

var depth = 1;
function draw() {
  background(255);
  depth++;
  for (i = 0; i < values.length; i++) {
    let col = color(1);
    stroke(col);
    // fill(col);
    var location = map(i, 0, values.length, 0, width);
    rect(location, height - values[i], width/numLines, height);
  } 
  if (depth > 10){
   noLoop();
  }
  values = mergeSort(values, depth);
}

function mergeSort(a, d) {
  if (a.length <= 1) {
    return a;
  }
  d--;
  if (d < 1){
    return a;
  }
  var mid = Math.round((a.length / 2));
  var left = a.slice(0, mid);
  var right = a.slice(mid);
  return merge(mergeSort(left,d), mergeSort(right, d));
}

function merge(left, right) {
  sleep(70)
  sorted = [];
  while (left && left.length > 0 && right && right.length > 0) {
    if (left[0] <= right[0]) {
      sorted.push(left.shift());
    }
    else {
      sorted.push(right.shift());
    }
  }
  return sorted.concat(left, right);
}

// custom helper function to deliberately slow down
// the sorting process and make visualization easy
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}