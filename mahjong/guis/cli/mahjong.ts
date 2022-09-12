import { program } from "commander";
import { startCLIGame } from "./gameLoop";

const main = () => {
  program
    .command("start")
    .option("-e, --exported [file]", "Use exported data")
    .action((options) => {
      startCLIGame(options.exported);
    });

  program.parse();

  if (!program.args.length) {
    program.help();
  }
};

main();
