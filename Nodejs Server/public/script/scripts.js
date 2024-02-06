var currentImage = 1;

function turnTvOn() {
  var tvImage = document.getElementById("tv-off");
  var tvTranspImage = document.getElementById("tv-on");

  // Toggle between images
  if (currentImage === 1) {
    tvImage.style.opacity = 0;
    tvTranspImage.style.opacity = 1;
    currentImage = 2;
  } else {
    tvImage.style.opacity = 1;
    tvTranspImage.style.opacity = 0;
    currentImage = 1;
  }
}