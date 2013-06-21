var items = [
    {name: 'clock', url: "http://web.mit.edu/6.mitx/www/demo/knapsack/clock.png", value: 175, weight: 10, insack: 0, index: 0, moving: 0},
    {name: 'painting', url: "http://web.mit.edu/6.mitx/www/demo/knapsack/painting.png", value: 90, weight: 9, insack: 0, index: 1, moving: 0},
    {name: 'radio', url: "http://web.mit.edu/6.mitx/www/demo/knapsack/radio.png", value: 20, weight: 4, insack: 0, index: 2, moving: 0},
    {name: 'vase', url: "http://web.mit.edu/6.mitx/www/demo/knapsack/vase.png", value: 50, weight: 2, insack: 0, index: 3, moving: 0},
    {name: 'book', url: "http://web.mit.edu/6.mitx/www/demo/knapsack/book.png", value: 10, weight: 1, insack: 0, index: 4, moving: 0},
    {name: 'computer', url: "http://web.mit.edu/6.mitx/www/demo/knapsack/computer.png", value: 200, weight: 20, insack: 0, index: 5, moving: 0}
];

var totalVal = 545;
var moneyLocs = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var numBills = moneyLocs.length;

var cashSound = new Audio("http://www.freesound.org/data/previews/91/91924_634166-lq.mp3");

var moneyScale = d3.scale.linear()
    .domain([0,totalVal])
    .range([0,numBills]);

var sackSag = 0;
var sackVal = 0;

function updateMoney() {
    var inHouse = moneyScale(totalVal - sackVal);
    for(i in moneyLocs) {
        if(i <= inHouse)
            moneyLocs[i] = 0;
        else
            moneyLocs[i] = 1;
    }
}

var maxWeight = 20;

$(window).resize(function () { resize(); });

var outerWidth, outerHeight, margin, innerDim, iconDim, yOffset, enlarge, sadSack, textSize;

function xPos(d) {
    return iconDim + margin + d.index % 3 * (iconDim + margin / 2) + d.insack * outerWidth / 2;
}

function yPos(d, sag) {
    return iconDim + yOffset + Math.floor(d.index / 3) * (iconDim + margin / 2) + d.insack * sag;
}

var knapsack = d3.select(".knapsack")
    .append("svg").attr("class", "knapsack");

var background = knapsack.append("image").attr("class", "background")
    .attr("xlink:href", "http://www.arnan.com/arnan/cartoon_forest.jpg");
    
var house = knapsack.append("image").attr("class", "house")
//    .attr("xlink:href", "http://www.easyvectors.com/assets/images/vectors/afbig/house-silhouette-clip-art.jpg")
    .attr("xlink:href", "http://sweetclipart.com/multisite/sweetclipart/files/imagecache/middle/house_line_art.png");

var sack = knapsack.append("image").attr("class", "sack")
    .attr("xlink:href", "http://pixabay.com/static/uploads/photo/2012/04/18/19/29/icon-37647_640.png");

var moneys = knapsack.selectAll(".money").data(moneyLocs).enter()
    .append("svg").attr("class", "money")
    .append("image")
        .attr("xlink:href", "http://cdn1.iconfinder.com/data/icons/customicondesign-office6-shadow/256/US-dollar.png");

var images = knapsack.selectAll(".item").data(items).enter()
    .append("svg").attr("class", "item")
        .each(function (d) { $(this).tooltip({title: d.name + ": $" + d.value + ", " + d.weight + "kg", container: "body"}); })
    .append("image")
        .attr("xlink:href", function (d) { return d.url; })
        .attr("data-id", function (d, i) { return i; })
    .on('click', function () { move($(this)[0].getAttribute("data-id")); });

var weightText = d3.select(".weight")
    .append("text").text("Your bag weighs " + sackSag + "kg");

var valueText = d3.select(".value")
    .append("text").text("Your bag contains $" + sackVal);

function resize() {
    
    outerWidth = d3.min([1000, $('.knapsack').width()]);
    outerHeight = outerWidth / 2;
    margin = outerWidth / 32;
    innerDim = outerWidth / 2 - 2 * margin;
    iconDim = (innerDim - 4 * margin) / 4;
    yOffset = iconDim + 1.5 * margin;
    enlarge = iconDim * 0.3;
    sadSack = outerHeight - margin - iconDim;
    textSize = d3.max([margin, 16]);
    
    if(sackSag > maxWeight)
        sackSag = sadSack;
    
    knapsack.attr("width", outerWidth)
        .attr("height", outerHeight);
    
    background.attr("width", outerWidth)
        .attr("height", outerHeight);
    
    house.attr("x", margin)
        .attr("y", margin)
        .attr("width", innerDim)
        .attr('height', innerDim);
            
    sack.attr("x", outerWidth / 2 + margin)
        .attr("y", margin + sackSag)
        .attr("width", innerDim)
        .attr('height', innerDim)
        .on('click', function () { emptySack(); });
    
    moneys.attr("height", margin / 2)
        .attr("width", margin / 2)
        .attr("y", function(d, i) { return (1 + i) * margin / 4 + (1 - d) * (-outerHeight); })
        .attr("x", outerWidth - 3 * margin / 4);
    
    images.attr("width", iconDim)
        .attr("height", iconDim)
        .attr("x", xPos)
        .attr("y", function (d) { return margin + yPos(d, sackSag); });
            
    weightText.style("font", textSize + "px sans-serif");
            
    valueText.style("font", textSize + "px sans-serif");
}

resize();

function animation(prevSag) {
    images.transition()
        .duration(300)
        .ease("cubic")
        .attr("height", function (d) { return iconDim + 2 * enlarge * d.moving; })
        .attr("width", function (d) { return iconDim + 2 * enlarge * d.moving; })
        .attr("y", function (d) { return margin + (1 - d.moving) * yPos(d, prevSag); })
    .transition()
        .duration(500)
        .ease("elastic")
        .attr("x", function (d) { return xPos(d) - enlarge * d.moving; })
    .transition()
        .duration(500)
        .ease("bounce")
        .attr("height", iconDim)
        .attr("width", iconDim)
        .attr("x", xPos)
        .attr("y", function (d) { return margin + yPos(d, sackSag); });
    sack.transition()
        .duration(500)
        .ease("bounce")
        .delay(800)
        .attr("y", margin + sackSag)
        .attr("transform", "");
    moneys.data(moneyLocs).transition()
        .duration(500)
        .delay(function(d, i) { return (numBills - i) * 10 + 800; })
        .attr("y", function(d, i) { return (1 + i) * margin / 4 + (1 - d) * (-outerHeight); });
    weightText.transition()
        .delay(800)
        .text(sackSag <= maxWeight ? "Your bag weighs " + sackSag + "kg" : "Your bag is overweight")
        .style("font", textSize + "px sans-serif")
        .style("color", sackSag <= maxWeight ? "black" : "red");
    valueText.transition()
        .delay(800)
        .text("Your bag contains $" + sackVal)
        .style("font", textSize + "px sans-serif");
}

function update(empty) {
    var h = 0;
    var s = 0;
    var prevSag = sackSag;
    var prevVal = sackVal;
    sackSag = 0;
    sackVal = 0;
    for(i in items) {
        if(items[i].insack > 0) {
            items[i].index = s;
            sackSag += items[i].weight;
            sackVal += items[i].value;
            if(sackSag > maxWeight)
                sackSag = sadSack;
            s += 1;
        }
        else {
            items[i].index = h;
            h += 1;
        }
    }
    
    updateMoney();
    
    if(empty)
        regurgitate();
    else
        animation(prevSag);
    
    if(sackVal > prevVal) {
        cashSound.currentTime = 0;
        cashSound.play();
    }
    
    for(i in items)
        items[i].moving = 0;
}

function move(thing) {
    items[thing].insack = (items[thing].insack + 1) % 2;
    items[thing].moving = 1;
    update(false);
}

function regurgitate() {
    images.transition()
        .duration(1000)
        .ease("elastic")
        .attr("y", function (d) { return margin + (1 - d.moving) * yPos(d, sackSag) - d.moving * outerHeight; })
    .transition()
        .duration(100)
        .attr("x", xPos)
    .transition()
        .duration(500)
        .ease("bounce")
        .attr("height", iconDim)
        .attr("width", iconDim)
        .attr("x", xPos)
        .attr("y", function (d) { return margin + yPos(d, sackSag); });
    sack.transition()
        .duration(500)
        .ease("bounce")
        .delay(800)
        .attr("y", margin + sackSag)
        .attr("transform", "");
    moneys.data(moneyLocs).transition()
        .duration(500)
        .delay(function(d, i) { return i * 10 + 500; })
        .attr("y", function(d, i) { return (1 + i) * margin / 4 + (1 - d) * (-outerHeight); });
    weightText.transition()
        .delay(800)
        .text(sackSag <= maxWeight ? "Your bag weighs " + sackSag + "kg" : "Your bag is overweight")
        .style("font", textSize + "px sans-serif")
        .style("color", sackSag <= maxWeight ? "black" : "red");
    valueText.transition()
        .delay(800)
        .text("Your bag contains $" + sackVal)
        .style("font", textSize + "px sans-serif");
}

function emptySack() {
    for(i in items) {
        items[i].moving = items[i].insack % 2;
        items[i].insack = 0;
    }
    update(true);
}