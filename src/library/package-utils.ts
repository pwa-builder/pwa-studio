import fetch from "node-fetch";
import { Headers } from "node-fetch";

export async function packageForWindows(options: any) {
  const response = await fetch(
    "https://pwabuilder-win-chromium-platform.centralus.cloudapp.azure.com/msix/generatezip",
    {
      method: "POST",
      body: JSON.stringify(options),
      headers: new Headers({ "content-type": "application/json" }),
    }
  );

  return response;
}

export function getSimpleMsix(url: string, name: string) {
  // This creates an unsigned package. Should be considered the bare minimum.
  return {
    name,
    packageId: "com.example.pwa",
    url,
    version: "1.0.1",
    allowSigning: true,
    classicPackage: {
      generate: true,
      version: "1.0.0",
    },
  };
}

export function getPublisherMsix(
  url: string,
  name: string,
  packageId: string,
  version: string,
  classicVersion: string,
  displayName: string,
  publisherId: string
) {
  return {
    name,
    packageId,
    url,
    version: version || "1.0.1",
    allowSigning: true,
    classicPackage: {
      generate: true,
      version: classicVersion,
    },
    publisher: {
      displayName,
      commonName: publisherId,
    },
  };
}