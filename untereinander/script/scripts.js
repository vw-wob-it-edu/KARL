function sendMessage() {
    var userInput = document.getElementById("user-input").value;
    var chatContainer = document.getElementById("chat-container");
    var userMessage = document.createElement("div");
    userMessage.className = "chat-message user-message";
    userMessage.innerHTML = "<p>User: " + userInput + "</p>";
 
    var assistantMessage = document.createElement("div");
    assistantMessage.className = "chat-message assistant-message";
    assistantMessage.innerHTML = "<p>Karl: Leider habe ich derzeit Urlaub und bin nicht zu erreichen. Bitte versuche es später nochmal!</p>";
 
    chatContainer.appendChild(userMessage);
    chatContainer.appendChild(assistantMessage);
 
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }