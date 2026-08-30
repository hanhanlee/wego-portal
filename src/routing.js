// 網域只決定預設班級脈絡，不提供存取權限或隱私保護。
export const COMMON_ORIGIN='https://info.kiddorpg.cc';
export function defaultClassForHost(hostname){
  return hostname.toLowerCase()==='myclass.kiddorpg.cc'?'vwej3':null;
}

export function routeForLocation(hash,hostname){
  const raw=hash.replace(/^#/,'')||'/';
  let classSlug=defaultClassForHost(hostname),path=raw;
  const match=raw.match(/^\/class\/([^/]+)(\/.*)?$/);
  // 保留舊班級書籤；明確但未知的 slug 交由 App 顯示查無此頁。
  if(match){classSlug=match[1];path=match[2]||'/';}
  if(path==='/items'||path==='/school') path='/school/daily';
  else if(path==='/transport') path='/school/transport';
  return {classSlug,path};
}

export function contextualHref(path,ctx,hostname){
  const base=ctx.kind==='class'&&ctx.slug!==defaultClassForHost(hostname)?`/class/${ctx.slug}`:'';
  return '#'+(base+(path==='/'?'':path)||'/');
}
