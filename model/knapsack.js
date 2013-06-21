var knapsack = (function () {
    
    function UpdateHandler() {
        var handlers = {};
        
        function on(event, callback) {
            var callbacks = handlers[event];
            if (callbacks === undefined) {
                callbacks = [];
            }
            callbacks.push(callback);
            handlers[event] = callbacks;
        }
        function trigger(event, data) {
            var callbacks = handlers[event];
            if (callbacks !== undefined) {
                for (var i = 0; i < callbacks.length; i += 1)
                    callbacks[i](data);
            }
        }
        
        return {on: on, trigger: trigger};
    }
    //knows what's in the house and what's in the sack
    //knows the current weight and value
    function Model() {
        var handler = UpdateHandler();
        var house = [];
        var sack = [];
        
        function move(item) {
            if(item in house) {
            }
            else {
            }
            handler.trigger('update', item);
        }
        
        return {move: move, on: handler.on};
    }
    //on click, move item to house/sack
    function Controller(model) {
        function move(item) {
            model.move(item);
        }
        return {move: move};
    }
    //what's in house, what's in sack, value, weight
    function View(div, model, controller) {
        var houseDiv = div.find('.house');
        var sackDiv = div.find('.sack');
        function update(moved) {
        }
        model.on('update', update);
        
        var children = houseDiv[0].children;
        console.log(children[0].getAttribute("data-weight"));
        
        sackDiv.append(children[2]);
        sackDiv.animate({"margin-top": (10+children[2].getAttribute("data-weight"))+"px"});
        
        return {};
    }
    
    function setup(div) {
        var model = Model();
        var controller = Controller(model);
        var view = View(div, model, controller);
    }
    
    return { setup: setup };
}());

$(document).ready(function () {
    $(".knapsack").each(function () {
        knapsack.setup($(this));
    });
});