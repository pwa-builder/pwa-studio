import { watch } from "fs";
import * as vscode from "vscode";
import { isNpmInstalled, noNpmInstalledWarning } from "./new-pwa-starter";

const vsTerminal = vscode.window.createTerminal();

let existingWorker: any | undefined = undefined;

export async function handleServiceWorkerCommand(): Promise<void> {
  //setup file watcher for workbox config file
  const watcher = vscode.workspace.createFileSystemWatcher(
    "**/workbox-config.js"
  );

  const swFileWatcher = vscode.workspace.createFileSystemWatcher(
    "**/sw.js",
    false,
    true
  );

  swFileWatcher.onDidCreate(async (uri) => {
    if (uri) {
      swFileWatcher.dispose();
      await handleAddingToIndex();
    }
  });

  watcher.onDidCreate((uri) => {
    if (uri) {
      watcher.dispose();
      generateServiceWorker();
    }
  });

  watcher.onDidChange((uri) => {
    if (uri) {
      watcher.dispose();
      generateServiceWorker();
    }
  });

  try {
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
      },
      async (progress) => {
        progress.report({ message: "Generating Workbox Config..." });
        await runWorkboxTool();
        progress.report({ message: "Workbox Config added!" });
      }
    );
  } catch (err) {
    vscode.window.showErrorMessage(
      err && (err as Error).message
        ? (err as Error).message
        : "There was an issue adding your service worker"
    );
  }
}

export function generateServiceWorker() {
  vsTerminal.show();

  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
    },
    async (progress) => {
      progress.report({ message: "Generating Service Worker..." });
      vsTerminal.sendText("workbox generateSW");
    }
  );
}

export function chooseServiceWorker() {
  const serviceWorker = vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    title: "Select your Service Worker",
    filters: {
      JavaScript: ["js", "ts"],
    },
  });

  if (serviceWorker) {
    existingWorker = serviceWorker;
  }
}

export function getWorker() {
  return existingWorker;
}

export async function findWorker() {
  return new Promise<vscode.Uri>(async (resolve, reject) => {
    try {
      const worker = await vscode.workspace.findFiles(
        "**/service-worker.js",
        "**​/node_modules/**"
      );

      if (worker.length > 0) {
        existingWorker = worker[0];
      } else {
        const workerTryTwo = await vscode.workspace.findFiles(
          "**/pwabuider-sw.ts",
          "**​/node_modules/**"
        );

        if (workerTryTwo.length > 0) {
          existingWorker = workerTryTwo[0];
        } else {
          const workerTryThree = await vscode.workspace.findFiles(
            "**/sw.js",
            "**​/node_modules/**"
          );
          if (workerTryThree.length > 0) {
            existingWorker = workerTryThree[0];
          }
        }
      }

      console.log("existingWorker", existingWorker);

      if (existingWorker) {
        // do refreshPackageView command
        await vscode.commands.executeCommand("pwa-studio.refreshPackageView");
      }

      resolve(existingWorker);
    } catch (err) {
      reject(`Error adding service worker to index file: ${err}`);
    }
  });
}

async function runWorkboxTool(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const npmCheck = isNpmInstalled();
      if (npmCheck) {
        vsTerminal.show();
        vsTerminal.sendText("npm install workbox-cli --global");

        vsTerminal.sendText("workbox wizard");
        resolve();
      } else {
        noNpmInstalledWarning();
      }
    } catch (err) {
      reject(err);
    }
  });
}

async function handleAddingToIndex(): Promise<void> {
  let indexFile: undefined | vscode.Uri;
  const indexFileData = await vscode.workspace.findFiles(
    "**/index.html",
    "**/node_modules/**"
  );

  console.log("indexFileData", indexFileData);

  if (indexFileData && indexFileData.length > 0) {
    indexFile = indexFileData[0];
  } else {
    let indexFileDialogData = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      title: "Select your index.html",
      filters: {
        HTML: ["html"],
      },
    });

    if (indexFileDialogData) {
      indexFile = indexFileDialogData[0];
    }
  }

  const worker = await findWorker();
  console.log("worker", worker);
  const goodPath = vscode.workspace.asRelativePath(
    worker.fsPath || worker.path
  );

  const registerCommand = `<script>navigator.serviceWorker.register("${goodPath}")</script>`;

  if (indexFile) {
    const editor = await vscode.window.showTextDocument(indexFile);

    // find head in index file
    const start = editor.document.positionAt(
      editor.document.getText().indexOf("</head>")
    );
    // insert registerCommand in head
    editor.insertSnippet(
      new vscode.SnippetString(registerCommand),
      start.translate(-1, 0)
    );

    vscode.window.showInformationMessage("Service Worker added to index.html");

    const docsAnswer = await vscode.window.showInformationMessage(
      "Check the Workbox documentation to add workbox to your existing build command.",
      {},
      {
        title: "Open Workbox Documentation",
      }
    );

    if (docsAnswer && docsAnswer.title === "Open Workbox Documentation") {
      await vscode.env.openExternal(
        vscode.Uri.parse(
          "https://developers.google.com/web/tools/workbox/modules/workbox-cli#setup_and_configuration"
        )
      );
    }

    await vscode.commands.executeCommand("pwa-studio.refreshSWView");
  }
}
