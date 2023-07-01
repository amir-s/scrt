# SCRT - Simple Secret Management

`scrt` is an npm package that provides a simple way to manage secrets in your applications. It allows you to easily add secrets and encrypt them, ensuring the security of sensitive information. The encrypted secrets can be decrypted in production using a private key.

[![npm version](https://badge.fury.io/js/scrt.svg)](https://badge.fury.io/js/scrt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
  // privateKey: process.env.SECRETS_PRIVATE_KEY // or use the private key directly
  secrets: encryptedSecrets,
});

console.log(secrets);
```

In the code above, you pass the private key to the `scrt` function using either the `privateKeyFile` option, which points to the path of the private key file, or the `privateKey` option, which provides the PEM-formatted key directly.

You can provide the secrets to decrypt using the `secretsFile` option, which points to the path of the secrets JSON file, or by providing the JSON-serialized value directly via the `secrets` option.

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

Note that you can also have nested arrays and objects in there.

After running `npx scrt encrypt ./secrets.json ./keys/scrt.pem`, this is what we get:

```shell
$ scrt encrypt ./secrets.json ./keys/scrt.pem
 > Encrypted key .database.username
 > Encrypted key .database.password
 > Encrypted key .api.key

 > Saving encrypted file... ./secrets.json
```

```json
{
  "database": {
    "username": "_e:ad2dba91d00d75ff352670bf4551c08dd2af807903afea0ed224e25d0d8e0f60ecedaa6ba76f1d3eedf7effee6dad920d28278cd0ec75bcea1a438b4da8002903804c14a7097c60064136e741fd2d1aae9da738cb49af65f3f26b3fa50d67a75c56d72ee388a5091eefb5b98944d3d16409fa5c565c29ad079dd6a54d663dbc4b95bbc596c297e88142db4c3ef47d797fd5dfaec33642b667bb5a6c6b8576c811b5eb6ef281b4b1e2aea8e8d64800d05716b772f3ee5c5c860b4e23e6ec4a95f7261350955ca1fd9a0c2257cc3a436cbc788e56ad53da455963bd4ab9a8110f1f9d51303b1acaacd14e6d5ad32023d94937f3d016cd658459fc1de2caa6ea0c828a5f42de7cbeeee1175995e4b9b981d475cc9bf2d0fcb722a9cc0faea52c85ec15c9c0365d9d17dbdbea13847ecabd7f702cc3568230ccd6205651e99fb0b579b3f92e2586fd68a333921081ed1ab74047f052556be2805aa61960896af87578778c0a74eea4d0060c6375f9800663012964edec549aa573511ca835e5a458f33603166635d36d0cd6c1f26cd3d5d05e209941b2195d30416e55333155a50a1a10af7c50ecf1641a3b10fc3fb5fc7ef2bc905e794c513c2c47d4b001db624b4524e0c5fd832f5ffff30720d9a597fffb6483568b1499e7f3289362d33202997112838bf7fe58c76fe3da98c0e36badd189f88ec4e455a947e7659259b11e2ee:e04c80216853f0ddd9d8a5ef1d17f075:06b5b2d7200e6890ef4334",
    "password": "_e:363acfaf0c24ec4a55beecb5d52cb6a1c9944a29a5a4daf46fae9ddcfad6d22ba38d1906d4d11355e7e1069b5713f905ce86f93c6eb85ade0397ebacca5fbd3160e204b0fb7ff3980d9143a7c6108ef831812affda6282094008b0dd1429b01c3b63bc86348c8007f7ee9f9496f755379886bb2be867850f278b2d446ba69b1348177fe1472d271514ede71ac53fc4342336fc3cc1e2dd255695c5a51aebd571dd873768a176159f5d5f54274429bd5ad76892a57261b389dd66a62fa91950e4213a37143d1941de7cc8df312446e9bfec6fe5f7b234f511f72948a12af478774033560924382a85ec30ef83ee4dcad3fbecbbd60505b4adc532197abb3856140d336d2af28d0209dd499231d73f23e82ba17f5f8a5e1ed65cb55851d91c54a3cfa2904ed46e10b5bbc767f5d95ef9df48d7ab91c2b679a3ed5ab15d6da8ee3ab13719c5833d600817405055cfdff260f318e344bd9ad14bed3b9a1dc544e2b455ae7978f9a0b27366715313b3c61d47a8ad684cc754915915c907d1fdf9ecc7d4403b4c39170d21e98df41f1dfef6133d62df7b7790881f319f05874debc89877dc20af0e2c3b768e94afd33ea6941bf051c5a265e31c599c6c6d9599cac58f4176a0405652c4f03c80af45ae7626a16a3367da1a9a47150727ff4b5640dcd6eca4b23e187e1b51d0e00813d14f07ea23f96ccc21dfdbd02f7e267ed0efa054:4bdda995b3f22d41b523ccdaabba84de:5772768e00370cfd2c99d0"
  },
  "api": {
    "key": "_e:849ca203fbd0df1d9cdc4e3600a1a5ab8a311316c70e88a1b199c2a49d99dcccdc6a02575255432bcc6887334249267e41d33cb5b1620d76391eed6affa15e86cbc46e033588c60e296dfd5c596085e23598ba32aa9d6c015eecd209050fb19fb310ad1bfee3432b90230dfaf1317fc30812a82608a2d7aabdc184338db8a87fb6a4de2b23c68c6bfce5098f2c2379e6e5a35cc54354148f6e876aea010ea439447c79fa230dba12a3b67ff08a2386bf287b628f18352fc16d2207ba21c56e023ee73d7913f13219f430ecc981006c9280e5b801c9a366d5f451acf3c6b3b42acfef1a4f2235893677eb342b301fa6d1f6f6f17ef7d449f96f5dfc2f8d64bdb958b3f1ea08e6b55134b944b2aa3a27eb2dc9c1a1febc14f62e3d4b3543258f9ccec5ccf283ed000710379197d70ca21a5bd63db4504b68bdb7236f0bcd02c0e1b2846345291b79bf43d055bb71728e228c69fcab9c43006be3f45b42413c91acfa03095296605c7e03fbca2e2b932ab5bb4db29e62f0e5d5b3ee0730cb0af3fb8a78214df43de756c8c893b7249eb5fc59c5d761cbf589533e0a075aef7fa43603cdea7021eb169e277a0e1e142b8a35e082f8582799eb5d6bdb87687f0f967d13192e294529bf97a91935391a296eda4b281b022f94b6467ac52571a69ccd0ff9f0884de36ca9bdb5bd4c25e055efd11cd8eabd87ddef0fdadebb292183e764:07da0bbcfd2a90b74ed812c37c2d0fec:038873499220a1cbd0dd"
  }
}
```
