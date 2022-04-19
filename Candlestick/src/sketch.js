var sketch = function(p){

  //* **Pearson Buck** - *Initial work* - [pacheights](https://github.com/pacheights)
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
// var amd = new p5(sketch, "testing");

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
var sketch2 = function(p){
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
    p.ellipseMode(RADIUS);
      let angleStart = -p.HALF_PI; // start at the top
      for (let c = 0; c < p.conditions.length; c++) {
        let entry = conditions[c];
        p.fill(entry.color);
        let wedgeSize = map(p.entry.days, 0, p.dayCount, 0, p.TAU);
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
      p.textAlign(LEFT);
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
var donut = new p5(sketch, "testing");
