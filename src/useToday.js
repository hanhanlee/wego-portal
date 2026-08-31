import {useEffect,useState} from 'react';
import {taipeiDate} from './updates-data.js';

export default function useToday() {
  const [today,setToday]=useState(()=>taipeiDate());
  useEffect(()=>{
    const refresh=()=>setToday(taipeiDate());
    const timer=setInterval(refresh,60000);
    window.addEventListener('focus',refresh);
    return ()=>{clearInterval(timer);window.removeEventListener('focus',refresh);};
  },[]);
  return today;
}
