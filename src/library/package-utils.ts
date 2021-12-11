import fetch from "node-fetch";
import { Headers } from "node-fetch";
import { MsixInfo } from '../interfaces';

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

export function getSimpleMsixFromArray(...args: string[]): MsixInfo {
  // This creates an unsigned package. Should be considered the bare minimum.
  return {
    url: args[0],
    name: args[1],
    packageId: "com.example.pwa",
    version: "1.0.1",
    allowSigning: true,
    classicPackage: {
      generate: true,
      version: "1.0.0",
    },
  };
}

export function getPublisherMsixFromArray(...args: string[]): MsixInfo 
{
  return {
    url: args[0],
    name: args[1],
    packageId: args[2],
    version: args[3] || "1.0.1",
    allowSigning: true,
    classicPackage: {
      generate: true,
      version: args[4],
    },
    publisher: {
      displayName: args[5],
      commonName: args[6],
    },
  };
}