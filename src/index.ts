import type { TxtNode } from '@textlint/ast-node-types';
import type {
	TextlintFixableRuleModule,
	TextlintRuleContext,
} from '@textlint/types';

const evilQuotesRegExp = /("?\w+"|"\w+)/g;
const goodQuoteOpen = '“';
const goodQuoteClose = '”';

function getReplacement(text: string) {
	return text.replace(/"(?=\w)/, goodQuoteOpen).replaceAll('"', goodQuoteClose);
}

function reporter(context: TextlintRuleContext) {
	const { Syntax, RuleError, report, fixer, getSource } = context;
	return {
		[Syntax.Str](node: TxtNode) {
			return new Promise<void>((resolve) => {
				const text = getSource(node);

				let match: RegExpExecArray | null;
				while ((match = evilQuotesRegExp.exec(text))) {
					const index = match.index;
					const matched = match[0];
					const replacement = getReplacement(matched);
					const fix = fixer.replaceTextRange(
						[index, index + matched.length],
						replacement
					);
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

const rule: TextlintFixableRuleModule = {
	linter: reporter,
	fixer: reporter,
};

export default rule;
