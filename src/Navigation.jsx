import React,{useEffect,useRef,useState} from 'react';
import {House,CalendarDots,BookOpen,Buildings,Megaphone,DotsThree,X,CaretRight,ChatText,Notebook} from '@phosphor-icons/react';
import {contextualHref} from './routing.js';
import {classTeacherNotes} from './teacher-notes-data.js';
import {classContactBooks} from './contact-book-data.js';

const links=[['/','首頁',House],['/calendar','日期行程',CalendarDots],['/learning','學習成長',BookOpen],['/school','學校事務',Buildings],['/notices','通知公告',Megaphone],['/links','常用連結',BookOpen]];
export default function Navigation({ctx,activePath}) {
  const dialog=useRef(null),trigger=useRef(null),pendingHref=useRef(null);
  const [open,setOpen]=useState(false);
  const href=path=>contextualHref(path,ctx,location.hostname);
  const moreLinks=[...(ctx.kind==='class'&&classContactBooks[ctx.slug]?[['/contact-book','每日聯絡簿',Notebook]]:[]),...(ctx.kind==='class'&&classTeacherNotes[ctx.slug]?[['/teacher-notes','導師聯絡事項',ChatText]]:[]),...links.slice(3)];
  const moreActive=links.slice(3).some(([path])=>path===activePath);
  function dismiss(destination=null) {
    pendingHref.current=destination;
    dialog.current.close();setOpen(false);
    if(history.state?.wegoMore) history.back();
    else {dialog.current.close();setOpen(false);if(destination) location.hash=destination;}
  }
  useEffect(()=>{
    // Reloading a transient menu entry must not leave a phantom open-menu state.
    if(history.state?.wegoMore) history.replaceState(null,'',location.href);
    const onPop=()=>{
      if(history.state?.wegoMore){
        if(!dialog.current.open) dialog.current.showModal();
        setOpen(true);
      }else{
        dialog.current?.close();setOpen(false);
        const target=pendingHref.current;pendingHref.current=null;
        if(target) location.hash=target;
      }
    };
    const desktop=matchMedia('(min-width:961px)');
    const onResize=()=>{if(desktop.matches&&dialog.current?.open) dismiss();};
    addEventListener('popstate',onPop);desktop.addEventListener('change',onResize);
    return ()=>{removeEventListener('popstate',onPop);desktop.removeEventListener('change',onResize);};
  },[]);
  function showMore() {
    if(dialog.current.open) return;
    history.pushState({...history.state,wegoMore:true},'',location.href);
    setOpen(true);dialog.current.showModal();
  }
  return <>
    <nav className="desktop-navigation" aria-label="主要導覽">{links.map(([path,label,Icon])=><a key={path} href={href(path)} className={activePath===path?'active':''} aria-current={activePath===path?'page':undefined}><Icon aria-hidden="true"/><span>{label}</span></a>)}</nav>
    <nav className="mobile-navigation" aria-label="手機主要導覽">
      {links.slice(0,3).map(([path,label,Icon],i)=><a key={path} href={href(path)} className={activePath===path?'active':''} aria-current={activePath===path?'page':undefined}><Icon aria-hidden="true"/><span>{['首頁','行程','學習'][i]}</span></a>)}
      <button ref={trigger} type="button" className={moreActive||open?'active':''} aria-expanded={open} aria-controls="more-navigation" aria-haspopup="dialog" onClick={showMore}><DotsThree aria-hidden="true"/><span>更多</span></button>
    </nav>
    <dialog ref={dialog} className="more-dialog" id="more-navigation" aria-labelledby="more-title" onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();dismiss();}}} onCancel={event=>{event.preventDefault();dismiss();}} onClose={()=>{setOpen(false);trigger.current?.focus();}} onClick={event=>{if(event.target===event.currentTarget) dismiss();}}>
      <div className="more-sheet"><div className="more-heading"><h2 id="more-title">更多</h2><button type="button" aria-label="關閉更多選單" onClick={()=>dismiss()}><X/></button></div>
        <nav aria-label="更多頁面">{moreLinks.map(([path,label,Icon])=><a key={path} href={href(path)} aria-current={activePath===path?'page':undefined} onClick={event=>{if(!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey){event.preventDefault();dismiss(href(path));}}}><Icon aria-hidden="true"/><span>{label}</span><CaretRight aria-hidden="true"/></a>)}</nav>
      </div>
    </dialog>
  </>;
}
