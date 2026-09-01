import React,{useDeferredValue,useMemo,useState} from 'react';
import {MagnifyingGlass,CaretRight} from '@phosphor-icons/react';
import {buildSearchRecords,normalizeSearchText,searchRecords,searchSnippet} from './search-index.js';
import {contextualHref} from './routing.js';

function Highlight({text,query}){
  const value=String(text||'');
  const tokens=normalizeSearchText(query).split(' ').filter(Boolean);
  if(!tokens.length) return value;
  const escaped=tokens.map(token=>token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');
  const parts=value.split(new RegExp(`(${escaped})`,'gi'));
  return parts.map((part,index)=>tokens.includes(normalizeSearchText(part))?<mark key={`${part}-${index}`}>{part}</mark>:part);
}

export default function SearchPage({ctx,extras,updated}){
  const [query,setQuery]=useState('');
  const [category,setCategory]=useState('全部');
  const deferredQuery=useDeferredValue(query);
  const records=useMemo(()=>buildSearchRecords(ctx,extras),[ctx.kind,ctx.slug,extras]);
  const categories=useMemo(()=>['全部',...new Set(records.map(record=>record.category))],[records]);
  const results=useMemo(()=>searchRecords(records,deferredQuery,category),[records,deferredQuery,category]);
  const href=path=>contextualHref(path,ctx,location.hostname);
  return <>
    <div className="page-header"><div><h1>搜尋本站</h1><p>{ctx.kind==='class'?`搜尋共通資訊與${ctx.label}班級內容。`:'搜尋小鈴鐺共通資訊。'}</p></div><time>內容最後更新：{updated}</time></div>
    <section className="search-panel" role="search" aria-label="網站全文搜尋">
      <label htmlFor="site-search">輸入關鍵字</label><div className="search-input-wrap"><MagnifyingGlass aria-hidden="true"/><input id="site-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="例如：運動服、警報器、9/19" autoComplete="off" autoFocus/></div>
      <div className="search-filters" aria-label="內容類型">{categories.map(item=><button type="button" aria-pressed={category===item} className={category===item?'selected':undefined} onClick={()=>setCategory(item)} key={item}>{item}</button>)}</div>
    </section>
    {!query.trim()?<section className="search-empty"><MagnifyingGlass aria-hidden="true"/><h2>搜尋已整理的網站內容</h2><p>可搜尋聯絡簿、通知、行事曆、作業、學習資料、學校事務與常用連結。</p></section>:<section className="search-results" aria-live="polite" aria-label="搜尋結果">
      <div className="search-result-heading"><h2>搜尋結果</h2><span>{results.length} 筆</span></div>
      {results.length?results.map(result=><a href={href(result.path)} className="search-result" key={result.id}><div><span className="search-result-meta">{ctx.kind==='class'?`${result.scope==='class'?ctx.label:'共通'}・`:''}{result.category}{result.date?`・${result.date}`:''}</span><h3><Highlight text={result.title} query={deferredQuery}/></h3><p><Highlight text={searchSnippet(result.body,deferredQuery)} query={deferredQuery}/></p><small>來源：{result.source}</small></div><CaretRight aria-hidden="true"/></a>):<div className="search-no-results"><h3>找不到符合的內容</h3><p>請縮短關鍵字、改用其他用詞，或切換到「全部」類型。</p></div>}
    </section>}
  </>;
}
