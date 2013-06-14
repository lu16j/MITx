$(document).ready(function () {
    $('.graphcalc').each(function () {
        setup_calc(this);
    });
});

function setup_calc(div) {
    var graph = $('<canvas width="400" height="300"></canvas>', {id: 'canvas'});
    var input = $('<input></input>', {type: 'text', id: 'input1'});
    var xmin = $('<input></input>', {type: 'text', id: 'input2'});
    var xmax = $('<input></input>', {type: 'text', id: 'input2'});
    var plot = $('<button>Plot</button>');

    var text0 = $('<text>f(x): </text>');
    var text1 = $('<text>min x: </text>');
    var text2 = $('<text>max x: </text>');
    plot.bind("click", function () {
        graphFunct(graph, input, xmin, xmax);
    });
    var graphDiv = $('<div></div>');
    var equationDiv = $('<div></div>');
    var xDiv = $('<div></div>');
    var buttonDiv = $('<div></div>');
    
    graphDiv.append(graph);
    equationDiv.append(text0, input);
    xDiv.append(text1, xmin, text2, xmax);
    buttonDiv.append(plot);
    
    var showButton = $('<button><img src="http://www.chimoosoft.com/osxpicks/images/graphericon.png" width=30 height=30></img></button>');
    
    var widgetDiv = $('<div></div>').append(graphDiv, equationDiv, xDiv, buttonDiv);
    
    $(div).append(showButton, widgetDiv);
    
    widgetDiv.toggle();
    
    showButton.on('click', function () {
        widgetDiv.toggle();
    });

}


function graphFunct(graph, input, xmin, xmax) {
    var DOMgraph = graph[0];
    var ctx = DOMgraph.getContext('2d');
    ctx.clearRect(0,0,400,300);
        
    try {
        var bgImage = $('<canvas></canvas>')[0];
        bgImage.width = 400;
        bgImage.height = 300;
        var bctx = bgImage.getContext('2d');
//        bctx.fillStyle = '#D6F4FC';
//        bctx.fillRect(0, 0, 400, 300);
        bctx.beginPath();
    
        var xstart = parseFloat(xmin.val());
        var xend = parseFloat(xmax.val());
        
        if (!(xend > xstart))   throw("Invalid min and/or max")
        
        var yvalues = [];
        
        var equat = calculator.parse(input.val());
        var ymax = -1000;
        var ymin = 1000;
        for (var x=0; x<=graph.width(); x++) {
            var y = calculator.evaluate(equat,{'x':fromX(x,xstart,xend,graph)});
            yvalues.push(y);
            ymax = Math.max(ymax,y);
            ymin = Math.min(ymin,y);
        }
        var padding = 0.1*(ymax-ymin);
        ymax += padding;
        ymin -= padding;
        for(var x=0; x<=graph.width(); x++) {
            var y = toY(yvalues[x],ymin,ymax,graph);
            bctx.lineTo(x,y);
            bctx.moveTo(x,y);
        }
    
        bctx.lineWidth = 2;
        bctx.strokeStyle = '#000000';
        bctx.stroke();
        
        graph.on("mousemove",function(event){
            var mx = event.pageX;
            var my = event.pageY;
            var offset = graph.offset();
            mx = Math.round(mx-offset.left);
            my = Math.round(my-offset.top);
            ctx.clearRect(0,0,400,300);
            ctx.drawImage(bgImage,0,0);
            ctx.beginPath();
            ctx.moveTo(mx,0);
            ctx.lineTo(mx,300);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = 'black';
            ctx.font = '20px Georgia';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(String(Math.round(yvalues[mx]*10000)/10000), 200,300);
        });
    
        ctx.drawImage(bgImage,0,0);
    }
    catch(err){
        ctx.fillStyle = "black";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(err,200,150);  
        graph.off();
    }
    
    
}

function thing_mouse(graph) {
    var jqcanvas = graph;
    var domcanvas = jqcanvas[0];
    var ctx = domcanvas.getContext("2d");
    var bgImage = $('<canvas></canvas>')[0];
    bgImage.width = 400;
    bgImage.height = 300;
    var bctx = bgImage.getContext('2d');
    ctx.drawImage(bgImage,0,0);
    jqcanvas.on("mousemove",function(event){
        var mx = event.pageX;
        var my = event.pageY;
        var offset = jqcanvas.offset();
        mx = Math.round(mx-offset.left);
        my = Math.round(my-offset.top);
        ctx.drawImage(bgImage,0,0);
        ctx.beginPath();
        ctx.moveTo(mx,0);
        ctx.lineTo(mx,300);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
    jqcanvas.on("mouseout",function(event){
        jqcanvas.off();
    });
}

function fromX(x,xmin,xmax, graph) {
    return x*(xmax-xmin)/graph.width()+xmin;
}

function toY(y,ymin,ymax, graph) {
    return (ymax-y)*graph.height()/(ymax-ymin);
}

function toX(x,xmin,xmax, graph) {
    return (x-xmin)*graph.width()/(xmax-xmin);
}