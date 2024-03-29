//array to store the queue of videos
var queue = [];
var currentVideo = null;

//function to add an animation to the queue
function addToQueue(videoUrl) {
    queue.push(videoUrl);
    console.log("Video added to queue:", videoUrl);
    if (currentVideo === null) {
        playNext();
    }
}

//function to play the next video in the queue
function playNext() {
    if (queue.length > 0) {
        var videoUrl = queue.shift();
        console.log("Playing next video in queue:", videoUrl);
        playVideo(videoUrl);
    } else {
        //no video in the queue, replay the current video
        if (currentVideo) {
            console.log("Replaying current video:", currentVideo.src);
            currentVideo.currentTime = 0;
            currentVideo.play();
        }
    }
}

//function to play a video
function playVideo(videoUrl) {
    currentVideo = document.getElementById('animationPlayer');
    currentVideo.src = videoUrl;
    currentVideo.loop = false;
    currentVideo.onended = function() {
        //after the video ends, play the next video or replay current video if queue is empty
        playNext();
    };
    currentVideo.play();
    console.log("Playing video:", videoUrl);
}


//clear queue if tv turned off
function clearQueue() {
    queue = [];
    console.log("Queue cleared");
    playNext(); 
    playNext();
}