/**
 * Contournement d'un bug pnpm + expo-modules-autolinking (2.0.8).
 *
 * Le paquet `expo` fournit son propre react-native.config.js qui fixe
 * packageImportPath à `expo.modules.ExpoModulesPackage`. Mais ce fichier
 * fait `require('expo-modules-autolinking/exports')`, et le loader
 * d'expo-modules-autolinking le charge via require-from-string depuis le
 * chemin symlink littéral (non résolu) — sous la structure isolée de pnpm,
 * cette résolution échoue, l'erreur est avalée silencieusement
 * (config.js: `catch { return null; }`) et l'autolinking retombe sur un
 * import dérivé du namespace Gradle (`expo.core`), qui ne correspond pas
 * au vrai package Kotlin de la classe. Résultat : PackageList.java généré
 * avec `import expo.core.ExpoModulesPackage;` → échec de compilation
 * javac sur EAS ("cannot find symbol").
 *
 * La config niveau projet écrase celle de la lib (spread dans
 * reactNativeConfig.js), et ce fichier-ci n'importe rien, donc son
 * chargement ne peut pas échouer. À supprimer quand expo-modules-autolinking
 * résoudra le realpath avant chargement des configs.
 */
module.exports = {
  dependencies: {
    expo: {
      platforms: {
        android: {
          packageImportPath: 'import expo.modules.ExpoModulesPackage;',
        },
      },
    },
  },
}
