import { useMemo, useState } from 'react'
import { WebView } from 'react-native-webview'
import { colors, fonts } from '../lib/theme'
import { KATEX_CSS, KATEX_JS_B64, MARKED_JS_B64 } from '../lib/katexBundle'

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
<style>${KATEX_CSS}</style>
<script>
(function(){
  function add(b64){ var s=document.createElement('script'); s.text=decodeURIComponent(escape(atob(b64))); document.head.appendChild(s); }
  try { add("${MARKED_JS_B64}"); add("${KATEX_JS_B64}"); } catch(e){}
})();
</script>
<style>
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html,body { margin:0; padding:0; background:transparent; }
  html,body { width:100%; max-width:100%; overflow-x:hidden; }
  body { color:${colors.text}; font-family:-apple-system,'Segoe UI',Roboto,sans-serif; font-size:15px; line-height:1.55; word-wrap:break-word; overflow-wrap:break-word; }
  #c { padding-bottom:4px; }
  h1,h2,h3 { font-weight:800; margin:14px 0 6px; line-height:1.25; }
  h1 { font-size:20px; } h2 { font-size:18px; } h3 { font-size:15.5px; color:${colors.primary}; }
  p { margin:0 0 10px; } strong { font-weight:800; }
  ul,ol { margin:6px 0 10px; padding-left:22px; } li { margin:3px 0; }
  .katex { font-size:1.02em; }
  .katex-display { margin:12px 0; max-width:100%; overflow-x:auto; overflow-y:hidden; padding:2px 0; }
  /* Tables larges : conteneur défilable horizontalement (jamais coupé) */
  .tw { width:100%; max-width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; margin:10px 0; }
  table { border-collapse:collapse; margin:0; font-size:13px; }
  th,td { border:1px solid ${colors.cardBorder}; padding:6px 8px; text-align:center; }
  th { background:${colors.primaryTint}; font-weight:800; }
  img { max-width:100%; height:auto; border-radius:12px; display:block; margin:10px auto; }
</style></head>
<body>
<div id="c"></div>
<script>
(function(){
  var md = ${payload};
  var lastH = 0;
  function post(){
    var c = document.getElementById('c');
    var h = Math.max(
      document.body ? document.body.scrollHeight : 0,
      document.documentElement ? document.documentElement.scrollHeight : 0,
      c ? c.scrollHeight : 0
    );
    if(h > 0 && h !== lastH && window.ReactNativeWebView){ lastH = h; window.ReactNativeWebView.postMessage(String(h)); }
  }
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
    var c = document.getElementById('c');
    c.innerHTML = html;
    // Enveloppe les tableaux larges dans un conteneur défilable (jamais coupé).
    var tables = c.querySelectorAll('table');
    for(var i=0;i<tables.length;i++){ var w=document.createElement('div'); w.className='tw'; var t=tables[i]; t.parentNode.insertBefore(w,t); w.appendChild(t); }
    // Re-mesure quand chaque image (figure) charge.
    var imgs = c.querySelectorAll('img');
    for(var j=0;j<imgs.length;j++){ imgs[j].addEventListener('load', post); imgs[j].addEventListener('error', post); }
    // Re-mesure quand les polices KaTeX sont prêtes.
    if(document.fonts && document.fonts.ready){ document.fonts.ready.then(post); }
    // Observe tout changement de taille du contenu.
    if(window.ResizeObserver){ try { new ResizeObserver(post).observe(c); } catch(e){} }
    // Filet de sécurité : plusieurs mesures échelonnées après le rendu.
    [60,200,500,1000,1800,3000].forEach(function(t){ setTimeout(post, t); });
  }
  window.addEventListener('load', build);
  window.addEventListener('resize', post);
  build();
})();
</script>
</body></html>`
}
