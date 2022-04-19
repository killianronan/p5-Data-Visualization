function setup() {
  createCanvas(500, 500);
}

function draw() {
  valuesS = ["Portugal", "France", "Spain","England", "Belgium", "Ireland","Norway", "Italy"]
  values = [41, 54, 65, 76, 90, 10,20,20];
  labelledColouredRotatedBarChart(valuesS, values)
  // max = Math.max(...values)
  // console.log(max)
  // barChart(values)
  xValuesS = ["Test1", "Test2", "Test3"]
  yValuesS = [41, 54, 65];
  // labelledColouredRotatedBarChart(xValuesS, yValuesS)
  // valuesS = ["bar 4", "bar 92", "bar 22","bar 72212", "bar 553", "bar 722121","bar 76", "bar 7", "bar 6", "bar 2", "bar 92"]
  // values = [62, 54, 65, 76, 130, 10, 20, 200, 20, 10, 22];
  // labelledColouredRotatedBarChart(valuesS, values)
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
  image(xVal, i * 25 + 20, max);
}

function labelledColouredRotatedBarChart(xValues, yValues){
  if(xValues.length==yValues.length){
    max = Math.max(...yValues)
    line(9, 20, 9, max+20);
    // for(let index = 0; index<max/5; index++){
    //   line(9, 20, 9, max+20);
    //      // Draw the x axis labels
    //     let label = map(i, 0, max/5, 0, max)
    //     strokeWeight(0)
    //     textAlign(CENTER)
    //     textSize(10)
    //     fill(0)
    //     let x = map(label, this.xRange[0], this.xRange[1], this.chartX, this.chartX + this.chartW - this.padding)
    //     text(round(label) + "", x, this.xLine + (this.padding * 0.7))
    //     strokeWeight(2)
    //     line(x, this.xLine + 3, x, this.xLine - 3)
    // }
    // Draw the y axis labels5
    for (let i = 0; i < max/10; i++) {
      let label = map(i, 0, max/5, 0, max)
      console.log(label)
      strokeWeight(0)
      textAlign(RIGHT, CENTER)
      textSize(10)
      fill(0)
      text(round(label), 5, max-label);
      strokeWeight(2)
      // line(max + 3, y, max - 3, y)
    }
    line(9, max+20, yValues.length*25 +15, max+20);
    textSize(6);
    textStyle(BOLD);
    print(max)
    text("0", 0, max+20)
    text(max, 0, 25)
    for (var i = 0; i < yValues.length; i++) {
      // Returns a random integer from 0 to 255
      let c = color(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
      fill(c);
      // noStroke(); //DISABLES OUTLINE
      //X, Y, Width (CONST), Height (YValue)
      rect(i * 25 + 15, max-yValues[i]+20, 20, yValues[i])
      drawRotatedX(i, xValues[i], max+20)
    }
    noLoop(); //Stops draw()
  }
  else{
    console.log("Input sizes do not match.")
  }
}
