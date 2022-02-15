// @ts-ignore
import fetch from "node-fetch";
import { getURL } from "./web-publish";

const code: string = "$ANALYTICS_CODE$";

export interface PackageTypes {
  androidPackage: boolean;
  iOSPackage: boolean;
  windowsPackage: boolean;
  oculusPackage: boolean;
}

export interface PackageErrors {
  androidPackageError: string;
  iOSPackageError: string;
  oculusPackageError: string;
  windowsPackageError: string;
}

const appURL = getURL();

export async function captureUsage(
  action: string,
  manifestDetected?: boolean,
  serviceWorkerDetected?: boolean,
  packaged?: PackageTypes,
  packageErrors?: PackageErrors,
  windowsPackageType?: "StorePackage" | "TestPackage"
) {
  try {
    const testValue = process.env.ANALYTICS_CODE || code;
    await fetch(
      `https://pwabuilder-url-logger.azurewebsites.net/api/logurl?code=${testValue}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: appURL || "/",
          action,
          source: "PWA Studio",
          date: new Date().toISOString(),
          manifestDetected,
          serviceWorkerDetected,
          androidPackage: packaged ? packaged.androidPackage : false,
          iOSPackage: packaged ? packaged.iOSPackage : false,
          oculusPackage: packaged ? packaged.oculusPackage : false,
          windowsPackage: packaged ? packaged.windowsPackage : false,
          androidPackageError: packageErrors ? packageErrors.androidPackageError: undefined,
          iOSPackageError: packageErrors ? packageErrors.iOSPackageError : undefined,
          oculusPackageError: packageErrors ? packageErrors.oculusPackageError : undefined,
          windowsPackageError: packageErrors ? packageErrors.windowsPackageError : undefined,
          windowsPackageType,
        }),
      }
    );
  } catch (err) {
    console.error("Error logging usage", err);
  }
}