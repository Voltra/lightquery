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
				next: "/history",
			},
			{
				title: "A bit of history",
				path: "/history",
				prev: "/",
			},
		],
	},
};
