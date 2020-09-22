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
			["clean-urls", true],
			"@vuepress/back-to-top",
		],
		sidebar: [
			{
				title: "User guide",
				path: "/",
				prev: null,
				next: "/history",
				children: [],
			},
			{
				title: "A bit of history",
				path: "/history",
				prev: "/",
				next: null,
				children: [],
			},
			{
				title: "About design",
				path: "/design",
				prev: "/",
				next: null,
				children: [],
			},
		],
	},
};
