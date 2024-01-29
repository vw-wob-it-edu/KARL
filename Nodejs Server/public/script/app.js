const btn = document.querySelector('.talk');
const content = document.querySelector('.microphone-style-text');

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

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// Check if SpeechRecognition API is available
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    console.log('Speech Recognition API is available');
} else {
    console.log('Speech Recognition API is not available');
}

recognition.onresult = async (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;

    addUserMessage(transcript);

    // Save transcript and notify Flask server
    await saveTranscriptToFlask(transcript);
};

async function saveTranscriptToFlask(transcript) {
    try {
        // Send transcript to Flask server
        const response = await fetch('http://localhost:5000/process_transcript', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transcript: transcript }),
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

