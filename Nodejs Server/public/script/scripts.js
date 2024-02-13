var currentImage = 1;

function turnTvOn() {
  var tvImage = document.getElementById("tv-off");
  var tvTranspImage = document.getElementById("tv-on");

  // Toggle between images
  if (currentImage === 1) { //on
    tvImage.style.opacity = 0;
    tvTranspImage.style.opacity = 1;
    document.getElementById("user-input-chat").style.opacity = "1";
    currentImage = 2;
  } else { //off
    tvImage.style.opacity = 1;
    tvTranspImage.style.opacity = 0;
    currentImage = 1;
    document.getElementById("user-input-chat").style.opacity = "0";
    clearQueue();
  }
}


// Get the input field
var input = document.getElementById("user-input");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Trigger the button element with a click
    document.getElementById("user-button-chat").click();
  }
});