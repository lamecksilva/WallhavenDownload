module.exports = {
	apps: [
		{
			name: 'WallHavenDownloadService',
			script: 'index.js',
			watch: true,
			ignore_watch: ['downloads', 'node_modules'],
		},
	],
};
