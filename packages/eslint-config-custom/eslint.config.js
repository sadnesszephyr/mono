export default {
	extends: ['eslint:recommended', 'turbo', 'prettier'],
	rules: {
		'prefer-const': 'error',
		'no-var': 'error',
		'no-extra-parens': 'error',
		'no-whitespace-before-property': 'error',
		'space-in-parens': ['error', 'never']
	},
	env: {
		node: true
	}
}

