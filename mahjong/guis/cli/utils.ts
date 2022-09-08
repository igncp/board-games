import readline from "node:readline";

export class Prompt {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  prompt(text: string) {
    return new Promise((r) => {
      this.rl.question(text, function (result) {
        r(result);
      });
    });
  }

  close() {
    this.rl.close();
  }
}
