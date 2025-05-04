async function loadpage(){
    const pollData = JSON.parse(jsonString);

    document.getElementById("poll-question").textContent = pollData.question;
    document.getElementById("total-votes").textContent = pollData.totalVotes;
    const resultsDiv = document.getElementById("poll-results");
    const totalVotes = pollData.totalVotes || 1; // Avoid division by 0


    for (const [answer, votes] of Object.entries(pollData.results)) {
      const percentage = ((votes / totalVotes) * 100).toFixed(1);
      const resultDiv = document.createElement('div');
      resultDiv.classList.add('result');
      resultDiv.innerHTML = `
        <div class="label">
            <span>${answer}</span>
            <span>${votes} vote${votes !== 1 ? 's' : ''} (${percentage}%)</span>
        </div>
        <div class="bar-container">
            <div class="bar" style="width: ${percentage}%;"></div>
        </div>
      `;
    const voteButton = document.createElement('button');
    voteButton.textContent = 'Vote';
    voteButton.classList.add('vote-button');
    voteButton.addEventListener('click', async () => {
        
        
        const res = await fetch("/vote",{
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            body:JSON.stringify({
                pollId: pollData.pollId,
                option: answer
            })
        })
        let resjson = await res.json()
        if(resjson.error){
            document.getElementById("response-div").innerHTML="You already voted"
        }else{
            await location.reload();
        }
    });

    resultDiv.appendChild(voteButton);
    resultsDiv.appendChild(resultDiv);
    }
}
loadpage()
  