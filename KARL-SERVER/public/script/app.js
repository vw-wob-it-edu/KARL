const btn = document.querySelector('.talk');
const content = document.querySelector('.microphone-style-text');
const fileInput = document.getElementById("fileInput");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

//WebCam
const webCamElement = document.getElementById("webCam");
const canvasElement = document.getElementById("canvas");
const webcam = new Webcam(webCamElement, "user", canvasElement);


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
    document.getElementById("selected1").style.opacity = "0";
    document.getElementById("selected2").style.opacity = "0";
    document.getElementById("selected3").style.opacity = "0";

    document.getElementById("user-input-chat").style.opacity = "0";
    localStorage.removeItem('image_data');
    speak("Initializing KARL..");
    wishMe();
});

recognition.onresult = async (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;

    prepareTranscript(transcript, null, true);
};


function sendMessage() {
    var userInput = document.getElementById("user-input").value;

    // Clear the input field
    document.getElementById("user-input").value = "";

    prepareTranscript(userInput, null, true);
}


function prepareTranscript(message, data, textbased) {
    savedImageData = localStorage.getItem('image_data');

    if (savedImageData != null) {
        if (data != null) {
            localStorage.removeItem('image_data');
            savedImageData = localStorage.getItem('image_data');
        }
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
            localStorage.setItem('image_data', data);
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
            body: JSON.stringify({ transcript: transcript, message: message, fileName : null }),
        });

        if (response.ok) {
            const data = await response.json();
            const serverMessage = data.message;
            console.log('Flask server response:', `${serverMessage}`);
            addToQueue('animation/back_server.mkv');
            addToQueue('animation/random/nothing_2.mkv');
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

    text_paragraph = addParagraphs(transcript);
    var chatContainer = document.getElementById("chat-container");
    var userMessage = document.createElement("div");
    userMessage.className = "chat-message user-message-chat";
    userMessage.innerHTML = "<p>User: " + text_paragraph + "</p>";

    chatContainer.appendChild(userMessage);
    scrollToBottom();
}

function addAssistantMessage(message) {
    console.log(message)

    try {
        text_paragraph = addParagraphs(message);
    } catch (error) {

        const obj = JSON.parse(message);

        console.log(obj.result);
        
    }
    
    var chatContainer = document.getElementById("chat-container");
    var assistantMessage = document.createElement("div");
    assistantMessage.className = "chat-message assistant-message";
    assistantMessage.innerHTML = "<p>Karl: " + text_paragraph + "</p>";

    chatContainer.appendChild(assistantMessage);
    scrollToBottom();
}


function addParagraphs(text) {

    var paragraphs = text.split("\n");
        
        var fullText = '';

        paragraphs.forEach(function(paragraph) {
            fullText += '<p>' + paragraph + '</p>';
        });

        return fullText;
}


function scrollToBottom() {
    var chatContainer = document.getElementById("scroll");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  