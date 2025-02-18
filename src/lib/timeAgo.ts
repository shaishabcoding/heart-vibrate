import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const timeAgo = (timestamp: string): string => {
	return dayjs(timestamp).fromNow();
};
