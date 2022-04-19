let plainFont;
let boldFont;

const centerX = 200;
const centerY = 220;

const outerRadius = 95;
const innerRadius = 55;

const dayCount = 8; /* August */

const conditions = [{
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

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);

//   textFont(boldFont, 12);
  fill(0);
  textAlign(LEFT);
  text("Best Picture Oscar Nominees", 45, 90);

  fill(0);

//   textFont(plainFont, 12);

  noStroke();
  ellipseMode(RADIUS);
  let angleStart = -HALF_PI; // start at the top
  for (let c = 0; c < conditions.length; c++) {
    let entry = conditions[c];
    fill(entry.color);
    let wedgeSize = map(entry.days, 0, dayCount, 0, TAU);
    let angleStop = angleStart + wedgeSize;
    arc(centerX, centerY, outerRadius, outerRadius, angleStart, angleStop);
    angleStart = angleStop;
  }
  // knock a hole out of the middle
  fill(255);
  ellipse(centerX, centerY, innerRadius, innerRadius);

  // draw the legend
  let legendX = 300;
  let y = 280;
  let legendBox = 8;
  noStroke();
  textAlign(LEFT);
  for (let c = 0; c < conditions.length; c++) {
    let entry = conditions[c];
    fill(entry.color);
    rect(legendX, y - legendBox, legendBox, legendBox);
    fill(0);
    text(entry.name, legendX + legendBox + 5, y);
    y += 20;
  }

  fill(0);
  textAlign(CENTER);
  text("2018", width / 2, 225);
  text("Genres", width / 2, 355);
}