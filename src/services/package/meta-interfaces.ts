import { Manifest } from "../../interfaces";

export interface MetaPackageOptions {
    existingSigningKey: string | null;
    manifest: Manifest;
    manifestUrl: string;
    name: string;
    packageId: string;
    signingMode: number;
    url: string;
    versionCode: number;
    versionName: string;
}