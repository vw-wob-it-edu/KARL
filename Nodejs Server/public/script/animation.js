// Array to store the queue of videos
var queue = [];
var currentVideo = null;

// Function to add an animation to the queue
function addToQueue(videoUrl) {
    queue.push(videoUrl);
    console.log("Video added to queue:", videoUrl);
    if (currentVideo === null) {
        playNext();
    }
}

// Function to play the next video in the queue
function playNext() {
    
    if (queue.length > 0) {
        var videoUrl = queue.shift();
        console.log("Playing next video in queue:", videoUrl);
        playVideo(videoUrl);
    } else {
        // No video in the queue, loop the current video
        if (currentVideo) {
            console.log("Looping current video:", currentVideo.src);
            playVideo(currentVideo.src);
            currentVideo.loop = true;
        }
      }
}

// Function to play a video
function playVideo(videoUrl) {
    currentVideo = document.getElementById('animationPlayer');
    currentVideo.src = videoUrl;
    currentVideo.loop = false;
    currentVideo.onended = playNext; // When the video ends, play the next video
    currentVideo.play();
    console.log("Playing video:", videoUrl);
}