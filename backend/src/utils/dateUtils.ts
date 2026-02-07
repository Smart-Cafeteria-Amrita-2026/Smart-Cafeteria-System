/**
 * Date/Time Utility Functions for IST (Indian Standard Time)
 * IST is UTC + 5:30
 */

// IST offset in milliseconds (5 hours 30 minutes)
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const IST_OFFSET_HOURS = 5;
const IST_OFFSET_MINUTES = 30;

/**
 * Get current date in IST timezone as a Date object
 */
export const getCurrentDateIST = (): Date => {
	const now = new Date();
	const utc = now.getTime() + now.getTimezoneOffset() * 60000;
	return new Date(utc + IST_OFFSET_MS);
};

/**
 * Get current date in IST as ISO string (YYYY-MM-DDTHH:mm:ss.sss+05:30)
 */
export const getCurrentISOStringIST = (): string => {
	const istDate = getCurrentDateIST();
	return formatToISTISOString(istDate);
};

/**
 * Get current date in IST as date-only string (YYYY-MM-DD)
 */
export const getCurrentDateStringIST = (): string => {
	const istDate = getCurrentDateIST();
	return formatDateOnly(istDate);
};

/**
 * Get current time in IST as time-only string (HH:mm:ss)
 */
export const getCurrentTimeStringIST = (): string => {
	const istDate = getCurrentDateIST();
	return formatTimeOnly(istDate);
};

/**
 * Convert a Date object to IST and return ISO string format
 */
export const formatToISTISOString = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");
	const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+05:30`;
};

/**
 * Convert a UTC Date to IST Date
 */
export const convertUTCToIST = (utcDate: Date): Date => {
	const utc = utcDate.getTime() + utcDate.getTimezoneOffset() * 60000;
	return new Date(utc + IST_OFFSET_MS);
};

/**
 * Convert an IST Date to UTC Date
 */
export const convertISTToUTC = (istDate: Date): Date => {
	const utc = istDate.getTime() - IST_OFFSET_MS + istDate.getTimezoneOffset() * 60000;
	return new Date(utc);
};

/**
 * Parse a date-time string and return IST ISO string
 * Useful for database timestamps
 */
export const parseToISTISOString = (dateString: string): string => {
	const date = new Date(dateString);
	const istDate = convertUTCToIST(date);
	return formatToISTISOString(istDate);
};

/**
 * Format date to date-only string (YYYY-MM-DD)
 */
export const formatDateOnly = (date: Date): string => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
};

/**
 * Format date to time-only string (HH:mm:ss)
 */
export const formatTimeOnly = (date: Date): string => {
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");
	return `${hours}:${minutes}:${seconds}`;
};

/**
 * Create a Date object from date and time strings in IST
 * @param dateStr Date string in YYYY-MM-DD format
 * @param timeStr Time string in HH:mm:ss format
 * @returns Date object representing the IST time
 */
export const createISTDate = (dateStr: string, timeStr: string): Date => {
	// Create the date assuming the input is in IST
	const dateTimeStr = `${dateStr}T${timeStr}+05:30`;
	return new Date(dateTimeStr);
};

/**
 * Create a Date object from date and time strings and return as IST ISO string
 * @param dateStr Date string in YYYY-MM-DD format
 * @param timeStr Time string in HH:mm:ss format
 * @returns ISO string in IST format
 */
export const createISTISOString = (dateStr: string, timeStr: string): string => {
	const date = createISTDate(dateStr, timeStr);
	// Since we already created it with IST offset, we just format it
	return `${dateStr}T${timeStr}.000+05:30`;
};

/**
 * Get current Date object in IST as if it were local time
 * This is for comparison purposes where you need IST time values
 */
export const getNowInIST = (): Date => {
	return getCurrentDateIST();
};

/**
 * Format a date to a human-readable IST string
 * Example: "07 Feb 2026, 14:30:00 IST"
 */
export const formatToReadableIST = (date: Date): string => {
	const istDate = convertUTCToIST(date);
	const day = String(istDate.getDate()).padStart(2, "0");
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	const month = months[istDate.getMonth()];
	const year = istDate.getFullYear();
	const time = formatTimeOnly(istDate);
	return `${day} ${month} ${year}, ${time} IST`;
};

/**
 * Add minutes to a date and return IST ISO string
 */
export const addMinutesToDateIST = (date: Date, minutes: number): string => {
	const newDate = new Date(date.getTime() + minutes * 60000);
	const istDate = convertUTCToIST(newDate);
	return formatToISTISOString(istDate);
};

/**
 * Add days to current IST date and return date-only string
 */
export const addDaysToCurrentDateIST = (days: number): string => {
	const istDate = getCurrentDateIST();
	istDate.setDate(istDate.getDate() + days);
	return formatDateOnly(istDate);
};

/**
 * Calculate the difference in milliseconds between two dates
 */
export const getTimeDifferenceMs = (date1: Date, date2: Date): number => {
	return date1.getTime() - date2.getTime();
};

/**
 * Check if a date is in the past (compared to current IST time)
 */
export const isDateInPast = (date: Date): boolean => {
	const now = getNowInIST();
	return date.getTime() < now.getTime();
};

/**
 * Check if current IST time is within a time window
 * @param windowStartDate Date object for window start
 * @param windowEndDate Date object for window end
 */
export const isWithinTimeWindow = (windowStartDate: Date, windowEndDate: Date): boolean => {
	const now = new Date();
	return now >= windowStartDate && now <= windowEndDate;
};
