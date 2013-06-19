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
/*
Sets up the HTML calculator
*/
function setup_calc(div) {
    var output = $('<div class="output"></div>');
    var mc = $('<button>MC</button>');
    var mp = $('<button>M+</button>');
    var mm = $('<button>M-</button>');
    var mr = $('<button>MR</button>');
    var buttons1 = $('<div class="buttons"></div>');
    var c = $('<button>C</button>');
    var pm = $('<button>+-</button>');
    var d = $('<button class="input">/</button>');
    var m = $('<button class="input">*</button>');
    var buttons2 = $('<div class="buttons"></div>');
    var se = $('<button>7</button>');
    var ei = $('<button>8</button>');
    var ni = $('<button>9</button>');
    var mi = $('<button>-</button>');
    var buttons3 = $('<div class="buttons"></div>');
    var fo = $('<button>4</button>');
    var fi = $('<button>5</button>');
    var si = $('<button>6</button>');
    var pl = $('<button>+</button>');
    var buttons4 = $('<div class="buttons"></div>');
    var on = $('<button>1</button>');
    var tw = $('<button>2</button>');
    var th = $('<button>3</button>');
    var eq = $('<button id="tall">=</button>');
    var buttons5 = $('<div class="buttons"></div>');
    var ze = $('<button id="long">0</button>');
    var po = $('<button>.</button>');
    var buttons6 = $('<div class="buttons"></div>');
    buttons6.append(ze,po);
    buttons5.append(on,tw,th,eq);
    buttons1.append(mc,mp,mm,mr);
    buttons2.append(c,pm,d,m);
    buttons3.append(se,ei,ni,mi);
    buttons4.append(fo,fi,si,pl);
    $(div).append(output,buttons1,buttons2,buttons3,buttons4,buttons5,buttons6);

    $('button').bind('click', function(){
        var curButton = $(this).text();
        if (isNaN(curButton)) {
            //might be an equal sign or anything that's not the number key
            var symbols = ['+', '-', '/', '*', '.'];
            if ($.inArray(curButton, symbols) !== -1) {
                output.text(output.text()+$(this).text());
            }
            if(curButton === '=') {
                output.text(String(calculate(output.text())));
            }
            if(curButton === 'C') {
                output.text('')
            }
        }
        else {
            output.text(output.text()+$(this).text());
        }
    });

}

/*
Calls setup when document is ready
*/
$(document).ready(function(){
    $('.apple-calculate').each(function(){                   //javascript for loop, dot means class, # means id
        setup_calc(this);                               //passes each div as the argument for 'setup_calc'
    });
});