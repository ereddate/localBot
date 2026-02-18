import { CLIInterface } from './interface/CLIInterface';

// Determine if we should run in server mode or CLI mode
const RUN_MODE = process.env.RUN_MODE || 'cli'; // Can be 'cli' or 'server'

async function main() {
  if (RUN_MODE === 'server') {
    // Import and run server when in server mode
    const serverModule = await import('./server');
  } else {
    // Run CLI interface by default
    const cli = new CLIInterface();
    await cli.start();
  }
}

main().catch(console.error);
