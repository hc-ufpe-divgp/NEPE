const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const S={caps:[],certs:[],aval:[],tab:'geral',sat:null}; const charts={};
const norm=s=>(s??'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const fmt=n=>new Intl.NumberFormat('pt-BR').format(n||0);
const esc=s=>(s??'').toString().replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
async function load(){let [a,b,c]=await Promise.all([fetch('dados/capacitacoes.json').then(r=>r.json()),fetch('dados/certificados.json').then(r=>r.json()),fetch('dados/avaliacao.json').then(r=>r.json())]);S.caps=a.registros;S.certs=b.registros;S.aval=c.registros||[];initFilters();events();render()}
function initFilters(){
 let years=[...new Set([...S.caps.map(x=>x.ano),...S.certs.map(x=>x.ano)].filter(Boolean))].sort();$('#ano').innerHTML='<option value="">Todos</option>'+years.map(x=>`<option>${x}</option>`).join('');
 let vinc=[...new Set(S.caps.map(x=>x.vinculo).filter(Boolean))].sort();$('#vinc').innerHTML='<option value="">Todos</option>'+vinc.map(x=>`<option>${esc(x)}</option>`).join('');
 let groups=[...new Set(S.caps.map(x=>x.grupo))].sort();$('#grupo').innerHTML='<option value="">Todos</option>'+groups.map(x=>`<option>${esc(x)}</option>`).join('');
 let pessoas=[...new Map(S.caps.filter(x=>x.nome).map(x=>[norm(x.nome),x.nome.trim()])).values()].sort((a,b)=>a.localeCompare(b,'pt-BR'));$('#listaTrabalhadores').innerHTML=pessoas.map(x=>`<option value="${esc(x)}"></option>`).join('');
 let av=[...new Map(S.aval.filter(x=>x.capacitacao).map(x=>[norm(x.capacitacao),x.capacitacao.trim()])).values()].sort((a,b)=>a.localeCompare(b,'pt-BR'));$('#listaAvaliacoes').innerHTML=av.map(x=>`<option value="${esc(x)}"></option>`).join('');
}
function events(){
 $$('.tab').forEach(b=>b.onclick=()=>{S.tab=b.dataset.tab;$$('.tab,.page').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#'+S.tab).classList.add('active');$('#globalFilters').style.display=S.tab==='avaliacao'?'none':'grid';render()});
 ['nome','proc','curso'].forEach(id=>$('#'+id).oninput=render);['vinc','ano','grupo'].forEach(id=>$('#'+id).onchange=render);$('#codigo').oninput=render;
 $('#trabalhadorCombo').oninput=()=>{$('#nome').value=$('#trabalhadorCombo').value;render()};
 $('#avaliacaoCombo').oninput=()=>{S.sat=null;render()}; $('#clearAval').onclick=()=>{$('#avaliacaoCombo').value='';S.sat=null;render()};
 $('#clear').onclick=()=>{['nome','proc','curso','codigo','trabalhadorCombo','avaliacaoCombo'].forEach(id=>$('#'+id).value='');['vinc','ano','grupo'].forEach(id=>$('#'+id).value='');S.sat=null;render()};
 $('#png').onclick=downloadPNG;$('#excel').onclick=downloadExcel;
}
function filters(){return {n:norm($('#nome').value),v:$('#vinc').value,p:norm($('#proc').value),a:$('#ano').value,c:norm($('#curso').value),g:$('#grupo').value}}
function fc(){let f=filters();return S.caps.filter(x=>(!f.n||norm(x.nome).includes(f.n))&&(!f.v||x.vinculo===f.v)&&(!f.p||norm(x.processo).includes(f.p))&&(!f.a||String(x.ano)===f.a)&&(!f.c||norm(x.curso).includes(f.c))&&(!f.g||x.grupo===f.g))}
function fz(){let f=filters(),code=norm($('#codigo').value);return S.certs.filter(x=>(!f.n||norm(x.nome).includes(f.n))&&(!f.v||x.vinculo===f.v)&&(!f.a||String(x.ano)===f.a)&&(!code||norm(x.codigo).includes(code)))}
function faBase(){let f=filters(),ac=norm($('#avaliacaoCombo').value);return S.aval.filter(x=>(!f.a||String(x.ano)===f.a)&&(!f.c||norm(x.capacitacao).includes(f.c))&&(!ac||norm(x.capacitacao)===ac))}
function fa(){let a=faBase();return S.sat===null?a:a.filter(x=>String(x.satisfacao)===String(S.sat))}
const uniq=(a,fn)=>new Set(a.map(fn).filter(Boolean)).size;
function count(a,fn){let m={};a.forEach(x=>{let k=fn(x)||'Não informado';m[k]=(m[k]||0)+1});return m}
function chart(id,type,labels,data,label,extra={}){if(!window.Chart)return;if(charts[id])charts[id].destroy();charts[id]=new Chart($(id),{type,data:{labels,datasets:[{label,data}]},options:{responsive:true,maintainAspectRatio:false,...extra}})}
function render(){let c=fc(),z=fz(),a=faBase();$('#gReg').textContent=fmt(c.length);$('#gPes').textContent=fmt(uniq(c,x=>norm(x.nome)));$('#gCertBase').textContent=fmt(c.filter(x=>x.natureza==='certificacao').length);$('#gCod').textContent=fmt(z.length);$('#gAval').textContent=fmt(a.length);if(S.tab==='geral')renderG(c,z);if(S.tab==='consulta')renderC(c);if(S.tab==='certificados')renderZ(z);if(S.tab==='avaliacao')renderA(a)}
function renderG(c,z){let ya=count(c,x=>x.ano),gg=count(c,x=>x.grupo),vv={};c.forEach(x=>{let k=x.vinculo||'Não informado';(vv[k]??=new Set()).add(norm(x.nome))});let zy=count(z,x=>x.ano);chart('#chAno','bar',Object.keys(ya).sort(),Object.keys(ya).sort().map(k=>ya[k]),'Registros');chart('#chGrupo','doughnut',Object.keys(gg),Object.values(gg),'Registros');chart('#chVinc','bar',Object.keys(vv),Object.values(vv).map(s=>s.size),'Pessoas');chart('#chCod','bar',Object.keys(zy).sort(),Object.keys(zy).sort().map(k=>zy[k]),'Certificados')}
function renderC(c){$('#cReg').textContent=fmt(c.length);$('#cPes').textContent=fmt(uniq(c,x=>norm(x.nome)));$('#cCursos').textContent=fmt(uniq(c,x=>norm(x.curso)));$('#cProc').textContent=fmt(uniq(c,x=>norm(x.processo)));let lim=1000;$('#capRows').innerHTML=c.slice(0,lim).map(x=>`<tr><td>${esc(x.nome)}</td><td>${esc(x.curso)}</td><td>${esc(x.data)}</td><td>${x.ano||''}</td><td>${esc(x.grupo)}</td><td>${esc(x.categoria)}</td><td>${esc(x.vinculo)}</td><td>${esc(x.processo)}</td><td>${x.natureza==='certificacao'?'Curso finalizado':'Pode incluir curso em andamento ou finalizado'}</td></tr>`).join('');$('#capInfo').textContent=`${fmt(c.length)} registros encontrados${c.length>lim?' · exibindo os primeiros '+fmt(lim):''}. A exportação Excel inclui todos os registros filtrados.`}
function renderZ(z){$('#zCert').textContent=fmt(z.length);$('#zPes').textContent=fmt(uniq(z,x=>norm(x.nome)));$('#zCod').textContent=fmt(uniq(z,x=>x.codigo));let lim=1000;$('#certRows').innerHTML=z.slice(0,lim).map(x=>`<tr><td>${esc(x.nome)}</td><td>${esc(x.data)}</td><td>${x.ano||''}</td><td>${esc(x.categoria)}</td><td>${esc(x.vinculo)}</td><td><b>${esc(x.codigo)}</b></td></tr>`).join('');$('#certInfo').textContent=`${fmt(z.length)} certificados encontrados${z.length>lim?' · exibindo os primeiros '+fmt(lim):''}.`}
function renderA(base){
 let a=S.sat===null?base:base.filter(x=>String(x.satisfacao)===String(S.sat));
 $('#aAval').textContent=fmt(a.length);$('#aCursos').textContent=fmt(uniq(a,x=>norm(x.capacitacao)));let nums=a.map(x=>Number(x.satisfacao)).filter(Number.isFinite),avg=nums.length?nums.reduce((s,x)=>s+x,0)/nums.length:0,pos=nums.length?100*nums.filter(x=>x>=4).length/nums.length:0;$('#aMedia').textContent=avg?avg.toFixed(2).replace('.',','):'—';$('#aPos').textContent=nums.length?pos.toFixed(1).replace('.',',')+'%':'—';
 let sat=count(base,x=>x.satisfacao),satLabels=Object.keys(sat).sort(); if(charts['#chSat'])charts['#chSat'].destroy(); charts['#chSat']=new Chart($('#chSat'),{type:'doughnut',data:{labels:satLabels,datasets:[{label:'Avaliações',data:satLabels.map(k=>sat[k])}]},options:{responsive:true,maintainAspectRatio:false,onClick:(evt,els)=>{if(!els.length)return;let nota=satLabels[els[0].index];S.sat=String(S.sat)===String(nota)?null:nota;renderA(base)},plugins:{legend:{position:'bottom'}}}});
 let yr=count(a,x=>x.ano);chart('#chAvalAno','bar',Object.keys(yr).sort(),Object.keys(yr).sort().map(k=>yr[k]),'Avaliações');
 renderQuestionCharts(a);
 let note=$('#satFilterNote');if(S.sat!==null){note.hidden=false;note.innerHTML=`<b>Filtro pela satisfação geral:</b> nota ${esc(S.sat)} — ${fmt(a.length)} avaliações. Clique novamente na mesma nota do gráfico para remover o filtro.`}else{note.hidden=true;note.textContent=''}
 $('#posComments').innerHTML=a.filter(x=>x.comentario_positivo).slice(0,100).map(x=>`<div class="comment">${esc(x.comentario_positivo)}</div>`).join('')||'<p class="small">Sem comentários.</p>';$('#negComments').innerHTML=a.filter(x=>x.ponto_melhoria).slice(0,100).map(x=>`<div class="comment">${esc(x.ponto_melhoria)}</div>`).join('')||'<p class="small">Sem pontos registrados.</p>'
}
function renderQuestionCharts(a){
 const qs=a.length&&a[0].respostas?Object.keys(a[0].respostas):[]; const cap=qs.slice(0,8),inst=qs.slice(8);
 stackedQuestions('#chQuestoesCap',a,cap,['SIM','PARCIAL','NÃO','Não se aplica']);
 stackedQuestions('#chQuestoesInst',a,inst,['Ótimo :D','Bom :)','Regular :|','Fraco :(']);
}
function stackedQuestions(id,a,qs,cats){
 if(charts[id])charts[id].destroy(); if(!window.Chart)return;
 const short=q=>q.length>62?q.slice(0,59)+'…':q;
 let datasets=cats.map(cat=>({label:cat,data:qs.map(q=>{let vals=a.map(x=>x.respostas?.[q]).filter(Boolean),n=vals.filter(v=>v===cat).length;return vals.length?+(100*n/vals.length).toFixed(1):0}),stack:'r'}));
 charts[id]=new Chart($(id),{type:'bar',data:{labels:qs.map(short),datasets},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,scales:{x:{stacked:true,max:100,ticks:{callback:v=>v+'%'}},y:{stacked:true}},plugins:{legend:{position:'bottom'},tooltip:{callbacks:{label:c=>`${c.dataset.label}: ${c.raw}%`}}}}});
}
async function downloadPNG(){if(!window.html2canvas){alert('Biblioteca de imagem não carregou. Verifique a conexão com a internet.');return}let cv=await html2canvas($('#capture'),{scale:1.4,backgroundColor:'#f4f7f9'}),a=document.createElement('a');a.download=`painel-nepe-${S.tab}.png`;a.href=cv.toDataURL('image/png');a.click()}
function downloadExcel(){if(!window.XLSX){alert('Biblioteca de Excel não carregou. Verifique a conexão com a internet.');return}let wb=XLSX.utils.book_new();if(S.tab==='certificados'){XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(fz()),'Certificados')}else if(S.tab==='avaliacao'){XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(fa()),'Avaliações')}else{XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(fc()),'Capacitações')}XLSX.writeFile(wb,`NEPE_${S.tab}_filtrado.xlsx`)}
load().catch(e=>{document.body.innerHTML='<div style="padding:30px;font-family:Arial"><h2>Não foi possível carregar os dados</h2><p>Abra a aplicação por um servidor web (como GitHub Pages), não diretamente pelo arquivo index.html.</p><pre>'+esc(e.message)+'</pre></div>'});
