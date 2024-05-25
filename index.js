const evilQuotesRegExp = /("?\w+"|"\w+)/g;
const goodQuoteOpen = '“';
const goodQuoteClose = '”';

function getReplacement(text) {
	return text.replace(/"(?=\w)/, goodQuoteOpen).replace(/"/g, goodQuoteClose);
}

function reporter(context) {
	const { Syntax, RuleError, report, fixer, getSource } = context;
	return {
		[Syntax.Str](node) {
			return new Promise((resolve) => {
				const text = getSource(node);

				let match;
				while ((match = evilQuotesRegExp.exec(text))) {
					const index = match.index;
					const matched = match[0];
					const replacement = getReplacement(matched);
					const range = [index, index + matched.length];
					const fix = fixer.replaceTextRange(range, replacement);
					const message = `Incorrect quote used: \`${matched}\`, use \`${replacement}\` instead`;
					report(
						node,
						new RuleError(message, {
							index,
							fix,
						})
					);
				}

				resolve();
			});
		},
	};
}

module.exports = {
	linter: reporter,
	fixer: reporter,
};
