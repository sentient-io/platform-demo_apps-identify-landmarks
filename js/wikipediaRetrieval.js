/* +-------------------------+ */
/* | Wikipedia Retrieval API | */
/* +-------------------------+ */
console.log('Wikipedia Retrieval Loaded');

wikipediaRetrieval = (param) => {
	let title = param.title ? param.title : '';
	console.log(`Retrieve '${title}' from wikipedia`);

	return new Promise((resolve, reject) => {
		$.ajax({
			url:
				'https://apis.sentient.io/microservices/utility/wikipedia/v0.1/getresults',
			headers: { 'x-api-key': apikey, 'Content-Type': 'application/json' },
			method: 'POST',
			data: JSON.stringify({ title: title }),
			success: (response) => {
				console.log(JSON.stringify(response));
				resolve(response);
			},
			error: (error) => {
				console.log(error);
				reject();
			},
		});
	});
};
