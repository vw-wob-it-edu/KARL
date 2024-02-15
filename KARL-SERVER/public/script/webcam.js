
var on = 0; //0 = off 1 = on
var snap = 0;//0 = take snap 1 = show cam

function toggle_webcam() {

    if (on == 0) { //turn on

        //Webcam visible, Karl invisible
        console.log("Webcam started");
        webcam.start();
        document.getElementById("canvas").style.opacity = "0";
        document.getElementById("webCam").style.opacity = "1";
        document.getElementById("animationPlayer").style.opacity = "0";

        on = 1;

    } else if (on == 1) { //turn off

        //Webcam invisible, Karl visible
        console.log("Webcam stopped");
        webcam.stop();
        document.getElementById("canvas").style.opacity = "0";
        document.getElementById("webCam").style.opacity = "0";
        document.getElementById("animationPlayer").style.opacity = "1";

        on = 0;

        //load snap of user
        const savedImageData = localStorage.getItem('snap_data');

        if (savedImageData != null) {
            //user snap exist, send it to process it and delete it from local storage
            console.log("Send image to Widget");
            handleImageUpload(savedImageData, 'Webcam Snap');
            localStorage.removeItem('snap_data');
        }
        
    }

}

function toggle_snap() {

    if (snap == 0) {
        //show snap of webcam
        let picture = webcam.snap();
        document.querySelector("button").href = picture;

        document.getElementById("webCam").style.opacity = "0";
        document.getElementById("canvas").style.opacity = "1";

        //if user made snap save it for later
        localStorage.setItem('snap_data', picture);

        snap = 1;

    } else if (snap == 1) {
        //hide snap of webcam and show webcam
        document.getElementById("canvas").style.opacity = "0";
        document.getElementById("webCam").style.opacity = "1";

        snap = 0;
    }

}
