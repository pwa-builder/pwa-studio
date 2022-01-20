import * as vscode from "vscode";
const shell = require("shelljs");

const repositoryInputPrompt: string =
  "Enter the name you would like to use for your PWA's repository.";
const repositoryInputPlaceholder: string = "Enter your repository name here.";
const noNameSelectedWarning: string =
  "No repository name provided. New PWA Starter process cancelled.";
const noGitWarning: string =
  "This command requires git. Install git at https://git-scm.com/";
const noNpmWarning: string =
  "This command requires npm. Install git at https://www.npmjs.com/";
const starterRepositoryURI: string =
  "https://github.com/pwa-builder/pwa-starter.git";

let repositoryName: string | undefined = undefined;
const vsTerminal = vscode.window.createTerminal();

export async function setUpLocalPwaStarterRepository(): Promise<void> {
  await getRepositoryNameFromInputBox();

  if (repositoryName !== undefined) {
    initStarterRepository();
    openRepositoryWithCode();
  }
}

async function getRepositoryNameFromInputBox(): Promise<void> {
  repositoryName = await vscode.window.showInputBox({
    prompt: repositoryInputPrompt,
    placeHolder: repositoryInputPlaceholder,
  });

  if (repositoryName === undefined) {
    inputCanelledWarning();
  }
}

function initStarterRepository(): void {
  vsTerminal.show();
  if (tryCloneFromGithub()) {
    tryNpmInstall();
  }
}

function openRepositoryWithCode(): void {
  vsTerminal.sendText(`code ${repositoryName}`);
}

function tryNpmInstall(): boolean {
  let didNpmInstall: boolean = true;
  if (isNpmInstalled()) {
    npmInstall();
  } else {
    noNpmInstalledWarning();
    didNpmInstall = false;
  }
  return didNpmInstall;
}

function npmInstall(): void {
  changeDirectory(repositoryName);
  vsTerminal.sendText("npm install");
  changeDirectory("..");
}

function changeDirectory(pathToDirectory: string | undefined): void {
  vsTerminal.sendText(`cd ${pathToDirectory}`);
}

export function isNpmInstalled(): boolean {
  let isNpmInstalled: boolean = true;

  if (!shell.which("npm")) {
    isNpmInstalled = false;
  }

  return isNpmInstalled;
}

function tryCloneFromGithub(): boolean {
  let wasCloned: boolean = true;
  if (isGitInstalled()) {
    cloneFromGithub();
  } else {
    noGitInstalledWarning();
    wasCloned = false;
  }

  return wasCloned;
}

function cloneFromGithub(): void {
  vsTerminal.sendText(cloneCommand());
}

function isGitInstalled(): boolean {
  let isGitInstalled: boolean = true;

  if (!shell.which("git")) {
    isGitInstalled = false;
  }

  return isGitInstalled;
}

function cloneCommand(): string {
  return `git clone ${starterRepositoryURI} ${repositoryName}`;
}

function inputCanelledWarning(): void {
  vscode.window.showWarningMessage(noNameSelectedWarning);
}

function noGitInstalledWarning(): void {
  vscode.window.showWarningMessage(noGitWarning);
}

export function noNpmInstalledWarning(): void {
  vscode.window.showWarningMessage(noNpmWarning);
}
