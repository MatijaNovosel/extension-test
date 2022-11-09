import * as vscode from "vscode";
var commandExists = require("command-exists-promise");

export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "nvm-runner.nvmRunner",
    async () => {
      const nvmExists = await commandExists("nvm");

      if (!nvmExists) {
        vscode.window.showErrorMessage(
          "To run this command you need to have NVM installed!"
        );
      }

      // The code you place here will be executed every time your command is executed
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
