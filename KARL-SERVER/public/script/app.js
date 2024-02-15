const btn = document.querySelector('.talk');
const content = document.querySelector('.microphone-style-text');
const fileInput = document.getElementById("fileInput");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

//WebCam
const webCamElement = document.getElementById("webCam");
const canvasElement = document.getElementById("canvas");
const webcam = new Webcam(webCamElement, "user", canvasElement);


//check if SpeechRecognition API is available
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    console.log('Speech Recognition API is available');
} else {
    console.log('Speech Recognition API is not available');
}


//onload functions when user loads page
window.addEventListener('load', () => {
    document.getElementById("selected1").style.opacity = "0";
    document.getElementById("selected2").style.opacity = "0";
    document.getElementById("selected3").style.opacity = "0";

    document.getElementById("user-input-chat").style.opacity = "0";
    localStorage.removeItem('image_data');
    speak("Initializing KARL..");
    wishMe();
});

//btn listener for microphone
btn.addEventListener('click', () => {
    content.textContent = "Listening....";
    recognition.start();
});

//if recognition succesful send to AI
recognition.onresult = async (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;

    prepareTranscript(transcript, null, true);
};


//if user sends message, send it to the AI
function sendMessage() {
    var userInput = document.getElementById("user-input").value;

    //clear the input field
    document.getElementById("user-input").value = "";

    prepareTranscript(userInput, null, true);
}


//function to prepare files and message for the AI
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


//function to send files to python server and wait for response
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
            
        } else {
            console.log('Error from Flask server:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }      
}



//functions for text to speach (experimental)
function speak(text) {
    console.log("Speaking...")
    const text_speak = new SpeechSynthesisUtterance(text);

        text_speak.rate = 0.9;
        text_speak.volume = 0.5;
        text_speak.pitch = 0.9;

        //speak the text using the chosen voice
        window.speechSynthesis.speak(text_speak);
};

//function to greet the user
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