import { generateKeyPairSync } from 'crypto';
import { writeFileSync } from 'fs';

export async function generateKeys({
  publicKeyPath,
  privateKeyPath,
}: {
  publicKeyPath: string;
  privateKeyPath: string;
}) {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: '',
    },
  });

  writeFileSync(publicKeyPath, publicKey);
  writeFileSync(privateKeyPath, privateKey);

  return privateKey;
}
