import * as vscode from "vscode";
const commandExists = require("command-exists-promise");
const fs = require("fs");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

const getNodeVersions = async () => {
  const output = (await exec("nvm list")).stdout.trim();
  const versions = [...output.matchAll(/\d+(?:\.\d+)*/g)]
    .map((m) => m[0])
    .filter((m: string) => !/^\d+$/.test(m));

  return versions;
};

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "nvm-runner.nvmRunner",
    async () => {
      const inDirectory = vscode.workspace.workspaceFolders !== undefined;
      const nvmExists = await commandExists("nvm");
      const nodeExists = await commandExists("node");

      if (!inDirectory) {
        vscode.window.showErrorMessage(
          "Working directory not found, open a directory an try again!"
        );
      }

      if (!nodeExists) {
        vscode.window.showErrorMessage(
          "To run this command you need to have Node installed!"
        );
        return;
      }

      if (!nvmExists) {
        vscode.window.showErrorMessage(
          "To run this command you need to have NVM installed!"
        );
        return;
      }

      const f = vscode.workspace.workspaceFolders![0].uri.fsPath;
      const configFilePath = `${f}/.nvm`;
      const configFileExists = fs.existsSync(configFilePath);

      if (!configFileExists) {
        vscode.window.showErrorMessage(
          "To run this command you need to have a .nvm file defined at the root of your project!"
        );
        return;
      }

      const configFileVersion = fs.readFileSync(configFilePath).toString();
      const nodeVersions = await getNodeVersions();

      if (!nodeVersions.includes(configFileVersion)) {
        vscode.window.showErrorMessage(
          "The version in your config file does not match installed NVM Node versions!"
        );
        return;
      }

      await exec(`nvm use ${configFileVersion}`);
      vscode.window.showInformationMessage(
        `You are now using Node version ${configFileVersion}!`
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
