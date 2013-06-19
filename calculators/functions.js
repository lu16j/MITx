var calculator = (function() {
    var exports = {};
    
    function bar(a) {
        return a+1;
    }
    
    function foo(a,b) {
        return bar(a)+b;
    }
    
    exports.foo = foo;
    
    return foo;
})();