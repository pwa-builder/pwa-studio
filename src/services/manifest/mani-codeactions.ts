import * as vscode from "vscode";
import { maniHoverValues } from "../../manifest-utils";

class ManiCodeActionsProvider implements vscode.CodeActionProvider {
    public provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[]> {
        return new Promise(resolve => {
            const lineOfText = document.lineAt(range.start);
            const hoverInfo = maniHoverValues.find(
                (hoverValue) => {
                    if (lineOfText.text.toLowerCase().includes(hoverValue.member.toLowerCase())) {
                        return hoverValue;
                    }
                });
            if (!hoverInfo) {
                resolve([]);
            }
            else {
                
                resolve([new vscode.CodeAction("", vscode.CodeActionKind.QuickFix)]);
            }
        });
    }
}

export function codeActionsActivate(ctx: vscode.ExtensionContext): void {
    ctx.subscriptions.push(
        vscode.languages.registerCodeActionsProvider(
            { language: 'json', scheme: 'file' }, new ManiCodeActionsProvider()));
}