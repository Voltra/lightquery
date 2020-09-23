const path = require("path");
const here = (uri = "") => path.resolve(__dirname, uri);

module.exports = {
	base: "/", // "/lightquery/",
	dest: here("../../docs/"),
	title: "Lightquery",
	description: "A lightweight alternative to jQuery",
	themeConfig: {
		logo: "/logo.png",
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
				next: "/design",
				children: [],
			},
			{
				title: "About design",
				path: "/design",
				prev: "/history",
				next: "/functionalities/exports",
				children: [],
			},
			{
				title: "Functionalities",
				children: [
					{
						title: "Exports",
						path: "/functionalities/exports",
						prev: "/design",
						next: "/functionalities/factory/call",
						children: [],
					},
					{
						title: "Factory",
						children: [
							{
								title: "Calling the factory",
								path: "/functionalities/factory/call",
								prev: "/functionalities/exports",
								next: "/functionalities/factory/strict-mode",
								children: [],
							},
							{
								title: "Strict mode",
								path: "/functionalities/factory/strict-mode",
								prev: "/functionalities/factory/call",
								next: "/functionalities/factory/plugin-system",
							},
							{
								title: "The plugin system",
								path: "/functionalities/factory/plugin-system",
								prev: "/functionalities/factory/strict-mode",
								next: "/functionalities/factory/events",
								children: [],
							},
							{
								title: "Events",
								path: "/functionalities/factory/events",
								prev: "/functionalities/factory/plugin-system",
								next: "/functionalities/factory/misc",
								children: [],
							},
							{
								title: "Misc",
								path: "/functionalities/factory/misc",
								prev: "/functionalities/factory/events",
								children: [],
							},
						],
					},
				],
			},
		],
	},
};
