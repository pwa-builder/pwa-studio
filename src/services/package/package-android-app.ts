import { buildAndroidPackage } from "../../library/package-utils";

export async function packageForAndroid(options: any): Promise<any> {
    const responseData = await buildAndroidPackage(options);
    return await responseData.blob();
}