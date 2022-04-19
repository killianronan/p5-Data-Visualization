
let wid = 500;
let hei = 500;
//Example taken from **Pearson Buck** - *Initial work* - [pacheights](https://github.com/pacheights)
function Graph(data) {
    console.log(data)
    this.textSize = hei / 48;
    this.textColor = 0;
    this.font = "verdana";
    this.grid;
    this.labels;
    this.candles;

    this.display = function() {
        // Text Parameters
        console.log("this.text", this.font)
        textFont(this.font);
        textSize(this.textSize);

        // Display on startup
        if (data === undefined) {
            this.grid();
        }
        else {
            this.grid();
            this.labels();
            this.candles();
        }
    }

    this.grid = function() {
        // Vertical lines
        stroke(80);
        for (var i = 0.1; i < 0.8; i += 0.1) {
            line(floor(wid * i), floor(hei * 0.1),
                 floor(wid * i), floor(hei * 0.8));
        }
        // stroke(this.textColor);
        // line(floor(wid * 0.1), floor(hei * 0.8),
        //      floor(wid * 0.1), floor(hei * 0.9));
        line(floor(wid * 0.9), floor(hei * 0.1),
             floor(wid * 0.9), floor(hei * 0.8));

        // Horizonatal Lines
        stroke(80);
        for (var i = 0.1; i < 0.8; i += 0.1) {
            line(floor(wid * 0.1), floor(hei * i),
                 floor(wid * 0.9), floor(hei * i));
        }
        stroke(this.textColor);
        // line(floor(wid * 0.1), floor(hei * 0.8),
        //      floor(wid * 0.9), floor(hei * 0.8));
        // line(floor(wid * 0.1), floor(hei * 0.9),
        //      floor(wid * 0.9), floor(hei * 0.9));
    }

    this.labels = function() {
        // X-axis text
        noStroke();
        fill(this.textColor);

        // Counting down the days
        count = 13;
        for (var i = 0.18; i < 0.8; i += 0.1) {
            text(data.dateLabels[count], floor(wid * i),
                 floor(hei * 0.85));
            count -= 2;
        }

        count = 0;
        for (var i = 0.208; i < 0.8; i += 0.1) {
            text(data.priceLabels[count],
                floor(wid * 0.91),
                floor(hei * i));
            count++;
        }
    }

    this.candles = function() {
        var count = 14;
        strokeWeight(1);
        strokeCap(PROJECT);

        for (var i = 0.15; i < 0.9; i += 0.05) {
            // Price parameters
            var high = dataJSON[data.timeSeries][data.dateKeys[count]]["2. high"];
            var low = dataJSON[data.timeSeries][data.dateKeys[count]]["3. low"];
            var open = dataJSON[data.timeSeries][data.dateKeys[count]]["1. open"];
            var close = dataJSON[data.timeSeries][data.dateKeys[count]]["4. close"];

            // Date coordinate
            var x_coor = wid * i;
            var direction = close - open;

            // Mapping price to pixels
            low = map(low,data.priceRange[0], data.priceRange[1],
                         hei * 0.8, hei * 0.1);
            high = map(high,data.priceRange[0], data.priceRange[1],
                         hei * 0.8, hei * 0.1);
            open = map(open,data.priceRange[0], data.priceRange[1],
                         hei * 0.8, hei * 0.1);
            close = map(close,data.priceRange[0], data.priceRange[1],
                         hei * 0.8, hei * 0.1);

            // Drawing high/low vertical line
            stroke(130);
            line(floor(x_coor), low, floor(x_coor), high);

            // Drawing open/close vertical line
            if (direction > 0) {
                // Positive candle open and close box
                fill("#2dc40b");
                stroke("black");
                rectMode(CENTER);
                rect(x_coor, (open+close)/2, wid/40, open-close);
            }
            else {
                // Negative candle open and close box
                fill("#890e05");
                stroke("black");
                rectMode(CENTER);
                rect(x_coor, (open+close)/2, wid/40, open-close);
            }
            count--;
        }
    }
}
