const timeZones={australia:'Australia/Sydney',japan:'Asia/Tokyo',brazil:'America/Sao_Paulo'};
const input=document.getElementById('searchInput'),out=document.getElementById('results');
function show(items,tz){
  out.innerHTML='';
  if(!items.length){out.textContent='No results found. Try beach, temple or country.';return;}
  items.forEach(i=>{
    const t=i.tz?`<p class="time">Local time: ${new Date().toLocaleTimeString('en-US',{timeZone:i.tz,hour12:true,hour:'numeric',minute:'numeric',second:'numeric'})}</p>`:'';
    out.insertAdjacentHTML('beforeend',`<div class="card"><img src="${i.imageUrl}" alt="${i.name}"><h3>${i.name}</h3><p>${i.description}</p>${t}</div>`);
  });
}
function search(){
  const q=input.value.trim().toLowerCase();
  if(!q){out.innerHTML='';return;}
  fetch('travel_recommendation_api.json').then(r=>r.json()).then(data=>{
    console.log(data);
    let items=[];
    if(q.includes('beach')) items=data.beaches;
    else if(q.includes('temple')) items=data.temples;
    else if(q.includes('countr')) items=data.countries.flatMap(c=>c.cities.map(x=>({...x,tz:timeZones[c.name.toLowerCase()]})));
    else{
      const c=data.countries.find(c=>c.name.toLowerCase().includes(q));
      if(c) items=c.cities.map(x=>({...x,tz:timeZones[c.name.toLowerCase()]}));
    }
    show(items);
  }).catch(e=>{console.error(e);out.textContent='Could not load recommendations.';});
}
document.getElementById('searchBtn').addEventListener('click',search);
input.addEventListener('keydown',e=>{if(e.key==='Enter')search();});
document.getElementById('clearBtn').addEventListener('click',()=>{input.value='';out.innerHTML='';});
