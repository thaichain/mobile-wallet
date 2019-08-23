## Thaichain Wallet Mobile

### Building locally
The code is built using React-Native and running code locally requires a Mac or Linux OS.

- Install [Node.js](https://nodejs.org) **version 8 (latest stable) and npm@6**
    - If you are using [nvm](https://github.com/creationix/nvm#installation) (recommended) running `nvm use` will automatically choose the right node version for you.
    - If you install Node.js manually, ensure you're using npm@6
        - Install npm@6 using `npm install -g npm@6`

- Before starting, you need to install React Native dependencies:
    - [MacOs](https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies-1)
    - [Linux](https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies-2)
 -  Now clone this repo and then install all our dependencies

```bash
cd mobile-wallet
npm i
```

- Running the app on Android:

```bash
npm run start:android
```

- Running the app on iOS:

```bash
npm run start:ios
```

### Running tests:
 - Unit test:
```
npm run test:unit
```
 - E2E Tests (iOS)
```
npm run test:e2e:ios
```
 - E2E Tests (Android)
```
npm run test:e2e:android
```

### Troubleshooting

Visit [Troubleshooting for React Native](https://facebook.github.io/react-native/docs/troubleshooting#content)
