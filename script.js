const page=document.body.dataset.page||'home';
const langBtn=document.getElementById('languageBtn'),langMenu=document.getElementById('languageMenu'),currentLanguage=document.getElementById('currentLanguage');
function tx(lang,key){return (I18N[lang]&&I18N[lang][key])||(I18N.en&&I18N.en[key])||key}
function getSavedLanguage(){try{return localStorage.getItem('waohaven_lang')}catch(error){return null}}
function saveLanguage(lang){try{localStorage.setItem('waohaven_lang',lang)}catch(error){/* Mobile privacy browsers can block storage. */}}
function shouldTranslate(el){return !el.closest('.brand')}
function applyLanguage(lang){const nextLang=I18N[lang]?lang:'en';document.documentElement.lang=nextLang;document.documentElement.dir=nextLang==='ar'?'rtl':'ltr';if(currentLanguage)currentLanguage.textContent=I18N[nextLang]?.name||'English';document.querySelectorAll('[data-i18n]').forEach(el=>{if(shouldTranslate(el))el.textContent=tx(nextLang,el.dataset.i18n)});document.querySelectorAll('[data-i18n-html]').forEach(el=>{if(shouldTranslate(el))el.innerHTML=tx(nextLang,el.dataset.i18nHtml)});document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{if(shouldTranslate(el))el.placeholder=tx(nextLang,el.dataset.i18nPlaceholder)});document.querySelectorAll('[data-i18n-alt]').forEach(el=>{if(shouldTranslate(el))el.alt=tx(nextLang,el.dataset.i18nAlt)});document.querySelectorAll('[data-i18n-aria-label]').forEach(el=>{if(shouldTranslate(el))el.setAttribute('aria-label',tx(nextLang,el.dataset.i18nAriaLabel))});saveLanguage(nextLang);if(page==='products'){refreshSecondaryLabels(nextLang);refreshProductCount(nextLang)}window.WAO_REFRESH_LOCAL_PRODUCTS?.()}
langBtn?.setAttribute('aria-expanded','false');langBtn?.addEventListener('click',e=>{e.stopPropagation();const open=langMenu.classList.toggle('open');langBtn.setAttribute('aria-expanded',String(open))});langMenu?.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{applyLanguage(b.dataset.lang);langMenu.classList.remove('open');langBtn?.setAttribute('aria-expanded','false')}));document.addEventListener('click',e=>{if(!e.target.closest('.language')){langMenu?.classList.remove('open');langBtn?.setAttribute('aria-expanded','false')}});
const menuBtn=document.getElementById('menuBtn'),mainNav=document.getElementById('mainNav');menuBtn?.addEventListener('click',()=>{const open=mainNav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open))});
mainNav?.querySelectorAll('.nav-item').forEach(item=>{
 const trigger=item.querySelector(':scope > a');
 trigger.setAttribute('aria-haspopup','true');trigger.setAttribute('aria-expanded','false');
 trigger.addEventListener('click',event=>{
  if(!matchMedia('(max-width: 850px)').matches||item.classList.contains('expanded'))return;
  event.preventDefault();
  mainNav.querySelectorAll('.nav-item.expanded').forEach(openItem=>{openItem.classList.remove('expanded');openItem.querySelector(':scope > a')?.setAttribute('aria-expanded','false')});
  item.classList.add('expanded');trigger.setAttribute('aria-expanded','true');
 });
 item.addEventListener('keydown',event=>{if(event.key==='Escape'){item.classList.remove('expanded');trigger.setAttribute('aria-expanded','false');trigger.focus()}});
});
function syncNavigationState(){
 if(!mainNav)return;
 const params=new URLSearchParams(location.search),hash=location.hash;
 const currentRoom=params.get('room'),currentType=params.get('type'),currentCollection=params.get('collection');
 mainNav.querySelectorAll('a').forEach(link=>{link.classList.remove('current');link.removeAttribute('aria-current')});
 let currentLink=null;
 if(page==='products'){
  const selector=currentType?`a[href*="type=${encodeURIComponent(currentType)}"]`:currentCollection?`a[href*="collection=${encodeURIComponent(currentCollection)}"]`:currentRoom?`a[href*="room=${encodeURIComponent(currentRoom)}"]`:'a[href="products.html"]';
  currentLink=mainNav.querySelector(selector);
 }else currentLink=hash?mainNav.querySelector(`a[href="${hash}"]`):mainNav.querySelector('a[href="index.html"]');
 if(currentLink){
  currentLink.classList.add('current');currentLink.setAttribute('aria-current','page');
  currentLink.closest('.nav-item')?.querySelector(':scope > a')?.classList.add('current');
 }
}
syncNavigationState();
if(page==='home'){
 const slides=[...document.querySelectorAll('.hero-slide')],dots=[...document.querySelectorAll('#heroDots button')];let current=0,timer;function show(i){current=(i+slides.length)%slides.length;slides.forEach((s,n)=>s.classList.toggle('active',n===current));dots.forEach((d,n)=>d.classList.toggle('active',n===current))}function start(){clearInterval(timer);timer=setInterval(()=>show(current+1),5200)}document.getElementById('prevSlide')?.addEventListener('click',()=>{show(current-1);start()});document.getElementById('nextSlide')?.addEventListener('click',()=>{show(current+1);start()});dots.forEach((d,i)=>d.addEventListener('click',()=>{show(i);start()}));start();
 document.getElementById('searchBtn')?.addEventListener('click',()=>{const q=document.getElementById('siteSearch').value.trim();if(q)location.href='products.html?q='+encodeURIComponent(q);else location.href='products.html'});document.getElementById('siteSearch')?.addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('searchBtn').click()});
 const roomPanels=[...document.querySelectorAll('#roomAccordion .ag-panel')];const roomTabs=[...document.querySelectorAll('#roomCategoryTabs [data-room-index]')];let activeRoom=Math.max(0,roomPanels.findIndex(panel=>panel.classList.contains('ag-panel--active')));const setActiveRoom=index=>{activeRoom=(index+roomPanels.length)%roomPanels.length;roomPanels.forEach((panel,i)=>{const selected=i===activeRoom;panel.classList.toggle('ag-panel--active',selected);if(selected)panel.setAttribute('aria-current','true');else panel.removeAttribute('aria-current')});roomTabs.forEach((tab,i)=>{const selected=i===activeRoom;tab.classList.toggle('active',selected);tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1})};roomPanels.forEach((panel,index)=>{panel.addEventListener('pointerenter',()=>{if(matchMedia('(hover:hover)').matches)setActiveRoom(index)});panel.addEventListener('focus',()=>setActiveRoom(index));panel.addEventListener('click',event=>{if(index!==activeRoom){event.preventDefault();setActiveRoom(index)}});panel.addEventListener('keydown',event=>{if(['ArrowRight','ArrowDown'].includes(event.key)){event.preventDefault();setActiveRoom(index+1);roomPanels[activeRoom].focus()}else if(['ArrowLeft','ArrowUp'].includes(event.key)){event.preventDefault();setActiveRoom(index-1);roomPanels[activeRoom].focus()}})});roomTabs.forEach((tab,index)=>{tab.addEventListener('click',()=>setActiveRoom(index));tab.addEventListener('keydown',event=>{if(['ArrowRight','ArrowDown'].includes(event.key)){event.preventDefault();setActiveRoom(index+1);roomTabs[activeRoom].focus()}else if(['ArrowLeft','ArrowUp'].includes(event.key)){event.preventDefault();setActiveRoom(index-1);roomTabs[activeRoom].focus()}})});if(roomPanels.length)setActiveRoom(activeRoom);
 const wall=document.getElementById('driftWall');
 if(wall){
  const fallbackWallItems=[
   {image:'assets/coffee-walnut-front.jpg',title:'prod.1',series:'collection.rh',href:'product-detail.html?id=1'},
   {image:'assets/coffee-light-angle.jpg',title:'prod.2',series:'collection.art',href:'product-detail.html?id=2'},
   {image:'assets/coffee-dark-front.jpg',title:'prod.3',series:'collection.fuyi',href:'product-detail.html?id=3'},
   {image:'assets/coffee-light-front.jpg',title:'prod.4',series:'collection.art',href:'product-detail.html?id=4'},
   {image:'assets/coffee-walnut-side.jpg',title:'prod.5',series:'collection.rh',href:'product-detail.html?id=5'},
   {image:'assets/coffee-walnut-angle.jpg',title:'prod.6',series:'collection.rh',href:'product-detail.html?id=6'}
  ];
  const seriesKeys={'Fuyi Collection':'collection.fuyi','Art Collection':'collection.art','RH-Style Collection':'collection.rh','Puffpop sofa':'collection.puffpop'};
  const localWallItems=(Array.isArray(window.WAO_LOCAL_PRODUCTS)?window.WAO_LOCAL_PRODUCTS:[]).filter(item=>item.status!=='draft'&&item.images?.[0]).map(item=>({image:item.images[0],titleText:(document.documentElement.lang==='zh'&&item.nameZh)||item.name||item.nameZh||item.sku,series:seriesKeys[item.collection],href:`product-detail.html?id=${encodeURIComponent(item.id)}`})).filter(item=>item.series);
  const wallItems=localWallItems.length?localWallItems:fallbackWallItems;
  const plane=document.createElement('div');plane.className='drift-wall__plane';
  let rows=[];
  const renderWall=series=>{
   plane.replaceChildren();rows=[];
   const filtered=wallItems.filter(item=>item.series===series);
   const source=filtered.length?filtered:wallItems;
   for(let rowIndex=0;rowIndex<3;rowIndex++){
    const viewport=document.createElement('div');viewport.className='drift-wall__row';
    const track=document.createElement('div');track.className='drift-wall__track';
    const sequence=Array.from({length:24},(_,slot)=>source[(slot+rowIndex)%source.length]);
    sequence.forEach(item=>{const link=document.createElement('a');link.className='drift-wall__tile';link.href=item.href;const title=item.titleText||tx(document.documentElement.lang||'en',item.title);link.innerHTML=`<span class="drift-wall__inner"><img src="${item.image}" alt="${title}" loading="lazy" decoding="async"/><span class="drift-wall__shade"></span><span class="drift-wall__caption"><strong>${title}</strong></span></span>`;track.appendChild(link)});
    viewport.appendChild(track);plane.appendChild(viewport);
    const row={track,offset:rowIndex===1?track.scrollWidth/6:rowIndex*96,direction:rowIndex===1?-1:1,speed:rowIndex===1?30:rowIndex===2?24:27,paused:false};rows.push(row);
    viewport.addEventListener('pointerenter',()=>{row.paused=true});viewport.addEventListener('pointerleave',()=>{row.paused=false});viewport.addEventListener('focusin',()=>{row.paused=true});viewport.addEventListener('focusout',event=>{if(!viewport.contains(event.relatedTarget))row.paused=false});
   }
  };
  const seriesButtons=[...document.querySelectorAll('[data-wall-series]')];
  seriesButtons.forEach(button=>button.addEventListener('click',()=>{seriesButtons.forEach(item=>{const selected=item===button;item.classList.toggle('active',selected);item.setAttribute('aria-pressed',String(selected))});renderWall(button.dataset.wallSeries)}));
  renderWall(seriesButtons[0]?.dataset.wallSeries||'collection.fuyi');wall.replaceChildren(plane);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;let active=true,last=performance.now();
  const observer=new IntersectionObserver(entries=>{active=entries[0]?.isIntersecting!==false},{rootMargin:'120px'});observer.observe(wall);
  document.addEventListener('visibilitychange',()=>{active=!document.hidden&&wall.getBoundingClientRect().bottom>0&&wall.getBoundingClientRect().top<innerHeight});
  const animateWall=now=>{const dt=Math.min(.05,(now-last)/1000);last=now;if(active&&!reduced){rows.forEach(row=>{if(row.paused)return;const loop=row.track.scrollWidth/3;if(!loop)return;row.offset=(row.offset+row.speed*row.direction*dt+loop)%loop;row.track.style.transform=`translate3d(${-row.offset}px,0,0)`})}requestAnimationFrame(animateWall)};requestAnimationFrame(animateWall);
 }
}
const products=[...document.querySelectorAll('.product-card')];
products.forEach(card=>{const detail=card.querySelector('.product-meta a')?.href;if(!detail)return;[card.querySelector('.product-image'),card.querySelector(':scope > p')].filter(Boolean).forEach(target=>{target.tabIndex=0;target.setAttribute('role','link');target.addEventListener('click',()=>location.href=detail);target.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();location.href=detail}})})});
function canonicalLabel(param,val,lang){if(!val)return tx(lang,'nav.all');const roomMap={'Living Room':'room.living','Bedroom':'room.bedroom','Dining Room':'room.dining','Home Office':'room.office','Entryway & Hallway':'nav.entryway','Bathroom':'room.bathroom','Other':'room.other'};const styleMap={'British Manor':'style.traditional','French Château':'style.modern','Italian Renaissance':'style.farmhouse','American Legacy':'style.rustic','Traditional American':'style.traditional','Modern American':'style.modern','Farmhouse':'style.farmhouse','Rustic':'style.rustic','Coastal':'style.coastal','Mid-Century American':'style.midcentury'};const collMap={'Fuyi Collection':'collection.fuyi','Art Collection':'collection.art','RH-Style Collection':'collection.rh','Puffpop sofa':'collection.puffpop'};const typeMap={'Sofa & Sectionals':'type.sofas','Coffee Tables':'type.coffee','Side / End Tables':'type.side','TV Stands & Media Consoles':'type.tv','Accent Chairs':'type.accent','Bookcases & Cabinets':'type.bookcases','Bed Frames':'type.beds','Nightstands':'type.nightstands','Dressers & Chests':'type.dressers','Armoires / Wardrobes':'type.wardrobes'};const maps={room:roomMap,style:styleMap,collection:collMap,type:typeMap};return maps[param]?.[val]?tx(lang,maps[param][val]):val}
function localizedQueryLabel(value,lang){const normalized=String(value||'').trim().toLowerCase();const map={sofa:{en:'sofa',es:'sofá',ru:'диван',de:'Sofa',fr:'canapé',zh:'沙发',ar:'أريكة'},'沙发':{en:'sofa',es:'sofá',ru:'диван',de:'Sofa',fr:'canapé',zh:'沙发',ar:'أريكة'},'沙發':{en:'sofa',es:'sofá',ru:'диван',de:'Sofa',fr:'canapé',zh:'沙发',ar:'أريكة'},'coffee table':{en:'coffee table',es:'mesa de centro',ru:'журнальный столик',de:'Couchtisch',fr:'table basse',zh:'茶几桌',ar:'طاولة قهوة'},'茶几':{en:'coffee table',es:'mesa de centro',ru:'журнальный столик',de:'Couchtisch',fr:'table basse',zh:'茶几桌',ar:'طاولة قهوة'},'茶几桌':{en:'coffee table',es:'mesa de centro',ru:'журнальный столик',de:'Couchtisch',fr:'table basse',zh:'茶几桌',ar:'طاولة قهوة'}};return map[normalized]?.[lang]||map[normalized]?.en||value}
function refreshSecondaryLabels(lang){if(page!=='products')return;const p=new URLSearchParams(location.search);const order=['room','style','collection','type','q'];let chosen=null;for(const key of order){if(p.get(key)){chosen={key,val:p.get(key)};break}}const label=chosen?(chosen.key==='q'?localizedQueryLabel(chosen.val,lang):canonicalLabel(chosen.key,chosen.val,lang)):tx(lang,'nav.all');document.getElementById('pageTitle').textContent=label;document.getElementById('crumbLabel').textContent=label;const active=document.getElementById('activeFilter');if(chosen){active.textContent=label;active.classList.add('show')}else active.classList.remove('show')}
function refreshProductCount(lang=document.documentElement.lang||'en'){if(page!=='products')return;const count=products.filter(card=>!card.classList.contains('hidden')).length;const key=count===1?'catalog.productCountOne':'catalog.productCount';document.getElementById('resultCount').textContent=tx(lang,key).replace('{count}',count)}
if(page==='products'){
 const hoverSources=['assets/coffee-walnut-angle.jpg','assets/coffee-light-front.jpg','assets/coffee-dark-front-cutout.png','assets/coffee-light-angle.jpg','assets/coffee-walnut-front.jpg','assets/coffee-walnut-front.jpg'];
 products.forEach((card,index)=>{const image=card.querySelector('.product-image img'),hoverSrc=hoverSources[index];if(!image||!hoverSrc)return;image.dataset.primarySrc=image.getAttribute('src');const preload=new Image();preload.src=hoverSrc;const showAlternate=()=>{if(matchMedia('(hover:hover)').matches)image.src=hoverSrc};const showPrimary=()=>{image.src=image.dataset.primarySrc};card.addEventListener('pointerenter',showAlternate);card.addEventListener('pointerleave',showPrimary);card.addEventListener('focusin',showAlternate);card.addEventListener('focusout',showPrimary)});
 const productGrid=document.getElementById('productGrid'),densityButtons=[...document.querySelectorAll('[data-grid-density]')];
 const applyDensity=density=>{const compact=density==='compact';productGrid.classList.toggle('compact',compact);densityButtons.forEach(button=>{const active=button.dataset.gridDensity===density;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});localStorage.setItem('waohaven_grid_density',density)};
 densityButtons.forEach(button=>button.addEventListener('click',()=>applyDensity(button.dataset.gridDensity)));applyDensity(localStorage.getItem('waohaven_grid_density')==='compact'?'compact':'comfortable');
 const p=new URLSearchParams(location.search),initialRoom=p.get('room')||'';
 const controls={collection:document.getElementById('collectionFilter'),style:document.getElementById('styleFilter'),type:document.getElementById('typeFilter'),sort:document.getElementById('sortSelect'),search:document.getElementById('catalogSearch')};
 const syncFilterControlState=()=>{[controls.collection,controls.style,controls.type].forEach(control=>control?.classList.toggle('has-selection',Boolean(control.value)));controls.sort?.classList.toggle('has-selection',Boolean(controls.sort.value&&controls.sort.value!=='featured'))};
 controls.collection.value=p.get('collection')||'';controls.style.value=p.get('style')||'';controls.type.value=p.get('type')||'';controls.search.value=p.get('q')||'';
 const priceOf=card=>Number((card.querySelector('.product-price strong')?.textContent||'').replace(/[^0-9]/g,''))||0;
 function applyCatalogFilters(){
  const collection=controls.collection.value,style=controls.style.value,type=controls.type.value,q=controls.search.value.trim().toLowerCase();const styleAliases={'British Manor':'Traditional American','French Château':'Traditional American','Italian Renaissance':'Modern American','American Legacy':'Rustic'};const productStyle=styleAliases[style]||style;let visible=0;
  products.forEach(card=>{let ok=true;if(initialRoom)ok&&=(card.dataset.room||'').includes(initialRoom);if(collection)ok&&=card.dataset.collection===collection;if(style)ok&&=card.dataset.style===productStyle;if(type)ok&&=card.dataset.type===type;if(q){const hay=[card.dataset.title,card.dataset.room,card.dataset.style,card.dataset.type,card.dataset.collection].join(' ').toLowerCase();ok&&=hay.includes(q)}card.classList.toggle('hidden',!ok);if(ok)visible++});
  const grid=document.getElementById('productGrid'),ordered=[...products];if(controls.sort.value==='az')ordered.sort((a,b)=>a.dataset.title.localeCompare(b.dataset.title));if(controls.sort.value==='price-low')ordered.sort((a,b)=>priceOf(a)-priceOf(b));if(controls.sort.value==='price-high')ordered.sort((a,b)=>priceOf(b)-priceOf(a));ordered.forEach(card=>grid.appendChild(card));
  syncFilterControlState();
  refreshProductCount();document.getElementById('noResults').classList.toggle('show',visible===0);
 }
 [controls.collection,controls.style,controls.type,controls.sort].forEach(control=>control.addEventListener('change',applyCatalogFilters));document.getElementById('catalogFilters')?.addEventListener('submit',event=>{event.preventDefault();applyCatalogFilters()});controls.search.addEventListener('input',applyCatalogFilters);syncFilterControlState();applyCatalogFilters();
}
if(page==='detail'){
 const detailProducts={
  1:{image:'assets/coffee-walnut-front.jpg',gallery:['assets/coffee-walnut-front.jpg','assets/coffee-walnut-angle.jpg','assets/coffee-walnut-side.jpg','assets/coffee-walnut-front-cutout.png','assets/coffee-walnut-angle-cutout.png'],name:'prod.1',meta:'prodmeta.1',spec:{sku:'WAO-RH-CT-001',collection:'RH-Style Collection',material:'北美胡桃木 / 钢化玻璃',finish:'手工雕花 / 胡桃木色'}},
  2:{image:'assets/coffee-light-angle.jpg',gallery:['assets/coffee-light-angle.jpg','assets/coffee-light-front.jpg','assets/coffee-light-angle-cutout.png','assets/coffee-light-front.jpg','assets/coffee-light-angle.jpg'],name:'prod.2',meta:'prodmeta.2',spec:{sku:'WAO-ART-CT-002',collection:'Art Collection',material:'实木 / 玻璃',finish:'象牙白做旧 / 雕花'}},
  3:{image:'assets/coffee-dark-front.jpg',gallery:['assets/coffee-dark-front.jpg','assets/coffee-dark-front-cutout.png','assets/coffee-walnut-side.jpg','assets/coffee-dark-front.jpg','assets/coffee-dark-front-cutout.png'],name:'prod.3',meta:'prodmeta.3',spec:{sku:'WAO-FY-CT-003',collection:'Fuyi Collection',material:'橡木 / 玻璃',finish:'深橡木色 / 手工做旧'}},
  4:{image:'assets/coffee-light-front.jpg',gallery:['assets/coffee-light-front.jpg','assets/coffee-light-angle.jpg','assets/coffee-light-angle-cutout.png','assets/coffee-light-front.jpg','assets/coffee-light-angle.jpg'],name:'prod.4',meta:'prodmeta.4',spec:{sku:'WAO-ART-CT-004',collection:'Art Collection',material:'实木 / 玻璃',finish:'象牙白 / 弧形雕花'}},
  5:{image:'assets/coffee-walnut-side.jpg',gallery:['assets/coffee-walnut-side.jpg','assets/coffee-walnut-front.jpg','assets/coffee-walnut-angle.jpg','assets/coffee-walnut-front-cutout.png','assets/coffee-walnut-angle-cutout.png'],name:'prod.5',meta:'prodmeta.5',spec:{sku:'WAO-RH-ST-005',collection:'RH-Style Collection',material:'北美胡桃木 / 玻璃',finish:'胡桃木色 / 手工雕刻'}},
  6:{image:'assets/coffee-walnut-angle.jpg',gallery:['assets/coffee-walnut-angle.jpg','assets/coffee-walnut-front.jpg','assets/coffee-walnut-side.jpg','assets/coffee-walnut-angle-cutout.png','assets/coffee-walnut-front-cutout.png'],name:'prod.6',meta:'prodmeta.6',spec:{sku:'WAO-RH-CT-006',collection:'RH-Style Collection',material:'北美胡桃木 / 玻璃',finish:'胡桃木色 / 古典雕花'}}
 };
 const item=detailProducts[new URLSearchParams(location.search).get('id')]||detailProducts[1];
 const detailImage=document.getElementById('detailImage'),detailTitle=document.getElementById('detailTitle'),detailMeta=document.getElementById('detailMeta'),detailCrumb=document.getElementById('detailCrumb');
 detailImage.src=item.image;detailImage.dataset.i18nAlt=item.name;detailTitle.dataset.i18n=item.name;detailMeta.dataset.i18n=item.meta;detailCrumb.dataset.i18n=item.name;
 const thumbs=document.getElementById('detailThumbnails'),detailVideo=document.getElementById('detailVideo');
 const showMedia=src=>{const isVideo=/\.(mp4|webm|ogg)$/i.test(src);detailImage.hidden=isVideo;detailVideo.hidden=!isVideo;if(isVideo){detailVideo.src=src;detailVideo.load()}else{detailVideo.pause();detailImage.src=src}};
 item.gallery.slice(0,5).forEach((src,index)=>{const isVideo=/\.(mp4|webm|ogg)$/i.test(src),button=document.createElement('button'),currentLang=document.documentElement.lang||'en';button.type='button';button.className='detail-thumbnail'+(index===0?' active':'');button.setAttribute('aria-label',tx(currentLang,isVideo?'product.videoAria':'product.imageAria').replace('{index}',index+1));button.innerHTML=isVideo?'<span class="detail-video-mark">▶<small>VIDEO</small></span>':`<img src="${src}" alt="" />`;button.addEventListener('click',()=>{showMedia(src);thumbs.querySelectorAll('.detail-thumbnail').forEach(node=>node.classList.remove('active'));button.classList.add('active')});thumbs.appendChild(button)});
 Object.entries(item.spec||{}).forEach(([key,value])=>{const field=document.querySelector(`[data-spec="${key}"]`);if(field)field.textContent=value});
 const dialog=document.getElementById('detailInquiry');
 document.querySelectorAll('[data-open-inquiry]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();dialog.showModal()}));
 document.querySelector('[data-close-inquiry]')?.addEventListener('click',()=>dialog.close());
 dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
 document.getElementById('detailInquiryForm')?.addEventListener('submit',event=>{event.preventDefault();document.getElementById('detailSuccess').classList.add('show')});
}
document.querySelectorAll('[data-copy]').forEach(link=>link.addEventListener('click',async event=>{event.preventDefault();const value=link.dataset.copy,label=link.dataset.copyLabel||'';try{await navigator.clipboard.writeText(value)}catch{const field=document.createElement('textarea');field.value=value;field.style.position='fixed';field.style.opacity='0';document.body.appendChild(field);field.select();document.execCommand('copy');field.remove()}let toast=document.getElementById('copyToast');if(!toast){toast=document.createElement('div');toast.id='copyToast';toast.className='copy-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');document.body.appendChild(toast)}toast.textContent=`${tx(document.documentElement.lang||'en','common.copied')} ${label}`;toast.classList.add('show');clearTimeout(toast.hideTimer);toast.hideTimer=setTimeout(()=>toast.classList.remove('show'),2200)}));
const brandIntro=document.querySelector('.brand-intro');
if(brandIntro){
 const dismissBrandIntro=()=>{brandIntro.classList.add('is-done');setTimeout(()=>brandIntro.remove(),480)};
 window.addEventListener('load',()=>setTimeout(dismissBrandIntro,1050),{once:true});
 setTimeout(dismissBrandIntro,2200);
}
applyLanguage(getSavedLanguage()||'en');
