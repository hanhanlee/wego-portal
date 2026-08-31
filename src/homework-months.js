// Periods are appended in review order; a later correction replaces the same date.
export function homeworkDays(homework) {
  const byDate=new Map();
  for(const period of homework?.periods||[]) {
    for(const day of period.weeks.flatMap(week=>week.days)) {
      byDate.set(day.date,{...day,source:period.source,sourceId:period.id});
    }
  }
  return [...byDate.values()].sort((a,b)=>a.date.localeCompare(b.date));
}

export function monthSources(homework,month) {
  const ids=new Set(homeworkDays(homework).filter(day=>day.date.startsWith(month+'-')).map(day=>day.sourceId));
  return (homework?.periods||[]).filter(period=>ids.has(period.id));
}

export function moveMonth(month,delta) {
  const [year,number]=month.split('-').map(Number);
  const date=new Date(Date.UTC(year,number-1+delta,1));
  return date.toISOString().slice(0,7);
}

export function monthCells(month) {
  const [year,number]=month.split('-').map(Number);
  const offset=(new Date(Date.UTC(year,number-1,1)).getUTCDay()+6)%7;
  const count=new Date(Date.UTC(year,number,0)).getUTCDate();
  return Array.from({length:Math.ceil((offset+count)/7)*7},(_,index)=>{
    const day=index-offset+1;
    return day<1||day>count?null:`${month}-${String(day).padStart(2,'0')}`;
  });
}
