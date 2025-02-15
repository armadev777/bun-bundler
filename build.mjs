import path from 'path';
import * as sass from 'sass';
import fs from 'fs';
import { Bundler } from 'bun-bundler';

const bundler = new Bundler();

const src = path.resolve('./src');
const dist = path.resolve('./build');

const directories = {
	src: src,
	// html: path.resolve(src, './pug/pages/'),
	sass: [path.resolve(src, './scss/app.scss')],
	js: [path.resolve(src, './js/app.js')],
	images: path.resolve(src, './images/'),
	fonts: path.resolve(src, './fonts/'),
	statics: path.resolve(src, './static/'),
	dist: dist,
	// htmlDist: dist,
	cssDist: path.resolve(dist, './css/'),
	jsDist: path.resolve(dist, './js/'),
	imagesDist: path.resolve(dist, './images/'),
	spriteDist: path.resolve(dist, './images/sprite'),
};

const { images, fonts, statics, jsDist } = directories;

bundler.build({
	...directories,
	staticFolders: [images, fonts, statics],
	production: true,

	onBuildComplete: () => {
		const criticalPath = path.resolve(src, './scss/critical/critical.scss');
		if (fs.existsSync(criticalPath)) {
			const result = sass.compile(criticalPath, { style: 'compressed' });
			fs.writeFileSync(path.join(directories.cssDist, 'critical.css'), result.css);
		}
	},
});
