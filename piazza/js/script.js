(function(window, document, undefined) {

    testQuestions =[
        {
            id : Math.random(),
            subject: "How do JavaScript closures work?",
            question: "How would you explain it to someone with a knowledge of the concepts which make up closures (for example, functions, variables and the like), but does not understand closures themselves?"
        },
        {
            id : Math.random(),
            subject : "What is the difference b...erver-side programming?",
            question : 'Why does this not write "bar" into my text file, but alerts "42"?'
        },
        {
            id : Math.random(),
            subject :   "How can I get query string values in JavaScript?",
            question : "Is there a plugin-less way of retrieving query string values via jQuery (or without)?"
        },
        {
            id : Math.random(),
            subject : "Attribution of DOM Element",
            question : "How do I set an attribution of DOM Element?"
        },
        {
            id : Math.random(),
            subject : "How to return the response from an asynchronous call?",
            question : "I have a function foo which makes an Ajax request. How can I return the response from foo?",
            responses : [{
                name :  "Vladimir Kornea",
                response : "You don't need jQuery for that purpose. You can use just some pure JavaScript"
            }]

        }
    ]
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
            localStorage.questions = JSON.stringify(testQuestions);
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

    /* Sort the questions to move the favoite question to the before
     *
     */
     function sortFavorite(obj1, obj2){
        if(obj1.favorite === true && obj2.favorite !== true){
            return -1;
        }else if(obj2.favorite === true && obj1.favorite !== true){
            return 1;
        }else{
            return 0;
        }
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
                    if( newQuestion.question.length < 50 || newQuestion.question.length > 500 ){
                        document.getElementById('question-error').style.display = "block";
                        return false;
                    }

                    questions.push(newQuestion);
                    storeQuestions(questions);
                    leftPane.innerHTML  = templates.renderQuestions({
                                                questions:getStoredQuestions()
                                            });
                    rightPane.innerHTML = templates.renderQuestionForm();
                }
            }else if(target.parentNode.id === "response-form"){
                var response = {};
                    response.name = document.getElementById('response-name').value,
                    response.response = document.getElementById('response-content').value;
                if(response.name && response.response){

                    if(response.response.length<50 || response.response.length>500){
                        if(! /^(\w+)\s+(\w+)$/.test(response.name) ){
                            document.getElementById('name-error').style.display = "inline-block"
                        }
                        document.getElementById('answer-error').style.display = "block";
                        return false;
                    }
                    if(! /^(\w+)\s+(\w+)$/.test(response.name) ){
                        document.getElementById('name-error').style.display = "inline-block"
                        return false;
                    }
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
        var target = event.target,
            changeFavorite = false;
        // IE10 +
        if(target.classList.contains('fa')){
            toggleFavorite(target.classList);
            changeFavorite = true;
        }
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
            if (changeFavorite) {
                if(!displayQuestion.favorite){
                    displayQuestion.favorite = true;
                }else{
                    displayQuestion.favorite = !displayQuestion.favorite;
                }
                questions.sort(sortFavorite);
                console.log(questions);
                storeQuestions(questions);
            };
            rightPane.innerHTML = templates.renderExpandedQuestion(displayQuestion);
        }
    });

    newQuestionForm.addEventListener('click', function(event){
        var target = event.target;
        rightPane.innerHTML = templates.renderQuestionForm();
    });

    searchQuestion.addEventListener('keyup',function(event){
        var searchString = searchQuestion.value,
            leftQuestions,
            clearRight = true;
        if(searchString.length){
            leftQuestions = getStoredQuestions().filter(function(e){
                if((e.subject+' '+e.question).toLowerCase().indexOf(searchString.toLowerCase()) !== -1){
                    if(displayQuestion && e.id === displayQuestion.id){
                        clearRight = false;
                    }
                    return e;
                }
            });
            leftPane.innerHTML = templates.renderQuestions({
                questions: leftQuestions
            });

            if(leftQuestions.length !== 0){
                var allh3 = leftPane.getElementsByTagName("h3"),
                    allp  = leftPane.getElementsByTagName("p");
                for (var i = 0; i < leftQuestions.length; i++) {
                    var h3 = allh3[i].innerHTML,
                        p  = allp[i].innerHTML;
                    var searchPattern = new RegExp(('('+searchString+')'), 'ig');
                    searchPattern.exec(h3);
                    searchPattern.exec(p);
                    h3 = h3.replace(searchPattern, '<span class="searched">'+RegExp.$1+'</span>');
                    p  = p.replace(searchPattern, '<span class="searched">'+RegExp.$1+'</span>');
                    allh3[i].innerHTML = h3;
                    allp[i].innerHTML  = p;
                };
            }

            if(clearRight){
                rightPane.innerHTML =templates.renderQuestionForm();
            }

        }else{
            leftPane.innerHTML = templates.renderQuestions({
                questions: getStoredQuestions()
            });
        }
    });

    //localStorage.removeItem('questions'); // clear

    // display question form initially
    //console.log(getStoredQuestions());
    rightPane.innerHTML = templates.renderQuestionForm();

    // TODO: display question list initially (if there are existing questions)
    console.log(localStorage.questions);
    if(localStorage.questions == undefined || localStorage.questions== "[]"){
        storeQuestions(testQuestions);
    }
    console.log(getStoredQuestions());
    if(localStorage.questions){
        leftPane.innerHTML  = templates.renderQuestions({
            questions:getStoredQuestions()
        });
    }

    function toggleFavorite(classlist){
        classlist.toggle('fa-heart');
        classlist.toggle('fa-heart-o');
    }
})(this, this.document);
