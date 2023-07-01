import { generateKeyPairSync } from 'crypto';
import { writeFileSync } from 'fs';
import {
  KEY_FORMAT,
  KEY_PAIR_TYPE,
  KEY_TYPE,
  MODULES_LENGTH,
  PRIVATE_KEY_CIPHER,
  PRIVATE_KEY_PASSPHRASE,
} from '../constants';

export async function generateKeys({
  publicKeyPath,
  privateKeyPath,
}: {
  publicKeyPath: string;
  privateKeyPath: string;
}) {
  const { privateKey, publicKey } = generateKeyPairSync(KEY_PAIR_TYPE, {
    modulusLength: MODULES_LENGTH,
    publicKeyEncoding: {
      type: KEY_TYPE,
      format: KEY_FORMAT,
    },
    privateKeyEncoding: {
      type: KEY_TYPE,
      format: KEY_FORMAT,
      cipher: PRIVATE_KEY_CIPHER,
      passphrase: PRIVATE_KEY_PASSPHRASE,
    },
  });

  writeFileSync(publicKeyPath, publicKey);
  writeFileSync(privateKeyPath, privateKey);

  return privateKey;
}
