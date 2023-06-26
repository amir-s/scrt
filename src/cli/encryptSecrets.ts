import { publicEncrypt, randomBytes, createCipheriv } from 'crypto';
import path from 'path';
import { ALGORITHM } from '../constants';

const randomPassword = (length = 127) => {
  const buf = randomBytes(length * 2);
  return buf.toString('base64').substr(0, length);
};

const encrypt = (toEncrypt, publicKey) => {
  const secret = randomPassword(32);
  const encryptedSecret = publicEncrypt({ key: publicKey }, Buffer.from(secret)).toString('hex');

  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, secret, iv);
  const encrypted = Buffer.concat([cipher.update(toEncrypt), cipher.final()]);

  return `${encryptedSecret}:${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const encryptSecrets = (config: object, publicKey: string) => {
  const configPath = path.join(__dirname, '../secrets/production/config.json');

  const keys: string[] = [];
  const encryptRecursive = (prefix, obj) => {
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object') {
        encryptRecursive(`${prefix}.${key}`, obj[key]);
        return;
      }
      if (obj[key].startsWith('_e:')) return;
      keys.push(`${prefix}.${key}`);
      obj[key] = `_e:${encrypt(obj[key], publicKey)}`;
    });
  };

  encryptRecursive('', config);
  return { content: JSON.stringify(config, null, 2), keys };
};
