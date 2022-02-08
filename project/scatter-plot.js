function setup() {
  createCanvas(500, 500);
}

function draw() {
  xValues = [0,71,2,53,25,6,7,8,20]
  yValues = [0,1,28,3,5,16,7,8,9]
  scatterPlot(xValues, yValues)
}

function scatterPlot(xValues, yValues){
  xlim = Math.max(...xValues)
  ylim = Math.max(...yValues)
  drawAxes(xlim, ylim)
  let xRatio = xlim/200;
  let yRatio = ylim/200;
  for (var i = 0; i < xValues.length; i++) {
    xValues[i] = Math.round(xValues[i] / xRatio);
    yValues[i] = Math.round(yValues[i] / yRatio);
    //X, Y
    push()
    strokeWeight(5);
    point(10+xValues[i], 205-yValues[i])
    pop()
  }
}

function drawAxes(xlim, ylim){
  // line from (5,5) to (5,205)
  line(10, 0, 10, 205)
  // line from (5,205) to (205,205)
  line(10, 205, 210, 205)
  textSize(6);
  text(0, 5,220)
  push();
  strokeWeight(5);
  // point(205,205)
  text(xlim, 205,220)
  // points(10,5)
  text(ylim, 2,5)
  pop();
}
function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
} 