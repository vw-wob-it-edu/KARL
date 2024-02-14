
function downloadBase64File(contentType, base64Data, fileName) {
    const linkSource = `data:${contentType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

function toggleImage(imageId, hovering) {
    const imgElement = document.getElementById(imageId);
    imgElement.style.display = hovering ? 'block' : 'none';
}



function checkImageUploaded(imageId) {
    const imgElement = document.getElementById(imageId);
    if (imgElement.complete && imgElement.naturalWidth !== 0) {
        console.log("File uploaded");
        return true;
    } else {
        console.log("No File uploaded");
        return false;
    }
}


function useImage(imageId) {
    const img = document.getElementById(imageId);
    const imageData = img.getAttribute('src');
 
    if (imageData.endsWith('pdf.png')) {
        const figcaption = img.parentElement.querySelector('figcaption');
        if (figcaption) {
            const figcaptionText = figcaption.textContent;
            console.log("Using image: ", figcaptionText);
            prepareTranscript(null, figcaptionText, false);
        } else {
            console.log("No figcaption found for PDF image.");
        }
    } else {
        console.log("Using image: ", imageData);
        prepareTranscript(null, imageData, false);
    }

    //show selected
    if (imageId == 'image1') {
        document.getElementById("selected1").style.opacity = "1";
        document.getElementById("selected2").style.opacity = "0";
        document.getElementById("selected3").style.opacity = "0";
    }
    else if (imageId == 'image2') {
        document.getElementById("selected1").style.opacity = "0";
        document.getElementById("selected2").style.opacity = "1";
        document.getElementById("selected3").style.opacity = "0";
    }
    else {
        document.getElementById("selected1").style.opacity = "0";
        document.getElementById("selected2").style.opacity = "0";
        document.getElementById("selected3").style.opacity = "1";
    }
 }
 

 
 function downloadImage(imageUrl, imageName) {
    const imgElement = document.getElementById(imageUrl);
    const imgSrc = imgElement.src;
 
    // Call the downloadBase64File function with appropriate parameters
    const contentType = 'image/jpeg'; // or any other appropriate content type
    const base64Data = imgSrc.split(',')[1];
    const fileName = imageName; // Use provided imageName
    downloadBase64File(contentType, base64Data, fileName);
 }
 
 document.addEventListener("DOMContentLoaded", function() {
    const fileInputWidget = document.getElementById('uploadInput');

    // Check if fileInputWidget is not null before adding an event listener
    if (fileInputWidget) {
        fileInputWidget.addEventListener("change", e => {
            const file = fileInputWidget.files[0];

            if (file.name.toLowerCase().endsWith('.pdf')) {

                const fileName = file.name;

                handleImageUpload(null, fileName);

                pdfToBase64(fileName, file, function(base64) {
                    console.log(base64);
                });
                
            } else {

            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.addEventListener("load", () => {
                const imgSrc = reader.result;
                const fileName = file.name;
                handleImageUpload(imgSrc, fileName);
            });

            }
        });
    }
});
 function handleImageUpload(imgSrc, fileName) {
    if (fileName.toLowerCase().endsWith('.pdf')) {
        imgSrc = 'res/pdf.png';
    }

    for (let i = 3; i > 1; i--) {
        const prevImgElement = document.getElementById(`image${i - 1}`);
        const imgElement = document.getElementById(`image${i}`);
        imgElement.src = prevImgElement.src;
        const figcaption = imgElement.nextElementSibling;
        const prevFigcaption = prevImgElement.nextElementSibling;
        figcaption.textContent = prevFigcaption.textContent;
    }

    const imgElement = document.getElementById('image1');
    imgElement.src = imgSrc;
    const figcaption = document.getElementById('image-figcation');
    figcaption.textContent = fileName;
}


function pdfToBase64(fileName, file, callback) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var base64 = event.target.result.split(',')[1];
        callback(base64);
        sendPDF(fileName, base64);
    };
    reader.readAsDataURL(file);
}



async function sendPDF(fileName, file) {
    try {
        const response = await fetch('http://localhost:5000/process_transcript', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transcript: file, message: "PDF", fileName: fileName }),
        });
        if (response.ok) {
            const data = await response.json();
            const serverMessage = data.message;
            console.log('Flask server response:', `${serverMessage}`);
        } else {
            console.log('Error from Flask server:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }      
}