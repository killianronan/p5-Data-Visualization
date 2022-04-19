//======================== Global variables ============================//
var WIDTH = 800;            // width of window size
var HEIGHT = 600;           // height of window size
var fileLoaded = false;     // whether the file has been loaded
var PADDING = 100;          // padding of the page
var TICKWIDTH = 10;
var xField = "";            // feather name of x axis
var yField = "";            // feather name of y axis
var values = [];

var sliderX;    // the slider for choosing value on x axis
var sliderY;    // the slider for choosing value on y axis
var maxX, minX, xArr, minY, maxY, yArr;

function setup() {
    // set the canvas size
    createCanvas(WIDTH, HEIGHT);

    // read in data and reformat it
    loadTable("data/spotify.csv", "csv", function (table) {
        // get the header names
        xField = table.getColumn(0)[0];
        yField = table.getColumn(2)[0];

        // get the columns
        for (var i = 0; i < 3; i++) {
            var column = table.getColumn(i).slice(1, table.getColumn(0).length);
            if(i==0){
                column = column.map(function(num) {
                    let x = new Date(num);
                    x = x.valueOf();
                    return x;
                });
                values.push(column);

            }
            else if(i==2){
                column = column.map(function(num) {
                    if(num==""){
                        return null
                    }
                    console.log(num)
                    return parseFloat(num);
                });
                console.log("col in thin", column)
                values.push(column);

            }
            console.log("col " + i,column)
        }
        console.log("Values: ",values)
        // set the flag to be true
        fileLoaded = true;

        // get the max values for 2 fields
        xArr = values[0];
        yArr = values[1];
        maxX = Math.max.apply(Math, xArr);
        maxY = Math.max.apply(Math, yArr);
        minX = Math.min.apply(Math, xArr);
        minY = Math.min.apply(Math, yArr);

        // create the slider
        sliderX = createSlider(minX, maxX, maxX);
        sliderY = createSlider(minY, maxY, maxY);
        sliderX.position(WIDTH-100, 50);
        sliderY.position(WIDTH-100, 100);
    });
}


function draw() {
    // if file haven't been completed loaded, return
    if (!fileLoaded) {
        return;
    }
    

    // start drawing
    background(255, 255, 255);

    // draw the axes
    drawAxes();

    // draw labels on slider
    text(xField + " >= " + sliderX.value(), WIDTH-180, 40);
    text(yField + " >= " + sliderY.value(), WIDTH-180, 90);

    // draw labels on x-axis
    var tickGap = (WIDTH - PADDING * 2) / 5;
    let indexToUse = 0

    for (var i = 0; i <= 5; i++) {
        let dateToDisplay = new Date(xArr[indexToUse])
        text(dateToDisplay.toDateString(), PADDING + i * tickGap + 2, HEIGHT - PADDING + TICKWIDTH + 5);
        indexToUse+=Math.floor((maxX-sliderX.value())/5);
    }

    // draw labels on the axes
    tickGap = (HEIGHT - PADDING * 2) / 5;
    for (i = 1; i <= 5; i++) {
        text(sliderY.value() * i / 5.0, PADDING - 60, PADDING + (5 - i) * tickGap - 4);
    }

    // get the selected points
    var selectedPoints = [];
    for (i = 0; i < xArr.length; i++) {
        if (xArr[i] <= sliderX.value() && yArr[i] <= sliderY.value()) {
            selectedPoints.push(createVector(xArr[i], yArr[i]));
        }
    }

    // draw the selected points
    for (i = 0; i < selectedPoints.length; i++) {
        var point = selectedPoints[i];
        var x1 = PADDING;
        var x2 = WIDTH - PADDING;
        var xPos = map(point.x, minX, sliderX.value(), x1, x2);
        var y1 = HEIGHT - PADDING;
        var y2 = PADDING;
        var yPos = int(map(point.y, 0, sliderY.value(), y1, y2));  
        noStroke();
        fill(150, 0, 0); 
        ellipse(xPos, yPos, 8, 8);
    }

    // draw the hover infomation on points
    for (i = 0; i < selectedPoints.length; i++) {
        var point = selectedPoints[i];
        var x1 = PADDING;
        var x2 = WIDTH - PADDING;
        var xPos = map(point.x, minX, maxX, x1, x2);
        var y1 = HEIGHT - PADDING;
        var y2 = PADDING;
        var yPos = int(map(point.y, 0, maxY, y1, y2));  
        
        // add the tooltip for hover over effect
        if (sq(mouseX - xPos) + sq(mouseY - yPos) < 80) {
            fill(255, 80, 255); 
            ellipse(xPos, yPos, 10, 10);
            let displayDate = new Date(point.x);
            text(displayDate.toDateString() + ", " + point.y, mouseX + 15, mouseY);
        }
    }
}


function drawAxes() {
    // set the colors
    stroke(100, 100, 100);
    strokeWeight(1);
    fill(100, 100, 100);

    // draw the title of the bar graph
    textSize(20);
    text("Scatter plot of Spotify streams of 'Shape of You' over time", WIDTH / 2 - 300, PADDING / 2);    
    textSize(12);
  
    // draw the axis
    var x1 = PADDING;
    var x2 = WIDTH - PADDING;
    var y1 = HEIGHT - PADDING;
    var y2 = y1;
    line(x1, y1, x2, y2);

    // draw the tick on x-axis (for scatterplot)
    var tickGap = (width - PADDING * 2) / 5;
    for (var j = 0; j < 5; j++) {
        line(x1 + (j + 1) * tickGap, y1, x1 + (j + 1) * tickGap, y1 + TICKWIDTH);
        strokeWeight(0.1);
        line(x1 + (j + 1) * tickGap, y1, x1 + (j + 1) * tickGap, 100);
    }
    

    // draw x-axis label
    text(xField, x2, y2 - 10);

    // draw the y-axis
    x1 = PADDING;
    x2 = x1;
    y1 = HEIGHT - PADDING;
    y2 = PADDING;
    line(x1, y1, x2, y2);

    // draw the ticks on y-axis
    tickGap = (y1 - y2) / 5;
    for (var j = 0; j < 5; j++) {
        line(x1, y2 + j * tickGap, x1 - TICKWIDTH, y2 + j * tickGap);
        strokeWeight(0.1);
        line(x1, y2 + j * tickGap, 700, y2 + j * tickGap);
    }
  
    // draw y-axis label
    text("Streams", x1, y2 - 15);
}