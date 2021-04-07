// Global object stores all information
let data = {};
let state = {
    location: 'location-sg',
    'location-sg':
        'https://apis.sentient.io/microservices/cv/landmarksg/v1/getpredictions',
    'location-jp':
        'https://apis.sentient.io/microservices/cv/landmarkjp/v1/getpredictions'
};
/* +---------------------+ */
/* | Toggle Popup Alert  | */
/* +---------------------+ */
toggleAlert = (alertTitle, alertMsg) => {
    $('#alertContent').html(alertMsg);
    $('#alertTitle').html(alertTitle);
    $('#alert').modal('toggle');
};

/* +---------------+ */
/* |  Radio Button | */
/* +---------------+ */
sRadioSelection = (param) => {
    if (param.id != state.location) {
        // console.log(`Selected : ${param.id}`);
        $('.s-radio-base').empty();
        $(`#${param.id} .s-radio-base`).html(
            '<div class="s-radio-selected"></div>'
        );
        state.location = param.id;
    }
    renderSampleImages();
};

/* +---------------------------------------+ */
/* |  Img Uploader Main Function Handlers  | */
/* +---------------------------------------+ */
handleMainFunction = () => {
    // Handel if no API key
    if (apikey == 'ENTER YOUR API KEY' || !apikey[0]) {
        // Toggle popup window
        $('#alertTitle').html('Missing API Key');
        $('#alertContent').html(
            'For security purpose, we removed the API key <br> Please place your api key in app.js file'
        );
        $('#alert').modal('toggle');
    } else {
        // Return base64 fron the sourcePicture
        // console.log(`Calling Landmark Detection API`);
        //APICallFunction(data.file.base64);
        landMarkDetection(data.file.base64.split('base64,')[1])
            .then((result) => {
                displayResult(result);
                $('#btn-restart').show();
                $('#mainFunction, #btn-cancel').hide();
            })
            .catch((err) => {
                // Toggle popup window
                $('#alertTitle').html('Error');
                $('#alertContent').html(err);
                $('#alert').modal('toggle');
            });
    }
};

handleCancel = () => {
    data = {};
    // Clean uploaded file
    $('#imgUploaderInput').val('');
    $('#imgPreview, #resultContainer p').empty();
    $('#mainFunction, #btn-cancel').hide();
    $('#imgUploader, #sample-images-container, #countrySelector').show();
};

handleRestart = () => {
    // Clean uploaded file
    $('#imgUploaderInput').val('');
    $('#imgPreview, #resultContainer p').empty();
    $('#resultContainer, #mainFunction, #btn-cancel, #btn-restart').hide();
    $(
        '#imgUploader,#single-pic-uploader, #sample-images-container, #countrySelector'
    ).show();
};

/* | END | Img Uploader Main Function Handlers  | */

displayResult = (result) => {
    $('#resultContainer').show();
    if (result.includes('No landmark detected')) {
        $('#resultContainer div').html(`
		<i class="mr-3 material-icons text-danger">error_outline</i>
		<p class="text-danger">${result}</p>`);
    } else {
        $('#resultContainer div').html(`
		<i class="mr-3 material-icons">check_circle</i>
		<p>${result}</p>`);
    }
};

/* ============================================= Utility Functions ============================================= */
