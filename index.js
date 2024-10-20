// setting element
let quastionCount = document.querySelector('.count span');
let bullets = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz_area');
let answerArea = document.querySelector('.answer_area');
let submitButton = document.querySelector('.submit_button');
let results = document.querySelector('.results');
let allBullets = document.querySelector('.bullets');
let countd = document.querySelector('.countdown');
let countDownIntrval;
let quastionIndex = 0;
let rightAnswer = 0;

function getRequast() {
    let myRequast = new XMLHttpRequest();
    myRequast.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let quastionObject = JSON.parse(this.responseText);
            let numberOfQ = quastionObject.length;
            createBullets(numberOfQ);
            addQuastionData(quastionObject[quastionIndex], numberOfQ);
            countDown(3, numberOfQ);
            submitButton.onclick = function () {
                let rAnswer = quastionObject[quastionIndex].rigth_answer;
                quastionIndex++;
                checkAnswer(rAnswer, numberOfQ);
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";
                addQuastionData(quastionObject[quastionIndex], numberOfQ);
                handleBullets();
                clearInterval(countDownIntrval);
                countDown(3,numberOfQ);
                getResults(numberOfQ);
            }
        }
    };
    myRequast.open("GET", "text.json", true);
    myRequast.send()
}
getRequast();
// create bullets 
function createBullets(num) {
    quastionCount.innerHTML = num;
    for (let i = 0; i < num; i++) {
        span = document.createElement('span');
        if (i === 0) {
            span.className = 'on';
        }
        bullets.appendChild(span);
    }
}
// create quastion and answers 
function addQuastionData(obj, num) {
    if (quastionIndex < num) {
        let h2 = document.createElement('h2');
        let h2Text = document.createTextNode(obj.title);
        h2.appendChild(h2Text);
        quizArea.appendChild(h2);
        for (let i = 1; i <= 4; i++) {
            let mainDiv = document.createElement('div');
            mainDiv.className = 'answer';
            let input = document.createElement('input');
            input.type = 'radio';
            input.name = 'quastion';
            input.id = `answer_${i}`;
            input.dataset.answer = obj[`answer_${i}`];
            if (i === 1) {
                input.checked = true;
            }
            let label = document.createElement('label');
            label.htmlFor = `answer_${i}`;
            let labelText = document.createTextNode(obj[`answer_${i}`]);
            label.appendChild(labelText);
            mainDiv.appendChild(input);
            mainDiv.appendChild(label);
            answerArea.appendChild(mainDiv);
        }
    }
}
function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("quastion");
    let currentAnswer;
    for (let i = 0; i < 4; i++) {
        if (answers[i].checked) {
            currentAnswer = answers[i].dataset.answer;
        }
    }
    if (currentAnswer === rAnswer) {
        rightAnswer++;
    }
}
function handleBullets() {
    let spans = document.querySelectorAll('.spans span');
    let spansArray = Array.from(spans);
    spansArray.forEach((span, index) => {
        if (quastionIndex === index) {
            span.className = "on";
        }
    })
}
function getResults(num) {
    if (quastionIndex === num) {
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        allBullets.remove();
        let span = document.createElement('span');
        let rank = document.createElement('span');
        if (rightAnswer > num / 2 && rightAnswer < num) {
            rankText = document.createTextNode('good ');
            rank.className = "good";
        } else if (rightAnswer === num) {
            rankText = document.createTextNode('perfect ');
            rank.className = "perfect";
        } else {
            rankText = document.createTextNode('bad ');
            rank.className = "bad";
        }
        rank.appendChild(rankText);
        span.appendChild(rank);
        let spanText = document.createTextNode(`your result is ${rightAnswer} from ${num}`);
        span.appendChild(spanText);
        results.appendChild(span);
    }
}
function countDown(duration, countq) {
    if (countq > quastionIndex) {
        countDownIntrval = setInterval(() => {
            let minutes = parseInt(duration / 60);
            let seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes ; 
            seconds = seconds < 10 ?  `0${seconds}` : seconds ; 
            countd.innerHTML = `${minutes} : ${seconds}`;
            if (--duration < 0) {
                clearInterval(countDownIntrval);
                submitButton.click(); 
            }
        }, 1000);
    }
}