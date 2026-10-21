import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze,sample,getClassesFromCss} from '../src/scanner.js';
test('identifies Bootstrap transposition and typo without flagging supplied custom class',()=>{
 const {html,css,js}=sample();
 const r=analyze([{path:'index.html',content:html},{path:'styles.css',content:css},{path:'app.js',content:js}]);
 const fixes=r.issues.filter(x=>x.severity==='error').map(x=>[x.original,x.suggestion]);
 assert.deepEqual(fixes,[['clo-md-6','col-md-6'],['text-cneter','text-center']]);
 assert.equal(r.issues.some(x=>x.original==='product-summary'),false);
});
test('does not invent errors for arbitrary custom class without supplied CSS',()=>{
 const r=analyze([{path:'index.html',content:'<div class="widget-custom">Hi</div>'}]);
 assert.equal(r.issues.length,0);
});
test('reads CSS selectors',()=>{
 assert.equal(getClassesFromCss('.card-item:hover, .another { color: red }').has('card-item'),true);
});
test('reports missing template context',()=>{
 const r=analyze([{path:'styles.css',content:'.hello {}'}]);
 assert.equal(r.issues[0].severity,'info');
});

test('automatically accepts known classes from multiple Bootstrap generations',()=>{
 const result=analyze([{path:'index.html',content:'<div class="col-xs-6 col-md-6 ml-auto ms-auto text-left text-start"></div>'}]);
 assert.equal(result.issues.some(x=>['col-md-6','ml-auto','ms-auto','text-left','text-start'].includes(x.original)),false);
});
test('reports misspelled class without selecting a framework',()=>{
 const result=analyze([{path:'index.html',content:'<div class="clo-md-6"></div>'}]);
 assert.equal(result.issues.some(x=>x.original==='clo-md-6'&&x.suggestion==='col-md-6'),true);
});
