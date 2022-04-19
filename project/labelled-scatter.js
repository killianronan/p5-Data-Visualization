
var sketch = function(p){
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
        p.loadTable("data/spotify.csv", "csv", function (table) {
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
        // p.sliderX.position(p.WIDTH-100, 50);
        // p.sliderY.position(p.WIDTH-100, 100);
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
var shapeOfYou = new p5(sketch);

var sketch2 = function(p){
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
        p.loadTable("data/spotify.csv", "csv", function (table) {
        // get the header names
        p.xField = table.getColumn(0)[0];
        p.yField = table.getColumn(2)[0];

        // get the columns
        for (var i = 0; i < 3; i++) {
            var column = table.getColumn(i).slice(1, table.getColumn(0).length);
            if(i==0){
                column = column.map(function(num) {
                    let x = new Date(num);
                    x = x.valueOf();
                    return x;
                });
                p.values.push(column);

            }
            else if(i==2){
                column = column.map(function(num) {
                    if(num==""){
                        return null
                    }
                    // console.log(num)
                    return parseFloat(num);
                });
                // console.log("col in thin", column)
                p.values.push(column);

            }
            // p.values.push(column);
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
        // p.sliderX.position(p.WIDTH-100, 670);
        // p.sliderY.position(p.WIDTH-100, 730);
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
var despasito = new p5(sketch2);

var sketch3 = function(p){
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
        p.loadTable("data/spotify.csv", "csv", function (table) {
        // get the header names
        p.xField = table.getColumn(0)[0];
        p.yField = table.getColumn(3)[0];

        // get the columns
        for (var i = 0; i < 4; i++) {
            var column = table.getColumn(i).slice(1, table.getColumn(0).length);
            if(i==0){
                column = column.map(function(num) {
                    let x = new Date(num);
                    x = x.valueOf();
                    return x;
                });
                p.values.push(column);

            }
            else if(i==3){
                column = column.filter(function(num) {
                    if(num==""){
                        // console.log("bef",p.values[0])
                        p.values[0].pop();
                        // console.log("aft",p.values[0])

                        return 
                    }
                    return parseFloat(num);
                })

                p.values.push(column);

            }
            // p.values.push(column);
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
        // p.sliderX.position(p.WIDTH-100, 670);
        // p.sliderY.position(p.WIDTH-100, 730);
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
var despasito = new p5(sketch3);
var sketch4 = function(p){
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
        p.loadTable("data/spotify.csv", "csv", function (table) {
        // get the header names
        p.xField = table.getColumn(0)[0];
        p.yField = table.getColumn(4)[0];

        // get the columns
        for (var i = 0; i < 5; i++) {
            var column = table.getColumn(i).slice(1, table.getColumn(0).length);
            if(i==0){
                column = column.map(function(num) {
                    let x = new Date(num);
                    x = x.valueOf();
                    return x;
                });
                p.values.push(column);

            }
            else if(i==4){
                column = column.filter(function(num) {
                    if(num==""){
                        // console.log("bef",p.values[0])
                        p.values[0].pop();
                        // console.log("aft",p.values[0])

                        return 
                    }
                    return parseFloat(num);
                })
                p.values.push(column);

            }
            // console.log(p.values)
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
        // p.sliderX.position(p.WIDTH-100, 670);
        // p.sliderY.position(p.WIDTH-100, 730);
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
var despasito2 = new p5(sketch4);

var sketch5 = function(p){
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
        p.loadTable("data/spotify.csv", "csv", function (table) {
        // get the header names
        p.xField = table.getColumn(0)[0];
        p.yField = table.getColumn(5)[0];

        // get the columns
        for (var i = 0; i < 6; i++) {
            var column = table.getColumn(i).slice(1, table.getColumn(0).length);
            if(i==0){
                column = column.map(function(num) {
                    let x = new Date(num);
                    x = x.valueOf();
                    return x;
                });
                p.values.push(column);

            }
            else if(i==5){
                column = column.filter(function(num) {
                    if(num==""){
                        p.values[0].pop();
                        return 
                    }
                    return parseFloat(num);
                })
                p.values.push(column);

            }
            // console.log(p.values)
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
        // p.sliderX.position(p.WIDTH-100, 670);
        // p.sliderY.position(p.WIDTH-100, 730);
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
var despasito3 = new p5(sketch5);
