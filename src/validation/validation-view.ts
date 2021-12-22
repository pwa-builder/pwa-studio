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

    if (element) {
      /*return Promise.resolve(
        this.getDepsInPackageJson(
          path.join(
            this.workspaceRoot,
            "node_modules",
            element.label,
            "package.json"
          )
        )
      );*/

      // search for a manifest file in the root of the workspace
      const manifestPath = path.join(this.workspaceRoot, "manifest.json");
      if (this.pathExists(manifestPath)) {
        if (manifestPath) {
          const manifestContents = await readFile(manifestPath, "utf8");
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
      }
    } else {

      // search for a manifest file in the root of the workspace
      const manifestPath = path.join(this.workspaceRoot, "manifest.json");
      if (this.pathExists(manifestPath)) {
        if (manifestPath) {
          const manifestContents = await readFile(manifestPath, "utf8");
          const testResults = await testManifest(manifestContents);

          let requiredTestsFailed: any = [];

          testResults.map((result) => {
            // console.log('result', result);
            if (result.category === "required" && result.result === false) {
              requiredTestsFailed.push(result);
            }
          });

          if (requiredTestsFailed.length > 0) {
            return Promise.resolve(
              this.handleTestResults(
                [
                  {
                    infoString: "Not Installable",
                    result: false,
                  },
                ],
                vscode.TreeItemCollapsibleState.Collapsed,
                false
              )
            );
          } else {
            return Promise.resolve(
              this.handleTestResults(
                [
                  {
                    // infoString has checkmark
                    infoString: "Installable",
                    result: true,
                  },
                ],
                vscode.TreeItemCollapsibleState.Collapsed,
                false
              )
            );
          }
        }
      } else {
        vscode.window.showInformationMessage("Workspace has no manifest.json");
        return Promise.resolve([]);
      }
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
        console.log("result here", result);
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
