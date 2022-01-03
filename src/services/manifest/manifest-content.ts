export function getWebviewContent() {
  return `
	<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="https://glitch.com/favicon.ico" />

    <title>PWA VSCode Extension Manifest Form</title>

    <!-- Ionicons Import -->
    <script src="https://unpkg.com/ionicons@4.5.10-0/dist/ionicons.js"></script>
  </head>
  <body>
    <div id="central">
      <form id="manifest-options" onsubmit="handleSubmit(event)">
        <div id="first-six">
          <div class="six">
            <label for="dir">Dir:</label>
            <div class="input-area">
              <select name="dir" id="dir" required>
                <option value="auto" selected>auto</option>
                <option value="ltr">ltr</option>
                <option value="rtl">rtl</option>
              </select>
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
              <select name="display" id="display" required>
                <option value="fullscreen">fullscreen</option>
                <option value="standalone" selected>standalone</option>
                <option value="minimal-ui">minimal-ui</option>
                <option value="browser">browser</option>
              </select>
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
              <input
                type="text"
                name="name"
                id="name"
                value="placeholder"
                required
              />
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir"
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
              <input
                type="text"
                name="short_name"
                id="short_name"
                value="placeholder"
                required
              />
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir"
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
              <input type="text" name="scope" id="scope" value="/" required />
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir"
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
              <input
                type="text"
                name="start_url"
                id="start_url"
                value="/"
                required
              />
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir"
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
              <input type="text" name="lang" id="lang" value="en" required />
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir"
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
        </div>

        <div id="desc-box">
          <label for="description">Description:</label>
          <div class="input-area">
            <textarea
              type="text"
              name="description"
              id="description"
              rows="3"
              cols="60"
              required
            >
placeholder description</textarea
            >
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir"
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
                href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir"
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
                href="https://developer.mozilla.org/en-US/docs/Web/Manifest/dir"
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

        <div id="submit-block">
          <button id="submit" type="submit">Submit Manifest Options</button>
        </div>
      </form>
    </div>
    <script>
      function handleSubmit() {
        let dir = document.getElementById("dir").value;
        let display = document.getElementById("display").value;
        let name = document.getElementById("name").value;
        let short_name = document.getElementById("short_name").value;
        let lang = document.getElementById("lang").value;
        let start_url = document.getElementById("start_url").value;
        let scope = document.getElementById("scope").value;
        let desc = document.getElementById("description").value;
        let theme_color = document.getElementById("theme_color").value;
        let background_color = document.getElementById("background_color")
          .value;

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
          icons: [
            {
              src: "/pwabuilder-icons/512x512.png",
              sizes: "512x512",
              type: "image/png"
            }
          ]
        };

        const vscode = acquireVsCodeApi();
        vscode.postMessage({
          command: "prompt",
          text: "Your manifest has been created and added to your project.",
          manifestObject: maniObj
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
      background-color: #F8F8F8;
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
      border: 1px solid #A8A8A8;
      height: 38px;
      width: 95%;
      font-size: 14px;
      text-indent: 10px;
      color: black;
    }

    select {
      border-radius: 4px;
      box-sizing: border-box;
      border: 1px solid #A8A8A8;
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
      border: 1px solid #A8A8A8;
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
      justify-content: flex-end;
      align-items: center;
      margin-top: 2em;
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
