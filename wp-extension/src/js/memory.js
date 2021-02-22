import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

// Extend with plugin
dayjs.extend(isSameOrBefore)

export const LEARNING_INTERVAL = 2
export const INITIAL_INTERVAL = 0.8 // 2.5 * 0.8 = 2
export const EASE_FACTOR = 2.5 // from Anki
export const RATINGS = {
	bad: 0,
	good: 1,
}

export function getNewDueDate(
	rating = RATINGS.good,
	timeInterval = INITIAL_INTERVAL
) {
	const multiplier =
		rating === 1
			? 2.5 * timeInterval
			: timeInterval > LEARNING_INTERVAL
			? timeInterval
			: LEARNING_INTERVAL

	const newDueDate = dayjs()
		.add(multiplier, 'day')
		.format('YYYY-MM-DD')

	return { multiplier, newDueDate }
}

export function checkIfBefore(date) {
	// return true // temporarly
	return dayjs(date).isSameOrBefore(dayjs())
}
