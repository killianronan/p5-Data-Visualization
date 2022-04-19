
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
  insertionSort();
  simulateSorting();
}

// The bubbleSort() function sorts taking 8 elements of the array
// per frame. The algorithm behind this function is 
// bubble sort.
function bubbleSort() {
  for(let k = 0;k<8;k++){
    if(i<values.length){
      let temp = values[j];
      if(values[j] > values[j+1]){
        values[j] = values[j+1];
        values[j+1] = temp;
      }
      j++;
      
      if(j>=values.length-i-1){
        j = 0;
        i++;
      }
    }
    else{
      noLoop();
    }
  }
}
// Function to sort an array using insertion sort
function insertionSort() 
{ 
    key = values[i]; 
    j = i - 1; 

    /* Move elements of arr[0..i-1], that are 
    greater than key, to one position ahead 
    of their current position */
    while (j >= 0 && values[j] > key)
    { 
      states[j] = 0;
      values[j + 1] = values[j]; 
        j = j - 1; 
    } 
    values[j + 1] = key; 
    i++;
} 
// The simulateSorting() function helps in animating
// the whole bubble sort algorithm
// by drawing the rectangles using values
// in the array as the length of the rectangle.
function simulateSorting(){
  for(let i = 0;i<values.length;i++){
    stroke(0);
    if(states[i]==-1){
      fill(255);
    }
    else{
      fill('lightblue');
    }
    stroke(0)
    rect(i*8 , height, 8, -values[i]);
   }
}