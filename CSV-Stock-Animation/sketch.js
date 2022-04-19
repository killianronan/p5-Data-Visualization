var sketch = function(p){

  p.W = 680; p.H=250
  p.time = 680;
  p.step = p.W/p.time;
  p.data = [];
  p.values = [];
  p.myFont, p.pos, p.fy, p.c, p.point, p.colors, p.maxH, p.l, p.f;
  p.csvmax, p.csvmin, p.dataIndex, p.count = 0;
  p.dataIndex= 0;
  p.fileLoaded = false;

  p.preload = function(){
    p.myFont = p.loadFont('Montserrat-Regular.otf');
  }
  p.setup = function(){
    p.createCanvas(p.W+100, p.H+100);
    p.fill(255, 30, 70, 90);
  
    //Increase and decrease framerate to change animation speed 
    p.frameRate(50)
    
    // x positions mapped to fit canvas
    p.posx = Float32Array.from({ length: p.time }, (_, i) => p.map(i, 0, p.time, 0, p.W));
    
    // map stock price to graph height
    p.fy = _ => p.map(_, 0, 2, p.H, 2);
  
    // colormap
    p.colors = _ => p.map(_, 0, 2, 0, 255);
    // read in data and reformat it
    // Data taken from: https://www.nasdaq.com/market-activity/quotes/historical
    p.loadTable("AMD5Year.csv", "csv", function (table) {
      // get the header names
      p.xField = table.getColumn(0)[0];
      p.yField = table.getColumn(1)[0];
  
      // get the columns
      for (var i = 0; i < 6; i++) {
          var column = table.getColumn(i).slice(1, table.getColumn(0).length);
          column = column.map(function(num) {
            if(num.startsWith('$')){
              num = num.slice(1);
            }
            else if(num.includes('/')){
              return num;
            }
            return parseFloat(num);
          });
          p.values.push(column);
      }
      p.values[0] = p.values[0].reverse();
      p.values[1] = p.values[1].reverse();
      p.values[2] = p.values[2].reverse();
      p.values[3] = p.values[3].reverse();
      p.values[4] = p.values[4].reverse();
      p.values[5] = p.values[5].reverse();
      p.csvmax = Math.max.apply(null, p.values[1])
      p.csvmin = Math.min.apply(null, p.values[1])
      // print("Max: ", p.csvmax)
      // print("Min: ", p.csvmin)
  
      // set the flag to be true
      p.fileLoaded = true;
    });
  }
  p.drawAxes = function(){
  }
  p.draw = function(){
    if(p.fileLoaded){
      p.background(155);
      p.push();
      p.strokeWeight(10);
      p.stroke(0)
      p.fill(155);
      p.rect(0, 0, p.width, p.height);
      p.pop();
      
      p.drawAxes();
      
      // length of data list -1 (to access last item of data list)
      p.l = p.data.length -1 ;
  
      // frameCount
      p.f = p.frameCount;
      
      let normalizedDatapoint = (p.values[1][p.dataIndex] - p.csvmin) / (p.csvmax - p.csvmin);
      p.point = normalizedDatapoint;
      // console.log(p.dataIndex)
      p.dataIndex++;
      // print(point)
      
      // store that number at each step (the x-axis tick values)
      if (p.f&p.step) {
        p.data.push(p.point);
        p.count += 1;
      }
      
      // iterate over data list to rebuild curve at each frame
      for (let i = 0; i < p.l; i++) {
        
        p.y1 = p.fy(p.data[i]);
        p.y2 = p.fy(p.data[i+1]);
        p.x1 = p.posx[i];
        p.x2 = p.posx[i+1];
        p.c1 = p.colors(p.data[i]);
  
        // vertical lines (x-values)
        p.strokeWeight(0.2);
        p.stroke(255, p.c1, p.c1);
        p.line(p.x1, p.H, p.x1, p.y1 + 2);
        
        // polyline
        p.strokeWeight(2);
        p.stroke(255, p.c1, p.c1);
        p.line(p.x1, p.y1, p.x2, p.y2);
        if(i==3){
          p.stroke(0);
          // console.log(p.dataIndex)
          p.displayMetadata(p.dataIndex);
        }
        if(i==7){
          p.display7(p.dataIndex);
        }
      }
      
      // draw ellispe at last data point
      if (p.count > 1) {
        p.ellipse(p.posx[p.l], p.fy(p.data[p.l]), 4, 4);
      }
      
      // reset data and count
      if (p.count%p.time===0) {
        // print("data", p.data)
        p.data = [];
        p.count = 0;
      }
      //end
      if(p.dataIndex==p.values[1].length-1){
        // print("HERE")
        // print("data", p.data)
        p.data = [];
        p.count = 0;
        p.dataIndex=0;
        // noLoop();s
      }
    }
  }
  p.display7 = function display7(index){
    p.stroke(0);
    let sum = p.values[3][index]+p.values[3][index-1]+p.values[3][index-2]+p.values[3][index-3]+p.values[3][index-4]+p.values[3][index-5]+p.values[3][index-6]
    let average = (sum/7).toFixed(2);
    p.text('7 Day Average: $' + average, 400, p.H+90);
  }
  p.displayMetadata = function (index){
    p.stroke(0);
    p.textSize(20)
    p.textFont(p.myFont);
    // console.log(p.values)
    // console.log(index)
    if(p.values[0][index].startsWith("01")){
      p.text(' January ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("02")){
      p.text(' February ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("03")){
      p.text(' March ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("04")){
      p.text(' April ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("05")){
      p.text(' May ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("06")){
      p.text(' June ' +  p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("07")){
      p.text(' July ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("08")){
      p.text(' August ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("09")){
      p.text(' September ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("10")){
      p.text(' October ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("11")){
      p.text(' November ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("12")){
      p.text(' December ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    p.stroke(0);
    p.text('Stock Opening Price: $' + p.values[3][index], 200, p.H+30);
    p.text('Stock Closing Price: $' + p.values[1][index],200, p.H+60);
    p.text('Daily High: $' + p.values[4][index], 500, p.H+30);
    p.text('Daily Low: $' + p.values[5][index], 500, p.H+60);
  
    p.push();
    p.stroke(0);
    p.textSize(40)
    p.text('AMD 5 Year Animation', 180, 50);
    p.pop();
  }
}
var amd = new p5(sketch, "stock");

var sketchScat = function(p){
  p.WIDTH = 800
  p.HEIGHT = 600;
  p.fileLoaded = false;
  p.PADDING = 100;
  p.TICKWIDTH = 10;
  p.xField = "";
  p.yField = "";
  p.values = [];
  p.sliderX = null;
  p.sliderY = null;
  p.maxX, p.maxY, p.xArr, p.minY, p.maxY, p.yArr = null;

  p.setup = function(){
          // set the canvas size
      p.createCanvas(p.WIDTH, p.HEIGHT);

      // read in data and reformat it
      p.loadTable("spotify.csv", "csv", function (table) {
      // get the header names
      p.xField = table.getColumn(0)[0];
      p.yField = table.getColumn(1)[0];

      // get the columns
      for (var i = 0; i < 2; i++) {
          var column = table.getColumn(i).slice(1, table.getColumn(0).length);
          if(i==0){
              column = column.map(function(num) {
                  let x = new Date(num);
                  x = x.valueOf();
                  return x;
              });
          }
          else{
              column = column.map(function(num) {
                  return parseFloat(num);
              });
          }
          p.values.push(column);
      }

      // set the flag to be true
      p.fileLoaded = true;

      // get the max values for 2 fields
      p.xArr = p.values[0];
      p.yArr = p.values[1];
      p.maxX = Math.max.apply(Math, p.xArr);
      p.maxY = Math.max.apply(Math, p.yArr);
      p.minX = Math.min.apply(Math, p.xArr);
      p.minY = Math.min.apply(Math, p.yArr);

      // create the slider
      p.sliderX = p.createSlider(p.minX, p.maxX, p.maxX);
      p.sliderY = p.createSlider(p.minY, p.maxY, p.maxY);
      p.sliderX.position(-1000, 50);
      p.sliderY.position(-1000, 100);
  });
  }
  p.draw = function(){
  // if file haven't been completed loaded, return
  if (!p.fileLoaded) {
      return;
  }
  

  // start drawing
  p.background(255, 255, 255);
  // console.log("HERE")
  // draw the axes
  p.drawAxes();

  // draw labels on slider
  // p.text(p.xField + " >= " + p.sliderX.value(), p.WIDTH-180, 40);
  // p.text(p.yField + " >= " + p.sliderY.value(), p.WIDTH-180, 90);

  // draw labels on x-axis
  var tickGap = (p.WIDTH - p.PADDING * 2) / 5;
  let indexToUse = 0

  for (var i = 0; i <= 5; i++) {
      let dateToDisplay = new Date(p.xArr[indexToUse])
      p.text(dateToDisplay.toDateString(), p.PADDING + i * tickGap + 2, p.HEIGHT - p.PADDING + p.TICKWIDTH + 5);
      indexToUse+=Math.floor((p.maxX-p.sliderX.value())/5);
  }

  // draw labels on the axes
  tickGap = (p.HEIGHT - p.PADDING * 2) / 5;
  for (i = 1; i <= 5; i++) {
      p.text(p.sliderY.value() * i / 5.0, p.PADDING - 60, p.PADDING + (5 - i) * tickGap - 4);
  }

  // get the selected points
  var selectedPoints = [];
  for (i = 0; i < p.xArr.length; i++) {
      if (p.xArr[i] <= p.sliderX.value() && p.yArr[i] <= p.sliderY.value()) {
          selectedPoints.push(p.createVector(p.xArr[i], p.yArr[i]));
      }
  }

  // draw the selected points
  for (i = 0; i < selectedPoints.length; i++) {
      var point = selectedPoints[i];
      var x1 = p.PADDING;
      var x2 = p.WIDTH - p.PADDING;
      var xPos = p.map(point.x, p.minX, p.sliderX.value(), x1, x2);
      var y1 = p.HEIGHT - p.PADDING;
      var y2 = p.PADDING;
      var yPos = p.int(p.map(point.y, 0, p.sliderY.value(), y1, y2));  
      p.noStroke();
      p.fill(150, 0, 0); 
      p.ellipse(xPos, yPos, 8, 8);
  }

  // draw the hover infomation on points
  for (i = 0; i < selectedPoints.length; i++) {
      var point = selectedPoints[i];
      var x1 = p.PADDING;
      var x2 = p.WIDTH - p.PADDING;
      var xPos = p.map(point.x, p.minX, p.maxX, x1, x2);
      // console.log(point.x)
      var y1 = p.HEIGHT - p.PADDING;
      var y2 = p.PADDING;
      var yPos = p.int(p.map(point.y, 0, p.maxY, y1, y2));  
      
      // add the tooltip for hover over effect
      if (p.sq(p.mouseX - xPos) + p.sq(p.mouseY - yPos) < 80) {
          p.fill(255, 80, 255); 
          p.ellipse(xPos, yPos, 10, 10);
          let displayDate = new Date(point.x);
          p.text(displayDate.toDateString() + ", " + point.y, mouseX + 15, mouseY);
      }
  }
}


  p.drawAxes = function() {
  // set the colors
  p.stroke(100, 100, 100);
  p.strokeWeight(1);
  p.fill(100, 100, 100);

  // draw the title of the bar graph
  p.textSize(20);
  p.text("Scatter plot of Spotify streams of "+ p.yField + " over time", p.WIDTH / 2 - 300, p.PADDING / 2);    
  p.textSize(12);

  // draw the axis
  var x1 = p.PADDING;
  var x2 = p.WIDTH - p.PADDING;
  var y1 = p.HEIGHT - p.PADDING;
  var y2 = y1;
  p.line(x1, y1, x2, y2);

  // draw the tick on x-axis (for scatterplot)
  var tickGap = (p.width - p.PADDING * 2) / 5;
  for (var j = 0; j < 5; j++) {
      p.line(x1 + (j + 1) * tickGap, y1, x1 + (j + 1) * tickGap, y1 + p.TICKWIDTH);
      p.strokeWeight(0.1);
      p.line(x1 + (j + 1) * tickGap, y1, x1 + (j + 1) * tickGap, 100);
  }
  

  // draw x-axis label
  p.text(p.xField, x2, y2 - 10);

  // draw the y-axis
  x1 = p.PADDING;
  x2 = x1;
  y1 = p.HEIGHT - p.PADDING;
  y2 = p.PADDING;
  p.line(x1, y1, x2, y2);

  // draw the ticks on y-axis
  tickGap = (y1 - y2) / 5;
  for (var j = 0; j < 5; j++) {
      p.line(x1, y2 + j * tickGap, x1 - p.TICKWIDTH, y2 + j * tickGap);
      p.strokeWeight(0.1);
      p.line(x1, y2 + j * tickGap, 700, y2 + j * tickGap);
  }

  // draw y-axis label
  p.text("Streams", x1, y2 - 15);
  }
}
var shapeOfYou = new p5(sketchScat, "scatter");

var sketch2 = function(p){
  p.W = 680; p.H=250
  p.time = 680;
  p.step = p.W/p.time;
  p.data = [];
  p.values = [];
  p.myFont, p.pos, p.fy, p.c, p.point, p.colors, p.maxH, p.l, p.f;
  p.csvmax, p.csvmin, p.dataIndex, p.count = 0;
  p.dataIndex= 0;
  p.fileLoaded = false;

  p.preload = function(){
    p.myFont = p.loadFont('Montserrat-Regular.otf');
  }
  p.setup = function(){
    p.createCanvas(p.W+100, p.H+100);
    p.fill(255, 30, 70, 90);
  
    //Increase and decrease framerate to change animation speed 
    p.frameRate(50)
    
    // x positions mapped to fit canvas
    p.posx = Float32Array.from({ length: p.time }, (_, i) => p.map(i, 0, p.time, 0, p.W));
    
    // map stock price to graph height
    p.fy = _ => p.map(_, 0, 2, p.H, 2);
  
    // colormap
    p.colors = _ => p.map(_, 0, 2, 0, 255);
    // read in data and reformat it
    // Data taken from: https://www.nasdaq.com/market-activity/quotes/historical
    p.loadTable("APPLE5Year.csv", "csv", function (table) {
      // get the header names
      p.xField = table.getColumn(0)[0];
      p.yField = table.getColumn(1)[0];
  
      // get the columns
      for (var i = 0; i < 6; i++) {
          var column = table.getColumn(i).slice(1, table.getColumn(0).length);
          column = column.map(function(num) {
            if(num.startsWith('$')){
              num = num.slice(1);
            }
            else if(num.includes('/')){
              return num;
            }
            return parseFloat(num);
          });
          p.values.push(column);
      }
      p.values[0] = p.values[0].reverse();
      p.values[1] = p.values[1].reverse();
      p.values[2] = p.values[2].reverse();
      p.values[3] = p.values[3].reverse();
      p.values[4] = p.values[4].reverse();
      p.values[5] = p.values[5].reverse();
      p.csvmax = Math.max.apply(null, p.values[1])
      p.csvmin = Math.min.apply(null, p.values[1])
      // print("Max: ", p.csvmax)
      // print("Min: ", p.csvmin)
  
      // set the flag to be true
      p.fileLoaded = true;
    });
  }
  p.drawAxes = function(){
  }
  p.draw = function(){
    if(p.fileLoaded){
      p.background(155);
      p.push();
      p.strokeWeight(10);
      p.stroke(0)
      p.fill(155);
      p.rect(0, 0, p.width, p.height);
      p.pop();
      p.drawAxes();
      
      // length of data list -1 (to access last item of data list)
      p.l = p.data.length -1 ;
  
      // frameCount
      p.f = p.frameCount;
      
      let normalizedDatapoint = (p.values[1][p.dataIndex] - p.csvmin) / (p.csvmax - p.csvmin);
      p.point = normalizedDatapoint;
      // console.log(p.dataIndex)
      p.dataIndex++;
      // print(point)
      
      // store that number at each step (the x-axis tick values)
      if (p.f&p.step) {
        p.data.push(p.point);
        p.count += 1;
      }
      
      // iterate over data list to rebuild curve at each frame
      for (let i = 0; i < p.l; i++) {
        
        p.y1 = p.fy(p.data[i]);
        p.y2 = p.fy(p.data[i+1]);
        p.x1 = p.posx[i];
        p.x2 = p.posx[i+1];
        p.c1 = p.colors(p.data[i]);
  
        // vertical lines (x-values)
        p.strokeWeight(0.2);
        p.stroke(255, p.c1, p.c1);
        p.line(p.x1, p.H, p.x1, p.y1 + 2);
        
        // polyline
        p.strokeWeight(2);
        p.stroke(255, p.c1, p.c1);
        p.line(p.x1, p.y1, p.x2, p.y2);
        if(i==3){
          p.stroke(0);
          // console.log(p.dataIndex)
          p.displayMetadata(p.dataIndex);
        }
        if(i==7){
          p.display7(p.dataIndex);
        }
      }
      
      // draw ellispe at last data point
      if (p.count > 1) {
        p.ellipse(p.posx[p.l], p.fy(p.data[p.l]), 4, 4);
      }
      
      // reset data and count
      if (p.count%p.time===0) {
        // print("data", p.data)
        p.data = [];
        p.count = 0;
      }
      //end
      if(p.dataIndex==p.values[1].length-1){
        // print("HERE")
        // print("data", p.data)
        p.data = [];
        p.count = 0;
        p.dataIndex=0;
        // noLoop();s
      }
    }
  }
  p.display7 = function display7(index){
    p.stroke(0);
    let sum = p.values[3][index]+p.values[3][index-1]+p.values[3][index-2]+p.values[3][index-3]+p.values[3][index-4]+p.values[3][index-5]+p.values[3][index-6]
    let average = (sum/7).toFixed(2);
    p.text('7 Day Average: $' + average, 400, p.H+90);
  }
  p.displayMetadata = function (index){
    p.stroke(0);
    p.textSize(20)
    p.textFont(p.myFont);
    // console.log(p.values)
    // console.log(index)
    if(p.values[0][index].startsWith("01")){
      p.text(' January ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("02")){
      p.text(' February ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("03")){
      p.text(' March ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("04")){
      p.text(' April ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("05")){
      p.text(' May ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("06")){
      p.text(' June ' +  p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("07")){
      p.text(' July ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("08")){
      p.text(' August ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("09")){
      p.text(' September ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("10")){
      p.text(' October ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("11")){
      p.text(' November ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("12")){
      p.text(' December ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    p.stroke(0);
    p.text('Stock Opening Price: $' + p.values[3][index], 200, p.H+30);
    p.text('Stock Closing Price: $' + p.values[1][index],200, p.H+60);
    p.text('Daily High: $' + p.values[4][index], 500, p.H+30);
    p.text('Daily Low: $' + p.values[5][index], 500, p.H+60);
  
    p.push();
    p.stroke(0);
    p.textSize(40)
    p.text('Apple 5 Year Animation', 180, 50);
    p.pop();
  }
  

}
// var apple = new p5(sketch2);

var sketch = function(p){
  p.W = 680; p.H=250
  p.time = 680;
  p.step = p.W/p.time;
  p.data = [];
  p.values = [];
  p.myFont, p.pos, p.fy, p.c, p.point, p.colors, p.maxH, p.l, p.f;
  p.csvmax, p.csvmin, p.dataIndex, p.count = 0;
  p.dataIndex= 0;
  p.fileLoaded = false;

  p.preload = function(){
    p.myFont = p.loadFont('Montserrat-Regular.otf');
  }
  p.setup = function(){
    p.createCanvas(p.W+100, p.H+100);
    p.fill(255, 30, 70, 90);
  
    //Increase and decrease framerate to change animation speed 
    p.frameRate(50)
    
    // x positions mapped to fit canvas
    p.posx = Float32Array.from({ length: p.time }, (_, i) => p.map(i, 0, p.time, 0, p.W));
    
    // map stock price to graph height
    p.fy = _ => p.map(_, 0, 2, p.H, 2);
  
    // colormap
    p.colors = _ => p.map(_, 0, 2, 0, 255);
    // read in data and reformat it
    // Data taken from: https://www.nasdaq.com/market-activity/quotes/historical
    p.loadTable("FACEBOOK5Year.csv", "csv", function (table) {
      // get the header names
      p.xField = table.getColumn(0)[0];
      p.yField = table.getColumn(1)[0];
  
      // get the columns
      for (var i = 0; i < 6; i++) {
          var column = table.getColumn(i).slice(1, table.getColumn(0).length);
          column = column.map(function(num) {
            if(num.startsWith('$')){
              num = num.slice(1);
            }
            else if(num.includes('/')){
              return num;
            }
            return parseFloat(num);
          });
          p.values.push(column);
      }
      p.values[0] = p.values[0].reverse();
      p.values[1] = p.values[1].reverse();
      p.values[2] = p.values[2].reverse();
      p.values[3] = p.values[3].reverse();
      p.values[4] = p.values[4].reverse();
      p.values[5] = p.values[5].reverse();
      p.csvmax = Math.max.apply(null, p.values[1])
      p.csvmin = Math.min.apply(null, p.values[1])
      // print("Max: ", p.csvmax)
      // print("Min: ", p.csvmin)
  
      // set the flag to be true
      p.fileLoaded = true;
    });
  }
  p.drawAxes = function(){
  }
  p.draw = function(){
    if(p.fileLoaded){
      p.background(155);
      p.push();
      p.strokeWeight(10);
      p.stroke(0)
      p.fill(155);
      p.rect(0, 0, p.width, p.height);
      p.pop();
      p.drawAxes();
      
      // length of data list -1 (to access last item of data list)
      p.l = p.data.length -1 ;
  
      // frameCount
      p.f = p.frameCount;
      
      let normalizedDatapoint = (p.values[1][p.dataIndex] - p.csvmin) / (p.csvmax - p.csvmin);
      p.point = normalizedDatapoint;
      // console.log(p.dataIndex)
      p.dataIndex++;
      // print(point)
      
      // store that number at each step (the x-axis tick values)
      if (p.f&p.step) {
        p.data.push(p.point);
        p.count += 1;
      }
      
      // iterate over data list to rebuild curve at each frame
      for (let i = 0; i < p.l; i++) {
        
        p.y1 = p.fy(p.data[i]);
        p.y2 = p.fy(p.data[i+1]);
        p.x1 = p.posx[i];
        p.x2 = p.posx[i+1];
        p.c1 = p.colors(p.data[i]);
  
        // vertical lines (x-values)
        p.strokeWeight(0.2);
        p.stroke(255, p.c1, p.c1);
        p.line(p.x1, p.H, p.x1, p.y1 + 2);
        
        // polyline
        p.strokeWeight(2);
        p.stroke(255, p.c1, p.c1);
        p.line(p.x1, p.y1, p.x2, p.y2);
        if(i==3){
          p.stroke(0);
          // console.log(p.dataIndex)
          p.displayMetadata(p.dataIndex);
        }
        if(i==7){
          p.display7(p.dataIndex);
        }
      }
      
      // draw ellispe at last data point
      if (p.count > 1) {
        p.ellipse(p.posx[p.l], p.fy(p.data[p.l]), 4, 4);
      }
      
      // reset data and count
      if (p.count%p.time===0) {
        // print("data", p.data)
        p.data = [];
        p.count = 0;
      }
      //end
      if(p.dataIndex==p.values[1].length-1){
        // print("HERE")
        // print("data", p.data)
        p.data = [];
        p.count = 0;
        p.dataIndex=0;
        // noLoop();s
      }
    }
  }
  p.display7 = function display7(index){
    p.stroke(0);
    let sum = p.values[3][index]+p.values[3][index-1]+p.values[3][index-2]+p.values[3][index-3]+p.values[3][index-4]+p.values[3][index-5]+p.values[3][index-6]
    let average = (sum/7).toFixed(2);
    p.text('7 Day Average: $' + average, 400, p.H+90);
  }
  p.displayMetadata = function (index){
    p.stroke(0);
    p.textSize(20)
    p.textFont(p.myFont);
    // console.log(p.values)
    // console.log(index)
    if(p.values[0][index].startsWith("01")){
      p.text(' January ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("02")){
      p.text(' February ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("03")){
      p.text(' March ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("04")){
      p.text(' April ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("05")){
      p.text(' May ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("06")){
      p.text(' June ' +  p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("07")){
      p.text(' July ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("08")){
      p.text(' August ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("09")){
      p.text(' September ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("10")){
      p.text(' October ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("11")){
      p.text(' November ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    else if(p.values[0][index].startsWith("12")){
      p.text(' December ' + p.values[0][index].slice(6,10), 10, p.H+20);
    }
    p.stroke(0);
    p.text('Stock Opening Price: $' + p.values[3][index], 200, p.H+30);
    p.text('Stock Closing Price: $' + p.values[1][index],200, p.H+60);
    p.text('Daily High: $' + p.values[4][index], 500, p.H+30);
    p.text('Daily Low: $' + p.values[5][index], 500, p.H+60);
  
    p.push();
    p.stroke(0);
    p.textSize(40)
    p.text('Facebook 5 Year Animation', 140, 50);
    p.pop();
  }
}
// var fb = new p5(sketch, testing);

// var sketch = function(p){
//   p.W = 680; p.H=250
//   p.time = 680;
//   p.step = p.W/p.time;
//   p.data = [];
//   p.values = [];
//   p.myFont, p.pos, p.fy, p.c, p.point, p.colors, p.maxH, p.l, p.f;
//   p.csvmax, p.csvmin, p.dataIndex, p.count = 0;
//   p.dataIndex= 0;
//   p.fileLoaded = false;

//   p.preload = function(){
//     p.myFont = p.loadFont('Montserrat-Regular.otf');
//   }
//   p.setup = function(){
//     p.createCanvas(p.W+100, p.H+100);
//     p.fill(255, 30, 70, 90);
  
//     //Increase and decrease framerate to change animation speed 
//     p.frameRate(50)
    
//     // x positions mapped to fit canvas
//     p.posx = Float32Array.from({ length: p.time }, (_, i) => p.map(i, 0, p.time, 0, p.W));
    
//     // map stock price to graph height
//     p.fy = _ => p.map(_, 0, 2, p.H, 2);
  
//     // colormap
//     p.colors = _ => p.map(_, 0, 2, 0, 255);
//     // read in data and reformat it
//     // Data taken from: https://www.nasdaq.com/market-activity/quotes/historical
//     p.loadTable("STARBUCKS5Year.csv", "csv", function (table) {
//       // get the header names
//       p.xField = table.getColumn(0)[0];
//       p.yField = table.getColumn(1)[0];
  
//       // get the columns
//       for (var i = 0; i < 6; i++) {
//           var column = table.getColumn(i).slice(1, table.getColumn(0).length);
//           column = column.map(function(num) {
//             if(num.startsWith('$')){
//               num = num.slice(1);
//             }
//             else if(num.includes('/')){
//               return num;
//             }
//             return parseFloat(num);
//           });
//           p.values.push(column);
//       }
//       p.values[0] = p.values[0].reverse();
//       p.values[1] = p.values[1].reverse();
//       p.values[2] = p.values[2].reverse();
//       p.values[3] = p.values[3].reverse();
//       p.values[4] = p.values[4].reverse();
//       p.values[5] = p.values[5].reverse();
//       p.csvmax = Math.max.apply(null, p.values[1])
//       p.csvmin = Math.min.apply(null, p.values[1])
//       // print("Max: ", p.csvmax)
//       // print("Min: ", p.csvmin)
  
//       // set the flag to be true
//       p.fileLoaded = true;
//     });
//   }
//   p.drawAxes = function(){
//   }
//   p.draw = function(){
//     if(p.fileLoaded){
//       p.background(155);
//       p.push();
//       p.strokeWeight(10);
//       p.stroke(0)
//       p.fill(155);
//       p.rect(0, 0, p.width, p.height);
//       p.pop();
//       p.drawAxes();
      
//       // length of data list -1 (to access last item of data list)
//       p.l = p.data.length -1 ;
  
//       // frameCount
//       p.f = p.frameCount;
      
//       let normalizedDatapoint = (p.values[1][p.dataIndex] - p.csvmin) / (p.csvmax - p.csvmin);
//       p.point = normalizedDatapoint;
//       // console.log(p.dataIndex)
//       p.dataIndex++;
//       // print(point)
      
//       // store that number at each step (the x-axis tick values)
//       if (p.f&p.step) {
//         p.data.push(p.point);
//         p.count += 1;
//       }
      
//       // iterate over data list to rebuild curve at each frame
//       for (let i = 0; i < p.l; i++) {
        
//         p.y1 = p.fy(p.data[i]);
//         p.y2 = p.fy(p.data[i+1]);
//         p.x1 = p.posx[i];
//         p.x2 = p.posx[i+1];
//         p.c1 = p.colors(p.data[i]);
  
//         // vertical lines (x-values)
//         p.strokeWeight(0.2);
//         p.stroke(255, p.c1, p.c1);
//         p.line(p.x1, p.H, p.x1, p.y1 + 2);
        
//         // polyline
//         p.strokeWeight(2);
//         p.stroke(255, p.c1, p.c1);
//         p.line(p.x1, p.y1, p.x2, p.y2);
//         if(i==3){
//           p.stroke(0);
//           // console.log(p.dataIndex)
//           p.displayMetadata(p.dataIndex);
//         }
//         if(i==7){
//           p.display7(p.dataIndex);
//         }
//       }
      
//       // draw ellispe at last data point
//       if (p.count > 1) {
//         p.ellipse(p.posx[p.l], p.fy(p.data[p.l]), 4, 4);
//       }
      
//       // reset data and count
//       if (p.count%p.time===0) {
//         // print("data", p.data)
//         p.data = [];
//         p.count = 0;
//       }
//       //end
//       if(p.dataIndex==p.values[1].length-1){
//         // print("HERE")
//         // print("data", p.data)
//         p.data = [];
//         p.count = 0;
//         p.dataIndex=0;
//         // noLoop();s
//       }
//     }
//   }
//   p.display7 = function display7(index){
//     p.stroke(0);
//     let sum = p.values[3][index]+p.values[3][index-1]+p.values[3][index-2]+p.values[3][index-3]+p.values[3][index-4]+p.values[3][index-5]+p.values[3][index-6]
//     let average = (sum/7).toFixed(2);
//     p.text('7 Day Average: $' + average, 400, p.H+90);
//   }
//   p.displayMetadata = function (index){
//     p.stroke(0);
//     p.textSize(20)
//     p.textFont(p.myFont);
//     // console.log(p.values)
//     // console.log(index)
//     if(p.values[0][index].startsWith("01")){
//       p.text(' January ' + p.values[0][index].slice(6,10), 10, p.H+20);
//     }
//     else if(p.values[0][index].startsWith("02")){
//       p.text(' February ' + p.values[0][index].slice(6,10), 10, p.H+20);
//     }
//     else if(p.values[0][index].startsWith("03")){
//       p.text(' March ' + p.values[0][index].slice(6,10), 10, p.H+20);
//     }
//     else if(p.values[0][index].startsWith("04")){
//       p.text(' April ' + p.values[0][index].slice(6,10), 10, p.H+20);
//     }
//     else if(p.values[0][index].startsWith("05")){
//       p.text(' May ' + p.values[0][index].slice(6,10), 10, p.H+20);
//     }
//     else if(p.values[0][index].startsWith("06")){
//       p.text(' June ' +  p.values[0][index].slice(6,10), 10, p.H+20);
//     }
//     else if(p.values[0][index].startsWith("07")){
//       p.text(' July ' + p.values[0][index].slice(6,10), 10, p.H+20);
//     }
//     else if(p.values[0][index].startsWith("08")){
//       p.text(' August ' + p.values[0][index].slice(6,10), 10, p.H+20);
//     }
//     else if(p.values[0][index].startsWith("09")){
//       p.text(' September ' + p.values[0][index].slice(6,10), 10, p.H+20);
//     }
//     else if(p.values[0][index].startsWith("10")){
//       p.text(' October ' + p.values[0][index].slice(6,10), 10, p.H+20);
//     }
//     else if(p.values[0][index].startsWith("11")){
//       p.text(' November ' + p.values[0][index].slice(6,10), 10, p.H+20);
//     }
//     else if(p.values[0][index].startsWith("12")){
//       p.text(' December ' + p.values[0][index].slice(6,10), 10, p.H+20);
//     }
//     p.stroke(0);
//     p.text('Stock Opening Price: $' + p.values[3][index], 200, p.H+30);
//     p.text('Stock Closing Price: $' + p.values[1][index],200, p.H+60);
//     p.text('Daily High: $' + p.values[4][index], 500, p.H+30);
//     p.text('Daily Low: $' + p.values[5][index], 500, p.H+60);
  
//     p.push();
//     p.stroke(0);
//     p.textSize(40)
//     p.text('Starbucks 5 Year Animation', 180, 50);
//     p.pop();
//   }
// }
// var sb = new p5(sketch);

var sketchTEST = function(p){
  p.plainFont, p.boldFont;
  p.centerX = 200;
  p.centerY = 220;
  p.outerRadius = 95;
  p.innerRadius = 55;
  p.dayCount = 8;
  p.conditions =  [{
    "name": "Drama",
    "days": 2,
    "color": "#38669a"
  },
  {
    "name": "Comedy",
    "days": 2,
    "color": "#8EC3E6"
  },
  // {
  //   "name": "Sci-fi",
  //   "days": 1,
  //   "color": "#fef017"
  // },
  // {
  //   "name": "Fantasy",
  //   "days": 1,
  //   "color": "#fef017"
  // },
  {
    "name": "Crime",
    "days": 1,
    "color": "red"
  },
  {
    "name": "Superhero",
    "days": 1,
    "color": "#fef017"
  },
  // {
  //   "name": "Thriller",
  //   "days": 1,
  //   "color": "#afafaa"
  // },
  // {
  //   "name": "War",
  //   "days": 1,
  //   "color": "#00ff00"
  // },
  {
    "name": "Musical",
    "days": 2,
    "color": "orange"
  },
  // {
  //   "name": "Horror",
  //   "days": 1,
  //   "color": "red"
  // },
];
  p.setup = function(){
    p.createCanvas(400,400)
  }
  p.draw = function(){
    p.background(255);

    //   textFont(boldFont, 12);
    p.fill(0);
    p.textAlign(p.LEFT);
    p.text("Best Picture Oscar Nominees", 45, 90);
    
    p.fill(0);
    
    //   textFont(plainFont, 12);
    
    p.noStroke();
    p.ellipseMode(p.RADIUS);
      let angleStart = -p.HALF_PI; // start at the top
      for (let c = 0; c < p.conditions.length; c++) {
        let entry = p.conditions[c];
        p.fill(entry.color);
        let wedgeSize = p.map(entry.days, 0, p.dayCount, 0, p.TAU);
        let angleStop = angleStart + wedgeSize;
        p.arc(p.centerX, p.centerY, p.outerRadius, p.outerRadius, angleStart, angleStop);
        angleStart = angleStop;
      }
      // knock a hole out of the middle
      p.fill(255);
      p.ellipse(p.centerX, p.centerY, p.innerRadius, p.innerRadius);
    
      // draw the legend
      let legendX = 300;
      let y = 280;
      let legendBox = 8;
      p.noStroke();
      p.textAlign(p.LEFT);
      for (let c = 0; c < p.conditions.length; c++) {
        let entry = p.conditions[c];
        p.fill(entry.color);
        p.rect(legendX, y - legendBox, legendBox, legendBox);
        p.fill(0);
        p.text(entry.name, legendX + legendBox + 5, y);
        y += 20;
      }
    
      p.fill(0);
      p.textAlign(p.CENTER);
      p.text("2018", p.width / 2, 225);
      p.text("Genres", p.width / 2, 355);
  }
}
var donut = new p5(sketchTEST, "donut");

var sketchLINE = function(p){
  p.chart;
  p.setup = function(){
    p.createCanvas(400, 400);
  
    p.dataX = [[2000, 2000.5, 2001, 2002, 2003, 2004, 2005], [2000, 2001, 2002, 2003, 2004, 2005]]
    p.dataY = [[20, 50, 40, 60, 80, 100, 120], [150, 75, 32, 14, 7, 3.5]]
    p.data = []
    
    p.colors = ['#ff0000', '#5649ff']
    
    p.lineLabels = ["Trend 1", "Trend 2"]
    
    for(let i = 0; i < p.dataX.length; i++) {
      p.data.push([])
      for(let j = 0; j < p.dataX[i].length; j++) {
        p.data[i].push(p.createVector(p.dataX[i][j], p.dataY[i][j]))
      }
    }
      
    p.chart = new LineChart(p.data, p.colors, p.lineLabels, 250, 250, 5, 5, [p.min(p.dataX.flat()), p.max(p.dataX.flat())], [0, 200], p);
  }
  p.draw = function(){
    p.background(255);
    p.chart.show();
  }
}
var line = new p5(sketchLINE, "line");
