const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const S={caps:[],certs:[],aval:[],tab:'geral',sat:null,evalYear:null}; const charts={};
const norm=s=>(s??'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const fmt=n=>new Intl.NumberFormat('pt-BR').format(n||0);
const esc=s=>(s??'').toString().replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
async function load(){let [a,b,c]=await Promise.all([fetch('dados/capacitacoes.json').then(r=>r.json()),fetch('dados/certificados.json').then(r=>r.json()),fetch('dados/avaliacao.json').then(r=>r.json())]);S.caps=a.registros;S.certs=b.registros;S.aval=c.registros||[];initFilters();events();render()}
function initFilters(){
 let years=[...new Set([...S.caps.map(x=>x.ano),...S.certs.map(x=>x.ano)].filter(Boolean))].sort();$('#ano').innerHTML='<option value="">Todos</option>'+years.map(x=>`<option>${x}</option>`).join('');
 let vinc=[...new Set(S.caps.map(x=>x.vinculo).filter(Boolean))].sort();$('#vinc').innerHTML='<option value="">Todos</option>'+vinc.map(x=>`<option>${esc(x)}</option>`).join('');
 let groups=[...new Set(S.caps.map(x=>x.grupo))].sort();$('#grupo').innerHTML='<option value="">Todos</option>'+groups.map(x=>`<option>${esc(x)}</option>`).join('');
 let pessoas=[...new Map(S.caps.filter(x=>x.nome).map(x=>[norm(x.nome),x.nome.trim()])).values()].sort((a,b)=>a.localeCompare(b,'pt-BR'));$('#listaTrabalhadores').innerHTML=pessoas.map(x=>`<option value="${esc(x)}"></option>`).join('');
 let tit=[...new Map(S.caps.filter(x=>x.curso).map(x=>[norm(x.curso),x.curso.trim()])).values()].sort((a,b)=>a.localeCompare(b,'pt-BR'));$('#listaTitulosCap').innerHTML=tit.map(x=>`<option value="${esc(x)}"></option>`).join('');
 let av=[...new Map(S.aval.filter(x=>x.capacitacao).map(x=>[norm(x.capacitacao),x.capacitacao.trim()])).values()].sort((a,b)=>a.localeCompare(b,'pt-BR'));$('#listaAvaliacoes').innerHTML=av.map(x=>`<option value="${esc(x)}"></option>`).join('');
}
function consultaModo(){return document.querySelector('#modoConsulta').value}
function certificadoComparavel(){const f=filters();return consultaModo()==='trabalhador' && !!f.n && S.caps.some(x=>norm(x.nome)===f.n) && !f.c && !f.p && !f.g}
function certificadosConsulta(){if(!certificadoComparavel())return [];const f=filters();return S.certs.filter(x=>norm(x.nome)===f.n&&(!f.v||x.vinculo===f.v)&&(!f.a||String(x.ano)===f.a))}
function events(){
 $$('.tab').forEach(b=>b.onclick=()=>{S.tab=b.dataset.tab;$$('.tab,.page').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#'+S.tab).classList.add('active');$('#globalFilters').style.display=S.tab==='avaliacao'?'none':'grid';render()});
 ['nome','proc','curso'].forEach(id=>$('#'+id).oninput=render);['vinc','ano','grupo'].forEach(id=>$('#'+id).onchange=render);$('#tituloCapCombo').oninput=()=>{$('#curso').value=$('#tituloCapCombo').value;render()};
 $('#modoConsulta').onchange=()=>{if(consultaModo()==='curso'){$('#nome').value='';$('#trabalhadorCombo').value=''}else{$('#curso').value='';$('#tituloCapCombo').value=''}render()};
 $('#trabalhadorCombo').oninput=()=>{$('#nome').value=$('#trabalhadorCombo').value;render()};
 $('#avaliacaoCombo').oninput=()=>{S.sat=null;S.evalYear=null;render()}; $('#clearAval').onclick=()=>{$('#avaliacaoCombo').value='';S.sat=null;S.evalYear=null;render()};
 $('#clear').onclick=()=>{['nome','proc','curso','tituloCapCombo','trabalhadorCombo','avaliacaoCombo'].forEach(id=>$('#'+id).value='');['vinc','ano','grupo'].forEach(id=>$('#'+id).value='');S.sat=null;S.evalYear=null;render()};
 $('#png').onclick=downloadPNG;$('#excel').onclick=downloadExcel;$('#pdf').onclick=()=>{if(S.tab!=='avaliacao'){alert('Abra a aba Avaliação de Reação para gerar o relatório.');return;}gerarRelatorioPDF()};
}
function filters(){return {n:norm($('#nome').value),v:$('#vinc').value,p:norm($('#proc').value),a:$('#ano').value,c:norm($('#curso').value),g:$('#grupo').value}}
function fc(){let f=filters();return S.caps.filter(x=>(!f.n||norm(x.nome).includes(f.n))&&(!f.v||x.vinculo===f.v)&&(!f.p||norm(x.processo).includes(f.p))&&(!f.a||String(x.ano)===f.a)&&(!f.c||norm(x.curso).includes(f.c))&&(!f.g||x.grupo===f.g))}
function fz(){let f=filters();return S.certs.filter(x=>(!f.n||norm(x.nome).includes(f.n))&&(!f.v||x.vinculo===f.v)&&(!f.a||String(x.ano)===f.a))}
function faBase(){let ac=norm($('#avaliacaoCombo').value);return S.aval.filter(x=>(!S.evalYear||String(x.ano)===String(S.evalYear))&&(!ac||norm(x.capacitacao)===ac))}
function fa(){let a=faBase();return S.sat===null?a:a.filter(x=>String(x.satisfacao)===String(S.sat))}
const uniq=(a,fn)=>new Set(a.map(fn).filter(Boolean)).size;
function count(a,fn){let m={};a.forEach(x=>{let k=fn(x)||'Não informado';m[k]=(m[k]||0)+1});return m}
function chart(id,type,labels,data,label,extra={}){if(!window.Chart)return;if(charts[id])charts[id].destroy();charts[id]=new Chart($(id),{type,data:{labels,datasets:[{label,data}]},options:{responsive:true,maintainAspectRatio:false,...extra}})}
function render(){let c=fc(),z=fz(),a=faBase();$('#gReg').textContent=fmt(c.length);$('#gPes').textContent=fmt(uniq(c,x=>norm(x.nome)));$('#gCertBase').textContent=fmt(c.filter(x=>x.natureza==='certificacao').length);$('#gCod').textContent=fmt(z.length);$('#gAval').textContent=fmt(a.length);if(S.tab==='geral')renderG(c,z);if(S.tab==='consulta')renderC(c,z);if(S.tab==='avaliacao')renderA(a)}
function renderG(c,z){let ya=count(c,x=>x.ano),gg=count(c,x=>x.grupo),vv={};c.forEach(x=>{let k=x.vinculo||'Não informado';(vv[k]??=new Set()).add(norm(x.nome))});let zy=count(z,x=>x.ano);chart('#chAno','bar',Object.keys(ya).sort(),Object.keys(ya).sort().map(k=>ya[k]),'Registros');chart('#chGrupo','doughnut',Object.keys(gg),Object.values(gg),'Registros');chart('#chVinc','bar',Object.keys(vv),Object.values(vv).map(s=>s.size),'Pessoas');chart('#chCod','bar',Object.keys(zy).sort(),Object.keys(zy).sort().map(k=>zy[k]),'Certificados')}
function compareScopeCaps(){let f=filters();return S.caps.filter(x=>(!f.n||norm(x.nome).includes(f.n))&&(!f.v||x.vinculo===f.v)&&(!f.a||String(x.ano)===f.a))}
function compareScopeCerts(){let f=filters();return S.certs.filter(x=>(!f.n||norm(x.nome).includes(f.n))&&(!f.v||x.vinculo===f.v)&&(!f.a||String(x.ano)===f.a))}
function renderC(c,z){
 const f=filters(), comparavel=certificadoComparavel(), certs=certificadosConsulta(), lim=1000;
 const participacoes=comparavel?S.caps.filter(x=>norm(x.nome)===f.n&&(!f.v||x.vinculo===f.v)&&(!f.a||String(x.ano)===f.a)):[];
 $('#cReg').textContent=fmt(c.length);$('#cCert').textContent=comparavel?fmt(certs.length):'—';
 $('#cDif').textContent=comparavel?fmt(participacoes.length-certs.length):'—';
 $('#cPes').textContent=fmt(uniq(c,x=>norm(x.nome)));$('#cCursos').textContent=fmt(uniq(c,x=>norm(x.curso)));
 $('#consultaOrientacao').textContent=consultaModo()==='curso'
 ?'Pesquisa por capacitação: certificados indisponíveis, pois a base de certificados não informa o curso associado ao código.'
 :comparavel?'Comparação quantitativa individual. Não é possível determinar quais cursos geraram certificados. Datas de participação e emissão podem ser diferentes.'
 :'Selecione um trabalhador pelo nome completo e retire os filtros de curso, grupo e processo para comparar participações e certificados.';
 $('#capRows').innerHTML=c.slice(0,lim).map(x=>`<tr><td>${esc(x.nome)}</td><td>${esc(x.curso)}</td><td>${esc(x.data)}</td><td>${x.ano||''}</td><td>${esc(x.grupo)}</td><td>${esc(x.categoria)}</td><td>${esc(x.vinculo)}</td><td>${esc(x.processo)}</td><td>${x.natureza==='certificacao'?'Curso finalizado':'Pode incluir curso em andamento ou finalizado'}</td></tr>`).join('');
 $('#capInfo').textContent=`${fmt(c.length)} registros encontrados${c.length>lim?' · exibindo os primeiros '+fmt(lim):''}.`;
 $('#certRows').innerHTML=certs.slice(0,lim).map(x=>`<tr><td>${esc(x.nome)}</td><td>${esc(x.data)}</td><td>${x.ano||''}</td><td>${esc(x.categoria)}</td><td>${esc(x.vinculo)}</td><td><b>${esc(x.codigo)}</b></td></tr>`).join('');
 $('#certInfo').textContent=comparavel?`${fmt(certs.length)} certificados localizados para o trabalhador. Fonte: Base de Certificados HC-UFPE/NEPE.`:'Certificados não exibidos: pesquisa não comparável.';
}
function brDate(s){if(!s)return '';let [y,m,d]=s.split('-');return `${d}/${m}/${y}`}
function renderYearButtons(source){let years=[...new Set(source.map(x=>x.ano).filter(Boolean))].sort();let box=$('#yearButtons');box.innerHTML=`<button class="yearBtn ${S.evalYear===null?'active':''}" data-year="">Todos</button>`+years.map(y=>`<button class="yearBtn ${String(S.evalYear)===String(y)?'active':''}" data-year="${esc(y)}">${esc(y)}</button>`).join('');box.querySelectorAll('.yearBtn').forEach(b=>b.onclick=()=>{let y=b.dataset.year||null;S.evalYear=String(S.evalYear)===String(y)&&y!==null?null:y;S.sat=null;renderA(faBase())})}
function renderA(base){
 let ac=norm($('#avaliacaoCombo').value);$('#reportCurso').textContent='Capacitação: '+($('#avaliacaoCombo').value||'Todas as capacitações');$('#reportPeriodo').textContent='Ano: '+(S.evalYear||'Todos')+' · Relatório gerado em '+new Date().toLocaleDateString('pt-BR');let yearSource=S.aval.filter(x=>(!ac||norm(x.capacitacao)===ac));renderYearButtons(yearSource);
 let a=S.sat===null?base:base.filter(x=>String(x.satisfacao)===String(S.sat));
 $('#aAval').textContent=fmt(a.length);$('#aCursos').textContent=fmt(uniq(a,x=>norm(x.capacitacao)));let nums=a.map(x=>Number(x.satisfacao)).filter(Number.isFinite),avg=nums.length?nums.reduce((s,x)=>s+x,0)/nums.length:0,pos=nums.length?100*nums.filter(x=>x>=4).length/nums.length:0;$('#aMedia').textContent=avg?avg.toFixed(2).replace('.',','):'—';$('#aPos').textContent=nums.length?pos.toFixed(1).replace('.',',')+'%':'—';let ds=a.map(x=>x.data_avaliacao).filter(Boolean).sort();$('#aData').textContent=!ds.length?'—':ds[0]===ds[ds.length-1]?brDate(ds[0]):`${brDate(ds[0])} a ${brDate(ds[ds.length-1])}`;
 let sat=count(base,x=>x.satisfacao),satLabels=Object.keys(sat).sort();if(charts['#chSat'])charts['#chSat'].destroy();charts['#chSat']=new Chart($('#chSat'),{type:'doughnut',data:{labels:satLabels,datasets:[{label:'Avaliações',data:satLabels.map(k=>sat[k]),backgroundColor:satLabels.map(k=>({1:'#d73027',2:'#fc8d59',3:'#fee08b',4:'#74add1',5:'#1f4e79'}[String(k)]||'#9aa0a6'))}]},options:{responsive:true,maintainAspectRatio:false,onClick:(evt,els)=>{if(!els.length)return;let nota=satLabels[els[0].index];S.sat=String(S.sat)===String(nota)?null:nota;renderA(base)},plugins:{legend:{position:'right',labels:{boxWidth:10,font:{size:10}}}}}});
 renderQuestionCharts(a);let note=$('#satFilterNote');if(S.sat!==null){note.hidden=false;note.innerHTML=`<b>Filtro pela satisfação geral:</b> nota ${esc(S.sat)} — ${fmt(a.length)} avaliações. Clique novamente na nota para remover.`}else{note.hidden=true;note.textContent=''}$('#posComments').innerHTML=a.filter(x=>x.comentario_positivo).map(x=>`<div class="comment">${esc(x.comentario_positivo)}</div>`).join('')||'<p class="small">Sem comentários.</p>';$('#negComments').innerHTML=a.filter(x=>x.ponto_melhoria).map(x=>`<div class="comment">${esc(x.ponto_melhoria)}</div>`).join('')||'<p class="small">Sem pontos registrados.</p>'}
function renderQuestionCharts(a){const qs=a.length&&a[0].respostas?Object.keys(a[0].respostas):[];renderMiniSet('#questionCapGrid',a,qs.slice(0,8));renderMiniSet('#questionInstGrid',a,qs.slice(8))}
function renderMiniSet(container,a,qs){
 const box=$(container);
 const palette={'SIM':'#2d9fe5','PARCIAL':'#ff6584','NÃO':'#d73d40','NÃO SE APLICA':'#9aa6b2'};
 box.innerHTML=qs.map(q=>{
   const m=count(a,x=>x.respostas?.[q]);const entries=Object.entries(m).sort((x,y)=>y[1]-x[1]);
   const total=entries.reduce((sum,x)=>sum+x[1],0);
   const segments=entries.map(([label,n])=>{const pct=total?100*n/total:0;const key=norm(label).toUpperCase();const color=palette[key]||'#607d8b';return `<span style="width:${pct}%;background:${color}" title="${esc(label)}: ${fmt(n)} (${pct.toFixed(1).replace('.',',')}%)"></span>`}).join('');
   const rows=entries.map(([label,n])=>{const pct=total?100*n/total:0;const key=norm(label).toUpperCase();const color=palette[key]||'#607d8b';return `<div class="responseRow"><span class="responseLabel"><i style="background:${color}"></i>${esc(label)}</span><strong>${pct.toFixed(1).replace('.',',')}%</strong><span class="responseCount">${fmt(n)} resp.</span></div>`}).join('');
   return `<article class="miniCard responseCard"><h3>${esc(q)}</h3><div class="responseBar" role="img" aria-label="Distribuição das respostas">${segments}</div><div class="responseDetails">${rows||'<p>Sem respostas</p>'}</div><p class="responseTotal">${fmt(total)} respostas válidas</p></article>`;
 }).join('');
}

function gerarRelatorioPDF(){
  if(S.tab!=='avaliacao'){alert('Selecione Avaliação de Reação.');return;}
  // PDF uses the selected course/year but does not inherit the interactive satisfaction click filter.
  const a=faBase(), titulo=$('#avaliacaoCombo').value.trim()||'Todas as capacitações';
  const datas=a.map(x=>x.data_avaliacao).filter(Boolean).sort();
  const periodo=datas.length?(brDate(datas[0])+(datas.length>1?' a '+brDate(datas[datas.length-1]):'')):'Sem data';
  const notas=[1,2,3,4,5], validas=a.map(x=>Number(x.satisfacao)).filter(x=>notas.includes(x));
  const percent=(n,d)=>d?(100*n/d).toFixed(1).replace('.',',')+'%':'—';
  const media=validas.length?(validas.reduce((t,n)=>t+n,0)/validas.length).toFixed(2).replace('.',','):'—';
  const positivos=validas.filter(n=>n>=4).length;
  const keys=[...new Set(a.flatMap(x=>Object.keys(x.respostas||{})))];
  const trows=(items)=>items.map(([rotulo,n])=>`<tr><td>${esc(rotulo)}</td><td class="num">${fmt(n)}</td><td class="num">${percent(n,items.reduce((s,x)=>s+x[1],0))}</td></tr>`).join('');
  const satisfacao=notas.map(n=>['Nota '+n,validas.filter(x=>x===n).length]);
  const pergunta=(q,i)=>{
    const respostas=a.map(x=>x.respostas?.[q]).filter(v=>v!==null&&v!==undefined&&String(v).trim()!=='');
    const contagens=new Map();
    respostas.forEach(v=>{const k=String(v).trim();contagens.set(k,(contagens.get(k)||0)+1)});
    const linhas=[...contagens].sort((a,b)=>b[1]-a[1]).map(([rotulo,n])=>`<tr><td>${esc(rotulo)}</td><td class="num">${fmt(n)}</td><td class="num">${percent(n,respostas.length)}</td></tr>`).join('');
    return `<div class="report-question"><h3>${i+1}. ${esc(q)}</h3><table><thead><tr><th>Resposta</th><th>Quantidade</th><th>Percentual</th></tr></thead><tbody>${linhas||'<tr><td colspan="3">Sem respostas</td></tr>'}</tbody><tfoot><tr><th>Total de respostas válidas</th><th class="num">${fmt(respostas.length)}</th><th class="num">${respostas.length?'100,0%':'—'}</th></tr></tfoot></table></div>`;
  };
  const comentarios=(campo)=>{const vals=a.map(x=>x[campo]).filter(x=>x&&String(x).trim());return `<p class="report-meta">${fmt(vals.length)} comentário(s)</p>${vals.length?vals.map((v,i)=>`<p class="report-comment"><b>${i+1}.</b> ${esc(v)}</p>`).join(''):'<p>Sem comentários registrados.</p>'}`};
  const blocos=keys.map(pergunta);
  const out=document.querySelector('#printReport');
  out.innerHTML=`<div class="report-head"><h1>Relatório de Avaliação de Reação</h1><p>NEPE · HC-UFPE</p><p><b>Capacitação:</b> ${esc(titulo)}</p><p><b>Ano:</b> ${esc(S.evalYear||'Todos')} &nbsp; <b>Período das avaliações:</b> ${esc(periodo)}</p><p><b>Emissão:</b> ${new Date().toLocaleDateString('pt-BR')}</p></div>
  <h2>1. Síntese dos resultados</h2><table class="summary"><tbody>
  <tr><th>Formulários recebidos</th><td>${fmt(a.length)}</td></tr>
  <tr><th>Capacitações avaliadas</th><td>${fmt(uniq(a,x=>norm(x.capacitacao)))}</td></tr>
  <tr><th>Respostas válidas para satisfação</th><td>${fmt(validas.length)}</td></tr>
  <tr><th>Satisfação média (1 a 5)</th><td>${media}</td></tr>
  <tr><th>Notas 4 ou 5</th><td>${fmt(positivos)} (${percent(positivos,validas.length)})</td></tr></tbody></table>
  <h2>2. Distribuição da satisfação geral</h2><table><thead><tr><th>Nota</th><th>Quantidade</th><th>Percentual</th></tr></thead><tbody>${trows(satisfacao)}</tbody><tfoot><tr><th>Total de respostas válidas</th><th class="num">${fmt(validas.length)}</th><th class="num">${validas.length?'100,0%':'—'}</th></tr></tfoot></table>
  <h2>3. Questões da capacitação</h2>${blocos.slice(0,8).join('')||'<p>Sem respostas.</p>'}
  <h2>4. Avaliação do instrutor</h2>${blocos.slice(8).join('')||'<p>Sem respostas.</p>'}
  <h2>5. Comentários positivos</h2>${comentarios('comentario_positivo')}
  <h2>6. Pontos de melhoria</h2>${comentarios('ponto_melhoria')}
  <p class="report-foot">Percentuais calculados sobre as respostas válidas de cada pergunta. Valores podem não somar exatamente 100% devido ao arredondamento. Os comentários são reproduzidos integralmente conforme os registros.</p>`;
  document.body.classList.add('printing-report');
  const cleanup=()=>{document.body.classList.remove('printing-report');window.removeEventListener('afterprint',cleanup)};
  window.addEventListener('afterprint',cleanup);
  requestAnimationFrame(()=>requestAnimationFrame(()=>window.print()));
}

async function downloadPNG(){if(!window.html2canvas){alert('Biblioteca de imagem não carregou. Verifique a conexão com a internet.');return}let cv=await html2canvas($('#capture'),{scale:1.4,backgroundColor:'#f4f7f9'}),a=document.createElement('a');a.download=`painel-nepe-${S.tab}.png`;a.href=cv.toDataURL('image/png');a.click()}
function downloadExcel(){if(!window.XLSX){alert('Biblioteca de Excel não carregou. Verifique a conexão com a internet.');return}let wb=XLSX.utils.book_new();if(S.tab==='avaliacao'){XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(fa()),'Avaliações')}else{XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(fc()),'Capacitações');if(S.tab==='consulta')XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(certificadosConsulta()),'Certificados')}XLSX.writeFile(wb,`NEPE_${S.tab}_filtrado.xlsx`)}
load().catch(e=>{document.body.innerHTML='<div style="padding:30px;font-family:Arial"><h2>Não foi possível carregar os dados</h2><p>Abra a aplicação por um servidor web (como GitHub Pages), não diretamente pelo arquivo index.html.</p><pre>'+esc(e.message)+'</pre></div>'});
