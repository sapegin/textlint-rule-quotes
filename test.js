const TextLintTester = require('textlint-tester').default;
const rule = require('./index');

const tester = new TextLintTester();

tester.run('quotes', rule, {
	valid: [
		'the “good” one',
		'the “very good” one',
		// TODO: Not supported yet
		// 'personal best: 00\'03"48',
		// 'latitude: 49° 53\' 08"',
	],
	invalid: [
		{
			text: 'the "good" one',
			output: 'the “good” one',
			errors: [
				{
					message: 'Incorrect quote used: `"good"`, use `“good”` instead',
				},
			],
		},
		{
			text: 'the "very good" one',
			output: 'the “very good” one',
			errors: [
				{
					message: 'Incorrect quote used: `"very`, use `“very` instead',
				},
				{
					message: 'Incorrect quote used: `good"`, use `good”` instead',
				},
			],
		},
	],
});
