const path = require("path");
const here = (uri = "") => path.resolve(__dirname, uri);

const autometaOptions = {
	site: {
		name: "Lightquery",
	},
	author: {
		name: "Voltra",
	},
	canonical_base: "https://voltra.github.io/lightquery",
};

module.exports = {
	base: /*"/",*/ "/lightquery/",
	dest: here("../../docs/"),
	title: "Lightquery",
	description: "A lightweight alternative to jQuery",
	themeConfig: {
		logo: "/logo.png",
		smoothScroll: true,
		plugins: [
			["clean-urls", true],
			"@vuepress/back-to-top",
			["autometa", autometaOptions],
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
					{
						title: "Collection",
						children: [
							{
								title: "Utils",
								children: [
									{
										title: "ready",
										path: "/functionalities/collection/utils/ready",
										prev: "/functionalities/factory/misc",
										next: "/functionalities/collection/utils/resize",
										children: [],
									},
									{
										title: "resize",
										path: "/functionalities/collection/utils/resize",
										prev: "/functionalities/collection/utils/ready",
										next: false,
										children: [],
									},
								],
							},
							{
								title: "Iteration",
								children: [
									{
										title: "forEach",
										path: "/functionalities/collection/iterations/for-each",
										prev: "/functionalities/collection/utils/resize",
										next: "/functionalities/collection/iterations/map",
										children: [],
									},
									{
										title: "map",
										path: "/functionalities/collection/iterations/map",
										prev: "/functionalities/collection/iterations/for-each",
										next: "/functionalities/collection/iterations/filter",
										children: [],
									},
									{
										title: "filter",
										path: "/functionalities/collection/iterations/filter",
										prev: "/functionalities/collection/iterations/map",
										next: "/functionalities/collection/iterations/reduce",
										children: [],
									},
									{
										title: "reduce",
										path: "/functionalities/collection/iterations/reduce",
										prev: "/functionalities/collection/iterations/filter",
										next: "/functionalities/collection/iterations/predicates",
										children: [],
									},
									{
										title: "Predicate based methods",
										path: "/functionalities/collection/iterations/predicates",
										prev: "/functionalities/collection/iterations/reduce",
										next: "/functionalities/collection/iterations/to-array",
										children: [],
									},
									{
										title: "toArray",
										path: "/functionalities/collection/iterations/to-array",
										prev: "/functionalities/collection/iterations/predicates",
										next: "",
										children: [],
									},
								],
							},
							{
								title: "Single Item",
								children: [
									{
										title: "Indices",
										path: "/functionalities/collection/single-item/indices",
										prev: "/functionalities/collection/iterations/to-array",
										next: "/functionalities/collection/single-item/info",
										children: [],
									},
									{
										title: "Info",
										path: "/functionalities/collection/single-item/info",
										prev: "/functionalities/collection/iterations/to-array",
										next: "/functionalities/collection/single-item/checks",
										children: [],
									},
									{
										title: "Checks",
										path: "/functionalities/collection/single-item/checks",
										prev: "/functionalities/collection/single-item/info",
										next: "/functionalities/collection/multiple-items/classes",
										children: [],
									},
								],
							},
							{
								title: "Multiple Items",
								children: [
									{
										title: "Classes",
										path: "/functionalities/collection/multiple-items/classes",
										prev: "/functionalities/collection/single-item/checks",
										next: "/functionalities/collection/multiple-items/removal",
										children: [],
									},
									{
										title: "Removal",
										path: "/functionalities/collection/multiple-items/removal",
										prev: "/functionalities/collection/multiple-items/classes",
										next: "/functionalities/collection/multiple-items/events",
										children: [],
									},
									{
										title: "Event handling",
										path: "/functionalities/collection/multiple-items/events",
										prev: "/functionalities/collection/multiple-items/removal",
										next: "/functionalities/collection/dom/traversal",
										children: [],
									},
								],
							},
							{
								title: "DOM",
								children: [
									{
										title: "Traversal",
										path: "/functionalities/collection/dom/traversal",
										prev: "/functionalities/collection/multiple-items/events",
										next: "/functionalities/collection/dom/manipulation",
										children: [],
									},
									{
										title: "Manipulation",
										path: "/functionalities/collection/dom/manipulation",
										prev: "/functionalities/collection/dom/traversal",
										next: "/functionalities/collection/misc",
										children: [],
									},
								],
							},
							{
								title: "Misc",
								path: "/functionalities/collection/misc",
								prev: "/functionalities/collection/dom/manipulation",
								next: "/functionalities/collection/events-shorthand",
								children: [],
							},
							{
								title: "Events shorthand",
								path: "/functionalities/collection/events-shorthand",
								prev: "/functionalities/collection/misc",
								next: "/functionalities/collection/dimensions",
								children: [],
							},
							{
								title: "Dimensions",
								path: "/functionalities/collection/dimensions",
								prev: "/functionalities/collection/events-shorthand",
								next: "",
								children: [],
							},
						],
					},
				],
			},
		],
	},
};
