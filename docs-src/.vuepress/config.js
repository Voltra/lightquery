const path = require("path");
const here = (uri = "") => path.resolve(__dirname, uri);

module.exports = {
	base: "/", // "/lightquery/",
	dest: here("../../docs/"),
	title: "Lightquery",
	description: "A lightweight alternative to jQuery",
	themeConfig: {
		smoothScroll: true,
		plugins: [
			["clean-urls", true]
		],
		sidebar: [
			'/',
			/*'/exports',
			'/plugin',
			{
				title: "Components",
				path: "/components",
				children: [
					"/components/GdprManager",
					"/components/GdprGroup",
					"/components/GdprGuard"
				],
				prev: "/plugin",
				next: "/components/GdprManager",
			},
			'/helpers',*/
		],
	},
};
