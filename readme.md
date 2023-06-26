# SCRT - Simple Secret Management

`scrt` is an npm package that provides a simple way to manage secrets in your applications. It allows you to easily add secrets and encrypt them, ensuring the security of sensitive information. The encrypted secrets can be decrypted in production using a private key.

## Installation

```shell
npm install scrt --save
```

## Getting Started

To begin using scrt, you need to generate a public key and a private key. You can do this by running the following command:

```shell
npx scrt keys
```

The command will prompt you to specify the location for the public key and the private key.
It is safe to push the public key to your Git repository.

## Encrypting Secrets

Assuming you have a `secrets.json` file containing plain text secrets, you can encrypt it using scrt at any time. To encrypt the secrets, run the following command:

```shell
npx scrt encrypt path/to/secrets.json path/to/publickey.pem
```

This command will encrypt only the plain text secrets and leave the already encrypted ones untouched.

## Using Encrypted Secrets in Production

Assuming you have the private key available only in production, you can decrypt the encrypted secrets using `scrt` in your production code.

```javascript
import { scrt } from 'scrt';

import encryptedSecrets from './secrets.json';

const secrets = scrt({
  privateKeyFile: '/root/keys/privateKey.pem',
  secrets: encryptedSecrets,
});

console.log(secrets);
```

In the code above, you pass the private key to the `scrt` function using either the `privateKeyFile` option, which points to the path of the private key file, or the `privateKey` option, which provides the PEM-formatted key directly.

You can provide the secrets to decrypt using the `secretsFile` option, which points to the path of the secrets JSON file, or by providing the JSON-serialized value directly via the `secrets` option.

## Private Key via Environment Variable

Alternatively, you can provide the PEM-formatted private key using the `SCRT_PRIVATE_KEY` environment variable. This allows you to conveniently pass the private key to `scrt` without explicitly specifying it in your code.

## Example secrets.json file

Here is an example of how the `secrets.json` file might look:

```json
{
  "database": {
    "username": "my_username",
    "password": "my_password"
  },
  "api": {
    "key": "my_api_key"
  }
}
```
