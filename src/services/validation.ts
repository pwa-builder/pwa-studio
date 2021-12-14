import { readFile } from "fs/promises";
import * as vscode from "vscode";

export async function handleValidation() {
  vscode.window.showInformationMessage(
    "Lets validate your PWA and make sure its installable and Store Ready"
  );

  const answer = await vscode.window.showInformationMessage("First, let's check your Web Manifest", {
    modal: true
  }, "OK");

  if (!answer || answer !== "OK") {
    return;
  }

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
    const manifestContents = await readFile(manifestFile[0].fsPath, "utf8");
    const results = await testManifest(manifestContents);

    await gatherResults(results, manifestFile);
  } else {
    await vscode.window.showErrorMessage("Please select a Web Manifest");
    return;
  }

  const swAnswer = await vscode.window.showInformationMessage(
    "Next, let's evaluate your Service Worker",
    {
      modal: true
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
      await vscode.window.showInformationMessage("Awesome! Your PWA is installable and store ready!");
    } else {
      vscode.window.showErrorMessage("Please select a Service Worker");
    }
  }
  else if (swQuestion && swQuestion.label === "No") {
    // execute a command to create a service worker
    await vscode.commands.executeCommand("pwa-studio.serviceWorker");
    return;
  }
}

async function gatherResults(results: Array<any>, manifestFile: vscode.Uri[]) {
  const problems = results.filter(
    (r) => r.result === false && r.category === "required"
  );

  if (problems.length > 0) {
    const maniAnswer = await vscode.window.showInformationMessage("Your Web Manifest is missing some required fields, should we add them?", {
      modal: true
    }, "OK");

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
  }
  else {
    await vscode.window.showInformationMessage("Your Web Manifest looks great!", {
      modal: true
    }, "OK");
  }
}

async function testManifest(manifestFile: any): Promise<any[]> {
  const manifest = JSON.parse(manifestFile);

  return [
    {
      infoString: "Lists icons for add to home screen",
      result: manifest.icons && manifest.icons.length > 0 ? true : false,
      category: "required",
      member: "icons",
      defaultValue: [],
    },
    {
      infoString: "Contains name property",
      result: manifest.name && manifest.name.length > 1 ? true : false,
      category: "required",
      member: "name",
      defaultValue: "placeholder name",
    },
    {
      infoString: "Contains short_name property",
      result:
        manifest.short_name && manifest.short_name.length > 1 ? true : false,
      category: "required",
      member: "short_name",
      defaultValue: "placeholder",
    },
    {
      infoString: "Designates a start_url",
      result:
        manifest.start_url && manifest.start_url.length > 0 ? true : false,
      category: "required",
      member: "start_url",
      defaultValue: "/",
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
    },
    {
      infoString: "Has a background color",
      result: manifest.background_color ? true : false,
      category: "recommended",
      member: "background_color",
      defaultValue: "black",
    },
    {
      infoString: "Has a theme color",
      result: manifest.theme_color ? true : false,
      category: "recommended",
      member: "theme_color",
      defaultValue: "black",
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
    },
    {
      infoString: "Contains screenshots for app store listings",
      result:
        manifest.screenshots && manifest.screenshots.length > 0 ? true : false,
      category: "recommended",
      member: "screenshots",
      defaultValue: [],
    },
    {
      infoString: "Lists shortcuts for quick access",
      result:
        manifest.shortcuts && manifest.shortcuts.length > 0 ? true : false,
      category: "recommended",
      member: "shortcuts",
      defaultValue: [],
    },
    {
      infoString: "Contains categories to classify the app",
      result:
        manifest.categories &&
        manifest.categories.length > 0 &&
        containsStandardCategory(manifest.categories)
          ? true
          : false,
      category: "recommended",
      member: "categories",
      defaultValue: [],
    },
    {
      infoString: "Icons specify their type",
      result: !!manifest.icons && manifest.icons.every((i: any) => !!i.type),
      category: "recommended",
    },
    {
      infoString: "Icons specify their size",
      result: !!manifest.icons && manifest.icons.every((i: any) => !!i.sizes),
      category: "recommended",
    },
    {
      infoString: "Contains an IARC ID",
      result: manifest.iarc_rating_id ? true : false,
      category: "optional",
    },
    {
      infoString: "Specifies related_applications",
      result:
        manifest.related_applications &&
        manifest.related_applications.length > 0
          ? true
          : false,
      category: "optional",
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

function isStandardOrientation(orientation: string) {
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
