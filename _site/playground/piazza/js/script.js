(function(window, document, undefined) {

    // pane elements
    var rightPane = document.getElementById('right-pane'),
        leftPane  = document.getElementById('left-pane'),
        interactors = document.getElementById('interactors'),
    // TODO: add other panes here

    // button and input elements
    // TODO: add button/input element selectors here
        newQuestionForm = interactors.querySelector('.btn'),
        searchQuestion  = interactors.querySelector('#search');


    // script elements that correspond to Handlebars templates
    var questionsTemplate    = document.getElementById('questions-template'),
        questionFormTemplate = document.getElementById('question-form-template'),
        expandedQuestionTemplate = document.getElementById('expanded-question-template');
    // TODO: add other script elements corresponding to templates here

    // compiled Handlebars templates
    var templates = {
        renderQuestions   : Handlebars.compile(questionsTemplate.innerHTML),
        renderExpandedQuestion : Handlebars.compile(expandedQuestionTemplate.innerHTML),
        renderQuestionForm: Handlebars.compile(questionFormTemplate.innerHTML)
        // TODO: add other Handlebars render functions here
    };

    // Ugly global variable
    var questions, displayQuestion;

    /* Returns the questions stored in localStorage. */
    function getStoredQuestions() {
        if (!localStorage.questions) {
            // default to empty array
            localStorage.questions = JSON.stringify([]);
        }

        return JSON.parse(localStorage.questions);
    }

    /* Store the given questions array in localStorage.
     *
     * Arguments:
     * questions -- the questions array to store in localStorage
     */
    function storeQuestions(questions) {
        localStorage.questions = JSON.stringify(questions);
    }

    // TODO: tasks 1-5 and one extension
    rightPane.addEventListener('click',function(event){
        var target = event.target,
            newQuestion = {};
            //questions;
        event.preventDefault();
        
        if(target.type === "submit"){
            console.log("right click");
            if(target.parentNode.id === "question-form"){

                newQuestion.id       = Math.random();
                newQuestion.subject  = document.getElementById('input-subject').value;
                newQuestion.question = document.getElementById('input-question').value;
                questions = getStoredQuestions();
                if(newQuestion.subject && newQuestion.question){
                    questions.push(newQuestion);
                    storeQuestions(questions);
                    leftPane.innerHTML  = templates.renderQuestions({
                                                questions:getStoredQuestions()
                                            });
                }
            }else if(target.parentNode.id === "response-form"){
                var response = {};
                    response.name = document.getElementById('response-name').value,
                    response.response = document.getElementById('response-content').value;
                if(response.name && response.response){
                    if(!displayQuestion.responses){
                        displayQuestion.responses = [];
                    }
                    displayQuestion.responses.push(response);
                    rightPane.innerHTML = templates.renderExpandedQuestion(displayQuestion);
                    storeQuestions(questions);
                }
            }
        }else if(target.classList.contains('resolve')){
            console.log('hahahaha');
            questions.forEach(function(e,i){
                if(e === displayQuestion){
                    questions.splice(i,1);
                }
            });
            storeQuestions(questions);
            rightPane.innerHTML = templates.renderQuestionForm();
            leftPane.innerHTML  = templates.renderQuestions({
                                                questions:getStoredQuestions()
                                            });
            console.log(questions);
        }
    });

    leftPane.addEventListener('click', function(event){
        var target = event.target;
        // IE10 +
        if(target.parentNode.classList.contains('question-info')){
            target = target.parentNode;
        }
        if(target.classList.contains('question-info')){
            console.log('left click');
            questions = getStoredQuestions();
            console.log(questions);
            displayQuestion = questions.filter(function(e){
                if(e.id == target.id){
                    return e;
                }
            })[0];
            console.log(displayQuestion);
            rightPane.innerHTML = templates.renderExpandedQuestion(displayQuestion);
        }
    });

    newQuestionForm.addEventListener('click', function(event){
        var target = event.target;
        rightPane.innerHTML = templates.renderQuestionForm();
    });
    //localStorage.removeItem('questions'); // clear

    // display question form initially
    //console.log(getStoredQuestions());
    rightPane.innerHTML = templates.renderQuestionForm();

    // TODO: display question list initially (if there are existing questions)
    console.log(window.localStorage);
    if(localStorage.questions){
        leftPane.innerHTML  = templates.renderQuestions({
            questions:getStoredQuestions()
        });
    }
})(this, this.document);
