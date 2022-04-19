let chart;

var sketch = function(p){
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
      
    p.chart = new LineChart(data, colors, lineLabels, 250, 250, 5, 5, [min(dataX.flat()), max(dataX.flat())], [0, 200]);
  }
  p.draw = function(){
    p.background(220);
    p.chart.show();
  }
}

function setup() {
  createCanvas(400, 400);
  
  dataX = [[2000, 2000.5, 2001, 2002, 2003, 2004, 2005], [2000, 2001, 2002, 2003, 2004, 2005]]
  dataY = [[20, 50, 40, 60, 80, 100, 120], [150, 75, 32, 14, 7, 3.5]]
  data = []
  
  colors = ['#ff0000', '#5649ff']
  
  lineLabels = ["Trend 1", "Trend 2"]
  
  for(let i = 0; i < dataX.length; i++) {
    data.push([])
    for(let j = 0; j < dataX[i].length; j++) {
      data[i].push(createVector(dataX[i][j], dataY[i][j]))
    }
  }
    
  chart = new LineChart(data, colors, lineLabels, 250, 250, 5, 5, [min(dataX.flat()), max(dataX.flat())], [0, 200]);
  //[min(dataY.flat()), max(dataY.flat())]
}

function draw() {
  background(220);
  chart.show()
}