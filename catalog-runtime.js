(function(){
 const localProducts=Array.isArray(window.WAO_LOCAL_PRODUCTS)?window.WAO_LOCAL_PRODUCTS.filter(p=>p.status!=='draft'):[];
 const money=value=>value==null?(lang()==='zh'?'询价':'Inquiry'):`¥${Number(value).toLocaleString('zh-CN')}`;
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const lang=()=>document.documentElement.lang||'en';
 const productNameMap={'沙发单人位':'Single Sofa','沙发双人位':'Two-seat Sofa','沙发三人位':'Three-seat Sofa','沙发四人位':'Four-seat Sofa','茶几':'Coffee Table','茶几桌':'Coffee Table','餐椅':'Dining Chair','餐桌':'Dining Table','床':'Bed','床头柜':'Nightstand','书桌':'Desk','书柜':'Bookcase','边几':'Side Table','角几':'Side Table','玄关台':'Console Table','玄关柜':'Entryway Cabinet','衣柜':'Wardrobe'};
 const collectionKeys={'Fuyi Collection':'collection.fuyi','Art Collection':'collection.art','RH-Style Collection':'collection.rh','Puffpop sofa':'collection.puffpop'};
 const roomKeys={'Living Room':'room.living','Dining Room':'room.dining','Bedroom':'room.bedroom','Home Office':'room.office','Entryway & Hallway':'room.entryway','Other':'room.other'};
 const t=(key,currentLang=lang())=>(typeof I18N==='object'&&I18N[currentLang]?.[key])||(typeof I18N==='object'&&I18N.en?.[key])||key;
 const localName=(value,map,currentLang=lang())=>map[value]?t(map[value],currentLang):value;
 const englishName=p=>productNameMap[p.nameZh]||p.category||p.name||p.sku;
 const displayName=(p,currentLang=lang())=>currentLang==='zh'?(p.nameZh||p.name||p.sku):englishName(p);
 const cleanStyle=(style,currentLang=lang())=>{const value=String(style||'').trim();if(!value)return '';if(currentLang==='zh'){const chinese=value.replace(/^[A-Za-z-]+(?:\s+[A-Za-z-]+)*\s*/,'').trim();return chinese||value}return value.split(/\s+/)[0]==='British'?'British Manor':value.replace(/[\u4e00-\u9fff].*$/,'').trim()};
 const formatDimensions=value=>{const text=String(value||'').trim();if(!text)return '';return /\b(mm|cm|m|in|inch|英寸)\b/i.test(text)?text:`${text} mm`};
 const localized=(p,key,currentLang=lang())=>{
  if(currentLang==='zh')return p[key]||'';
  if(key==='description')return 'Imported mahogany solid wood frame with hand carving, aged gold-leaf finish, premium upholstery, high-resilience foam and eco-friendly Dabao paint.';
  if(key==='material')return 'Solid wood / Fabric / Foam / Eco-friendly paint';
  if(key==='finish')return 'Hand carving / Aged finish / Custom finish';
  return p[key]||'';
 };
 function renderCatalog(){
  const grid=document.getElementById('productGrid');if(!grid||!localProducts.length)return;
  const currentLang=lang();
  const rows=[...localProducts].sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
  grid.innerHTML=rows.map(p=>{const name=displayName(p,currentLang),style=cleanStyle(p.style,currentLang),collection=localName(p.collection,collectionKeys,currentLang),room=localName(p.room,roomKeys,currentLang);return `<article class="product-card" data-title="${esc(`${p.name||''} ${p.nameZh||''} ${name}`)}" data-style="${esc(style)}" data-room="${esc(p.room)}" data-type="${esc(p.category)}" data-collection="${esc(p.collection)}" data-price="${p.price||0}"><a class="product-image" href="product-detail.html?id=${encodeURIComponent(p.id)}"><img src="${esc(p.images?.[0]||'assets/logo-icon.png')}" alt="${esc(name)}" loading="lazy" decoding="async"></a><a class="product-title-link" href="product-detail.html?id=${encodeURIComponent(p.id)}"><p>${esc(name)}</p></a><small>${esc([collection,style,room].filter(Boolean).join(' · '))}</small><div class="product-meta"><span class="product-price"><small>${currentLang==='zh'?'参考价':'Reference Price'}</small><strong>${money(p.price)}</strong></span><a href="product-detail.html?id=${encodeURIComponent(p.id)}">${currentLang==='zh'?'查看详情':'View Details'}</a></div></article>`}).join('');
  bindFilters();
 }
 function bindFilters(){
  const cards=[...document.querySelectorAll('#productGrid .product-card')],params=new URLSearchParams(location.search),controls={collection:document.getElementById('collectionFilter'),style:document.getElementById('styleFilter'),type:document.getElementById('typeFilter'),sort:document.getElementById('sortSelect'),search:document.getElementById('catalogSearch')};
  function apply(){const room=params.get('room')||'',collection=controls.collection?.value||params.get('collection')||'',style=controls.style?.value||params.get('style')||'',type=controls.type?.value||params.get('type')||'',q=(controls.search?.value||params.get('q')||'').toLowerCase();let shown=0;cards.forEach(card=>{const ok=(!room||card.dataset.room.includes(room))&&(!collection||card.dataset.collection===collection)&&(!style||card.dataset.style===style)&&(!type||card.dataset.type===type)&&(!q||`${card.dataset.title} ${card.dataset.collection} ${card.dataset.style} ${card.dataset.type}`.toLowerCase().includes(q));card.classList.toggle('hidden',!ok);if(ok)shown++});const ordered=[...cards];if(controls.sort?.value==='az')ordered.sort((a,b)=>a.dataset.title.localeCompare(b.dataset.title));if(controls.sort?.value==='price-low')ordered.sort((a,b)=>Number(a.dataset.price)-Number(b.dataset.price));if(controls.sort?.value==='price-high')ordered.sort((a,b)=>Number(b.dataset.price)-Number(a.dataset.price));ordered.forEach(card=>card.parentNode.appendChild(card));document.getElementById('resultCount').textContent=`${shown} products`;document.getElementById('noResults').classList.toggle('show',shown===0)}
  Object.values(controls).filter(Boolean).forEach(node=>node.addEventListener(node.tagName==='INPUT'?'input':'change',apply));apply();
 }
 function renderDetail(){
  if(document.body.dataset.page!=='detail')return;const id=new URLSearchParams(location.search).get('id');if(!id||/^\d+$/.test(id))return;const p=localProducts.find(item=>item.id===id);if(!p)return;
  const currentLang=lang(),name=displayName(p,currentLang),style=cleanStyle(p.style,currentLang),collection=localName(p.collection,collectionKeys,currentLang),room=localName(p.room,roomKeys,currentLang);document.title=`${name} · WAO HAVEN`;['detailTitle','detailCrumb','detailMeta'].forEach(id=>document.getElementById(id)?.removeAttribute('data-i18n'));const desc=document.querySelector('.detail-description');desc?.removeAttribute('data-i18n');document.getElementById('detailTitle').textContent=name;document.getElementById('detailCrumb').textContent=name;document.getElementById('detailMeta').textContent=[collection,style,room].filter(Boolean).join(' · ');if(desc)desc.textContent=localized(p,'description',currentLang);
  const values={sku:p.sku,collection,dimensions:formatDimensions(p.dimensions),finish:localized(p,'finish',currentLang),custom:currentLang==='zh'?'尺寸、木色、面料与包装可定制':'Size, wood color, fabric and packaging can be customized'};Object.entries(values).forEach(([key,value])=>{const node=document.querySelector(`[data-spec="${key}"]`);if(node&&value)node.textContent=value});
  const thumbs=document.getElementById('detailThumbnails'),image=document.getElementById('detailImage'),video=document.getElementById('detailVideo');if(video){video.pause();video.hidden=true;video.removeAttribute('src')}if(image){image.hidden=false;image.removeAttribute('hidden')}thumbs.innerHTML='';(p.images||[]).slice(0,5).forEach((src,i)=>{const button=document.createElement('button');button.type='button';button.className=`detail-thumbnail${i?'':' active'}`;button.setAttribute('aria-label',`查看第 ${i+1} 张产品图`);button.innerHTML=`<img src="${esc(src)}" alt="${esc(name)} ${i+1}">`;button.addEventListener('click',()=>{if(video){video.pause();video.hidden=true}image.hidden=false;image.src=src;thumbs.querySelectorAll('button').forEach(x=>x.classList.remove('active'));button.classList.add('active')});thumbs.appendChild(button)});if(p.images?.[0]){image.src=p.images[0];image.alt=name}
 }
 window.WAO_REFRESH_LOCAL_PRODUCTS=()=>{renderCatalog();renderDetail()};
 window.WAO_REFRESH_LOCAL_PRODUCTS();
})();
