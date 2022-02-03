import * as vscode from "vscode";

let manifest: any | undefined;

export async function convertBaseToFile(
  iconsList: Array<any>
): Promise<{ path: string; icons: Array<any> }> {
    // ask user to choose a directory to save files to
    const uri = await vscode.window.showSaveDialog({
      defaultUri: vscode.Uri.file(
        `${vscode.workspace.workspaceFolders?.[0].uri.fsPath}/icons`
      ),
      saveLabel: "Choose Directory to Save Icons",
      title: "Choose a directory to save generated icons to",
    });

    if (uri) {
      // create directory based on uri
      await vscode.workspace.fs.createDirectory(uri);
    }

    let newIconsList: Array<any> | undefined;

    if (uri) {
      newIconsList = iconsList.map((icon) => {
        return new Promise(async (resolve) => {
          // create file path to write file to
          const iconFile = vscode.Uri.file(
            `${uri.fsPath}/${icon.sizes}-icon.${icon.type.substring(
              icon.type.indexOf("/") + 1
            )}`
          );

          // create buffer from icon base64 data
          const buff: Buffer = Buffer.from(icon.src.split(',')[1], "base64");

          // write file to disk
          await vscode.workspace.fs.writeFile(iconFile, buff);

          icon.src = vscode.workspace.asRelativePath(iconFile.fsPath);

          resolve(icon);
        });
      });

      vscode.window.showInformationMessage(`Icons saved to ${uri.fsPath}`);

      return ({ path: uri.fsPath, icons: await Promise.all(newIconsList) || [] });
    }
    else {
      return ({ path: "", icons: [] });
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
    "/node_modules/"
  );

  if (mani.length > 0) {
    manifest = mani[0];
  } else {
    const maniTryTwo = await vscode.workspace.findFiles(
      "**/web-manifest.json",
      "/node_modules/"
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
    "**/index.html"
    // "**/node_modules/**"
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
