import readline from "node:readline";

export class Prompt {
  private rl: readline.Interface;

  constructor(callback?: () => void) {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    if (callback) {
      this.rl.on("SIGINT", callback);
    }
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
