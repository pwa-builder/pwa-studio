import * as vscode from "vscode";
import { Buffer } from "buffer";
import { writeFile } from "fs/promises";
import { MsixInfo, Question } from "../../interfaces";

import {
  packageQuestion,
  windowsDevQuestions,
  windowsProdQuestions,
} from "../../questions";

import {
  buildAndroidOptions,
  getPublisherMsixFromArray,
  getSimpleMsixFromArray,
  packageForWindows,
} from "../../library/package-utils";
import { packageForAndroid } from "./package-android-app";

const inputCancelledMessage: string =
  "Input process cancelled. Try again if you wish to package your PWA";

var packagePlatform: string | undefined;
var packageInfo: MsixInfo;
var msixAnswers: string[];
var didInputFail: boolean;

export async function packageApp(): Promise<void> {
  didInputFail = false;
  const packageType = await getPackageInputFromUser();

  if (packageType === "Android") {
    const options = await getAndroidPackageOptions();
    const responseData: Blob = await packageForAndroid(options);
    await convertPackageToZip(responseData, options?.packageId);
  } else {
    await getMsixInputs();
    if (!didInputFail) {
      var responseData: any = await packageWithPwaBuilder();
      await convertPackageToZip(responseData);
    }
  }
}

async function getAndroidPackageOptions() {
  const options = await buildAndroidOptions();
  return options;
}

async function getPackageInputFromUser(): Promise<string> {
  const platform = await platformQuestionQuickPick();

  return platform;
}

async function platformQuestionQuickPick(): Promise<string> {
  const choices: string[] = resolveChoices(packageQuestion.choices);
  packagePlatform = await vscode.window.showQuickPick(choices, {
    placeHolder: packageQuestion.message,
  });
  validateInput(packagePlatform, packageQuestion);

  return packagePlatform || "Windows Production";
}

async function packageWithPwaBuilder(): Promise<any> {
  return (await packageForWindows(packageInfo)).blob();
}

async function convertPackageToZip(
  responseData: Blob,
  packageID?: string
): Promise<void> {
  await writeMSIXToFile(responseData, packageID || packageInfo.packageId);
}

async function getMsixInputs(): Promise<void> {
  switch (packagePlatform) {
    default:
      await getSimpleMsixInput();
      break;
    case "Windows Production":
      await getPublisherMsixInput();
      break;
  }
}

async function getSimpleMsixInput(): Promise<void> {
  await getEachQuestionInput(windowsDevQuestions);
  packageInfo = getSimpleMsixFromArray(...msixAnswers);
}

async function getPublisherMsixInput(): Promise<void> {
  await getEachQuestionInput(windowsProdQuestions);
  packageInfo = getPublisherMsixFromArray(...msixAnswers);
}

async function getEachQuestionInput(questions: Question[]): Promise<void> {
  msixAnswers = new Array();
  for (let i = 0; i < questions.length; i++) {
    await showQuestionInput(questions[i]);
  }
  // Check failed input
}

function resolveChoices(choices: string[] | undefined): string[] {
  return choices === undefined ? [] : choices;
}

async function showQuestionInput(question: Question): Promise<void> {
  if (!didInputFail) {
    var answer: string | undefined = await vscode.window.showInputBox({
      prompt: question.message,
    });
    msixAnswers.push(validateInput(answer, question));
  }
}

function updateDidInputFail(input: string | undefined): void {
  didInputFail = input === undefined;
  if (didInputFail) {
    inputCancelledWarning();
  }
}

function validateInput(input: string | undefined, question: Question): string {
  var validatedInput: string | undefined;

  if (input === "" && question.default === undefined) {
    validatedInput = undefined;
    skippedRequiredFieldError(question.name);
  } else if (input === "") {
    validatedInput = question.default;
    usedDefaultFieldWarning(question.name);
  } else {
    validatedInput = input;
  }

  updateDidInputFail(validatedInput);
  return validatedInput === undefined ? "" : validatedInput;
}

async function writeMSIXToFile(
  responseData: Blob,
  name: string
): Promise<void> {
  try {
    const test = await vscode.window.showSaveDialog({
      title: "Save your package",
      defaultUri: vscode.workspace.workspaceFolders
        ? vscode.Uri.file(
            `${vscode.workspace.workspaceFolders[0].uri.fsPath}/${name}.zip`
          )
        : undefined,
    });

    if (test) {
      // write file to current workspace directory with vscode api
      await writeFile(
        test.fsPath,
        Buffer.from(await responseData.arrayBuffer())
      );
    }
  } catch (err) {
    console.error(`There was an error packaging your app: ${err}`);
  }
}

function usedDefaultFieldWarning(fieldName: string): void {
  vscode.window.showWarningMessage(getDefaultFieldWarningMessage(fieldName));
}

function getDefaultFieldWarningMessage(fieldName: string): string {
  return (
    'No field provided for package field "' +
    fieldName +
    '." Using default value instead.'
  );
}

function skippedRequiredFieldError(fieldName: string): void {
  vscode.window.showErrorMessage(getRequiredFieldErrorMessage(fieldName));
}

function getRequiredFieldErrorMessage(fieldName: string): string {
  return (
    'Skipped input for required field "' +
    fieldName +
    '." Packaging process was cancelled.'
  );
}

function inputCancelledWarning(): void {
  vscode.window.showWarningMessage(inputCancelledMessage);
}
