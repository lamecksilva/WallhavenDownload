const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');

// getUrl = () => {
// 	var argv = require('minimist')(process.argv.slice(2));
// 	if (argv.u !== null && argv.u !== undefined) {
// 		console.dir(argv.u);
// 		return argv.u;
// 	}
// };

// const url = getUrl();

function downloadWallpaper(url) {
	request(url, (err, res, html) => {
		if (!err && res.statusCode == 200) {
			const $ = cheerio.load(html);

			const src = $('.scrollbox').children().attr('data-cfsrc');

			const wallpaperId = $('.scrollbox').children().attr('data-wallpaper-id');

			fs.mkdirSync('downloads');

			request
				.get(src)
				.on('error', (err) => console.log(err))
				.pipe(fs.createWriteStream(`downloads/wallpaper-${wallpaperId}.png`))
				.on('close', () => {
					console.log('Download done');
				})
				.on('error', () => console.error('Download Error'));
		}
	});
}

request('https://wallhaven.cc/random', (err, res, html) => {
	if (!err && res.statusCode === 200) {
		const $ = cheerio.load(html);

		// const src = $('.thumb').children().attr('.preview');
		const src = $('.thumb')?.toArray()[0]?.children[1]?.attribs?.href;

		console.log(src);

		if (src) {
			downloadWallpaper(src);
		} else {
			console.error('WallPaper Random URL not found');
		}
	}
});
