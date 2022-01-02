import * as vscode from "vscode";
import { storageManager } from "../extension";

let url: string | undefined = undefined;

export function getURL(): string | undefined {
  const urlData = storageManager?.getValue<any>("url");
  return urlData?.url;
}

export async function askForUrl() {
  // ask if user has a url
  const pwaUrlQuestion = await vscode.window.showQuickPick(["Yes", "No"], {
    placeHolder: "Have you published your PWA to the web?",
  });

  if (pwaUrlQuestion !== undefined && pwaUrlQuestion === "Yes") {
    // ask for url
    url = await vscode.window.showInputBox({
      prompt: "What is the URL to your PWA?",
      placeHolder: "https://webboard.app",
    });

    if (url && url.length > 0) {
      storageManager?.setValue<any>("urlData", {
        url: url,
      });
    }
  } else {
    // let user know they need to publish their PWA
    // and open docs
    await vscode.window.showInformationMessage(
      "You need to publish your PWA to the web.",
      {
        modal: true,
      },
      {
        title: "Learn How",
        action: async () => {
          await vscode.env.openExternal(
            vscode.Uri.parse(
              "https://github.com/pwa-builder/pwa-starter/wiki/Deploying-to-the-Web-Azure-Static-Web-Apps"
            )
          );
        },
      },
      {
        title: "OK",
      }
    );
  }
}
