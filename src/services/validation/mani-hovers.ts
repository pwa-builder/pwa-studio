import * as vscode from "vscode";

const maniHoverValues = [
    {
        infoString: "Lists icons for add to home screen",
        category: "required",
        member: "icons",
        defaultValue: [],
        docsLink: "https://developer.mozilla.org/en-US/docs/Web/Manifest/icons",
    },
    {
        infoString: "Contains name property",
        category: "required",
        member: "name",
        defaultValue: "placeholder name",
        docsLink: "https://developer.mozilla.org/en-US/docs/Web/Manifest/name",
    },
    {
        infoString: "Contains short_name property",
        category: "required",
        member: "short_name",
        defaultValue: "placeholder",
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/short_name",
    },
    {
        infoString: "Designates a start_url",
        category: "required",
        member: "start_url",
        defaultValue: "/",
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/start_url",
    },
    {
        infoString: "Specifies a display mode",
        category: "recommended",
        member: "display",
        defaultValue: "standalone",
        docsLink: "https://developer.mozilla.org/en-US/docs/Web/Manifest/display",
    },
    {
        infoString: "Has a background color",
        category: "recommended",
        member: "background_color",
        defaultValue: "black",
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/background_color",
    },
    {
        infoString: "Has a theme color",
        category: "recommended",
        member: "theme_color",
        defaultValue: "black",
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/theme_color",
    },
    {
        infoString: "Specifies an orientation mode",
        category: "recommended",
        member: "orientation",
        defaultValue: "any",
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/orientation",
    },
    {
        infoString: "Contains screenshots for app store listings",
        category: "recommended",
        member: "screenshots",
        defaultValue: [],
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/screenshots",
    },
    {
        infoString: "Lists shortcuts for quick access",
        category: "recommended",
        member: "shortcuts",
        defaultValue: [],
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/shortcuts",
    },
    {
        infoString: "Contains an IARC ID",
        category: "optional",
        member: "iarc_rating_id",
        defaultValue: "",
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/iarc_rating_id",
    },
    {
        infoString: "Specifies related_applications",
        category: "optional",
        member: "related_applications",
        defaultValue: [],
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/related_applications",
    },
];

class ManiHoverProvider implements vscode.HoverProvider {
    public provideHover(
        document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken):
        Thenable<vscode.Hover | undefined> {
        const lineOfText = document.lineAt(position);
        console.log("lineOfText", lineOfText.text);

        // search through maniHoverValues for lineOfText.text
        const hoverInfo = maniHoverValues.find(
            (hoverValue) => {
                if (lineOfText.text.includes(hoverValue.member)) {
                    return hoverValue;
                }
            });
        console.log('hoverInfo', hoverInfo);
        if (!hoverInfo) {
            return new Promise(() => { });
        }
        else {
            console.log("hoverInfo", hoverInfo);
            return new Promise(resolve => {
                resolve(new vscode.Hover(`${hoverInfo.member}: ${hoverInfo.infoString}`));
            });
        }
    }
}

export function hoversActivate(ctx: vscode.ExtensionContext): void {
    ctx.subscriptions.push(
        vscode.languages.registerHoverProvider(
            { language: 'json', scheme: 'file' }, new ManiHoverProvider()));
}