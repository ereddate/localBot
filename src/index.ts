import { CLIInterface } from './interface/CLIInterface';
import { runMCPMode } from './mcp/MCPCLI';

const RUN_MODE = process.env.RUN_MODE || 'cli';

async function main() {
  if (RUN_MODE === 'server') {
    const serverModule = await import('./server');
  } else if (RUN_MODE === 'mcp') {
    await runMCPMode();
  } else {
    const cli = new CLIInterface();
    await cli.start();
  }
}

main().catch(console.error);
