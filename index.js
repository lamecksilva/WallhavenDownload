const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');

getUrl = () => {
	var argv = require('minimist')(process.argv.slice(2));
	if (argv.u !== null && argv.u !== undefined) {
		console.dir(argv.u);
		return argv.u;
	}
};

const url = getUrl();

request(url, (err, res, html) => {
	if (!err && res.statusCode == 200) {
		const $ = cheerio.load(html);

		const src = $('.scrollbox').children().attr('data-cfsrc');

		const wallpaperId = $('.scrollbox').children().attr('data-wallpaper-id');

		console.log(src);

		request
			.get(src)
			.on('error', (err) => console.log(err))
			.pipe(fs.createWriteStream(`wallpaper-${wallpaperId}.png`))
			.on('close', () => {
				console.log('Download done');
			});
	}
});
