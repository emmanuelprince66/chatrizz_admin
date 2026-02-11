import moment from "moment";

/**
 * Format a date string or Date object into various formats using moment.js
 * @param date - Date string or Date object to format
 * @param format - Desired format (e.g., 'YYYY-MM-DD', 'DD/MM/YYYY', 'MM-DD-YYYY')
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  format: string = "YYYY-MM-DD",
): string => {
  const momentDate = moment(date);

  if (!momentDate.isValid()) {
    return "Invalid Date";
  }

  return momentDate.format(format);
};
