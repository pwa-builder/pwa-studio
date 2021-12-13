// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { setUpLocalPwaStarterRepository } from "./services/StarterService";
import { handleServiceWorkerCommand } from "./services/service-worker";
import { handleValidation, testManiEntry } from "./services/validation";

const serviceWorkerCommandId = "pwa-studio.serviceWorker";
const newPWAStarterCommandId = "pwa-studio.newPwaStarter";
const validateCommandId = "pwa-studio.validatePWA";

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

  let newPwaStarterCommand = vscode.commands.registerCommand(
    newPWAStarterCommandId,
    setUpLocalPwaStarterRepository
  );

  let validationCommand = vscode.commands.registerCommand(
    validateCommandId,
    async () => {
      handleValidation();
    }
  );

  vscode.languages.registerHoverProvider("json", {
    provideHover(document, position, token) {
      const range = document.getWordRangeAtPosition(position);
      const text = document.lineAt(position.line).text;
      const word = document.getText(range);

      return testManiEntry(word, text).then((result) => {
		if (result) {
			return new vscode.Hover(result);
		  }
	  })
    },
  });

  context.subscriptions.push(newPwaStarterCommand);
  context.subscriptions.push(addServiceWorker);
  context.subscriptions.push(myStatusBarItem);
  context.subscriptions.push(validationCommand);
}

export function deactivate() {}
