var sys = require("sys"),  
my_http = require("http");

var solutions = ['red','orange','green','orange','red'];

function checkAnswer(currentQuestion, answer) {
        if(answer === solutions[currentQuestion]) {
            return 'true';
        }
        return 'false';
    }

my_http.createServer(function(request,response){  
    sys.puts("I got kicked");  
    response.writeHeader(200, {"Content-Type": "text/plain",
                               "Access-Control-Allow-Origin": "*"});
    var data = require('url').parse(request.url, true).query;
    var answer = checkAnswer(data.currentQuestion, data.answer);
    response.write(answer);
    response.end();  
}).listen(8080);  
sys.puts("Server Running on 8080");