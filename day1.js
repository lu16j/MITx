function calculate(text) {
    var pattern = /\d*\.?\d+|\+|\-|\*|\/|\(|\)/g;          //matches nonzero digit sequences, operators and parentheses, g means global match
    var tokens = text.match(pattern);
    try {
        var val = evaluate(tokens);
        if(tokens.length > 0)   throw("ill-formed expression");
        return String(val);
    } catch(err) {
        return err;
    }
}

function read_operand(array) {
    var num = array.shift();
    if(num == '(') {
        num = evaluate(array);
        if(array.shift() != ')')    throw("missing close parenthesis");
    }
    if(num == '-')  num += array.shift();
    var out = parseFloat(num);
    if(isNaN(out)) {
        throw("number expected");
    }
    else {
        return out;
    }
}

function evaluate(array) {
    if(array.length === 0) {
        throw("missing operand");
    }
    var val = read_operand(array);
    while(array.length > 0) {
        if(array[0] == ')') return val;
        var oper = array.shift();
        if($.inArray(oper,['*','/','+','-']) == -1)   throw("unrecognized operator");
        if(array.length === 0)  throw("missing operand");
        var temp = read_operand(array);
        if(oper == '+') val = val+temp;
        if(oper == '-') val = val-temp;
        if(oper == '*') val = val*temp;
        if(oper == '/') val = val/temp;
    }
    return val;
}

function setup_calc(div) {
    var input = $('<input></input>',{type: 'text'});    //directly associating attributes to input
    var output = $('<div></div>');                      //single, double quotes don't matter in javascript
    var button = $('<button>Do thing</button>');
    button.bind('click',function(){
        output.text(String(calculate(input.val())));    //val of input calculated, turned into string, added to output
    });
    $(div).append(input,button,output);                 //creates HTML thing in the div
}

$(document).ready(function(){
    $('.calculator').each(function(){                   //javascript for loop, dot means class, # means id
        setup_calc(this);                               //passes each div as the argument for 'setup_calc'
    });
});