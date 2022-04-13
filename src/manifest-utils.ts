import { isStandardOrientation } from "./services/validation/validation";

export const maniHoverValues = [
    {
        infoString: "The icons member specifies an array of objects representing image files that can serve as application icons for different contexts.",
        category: "required",
        member: "icons",
        defaultValue: JSON.stringify([
            {
                "src": "https://www.pwabuilder.com/assets/icons/icon_192.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "https://www.pwabuilder.com/assets/icons/icon_512.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]),
        docsLink: "https://developer.mozilla.org/en-US/docs/Web/Manifest/icons",
    },
    {
        infoString: "The name member is a string that represents the name of the web application as it is usually displayed to the user (e.g., amongst a list of other applications, or as a label for an icon)",
        category: "required",
        member: "name",
        defaultValue: "placeholder name",
        docsLink: "https://developer.mozilla.org/en-US/docs/Web/Manifest/name",
    },
    {
        infoString: "The short_name member is a string that represents the name of the web application displayed to the user if there is not enough space to display name. This name will show in the start menu on Windows and the homescreen on Android.",
        category: "required",
        member: "short_name",
        defaultValue: "placeholder",
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/short_name",
    },
    {
        infoString: "The start_url member is a string that represents the start URL of the web application — the preferred URL that should be loaded when the user launches the web application",
        category: "required",
        member: "start_url",
        defaultValue: "/",
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/start_url",
    },
    {
        infoString: "The display member is a string that determines the developers' preferred display mode for the website. The display mode changes how much of browser UI is shown to the user and can range from browser (when the full browser window is shown) to fullscreen (when the app is fullscreened).",
        category: "recommended",
        member: "display",
        defaultValue: "standalone",
        docsLink: "https://developer.mozilla.org/en-US/docs/Web/Manifest/display",
    },
    {
        infoString: "The background_color member defines a placeholder background color for the application page to display before its stylesheet is loaded.",
        category: "recommended",
        member: "background_color",
        defaultValue: "#000000",
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/background_color",
    },
    {
        infoString: "The theme_color member is a string that defines the default theme color for the application.",
        category: "recommended",
        member: "theme_color",
        defaultValue: "#000000",
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/theme_color",
    },
    {
        infoString: "The orientation mode changes the default orientation of the app. For example, if set to 'portrait', the app will be displayed in landscape mode by default.",
        category: "recommended",
        member: "orientation",
        defaultValue: "any",
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/orientation",
    },
    {
        infoString: "The screenshots member defines an array of screenshots intended to showcase the application.",
        category: "recommended",
        member: "screenshots",
        defaultValue: JSON.stringify([
            {
                "src": "https://www.pwabuilder.com/assets/screenshots/screen1.png",
                "sizes": "2880x1800",
                "type": "image/png",
                "description": "PWABuilder Home Screen"
            },
            {
                "src": "https://www.pwabuilder.com/assets/screenshots/screen2.png",
                "sizes": "2880/1800",
                "type": "image/png",
                "description": "PWABuilder Report Card"
            },
            {
                "src": "https://www.pwabuilder.com/assets/screenshots/screen3.png",
                "sizes": "2880x1800",
                "type": "image/png",
                "description": "Manifest information on the Report Card"
            },
        ]),
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/screenshots",
    },
    {
        infoString: "The shortcuts member defines an array of shortcuts or links to key tasks or pages within a web app. Shortcuts will show as jumplists on Windows and on the home screen on Android.",
        category: "recommended",
        member: "shortcuts",
        defaultValue: [],
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/shortcuts",
    },
    {
        infoString: "The iarc_rating_id member is a string that represents the International Age Rating Coalition (IARC) certification code of the web application. It is intended to be used to determine which ages the web application is appropriate for.",
        category: "optional",
        member: "iarc_rating_id",
        defaultValue: "",
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/iarc_rating_id",
    },
    {
        infoString: "The related_applications field is an array of objects specifying native applications that are installable by, or accessible to, the underlying platform — for example, a platform-specific (native) Windows application.",
        category: "optional",
        member: "related_applications",
        defaultValue: [],
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/related_applications",
    },
    {
        member: "lang",
        infoString: "The lang member is a string that represents the default language of your PWA.",
        category: "optional",
        defaultValue: "en-US",
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/lang",
    },
    {
        member: "dir",
        infoString: "The dir member is a string that represents the default text direction of your PWA.",
        category: "optional",
        defaultValue: "ltr",
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/dir",
    },
    {
        member: "description",
        infoString: "The description member is a string that represents the description of your PWA.",
        category: "optional",
        defaultValue: "",
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/description",
    },
    {
        member: "protocol_handlers",
        infoString: "The protocol_handlers member specifies an array of objects that are protocols which this web app can register and handle. Protocol handlers register the application in an OS's application preferences; the registration associates a specific application with the given protocol scheme. For example, when using the protocol handler mailto:// on a web page, registered email applications open.",
        category: "optional",
        defaultValue: [],
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/protocol_handlers",
    },
    {
        member: "display_override",
        infoString: "Its value is an array of display modes that are considered in-order, and the first supported display mode is applied.",
        category: "optional",
        defaultValue: [],
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/display_override",
    }
];

export const maniTestValues = [
    {
        name: "name",
        errorString: "name is required and should be a string with a length > 0",
        test: (value: string) => {
            return value && typeof value === "string" && value.length > 0;
        },
    },
    {
        name: "short_name",
        errorString:
            "short_name is required and should be a string with a length > 0",
        test: (value: string) =>
            value && typeof value === "string" && value.length > 0,
    },
    {
        name: "description",
        errorString:
            "description and should be a string with a length > 0",
        test: (value: string) =>
            value && typeof value === "string" && value.length > 0,
    },
    {
        name: "icons",
        errorString: "icons should be an array with a length > 0, should not include webp images and should have atleast one maskable icon",
        test: (value: any[]) => {
            const isArray = value && Array.isArray(value) && value.length > 0 ? true : false;

            let hasWebp = undefined;
            let hasMaskable = undefined;
            
            // check image types dont include webp
            if (isArray) {
                hasWebp = value.some(icon => icon.type === "image/webp");
                hasMaskable = value.some(icon => icon.purpose === "maskable");

                if (hasWebp === true || hasMaskable === false) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return false;
            }
        }
    },
    {
        name: "shortcuts",
        errorString: "shortcuts should be an array with a length > 0 and should not include webp images",
        test: (value: any[]) => {
            const isArray = value && Array.isArray(value) && value.length > 0 ? true : false;
            if (isArray === true) {
                // check image types dont include webp
                const hasWebp = value.some(icon => icon.type === "image/webp");
                if (hasWebp) {
                    return false;
                }
            }
            else {
                return false;
            }
        }
    },
    {
        name: "screenshots",
        errorString: "screenshots is required and should be an array with a length > 0",
        test: (value: string) =>
            value && Array.isArray(value) && value.length > 0 ? true : false,
    },
    {
        name: "display",
        errorString:
            "display is required and should be either fullscreen, standalone, minimal-ui, browser",
        test: (value: string) => {
            return ["fullscreen", "standalone", "minimal-ui", "browser"].includes(
                value
            );
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
        test: (value: string) =>
            value && typeof value === "string" && value.length > 0
    },
    {
        name: "lang",
        errorString: "lang is required and should be set to a valid language code",
        test: (value: string) => 
            value && typeof value === "string" && value.length > 0
        
    }
];
