import { readFileSync, existsSync } from 'fs';
import { privateDecrypt, createDecipheriv } from 'crypto';
import { ALGORITHM } from './constants';

const getPrivateKey = (file: string) => {
  if (process.env.SCRT_PRIVATE_KEY) return process.env.SCRT_PRIVATE_KEY;
  if (existsSync(file)) return readFileSync(file, 'utf-8');

  return null;
};

const decrypt = (toDecrypt: string, privateKey: string) => {
  const [encryptedSecret, iv, encrypted] = toDecrypt.split(':');

  const secret = privateDecrypt({ key: privateKey, passphrase: '' }, Buffer.from(encryptedSecret, 'hex'));

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
  secrets?: string;
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

  const secretsContent = JSON.parse(secrets || readFileSync(secretsFile, 'utf-8'));

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
