import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import { generateManifest } from "../../services/manifest/manifest-service";

// set up globals needed for tests
const testManifest = {
  "dir": "ltr",
  "lang": "en",
  "name": "Webboard",
  "scope": "/",
  "display": "standalone",
  "start_url": "/",
  "short_name": "Webboard",
  "theme_color": "#FFFFFF",
  "description": "Enhance your work day and solve your cross platform whiteboarding needs with webboard! Draw text, shapes, attach images and more and share those whiteboards with anyone through OneDrive!",
  "orientation": "any",
  "background_color": "#FFFFFF",
  "related_applications": [],
  "prefer_related_applications": false,
  "screenshots": [
    {
      "src": "assets/screen.png"
    },
    {
      "src": "assets/screen.png"
    },
    {
      "src": "assets/screen.png"
    }
  ],
  "features": [
    "Cross Platform",
    "low-latency inking",
    "fast",
    "useful AI"
  ],
  "shortcuts": [
    {
      "name": "Start Live Session",
      "short_name": "Start Live",
      "description": "Jump direction into starting or joining a live session",
      "url": "/?startLive",
      "icons": [{ "src": "icons/android/maskable_icon_192.png", "sizes": "192x192" }]
    }
  ],
  "icons": [
    {
      "src": "icons/android/android-launchericon-64-64.png",
      "sizes": "64x64"
    },
    {
      "src": "icons/android/maskable_icon_192.png",
      "sizes": "192x192",
      "purpose": "maskable"
    },
    {
      "src": "icons/android/android-launchericon-48-48.png",
      "sizes": "48x48"
    },
    {
      "src": "icons/android/android-launchericon-512-512.png",
      "sizes": "512x512"
    },
    {
      "src": "icons/android/android-launchericon-28-28.png",
      "sizes": "28x28"
    }
  ]
};

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Sample test", () => {
    assert.strictEqual([1, 2, 3].indexOf(5), -1);
    assert.strictEqual([1, 2, 3].indexOf(0), -1);
  });

  test("generate manifest", async () => {
    // call a command that will generate a manifest
    // initial uri to project root
    // get current vscode extension context
    await vscode.extensions.getExtension("PWABuilder.pwa-studio")?.activate();

    const uri = vscode.Uri.file(__dirname + "/../../../manifest.json");
    console.log(uri);
    const generatedManifest = await generateManifest(uri);

    // assert that the manifest is not empty
    assert.notStrictEqual(generatedManifest, "");
  });
});
