export const maniHoverValues = [
    {
        infoString: "The icons member specifies an array of objects representing image files that can serve as application icons for different contexts.",
        category: "required",
        member: "icons",
        defaultValue: [],
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
        defaultValue: "black",
        docsLink:
            "https://developer.mozilla.org/en-US/docs/Web/Manifest/background_color",
    },
    {
        infoString: "The theme_color member is a string that defines the default theme color for the application.",
        category: "recommended",
        member: "theme_color",
        defaultValue: "black",
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
        defaultValue: [],
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