const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');
const { exec } = require('child_process');

// getUrl = () => {
// 	var argv = require('minimist')(process.argv.slice(2));
// 	if (argv.u !== null && argv.u !== undefined) {
// 		console.dir(argv.u);
// 		return argv.u;
// 	}
// };

// const url = getUrl();

function setWallPaper(wallpaperFileName) {
	exec(
		`gsettings set org.cinnamon.desktop.background picture-uri "file:///home/lameco/Documents/WallhavenDownload/${wallpaperFileName}"`,
		(err, stdout, stderr) => {
			if (err) {
				console.error(err);
				process.exit(1);
			}

			if (stderr) {
				console.log(stderr);
				process.exit(1);
			}
			// console.log(stdout);
		}
	);
}

function removeOldFile() {
	fs.readdir('downloads', (err, files) => {
		if (err) {
			console.error(err);
			process.exit(1);
		}

		const fileName = files[0];

		files.length &&
			fs.unlink(`downloads/${fileName}`, (err) => {
				if (err) {
					console.error('Error while removing old file');
					process.exit(1);
				}
				console.log('Old File Deleted');
			});
	});
}

function downloadWallpaper(url) {
	request(url, (err, res, html) => {
		if (!err && res.statusCode == 200) {
			const $ = cheerio.load(html);

			const src = $('.scrollbox').children().attr('data-cfsrc');

			const wallpaperId = $('.scrollbox').children().attr('data-wallpaper-id');

			const wallpaperFileName = `downloads/${new Date().getTime()}-${wallpaperId}.png`;

			if (!fs.existsSync('downloads')) fs.mkdirSync('downloads');

			request
				.get(src)
				.on('request', () => console.log('Starting Download'))
				.pipe(fs.createWriteStream(wallpaperFileName))
				.on('close', () => {
					console.log('Download done');
					setWallPaper(wallpaperFileName);
				})
				.on('error', () => console.error('Download Error'));
		}
	});
}

// request(
// 	'https://wallhaven.cc/search?categories=011&purity=010&sorting=random&order=desc',
// 	(err, res, html) => {
request('https://wallhaven.cc/random', (err, res, html) => {
	if (!err && res.statusCode === 200) {
		const $ = cheerio.load(html);

		const src = $('.thumb')?.toArray()[0]?.children[1]?.attribs?.href;

		console.log(src);

		if (src) {
			downloadWallpaper(src);
			removeOldFile();
		} else {
			console.error('WallPaper Random URL not found');
		}
	}
});
