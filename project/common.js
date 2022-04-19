var CANVASW = 1500
var CANVASH = 1000

var GRAPH_ORIGINX = 100
var GRAPH_ORIGINY = 100
var GRAPHW = 1200
var GRAPHH = 800

var ARROWW = 5
var ARROWL = 15

var AXESLEN = 700

var HASHMARKL = 5
var PADDINGX = 20
var PADDINGY = 45

var table
var numRows
var numColumns
var time
var ratings
var title
var colors
var highlightColor

function preload() {
  table = loadTable("candy.csv", "csv", "header")
}

// only for display purpose, bad coding yikes!
function setup() {
  createCanvas(CANVASW, CANVASH)
  //count the columns
  numRows = 20
  numColumns = 2

  time = table.getColumn("competitorname").slice(0, 20)
  ratings = table.getColumn("sugarpercent").slice(0,20)

  title = "Sugar Percentage of different Candy"

  colors = [
    color('#D0F0C0'),
    color('#7CFC00'),
    color('#228C22'),
    color('#005C29')
  ]

  highlightColor = color(150, 82, 217)
}

function draw() {
  background(255)
  drawGraph()
}

// Axes related stuff
function drawAxes() {
  beginShape()
  vertex(GRAPH_ORIGINX, GRAPH_ORIGINY)
  vertex(GRAPH_ORIGINX, GRAPH_ORIGINY + GRAPHH)
  vertex(GRAPH_ORIGINX + GRAPHW, GRAPH_ORIGINY + GRAPHH)
  endShape()

  drawArrows()
  drawHashMarks()
}

function drawArrows() {
  fill(51)
  // arrow for y axis
  beginShape(TRIANGLES)
  vertex(GRAPH_ORIGINX, GRAPH_ORIGINY)
  vertex(GRAPH_ORIGINX - ARROWW, GRAPH_ORIGINY + ARROWL)
  vertex(GRAPH_ORIGINX + ARROWW, GRAPH_ORIGINY + ARROWL)
  endShape()

  // arrow for x axis
  beginShape(TRIANGLES)
  vertex(GRAPH_ORIGINX + GRAPHW, GRAPH_ORIGINY + GRAPHH)
  vertex(GRAPH_ORIGINX + GRAPHW - ARROWL, GRAPH_ORIGINY + GRAPHH - ARROWW)
  vertex(GRAPH_ORIGINX + GRAPHW  - ARROWL, GRAPH_ORIGINY + GRAPHH + ARROWW)
  endShape()
}

function drawHashMarks() {
  drawHashMarksForYAxes()
  drawHashMarksForXAxes()
}
