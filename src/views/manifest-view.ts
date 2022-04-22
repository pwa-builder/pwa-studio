import { writeFile } from "fs/promises";
import * as vscode from "vscode";
import {
  convertBaseToFile,
  findManifest,
} from "../services/manifest/manifest-service";
import { captureUsage } from "../services/usage-analytics";
import { getUri } from "../utils";

export class ManiGenerationPanel {
  public static currentPanel: ManiGenerationPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;

    this._panel.onDidDispose(this.dispose, null, this._disposables);

    this._panel.webview.html = this._getWebviewContent(
      this._panel.webview,
      extensionUri
    );

    let iconsObject: any;
    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      async (message) => {
        switch (message.command) {
          case "prompt":
            iconsObject = message.iconsObject
              ? message.iconsObject.icons
              : message.manifestObject.icons;

            if (message.iconsObject) {
              captureUsage("generate-icons");
            } else {
              captureUsage("generate-manifest");
            }

            if (message.manifestObject && iconsObject) {
              const newIconsData = await convertBaseToFile(iconsObject);

              // add icons to manifest
              message.manifestObject.icons = newIconsData.icons;

              // ask user where they would like to save their manifest
              const uri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file(
                  `${vscode.workspace.workspaceFolders?.[0].uri.fsPath}/manifest.json`
                ),
                saveLabel: "Save Web Manifest",
              });

              if (uri) {
                // write manifest file
                await writeFile(
                  uri.fsPath,
                  JSON.stringify(message.manifestObject, null, 2)
                );

                // show manifest with vscode
                await vscode.window.showTextDocument(uri);

                // do refreshPackageView command
                await vscode.commands.executeCommand("pwa-studio.refreshEntry");
              }
            } else {
              vscode.window.showErrorMessage(
                "There was an error generating your manifest. Please try again."
              );
            }

            return;
        }
      },
      undefined,
      this._disposables
    );
  }

  private _getWebviewContent(
    webview: vscode.Webview,
    extensionUri: vscode.Uri
  ) {
    const toolkitUri = getUri(webview, extensionUri, [
      "node_modules",
      "@vscode",
      "webview-ui-toolkit",
      "dist",
      "toolkit.js",
    ]);

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
    
        <title>PWA VSCode Extension Manifest Form</title>

        <script type="module" src="${toolkitUri}"></script>
    
        <!-- Ionicons Import -->
        <script src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js"></script>
      </head>
      <body>
        <div id="central">

          <form onsubmit="handleSubmit(event)" id="manifest-options">
            <div id="submit-block">
              <h1>Generate a Web Manifest</h1>

              <button type="submit">Submit Manifest Options</button>
            </div>

            <div id="first-six">
              <div class="six">
                <label for="dir">Dir:</label>
                <div class="input-area">
                  <vscode-dropdown name="dir" id="dir" required>
                    <vscode-option value="auto" selected>auto</vscode-option>
                    <vscode-option value="ltr">ltr</vscode-option>
                    <vscode-option value="rtl">rtl</vscode-option>
                  </vscode-dropdown>
                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir"
                    target="_blank"
                    rel="noopener"
                  >
                    <ion-icon name="information-circle-outline"></ion-icon>
                    <p class="toolTip">
                      Click for more info on the dir option in your manifest.
                    </p>
                  </a>
                </div>
              </div>
    
              <div class="six">
                <label for="display">Display:</label>
                <div class="input-area">
                  <vscode-dropdown name="display" id="display" required>
                    <vscode-option value="fullscreen">fullscreen</vscode-option>
                    <vscode-option value="standalone" selected>standalone</vscode-option>
                    <vscode-option value="minimal-ui">minimal-ui</vscode-option>
                    <vscode-option value="browser">browser</vscode-option>
                  </vscode-dropdown>
                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/Manifest/display"
                    target="_blank"
                    rel="noopener"
                  >
                    <ion-icon name="information-circle-outline"></ion-icon>
                    <p class="toolTip">
                      Click for more info on the dir option in your manifest.
                    </p>
                  </a>
                </div>
              </div>
    
              <div class="six">
                <label for="name">Name:</label>
                <div class="input-area">
   
                  <vscode-text-field 
                    type="text"
                    name="name"
                    id="name"
                    value="placeholder"
                    required></vscode-text-field>

                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/Manifest/name"
                    target="_blank"
                    rel="noopener"
                  >
                    <ion-icon name="information-circle-outline"></ion-icon>
                    <p class="toolTip">
                      Click for more info on the name option in your manifest.
                    </p>
                  </a>
                </div>
              </div>
    
              <div class="six">
                <label for="short_name">Short Name:</label>
                <div class="input-area">

                  <vscode-text-field 
                    type="text"
                    name="short_name"
                    id="short_name"
                    value="placeholder"
                    required></vscode-text-field>

                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/Manifest/short_name"
                    target="_blank"
                    rel="noopener"
                  >
                    <ion-icon name="information-circle-outline"></ion-icon>
                    <p class="toolTip">
                      Click for more info on the short name option in your manifest.
                    </p>
                  </a>
                </div>
              </div>
    
              <div class="six">
                <label for="scope">Scope:</label>
                <div class="input-area">
                  <vscode-text-field type="text" name="scope" id="scope" value="/" required></vscode-text-field>
                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/Manifest/scope"
                    target="_blank"
                    rel="noopener"
                  >
                    <ion-icon name="information-circle-outline"></ion-icon>
                    <p class="toolTip">
                      Click for more info on the scope option in your manifest.
                    </p>
                  </a>
                </div>
              </div>
    
              <div class="six">
                <label for="start_url">Start Url:</label>
                <div class="input-area">
                  <vscode-text-field
                    type="text"
                    name="start_url"
                    id="start_url"
                    value="/"
                    required
                  ></vscode-text-field>
                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/Manifest/start_url"
                    target="_blank"
                    rel="noopener"
                  >
                    <ion-icon name="information-circle-outline"></ion-icon>
                    <p class="toolTip">
                      Click for more info on the start url option in your manifest.
                    </p>
                  </a>
                </div>
              </div>
    
              <div class="six">
                <label for="lang">Default Language:</label>
                <div class="input-area">
                  <vscode-text-field type="text" name="lang" id="lang" value="en" required ></vscode-text-field>
                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/Manifest/lang"
                    target="_blank"
                    rel="noopener"
                  >
                    <ion-icon name="information-circle-outline"></ion-icon>
                    <p class="toolTip">
                      Click for more info on the language option in your manifest.
                    </p>
                  </a>
                </div>
              </div>
    
              <div class="six">
                <label for="file_input">Choose a 512x512 icon:</label>
                <div class="input-area">
                  <input type="file" name="file_input" id="file_input" accept="image/png, image/jpeg" required />
    
                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/Manifest/icons"
                    target="_blank"
                    rel="noopener"
                  >
                    <ion-icon name="information-circle-outline"></ion-icon>
                    <p class="toolTip">
                      Click for more info on icons your manifest.
                    </p>
                  </a>
                </div>
              </div>
            </div>
    
            <div id="desc-box">
              <label for="description">Description:</label>
              <div class="input-area">
                <vscode-text-area
                  type="text"
                  name="description"
                  id="description"
                  rows="3"
                  cols="60"
                  required
                >
    placeholder description</vscode-text-area
                >
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/Manifest/description"
                  target="_blank"
                  rel="noopener"
                >
                  <ion-icon name="information-circle-outline"></ion-icon>
                  <p class="toolTip">
                    Click for more info on the description option in your manifest.
                  </p>
                </a>
              </div>
            </div>
    
            <div id="bottom-four">
              <div class="color">
                <label for="theme_color">Theme Color:</label>
                <div class="input-area">
                  <input
                    type="color"
                    name="theme_color"
                    id="theme_color"
                    required
                  />
                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/Manifest/theme_color"
                    target="_blank"
                    rel="noopener"
                  >
                    <ion-icon name="information-circle-outline"></ion-icon>
                    <p class="toolTip">
                      Click for more info on the theme color option in your
                      manifest.
                    </p>
                  </a>
                </div>
              </div>
    
              <div class="color">
                <label for="background_color">Background Color:</label>
                <div class="input-area">
                  <input
                    type="color"
                    name="background_color"
                    id="background_color"
                    required
                  />
                  <a
                    href="https://developer.mozilla.org/en-US/docs/Web/Manifest/background_color"
                    target="_blank"
                    rel="noopener"
                  >
                    <ion-icon name="information-circle-outline"></ion-icon>
                    <p class="toolTip">
                      Click for more info on the background color option in your
                      manifest.
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
        <script>
          let file = undefined;
          document.querySelector("#file_input").addEventListener("change", (ev) => {
            file = ev.target.files[0];
          });
    
          async function generateIcons() {
            return new Promise(async (resolve, reject) => {
              const url =
              "https://appimagegenerator-prod.azurewebsites.net/api/image/base64";
    
            const form = new FormData();
            form.append("baseImage", file);
            form.append("platform", "windows10");
            form.append("platform", "android");
            form.append("platform", "ios");
            form.append("colorChanged", "false");
            form.append("padding", "0");

            try {
              const response = await fetch(url, {
                method: "POST",
                body: form,
              });
    
              const data = await response.json();
    
              resolve(data);
            } catch (err) {
              console.error("error", err);
              reject(err);
            }
            });
          }
    
          async function handleSubmit(event) {
            event.preventDefault();

            let dir = document.getElementById("dir").value;
            let display = document.getElementById("display").value;
            let name = document.getElementById("name").value;
            let short_name = document.getElementById("short_name").value;
            let lang = document.getElementById("lang").value;
            let start_url = document.getElementById("start_url").value;
            let scope = document.getElementById("scope").value;
            let desc = document.getElementById("description").value;
            let theme_color = document.getElementById("theme_color").value;
            let background_color =
              document.getElementById("background_color").value;

            document.querySelector("#submit").innerText = "Generating...";
    
            const icons = await generateIcons();

            document.querySelector("#submit").innerText = "Submit Manifest Options";
    
            let maniObj = {
              dir: dir,
              display: display,
              name: name,
              short_name: short_name,
              start_url: start_url,
              scope: scope,
              lang: lang,
              description: desc,
              theme_color: theme_color,
              background_color: background_color,
              icons: icons ? icons : []
            };
    
            const vscode = acquireVsCodeApi();
            vscode.postMessage({
              command: "prompt",
              text: "Your manifest has been created and added to your project.",
              manifestObject: maniObj,
            });

            event.preventDefault();
          }
        </script>
      </body>
      <style>
        body.vscode-light {
          color: black;
        }
    
        body.vscode-dark label {
          color: white;
        }
    
        #central {
          padding: 1em;
          font-family: sans-serif;

          margin-left: 2em;
          margin-right: 2em;
        }
    
        #manifest-options {
          display: flex;
          flex-direction: column;
        }

        .color input {
          width: 10em;
          border: none;
          background: transparent;
        }
    
        .input-area {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
    
        #first-six {
          display: grid;
          grid-template-columns: auto auto;
          grid-gap: 20px;
          margin: 20px 0;
        }
    
        .six {
          display: flex;
          flex-direction: column;
        }
    
        .toolTip {
          visibility: hidden;
          width: 160px;
          background-color: #f8f8f8;
          color: black;
          text-align: center;
          border-radius: 6px;
          padding: 5px;
          /* Position the tooltip */
          position: absolute;
          top: 0px;
          left: 70%;
          z-index: 1;
        }
    
        .input-area a {
          position: relative;
        }
    
        a:hover .toolTip {
          visibility: visible;
        }
    
        label {
          margin-bottom: 6px;
          font-size: 16px;
          color: black;
    
          font-weight: bold;
        }
    
        input {
          border-radius: 4px;
          box-sizing: border-box;
          border: 1px solid #a8a8a8;
          height: 38px;
          width: 95%;
          font-size: 14px;
          text-indent: 10px;
          color: black;
        }
    
        #file_input {
          border: none;
          color: currentColor;

          width: 12em;
        }
    
        select {
          border-radius: 4px;
          box-sizing: border-box;
          border: 1px solid #a8a8a8;
          height: 38px;
          width: 95%;
          font-size: 14px;
          text-indent: 10px;
        }
    
        textarea {
          margin-top: 6px;
          margin-bottom: 20px;
          border-radius: 4px;
          box-sizing: border-box;
          border: 1px solid #a8a8a8;
          height: 38px;
          width: 100%;
          font-size: 14px;
          text-indent: 10px;
          color: black;
          width: 45%;
        }
    
        #icon {
          padding: 1px;
        }
    
        .color {
          display: flex;
          flex-direction: column;

          margin-top: 1em;
        }
    
        #icon {
          border: none;
          text-indent: 0;
          margin-top: 6px;
          height: max-content;
        }
    
        #bottom-four button {
          font-size: 16px;
          font-weight: bolder;
          padding: 20px 10px;
    
          border-radius: 30px;
          border: none;
    
          height: 75%;
    
          display: flex;
          align-items: center;
          justify-content: center;
        }
    
        #bottom-four button:hover {
          cursor: pointer;
        }
    
        #submit-block {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2em;

          z-index: 9;
          height: 100%;
          padding-top: 10px;

          border-bottom: solid 1px darkgrey;
          padding-bottom: 10px;
        }

        #submit-block h1 {
          font-size: 16px;
          margin-top: 0;
          margin-bottom: 0;
        }
    
        #submit-block button {
          background: #487cf1;
          color: white;
          border: none;
          padding: 12px;
          font-size: 1.1em;
          border-radius: 4px;
          cursor: pointer;
        }
    
        ion-icon {
          margin-left: 10px;
          font-size: 24px;
        }
    
        ion-icon:hover {
          cursor: pointer;
        }
    
        a:visited {
          color: black;
        }
      </style>
    </html>
    `;
  }

  public static render(extensionUri: vscode.Uri) {
    if (ManiGenerationPanel.currentPanel) {
      ManiGenerationPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
      const panel = vscode.window.createWebviewPanel(
        "manifestview",
        "Web Manifest",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      ManiGenerationPanel.currentPanel = new ManiGenerationPanel(
        panel,
        extensionUri
      );
    }
  }

  public dispose() {
    ManiGenerationPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}
