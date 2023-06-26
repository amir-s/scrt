import { generateKeys } from './generateKeys';
import { homedir } from 'os';
import path from 'path';
import inquirer from 'inquirer';
import fs from 'node:fs';
import c from 'ansi-colors';
import { encryptSecrets } from './encryptSecrets';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('No arguments passed');
  process.exit(1);
}

const command = args[0];

const main = async () => {
  if (command === 'keys') {
    const home = homedir();

    const response = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What shall we call the key?',
        default: 'scrt',
      },
      {
        type: 'input',
        name: 'publicKeyPath',
        message: 'Where shall we save the public key?',
        default: ({ name }) => path.join(process.cwd(), `${name}.pem`),
        validate: (value) => {
          if (path.extname(value) !== '.pem') return 'File must have a .pem extension';
          if (fs.existsSync(value)) return 'File already exists';
          return true;
        },
      },
      {
        type: 'input',
        name: 'privateKeyPath',
        message: 'Where shall we save the private key?',
        default: ({ name }) => path.join(home, `.${name}.pem`),
        validate: (value) => {
          if (path.extname(value) !== '.pem') return 'File must have a .pem extension';
          if (fs.existsSync(value)) return 'File already exists';
          return true;
        },
      },
    ]);

    console.log(c.gray(' > Generating keys...'));

    const privateKey = await generateKeys({
      publicKeyPath: response.publicKeyPath,
      privateKeyPath: response.privateKeyPath,
    });

    console.log(c.gray(' > Public key saved to'), c.green(response.publicKeyPath));
    console.log(c.gray(' > Private key saved to'), c.green(response.privateKeyPath));

    const { showPrivateKey } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'showPrivateKey',
        message: 'Would you like to see the private key?',
        default: false,
      },
    ]);

    if (showPrivateKey) {
      console.log(c.gray(' > Private key:\n'));
      console.log(c.green(privateKey));
    }
    return;
  }

  if (command === 'encrypt') {
    const file = args[1];
    const publicKeyFile = args[2];
    if (!file) {
      console.log('No file specified');
      process.exit(1);
    }
    if (!publicKeyFile) {
      console.log('No public key file specified');
      process.exit(1);
    }

    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      console.log('File does not exist');
      process.exit(1);
    }

    const publicKeyPath = path.join(process.cwd(), publicKeyFile);
    if (!fs.existsSync(publicKeyPath)) {
      console.log('Public key does not exist');
      process.exit(1);
    }

    const publicKey = fs.readFileSync(publicKeyFile, 'utf-8');
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const encrypted = encryptSecrets(content, publicKey);

    encrypted.keys.forEach((key) => {
      console.log(c.gray(' > Encrypted key'), c.green(key));
    });
    console.log();
    console.log(c.gray(' > Saving encrypted file...'), c.green(filePath));

    fs.writeFileSync(filePath, encrypted.content);
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
