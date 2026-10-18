import { useMemo, useRef, useState } from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import { colors } from '../lib/theme'
import { KATEX_CSS, KATEX_JS_B64, MARKED_JS_B64 } from '../lib/katexBundle'
import { CognixLoader } from './CognixLoader'

/**
 * Rendu des leçons avec mathématiques natives (Markdown + LaTeX).
 *
 * Le composant léger `LessonContent` ne sait pas afficher le LaTeX. Ici on
 * réutilise le patron WebView + KaTeX pour un rendu typographié : fractions,
 * intégrales, limites, vecteurs…
 *
 * Les formules $...$ / $$...$$ sont protégées AVANT le parsing Markdown puis
 * rendues par KaTeX (évite que Markdown ne casse les `_` et `*` des formules).
 *
 * Deux modes :
 * - `MathLessonReader` (à privilégier) : une seule WebView qui occupe l'écran et
 *   défile elle-même. Défilement natif, fluide, quelle que soit la longueur.
 * - `MathLessonView` : WebView « en ligne » dans un ScrollView, hauteur ajustée
 *   par postMessage. Réservé aux contenus courts (énoncés, cartes) : sur un long
 *   cours, chaque changement de hauteur fait sauter le défilement.
 */
export function MathLessonView({ content }: { content: string }) {
  const [height, setHeight] = useState(60)
  const last = useRef(0)
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
        const h = Math.ceil(Number(e.nativeEvent.data))
        // Ignore les micro-variations : chaque setHeight relance la mise en page du parent.
        if (!Number.isNaN(h) && h > 0 && Math.abs(h - last.current) > 4) {
          last.current = h
          setHeight(h)
        }
      }}
    />
  )
}

/** Lecteur plein écran : la WebView défile elle-même (à placer dans un parent `flex: 1`). */
export function MathLessonReader({ content, title }: { content: string; title?: string }) {
  const html = useMemo(() => buildHtml(content ?? '', { reader: true, title: title ?? '' }), [content, title])
  return (
    <WebView
      originWhitelist={['*']}
      source={{ html, baseUrl: 'https://kelassi.app/' }}
      style={{ flex: 1, backgroundColor: '#fff' }}
      scrollEnabled
      showsVerticalScrollIndicator
      setSupportMultipleWindows={false}
      overScrollMode="never"
      decelerationRate="normal"
      startInLoadingState
      renderLoading={() => (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#fff', justifyContent: 'center' }}>
          <CognixLoader compact label="Ouverture du cours…" />
        </View>
      )}
    />
  )
}

function buildHtml(md: string, opts: { reader?: boolean; title?: string } = {}): string {
  const payload = JSON.stringify(md)
  const titlePayload = JSON.stringify(opts.title ?? '')
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
  body.reader { background:#fff; padding:18px 18px 40px; }
  #rt { font-size:21px; font-weight:800; color:${colors.text}; margin:0 0 14px; line-height:1.25; }
  #rt:empty { display:none; }
  h1,h2,h3,h4 { font-weight:800; margin:18px 0 8px; line-height:1.25; color:${colors.primary}; }
  h1 { font-size:20px; } h2 { font-size:18px; padding-bottom:6px; border-bottom:2px solid ${colors.primaryTint}; }
  h3 { font-size:16px; } h4 { font-size:15px; color:${colors.text}; }
  #c > :first-child { margin-top:0; }
  p { margin:0 0 10px; } strong { font-weight:800; }
  ul,ol { margin:6px 0 10px; padding-left:22px; } li { margin:4px 0; }
  blockquote { margin:10px 0; padding:10px 12px; background:${colors.primaryTint}; border-left:4px solid ${colors.primary}; border-radius:10px; }
  blockquote p:last-child { margin-bottom:0; }
  code { background:#F1F4F9; padding:1px 5px; border-radius:5px; font-size:13.5px; }
  hr { border:0; border-top:1px solid ${colors.cardBorder}; margin:16px 0; }
  .katex { font-size:1.04em; }
  .katex-display { margin:12px 0; max-width:100%; overflow-x:auto; overflow-y:hidden; padding:4px 0; }
  /* Tableaux : défilement horizontal si trop larges, texte jamais écrasé. */
  .tw { width:100%; max-width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; margin:12px 0; border:1px solid ${colors.cardBorder}; border-radius:12px; }
  .hint { font-size:11px; color:${colors.textMuted}; text-align:center; margin:-6px 0 12px; }
  table { border-collapse:collapse; margin:0; font-size:13.5px; min-width:100%; }
  th,td { border-bottom:1px solid ${colors.cardBorder}; border-right:1px solid ${colors.cardBorder}; padding:8px 10px; text-align:left; vertical-align:top; min-width:84px; max-width:240px; line-height:1.4; }
  th:last-child,td:last-child { border-right:0; }
  tr:last-child td { border-bottom:0; }
  th { background:${colors.primary}; color:#fff; font-weight:800; }
  tbody tr:nth-child(even) td { background:#F7FAFF; }
  img { max-width:100%; height:auto; border-radius:12px; display:block; margin:10px auto; }
</style></head>
<body class="${opts.reader ? 'reader' : ''}">
<div id="rt"></div>
<div id="c"></div>
<script>
(function(){
  var md = ${payload};
  document.getElementById('rt').textContent = ${titlePayload};
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
  // Filet de sécurité avant innerHTML : le contenu vient des cours (rédigés
  // par l'équipe pédagogique), mais on ne fait pas confiance à 100% à la
  // chaîne d'import — on retire scripts, gestionnaires d'événements inline
  // et URLs javascript:/data: avant d'injecter le HTML rendu par marked/katex.
  function sanitize(html){
    // NB : on est dans un template literal TS — chaque antislash doit être
    // doublé, et la balise fermante de script doit rester échappée (antislash
    // avant la barre), sinon elle fermerait ce bloc et tout le rendu KaTeX tomberait.
    return html
      .replace(/<script[\\s\\S]*?<\\/script>/gi, '')
      .replace(/<iframe[\\s\\S]*?<\\/iframe>/gi, '')
      .replace(/\\son\\w+\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]*)/gi, '')
      .replace(/(href|src)\\s*=\\s*("javascript:[^"]*"|'javascript:[^']*'|"data:text\\/html[^"]*"|'data:text\\/html[^']*')/gi, '$1="#"');
  }
  var built = false;
  var ro = null;
  function build(){
    if(built) return;
    if(!window.marked || !window.katex){ return setTimeout(build, 80); }
    built = true;
    var maths=[];
    // \\diagbox (case d'en-tête barrée des tableaux statistiques) n'existe pas dans KaTeX.
    md = md.replace(/\\\\diagbox\\{([^}]*)\\}\\{([^}]*)\\}/g,function(_,a,b){return b ? a+' \\\\backslash '+b : ' \\\\backslash '+a;});
    md = md.replace(/\\$\\$([\\s\\S]+?)\\$\\$/g,function(_,x){maths.push({d:true,t:x});return '@@M'+(maths.length-1)+'@@';});
    // « $ » seul en fin de ligne … « $ » seul en début de ligne : bloc (tableaux \\begin{array}).
    // Les deux « $ » sont seuls sur leur ligne, sans ligne vide ni autre « $ » entre eux.
    md = md.replace(/(^|\\n)[ \\t]*\\$[ \\t]*\\n([^$]+?)\\n[ \\t]*\\$[ \\t]*(?=\\n|$)/g,function(all,pre,x){
      if(/\\n[ \\t]*\\n/.test(x)) return all;
      maths.push({d:true,t:x});return pre+'@@M'+(maths.length-1)+'@@';});
    md = md.replace(/\\$([^\\n$]+?)\\$/g,function(_,x){maths.push({d:false,t:x});return '@@M'+(maths.length-1)+'@@';});
    var html = window.marked.parse(md, {breaks:true});
    html = html.replace(/@@M(\\d+)@@/g,function(_,i){
      var o=maths[+i];
      // « A\\' » (prime saisi avec un antislash dans certains cours) → « A' ».
      try { return window.katex.renderToString(o.t.replace(/\\\\'/g,"'"),{displayMode:o.d,throwOnError:false}); }
      catch(e){ return o.t; }
    });
    var c = document.getElementById('c');
    c.innerHTML = sanitize(html);
    // Enveloppe les tableaux larges dans un conteneur défilable (jamais coupé).
    var tables = c.querySelectorAll('table');
    for(var i=0;i<tables.length;i++){ var w=document.createElement('div'); w.className='tw'; var t=tables[i]; t.parentNode.insertBefore(w,t); w.appendChild(t); 
      if(t.scrollWidth > w.clientWidth + 4){ var hn=document.createElement('div'); hn.className='hint'; hn.textContent='‹ Fais glisser le tableau pour tout voir ›'; w.parentNode.insertBefore(hn, w.nextSibling); } }
    // Re-mesure quand chaque image (figure) charge.
    var imgs = c.querySelectorAll('img');
    // { once:true } : le listener se retire tout seul après la première mesure.
    for(var j=0;j<imgs.length;j++){
      imgs[j].addEventListener('load', post, { once:true });
      imgs[j].addEventListener('error', post, { once:true });
    }
    // Re-mesure quand les polices KaTeX sont prêtes.
    if(document.fonts && document.fonts.ready){ document.fonts.ready.then(post); }
    // Observe tout changement de taille du contenu (déconnecté au teardown).
    if(window.ResizeObserver){ try { ro = new ResizeObserver(post); ro.observe(c); } catch(e){} }
    // Filet de sécurité : plusieurs mesures échelonnées après le rendu.
    [60,200,500,1000,1800,3000].forEach(function(t){ setTimeout(post, t); });
  }
  window.addEventListener('load', build, { once:true });
  window.addEventListener('resize', post);
  // Teardown : le listener 'resize' est le seul persistant, on le retire quand
  // le document est déchargé (navigation WebView, remontée du composant).
  window.addEventListener('pagehide', function(){
    window.removeEventListener('resize', post);
    window.removeEventListener('load', build);
    if(ro){ try { ro.disconnect(); } catch(e){} ro = null; }
  }, { once:true });
  build();
})();
</script>
</body></html>`
}
