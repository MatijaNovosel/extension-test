import * as vscode from "vscode";
const commandExists = require("command-exists-promise");
const fs = require("fs");

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "nvm-runner.nvmRunner",
    async () => {
      const nvmExists = await commandExists("nvm");
      const configFileExists = await fs.existsSync(".test");

      console.log(configFileExists);

      if (!nvmExists) {
        vscode.window.showErrorMessage(
          "To run this command you need to have NVM installed!"
        );
        return;
      }

      // The code you place here will be executed every time your command is executed
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
