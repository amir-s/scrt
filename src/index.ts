import { readFileSync, existsSync } from 'fs';
import { privateDecrypt, createDecipheriv } from 'crypto';
import { ALGORITHM, PRIVATE_KEY_PASSPHRASE } from './constants';

const getPrivateKey = (file: string) => {
  if (file && existsSync(file)) return readFileSync(file, 'utf-8');
  return null;
};

const decrypt = (toDecrypt: string, privateKey: string) => {
  const [encryptedSecret, iv, encrypted] = toDecrypt.split(':');

  const secret = privateDecrypt(
    { key: privateKey, passphrase: PRIVATE_KEY_PASSPHRASE },
    Buffer.from(encryptedSecret, 'hex'),
  );

  const decipher = createDecipheriv(ALGORITHM, secret, Buffer.from(iv, 'hex'));

  const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]);

  return decrypted.toString('utf8');
};

export function scrt<T = any>({
  secretsFile,
  secrets,
  privateKeyFile,
  privateKey,
}: {
  secretsFile?: string;
  secrets?: string | object;
  privateKeyFile?: string;
  privateKey?: string;
}) {
  if (!privateKeyFile && !privateKey) {
    throw new Error('Either privateKeyFile or privateKey must be provided');
  }
  const keyContent = privateKey || getPrivateKey(privateKeyFile);
  if (!keyContent) {
    throw new Error('Private key not found');
  }

  if (!secretsFile && !secrets) {
    throw new Error('Either secretsFile or secrets must be provided');
  }

  if (secretsFile && !existsSync(secretsFile)) {
    throw new Error(`Secrets file not found: ${secretsFile}`);
  }

  let secretsContent = '';
  try {
    if (secrets && typeof secrets === 'string') {
      secretsContent = JSON.parse(secrets);
    } else if (secrets && typeof secrets === 'object') {
      secretsContent = JSON.parse(JSON.stringify(secrets));
    } else if (secretsFile) {
      if (!existsSync(secretsFile)) throw new Error(`Secrets file not found: ${secretsFile}`);
      secretsContent = JSON.parse(readFileSync(secretsFile, 'utf-8'));
    }
  } catch (e) {
    throw new Error(`Invalid secrets`);
  }

  const decryptRecursive = (obj: any) => {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object') {
        decryptRecursive(obj[key]);
        return;
      }
      if (!obj[key].startsWith('_e:')) return;
      obj[key] = decrypt(obj[key].substr(3), keyContent);
    });
  };
  decryptRecursive(secretsContent);

  return secretsContent as T;
}
