var sketch = function(p){
    p.screenHeight, p.screenWidth, p.textField, p.searchButton, p.graph,  p.ticker, p.data, p.dataJSON;
    p.w = 500;
    p.h = 500;
    p.ticker = "";
    p.setup = function(){
        // Initializing the screen's width and height
        p.screenWidth = p.w;
        p.screenHeight = p.h;

    // Initializing the canvas and the graph
    p.createCanvas(p.screenWidth,p.screenHeight);
    // background(255);
    p.graph = new Graph(p.data, p.dataJSON);
    p.graph.display();

    // Initializing the search bar
    p.textField = p.createInput();
    p.textField.value(p.ticker);
    p.textField.position(p.screenWidth * 0.1, p.screenHeight * 0.04);
    p.searchButton = p.createElement("button").id("searchButton");
    p.searchButton.position(p.screenWidth * 0.35, p.screenHeight * 0.05);

    // When the user enters a new stock ticker
    p.searchButton.mousePressed(getData)
    p.textField.changed(getData);
    }
    p.draw = function(){
        // For when the user resizes their window
        if (p.screenWidth != p.w || p.screenHeight != p.h) {
            p.ticker = p.textField.value().toUpperCase();
            p.searchButton.remove();
            p.textField.remove();
            p.setup();
        }
    }
}
var amd2 = new p5(sketch, "testing2");


// // Global Variables
// var screenWidth;
// var screenHeight;
// var textField;
// var searchButton;
// var graph;
// var ticker;
// var data;
// var dataJSON;
// let w = 500;
// let h = 500;
// // Setting the ticker to blank string
// ticker = "";

// function setup() {
//     // Initializing the screen's width and height
//     screenWidth = w;
//     screenHeight = h;

//     // Initializing the canvas and the graph
//     createCanvas(screenWidth,screenHeight);
//     // background(255);
//     graph = new Graph(data, dataJSON);
//     graph.display();

//     // Initializing the search bar
//     textField = createInput();
//     textField.value(ticker);
//     textField.position(screenWidth * 0.1, screenHeight * 0.04);
//     searchButton = createElement("button").id("searchButton");
//     searchButton.position(screenWidth * 0.35, screenHeight * 0.05);

//     // When the user enters a new stock ticker
//     searchButton.mousePressed(getData)
//     textField.changed(getData);
// }

// function draw() {
//     // For when the user resizes their window
//     if (screenWidth != w || screenHeight != h) {
//             ticker = textField.value().toUpperCase();
//             searchButton.remove();
//             textField.remove();
//             setup();
//     }
// }

// function getData() {
//     // Save the ticker value to prevent unneccesary API calls
//     ticker = textField.value().toUpperCase();
//     data = new Data(ticker);
//     dataJSON = loadJSON(data.apiCall, gotData);

//     // Loading Screen
//     noStroke();
//     fill(200, 200, 200);
//     textSize(screenHeight/8);
//     text("Loading",(screenWidth/2.5),(screenHeight/2));

//     // Recreates graph when API is called
//     function gotData() {
//         data.parseData(dataJSON);
//         searchButton.remove();
//         textField.remove();
//         setup();
//     }
// }
