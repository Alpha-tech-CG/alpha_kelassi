/**
 * Remplaçant WEB de react-native-pdf (aperçu de l'appli dans un navigateur).
 * Utilisé uniquement quand Metro bundle pour la plateforme « web » (voir
 * metro.config.js) : les builds Android / iOS gardent le vrai lecteur PDF.
 * Le navigateur affiche le PDF lui-même dans une iframe.
 */
const React = require('react')

function Pdf({ source = {}, style }) {
  const flat = Array.isArray(style) ? Object.assign({}, ...style) : style || {}
  return React.createElement('iframe', { src: source.uri, style: { border: 0, width: '100%', height: '100%', ...flat } })
}

module.exports = Pdf
module.exports.default = Pdf
