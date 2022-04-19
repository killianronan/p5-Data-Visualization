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