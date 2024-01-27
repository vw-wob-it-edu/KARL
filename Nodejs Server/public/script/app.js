
const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

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
    speak("Initializing JARVIS..");
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

    // Save transcript and notify Node.js server
    await saveTranscriptToNodeJS(transcript);
};

async function saveTranscriptToNodeJS(transcript) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/save_transcript', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ transcript: transcript }));
    
    console.log("create transcript");

    // Handle success response from Python server
    const pythonSuccessEndpoint = 'http://localhost:3000/process_success';
    const pythonSuccessRequest = new XMLHttpRequest();

    pythonSuccessRequest.onreadystatechange = function () {
        if (pythonSuccessRequest.readyState === 4 && pythonSuccessRequest.status === 200) {
            console.log('Python server success:', pythonSuccessRequest.responseText);
        }
    };

    pythonSuccessRequest.open('POST', pythonSuccessEndpoint, true);
    pythonSuccessRequest.setRequestHeader('Content-Type', 'application/json');
    pythonSuccessRequest.send();
}

btn.addEventListener('click', () => {
    content.textContent = "Listening....";
    console.log("test");
    recognition.start();
});
