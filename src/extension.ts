import * as vscode from "vscode";
const commandExists = require("command-exists-promise");
const fs = require("fs");

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

      let wf = vscode.workspace.workspaceFolders![0].uri.path;
      let f = vscode.workspace.workspaceFolders![0].uri.fsPath;

      vscode.window.showInformationMessage(
        `YOUR-EXTENSION: folder: ${wf} - ${f}`
      );
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
