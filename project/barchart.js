
function drawGraph() {
  drawAxes()
  drawBars()
  // drawLegends()
  drawTitle()
}

function drawHashMarksForYAxes() {
  var numHashMarks = 10
  var hashMarkL = GRAPH_ORIGINX
  var hashMarkR = hashMarkL + HASHMARKL
  var dist = (GRAPHH - PADDINGY) / numHashMarks
  for (var i = 1; i <= numHashMarks; ++i) {
    var hashMarkY = GRAPH_ORIGINY + GRAPHH - (i * dist)
    if (i % 1 == 0) {
      drawTextForYHashMarkAtY(hashMarkY, hashMarkR, (i/10).toString())
      stroke(51)
      line(hashMarkL, hashMarkY, hashMarkR, hashMarkY)
    }
  }
  // attribute name for y axis
  drawTextForYHashMarkAtY(GRAPH_ORIGINY, hashMarkR, "Sugar Percent")
}

function drawHashMarksForXAxes() {
  var numHashMarks = numRows
  var dist = GRAPHW - 2 * PADDINGX
  var unitDist = dist / numHashMarks
  var startX = GRAPH_ORIGINX + PADDINGX
  var hashMarkB = GRAPH_ORIGINY + GRAPHH - 1
  var hashMarkU = hashMarkB - HASHMARKL
  for (var i = 0; i < numHashMarks; ++i) {
    // if (i % 4 == 0) {
      var hashMarkX = startX + (i * unitDist)
      stroke(51)
      line(hashMarkX, hashMarkB + HASHMARKL, hashMarkX, hashMarkB)
      push()
      var x = hashMarkX
      var y = hashMarkB + 5
      translate(x, y)
      rotate(PI / 4)
      drawTextForXHashMark(0, 0, time[i])
      pop()
    // }
  }
  // attribute name for x axis
  var x = GRAPH_ORIGINX + GRAPHW
  var y = GRAPH_ORIGINY + GRAPHH
  drawTextForXHashMark(x, y, "Candy")
}

function drawTextForYHashMarkAtY(hashMarkY, hashMarkL, str) {
  var len = str.length * 10
  var height = 15;
  var padding = 10
  var x = hashMarkL - padding - len
  var y = hashMarkY - height / 2

  textAlign(RIGHT)
  text(str, x, y, len, height)
}

function drawTextForXHashMark(x, y, str) {
  var len = str.length * 10
  var height = 15

  text(str, x, y, 100, height)
}

function drawBars() {
  var distY = (GRAPHH - PADDINGY) / 1
  var distX = (GRAPHW - 2 * PADDINGX) / numRows

  var startX = GRAPH_ORIGINX + PADDINGX
  for (var i = 0; i < numRows; ++i) {
    var height = parseFloat(ratings[i]) * distY
    var x = startX + (i * distX)
    var y = GRAPH_ORIGINY + GRAPHH - height
    fill(getColorForBar(i % 4, x, y, distX, height, ratings[i]))
    noStroke()
    rect(x, y, distX, height)
  }
}

function getColorForBar(index, x, y, w, h, val) {
  if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    drawToolTipForVal(val, x, y, w)
    return highlightColor
  }
  return colors[index]
}

function drawToolTipForVal(val, x, y, w) {
  fill(51)
  stroke(51)
  textStyle(NORMAL)
  textAlign(CENTER)
  text(parseFloat(val).toFixed(2), x, y - 20, w, 100)
}

function drawLegends() {
  // for the containing box
  var width = 80
  var height = 100
  var x = GRAPH_ORIGINX + GRAPHW - width
  var y = GRAPH_ORIGINY

  noFill()
  stroke(51)
  rect(x, y, width, height)

  // for contained boxes
  var padding = 10
  var boxL = 15
  var gap = (height - 2 * padding - 4 * boxL) / 3
  var textPadding = 10

  var originY = y + padding
  var originX = x + padding
  for (var i = 0; i < 4; ++i) {
    var curY = originY + i * (boxL + (i > 0 ? gap : 0))
    noStroke()
    fill(colors[i])
    rect(originX, curY, boxL, boxL)

    fill(51)
    textAlign(LEFT)
    var str = "=  Q" + (i+1).toString()
    var textLen = textWidth(text)
    text(str, originX + boxL + textPadding, curY, textLen, boxL)
  }
}

function drawTitle() {
  var textLen = textWidth(title)
  var padding = (GRAPHW - textLen) / 2

  fill(125)
  textAlign(CENTER)
  textStyle(BOLD)
  text(title, GRAPH_ORIGINX + padding, GRAPH_ORIGINY, textLen + 50, 20)
}
