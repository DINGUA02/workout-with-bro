/* Variables */
const beginner = document.querySelector(`.beginner`);
const advanced = document.querySelector(`.advanced`);
const bodyPartsList = document.querySelectorAll(`.bodyPartsList li`)
const hidden = document.querySelector(`.hidden`);
const chatWithBroBtn = document.querySelector(`.chatWithBroBtn`);
const userInput = document.querySelector(`.userInput`);
const sendBtn = document.querySelector(`.sendBtn`);
const demoInput = document.querySelector(`.demoInput`);
const demoBtn = document.querySelector(`.demoBtn`);
const demoResults = document.querySelector(`.demoResults`);


/* API URL */
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
const DUMMY_JSON_API_URL = 'https://dummyjson.com/image/150';


/* Functions */
const displayExercise = (data) => {
    const text = data.candidates[0].content.parts[0].text;
    const listItems = text.split('\n').filter(line => line.trim()).map(item => `<li>${item.replace(/^\*+/, '').trim()}</li>`).join('');
    const workOutResultA = document.querySelector('.workOutResultA');
        workOutResultA.innerHTML = '';

        workOutResultA.insertAdjacentHTML('beforeend', listItems);
};

const displayDemo = (demoImg, demoTitle) => {
  const demoResult = ` <li>
                        <img src="${demoImg}" alt="exercise-preview">
                        <p>${demoTitle.slice(0,1).toUpperCase() + demoTitle.slice(1).toLowerCase()}</p>
                      </li>`;
      demoResults.innerHTML = '';
      demoResults.insertAdjacentHTML("beforeend", demoResult);

};

const generateDemo = async (exerciseName) => {
  try{
  const response = await fetch (DUMMY_JSON_API_URL);
  const data = await response.blob();
  const demoImg = URL.createObjectURL(data);
  displayDemo(demoImg, exerciseName);
  } catch (error) {
    console.error(`Failed fetch`, error.message);
  }
};



const suggestExercise = async (bodyPart, level) => {

    try {
        let prompt = `strictly suggest 5 bulleted workouts with rep ranges for ${bodyPart} with ${level} level fitness. no other words included and no asterisk`
        const response = await fetch (GEMINI_API_URL, {
            method: `POST`,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
    "contents": [
      {
        "parts": [
          {"text": prompt}
        ]
      }
    ]
  })
});

        const data = await response.json();
        displayExercise(data);
        if(!response.ok) throw new Error(data.error.message);
        console.log(data);

    } catch(error) {
        console.log(error)
    };
}
const displayLatestResponse = () => {
  const lastMessage = document.querySelector(`.chatsContainer`);
  lastMessage.scrollTop = lastMessage.scrollHeight;
}
const userResponse = (userInput) => {
    const userMessage = `<div class="userChatBubble container">
                <p class="user message">${userInput}</p>
            </div>`;
    const chatsContainer = document.querySelector(`.chatsContainer`);

    chatsContainer.insertAdjacentHTML(`beforeend`, userMessage);
    displayLatestResponse();
}

const botResponse = (userInput) => {
    const text = userInput.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    const botMessage = `<div class="botChatBubble container">
                <p class="bot message">${text}</p>
            </div>`;
    const chatsContainer = document.querySelector(`.chatsContainer`);

    chatsContainer.insertAdjacentHTML(`beforeend`, botMessage);
    displayLatestResponse();
}

const generateResponse = async (userInput) => {
    try {
        let prompt = userInput;
        const response = await fetch (GEMINI_API_URL, {
            method: `POST`,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
    "contents": [
      {
        "parts": [
          {"text": prompt}
        ]
      }
    ]
  })
});

        const data = await response.json();
        botResponse(data);
        if(!response.ok) throw new Error(data.error.message);
        console.log(data);

    } catch(error) {
        console.log(error)
    };

}

/* Event Listeners */

bodyPartsList.forEach(part => {
    part.addEventListener(`click`, () => {
        if (beginner.checked || advanced.checked) {
        let selectedLevel = beginner.checked ? beginner.value : advanced.value;
        let selectedPart = part.dataset.part;
    return suggestExercise(selectedPart, selectedLevel);
            } else {
    alert(`Please select a fitness level`);    }});
});

demoInput.addEventListener(`keydown`, (e) => {
  if (e.key === `Enter`) {
    const prompt = demoInput.value;
    if (prompt === '') return demoResults.textContent = `Please input a valid exercise`;
     generateDemo(prompt);
  } 
  
});

demoBtn.addEventListener(`click`, (e) => {
  const prompt = demoInput.value;
  if (prompt === '') return demoResults.textContent = `Please input a valid exercise`;
  generateDemo(prompt);
  
});

userInput.addEventListener('keydown', (e) => {
    if (e.key === `Enter`) {
        const prompt = userInput.value;
        if (prompt === '') return;

        userResponse(prompt);
        userInput.value = '';
        generateResponse(prompt);
        
    };
});

sendBtn.addEventListener('click', (e) => {
    if (e) {
        const prompt = userInput.value;
        if (prompt === '') return;

        userResponse(prompt);
        userInput.value = '';
        generateResponse(prompt);
        
    };
});

chatWithBroBtn.addEventListener('click', () => {
  if (chatWithBroBtn.textContent === `Hide chatbox`) {
    chatWithBroBtn.textContent = `Chat with Bro!`;
  } else {
    chatWithBroBtn.textContent = `Hide chatbox`
  };

  const chatsContainer = document.querySelector(`.chatsContainer`);
  const userMessageBox = document.querySelector(`.userMessageBox`);

  chatsContainer.classList.toggle(`hidden`);
  userMessageBox.classList.toggle(`hidden`);
  displayLatestResponse();


})



