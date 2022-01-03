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
import { PackageViewProvider } from "./services/package/package-view";
import { LocalStorageService } from "./library/local-storage";
import { askForUrl } from "./services/web-publish";

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
const refreshPackageCommandID = "pwa-studio.refreshPackageView";
const chooseServiceWorkerCommandID = "pwa-studio.chooseServiceWorker";
const setAppURLCommandID = "pwa-studio.setWebURL";

export let storageManager: LocalStorageService | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
  storageManager = new LocalStorageService(context.workspaceState);

  const serviceWorkerStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  serviceWorkerStatusBarItem.text = "Generate Service Worker";
  serviceWorkerStatusBarItem.show();

  const packageStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    150
  );
  packageStatusBarItem.text = "Package PWA";
  packageStatusBarItem.show();

  const manifestStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    200
  );
  manifestStatusBarItem.text = "Generate Web Manifest";
  manifestStatusBarItem.show();

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

    const packageViewProvider = new PackageViewProvider(
      vscode.workspace.workspaceFolders[0].uri.fsPath
    );

    vscode.window.createTreeView("validationPanel", {
      treeDataProvider: maniValidationProvider,
    });

    vscode.window.createTreeView("serviceWorkerPanel", {
      treeDataProvider: serviceWorkerProvider,
    });

    vscode.window.createTreeView("packagePanel", {
      treeDataProvider: packageViewProvider,
    });

    vscode.commands.registerCommand(refreshViewCommandID, (event) => {
      maniValidationProvider.refresh(event);
    });

    vscode.commands.registerCommand(refreshSWCommandID, (event) => {
      serviceWorkerProvider.refresh(event);
    });

    vscode.commands.registerCommand(refreshPackageCommandID, (event) => {
      packageViewProvider.refresh(event);
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
      serviceWorkerStatusBarItem.show();
    }
  );

  const generateWorker = vscode.commands.registerCommand(
    generateWorkerCommandId,
    async () => {
      await generateServiceWorker();
    }
  );

  serviceWorkerStatusBarItem.command = generateWorkerCommandId;

  let packageAppCommand = vscode.commands.registerCommand(
    packageCommandId,
    packageApp
  );

  packageStatusBarItem.command = packageCommandId;

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
  manifestStatusBarItem.command = manifestCommandID;

  let setAppURLCommand = vscode.commands.registerCommand(
    setAppURLCommandID,
    async () => {
      await askForUrl();
    }
  );

  context.subscriptions.push(manifestCommand);
  context.subscriptions.push(newPwaStarterCommand);
  context.subscriptions.push(addServiceWorker);
  context.subscriptions.push(chooseServiceWorkerCommand);
  context.subscriptions.push(serviceWorkerStatusBarItem);
  context.subscriptions.push(packageAppCommand);
  context.subscriptions.push(validationCommand);
  context.subscriptions.push(generateWorker);
  context.subscriptions.push(maniDocs);
  context.subscriptions.push(chooseManifestCommand);
  context.subscriptions.push(setAppURLCommand);
}

export function deactivate() {}
