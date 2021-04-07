/* +---------------------------------------+ */
/* | Call Landmark Detection (JP & SG) API | */
/* +---------------------------------------+ */

// update property value in to the hubspot
console.log('**********hubspot update**********');
var updateInHubspot = false;
var infoDataObj = {};
window.addEventListener('message', function(e) {
    var infoData = JSON.parse(e.data);
    if ((typeof(infoData)==='object') && 'data' in infoData) {
        if ((typeof(infoData['data'])==='object') && 'userEmail' in infoData['data'] && infoData['data']['userEmail']) {            
            updateInHubspot = true;
            infoDataObj = infoData;
            console.log(infoData.data.userEmail);
            console.log(infoData.data.name);
            var _hsq = window._hsq = window._hsq || [];
            _hsq.push(["identify",{
                email:infoData.data.userEmail,
                last_demo_app_called : infoData.data.name
            }]);
            _hsq.push(['trackPageView']);
        }
    }
}, false);
console.log('**********hubspot update**********');

landMarkDetection = (base64) => {
    // console.log(`Detecting land marks on ${state.location}`);
    // console.log(`With API endpoint : ${state[state.location]}`);
    loadingStart();

    return new Promise((resolve, reject) => {
        $.ajax({
            url: state[state.location],
            headers: {
                'x-api-key': apikey,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            data: JSON.stringify({ image_base64: base64 }),
            success: (response) => {
                // console.log(response);

                if (updateInHubspot){
                    var _hsq = window._hsq = window._hsq || [];
                    _hsq.push(["identify",{
                        email: infoDataObj.data.userEmail,
                        last_successful_call_from_demo_app : new Date().getTime()
                    }]);
                    _hsq.push(['trackPageView']);
                }

                loadingEnd();
                if (response.results.landmark === 'No landmark detected') {
                    resolve('No landmark detected, please try another image.');
                } else {
                    const result = `${response.results.landmark} been detected with ${response.results.confidence} confidence.`;

                    resolve(result);
                }
            },
            error: (error) => {
                console.log(error);
                loadingEnd();
                reject(error.responseText);
            }
        });
    });
};
