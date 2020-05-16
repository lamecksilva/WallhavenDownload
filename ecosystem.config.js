module.exports = {
	apps: [
		{
			name: 'WallHavenDownloadService',
			script: 'index.js',
			watch: true,
			env: {
				NODE_ENV: 'production',
			},
		},
	],
};
