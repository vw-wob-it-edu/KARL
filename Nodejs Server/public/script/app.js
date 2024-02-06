const btn = document.querySelector('.talk');
const content = document.querySelector('.microphone-style-text');
const fileInput = document.getElementById("fileInput");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();


// Check if SpeechRecognition API is available
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    console.log('Speech Recognition API is available');
} else {
    console.log('Speech Recognition API is not available');
}


function speak(text) {
    console.log("Speaking...")
    const text_speak = new SpeechSynthesisUtterance(text);

        text_speak.rate = 0.9;
        text_speak.volume = 0.5;
        text_speak.pitch = 0.9;

        // Speak the text using the chosen voice
        window.speechSynthesis.speak(text_speak);

};



function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

window.addEventListener('load', () => {
    speak("Initializing KARL..");
    wishMe();
});



fileInput.addEventListener("change", e => {
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.addEventListener("load", () => {
        prepareTranscript(null, reader.result, false);

    });
});


recognition.onresult = async (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;

    prepareTranscript(transcript, null, true);
};


function sendMessage() {
    var userInput = document.getElementById("user-input").value;
    prepareTranscript(userInput, null, true);
}


function prepareTranscript(message, data, textbased) {
    const savedImageData = localStorage.getItem('image_data');
    console.log(savedImageData);

    if (savedImageData != null) {
        textbased = false;
    }

    if (textbased == true) {
        addUserMessage(message);
        saveTranscriptToFlask(null, message);
    }

    if (textbased == false) {
        if (savedImageData != null) {
            addUserMessage(message);
            console.log(savedImageData);
            saveTranscriptToFlask(savedImageData, message);
            localStorage.removeItem('image_data');
        } else {
            localStorage.setItem('image_data', data); // Assuming 'data' should be stored in 'image_data'
        }
    }
}


async function saveTranscriptToFlask(transcript, message) {
    console.log("transcript send by app.js "  + transcript);
    console.log("message send by app.js: " + message);
    try {
        // Send transcript to Flask server
        const response = await fetch('http://localhost:5000/process_transcript', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transcript: transcript, message: message }),
        });

        if (response.ok) {
            const data = await response.json();
            const serverMessage = data.message;
            console.log('Flask server response:', serverMessage);
            addAssistantMessage(serverMessage);
            speak(serverMessage);
    
            // Do something with the serverMessage if needed
        } else {
            console.log('Error from Flask server:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }      
}

btn.addEventListener('click', () => {
    content.textContent = "Listening....";
    recognition.start();
});



function addUserMessage(transcript) {
    var chatContainer = document.getElementById("chat-container");
    var userMessage = document.createElement("div");
    userMessage.className = "chat-message user-message-chat";
    userMessage.innerHTML = "<p>User: " + transcript + "</p>";

    chatContainer.appendChild(userMessage);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addAssistantMessage(message) {
    var chatContainer = document.getElementById("chat-container");
    var assistantMessage = document.createElement("div");
    assistantMessage.className = "chat-message assistant-message";
    assistantMessage.innerHTML = "<p>Karl: " + message + "</p>";

    chatContainer.appendChild(assistantMessage);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

