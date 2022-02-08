function setup() {
  createCanvas(500, 500);
}

function draw() {
  // background(150);
  // fill(0);
  valuesS = ["4ssssssssss1", "54", "65","76", "130", "10","20", "20", "20", "0", "2"]
  values = [41, 54, 65, 76, 130, 10,20,20,20,0,2];
  labelledColouredRotatedBarChart(valuesS, values)
  // max = Math.max(...values)
  // console.log(max)
  // barChart(values)
  xValuesS = ["Test1", "Test2", "Test3"]
  yValuesS = [41, 54, 65];
  // labelledColouredRotatedBarChart(xValuesS, yValuesS)
}

function barChart(yValues){
  if(yValues.length>0){
    max = Math.max(...yValues)
    console.log(max)
    for (var i = 0; i < yValues.length; i++) {
      rect(i * 25 + 5, max-yValues[i], 20, yValues[i])
    }
  }
  else{
    console.log("Empty array given.")
  }
}

function labelledBarChart(xValues, yValues){
  if(xValues.length==yValues.length){
    max = Math.max(...yValues)
    for (var i = 0; i < yValues.length; i++) {
      //X, Y, Width (CONST), Height (YValue)
      rect(i * 25 + 5, max-yValues[i], 20, yValues[i])
      textSize(6);
      text(xValues[i], i * 25 + 12.5, max + 10)
    }
  }
  else{
    console.log("Input sizes do not match.")
  }
}

function labelledColouredBarChart(xValues, yValues){
  if(xValues.length==yValues.length){
    max = Math.max(...yValues)
    for (var i = 0; i < yValues.length; i++) {
      // Returns a random integer from 0 to 255
      let code = Math.floor(Math.random() * 256); //Greyscale generator
      let c = color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
      // let c = code;
      fill(c);
      // noStroke(); //DISABLES OUTLINE
      //X, Y, Width (CONST), Height (YValue)
      rect(i * 25 + 5, max-yValues[i], 20, yValues[i])
      textSize(6);
      fill(0);
      text(xValues[i], i * 25 + 12.5, max + 10)
    }
    noLoop() //Stops draw()
  }
  else{
    console.log("Input sizes do not match.")
  }
}

function drawRotatedX(i, text, max){
  let angle = radians(45);
  let xVal = createGraphics(100,50)
  xVal.textSize(6);
  xVal.textStyle(BOLD);
  xVal.fill(0);
  xVal.translate(10,0);
  xVal.rotate(angle);
  xVal.text(text, 0, 10)
  image(xVal, i * 25 + 10, max);
}

function labelledColouredRotatedBarChart(xValues, yValues){
  if(xValues.length==yValues.length){
    max = Math.max(...yValues)
    for (var i = 0; i < yValues.length; i++) {
      // Returns a random integer from 0 to 255
      let c = color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
      fill(c);
      // noStroke(); //DISABLES OUTLINE
      //X, Y, Width (CONST), Height (YValue)
      rect(i * 25 + 5, max-yValues[i], 20, yValues[i])
      drawRotatedX(i, xValues[i], max)
    }
    noLoop(); //Stops draw()
  }
  else{
    console.log("Input sizes do not match.")
  }
}
