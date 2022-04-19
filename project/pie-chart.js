let angles = [30, 10, 45, 35, 60, 38, 75, 67];

var data = [20,5,40,15,33];
var piedata = [], piecolor = [48,96,144,192,240];
var mouseAngle = 0, pieDelta = 0, hover = 0;

let colours = []
// colours.push(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256))
colours.push(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256))
colours.push(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256))
colours.push(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256))
colours.push(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256))
colours.push(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256))
colours.push(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256))
colours.push(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256))
colours.push(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256))

// colours.push('hsl('+Math.floor(Math.random() * 360)+', '+Math.floor(Math.random() * 100) +'%, '+ Math.floor(Math.random() * 50) +'%)')
// colours.push('hsl('+Math.floor(Math.random() * 360)+', '+Math.floor(Math.random() * 100) +'%, '+ Math.floor(Math.random() * 50) +'%)')
// colours.push('hsl('+Math.floor(Math.random() * 360)+', '+Math.floor(Math.random() * 100) +'%, '+ Math.floor(Math.random() * 50) +'%)')
// colours.push('hsl('+Math.floor(Math.random() * 360)+', '+Math.floor(Math.random() * 100) +'%, '+ Math.floor(Math.random() * 50) +'%)')
// colours.push('hsl('+Math.floor(Math.random() * 360)+', '+Math.floor(Math.random() * 100) +'%, '+ Math.floor(Math.random() * 50) +'%)')
// colours.push('hsl('+Math.floor(Math.random() * 360)+', '+Math.floor(Math.random() * 100) +'%, '+ Math.floor(Math.random() * 50) +'%)')
// colours.push('hsl('+Math.floor(Math.random() * 360)+', '+Math.floor(Math.random() * 100) +'%, '+ Math.floor(Math.random() * 50) +'%)')
// colours.push('hsl('+Math.floor(Math.random() * 360)+', '+Math.floor(Math.random() * 100) +'%, '+ Math.floor(Math.random() * 50) +'%)')

console.log("HERE",colours)
function setup() {
  createCanvas(400, 400);
  total = data.reduce(function(a,b){ return a+b; }, 0);
  for(var i=0,count=0;i<data.length;i++) {
    piedata.push([Math.PI * 2 * count / total, Math.PI * 2 * (count + data[i]) / total]);
    count += data[i]; 
  }
  noStroke();
  // noLoop(); // Run once and stop
}

function draw() {
  background(255);
  pieChart(300, angles, colours);
  // pieChart2();
}

function pieChart(diameter, data, colourMap) {
  let lastAngle = 0;
  let inRadius = false;
  for (let i = 0; i < data.length; i++) {
    let c = color(colourMap[i*3], colourMap[i*3 + 1], colourMap[i*3 + 2])
    // let c = color(colourMap[i])
    fill(c);
    let radius = diameter/2;

    if(dist(width/2, height/2, mouseX, mouseY)<radius){
      dx = mouseX - width / 2
      dy = mouseY - height / 2
      theta_radians = atan2(dy, dx)
      if(degrees(theta_radians)>0){
        if(theta_radians > lastAngle && theta_radians < lastAngle + radians(data[i])){
          inRadius = true
          fill(0);
          arc(
            width / 2,
            height / 2,
            diameter,
            diameter,
            lastAngle,
            lastAngle + radians(data[i])
          );
          lastAngle += radians(data[i]);
          textSize(30);
          text("Angle = "+ data[i], width / 2, height-5)
        }
      }
      else{
        if((360 + degrees(theta_radians)) > degrees(lastAngle) && (360 + degrees(theta_radians)) < degrees(lastAngle) + data[i]){
          inRadius = true
          fill(0);
          arc(
            width / 2,
            height / 2,
            diameter,
            diameter,
            lastAngle,
            lastAngle + radians(data[i])
          );
          lastAngle += radians(data[i]);
          let textAngle = lastAngle + radians(data[i]) - (radians(data[i])/2)
          textSize(30);
          text("Angle = "+ data[i], width / 2, height-5)
          describe('green circle at x pos ');
        }
      }
    }
    if(!inRadius){
      arc(
        width / 2,
        height / 2,
        diameter,
        diameter,
        lastAngle,
        lastAngle + radians(data[i])
      );
      lastAngle += radians(data[i]);
    }
    else{
      inRadius = false
    }
  }
}

function pieChart2() {
  for(var i=0,dx=0,dy=0;i<piedata.length;i++,dx=0,dy=0) {
    fill(piecolor[i%5]);
    if(mouseAngle >= piedata[i][0] && mouseAngle < piedata[i][1]) {
      dx = Math.cos((piedata[i][0] + piedata[i][1])/2) * 10;
      dy = Math.sin((piedata[i][0] + piedata[i][1])/2) * 10;
    }
    arc(320 + dx, 200 + dy, 300, 300, piedata[i][0], piedata[i][1], PIE);
  }
}

function mouseMoved() {
  mouseAngle = Math.PI / 2 - Math.atan((320 - mouseX) / (200 - mouseY));
  if(mouseY < 200) mouseAngle = mouseAngle + Math.PI;
}