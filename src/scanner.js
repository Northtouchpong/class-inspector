// Static, conservative class analyzer. No user code is executed.
const BS = new Set(`container container-fluid row col col-auto clearfix lead display-1 display-2 display-3 display-4 display-5 display-6 text-center text-start text-end text-left text-right text-muted text-primary text-secondary text-success text-danger text-warning text-info text-light text-dark text-white text-body bg-primary bg-secondary bg-success bg-danger bg-warning bg-info bg-light bg-dark bg-white bg-transparent btn btn-primary btn-secondary btn-success btn-danger btn-warning btn-info btn-light btn-dark btn-link btn-outline-primary btn-outline-secondary btn-outline-success btn-outline-danger btn-outline-warning btn-outline-info btn-outline-light btn-outline-dark btn-sm btn-lg active disabled show collapse collapsing fade modal modal-dialog modal-content modal-header modal-body modal-footer modal-title modal-backdrop nav nav-link nav-item navbar navbar-brand navbar-nav navbar-toggler navbar-collapse dropdown dropdown-menu dropdown-item dropdown-toggle dropdown-divider card card-body card-header card-footer card-title card-text alert alert-primary alert-success alert-danger alert-warning alert-info alert-secondary alert-light alert-dark badge rounded rounded-circle rounded-pill shadow shadow-sm shadow-lg border border-0 border-top border-bottom border-start border-end border-left border-right img-fluid img-thumbnail ratio table table-striped table-hover table-bordered table-responsive form-control form-label form-select form-check form-check-input form-check-label input-group input-group-text form-text valid-feedback invalid-feedback progress progress-bar spinner-border spinner-grow position-relative position-absolute position-fixed position-sticky fixed-top fixed-bottom sticky-top visually-hidden sr-only overflow-hidden overflow-auto list-group list-group-item pagination page-item page-link breadcrumb breadcrumb-item accordion accordion-item accordion-body accordion-header accordion-button offcanvas offcanvas-header offcanvas-body toast toast-header toast-body tooltip popover carousel carousel-item carousel-inner carousel-control-next carousel-control-prev carousel-indicators figure figure-img figure-caption placeholder w-100 w-75 w-50 w-25 h-100 h-75 h-50 h-25 mw-100 mh-100 vh-100 vw-100 min-vh-100 float-start float-end float-left float-right float-none d-none d-block d-inline d-inline-block d-flex d-inline-flex d-grid d-table d-table-cell d-table-row flex-row flex-column flex-wrap flex-nowrap flex-fill flex-grow-0 flex-grow-1 flex-shrink-0 flex-shrink-1 justify-content-start justify-content-end justify-content-center justify-content-between justify-content-around justify-content-evenly align-items-start align-items-end align-items-center align-items-baseline align-items-stretch align-self-start align-self-end align-self-center align-self-stretch text-wrap text-nowrap text-break text-truncate fw-bold fw-normal fw-light fw-semibold fst-italic fst-normal font-weight-bold font-weight-normal font-italic small mark invisible visible user-select-all user-select-none pe-none pe-auto pointer-events-none overflow-scroll mx-auto my-auto ms-auto me-auto ml-auto mr-auto mt-auto mb-auto p-0 p-1 p-2 p-3 p-4 p-5 m-0 m-1 m-2 m-3 m-4 m-5 gap-0 gap-1 gap-2 gap-3 gap-4 gap-5 g-0 g-1 g-2 g-3 g-4 g-5 gx-0 gx-1 gx-2 gx-3 gx-4 gx-5 gy-0 gy-1 gy-2 gy-3 gy-4 gy-5`.split(/\s+/));
const BREAKPOINTS = ['sm','md','lg','xl','xxl'];
const U = ['m','p','mt','mb','ms','me','mx','my','ml','mr','pt','pb','ps','pe','px','py','pl','pr'];
const DISPLAY = ['none','inline','inline-block','block','grid','table','table-row','table-cell','flex','inline-flex'];
const TYPO = ['start','end','center','left','right'];
const ALIGN = ['start','end','center','baseline','stretch'];
const JUSTIFY = ['start','end','center','between','around','evenly'];
const bsAllowed=(cls,version)=>{
 if(version==='3' && /^col-xs-(?:[1-9]|1[0-2])$/.test(cls)) return true;
 if(BS.has(cls)) return true;
 const bps=['',...BREAKPOINTS.filter(b=>version!=='3'||['sm','md','lg'].includes(b)).filter(b=>version!=='4'||b!=='xxl')];
 for(const bp of bps){const x=bp?`${bp}-`:'';
  if(new RegExp(`^col-${x}(?:[1-9]|1[0-2]|auto)$`).test(cls))return true;
  if(['d','order','offset'].some(prefix=>prefix==='d'?DISPLAY.some(v=>cls===`d-${x}${v}`):prefix==='order'?/^(?:[0-5]|first|last)$/.test(cls.slice((`order-${x}`).length))&&cls.startsWith(`order-${x}`):new RegExp(`^offset-${x}(?:[0-9]|1[0-2])$`).test(cls))) return true;
  if(ALIGN.some(v=>cls===`align-items-${x}${v}`||cls===`align-self-${x}${v}`)||JUSTIFY.some(v=>cls===`justify-content-${x}${v}`)||['row','column','row-reverse','column-reverse','wrap','nowrap','wrap-reverse'].some(v=>cls===`flex-${x}${v}`))return true;
  if(TYPO.some(v=>cls===`text-${x}${v}`))return true;
  for(const u of U){if(new RegExp(`^${u}-${x}(?:[0-5]|auto|n[1-5])$`).test(cls))return true;}
 }
 if(/^col-(?:[1-9]|1[0-2])$/.test(cls))return true;
 if(/^(?:w|h)-(?:auto|25|50|75|100)$/.test(cls))return true;
 if(/^(?:fs|lh)-[1-6]$/.test(cls))return true;
 if(/^(?:opacity|border-opacity|bg-opacity|text-opacity)-(?:0|10|25|50|75|100)$/.test(cls))return true;
 return false;
};
const isBootstrapish=c=>/^(?:clo|col|cont|row|text-|bg-|d-|btn|m[trblsex y]?[-]|p[trblsex y]?[-]|g[xy]?[-]|justify-|align-|flex-|navbar|card|alert|form-|border|rounded|offset|order|shadow|font-|fw-|float-|sr-|visually-)/.test(c);
const distance=(a,b)=>{let prev=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let cur=[i];for(let j=1;j<=b.length;j++)cur[j]=Math.min(cur[j-1]+1,prev[j]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur;}return prev[b.length];};
const suggestions=(wrong,candidates)=>{if(wrong.length>60)return [];return [...candidates].filter(x=>Math.abs(x.length-wrong.length)<=3&&x!==wrong).map(x=>({name:x,score:distance(wrong,x)})).sort((a,b)=>a.score-b.score||a.name.localeCompare(b.name)).filter(x=>x.score<=Math.max(2,Math.min(3,Math.floor(wrong.length*.30)))).slice(0,3);};
const dynamicKnown=()=>{const s=new Set(BS);for(let v of ['3','4','5'])for(let i=1;i<=12;i++){s.add(`col-${i}`);for(let bp of BREAKPOINTS)s.add(`col-${bp}-${i}`);}for(let bp of ['',...BREAKPOINTS]){let part=bp?`${bp}-`:'';for(let v of DISPLAY)s.add(`d-${part}${v}`);for(let v of TYPO)s.add(`text-${part}${v}`);for(let u of U)for(let i=0;i<=5;i++)s.add(`${u}-${part}${i}`);for(let v of JUSTIFY)s.add(`justify-content-${part}${v}`);for(let v of ALIGN)s.add(`align-items-${part}${v}`);}return s;};
const KNOWN=dynamicKnown();
export function getClassesFromCss(css){const output=new Set();const re=/\.([_a-zA-Z][\w-]*)/g;let m;const withoutComments=css.replace(/\/\*[\s\S]*?\*\//g,'');while((m=re.exec(withoutComments)))output.add(m[1]);return output;}
function occurrences(source){const result=[];const re=/\b(?:class|className)\s*=\s*(["'`])([\s\S]*?)\1/g;let m;while((m=re.exec(source))){const whole=m[0], value=m[2],valueStart=m.index+whole.indexOf(value);const sub=/[^\s]+/g;let tok;while((tok=sub.exec(value))){if(/[${}<>]/.test(tok[0]))continue;result.push({name:tok[0],offset:valueStart+tok.index,context:source.slice(Math.max(0,m.index-120),Math.min(source.length,re.lastIndex+100)),attributeStart:m.index});}}return result;}
function jsClassReferences(source){const s=new Set();const re=/(?:classList\.(?:add|remove|toggle|contains|replace)\s*\(|className\s*=\s*|querySelector(?:All)?\s*\()([\s\S]{0,220}?)(?:\)|;)/g;let m;while((m=re.exec(source))){for(const x of m[1].matchAll(/["'`]([^"'`]+)["'`]/g)){for(const tok of x[1].split(/\s+/)){const val=tok.replace(/^\./,'');if(/^[\w-]+$/.test(val))s.add(val);}}}return s;}
const loc=(txt,offset)=>{let line=1,col=1;for(let i=0;i<offset;i++){if(txt[i]==='\n'){line++;col=1;}else col++;}return {line,col};};
let id=0;
const supportedInAnyBootstrap = cls => ['3','4','5'].some(v => bsAllowed(cls,v));
export function analyze(files){
 id=0;const issues=[],cssClasses=new Set(),jsRefs=new Set(),used=new Set(),htmlFiles=files.filter(f=>/\.(html?|jsx|tsx|vue)$/i.test(f.path)),cssFiles=files.filter(f=>/\.css$/i.test(f.path)),jsFiles=files.filter(f=>/\.(?:[cm]?js|jsx|tsx|ts)$/i.test(f.path));
 for(const f of cssFiles)for(const c of getClassesFromCss(f.content))cssClasses.add(c);
 for(const f of jsFiles)for(const c of jsClassReferences(f.content))jsRefs.add(c);
 const add=(o)=>issues.push({id:++id,...o});
 for(const f of htmlFiles){
  const occ=occurrences(f.content);for(const o of occ)used.add(o.name);
  for(const o of occ){let {line,col}=loc(f.content,o.offset), cls=o.name;
   if(cssClasses.has(cls)||jsRefs.has(cls)||supportedInAnyBootstrap(cls))continue;
   const candidates=new Set([...cssClasses,...jsRefs,...KNOWN]);
   const found=suggestions(cls,candidates).filter(x=>cssClasses.has(x.name)||jsRefs.has(x.name)||supportedInAnyBootstrap(x.name));
   if(found.length&&found[0].score<=2&& (isBootstrapish(cls)||cssClasses.size>0)){
     add({severity:'error',title:`Possible typo: ${cls}`,message:`“${cls}” was not found in supplied CSS or the combined Bootstrap 3, 4 and 5 class rules. The closest known class is “${found[0].name}”. Verify the suggestion against your intended design.`,suggestion:found[0].name,original:cls,path:f.path,line,col,offset:o.offset,source:'html'});
   }else if(isBootstrapish(cls)){
     add({severity:'warning',title:`Unrecognized class: ${cls}`,message:`“${cls}” was not recognized in the combined Bootstrap 3, 4 and 5 rules or supplied CSS and JavaScript references. It could still be dynamically generated or supplied by external CSS.`,suggestion:found[0]?.name||null,original:cls,path:f.path,line,col,offset:o.offset,source:'html'});
   } else if(cssFiles.length){
     add({severity:'info',title:`Class not located in supplied CSS: ${cls}`,message:`No static CSS rule or JavaScript class reference for “${cls}” was found. This is informational only; styles may originate in imports, generated CSS, or external stylesheets.`,suggestion:found[0]?.name||null,original:cls,path:f.path,line,col,offset:o.offset,source:'html'});
   }
  }
  // Only flag structure when explicit .row has a direct child with a suspect typo.
  const row=/class\s*=\s*["'][^"']*\brow\b[^"']*["']/g;let r;while((r=row.exec(f.content))){const tail=f.content.slice(r.index,r.index+600);const child=tail.match(/<(?:div|section|article)[^>]*class\s*=\s*["']([^"']+)["']/g)||[];if(child.some(c=>/\bclo(?:-[\w-]+)?\b/.test(c))){/* typo occurrence already reported */}}
 }
 // Diagnostic overview only when no HTML is present
 if(!htmlFiles.length&&files.length)add({severity:'info',title:'No HTML/template files included',message:'The scanner could not compare class usage against markup. Include an HTML, JSX, TSX or Vue file for class-level analysis.',path:files[0].path,line:1,col:1,source:'general'});
 return {issues,filesCount:files.length,usedCount:used.size,cssCount:cssClasses.size};
}
export function sample(){return {html:`<div class="container">\n  <div class="row">\n    <div class="clo-md-6">\n      <h2 class="text-cneter">Welcome</h2>\n      <p class="product-summary">Your project starts here.</p>\n    </div>\n    <div class="col-md-6">Another column</div>\n  </div>\n</div>`,css:`.product-summary {\n  color: #576274;\n  line-height: 1.6;\n}`,js:`document.querySelectorAll('.product-summary').forEach((node) => {\n  node.classList.add('active');\n});`};}
