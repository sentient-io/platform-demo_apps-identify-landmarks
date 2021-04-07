/* +-----------------------+ */
/* |  Single Pic Uploader  | */
/* +-----------------------+ */

// Renders and resize uploaded image, display as <img> element

// 1MB is 1048576
let fileSizeLimit = 1048576 * 5,
    dropArea = document.getElementById('imgUploader');

// Prevent default behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight effect when drag files over
['dragenter', 'dragover'].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
});
['dragleave', 'drop'].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
});
function highlight(e) {
    dropArea.classList.add('highlight');
}
function unhighlight(e) {
    dropArea.classList.remove('highlight');
}

//Get the data for the files that were dropped
dropArea.addEventListener('drop', handleDrop, false);
function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    uploadImage(files);
}

// Handle picture preview
uploadImage = (files) => {
    // console.log('Input Image');
    $('#imageErrMsg').hide();

    checkImage(files[0].type, files[0].size)
        .then(() => {
            // console.log('Image Valid');

            // Preview uploaded file
            let reader = new FileReader();
            reader.readAsDataURL(files[0]);
            // Update data object
            reader.onloadend = () => {
                // Push original image to DOM to retain original pixel
                createSourceImg(reader.result);
                data.file.base64 = reader.result;
                // console.log(reader.result);
            };
            // Toggle cancel and function button
            $('#mainFunction, #btn-cancel').toggle();
            $(
                '#imgUploader, #sample-images-container, #countrySelector'
            ).hide();

            data.file = { name: files[0].name, type: files[0].type };
            // console.log(`Image ${data.file.name} uploaded.`);
        })
        .catch((err) => {
            // console.log(err);
            // Clean uploaded file
            $('#imgUploaderInput').val('');
            // Display error message
            $('#imageErrMsg').show();
            $('#imageErrMsg p').text(err);
        });

    // if (files[0].size >= fileSizeLimit) {
    //     let errTitle = 'File Size Too Big';
    //     let errMsg =
    //         'For demp purpose, we are limiting file size to 5MB. <br>Please try another image.';
    //     toggleAlert(errTitle, errMsg);
    //     // Clear record of uploaded file
    //     $('#imgUploaderInput').val('');
    // } else {
    //
    // }
};

checkImage = (fType, fSize) => {
    // File type, size and smallest resolution
    // console.log('Check Image');

    return new Promise((resolve, reject) => {
        if (!fType.includes('image')) {
            // Check image type
            reject('Wrong file type, please upload an valid image file.');
        } else if (fSize >= fileSizeLimit) {
            //Check image size
            reject('File size too big, please upload image size below 5MB.');
        } else {
            resolve();
        }
    });
};

createSourceImg = (src) => {
    // When send data to API, use base64 string from sourcePic
    // Hidden original size image to retain original pixel
    let img = document.createElement('img');
    img.onload = () => {
        // console.log(img);
        // Update data
        data.file.sWidth = img.width;
        data.file.sHeight = img.height;

        let resize = resizeImg(img.width, img.height);
        img.setAttribute(
            'style',
            `max-width:${resize.width}px; max-height:${resize.height}px`
        );
        img.setAttribute('id', 'sourceImg');
        $('#imgPreview').append(img);
        window.scrollBy(0, 100);
    };
    img.src = src;
};

resizeImg = (sWidth, sHeight) => {
    // Calculate image resize
    let dWidth = sWidth;
    let dHeight = sHeight;

    if (dWidth > 700 && sWidth >= sHeight) {
        // Landscape picture
        dWidth = 700;
        dHeight = (dWidth * sHeight) / sWidth;
    } else if (dHeight > 600 && sWidth < sHeight) {
        // Square or portrait image
        dHeight = 600;
        dWidth = (dHeight * sWidth) / sHeight;
    }
    data.resizeRatio = dWidth / sWidth;
    let result = { width: dWidth, height: dHeight };

    // console.log(
    //     `Image been resized for preview. Resize ratio : ${data.resizeRatio}`
    // );
    return result;
};

selectImage = (e) => {
    let base64 = e.src;
    let id = e.id;
    data.file = { base64: base64, name: id, type: 'image/jpeg' };

    createSourceImg(base64);

    // Toggle cancel and function button
    $('#mainFunction, #btn-cancel').toggle();
    $('#imgUploader, #sample-images-container, #countrySelector').hide();
};
