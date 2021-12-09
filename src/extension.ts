// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { setUpLocalPwaStarterRepository } from './services/StarterService';
import { handleServiceWorkerCommand } from './services/service-worker';
import { getWebviewContent } from './services/manifest-content';
import * as path from 'path';
import * as fs from "fs-extra";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "pwa-studio" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	const addServiceWorker = vscode.commands.registerCommand('pwa-studio.serviceWorker', async () => {
		console.log("doing stuff! ");
		await handleServiceWorkerCommand();
	});

	let newPwaStarterCommand = vscode.commands.registerCommand('pwa-studio.newPwaStarter', setUpLocalPwaStarterRepository);

	let manifestCommand = vscode.commands.registerCommand('pwa-studio.manifest', () => {
		// Create and show a new webview
		const panel = vscode.window.createWebviewPanel(
		  'pwa-studio', // Identifies the type of the webview. Used internally
		  'PWA Studio', // Title of the panel displayed to the user
		  vscode.ViewColumn.One, // Editor column to show the new webview panel in.
		  	{
				// Enable scripts in the webview
				enableScripts: true
			}
		);

		panel.webview.html = getWebviewContent();

		let manifestObject: any;
		 // Handle messages from the webview
		panel.webview.onDidReceiveMessage(
			message => {
			  switch (message.command) {
				case 'prompt':
					manifestObject = message.manifestObject;

					void vscode.window.showSaveDialog({
						defaultUri: vscode.Uri.file("manifest-test.json"),
					}).then((uri: vscode.Uri | undefined) => {
						if (uri) {
							const value = uri.fsPath;
							fs.writeFile(value, JSON.stringify(manifestObject, null, 4), (error) => {
								if (error) {
									void vscode.window.showErrorMessage("Could not write to file: " + value + ": " + error.message);
								} else {
									vscode.window.showInformationMessage(message.text);
								}
							});
						}
					});

					
					return;
			  }
			},
			undefined,
			context.subscriptions
		);
	
	});

	//context.subscriptions.push(disposable);
	context.subscriptions.push(newPwaStarterCommand);
	context.subscriptions.push(addServiceWorker);
	context.subscriptions.push(manifestCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
