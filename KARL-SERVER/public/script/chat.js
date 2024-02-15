//function to add a user message
function addUserMessage(transcript) {

    text_paragraph = addParagraphs(transcript);
    var chatContainer = document.getElementById("chat-container");
    var userMessage = document.createElement("div");
    userMessage.className = "chat-message user-message-chat";
    userMessage.innerHTML = "<p>User: " + text_paragraph + "</p>";

    chatContainer.appendChild(userMessage);
    scrollToBottom();
}

//function to add an assistant message
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

//add paragraphs to response from flask server, for better visual on the html site
function addParagraphs(text) {

    var paragraphs = text.split("\n");
        
        var fullText = '';

        paragraphs.forEach(function(paragraph) {
            fullText += '<p>' + paragraph + '</p>';
        });

        return fullText;
}

//autoscroll to the bottom of the chat
function scrollToBottom() {
    var chatContainer = document.getElementById("scroll");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  