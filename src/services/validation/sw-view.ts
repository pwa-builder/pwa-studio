import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { readFile } from "fs/promises";

export class ServiceWorkerProvider implements vscode.TreeDataProvider<any> {
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
    const serviceWorkerPath =
      path.join(this.workspaceRoot, "pwabuilder-sw.ts") ||
      path.join(this.workspaceRoot, "pwabuilder-sw.js") ||
      path.join(this.workspaceRoot, "sw.js") ||
      path.join(this.workspaceRoot, "service-worker.js");
    // to-do: add support for more sw paths
    const serviceWorkerExists = this.pathExists(serviceWorkerPath);

    if (element && serviceWorkerPath && serviceWorkerExists) {
      const items = [];

      const swContents = await readFile(serviceWorkerPath, "utf8");

      if (
        swContents.includes("preacache") ||
        swContents.includes("cache") ||
        swContents.includes("caches")
      ) {
        items.push(
          new ValidationItem(
            "Handles Caching",
            "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers",
            "true",
            vscode.TreeItemCollapsibleState.None
          )
        );
      } else {
        items.push(
          new ValidationItem(
            "Handles Caching",
            "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers",
            "false",
            vscode.TreeItemCollapsibleState.None
          )
        );
      }

      const indexFile = path.join(this.workspaceRoot, "index.html");
      if (indexFile) {
        const indexContents = await readFile(indexFile, "utf8");

        if (indexContents && indexContents.includes("serviceWorker.register")) {
          items.push(
            new ValidationItem(
              "Registered",
              "https://developers.google.com/web/fundamentals/primers/service-workers/registration",
              "true",
              vscode.TreeItemCollapsibleState.None
            )
          );
        } else {
          items.push(
            new ValidationItem(
              "Registered",
              "https://developers.google.com/web/fundamentals/primers/service-workers/registration",
              "false",
              vscode.TreeItemCollapsibleState.None
            )
          );
        }
      }

      return Promise.resolve(items);
    } else if (serviceWorkerPath && serviceWorkerExists) {
      return Promise.resolve([
        new ValidationItem(
          "Service Worker",
          "https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/service-workers",
          "true",
          vscode.TreeItemCollapsibleState.Expanded
        ),
      ]);
    } else {
      return Promise.resolve([]);
    }
  }

  private pathExists(p: string): boolean {
    try {
      fs.accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
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
    public readonly desc: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    this.description = this.desc;
    this.command = command;
  }

  iconPath = {
    light: this.desc.toString() === "true"
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
      this.desc.toString() === "true"
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
