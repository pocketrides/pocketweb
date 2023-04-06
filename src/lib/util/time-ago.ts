import en from 'javascript-time-ago/locale/en';
import TimeAgo, {
  type DateInput,
  type FormatStyleName,
  type Style
} from 'javascript-time-ago';

TimeAgo.addDefaultLocale(en);

const ta = new TimeAgo('en');

export const getTimeAgo = (date: DateInput, style?: FormatStyleName | Style) => {
  return ta.format(date, style);
};

export const formatDate = (
  date: Date,
  dateStyle?: Intl.DateTimeFormatOptions['dateStyle'],
  timeStyle?: Intl.DateTimeFormatOptions['timeStyle']
) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle,
    timeStyle
  }).format(date);
};

// expects a string yyyy-mm-dd and returns a Date for it
export const dateForDate = (value: string) => {
  let d = new Date();
  const [yyyy, mm, dd] = value.split('-');
  d.setFullYear(Number(yyyy));
  d.setMonth(Number(mm) - 1);
  d.setDate(Number(dd));

  return d;
};

// expects a string hh:mm and returns a Date for it
export const dateForTime = (value: string) => {
  let d = new Date();
  const [hh, mm] = value.split(':');
  d.setHours(Number(hh));
  d.setMinutes(Number(mm));

  return d;
};

// expects a value like YYYY-MM-DD (10 digits)
export const formatInputTypeDate = (value: string) => {
  return formatDate(dateForDate(value), 'short');
};

// expects a value like 18:06 (5 digits)
export const formatInputTypeTime = (value: string) => {
  return formatDate(dateForTime(value), undefined, 'short');
};

// expects a value like YYYY-MM-DDTHH:MM (16 digits)
export const formatInputTypeDatetime = (value: string) => {
  const [date, time] = value.split('T');
  if (date === '' || time === '') return value;
  return [formatInputTypeDate(date), formatInputTypeTime(time)].join(' at ');
};

const pad = (n: any) => {
  if (Number(n) < 10) return `0${n}`;
  return n;
};

export const getDatetimeStringForNow = () => {
  const d = new Date();
  const now = d.toLocaleString();
  const [date] = now.split(', ');
  const [month, day, year] = date.split('/');
  return `${year}-${pad(month)}-${pad(day)}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
};
