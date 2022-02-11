import * as vscode from "vscode";
import { getUri } from "../utils";

export class HelpViewPanel {
  public static currentPanel: HelpViewPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;

    this._panel.onDidDispose(this.dispose, null, this._disposables);

    this._panel.webview.html = this._getWebviewContent(
      this._panel.webview,
      extensionUri
    );

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      async (message) => {
          if (message.command === "generate") {
              vscode.commands.executeCommand("pwa-studio.manifest");
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

    const imageUri = getUri(webview, extensionUri, [
      "src",
      "views",
      "icons-everywhere.png",
    ]);

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="https://glitch.com/favicon.ico" />

    <title>PWA Studio Help</title>

    <script type="module" src="${toolkitUri}"></script>

    <!-- Ionicons Import -->
    <script src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js"></script>
  </head>
  <body>
    <div id="central">
      <div id="submit-block">
        <h1>Help</h1>
        <vscode-button id="submit">Open Full Documentation</vscode-button>
      </div>

      <main>

      <vscode-panels>
            <vscode-panel-tab id="tab-1">
                General
            </vscode-panel-tab>
            <vscode-panel-tab id="tab-2">
                Web Manifest
            </vscode-panel-tab>
            <vscode-panel-tab id="tab-3">
                Service Workers
            </vscode-panel-tab>
            <vscode-panel-tab id="tab-4">
                PWA Studio
            </vscode-panel-tab>

            <!-- general panel -->
         <vscode-panel-view id="view-1">
           <section class="container">
            <h2>What is a Progressive Web App?</h2>
            <p>
                A Progressive Web App, or PWA for short, is a high quality web application that makes use of web technologies like Web Manifests and Service Worker
                to provide an app-like experience delivered over the web. Because PWAs are Apps, they can be installed from the browser AND app stores such as the Microsoft Store and Google Play Store!
            </p>

            <h2>Useful Links</h2>
            <ul>
                <li>
                <vscode-link href="https://docs.microsoft.com/microsoft-edge/progressive-web-apps-chromium/">Visit the Edge PWA Documentation</vscode-link>
                </li>

                <li>
                <vscode-link href="https://aka.ms/pwa-studio-docs">Visit the PWA Studio Documentation</vscode-link>
                </li>

                <li>
                <vscode-link href="https://docs.pwabuilder.com">Visit the PWABuilder Documentation</vscode-link>
                </li>
            </ul>

            <vscode-link href="https://github.com/pwa-builder/PWABuilder/issues/new/choose">Found an issue with PWA Studio? Open an issue on Github</vscode-link>
           </section>
         </vscode-panel-view>

         <!-- manifest panel -->
         <vscode-panel-view id="view-2">
           <section class="container">
              <h2>What is a Web Manifest?</h2>

              <p>
                A Web App Manifest of a website governs how your Progressive Web App (PWA) looks and behaves when installed on a device. 
                The Web App Manifest provides information such as the name of your app, the file location of icons that represent your app in system menus, 
                and the theme colors that the operating system (OS) uses in the title bar. <vscode-link href="https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/web-app-manifests">Learn more about Web Manifests</vscode-link>
              </p>

              <vscode-button id="generate">Generate a Web Manifest</vscode-button>

              <div id="side-by-side">
                <div id="example-side">
                <vscode-tag style="width: 36em;">All the places in Windows that your Web Manifest assets are used</vscode-tag>
                <img style="width: 30.5em;" src="${imageUri}" alt="Showing all the different places your icons are used in Windows">
                </div>

                <div>
                <h2>Manifest Properties Library</h2>
                <ul>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/background_color">background_color</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/categories">categories</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/description">description</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/dir">dir</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/display">display</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/display_override">display_override</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/iarc_rating_id">iarc_rating_id</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/icons">icons</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/lang">lang</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/name">name</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/orientation">orientation</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/prefer_related_applications">prefer_related_applications</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/protocol_handlers">protocol_handlers</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/related_applications">related_applications</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/scope">scope</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/screenshots">screenshots</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/short_name">short_name</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/shortcuts">shortcuts</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/start_url">start_url</vscode-link></li>
                    <li><vscode-link href="https://developer.mozilla.org/docs/Web/Manifest/theme_color">theme_color</vscode-link></li>
                </ul>
                </div>
              </div>
           </section>
         </vscode-panel-view>

         <!-- service worker -->
         <vscode-panel-view id="view-3">
           <h2>What is a Service Worker?</h2>

           <p>
             Service Workers are a special type of Web Worker with the ability to intercept, modify, and respond to all network requests using the Fetch API. 
             Service Workers can access the Cache API, and asynchronous client-side data stores, such as IndexedDB, to store resources.
           </p>
         </vscode-panel-view>


         <vscode-panel-view id="view-4"> Terminal Content </vscode-panel-view>
       </vscode-panels>
      </main>

    </div>
    <script>
      const vscode = acquireVsCodeApi();

      document.querySelector("#generate").addEventListener("click", () => {
          vscode.postMessage({
                command: 'generate'
            });
      })

      let file = undefined;
      document.querySelector("#file_input").addEventListener("change", (ev) => {
        file = ev.target.files[0];
      });
    </script>
  </body>
  <style>
    body.vscode-light {
      color: black;
    }

    body.vscode-dark label {
      color: white;
    }

    #side-by-side {
        display: flex;
    align-items: baseline;
    justify-content: left;
    column-gap: 11em;
    }

    #generate {
        width: 14em;
    }

    #example-side {
        display: flex;
    flex-direction: column;
    margin-top: 1em;
    }

    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .container ul {
        margin-left: 0;
        margin-block-start: 0;
        padding-left: 0;
    }

    .container p {
        max-width: 29em;
    }

    #file_input {
      display: block;
      height: 2em;
      width: 14em;
    }

    #central {
      padding: 1em;
      font-family: sans-serif;
    }

    #manifest-options {
      display: flex;
      flex-direction: column;
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
      width: 200px;
      background-color: #f8f8f8;
      color: black;
      text-align: center;
      border-radius: 6px;
      padding: 5px;
      /* Position the tooltip */
      position: absolute;
      top: 0px;
      right: 65%;
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

    #bottom-four {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 20px;
    }

    .color {
      display: flex;
      flex-direction: column;
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

      position: sticky;
      top: 0;
      z-index: 9;
      background: #1e1e1e;
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
    if (HelpViewPanel.currentPanel) {
      HelpViewPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
      const panel = vscode.window.createWebviewPanel(
        "helpview",
        "Help and More Info",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      HelpViewPanel.currentPanel = new HelpViewPanel(panel, extensionUri);
    }
  }

  public dispose() {
    HelpViewPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }
}
