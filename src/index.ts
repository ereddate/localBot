import { CLIInterface } from './interface/CLIInterface';

async function main() {
  const cli = new CLIInterface();
  await cli.start();
}

main().catch(console.error);
