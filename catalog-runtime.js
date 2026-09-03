(function(){
 const localProducts=Array.isArray(window.WAO_LOCAL_PRODUCTS)?window.WAO_LOCAL_PRODUCTS.filter(p=>p.status!=='draft'):[];
 const money=(value,product)=>value==null?t('price.inquiry'):`${product?.collection==='Puffpop sofa'?'$':'¥'}${Number(value).toLocaleString('zh-CN')}`;
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const lang=()=>document.documentElement.lang||'en';
 const productNameMap={
  en:{'办公桌':'Executive Desk','玻璃':'Glass Top','布艺床':'Fabric Bed','餐边柜':'Sideboard','餐椅':'Dining Chair','餐桌':'Dining Table','茶几':'Coffee Table','茶几桌':'Coffee Table','床':'Bed','床头柜':'Nightstand','电视柜':'TV Console','扶手餐椅':'Dining Armchair','贵妃椅':'Chaise Lounge','边几':'Side Table','角几':'Side Table','角几2':'Side Table','脚凳':'Ottoman','酒柜':'Bar Cabinet','沙发单人位':'Single Sofa','沙发双人位':'Two-seat Sofa','沙发三人位':'Three-seat Sofa','沙发四人位':'Four-seat Sofa','书桌':'Desk','书柜':'Bookcase','梳妆凳':'Vanity Stool','梳妆镜':'Vanity Mirror','休闲椅':'Lounge Chair','休闲椅2':'Lounge Chair','玄关台':'Console Table','玄关桌':'Console Table','玄关柜':'Entryway Cabinet','衣柜':'Wardrobe','长衣柜':'Tall Wardrobe','真皮床':'Leather Bed','转盘':'Lazy Susan','妆台':'Vanity Table','装饰柜':'Display Cabinet','装饰桌':'Accent Table'},
  es:{'办公桌':'Escritorio ejecutivo','玻璃':'Cubierta de vidrio','布艺床':'Cama tapizada en tela','餐边柜':'Aparador','餐椅':'Silla de comedor','餐桌':'Mesa de comedor','茶几':'Mesa de centro','茶几桌':'Mesa de centro','床':'Cama','床头柜':'Mesita de noche','电视柜':'Mueble de TV','扶手餐椅':'Silla de comedor con brazos','贵妃椅':'Chaise longue','边几':'Mesa auxiliar','角几':'Mesa auxiliar','角几2':'Mesa auxiliar','脚凳':'Otomana','酒柜':'Bar cabinet','沙发单人位':'Sofá individual','沙发双人位':'Sofá de dos plazas','沙发三人位':'Sofá de tres plazas','沙发四人位':'Sofá de cuatro plazas','书桌':'Escritorio','书柜':'Librero','梳妆凳':'Taburete de tocador','梳妆镜':'Espejo de tocador','休闲椅':'Sillón lounge','休闲椅2':'Sillón lounge','玄关台':'Consola','玄关桌':'Consola','玄关柜':'Gabinete de entrada','衣柜':'Armario','长衣柜':'Armario alto','真皮床':'Cama de cuero','转盘':'Centro giratorio','妆台':'Tocador','装饰柜':'Vitrina decorativa','装饰桌':'Mesa decorativa'},
  ru:{'办公桌':'Представительский стол','玻璃':'Стеклянная столешница','布艺床':'Тканевая кровать','餐边柜':'Буфет','餐椅':'Обеденный стул','餐桌':'Обеденный стол','茶几':'Журнальный столик','茶几桌':'Журнальный столик','床':'Кровать','床头柜':'Прикроватная тумба','电视柜':'Тумба под ТВ','扶手餐椅':'Обеденное кресло','贵妃椅':'Кушетка','边几':'Приставной столик','角几':'Приставной столик','角几2':'Приставной столик','脚凳':'Пуф','酒柜':'Барный шкаф','沙发单人位':'Одноместный диван','沙发双人位':'Двухместный диван','沙发三人位':'Трехместный диван','沙发四人位':'Четырехместный диван','书桌':'Письменный стол','书柜':'Книжный шкаф','梳妆凳':'Табурет для туалетного столика','梳妆镜':'Зеркало для туалетного столика','休闲椅':'Кресло для отдыха','休闲椅2':'Кресло для отдыха','玄关台':'Консольный стол','玄关桌':'Консольный стол','玄关柜':'Шкаф для прихожей','衣柜':'Шкаф','长衣柜':'Высокий шкаф','真皮床':'Кожаная кровать','转盘':'Поворотный центр стола','妆台':'Туалетный столик','装饰柜':'Витрина','装饰桌':'Декоративный стол'},
  de:{'办公桌':'Chefschreibtisch','玻璃':'Glasplatte','布艺床':'Stoffbett','餐边柜':'Sideboard','餐椅':'Esszimmerstuhl','餐桌':'Esstisch','茶几':'Couchtisch','茶几桌':'Couchtisch','床':'Bett','床头柜':'Nachttisch','电视柜':'TV-Konsole','扶手餐椅':'Esszimmerstuhl mit Armlehnen','贵妃椅':'Chaiselongue','边几':'Beistelltisch','角几':'Beistelltisch','角几2':'Beistelltisch','脚凳':'Hocker','酒柜':'Barschränkchen','沙发单人位':'Einzelsessel-Sofa','沙发双人位':'Zweisitzer-Sofa','沙发三人位':'Dreisitzer-Sofa','沙发四人位':'Viersitzer-Sofa','书桌':'Schreibtisch','书柜':'Bücherregal','梳妆凳':'Schminkhocker','梳妆镜':'Schminkspiegel','休闲椅':'Loungesessel','休闲椅2':'Loungesessel','玄关台':'Konsolentisch','玄关桌':'Konsolentisch','玄关柜':'Dielenschrank','衣柜':'Kleiderschrank','长衣柜':'Hoher Kleiderschrank','真皮床':'Lederbett','转盘':'Drehplatte','妆台':'Schminktisch','装饰柜':'Vitrinenschrank','装饰桌':'Akzenttisch'},
  fr:{'办公桌':'Bureau de direction','玻璃':'Plateau en verre','布艺床':'Lit en tissu','餐边柜':'Buffet','餐椅':'Chaise de salle à manger','餐桌':'Table à manger','茶几':'Table basse','茶几桌':'Table basse','床':'Lit','床头柜':'Table de chevet','电视柜':'Meuble TV','扶手餐椅':'Fauteuil de salle à manger','贵妃椅':'Chaise longue','边几':'Table d’appoint','角几':'Table d’appoint','角几2':'Table d’appoint','脚凳':'Pouf','酒柜':'Meuble bar','沙发单人位':'Canapé une place','沙发双人位':'Canapé deux places','沙发三人位':'Canapé trois places','沙发四人位':'Canapé quatre places','书桌':'Bureau','书柜':'Bibliothèque','梳妆凳':'Tabouret de coiffeuse','梳妆镜':'Miroir de coiffeuse','休闲椅':'Fauteuil lounge','休闲椅2':'Fauteuil lounge','玄关台':'Console','玄关桌':'Console','玄关柜':'Meuble d’entrée','衣柜':'Armoire','长衣柜':'Grande armoire','真皮床':'Lit en cuir','转盘':'Plateau tournant','妆台':'Coiffeuse','装饰柜':'Vitrine décorative','装饰桌':'Table d’appoint décorative'},
  zh:{},
  ar:{'办公桌':'مكتب تنفيذي','玻璃':'سطح زجاجي','布艺床':'سرير قماشي','餐边柜':'بوفيه جانبي','餐椅':'كرسي طعام','餐桌':'طاولة طعام','茶几':'طاولة قهوة','茶几桌':'طاولة قهوة','床':'سرير','床头柜':'كومود جانبي','电视柜':'وحدة تلفزيون','扶手餐椅':'كرسي طعام بذراعين','贵妃椅':'شيزلونج','边几':'طاولة جانبية','角几':'طاولة جانبية','角几2':'طاولة جانبية','脚凳':'عثمانية','酒柜':'خزانة بار','沙发单人位':'أريكة مفردة','沙发双人位':'أريكة بمقعدين','沙发三人位':'أريكة بثلاثة مقاعد','沙发四人位':'أريكة بأربعة مقاعد','书桌':'مكتب','书柜':'خزانة كتب','梳妆凳':'كرسي تسريحة','梳妆镜':'مرآة تسريحة','休闲椅':'كرسي استرخاء','休闲椅2':'كرسي استرخاء','玄关台':'طاولة كونسول','玄关桌':'طاولة كونسول','玄关柜':'خزانة مدخل','衣柜':'خزانة ملابس','长衣柜':'خزانة طويلة','真皮床':'سرير جلدي','转盘':'صينية دوارة','妆台':'طاولة تسريحة','装饰柜':'خزانة عرض زخرفية','装饰桌':'طاولة زخرفية'}
 };
 const collectionKeys={'Fuyi Collection':'collection.fuyi','Art Collection':'collection.art','RH-Style Collection':'collection.rh','Puffpop sofa':'collection.puffpop'};
 const roomKeys={'Living Room':'room.living','Dining Room':'room.dining','Bedroom':'room.bedroom','Home Office':'room.office','Entryway & Hallway':'room.entryway','玄关入户':'room.entryway','Other':'room.other'};
 const styleKeys={'British Manor 英伦庄园':'style.traditional','British Manor':'style.traditional','French Chateau 法式城堡':'style.modern','French Chateau':'style.modern','French Château':'style.modern','Italian Renaissance':'style.farmhouse','American Legacy':'style.rustic'};
 const typeAliases={'Armchairs':['Accent Chairs'],'TV Stands':['TV Stands & Media Consoles'],'Side Tables':['Side / End Tables'],'Bookcases':['Bookcases & Cabinets'],'Beds':['Bed Frames'],'Dressers':['Dressers & Chests'],'Wardrobes':['Armoires / Wardrobes'],'Display Cabinets':['Bookcases & Cabinets','Cabinets'],'Office Desks':['Desks'],'Filing Cabinets':['Cabinets'],'Credenzas':['Cabinets'],'Shoe Cabinets':['Entryway Cabinets'],'Dressing Tables':['Vanity Table'],'Bar Stools':['Bar / Counter Stools']};
 const typeMatches=(productType,requestedType)=>!requestedType||productType===requestedType||(typeAliases[requestedType]||[]).includes(productType);
 const t=(key,currentLang=lang())=>(typeof I18N==='object'&&I18N[currentLang]?.[key])||(typeof I18N==='object'&&I18N.en?.[key])||key;
 const localName=(value,map,currentLang=lang())=>map[value]?t(map[value],currentLang):value;
 const fallbackName=p=>productNameMap.en[p.nameZh]||p.category||p.name||p.sku;
 const displayName=(p,currentLang=lang())=>currentLang==='zh'?(p.nameZh||p.name||p.sku):(productNameMap[currentLang]?.[p.nameZh]||fallbackName(p));
 const normalizedStyle=value=>String(value||'').replace(/[\u4e00-\u9fff].*$/,'').trim();
 const normalizedRoom=value=>value==='玄关入户'?'Entryway & Hallway':value;
 const cleanStyle=(style,currentLang=lang())=>{const value=String(style||'').trim();if(!value)return '';if(styleKeys[value])return t(styleKeys[value],currentLang);if(currentLang==='zh'){const chinese=value.replace(/^[A-Za-z-]+(?:\s+[A-Za-z-]+)*\s*/,'').trim();return chinese||value}return value.replace(/[\u4e00-\u9fff].*$/,'').trim()};
 const dimensionCopy={
  en:{length:'L ',custom:'Custom dimensions',proportional:'Proportional size',diameter:'dia. '},
  es:{length:'L ',custom:'Dimensiones personalizables',proportional:'Tamaño proporcional',diameter:'diám. '},
  ru:{length:'Длина ',custom:'Индивидуальные размеры',proportional:'Пропорциональный размер',diameter:'диам. '},
  de:{length:'L ',custom:'Maße anpassbar',proportional:'Proportionale Größe',diameter:'Durchm. '},
  fr:{length:'L ',custom:'Dimensions personnalisables',proportional:'Taille proportionnelle',diameter:'diam. '},
  zh:{length:'长 ',custom:'可按项目定制',proportional:'按比例',diameter:'直径 '},
  ar:{length:'الطول ',custom:'أبعاد قابلة للتخصيص',proportional:'مقاس تناسبي',diameter:'قطر '}
 };
 const formatDimensions=(value,currentLang=lang())=>{
  const text=String(value||'').trim(),copy=dimensionCopy[currentLang]||dimensionCopy.en;if(!text)return '';
  const length=text.match(/^长\s*([0-9.]+)/);if(length)return `${copy.length}${length[1]} mm`;
  if(text==='可按项目定制')return copy.custom;
  if(text==='按比例')return copy.proportional;
  const diameter=text.match(/^(.+?)[（(]\s*直径\s*([0-9.]+)\s*[）)]$/);
  if(diameter)return currentLang==='zh'?`${diameter[1]} mm（${copy.diameter}${diameter[2]} mm）`:`${diameter[1]} mm (${copy.diameter}${diameter[2]} mm)`;
  return /\b(mm|cm|m|in|inch|英寸)\b/i.test(text)?text:`${text} mm`;
 };
 const preferredProductImage=images=>{
  const list=Array.isArray(images)?images.filter(Boolean):[];
  if(list.length<=1)return list[0]||'assets/logo-icon.png';
  const whiteName=list.find(src=>/(white|bait|baidi|main|cutout|transparent|\b0\b|白底|主图)/i.test(src));
  if(whiteName)return whiteName;
  return list.find(src=>/\.png(?:[?#].*)?$/i.test(src))||list[0]||'assets/logo-icon.png';
 };
 const alternateProductImage=images=>{
  const list=[...new Set((Array.isArray(images)?images:[]).filter(Boolean))],primary=preferredProductImage(list);
  return list.find(src=>src!==primary)||'';
 };
 const localized=(p,key,currentLang=lang())=>{
  if(currentLang==='zh')return p[key]||'';
  if(key==='description')return t('product.description.generic',currentLang);
  if(key==='material')return t('product.material.generic',currentLang);
  if(key==='finish')return t('product.finish.generic',currentLang);
  return p[key]||'';
 };
 const productHref=p=>`product-detail.html?id=${encodeURIComponent(p.id)}`;
 const productMeta=(p,currentLang=lang())=>[localName(p.collection,collectionKeys,currentLang),cleanStyle(p.style,currentLang),localName(normalizedRoom(p.room),roomKeys,currentLang)].filter(Boolean).join(' · ');
 const sortByScore=(current,items,scoreFn)=>items.map(item=>({item,score:scoreFn(item)})).filter(row=>row.score>0).sort((a,b)=>b.score-a.score||(a.item.sort_order||0)-(b.item.sort_order||0)).map(row=>row.item);
 const uniqueProducts=items=>{
  const seen=new Set();
  return items.filter(item=>item?.id&&!seen.has(item.id)&&(seen.add(item.id)||true));
 };
 const sameProductsFor=current=>{
  const currentStyle=normalizedStyle(current.style);
  const exact=localProducts.filter(p=>p.id!==current.id&&p.category===current.category&&p.collection===current.collection&&normalizedStyle(p.style)===currentStyle);
  const fallback=localProducts.filter(p=>p.id!==current.id&&p.category===current.category&&p.collection===current.collection);
  const categoryFallback=localProducts.filter(p=>p.id!==current.id&&p.category===current.category);
  return uniqueProducts([...exact,...fallback,...categoryFallback]).slice(0,8);
 };
 const variantProductsFor=(current,key)=>{
  const currentStyle=normalizedStyle(current.style),room=normalizedRoom(current.room),material=String(current.material||''),finish=String(current.finish||'');
  const all=localProducts.filter(p=>p.id!==current.id),sameCategory=all.filter(p=>p.category===current.category),sameCollection=sameCategory.filter(p=>p.collection===current.collection);
  if(key==='sizes')return uniqueProducts([...sameCollection.filter(p=>normalizedStyle(p.style)===currentStyle),...sameCollection,...sameCategory]).slice(0,10);
  if(key==='colors')return uniqueProducts([...sameCollection.filter(p=>normalizedStyle(p.style)===currentStyle&&String(p.finish||'')!==finish),...sameCollection.filter(p=>normalizedStyle(p.style)===currentStyle),...sameCollection,...sameCategory]).slice(0,10);
  if(key==='materials')return uniqueProducts([...sameCategory.filter(p=>material&&String(p.material||'')&&String(p.material||'')!==material),...sameCategory.filter(p=>p.collection!==current.collection||normalizedStyle(p.style)!==currentStyle),...all.filter(p=>normalizedRoom(p.room)===room&&p.category!==current.category)]).slice(0,10);
  return sameProductsFor(current);
 };
 const recommendedFor=current=>{
  const room=normalizedRoom(current.room),style=normalizedStyle(current.style);
  const scored=sortByScore(current,localProducts.filter(p=>p.id!==current.id),p=>{
   let score=0;
   if(normalizedRoom(p.room)===room)score+=5;
   if(normalizedStyle(p.style)===style)score+=4;
   if(p.collection===current.collection)score+=2;
   if(p.category!==current.category)score+=1;
   return score;
  });
  const roomFirst=scored.filter(p=>p.category!==current.category);
  return [...roomFirst,...scored.filter(p=>!roomFirst.includes(p))].slice(0,10);
 };
 const compactProductCard=(p,currentLang=lang(),className='')=>{
  const name=displayName(p,currentLang),imageSrc=preferredProductImage(p.images);
  return `<a class="${className}" href="${productHref(p)}"><span class="detail-rec-image"><img src="${esc(imageSrc)}" alt="${esc(name)}" loading="lazy" decoding="async"></span><span class="detail-rec-copy"><strong>${esc(name)}</strong><em>${esc(money(p.price,p))}</em></span></a>`;
 };
 function renderCatalog(){
  const grid=document.getElementById('productGrid');if(!grid||!localProducts.length)return;
  const currentLang=lang();
  const rows=[...localProducts].sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
  grid.innerHTML=rows.map(p=>{const name=displayName(p,currentLang),filterStyle=normalizedStyle(p.style),dimensions=formatDimensions(p.dimensions,currentLang),imageSrc=preferredProductImage(p.images),alternateSrc=alternateProductImage(p.images);return `<article class="product-card${alternateSrc?' has-alternate-image':''}" data-title="${esc(`${p.name||''} ${p.nameZh||''} ${name}`)}" data-style="${esc(filterStyle)}" data-room="${esc(normalizedRoom(p.room))}" data-type="${esc(p.category)}" data-collection="${esc(p.collection)}" data-price="${p.price||0}"><a class="product-image" href="product-detail.html?id=${encodeURIComponent(p.id)}"><img class="product-image__primary" src="${esc(imageSrc)}" alt="${esc(name)}" loading="lazy" decoding="async">${alternateSrc?`<img class="product-image__alternate" src="${esc(alternateSrc)}" alt="" loading="lazy" decoding="async" aria-hidden="true">`:''}</a><a class="product-title-link" href="product-detail.html?id=${encodeURIComponent(p.id)}"><p>${esc(name)}</p></a>${dimensions?`<div class="product-dimensions"><span>${esc(t('product.dimensions',currentLang))}</span><strong>${esc(dimensions)}</strong></div>`:''}<div class="product-meta"><span class="product-price"><small>${esc(t('price.reference',currentLang))}</small><strong>${money(p.price,p)}</strong></span></div></article>`}).join('');
  bindFilters();
 }
 function bindFilters(){
  const cards=[...document.querySelectorAll('#productGrid .product-card')],params=new URLSearchParams(location.search),grid=document.getElementById('productGrid'),pagination=document.getElementById('catalogPagination'),controls={collection:document.getElementById('collectionFilter'),style:document.getElementById('styleFilter'),type:document.getElementById('typeFilter'),sort:document.getElementById('sortSelect'),search:document.getElementById('catalogSearch')};
  const pageSize=20;
  let currentPage=Math.max(1,Number(params.get('page'))||1);
  if(controls.collection&&params.has('collection'))controls.collection.value=params.get('collection')||'';
  if(controls.style&&params.has('style'))controls.style.value=params.get('style')||'';
  if(controls.type&&params.has('type'))controls.type.value=params.get('type')||'';
  if(controls.search&&params.has('q'))controls.search.value=params.get('q')||'';
  if(controls.sort&&params.has('sort'))controls.sort.value=params.get('sort')||'featured';
  const updatePageUrl=()=>{
   const next=new URLSearchParams(location.search);
   if(currentPage>1)next.set('page',String(currentPage));else next.delete('page');
   const query=next.toString();
   history.replaceState(null,'',`${location.pathname}${query?`?${query}`:''}${location.hash}`);
  };
  const pageWindow=total=>{
   if(total<=7)return Array.from({length:total},(_,i)=>i+1);
   const pages=[1],start=Math.max(2,currentPage-2),end=Math.min(total-1,currentPage+2);
   if(start>2)pages.push('gap-start');
   for(let i=start;i<=end;i++)pages.push(i);
   if(end<total-1)pages.push('gap-end');
   pages.push(total);
   return pages;
  };
  const renderPagination=total=>{
   if(!pagination)return;
   pagination.hidden=total<=1;
   if(total<=1){pagination.innerHTML='';return}
   const prevDisabled=currentPage<=1?' disabled aria-disabled="true"':'';
   const nextDisabled=currentPage>=total?' disabled aria-disabled="true"':'';
   const pages=pageWindow(total).map(page=>typeof page==='number'?`<button type="button" class="${page===currentPage?'active':''}" data-page="${page}" aria-label="${esc(t('catalog.pageGo',lang()).replace('{page}',page))}" aria-current="${page===currentPage?'page':'false'}">${page}</button>`:`<span aria-hidden="true">...</span>`).join('');
   pagination.innerHTML=`<button type="button" data-page="${currentPage-1}"${prevDisabled}>${esc(t('catalog.pagePrev',lang()))}</button>${pages}<button type="button" data-page="${currentPage+1}"${nextDisabled}>${esc(t('catalog.pageNext',lang()))}</button>`;
  };
  function apply(shouldScroll=false){const currentLang=lang(),room=params.get('room')||'',collection=controls.collection?.value||params.get('collection')||'',style=controls.style?.value||params.get('style')||'',type=controls.type?.value||params.get('type')||'',q=(controls.search?.value||params.get('q')||'').toLowerCase();const matches=cards.filter(card=>(!room||card.dataset.room.includes(room))&&(!collection||card.dataset.collection===collection)&&(!style||card.dataset.style===style)&&typeMatches(card.dataset.type,type)&&(!q||`${card.dataset.title} ${card.dataset.collection} ${localName(card.dataset.collection,collectionKeys,currentLang)} ${card.dataset.style} ${card.dataset.type}`.toLowerCase().includes(q)));const ordered=[...matches];if(controls.sort?.value==='az')ordered.sort((a,b)=>a.dataset.title.localeCompare(b.dataset.title));if(controls.sort?.value==='price-low')ordered.sort((a,b)=>Number(a.dataset.price)-Number(b.dataset.price));if(controls.sort?.value==='price-high')ordered.sort((a,b)=>Number(b.dataset.price)-Number(a.dataset.price));const totalPages=Math.max(1,Math.ceil(ordered.length/pageSize));currentPage=Math.min(Math.max(1,currentPage),totalPages);cards.forEach(card=>card.classList.add('hidden'));ordered.forEach((card,index)=>{grid?.appendChild(card);card.classList.toggle('hidden',index<(currentPage-1)*pageSize||index>=currentPage*pageSize)});const countKey=ordered.length===1?'catalog.productCountOne':'catalog.productCount';const count=document.getElementById('resultCount');if(count)count.textContent=t(countKey,currentLang).replace('{count}',ordered.length);document.getElementById('noResults')?.classList.toggle('show',ordered.length===0);renderPagination(totalPages);updatePageUrl();if(shouldScroll)grid?.scrollIntoView({block:'start',behavior:'smooth'})}
  Object.values(controls).filter(Boolean).forEach(node=>{const eventName=node.tagName==='INPUT'?'oninput':'onchange';node[eventName]=()=>{currentPage=1;apply()}});
  const filterForm=document.getElementById('catalogFilters');if(filterForm)filterForm.onsubmit=event=>{event.preventDefault();currentPage=1;apply()};
  if(pagination)pagination.onclick=event=>{const button=event.target.closest('button[data-page]');if(!button||button.disabled)return;currentPage=Number(button.dataset.page)||1;apply(true)};
  apply();
 }
 function renderDetail(){
  if(document.body.dataset.page!=='detail')return;const id=new URLSearchParams(location.search).get('id');if(!id||/^\d+$/.test(id))return;const p=localProducts.find(item=>item.id===id);if(!p)return;
  const currentLang=lang(),name=displayName(p,currentLang),style=cleanStyle(p.style,currentLang),collection=localName(p.collection,collectionKeys,currentLang),room=localName(normalizedRoom(p.room),roomKeys,currentLang);document.title=`${name} · WAO HAVEN`;['detailTitle','detailCrumb','detailMeta','detailKicker'].forEach(id=>document.getElementById(id)?.removeAttribute('data-i18n'));const desc=document.querySelector('.detail-description');desc?.removeAttribute('data-i18n');document.getElementById('detailTitle').textContent=name;document.getElementById('detailCrumb').textContent=name;document.getElementById('detailMeta').textContent=[collection,style,room].filter(Boolean).join(' · ');const kicker=document.getElementById('detailKicker');if(kicker)kicker.textContent=collection;if(desc)desc.textContent=localized(p,'description',currentLang)||t('product.description.generic',currentLang);
  const values={sku:p.sku,price:money(p.price,p),collection,dimensions:formatDimensions(p.dimensions,currentLang),finish:localized(p,'finish',currentLang),custom:t('product.customValue',currentLang)};Object.entries(values).forEach(([key,value])=>{const spec=document.querySelector(`[data-spec="${key}"]`),detail=document.querySelector(`[data-detail-value="${key}"]`);if(spec&&value)spec.textContent=value;if(detail&&value)detail.textContent=value});
  const sameWrap=document.getElementById('detailSameProducts'),variantSection=sameWrap?.closest('.detail-variant-products'),variantTabs=[...document.querySelectorAll('[data-detail-variant-tab]')];if(sameWrap){const groups={sizes:variantProductsFor(p,'sizes'),colors:variantProductsFor(p,'colors'),materials:variantProductsFor(p,'materials')};const hasProducts=Object.values(groups).some(items=>items.length);if(variantSection)variantSection.hidden=!hasProducts;const renderVariant=key=>{const activeKey=groups[key]?.length?key:'sizes',items=groups[activeKey]||[];sameWrap.innerHTML=items.map(item=>`<a class="detail-same-card" href="${productHref(item)}"><img src="${esc(preferredProductImage(item.images))}" alt="${esc(displayName(item,currentLang))}" loading="lazy" decoding="async"><span>${esc(displayName(item,currentLang))}</span></a>`).join('');variantTabs.forEach(button=>{const active=button.dataset.detailVariantTab===activeKey;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active))});sameWrap.scrollTo({left:0,behavior:'auto'})};variantTabs.forEach(button=>{button.onclick=()=>renderVariant(button.dataset.detailVariantTab)});renderVariant('sizes')}
  const recs=recommendedFor(p),recWrap=document.getElementById('detailRecommendations'),recSection=recWrap?.closest('.detail-recommendations');if(recWrap){recWrap.innerHTML=recs.slice(0,Math.max(4,Math.min(10,recs.length))).map(item=>compactProductCard(item,currentLang,'detail-recommendation-item')).join('');recSection.hidden=recs.length===0}
  const thumbs=document.getElementById('detailThumbnails'),image=document.getElementById('detailImage'),video=document.getElementById('detailVideo');if(video){video.pause();video.hidden=true;video.removeAttribute('src')}if(image){image.hidden=false;image.removeAttribute('hidden')}if(thumbs)thumbs.innerHTML='';const preferredSrc=preferredProductImage(p.images),gallery=[preferredSrc,...(p.images||[]).filter(src=>src!==preferredSrc)].filter(Boolean).slice(0,5);gallery.forEach((src,i)=>{const button=document.createElement('button');button.type='button';button.className=`detail-thumbnail${i?'':' active'}`;button.setAttribute('aria-label',t('product.imageAria',currentLang).replace('{index}',i+1));button.innerHTML=`<img src="${esc(src)}" alt="${esc(name)} ${i+1}">`;button.addEventListener('click',()=>{if(video){video.pause();video.hidden=true}image.hidden=false;image.src=src;thumbs?.querySelectorAll('button').forEach(x=>x.classList.remove('active'));button.classList.add('active')});thumbs?.appendChild(button)});if(preferredSrc&&image){image.src=preferredSrc;image.alt=name}
 }
 window.WAO_REFRESH_LOCAL_PRODUCTS=()=>{renderCatalog();renderDetail()};
 window.WAO_REFRESH_LOCAL_PRODUCTS();
})();
