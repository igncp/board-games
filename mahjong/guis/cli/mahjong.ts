import { program } from "commander";
import { startCLIGame } from "./gameLoop";

const main = () => {
  program.command("start").action(() => {
    startCLIGame();
  });

  program.parse();

  if (!program.args.length) {
    program.help();
  }
};

main();
