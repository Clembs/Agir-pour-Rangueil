export function formatRelativeTime(date: Date, locale = 'fr'): string {
	let amount: number = Math.round((date.getTime() - Date.now()) / 60000);
	let unit: Intl.RelativeTimeFormatUnit = 'minute';

	if (Math.abs(date.getTime() - Date.now()) > 60 * 60 * 1000) {
		amount = Math.round(amount / 60);
		unit = 'hour';
	} else if (Math.abs(date.getTime() - Date.now()) > 24 * 60 * 60 * 1000) {
		amount = Math.round(amount / 60 / 24);
		unit = 'day';
	}

	return new Intl.RelativeTimeFormat(locale, {
		style: 'short',
		numeric: 'auto'
	}).format(amount, unit);
}
