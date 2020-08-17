const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');
const { exec } = require('child_process');
const cron = require('node-cron');

console.log('Wallhaven Download Started');

function setWallPaper(wallpaperFileName) {
	exec(
		`/usr/bin/gsettings set org.cinnamon.desktop.background picture-uri "file://${
			process.env.PWD || '/home/lameco/Projects/WallhavenDownload'
		}/${wallpaperFileName}"`,
		(err, stdout, stderr) => {
			if (err) {
				console.error(err);
				process.exit(1);
			}

			if (stderr) {
				console.log(stderr);
				process.exit(1);
			}
			console.log(stdout);
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
		if (!err && res.statusCode === 200) {
			const $ = cheerio.load(html);

			const src = $('.scrollbox').children().attr('data-cfsrc');

			const wallpaperId = $('.scrollbox').children().attr('data-wallpaper-id');

			const wallpaperFileName = `downloads/${new Date().getTime()}-${wallpaperId}.png`;

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

const randomWallpaperURL =
	// Random (Really)
	'https://wallhaven.cc/random';
// Only anime pics
// 'https://wallhaven.cc/search?categories=010&purity=100&sorting=random&order=desc&seed=GTud9&page=2';
// Only anime NSFW pics
// 'https://wallhaven.cc/search?categories=010&purity=010&sorting=random&order=desc';
// Discover f ys
// 'https://wallhaven.cc/search?categories=011&purity=010&sorting=random&order=desc';
// ALL, all tags, all all all
// 'https://wallhaven.cc/search?categories=111&purity=110&sorting=random&order=desc&seed=M60tJ&page=2'

cron.schedule('*/1 * * * *', () =>
	request(randomWallpaperURL, (err, res, html) => {
		if (!err && res.statusCode === 200) {
			const $ = cheerio.load(html);

			const src = $('.thumb')?.toArray()[0]?.children[1]?.attribs?.href;

			console.log(src);

			if (src) {
				!fs.existsSync('downloads') && fs.mkdirSync('downloads');

				downloadWallpaper(src);

				removeOldFile();
			} else {
				console.error('WallPaper Random URL not found');
			}
		}
	})
);
