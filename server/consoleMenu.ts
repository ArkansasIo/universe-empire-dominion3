import readline from 'readline';
import { logger } from './logger';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

export class ConsoleMenu {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });
  }

  private displayHeader() {
    console.clear();
    console.log(colors.bright + colors.cyan + '╔════════════════════════════════════════════════╗' + colors.reset);
    console.log(colors.bright + colors.cyan + '║' + colors.reset + colors.bright + '         🖥️  STELLAR DOMINION SERVER CONSOLE     ' + colors.cyan + '║' + colors.reset);
    console.log(colors.bright + colors.cyan + '╚════════════════════════════════════════════════╝' + colors.reset + '\n');
  }

  displayMainMenu() {
    this.displayHeader();
    console.log(colors.bright + 'Main Menu:' + colors.reset);
    console.log('  1) View System Status');
    console.log('  2) View Logs');
    console.log('  3) Server Settings');
    console.log('  4) Clear Logs');
    console.log('  5) Export Logs');
    console.log('  0) Exit Console\n');
  }

  viewSystemStatus() {
    this.displayHeader();
    const stats = logger.getStats();
    console.log(colors.bright + 'System Status:' + colors.reset);
    console.log(`  ${colors.green}✓${colors.reset} Total Logs: ${stats.total}`);
    console.log(`  ${colors.blue}ℹ️${colors.reset}  Info: ${stats.info}`);
    console.log(`  ${colors.yellow}⚠️${colors.reset}  Warnings: ${stats.warnings}`);
    console.log(`  ${colors.red}❌${colors.reset} Errors: ${stats.errors}`);
    console.log(`  🔍 Debug: ${stats.debug}`);
    console.log();
  }

  viewLogs() {
    this.displayHeader();
    console.log(colors.bright + 'Logs Menu:' + colors.reset);
    console.log('  1) View All Logs (last 20)');
    console.log('  2) View Errors');
    console.log('  3) View Warnings');
    console.log('  4) View Auth Logs');
    console.log('  5) View API Logs');
    console.log('  0) Back to Main Menu\n');
  }

  serverSettings() {
    this.displayHeader();
    console.log(colors.bright + 'Server Settings:' + colors.reset);
    console.log('  1) Set Log Level');
    console.log('  2) Database Info');
    console.log('  3) Session Info');
    console.log('  4) Environment Variables');
    console.log('  0) Back to Main Menu\n');
  }

  displayLogEntry(entry: any) {
    const icon = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌'
    }[entry.level] || '•';

    const levelColor = {
      debug: colors.dim,
      info: colors.blue,
      warn: colors.yellow,
      error: colors.red
    }[entry.level] || colors.reset;

    console.log(
      `${entry.timestamp} ${icon} ${levelColor}[${entry.category}]${colors.reset} ${entry.message}`,
      entry.data ? JSON.stringify(entry.data).substring(0, 50) : ''
    );
  }

  async prompt(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(colors.cyan + question + colors.reset, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  async start() {
    let running = true;
    while (running) {
      this.displayMainMenu();
      const choice = await this.prompt('Enter option: ');

      switch (choice) {
        case '1':
          this.viewSystemStatus();
          await this.prompt('Press Enter to continue...');
          break;

        case '2':
          await this.handleLogsMenu();
          break;

        case '3':
          await this.handleSettings();
          break;

        case '4':
          logger.clear();
          console.log(colors.green + '✓ Logs cleared' + colors.reset);
          await this.prompt('Press Enter to continue...');
          break;

        case '5':
          const logs = logger.export();
          console.log('\n' + JSON.stringify(logs, null, 2));
          await this.prompt('Press Enter to continue...');
          break;

        case '0':
          running = false;
          console.log(colors.green + '✓ Exiting console...' + colors.reset);
          this.rl.close();
          break;

        default:
          console.log(colors.red + '✗ Invalid option' + colors.reset);
          await this.prompt('Press Enter to continue...');
      }
    }
  }

  private async handleLogsMenu() {
    const choice = await this.prompt('\nEnter logs option: ');
    this.displayHeader();

    switch (choice) {
      case '1': {
        const logs = logger.getLogs(undefined, undefined, 20);
        console.log(colors.bright + 'Last 20 Logs:' + colors.reset);
        logs.forEach(log => this.displayLogEntry(log));
        break;
      }
      case '2': {
        const logs = logger.getLogs('error');
        console.log(colors.bright + colors.red + `Errors (${logs.length}):` + colors.reset);
        logs.forEach(log => this.displayLogEntry(log));
        break;
      }
      case '3': {
        const logs = logger.getLogs('warn');
        console.log(colors.bright + colors.yellow + `Warnings (${logs.length}):` + colors.reset);
        logs.forEach(log => this.displayLogEntry(log));
        break;
      }
      case '4': {
        const logs = logger.getLogs(undefined, 'AUTH', 20);
        console.log(colors.bright + 'Auth Logs:' + colors.reset);
        logs.forEach(log => this.displayLogEntry(log));
        break;
      }
      case '5': {
        const logs = logger.getLogs(undefined, 'API', 20);
        console.log(colors.bright + 'API Logs:' + colors.reset);
        logs.forEach(log => this.displayLogEntry(log));
        break;
      }
    }

    await this.prompt('\nPress Enter to continue...');
  }

  private async handleSettings() {
    const choice = await this.prompt('\nEnter settings option: ');
    this.displayHeader();

    switch (choice) {
      case '1':
        console.log(colors.bright + 'Log Levels:' + colors.reset);
        console.log('  debug, info, warn, error');
        break;
      case '2':
        console.log(colors.bright + 'Database Info:' + colors.reset);
        console.log(`  Host: ${process.env.PGHOST || 'localhost'}`);
        console.log(`  Port: ${process.env.PGPORT || 5432}`);
        console.log(`  Database: ${process.env.PGDATABASE || 'stellar'}`);
        break;
      case '3':
        console.log(colors.bright + 'Session Info:' + colors.reset);
        console.log(`  TTL: 7 days`);
        console.log(`  Store: Memory`);
        break;
      case '4':
        console.log(colors.bright + 'Environment Variables:' + colors.reset);
        console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
        console.log(`  PORT: ${process.env.PORT || 5000}`);
        break;
    }

    await this.prompt('\nPress Enter to continue...');
  }
}
