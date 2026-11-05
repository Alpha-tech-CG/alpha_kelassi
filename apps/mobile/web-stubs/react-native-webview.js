/**
 * Remplaçant WEB de react-native-webview (aperçu de l'appli dans un navigateur).
 * Utilisé uniquement quand Metro bundle pour la plateforme « web » (voir
 * metro.config.js) : les builds Android / iOS gardent le vrai module.
 *
 * Affiche le HTML (source.html) ou l'URL (source.uri) dans une iframe et relaie
 * window.ReactNativeWebView.postMessage(...) vers la prop onMessage, comme le
 * module natif (utilisé par MathLessonView pour ajuster la hauteur).
 */
const React = require('react')

function WebView({ source = {}, style, onMessage }) {
  const ref = React.useRef(null)

  React.useEffect(() => {
    if (!onMessage) return undefined
    const listener = (e) => {
      if (ref.current && e.source === ref.current.contentWindow && e.data && e.data.__rnwv) {
        onMessage({ nativeEvent: { data: e.data.data } })
      }
    }
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [onMessage])

  const bridge = '<script>window.ReactNativeWebView={postMessage:function(d){parent.postMessage({__rnwv:true,data:d},"*")}}</script>'
  const flat = Array.isArray(style) ? Object.assign({}, ...style) : style || {}
  return React.createElement('iframe', {
    ref,
    srcDoc: source.html != null ? bridge + source.html : undefined,
    src: source.html == null ? source.uri : undefined,
    style: { border: 0, width: '100%', ...flat },
  })
}

module.exports = { WebView, default: WebView }
