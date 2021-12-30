// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { setUpLocalPwaStarterRepository } from "./services/new-pwa-starter";
import {
  handleServiceWorkerCommand,
  generateServiceWorker,
} from "./services/service-worker";
import { handleManifestCommand } from "./services/manifest/manifest-service";
import { packageApp } from "./services/package/package-app";
import { handleManiDocsCommand, handleValidation } from "./services/validation/validation";
import { PWAValidationProvider } from "./services/validation/validation-view";
import { ServiceWorkerProvider } from "./services/validation/sw-view";

const serviceWorkerCommandId = "pwa-studio.serviceWorker";
const generateWorkerCommandId = "pwa-studio.generateWorker";
const newPWAStarterCommandId = "pwa-studio.newPwaStarter";
const validateCommandId = "pwa-studio.validatePWA";
const packageCommandId = "pwa-studio.packageApp";
const manifestCommandID = "pwa-studio.manifest";
const maniDocsCommandID = "pwa-studio.maniItemDocs";

export function activate(context: vscode.ExtensionContext) {
  const myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );

  myStatusBarItem.text = "Generate Service Worker";

  if (
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
  ) {
    vscode.window.createTreeView("validationPanel", {
      treeDataProvider: new PWAValidationProvider(
        vscode.workspace.workspaceFolders[0].uri.fsPath
      ),
    });

    vscode.window.createTreeView("serviceWorkerPanel", {
      treeDataProvider: new ServiceWorkerProvider(
        vscode.workspace.workspaceFolders[0].uri.fsPath
      ),
    })
  }

  const maniDocs = vscode.commands.registerCommand(
    maniDocsCommandID,
    async (event: any) => {
      await handleManiDocsCommand(event)
    }
  );

  const addServiceWorker = vscode.commands.registerCommand(
    serviceWorkerCommandId,
    async () => {
      await handleServiceWorkerCommand();
      myStatusBarItem.show();
    }
  );

  const generateWorker = vscode.commands.registerCommand(
    generateWorkerCommandId,
    async () => {
      await generateServiceWorker();
      myStatusBarItem.show();
    }
  );

  myStatusBarItem.command = generateWorkerCommandId;

  let packageAppCommand = vscode.commands.registerCommand(
    packageCommandId,
    packageApp
  );

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

  let manifestCommand = vscode.commands.registerCommand(
    manifestCommandID,
    async () => {
      await handleManifestCommand(context);
    }
  );

  context.subscriptions.push(manifestCommand);
  context.subscriptions.push(newPwaStarterCommand);
  context.subscriptions.push(addServiceWorker);
  context.subscriptions.push(myStatusBarItem);
  context.subscriptions.push(packageAppCommand);
  context.subscriptions.push(validationCommand);
  context.subscriptions.push(generateWorker);
  context.subscriptions.push(maniDocs);
}

export function deactivate() {}
