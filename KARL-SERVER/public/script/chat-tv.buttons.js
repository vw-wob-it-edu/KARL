var currentImage = 1;

function turnTvOn() {
  var tvImage = document.getElementById("tv-off");
  var tvTranspImage = document.getElementById("tv-on");

  //toggle between images of tv on and off
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

//send user messages by hitting enter
//get the input field
var input = document.getElementById("user-input");

//execute the function when the user presses enter
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    //trigger the button element with a click
    document.getElementById("user-button-chat").click();
  }
});