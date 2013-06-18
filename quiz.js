Parse.initialize("LArvp3t9Dd0T3KoeiiytxUpJtXcEOfHHCafBjmld", "dvXpSrEQLx7frlblF1dSKvis2uFNQTQnN3OXp8TP");

var quiz = (function () {
    var exports = {};
    
    var local = false;
    
    var questions = [   //questions with text, options, solutions
        {'questionText': 'An apple is ____.',
         'options': ['red','blue','black','orange','liquid']},
        {'questionText': 'An orange is ____.',
         'options': ['red','blue','green','orange','a vegetable']},
        {'questionText': 'A watermelon is ____.',
         'options': ['red','blue','green','orange','a vegetable']},
        {'questionText': 'A mango is ____.',
         'options': ['red','blue','green','orange','a vegetable']},
        {'questionText': 'A tomato is ____.',
         'options': ['red','blue','green','orange','a vegetable']}
    ];

    var score;
    var currentQuestion;
    var s;
    
//    function checkAnswer(answer) {    //returns true and increments score if correct
//        if(answer === questions[currentQuestion]['solution']) {
//            score++;
//            return true;
//        }
//        return false;
//    }
    
    function displayQuestion() {    //builds HTML
        //displays question and options with buttons
        //button click calls checkAnswer
        //displays yes/no, current score, next question
        var question = questions[currentQuestion];
        var text = question['questionText'];
        
        var options = $('<div class = "options"></div>');
        for(var i in question['options']) {
            var option = $('<div></div>');
            var radio = $('<input>', {type: 'radio',
                                      name: 'choice'+currentQuestion,
                                      value: question['options'][i]});
            option.append(radio, ' ', question['options'][i]);
            options.append(option);
        }
        
        var buttonDiv = $('<div></div>');
        
        var checkButton = $('<button>Submit Answer</button>');
        checkButton.on('click', function () {
            
            var answer = $('input:checked').val();
            
            $.ajax({url: "http://localhost:8080",
                    data: {answer: answer, currentQuestion: currentQuestion}}).done(function(response) {
                var correct = response === 'true';
                if(correct) {
                    score++;
                    alert('Correct!');
                }
                else {
                    alert('Wrong.');
                }
                $('.quiz').html('');
                if(currentQuestion < questions.length-1) {
                    currentQuestion++;
                    if(local) {
                        localStorage.score = score;
                        localStorage.currentQuestion = currentQuestion;
                    }
                    else {
                        s.set("score", score);
                        s.set("currentQuestion", currentQuestion);
                        s.save();
                    }
                    displayQuestion();
                }
                else {
                    $('.quiz').append(score,'/',questions.length);
                    if(local)
                        localStorage.clear();
                    else {
                        s.set("score", 0);
                        s.set("currentQuestion", 0);
                        s.save();
                    }
                }
            });
        });
        
        $('.quiz').append(text, options, buttonDiv.append(checkButton));
    }
    
    function setup() {
        
        if(local) {
            if(!("score" in localStorage))
                localStorage.score = 0;
            if(!("currentQuestion" in localStorage))
                localStorage.currentQuestion = 0;
            score = localStorage.score;
            currentQuestion = localStorage.currentQuestion;
        
            displayQuestion();
        }
        else {
            var Student = Parse.Object.extend("Student");
            var query = new Parse.Query(Student);
            query.equalTo("name", "user");
            query.find({
                success: function(result) {
                    if(result.length === 0) {
                        s = new Student();
                        s.set("score",0);
                        s.set("name","user");
                        s.set("currentQuestion",0);
                        s.save();
                    }
                    else {
                        s = result[0];
                        console.log(s);
                    }
                    score = s.get("score");
                    currentQuestion = s.get("currentQuestion");
            
                    displayQuestion();
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }
    }
    
    exports.setup = setup;
    return exports;
})();

$(document).ready(function () {
    quiz.setup();
});