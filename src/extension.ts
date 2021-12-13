// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { setUpLocalPwaStarterRepository } from './services/new-pwa-starter';
import { handleServiceWorkerCommand } from './services/service-worker';
import { packageApp } from './services/package-app';

const serviceWorkerCommandId = "pwa-studio.serviceWorker";
const newPWAStarterCommandId = "pwa-studio.newPwaStarter";

export function activate(context: vscode.ExtensionContext) {
  const myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );

  myStatusBarItem.text = "Update Service Worker";

  const addServiceWorker = vscode.commands.registerCommand(
    serviceWorkerCommandId,
    async () => {
      await handleServiceWorkerCommand();
	  myStatusBarItem.show();
    }
  );

  myStatusBarItem.command = serviceWorkerCommandId;

	let packageAppCommand = vscode.commands.registerCommand('pwa-studio.packageApp', packageApp);

  let newPwaStarterCommand = vscode.commands.registerCommand(
    newPWAStarterCommandId,
    setUpLocalPwaStarterRepository
  );

  context.subscriptions.push(newPwaStarterCommand);
  context.subscriptions.push(addServiceWorker);
  context.subscriptions.push(myStatusBarItem);
  context.subscriptions.push(packageAppCommand);
}

export function deactivate() {}
