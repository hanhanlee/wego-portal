import {classHomework} from './homework-data.js';
import {homeworkDays} from './homework-months.js';

// Keep one event per class/date; corrections must retain this UID.
export function homeworkEvents(slug) {
  const homework=classHomework[slug];
  return homeworkDays(homework).map(day=>({
    uid:`${slug}-english-homework-${day.date}`,d:day.label,
    title:`英文作業｜${day.items[0]}`,
    detail:day.items.join('\n'),source:day.source,
    start:day.date,end:day.date,sequence:day.sequence??0
  }));
}
