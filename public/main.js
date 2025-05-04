
function addAnswer() {
  const container = document.getElementById('answers-container');
  const div = document.createElement('div');
  div.className = 'answer-input';
  div.innerHTML = '<input type="text" placeholder="Answer option" /><button onclick="removeAnswer(this)">Remove</button>';
  container.appendChild(div);
}

function removeAnswer(button) {
  const div = button.parentNode;
  div.remove();
}

async function createPoll() {
  const question = document.getElementById('question').value.trim();
  const answerInputs = document.querySelectorAll('#answers-container input');
  const answers = Array.from(answerInputs)
                       .map(input => input.value.trim())
                       .filter(value => value);
  if (!question || answers.length < 2) {
    document.getElementById('poll-display').innerHTML ="Please enter a question and at least two answers.";
    return;
  }
 

    const res = await fetch("/makepoll",{
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body:JSON.stringify({
            question: question,
            options: answers
        })
    })

    let resjson = await res.json()
    console.log(resjson)
    if(resjson.message){
        document.getElementById('poll-display').replaceChildren()
        const link = document.createElement('a');
        link.href = '/id='+resjson.pollId;
        link.textContent = "poll link";
        document.getElementById('poll-display').appendChild(link)
        
    }
}
