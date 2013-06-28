var counter = (function () {
    
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
    
    function Model() {
        var handler = UpdateHandler();
        var value = 0;
        
        function plusOne() {
            value += 1;
            handler.trigger('update', value);
        }
        function reset() {
            value = 0;
            handler.trigger('update', value);
        }
        
        return {plusOne: plusOne, reset: reset, on: handler.on};
    }
    
    function Controller(model) {
        function increment() {
            model.plusOne();
        }
        function reset() {
            model.reset();
        }
        
        return {increment: increment, reset: reset};
    }
    
    function View(div, model, controller) {
        var display = $('<div><blockquote>The current value of the counter is <span>0</span>.</blockquote></div>');
        var value = display.find('span');
        
        function update(val) {
            value.text(val);
        }
        model.on('update', update);
        
        div.append(display);
        return {};
    }
    
    function setup(div) {
        var model = Model();
        var controller = Controller(model);
        var view = View(div, model, controller);
        var view2 = View(div, model, controller);
        
        var increment = $('<button class="btn btn-success">Increment</button>');
        increment.on('click', controller.increment);
        var reset = $('<button class="btn btn-warning">Reset</button>');
        reset.on('click', controller.reset);
        
        div.append(increment, " ", reset);
    }
    
    return { setup: setup };
}());

$(document).ready(function () {
    $(".counter").each(function () {
        counter.setup($(this));
    });
});