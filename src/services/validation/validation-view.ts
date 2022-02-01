import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { readFile } from "fs/promises";
import { testManifest } from "./validation";
import { findManifest, getManifest } from "../manifest/manifest-service";
import { pathExists } from "../../library/file-utils";

/**
 * This is the Web Manifest Panel
 */

export class PWAValidationProvider implements vscode.TreeDataProvider<any> {
  constructor(private workspaceRoot: string) { }

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
    const manifestPath: vscode.Uri | undefined = await findManifest();

    let manifestExists: boolean | undefined;

    if (manifestPath) {
      manifestExists = await pathExists(manifestPath);
    }

    if (element && manifestPath && manifestExists) {
      const testResults = await this.loadAndTestManifest((manifestPath as any).fsPath);

      return Promise.resolve(
        this.handleTestResults(
          testResults,
          vscode.TreeItemCollapsibleState.None,
          true
        )
      );
    } else if (manifestPath && manifestExists) {
      const testResults = await this.loadAndTestManifest((manifestPath as any).fsPath);

      let requiredTestsFailed: any = [];

      testResults.map((result) => {
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
    } else {
      return Promise.resolve([]);
    }
  }

  /*
  * Read and test manifest
  */
  private async loadAndTestManifest(manifestPath: string) {
    try {
      const manifestContents = await readFile(manifestPath, "utf8");
      const testResults = await testManifest(manifestContents);

      return testResults;
    }
    catch (err) {
      throw new Error(`Error loading and testing manifest: ${err}`);
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

  private _onDidChangeTreeData: vscode.EventEmitter<
    any | undefined | null | void
  > = new vscode.EventEmitter<any | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<any | undefined | null | void> =
    this._onDidChangeTreeData.event;

  refresh(ev: any): void {
    this._onDidChangeTreeData.fire(ev);
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
    light:
      this.version === "true"
        ? path.join(
          __filename,
          "..",
          "..",
          "..",
          "..",
          "resources",
          "checkmark-light.svg"
        )
        : path.join(
          __filename,
          "..",
          "..",
          "..",
          "..",
          "resources",
          "warning-light.svg"
        ),
    dark:
      this.version === "true"
        ? path.join(
          __filename,
          "..",
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
          "..",
          "resources",
          "warning-outline.svg"
        ),
  };
}
