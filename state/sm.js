function SM() {
    var exports = {};
    
    //the important mechanisms
    var values = {};
    var functions = {};
    
    //the setup components
    var connections = [];
    var components = {};
    
    //the component definition functions
    function component(name, type, input, K) {
        values[name] = [0];
        if(type === 'delay') {
            values[name].push(0);
            functions[name] = function (i) {
                return values[input][i];
            };
        }
        if(type === 'gain') {
            functions[name] = function (i) {
                return K * values[input][i];
            };
        }
        if(type === 'adder') {
            functions[name] = function (i) {
                var output = 0;
                for(inp in input)
                    output += values[input[inp]][i];
                return output;
            };
        }
        if(type === 'out') {
            functions.out = function (i) {
                return values[input][i];
            };
        }
    }
    
    //Performs 1 time step with input 'inp'
    function step(inp) {
        //Identifies the current time index
        var i = values.input.length;
        //Adds 'inp' to the array of inputs at the current time index
        values.input.push(inp);
        //keeps track of components already stepped
        var done = [];
        var next;
        //skips components if not ready to be stepped
        while(done.length < Object.keys(functions).length) {
            for(f in functions) {
                if(done.indexOf(f) < 0) {
                    next = functions[f](i);
                    if(next !== undefined & !isNaN(next)) {
                        values[f].push(next);
                        done.push(f);
                    }
                }
            }
        }
        //Returns the output
        return values.out[i];
    }
    //Steps through an array of inputs, returns array of outputs
    function transduce(inps) {
        var results = [];
        for(i in inps)
            results.push(step(inps[i]));
        return results;
    }
    //initializes machine according to components and connections
    //if previously initialized, can take no arguments
    function initialize(comp, conn) {
        values.input = [0];
        if(components !== undefined)
            components = comp;
        if(connections !== undefined)
            connections = conn;
        components.out = ['out',[]];
        //defines parent of each component based on connections
        for(c in connections) {
            var conn = connections[c];
            var parent = conn[0];
            var child = conn[1];
            var type = components[child][0];
            switch (type) {
                case 'adder':
                    if(components[child][1].indexOf(parent) < 0)
                        components[child][1].push(parent);
                    break
                default:
                    components[child][1] = parent;
            }
        }
        
        for(c in components) {
            var comp = components[c];
            component(c, comp[0], comp[1], comp[2]);
        }
    }
    
    exports.step = step;
    exports.transduce = transduce;
    exports.initialize = initialize;
    
    return exports;
};

//TESTING JSPLUMB - lists all connections as pairs of from, to
function listConns() {
    var conns = jsPlumb.getConnections();
    var list = [];
    for(c in conns)
        list.push([conns[c].sourceId, conns[c].targetId]);
    return list;
}

//name: [type, input(s)[, K]]
var components = {
    sub: ['adder', []],
    g2: ['gain', [], 2],
    r1: ['delay', []],
    gn1: ['gain', [], -1],
    r2: ['delay', []],
    g1p5: ['gain', [], 1.5],
    gn2: ['gain', [], -2],
    add: ['adder', []]
};
//[parent, child]
var connections = [
    ['input', 'sub'],
    ['sub', 'g2'],
    ['g2', 'r1'],
    ['g2', 'r2'],
    ['r1', 'gn1'],
    ['gn1', 'sub'],
    ['r2', 'g1p5'],
    ['r2', 'gn2'],
    ['g1p5', 'add'],
    ['gn2', 'add'],
    ['add', 'out']
];

var sm = SM();
sm.initialize(components, connections);

//should return [0, -1, 2, -4, 8, -16, 32, -64, 128, -256]
var result = sm.transduce([1,0,0,0,0,0,0,0,0,0]);
console.log(result);

/************************
* CHART MAGIC HAPPENS HERE
************************/

var chart = $('.canvas').highcharts({
    title: {text: 'State Machine'},
    xAxis: {title: {text: 'Time Step'}, categories: []},
    yAxis: {
        title: {text: 'Output'},
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    exporting: {enabled: false},
    tooltip: {},
    legend: {},
    series: [{name: 'Test', id: 'a', data: result}]
});

function step() {
    chart.highcharts().get('a').addPoint(sm.step(0));
}

$('tspan').eq($('tspan').length-1).hide();

var interval;

$('.stop').on('click', function () {
    if($(this).text() === "Start") {
        interval = setInterval(step, 1000);
        $(this).text("Stop");
    }
    else {
        clearInterval(interval);
        $(this).text("Start");
    }
});