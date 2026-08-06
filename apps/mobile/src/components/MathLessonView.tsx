import { useMemo, useState } from 'react'
import { WebView } from 'react-native-webview'
import { colors, fonts } from '../lib/theme'

/**
 * Rendu des leçons avec mathématiques natives (Markdown + LaTeX).
 *
 * Le composant léger `LessonContent` ne sait pas afficher le LaTeX. Ici on
 * réutilise le patron WebView + KaTeX (déjà utilisé dans `lecon/[id]`) pour un
 * rendu typographié : fractions, intégrales, limites, vecteurs…
 *
 * Les formules $...$ / $$...$$ sont protégées AVANT le parsing Markdown puis
 * rendues par KaTeX (évite que Markdown ne casse les `_` et `*` des formules).
 * La hauteur s'ajuste automatiquement via postMessage.
 */
export function MathLessonView({ content }: { content: string }) {
  const [height, setHeight] = useState(120)

  const html = useMemo(() => buildHtml(content ?? ''), [content])

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html, baseUrl: 'https://kelassi.app/' }}
      style={{ height, backgroundColor: 'transparent' }}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      setSupportMultipleWindows={false}
      onMessage={(e) => {
        const h = Number(e.nativeEvent.data)
        if (!Number.isNaN(h) && h > 0) setHeight(Math.ceil(h))
      }}
    />
  )
}

function buildHtml(md: string): string {
  const payload = JSON.stringify(md)
  return `<!DOCTYPE html><html><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"/>
<script src="https://cdn.jsdelivr.net/npm/marked@12/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<style>
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html,body { margin:0; padding:0; background:transparent; }
  body { color:${colors.text}; font-family:-apple-system,'Segoe UI',Roboto,sans-serif; font-size:15px; line-height:1.55; }
  h1,h2,h3 { font-weight:800; margin:14px 0 6px; line-height:1.25; }
  h2 { font-size:18px; } h3 { font-size:15.5px; color:${colors.primary}; }
  p { margin:0 0 10px; } strong { font-weight:800; }
  ul,ol { margin:6px 0 10px; padding-left:22px; } li { margin:3px 0; }
  .katex { font-size:1.02em; }
  .katex-display { margin:12px 0; overflow-x:auto; overflow-y:hidden; padding:2px 0; }
  table { border-collapse:collapse; width:100%; margin:10px 0; font-size:13px; }
  th,td { border:1px solid ${colors.cardBorder}; padding:6px 8px; text-align:center; }
  th { background:${colors.primaryTint}; font-weight:800; }
  img { max-width:100%; border-radius:12px; }
</style></head>
<body>
<div id="c"></div>
<script>
(function(){
  var md = ${payload};
  function build(){
    if(!window.marked || !window.katex){ return setTimeout(build, 80); }
    var maths=[];
    md = md.replace(/\\$\\$([\\s\\S]+?)\\$\\$/g,function(_,x){maths.push({d:true,t:x});return '@@M'+(maths.length-1)+'@@';});
    md = md.replace(/\\$([^\\n$]+?)\\$/g,function(_,x){maths.push({d:false,t:x});return '@@M'+(maths.length-1)+'@@';});
    var html = window.marked.parse(md, {breaks:true});
    html = html.replace(/@@M(\\d+)@@/g,function(_,i){
      var o=maths[+i];
      try { return window.katex.renderToString(o.t,{displayMode:o.d,throwOnError:false}); }
      catch(e){ return o.t; }
    });
    document.getElementById('c').innerHTML = html;
    setTimeout(post, 60);
  }
  function post(){
    var h = document.body.scrollHeight;
    if(window.ReactNativeWebView){ window.ReactNativeWebView.postMessage(String(h)); }
  }
  window.addEventListener('load', build);
  build();
})();
</script>
</body></html>`
}
