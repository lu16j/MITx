function thing_clear() {
    var jqcanvas = $('#thing:first');
    var domcanvas = jqcanvas[0];
    var ctx = domcanvas.getContext("2d");
    ctx.clearRect(0,0,jqcanvas.width(),jqcanvas.height());
}

function thing_line() {
    thing_clear();
    var jqcanvas = $('#thing:first');
    var domcanvas = jqcanvas[0];
    var ctx = domcanvas.getContext("2d");
    ctx.fillRect(50,50,100,100);
}

function thing_smiley() {
    thing_clear();
    var jqcanvas = $('#thing:first');
    var domcanvas = jqcanvas[0];
    var ctx = domcanvas.getContext("2d");
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.arc(100,100,80,0,2*Math.PI);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(100,100,50,Math.PI/8,7*Math.PI/8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(125,80,7,0,2*Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(75,80,7,0,2*Math.PI);
    ctx.fill();
}

function thing_text() {
    thing_clear();
    var jqcanvas = $('#thing:first');
    var domcanvas = jqcanvas[0];
    var ctx = domcanvas.getContext("2d");
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.font = '20px Georgia';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Hi! I am thing.', 100,100);
}

function thing_star() {
    thing_clear();
    var x = 100;
    var y = 100;
    var jqcanvas = $('#thing:first');
    var domcanvas = jqcanvas[0];
    var ctx = domcanvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(x+80*Math.cos(Math.PI/2),y-80*Math.sin(Math.PI/2));
    ctx.lineTo(x+40*Math.cos(Math.PI/2+Math.PI/5),y-40*Math.sin(Math.PI/2+Math.PI/5));
    ctx.lineTo(x+80*Math.cos(Math.PI/2+2*Math.PI/5),y-80*Math.sin(Math.PI/2+2*Math.PI/5));
    ctx.lineTo(x+40*Math.cos(Math.PI/2+3*Math.PI/5),y-40*Math.sin(Math.PI/2+3*Math.PI/5));
    ctx.lineTo(x+80*Math.cos(Math.PI/2+4*Math.PI/5),y-80*Math.sin(Math.PI/2+4*Math.PI/5));
    ctx.lineTo(x+40*Math.cos(Math.PI/2+5*Math.PI/5),y-40*Math.sin(Math.PI/2+5*Math.PI/5));
    ctx.lineTo(x+80*Math.cos(Math.PI/2+6*Math.PI/5),y-80*Math.sin(Math.PI/2+6*Math.PI/5));
    ctx.lineTo(x+40*Math.cos(Math.PI/2+7*Math.PI/5),y-40*Math.sin(Math.PI/2+7*Math.PI/5));
    ctx.lineTo(x+80*Math.cos(Math.PI/2+8*Math.PI/5),y-80*Math.sin(Math.PI/2+8*Math.PI/5));
    ctx.lineTo(x+40*Math.cos(Math.PI/2+9*Math.PI/5),y-40*Math.sin(Math.PI/2+9*Math.PI/5));
    ctx.lineTo(x+80*Math.cos(Math.PI/2+10*Math.PI/5),y-80*Math.sin(Math.PI/2+10*Math.PI/5));
    ctx.stroke();
}

function thing_mouse() {
    var jqcanvas = $('#thing:first');
    var domcanvas = jqcanvas[0];
    var ctx = domcanvas.getContext("2d");
    var bgImage = $('<canvas></canvas>')[0];
    bgImage.width = 200;
    bgImage.height = 200;
    var bctx = bgImage.getContext('2d');
    bctx.fillStyle = "#FFE0E0";
    bctx.fillRect(0,0,200,200);
    ctx.drawImage(bgImage,0,0);
    jqcanvas.on("mousemove",function(event){
        var mx = event.pageX;
        var my = event.pageY;
        var offset = jqcanvas.offset();
        mx = Math.round(mx-offset.left);
        my = Math.round(my-offset.top);
        ctx.drawImage(bgImage,0,0);
        ctx.beginPath();
        ctx.moveTo(mx-10,my);
        ctx.lineTo(mx+10,my);
        ctx.moveTo(mx,my-10);
        ctx.lineTo(mx,my+10);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
    jqcanvas.on("mouseout",function(event){
        jqcanvas.off();
    });
}

function thing_sine() {
    thing_clear();
    var jqcanvas = $('#thing:first');
    var domcanvas = jqcanvas[0];
    var ctx = domcanvas.getContext("2d");
    ctx.beginPath();
    for(var i=0; i<=jqcanvas.width(); i++) {
        ctx.lineTo(i,toY(calculate('sin('+String(fromX(i,-2*Math.PI,0))+')'),-1,1));
    }
    ctx.stroke();
}


function fromX(x,xmin,xmax) {
    var jqcanvas = $('#thing:first');
    return x*(xmax-xmin)/jqcanvas.width()-(jqcanvas.width()/2)*(xmax-xmin)/jqcanvas.width()+xmax;
}

function toY(y,ymin,ymax) {
    var jqcanvas = $('#thing:first');
    return (ymax-y)*jqcanvas.height()/(ymax-ymin);
}

function toX(x,xmin,xmax) {
    var jqcanvas = $('#thing:first');
    return (x-xmin)*jqcanvas.width()/(xmax-xmin);
}
/*
Calculates the input expression
*/
function calculate(text) {
    var pattern = /\d*\.?\d+|\+|\-|\*|\/|\w*\(|\)|\^|\%/g;          //matches nonzero digit sequences, operators and parentheses, g means global match
    var tokens = text.match(pattern);
    try {
        var val = evaluate(tokens);
        if(tokens.length > 0)   throw("ill-formed expression");
        return String(val);
    } catch(err) {
        return err;
    }
}
/*
Reads the next operand in the expression
*/
function read_operand(array) {
    var num = array.shift();
    if(num == '(') {
        num = evaluate(array);
        if(array.shift() != ')')    throw("missing close parenthesis");
    }
    if(num == 'sin(') {
        num = Math.sin(evaluate(array));
        if(array.shift() != ')')    throw("missing close parenthesis");
    }
    if(num == '-')  num += array.shift();
    var out = parseFloat(num);
    if(array[0] == '^') {
        array.shift();
        out = Math.pow(out,read_term(array))
    }
    if(isNaN(out)) {
        throw("number expected");
    }
    else {
        return out;
    }
}
/*
Evaluates the expression
*/
function evaluate(array) {
    if(array.length === 0) {
        throw("missing operand");
    }
    var val = read_term(array);
    while(array.length > 0) {
        if(array[0] == ')') return val;
        var oper = array.shift();
        if($.inArray(oper,['+','-']) == -1)   throw("unrecognized operator");
        if(array.length === 0)  throw("missing operand");
        var temp = read_term(array);
        if(oper == '+') val = val+temp;
        if(oper == '-') val = val-temp;
    }
    return val;
}

function read_term(array){
    if(array.length === 0) {
        throw("missing operand");
    }
    var val = read_operand(array);
    while(array.length > 0 & ['+','-'].indexOf(array[0]) == -1) {
        if(array[0] == ')') return val;
        var oper = array.shift();
        if($.inArray(oper,['*','/','%']) == -1)   throw("unrecognized operator");
        if(array.length === 0)  throw("missing operand");
        var temp = read_operand(array);
        if(oper == '*') val = val*temp;
        if(oper == '/') val = val/temp;
        if(oper == '%') val = val%temp;
    }
    return val;
}