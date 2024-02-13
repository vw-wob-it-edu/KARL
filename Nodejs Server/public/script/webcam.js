
var on = 0; //0 = off 1 = on
var snap = 0;//0 = take snap 1 = show cam

function toggle_webcam() {

    if (on == 0) { //turn on

        console.log("Webcam started");
        webcam.start();
        document.getElementById("canvas").style.opacity = "0";
        document.getElementById("webCam").style.opacity = "1";
        document.getElementById("animationPlayer").style.opacity = "0";

        on = 1;

    } else if (on == 1) { //turn off

        console.log("Webcam stopped");
        webcam.stop();
        document.getElementById("canvas").style.opacity = "0";
        document.getElementById("webCam").style.opacity = "0";
        document.getElementById("animationPlayer").style.opacity = "1";

        on = 0;

        const savedImageData = localStorage.getItem('snap_data');

        if (savedImageData != null) {
            console.log("Send image to Widget");
            handleImageUpload(savedImageData, 'Webcam Snap');
            localStorage.removeItem('snap_data');
        }
        
    }

}

function toggle_snap() {

    if (snap == 0) {

        let picture = webcam.snap();
        document.querySelector("button").href = picture;

        document.getElementById("webCam").style.opacity = "0";
        document.getElementById("canvas").style.opacity = "1";


        localStorage.setItem('snap_data', picture);

        snap = 1;

    } else if (snap == 1) {

        document.getElementById("canvas").style.opacity = "0";
        document.getElementById("webCam").style.opacity = "1";

        snap = 0;
    }

}
