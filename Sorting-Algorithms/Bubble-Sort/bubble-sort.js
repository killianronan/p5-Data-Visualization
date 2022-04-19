
let values = [];
let states = [];
let i = 0;
let j = 0;

// The statements in the setup() function
// execute once when the program begins
// The array is filled with random values in setup() function.
function setup() {
  createCanvas(720, 400);
  for(let i = 0;i<width/8;i++){
    values.push(random(height));
    states.push(-1)
  }
  frameRate(20)
}

// The statements in draw() function are executed until the
// program is stopped. Each statement is executed in
// sequence and after the last line is read, the first
// line is executed again.
function draw() {
  background(255);
  bubbleSort();
  simulateSorting();
}

// The bubbleSort() function sorts taking 8 elements of the array
// per frame. The algorithm behind this function is 
// bubble sort.
async function bubbleSort() {
  // await sleep(250);
  states[i] = -1;
  states[j] = -1;
  for(let k = 0;k<5;k++){
    if(i<values.length){
      let temp = values[j];
      if(values[j] > values[j+1]){
        // states[j] = 0;
        values[j] = values[j+1];
        values[j+1] = temp;
      }
      else{
        states[i] = -1;
      }
      states[j] = -1;
      j++;
      
      if(j>=values.length-i-1){
        states[j] = -1;
        j = 0;
        states[i] = -1;
        i++;
      }
      else{
        //current i
        states[i] = 0;
        states[j] = 0;
      }
    }
    else{
      noLoop();
    }
  }
}

// The simulateSorting() function helps in animating
// the whole bubble sort algorithm
// by drawing the rectangles using values
// in the array as the length of the rectangle.
function simulateSorting(){
  for(let i = 0;i<values.length;i++){
    // stroke(0);
    if(states[i]==0){
      fill('red');
    }
    else{
      fill(255);
      stroke(0)
    }
    rect(i*8 , height, 8, -values[i]);
   }
}

// custom helper function to deliberately slow down
// the sorting process and make visualization easy
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}