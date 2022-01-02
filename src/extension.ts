// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { setUpLocalPwaStarterRepository } from "./services/new-pwa-starter";
import {
  handleServiceWorkerCommand,
  generateServiceWorker,
  chooseServiceWorker,
} from "./services/service-worker";
import {
  handleManifestCommand,
  chooseManifest,
} from "./services/manifest/manifest-service";
import { packageApp } from "./services/package/package-app";
import {
  handleManiDocsCommand,
  handleValidation,
} from "./services/validation/validation";
import { PWAValidationProvider } from "./services/validation/validation-view";
import { ServiceWorkerProvider } from "./services/validation/sw-view";

const serviceWorkerCommandId = "pwa-studio.serviceWorker";
const generateWorkerCommandId = "pwa-studio.generateWorker";
const newPWAStarterCommandId = "pwa-studio.newPwaStarter";
const validateCommandId = "pwa-studio.validatePWA";
const packageCommandId = "pwa-studio.packageApp";
const manifestCommandID = "pwa-studio.manifest";
const maniDocsCommandID = "pwa-studio.maniItemDocs";
const chooseManiCommandID = "pwa-studio.chooseManifest";
const refreshViewCommandID = "pwa-studio.refreshEntry";
const refreshSWCommandID = "pwa-studio.refreshSWView";
const chooseServiceWorkerCommandID = "pwa-studio.chooseServiceWorker";

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
    const maniValidationProvider = new PWAValidationProvider(
      vscode.workspace.workspaceFolders[0].uri.fsPath
    );

    const serviceWorkerProvider = new ServiceWorkerProvider(
      vscode.workspace.workspaceFolders[0].uri.fsPath
    );

    vscode.window.createTreeView("validationPanel", {
      treeDataProvider: maniValidationProvider,
    });

    vscode.window.createTreeView("serviceWorkerPanel", {
      treeDataProvider: serviceWorkerProvider,
    });

    vscode.commands.registerCommand(refreshViewCommandID, (event) => {
      maniValidationProvider.refresh(event);
    });

    vscode.commands.registerCommand(refreshSWCommandID, (event) => {
      serviceWorkerProvider.refresh(event);
    });
  }

  const maniDocs = vscode.commands.registerCommand(
    maniDocsCommandID,
    async (event: any) => {
      await handleManiDocsCommand(event);
    }
  );

  const chooseManifestCommand = vscode.commands.registerCommand(
    chooseManiCommandID,
    async () => {
      await chooseManifest();
    }
  );

  const chooseServiceWorkerCommand = vscode.commands.registerCommand(
    chooseServiceWorkerCommandID,
    async () => {
      await chooseServiceWorker();
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
  context.subscriptions.push(chooseServiceWorkerCommand);
  context.subscriptions.push(myStatusBarItem);
  context.subscriptions.push(packageAppCommand);
  context.subscriptions.push(validationCommand);
  context.subscriptions.push(generateWorker);
  context.subscriptions.push(maniDocs);
  context.subscriptions.push(chooseManifestCommand);
}

export function deactivate() {}
