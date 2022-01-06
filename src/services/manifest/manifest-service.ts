import { writeFile } from "fs/promises";
import * as vscode from "vscode";
import { getIconWebviewContent, getWebviewContent } from "./manifest-content";

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

  // show information message
  vscode.window.showInformationMessage(
    "Fill out the details of your Web Manifest and choose an Icon, then tap the Submit Manifest Options button. This may take a minute..."
  );

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

            await handleAddingManiToIndex();
          }

          return;
      }
    },
    undefined,
    context.subscriptions
  );
}

export async function handleIcons(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    "pwa-studio-icons", // Identifies the type of the webview. Used internally
    "Icon Generator", // Title of the panel displayed to the user
    vscode.ViewColumn.One, // Editor column to show the new webview panel in.
    {
      // Enable scripts in the webview
      enableScripts: true,
    }
  );

  panel.webview.html = getIconWebviewContent();

  // show information message
  vscode.window.showInformationMessage(
    "Choose an Icon and then tap Generate Icons, your icons will be added to your Web Manifest. This may take a minute."
  );

  let iconsObject: any;
  // Handle messages from the webview
  panel.webview.onDidReceiveMessage(
    async (message) => {
      switch (message.command) {
        case "prompt":
          iconsObject = message.iconsObject;
          const manifest: vscode.Uri = await findManifest();

          if (manifest && iconsObject.icons) {
            // read manifest file
            const manifestFile = await vscode.workspace.openTextDocument(
              manifest
            );

            const manifestObject = JSON.parse(manifestFile.getText());

            // add icons to manifest
            manifestObject.icons = iconsObject.icons;

            // write manifest file
            await writeFile(
              manifest.fsPath,
              JSON.stringify(manifestObject, null, 2)
            );

            // show manifest with vscode
            await vscode.window.showTextDocument(manifestFile);
          }
          else {
            vscode.window.showErrorMessage("You first need a Web Manifest. Tap the Generate Manifest button at the bottom to get started.");
          }

          return;
      }
    },
    undefined,
    context.subscriptions
  );
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
