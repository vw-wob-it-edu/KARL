
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
   console.log("Using image: ", imageData);
   prepareTranscript(null, imageData, false);
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

                pdfToBase64(file, function(base64) {
                    console.log(base64);
                    handleImageUpload(null, fileName);
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


function pdfToBase64(file, callback) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var base64 = event.target.result.split(',')[1];
        callback(base64);
    };
    reader.readAsDataURL(file);
}
