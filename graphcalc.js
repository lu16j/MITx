$(document).ready(function () {
    $('.graphcalc').each(function () {
        setup_calc(this);
    });
});

function inputButton(text,output) {
    var button = $('<button class="inputButton">'+text+'</button>');
    button.on('click', function () {
        switch(text) {
            case 'C':
                output.val('');
                break
            default:
                output.val(output.val().concat(text));
        }
    });
    return button;
}

function setup_calc(div) {
    var graph = $('<canvas width="400" height="300"></canvas>', {id: 'canvas'});
    var input = $('<input></input>', {type: 'text', id: 'input1'});
    var xmin = $('<input></input>', {type: 'text', id: 'input2'});
    var xmax = $('<input></input>', {type: 'text', id: 'input2'});
    var plot = $('<button class="plotButton">Plot</button>');

    var text0 = $('<label>f(x): </label>');
    var text1 = $('<label>min x: </label>');
    var text2 = $('<label>max x: </label>');
    plot.bind("click", function () {
        graphFunct(graph, input, xmin, xmax);
    });
    var graphDiv = $('<div></div>');
    var equationDiv = $('<div></div>');
    var xDiv = $('<div></div>');
    var buttonDiv = $('<div></div>');
    
    graphDiv.append(graph);
    equationDiv.append(text0.append(input));
    xDiv.append(text1.append(xmin), text2.append(xmax));
    buttonDiv.append(plot);
    
    var validInputs = ['C','e','(',')',
                       '7','8','9','+','*','^',
                       '4','5','6','-','/','abs(',
                       '1','2','3','sin(','cos(','tan(',
                       'x','0','.','asin(','acos(','atan(',
                       'log(','sqrt(','pi'];
    for(var i in validInputs) {
        buttonDiv.append(inputButton(validInputs[i],input));
    }
    
    var showButton = $('<button class="showButton"><img src="http://www.chimoosoft.com/osxpicks/images/graphericon.png" width=30 height=30></img></button>');
    
    var widgetDiv = $('<div></div>').append(equationDiv, xDiv, graphDiv, buttonDiv);
    
    $(div).append($('<div class="show"></div>').append(showButton), widgetDiv);
    
    widgetDiv.toggle();
    $(div).css('width', "74px");
    
    var reverse = true;
    showButton.on('click', function () {
        if(reverse) {
            $(div).animate({width: "420px"}, "fast");
            reverse = !reverse;
        }
        else {
            $(div).animate({width: "74px"}, "fast");
            reverse = !reverse;
        }
        widgetDiv.toggle("fast","swing");
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
                
        bctx.beginPath();
        bctx.moveTo(0,toY(0,ymin,ymax,graph));
        bctx.lineTo(400,toY(0,ymin,ymax,graph));
        bctx.moveTo(toX(0,xstart,xend,graph),0);
        bctx.lineTo(toX(0,xstart,xend,graph),300);
        bctx.lineWidth = 1;
        bctx.strokeStyle = 'blue';
        bctx.stroke();
        
        bctx.beginPath();
        for(var x=0; x<=graph.width(); x++) {
            var y = toY(yvalues[x],ymin,ymax,graph);
            bctx.lineTo(x,y);
            bctx.moveTo(x,y);
        }
        bctx.lineWidth = 2;
        bctx.strokeStyle = 'black';
        bctx.stroke();
        
        graph.off();
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
            ctx.strokeStyle = 'gray';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = 'black';
            ctx.font = '20px Georgia';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText("("
                         +String(Math.round(fromX(mx,xstart,xend,graph)*10000)/10000)
                         +", "
                         +String(Math.round(yvalues[mx]*10000)/10000)
                         +")", 200,300);
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

function fromX(x,xmin,xmax, graph) {
    return x*(xmax-xmin)/graph.width()+xmin;
}

function toY(y,ymin,ymax, graph) {
    return (ymax-y)*graph.height()/(ymax-ymin);
}

function toX(x,xmin,xmax, graph) {
    return (x-xmin)*graph.width()/(xmax-xmin);
}