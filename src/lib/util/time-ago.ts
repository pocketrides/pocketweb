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
