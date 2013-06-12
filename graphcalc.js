$(document).ready(function(){
    $('.graphcalc').each(function(){
        setup_calc(this);
    });
});

function setup_calc(div) {
    var graph = $('<canvas width="400" height="400">test</canvas>');
    var input = $('<input>Equation</input>',{type: 'text'});
    var xmin = $('<input>Min X</input>',{type: 'text'});
    var xmax = $('<input>Max X</input>',{type: 'text'});
    var plot = $('<div><button>Plot</button></div>');
    plot.bind("click", function(){
        graphFunct(graph,input,xmin,xmax);
    });
    
    var graphDiv = $('<div></div>');
    var equationDiv = $('<div></div>');
    var xDiv = $('<div></div>');
    var buttonDiv = $('<div></div>');
    
    graphDiv.append(graph);
    equationDiv.append(input);
    xDiv.append(xmin,xmax);
    buttonDiv.append(plot);
    
    $(div).append(graphDiv,equationDiv,xDiv,buttonDiv);

}


function graphFunct(graph,input,xmin,xmax){
    var DOMgraph = graph[0];
    var ctx = DOMgraph.getContext('2d');
    
    ctx.fillStyle = '#F0FFF0';
    ctx.fillRect(0,0,400,400);
    
    ctx.beginPath();

    var xstart = parseFloat(xmin.val());
    var xend = parseFloat(xmax.val());
    
    try{
        var equat = calculator.parse(input.val());
        for(var x=0; x<=graph.width(); x++) {
        var y = toY(calculator.evaluate(equat,{'x':fromX(x,xstart,xend,graph)}),-50,200,graph);
            ctx.lineTo(x,y);
            ctx.moveTo(x,y);
        }
    }
    catch(err){
        ctx.fillStyle = "black";
        ctx.font = "14px Georgia";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(err,200,200);   
    }
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    
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