module.exports = {
    // ESLint configuration based on AirBnB with a few personal tweaks I can't live without.
	// https://www.npmjs.com/package/eslint-config-airbnb

	extends: "airbnb",

    env: {
		browser: true
	},

    rules: {
        'indent': ["error", 4],
        'space-in-parens': ["error", "always"],
        'array-bracket-spacing': ["error", "always"]
    }
};
