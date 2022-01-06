import { copyFile, mkdir, readFile, writeFile } from "fs/promises";
import * as vscode from "vscode";
import fetch, { Headers } from "node-fetch";
import { getWebviewContent } from "./manifest-content";
import { FormData, Blob } from "formdata-node";

let manifest: any | undefined;

export async function handleManifestCommand(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    "pwa-studio", // Identifies the type of the webview. Used internally
    "PWA Studio", // Title of the panel displayed to the user
    vscode.ViewColumn.One, // Editor column to show the new webview panel in.
    {
      // Enable scripts in the webview
      enableScripts: true,
    }
  );

  panel.webview.html = getWebviewContent();

  let manifestObject: any;
  // Handle messages from the webview
  panel.webview.onDidReceiveMessage(
    async (message) => {
      switch (message.command) {
        case "prompt":
          manifestObject = message.manifestObject;

          const uri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(
              `${vscode.workspace.workspaceFolders?.[0].uri.fsPath}}/manifest.json`
            ),
          });

          if (uri) {
            try {
              await writeFile(
                uri.fsPath,
                JSON.stringify(manifestObject, null, 2)
              );

              await findManifest();
              vscode.window.showInformationMessage(message.text);
            } catch (err) {
              vscode.window.showErrorMessage(
                "Could not write to file: " +
                  uri.fsPath +
                  ": " +
                  (err as Error).message
              );
            }

            // await handleIcons();

            await handleAddingManiToIndex();
          }

          return;
      }
    },
    undefined,
    context.subscriptions
  );
}

export async function handleIcons() {
  const iconFile = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    title: "Select a 512x512 icon",
    filters: {
      Image: ["png"],
    },
  });

  if (iconFile) {
    try {
      await mkdir(
        `${vscode.workspace.workspaceFolders?.[0].uri.fsPath}/pwabuilder-icons`,
        { recursive: true }
      );

      await copyFile(
        iconFile[0].fsPath,
        `${vscode.workspace.workspaceFolders?.[0].uri.fsPath}/pwabuilder-icons/512x512.png`
      );
    } catch (err) {
      vscode.window.showErrorMessage(
        err && (err as Error).message
          ? (err as Error).message
          : "There was an issue handling icons"
      );
    }
  }
}

export async function chooseManifest() {
  const manifestFile = await vscode.window.showOpenDialog({
    canSelectFiles: true,
    canSelectFolders: false,
    canSelectMany: false,
    title: "Select your Web Manifest",
    filters: {
      JSON: ["json"],
    },
  });

  if (manifestFile) {
    await findManifest();
  }
}

export function getManifest(): any | undefined {
  return manifest;
}

export async function findManifest() {
  const mani = await vscode.workspace.findFiles(
    "**/manifest.json",
    "**​/node_modules/**"
  );

  if (mani.length > 0) {
    manifest = mani[0];
  } else {
    const maniTryTwo = await vscode.workspace.findFiles(
      "**/web-manifest.json",
      "**​/node_modules/**"
    );

    if (maniTryTwo.length > 0) {
      manifest = maniTryTwo[0];
    }
  }

  if (manifest) {
    // do refreshPackageView command
    await vscode.commands.executeCommand("pwa-studio.refreshPackageView");
  }

  return manifest;
}

async function handleAddingManiToIndex(): Promise<void> {
  let indexFile: undefined | vscode.Uri;
  const indexFileData = await vscode.workspace.findFiles(
    "**/index.html",
    "**/node_modules/**"
  );

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

  if (indexFile) {
    const document = await vscode.workspace.openTextDocument(indexFile);
    const editor = await vscode.window.showTextDocument(document);

    const manifest = getManifest();

    const goodPath = vscode.workspace.asRelativePath(manifest.fsPath);

    let linkString = `<link rel="manifest" href="${goodPath}">`;

    // find head in index file
    const start = editor.document.positionAt(
      editor.document.getText().indexOf("</head>")
    );
    // insert registerCommand in head
    editor.insertSnippet(
      new vscode.SnippetString(linkString),
      start.translate(-1, 0)
    );

    await vscode.commands.executeCommand("pwa-studio.refreshEntry");
  }
}
