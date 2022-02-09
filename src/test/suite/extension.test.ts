import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { setUpLocalPwaStarterRepository } from '../../services/new-pwa-starter';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual([1, 2, 3].indexOf(5), -1);
		assert.strictEqual([1, 2, 3].indexOf(0), -1);
	});

    test('Start new app', async () => {
		const appName = await setUpLocalPwaStarterRepository("test-app");
		assert.deepStrictEqual(appName, "test-app");
    });
});