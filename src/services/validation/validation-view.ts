import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { readFile } from "fs/promises";
import { testManifest } from "./validation";

export class PWAValidationProvider implements vscode.TreeDataProvider<any> {
  constructor(private workspaceRoot: string) {}

  getTreeItem(element: ValidationItem): vscode.TreeItem {
    return element;
  }

  async getChildren(
    element?: ValidationItem
  ): Promise<ValidationItem[] | undefined> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("No Validations in empty workspace");
      return Promise.resolve([]);
    }

    // search for a manifest file in the root of the workspace
    const manifestPath = path.join(this.workspaceRoot, "manifest.json");
    const manifestExists = this.pathExists(manifestPath)

    if (element && manifestPath && manifestExists) {
        if (manifestPath) {
          const manifestContents = await readFile(manifestPath, "utf8");
          console.log("manifestContents", manifestContents);
          const testResults = await testManifest(manifestContents);
          console.log("testResults", testResults);

          return Promise.resolve(
            this.handleTestResults(
              testResults,
              vscode.TreeItemCollapsibleState.None,
              true
            )
          );
        }
    } else if (manifestPath && manifestExists) {
      // search for a manifest file in the root of the workspace
      const manifestPath = path.join(this.workspaceRoot, "manifest.json");
      if (this.pathExists(manifestPath)) {
        if (manifestPath) {
          const manifestContents = await readFile(manifestPath, "utf8");
          console.log("manifestContents", manifestContents);

          const testResults = await testManifest(manifestContents);

          let requiredTestsFailed: any = [];

          testResults.map((result) => {
            // console.log('result', result);
            if (result.category === "required" && result.result === false) {
              requiredTestsFailed.push(result);
            }
          });

          return Promise.resolve(
            this.handleTestResults(
              [
                {
                  // infoString has checkmark
                  infoString: "Web Manifest",
                  result: true,
                },
              ],
              vscode.TreeItemCollapsibleState.Expanded,
              false
            )
          );
        }
      }
    } else {
      console.log('no web manifest');
      return Promise.resolve([
        new ValidationItem(
          "Web Manifest",
          "https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/web-app-manifests",
          "false",
          vscode.TreeItemCollapsibleState.None
        ),
      ]);
    }
  }

  /*
   * Handle test results
   */
  private handleTestResults(
    testResults: any,
    collapsedState: vscode.TreeItemCollapsibleState,
    detail: boolean
  ): ValidationItem[] {
    let resultsData: ValidationItem[] = [];
    testResults.map((result: any) => {
      if (detail) {
        resultsData.push(
          new ValidationItem(
            result.infoString,
            result.docsLink ? result.docsLink : "",
            result.result ? result.result.toString() : "",
            vscode.TreeItemCollapsibleState.None
          )
        );
      } else {
        resultsData.push(
          new ValidationItem(
            result.infoString,
            "",
            result.result ? result.result.toString() : "",
            collapsedState
          )
        );
      }
    });

    return resultsData;
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }
}

class ValidationItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly docsLink: string,
    private version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.version}`;
    this.description = this.version;
  }

  iconPath = {
    light: path.join(__filename, "checkmark-outline.svg"),
    dark:
      this.version === "true"
        ? path.join(
            __filename,
            "..",
            "..",
            "..",
            "resources",
            "checkmark-outline.svg"
          )
        : path.join(
            __filename,
            "..",
            "..",
            "..",
            "resources",
            "warning-outline.svg"
          ),
  };
}
