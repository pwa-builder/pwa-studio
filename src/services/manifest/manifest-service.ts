import { writeFile } from "fs/promises";
import * as vscode from "vscode";
import { getWebviewContent } from "./manifest-content";

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
            defaultUri: vscode.Uri.file("manifest.json"),
          });

          if (uri) {
            try {
              await writeFile(
                uri.fsPath,
                JSON.stringify(manifestObject, null, 2)
              );
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

async function handleAddingManiToIndex() {
    const indexFile = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      title: "Select your index.html",
      filters: {
        HTML: ["html"],
      },
    });
  
    if (indexFile) {
      const document = await vscode.workspace.openTextDocument(indexFile[0]);
      await vscode.window.showTextDocument(document);
  
      await vscode.window.showInformationMessage(
        "Finish adding your service worker by adding the following code to your index.html: <link rel='manifest' href='manifest.json'>",
        {},
        {
          title: "Copy to clipboard",
          action: async () => {
            try {
              await vscode.env.clipboard.writeText(
                "<link rel='manifest' href='manifest.json'>"
              );
            } catch (err) {
              vscode.window.showErrorMessage(
                err && (err as Error).message
                  ? (err as Error).message
                  : "There was an issue adding your manifest to your index.html"
              );
            }
          },
        }
      );
    }
  }
  