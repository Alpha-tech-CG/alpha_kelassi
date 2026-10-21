// Configuration Metro par défaut d'Expo, avec deux ajustements.
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

// 1. Une seule copie de React dans l'appli.
//    Dans ce monorepo pnpm, le site web utilise React 19 et l'appli React 18.
//    Les paquets qui n'embarquent pas leur propre lien vers React (expo-router,
//    @expo/metro-runtime, expo-modules-core, polices…) le cherchaient dans le
//    dossier partagé de pnpm, où React 19 a été remonté : l'appli chargeait alors
//    DEUX React (écran blanc / « Objects are not valid as a React child »).
//    On résout donc toujours react et react-dom depuis l'appli elle-même.
const APP_ORIGIN = path.join(__dirname, 'package.json')
const SINGLETONS = /^(react|react-dom)(\/.*)?$/

// 2. Aperçu WEB de l'appli (expo start --web) : les modules purement natifs sont
//    remplacés par les petits équivalents de web-stubs/. Les builds Android / iOS
//    ne sont pas concernés.
const WEB_STUBS = {
  'expo-secure-store': path.join(__dirname, 'web-stubs', 'expo-secure-store.js'),
  'react-native-pdf': path.join(__dirname, 'web-stubs', 'react-native-pdf.js'),
  'react-native-webview': path.join(__dirname, 'web-stubs', 'react-native-webview.js'),
}

const defaultResolve = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolve = defaultResolve ?? context.resolveRequest
  if (platform === 'web' && WEB_STUBS[moduleName]) {
    return { type: 'sourceFile', filePath: WEB_STUBS[moduleName] }
  }
  if (SINGLETONS.test(moduleName) && context.originModulePath !== APP_ORIGIN) {
    return resolve({ ...context, originModulePath: APP_ORIGIN }, moduleName, platform)
  }
  return resolve(context, moduleName, platform)
}

module.exports = config
