import { readFile } from "fs/promises";
import * as vscode from "vscode";
import { handleWebhint } from "../../library/handle-webhint";
import { handleIcons } from "../manifest/manifest-service";

let manifestContents: any | undefined;

/** Code that is used to associate diagnostic entries with code actions. */
export const MANI_CODE = "mani_code";

/** String to detect in the text document. */
const maniTestValues = [
  {
    name: "name",
    errorString: "name is required and should be a string with a length > 0",
    test: (value: string) => {
      console.log('value', value);
      return value && typeof(value) === "string" && value.length > 0;
    },
  },
  {
    name: "short_name",
    errorString:
      "short_name is required and should be a string with a length > 0",
    test: (value: string) => value && typeof(value) === "string" && value.length > 0,
  },
  {
    name: "description",
    errorString:
      "description is required and should be a string with a length > 0",
    test: (value: string) => value && typeof(value) === "string" && value.length > 0,
  },
  {
    name: "icons",
    errorString: "icons is required and should be an array with a length > 0",
    test: (value: string) =>
      value && Array.isArray(value) && value.length > 0 ? true : false,
  },
  {
    name: "display",
    errorString:
      "display is required and should be either fullscreen, standalone, minimal-ui, browser",
    test: (value: string) => {
      return ["fullscreen", "standalone", "minimal-ui", "browser"].includes(value);
    },
  },
  {
    name: "orientation",
    errorString:
      "orientation is required and should be either any, natural, landscape, landscape-primary, landscape-secondary, portrait, portrait-primary, portrait-secondary",
    test: (value: string) => {
      return isStandardOrientation(value);
    },
  },
  {
    name: "background_color",
    errorString: "background_color is required and should be a valid hex color",
    test: (value: string) => {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      return hexRegex.test(value);
    },
  },
  {
    name: "theme_color",
    errorString: "theme_color is required and should be a valid hex color",
    test: (value: string) => {
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      return hexRegex.test(value);
    },
  },
  {
    name: "start_url",
    errorString:
      "start_url is required and should be a string with a length > 0",
    test: (value: string) => value && typeof(value) === "string" && value.length > 0,
  },
];

/**
 * Analyzes the text document for problems.
 */
export function refreshDiagnostics(
  doc: vscode.TextDocument,
  emojiDiagnostics: vscode.DiagnosticCollection
): void {
  const diagnostics: vscode.Diagnostic[] = [];

  for (let lineIndex = 0; lineIndex < doc.lineCount; lineIndex++) {
    const lineOfText = doc.lineAt(lineIndex);
    maniTestValues.forEach((testValue) => {
      if (lineOfText.text.includes(testValue.name)) {
        let diagnostic = createDiagnostic(
          doc,
          lineOfText,
          lineIndex,
          testValue.name
        );
        if (diagnostic) {
          diagnostics.push(diagnostic);
        }
      }
    });
  }

  emojiDiagnostics.set(doc.uri, diagnostics);
}

function createDiagnostic(
  doc: vscode.TextDocument,
  lineOfText: vscode.TextLine,
  lineIndex: number,
  testString: string
): vscode.Diagnostic | undefined {
  // find where in the line of text the value is mentioned
  const index = lineOfText.text.indexOf(testString);

  // create range that represents, where in the document the word is
  const range = new vscode.Range(
    lineIndex,
    index,
    lineIndex,
    index + testString.length
  );

  // test
  let testResult = undefined;
  let test: any = undefined;
  let textToTest: any = undefined;
  maniTestValues.forEach((testValue) => {
    if (testValue.name === testString) {
      try {
        textToTest = JSON.parse(doc.getText());

        testResult = testValue.test(textToTest[testString]);
        test = testValue;
      }
      catch (err) {
        console.error("Could not parse JSON value", err);
      }
    }
  });

  if (testResult === false) {
    const diagnostic = new vscode.Diagnostic(
      range,
      `PWA Studio - ${testString}: ${test ? test.errorString : "Error"}`,
      vscode.DiagnosticSeverity.Error
    );
    diagnostic.code = MANI_CODE;
    return diagnostic;
  }

  return undefined;
}

export function subscribeToDocumentChanges(
  context: vscode.ExtensionContext,
  emojiDiagnostics: vscode.DiagnosticCollection
): void {
  if (vscode.window.activeTextEditor) {
    if (vscode.window.activeTextEditor.document.fileName.includes("json")) {
      refreshDiagnostics(
        vscode.window.activeTextEditor.document,
        emojiDiagnostics
      );
    }
  }
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor) {
        refreshDiagnostics(editor.document, emojiDiagnostics);
      }
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) =>
      refreshDiagnostics(e.document, emojiDiagnostics)
    )
  );

  context.subscriptions.push(
    vscode.workspace.onDidCloseTextDocument((doc) =>
      emojiDiagnostics.delete(doc.uri)
    )
  );
}

setupFileWatcher();

export async function handleValidation(
  context: vscode.ExtensionContext
): Promise<void> {
  vscode.window.showInformationMessage(
    "Lets validate your PWA and make sure its installable and Store Ready"
  );

  const answer = await vscode.window.showInformationMessage(
    "First, let's check your Web Manifest",
    {
      modal: true,
    },
    "OK"
  );

  if (!answer || answer !== "OK") {
    return;
  }

  // ask the user if they have a service worker with quickPick
  const maniQuestion = await vscode.window.showQuickPick(
    [
      {
        label: "Yes",
        description: "I have a Web Manifest",
      },
      {
        label: "No",
        description: "I don't have a Web Manifest",
      },
    ],
    {
      placeHolder: "Do you have a Web Manifest?",
      ignoreFocusOut: true,
      canPickMany: false,
    }
  );

  if (maniQuestion && maniQuestion.label === "Yes") {
    const manifestFile = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      title: "Select your Web Manifest file",
      filters: {
        JSON: ["json"],
      },
    });

    if (manifestFile) {
      manifestContents = await readFile(manifestFile[0].fsPath, "utf8");
      const results = await testManifest(manifestContents);

      await gatherResults(results, manifestFile, context);
    } else {
      await vscode.window.showErrorMessage("Please select a Web Manifest");
      return;
    }
  } else if (maniQuestion && maniQuestion.label === "No") {
    await vscode.commands.executeCommand("pwa-studio.manifest");
    return;
  }

  const swAnswer = await vscode.window.showInformationMessage(
    "Next, let's evaluate your Service Worker",
    {
      modal: true,
    },
    "OK"
  );

  if (!swAnswer || swAnswer !== "OK") {
    return;
  }

  // ask the user if they have a service worker with quickPick
  const swQuestion = await vscode.window.showQuickPick(
    [
      {
        label: "Yes",
        description: "I have a Service Worker",
      },
      {
        label: "No",
        description: "I don't have a Service Worker",
      },
    ],
    {
      placeHolder: "Do you have a Service Worker?",
      ignoreFocusOut: true,
      canPickMany: false,
    }
  );

  if (swQuestion && swQuestion.label === "Yes") {
    const swFile = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      title: "Select your Service Worker file",
      filters: {
        JavaScript: ["js"],
        TypeScript: ["ts"],
      },
    });

    if (swFile) {
      await vscode.window.showInformationMessage(
        "Awesome! Your PWA is installable and store ready!"
      );
    } else {
      vscode.window.showErrorMessage("Please select a Service Worker");
    }
  } else if (swQuestion && swQuestion.label === "No") {
    // execute a command to create a service worker
    await vscode.commands.executeCommand("pwa-studio.serviceWorker");
    return;
  }

  const runWebhintQuestion = await vscode.window.showQuickPick(
    [
      {
        label: "Yes",
        description: "I want to run Webhint",
      },
      {
        label: "No",
        description: "I don't want to run Webhint",
      },
    ],
    {
      placeHolder: "Run extra tests on your PWA using Webhint?",
      ignoreFocusOut: true,
      canPickMany: false,
    }
  );

  if (runWebhintQuestion && runWebhintQuestion.label === "Yes") {
    await handleWebhint();

    return;
  }
}

function setupFileWatcher(): void {
  const watcher = vscode.workspace.createFileSystemWatcher("**/manifest.json");

  watcher.onDidChange(async (manifestFile) => {
    manifestContents = await readFile(manifestFile.fsPath, "utf8");
    await testManifest(manifestContents);
    await vscode.commands.executeCommand("pwa-studio.refreshEntry");
  });
}

async function gatherResults(
  results: Array<any>,
  manifestFile: vscode.Uri[],
  context: vscode.ExtensionContext
): Promise<void> {
  const problems = results.filter(
    (r) => r.result === false && r.category === "required"
  );

  if (problems.length > 0) {
    const maniAnswer = await vscode.window.showInformationMessage(
      "Your Web Manifest is missing some required fields, should we add them?",
      {
        modal: true,
      },
      "OK"
    );

    if (!maniAnswer || maniAnswer !== "OK") {
      return;
    }

    // open manifestFile
    const editor = await vscode.window.showTextDocument(
      vscode.Uri.file(manifestFile[0].fsPath)
    );
    // open problems
    problems.forEach(async (problem) => {
      const end = editor.document.positionAt(
        editor.document.getText().lastIndexOf("}") - 1
      );

      await editor.insertSnippet(
        new vscode.SnippetString(
          `,"${problem.member}": "${problem.defaultValue}"`
        ),
        end
      );
    });

    if (manifestContents) {
      // check for a 512x512 icon in manifestFile
      const fiveTwelveCheck = JSON.parse(manifestContents).icons.forEach(
        (icon: any) => {
          if (icon.sizes === "512x512") {
            return icon;
          }
        }
      );

      if (!fiveTwelveCheck) {
        const iconAnswer = await vscode.window.showInformationMessage(
          "You are missing a 512x512 sized icon, lets generate one",
          {
            modal: true,
          },
          "OK"
        );

        if (iconAnswer && iconAnswer === "OK") {
          await handleIcons(context);

          return;
        }
      }
    }
  } else {
    await vscode.window.showInformationMessage(
      "Your Web Manifest looks great!",
      {
        modal: true,
      },
      "OK"
    );
  }
}

export async function testManifest(manifestFile: any): Promise<any[]> {
  const manifest = JSON.parse(manifestFile);

  return [
    {
      infoString: "Lists icons for add to home screen",
      result: manifest.icons && manifest.icons.length > 0 ? true : false,
      category: "required",
      member: "icons",
      defaultValue: [],
      docsLink: "https://developer.mozilla.org/en-US/docs/Web/Manifest/icons",
    },
    {
      infoString: "Contains name property",
      result: manifest.name && manifest.name.length > 1 ? true : false,
      category: "required",
      member: "name",
      defaultValue: "placeholder name",
      docsLink: "https://developer.mozilla.org/en-US/docs/Web/Manifest/name",
    },
    {
      infoString: "Contains short_name property",
      result:
        manifest.short_name && manifest.short_name.length > 1 ? true : false,
      category: "required",
      member: "short_name",
      defaultValue: "placeholder",
      docsLink:
        "https://developer.mozilla.org/en-US/docs/Web/Manifest/short_name",
    },
    {
      infoString: "Designates a start_url",
      result:
        manifest.start_url && manifest.start_url.length > 0 ? true : false,
      category: "required",
      member: "start_url",
      defaultValue: "/",
      docsLink:
        "https://developer.mozilla.org/en-US/docs/Web/Manifest/start_url",
    },
    {
      infoString: "Specifies a display mode",
      result:
        manifest.display &&
        ["fullscreen", "standalone", "minimal-ui", "browser"].includes(
          manifest.display
        )
          ? true
          : false,
      category: "recommended",
      member: "display",
      defaultValue: "standalone",
      docsLink: "https://developer.mozilla.org/en-US/docs/Web/Manifest/display",
    },
    {
      infoString: "Has a background color",
      result: manifest.background_color ? true : false,
      category: "recommended",
      member: "background_color",
      defaultValue: "black",
      docsLink:
        "https://developer.mozilla.org/en-US/docs/Web/Manifest/background_color",
    },
    {
      infoString: "Has a theme color",
      result: manifest.theme_color ? true : false,
      category: "recommended",
      member: "theme_color",
      defaultValue: "black",
      docsLink:
        "https://developer.mozilla.org/en-US/docs/Web/Manifest/theme_color",
    },
    {
      infoString: "Specifies an orientation mode",
      result:
        manifest.orientation && isStandardOrientation(manifest.orientation)
          ? true
          : false,
      category: "recommended",
      member: "orientation",
      defaultValue: "any",
      docsLink:
        "https://developer.mozilla.org/en-US/docs/Web/Manifest/orientation",
    },
    {
      infoString: "Contains screenshots for app store listings",
      result:
        manifest.screenshots && manifest.screenshots.length > 0 ? true : false,
      category: "recommended",
      member: "screenshots",
      defaultValue: [],
      docsLink:
        "https://developer.mozilla.org/en-US/docs/Web/Manifest/screenshots",
    },
    {
      infoString: "Lists shortcuts for quick access",
      result:
        manifest.shortcuts && manifest.shortcuts.length > 0 ? true : false,
      category: "recommended",
      member: "shortcuts",
      defaultValue: [],
      docsLink:
        "https://developer.mozilla.org/en-US/docs/Web/Manifest/shortcuts",
    },
    {
      infoString: "Icons specify their type",
      result: !!manifest.icons && manifest.icons.every((i: any) => !!i.type),
      category: "recommended",
      docsLink: "https://developer.mozilla.org/en-US/docs/Web/Manifest/icons",
    },
    {
      infoString: "Icons specify their size",
      result: !!manifest.icons && manifest.icons.every((i: any) => !!i.sizes),
      category: "recommended",
      docsLink: "https://developer.mozilla.org/en-US/docs/Web/Manifest/icons",
    },
    {
      infoString: "Contains an IARC ID",
      result: manifest.iarc_rating_id ? true : false,
      category: "optional",
      member: "iarc_rating_id",
      defaultValue: "",
      docsLink:
        "https://developer.mozilla.org/en-US/docs/Web/Manifest/iarc_rating_id",
    },
    {
      infoString: "Specifies related_applications",
      result:
        manifest.related_applications &&
        manifest.related_applications.length > 0
          ? true
          : false,
      category: "optional",
      member: "related_applications",
      defaultValue: [],
      docsLink:
        "https://developer.mozilla.org/en-US/docs/Web/Manifest/related_applications",
    },
  ];
}

function containsStandardCategory(categories: string[]): boolean {
  // https://github.com/w3c/manifest/wiki/Categories
  const standardCategories = [
    "books",
    "business",
    "education",
    "entertainment",
    "finance",
    "fitness",
    "food",
    "games",
    "government",
    "health",
    "kids",
    "lifestyle",
    "magazines",
    "medical",
    "music",
    "navigation",
    "news",
    "personalization",
    "photo",
    "politics",
    "productivity",
    "security",
    "shopping",
    "social",
    "sports",
    "travel",
    "utilities",
    "weather",
  ];
  return categories.some((c) => standardCategories.includes(c));
}

function isStandardOrientation(orientation: string): boolean {
  const standardOrientations = [
    "any",
    "natural",
    "landscape",
    "landscape-primary",
    "landscape-secondary",
    "portrait",
    "portrait-primary",
    "portrait-secondary",
  ];
  return standardOrientations.includes(orientation);
}

export async function handleManiDocsCommand(event: any): Promise<void> {
  // open docs link
  if (event.label === "Installable" || event.label === "Uninstallable") {
    vscode.env.openExternal(
      vscode.Uri.parse(
        "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Installable_PWAs"
      )
    );
  }

  if (event && event.docsLink && event.docsLink.length > 0) {
    vscode.env.openExternal(event.docsLink);
  }
}
