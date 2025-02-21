import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

export const timeAgo = (timestamp: string): string => {
	return dayjs(timestamp).fromNow();
};

export const sortTimeAgo = (timestamp: string): string => {
	const date = dayjs(timestamp);

	if (date.isToday()) return date.format('h:mm A'); // '2:30 PM'
	if (date.isYesterday()) return 'Yest'; // Short for 'Yesterday'

	return date.format('D MMM'); // '19 Feb'
};
