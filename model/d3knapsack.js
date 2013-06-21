var items = [
    {name: 'Cool Clock', url: "clock.png", value: 175, weight: 10, insack: 0, index: 0, moving: 0},
    {name: 'Plagiarized Painting', url: "painting.svg", value: 90, weight: 9, insack: 0, index: 1, moving: 0},
    {name: 'Retro Radio', url: "radio.png", value: 20, weight: 4, insack: 0, index: 2, moving: 0},
    {name: 'Abstract Art', url: "modernart.png", value: 50, weight: 2, insack: 0, index: 3, moving: 0},
    {name: 'Blank Book', url: "book.png", value: 10, weight: 1, insack: 0, index: 4, moving: 0},
    {name: 'Tubular TV', url: "tv.png", value: 200, weight: 20, insack: 0, index: 5, moving: 0}
];

var totalVal = 545;
var moneyLocs = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var numBills = moneyLocs.length;

var cashSound = new Audio("cashregister.mp3");
var regurgSound = new Audio("regurg.mp3");
var thudSound = new Audio("thud.mp3");

var moneyScale = d3.scale.linear()
    .domain([0,totalVal])
    .range([0,numBills]);

var sackSag = 0;
var sackVal = 0;

var maxWeight = 20;

var colorScale = d3.scale.linear()
    .domain([0,maxWeight])
    .range(['#66FF66', '#FF3333']);
var radScale = d3.scale.linear()
    .domain([0,maxWeight])
    .range([0,1]);

function updateMoney() {
    var inHouse = moneyScale(totalVal - sackVal);
    for(i in moneyLocs) {
        if(i <= inHouse)
            moneyLocs[i] = 0;
        else
            moneyLocs[i] = 1;
    }
}

$(window).resize(function () { resize(); });

var outerWidth, outerHeight, margin, innerDim, iconDim, yOffset, enlarge, sadSack, textSize, pillSize;

function xPos(d) {
    return iconDim + margin + d.index % 3 * (iconDim + margin / 2) + d.insack * outerWidth / 2;
}

function yPos(d, sag) {
    return iconDim + yOffset + Math.floor(d.index / 3) * (iconDim + margin / 2) + d.insack * sag;
}

var knapsack = d3.select(".knapsack")
    .append("svg").attr("class", "knapsack");

var background = knapsack.append("image").attr("class", "background")
    .attr("xlink:href", "forest.jpg");
    
var house = knapsack.append("image").attr("class", "house")
//    .attr("xlink:href", "http://www.easyvectors.com/assets/images/vectors/afbig/house-silhouette-clip-art.jpg")
    .attr("xlink:href", "house.png");

var sack = knapsack.append("image").attr("class", "sack")
    .attr("xlink:href", "sack.png");

var moneys = knapsack.selectAll(".money").data(moneyLocs).enter()
    .append("svg").attr("class", "money")
    .append("image")
        .attr("xlink:href", "dollar.jpg");

var weightPill = knapsack.append("svg:ellipse");

var images = knapsack.selectAll(".item").data(items).enter()
    .append("svg").attr("class", "item")
        .each(function (d) { $(this).tooltip({title: d.name + ": $" + d.value + ", " + d.weight + "lb", container: "body"}); })
    .append("image")
        .attr("xlink:href", function (d) { return d.url; })
        .attr("data-id", function (d, i) { return i; })
    .on('click', function () { move($(this)[0].getAttribute("data-id")); });

var weightText = d3.select(".weight")
    .append("text").text("Your bag weighs " + sackSag + "lb");

var valueText = d3.select(".value")
    .append("text").text("Your bag contains $" + sackVal);

function resize() {
    
    outerWidth = d3.min([800, $('.knapsack').width()]);
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
    
    pillSize = d3.min([sackSag, maxWeight]);
    weightPill.attr("cx", innerDim / 2 + outerHeight + margin)
        .attr("cy", innerDim / 2 + 3 * margin + sackSag)
        .attr("rx", radScale(pillSize) * 3 * innerDim / 8)
        .attr("ry", radScale(pillSize) * 5 * innerDim / 16)
        .attr("fill", colorScale(pillSize))
        .attr("opacity", 0.5);
    
    moneys.attr("height", margin / 2)
        .attr("width", margin)
        .attr("y", function(d, i) { return (1 + i) * margin / 4 + (1 - d) * (-outerHeight); })
        .attr("x", outerWidth - margin);
    
    images.attr("width", iconDim)
        .attr("height", iconDim)
        .attr("x", xPos)
        .attr("y", function (d) { return margin + yPos(d, sackSag); });
            
    weightText.style("font", textSize + "px sans-serif");
            
    valueText.style("font", textSize + "px sans-serif");
}

resize();

function updateWeight() {
    var h = 0;
    var s = 0;
    for(i in items) {
        if(items[i].insack > 0) {
            items[i].index = s;
            sackSag += items[i].weight;
            sackVal += items[i].value;
            if(sackSag > maxWeight) {
                sackSag = sadSack;
                thudSound.currentTime = 0;
                thudSound.play();
            }
            s += 1;
        }
        else {
            items[i].index = h;
            h += 1;
        }
    }
    pillSize = d3.min([sackSag, maxWeight]);
}

function update(empty) {
    var prevSag = sackSag;
    var prevVal = sackVal;
    sackSag = 0;
    sackVal = 0;
    
    updateWeight();
    updateMoney();
    
    if(empty)
        regurgitate();
    else
        animation(prevSag);
    
    sack.transition()
        .duration(500)
        .ease("bounce")
        .delay(800)
        .attr("y", margin + sackSag)
        .attr("transform", "");
    
    weightText.transition()
        .delay(800)
        .text(sackSag <= maxWeight ? "Your bag weighs " + sackSag + "lb" : "Your bag is overweight")
        .style("font", textSize + "px sans-serif")
        .style("color", sackSag <= maxWeight ? "black" : "red");
    valueText.transition()
        .delay(800)
        .text("Your bag contains $" + sackVal)
        .style("font", textSize + "px sans-serif");

    weightPill.transition()
        .duration(500)
        .delay(800)
        .attr("cx", innerDim / 2 + outerHeight + margin)
        .attr("cy", innerDim / 2 + 3 * margin + sackSag)
        .attr("rx", radScale(pillSize) * 3 * innerDim / 8)
        .attr("ry", radScale(pillSize) * 5 * innerDim / 16)
        .attr("fill", colorScale(pillSize));
    
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
    moneys.data(moneyLocs).transition()
        .duration(500)
        .delay(function(d, i) { return (numBills - i) * 10 + 800; })
        .attr("y", function(d, i) { return (1 + i) * margin / 4 + (1 - d) * (-outerHeight); });
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
    moneys.data(moneyLocs).transition()
        .duration(500)
        .delay(function(d, i) { return i * 10 + 500; })
        .attr("y", function(d, i) { return (1 + i) * margin / 4 + (1 - d) * (-outerHeight); });
}

function emptySack() {
    for(i in items) {
        items[i].moving = items[i].insack % 2;
        items[i].insack = 0;
    }
    update(true);
    
    regurgSound.currentTime = 0;
    regurgSound.play();
}

///////////////////////////////

var help = "Hover over items to view their value and weight. Click on an item to transfer. Click the top of the sack to empty.";
$('.help').tooltip({title: help, placement: "bottom", container: "body"});

Parse.initialize("LArvp3t9Dd0T3KoeiiytxUpJtXcEOfHHCafBjmld", "dvXpSrEQLx7frlblF1dSKvis2uFNQTQnN3OXp8TP");
var Sacker = Parse.Object.extend("Sacker");
var query = new Parse.Query(Sacker);

var username;
var nameField = $('.username');
var user;

$('.userfunctions').hide();
$('.alert').hide();

function login() {
    if(nameField.val() != '') {
        $('.userfunctions').show('slow');
        username = nameField.val();
        $('.brand').text(username);
        nameField.val('');
        nameField.attr("placeholder", "Logged in as "+username);
        query.equalTo("username", username);
        query.find({
            success: function(result) {
                if(result.length === 0) {
                    user = new Sacker();
                    user.set("username", username);
                    var insack = [];
                    for(i in items)
                        insack.push(items[i].insack);
                    user.set('insack', insack);
                    user.save();
                }
                else {
                    user = result[0];
                    for(i in items) {
                        items[i].insack = user.get('insack')[i];
                        update(false);
                    }
                }
            },
            error: function(error) {
                console.log("Error "+error);
            }
        });
    }
    else {
        $('.userfunctions').hide('slow');
        nameField.attr("placeholder", "Please enter a username");
    }
}

nameField.keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        login();
    }
});
$('.login').on('click', function () {
    login();
});
$('.save').on('click', function () {
    try {
        var insack = [];
        for(i in items)
            insack.push(items[i].insack);
        user.set('insack', insack);
        user.save();
        nameField.attr("placeholder", "Saved to "+username);
    }
    catch(err) {}
});
$('.submit').on('click', function () {
    if(sackVal >= 275 & sackSag != sadSack)
        $('.correct').show('slow');
    else
        $('.wrong').show('slow');
});