"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarTool = exports.TimezoneTool = exports.DateTimeTool = void 0;
const Logger_1 = require("../utils/Logger");
class DateTimeTool {
    constructor() {
        this.name = 'datetime_operations';
        this.description = 'Perform various date and time operations';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const dateStr = params.date;
            const format = params.format;
            if (!operation) {
                return { success: false, error: 'operation is required (now, format, calculate, parse)' };
            }
            switch (operation.toLowerCase()) {
                case 'now':
                    // Return current date/time in various formats
                    const now = new Date();
                    return {
                        success: true,
                        data: {
                            isoString: now.toISOString(),
                            utcString: now.toUTCString(),
                            localString: now.toLocaleString(),
                            timestamp: now.getTime(),
                            message: 'Current date and time retrieved'
                        }
                    };
                case 'calculate':
                    // Calculate date differences or additions
                    const startDate = dateStr ? new Date(dateStr) : new Date();
                    const daysToAdd = params.days || 0;
                    const hoursToAdd = params.hours || 0;
                    const minutesToAdd = params.minutes || 0;
                    const calculatedDate = new Date(startDate);
                    calculatedDate.setDate(calculatedDate.getDate() + daysToAdd);
                    calculatedDate.setHours(calculatedDate.getHours() + hoursToAdd);
                    calculatedDate.setMinutes(calculatedDate.getMinutes() + minutesToAdd);
                    const timeDiff = calculatedDate.getTime() - startDate.getTime();
                    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                    return {
                        success: true,
                        data: {
                            startDate: startDate.toISOString(),
                            endDate: calculatedDate.toISOString(),
                            daysDifference: daysDiff,
                            timeDifferenceMs: timeDiff,
                            message: 'Date calculation completed'
                        }
                    };
                case 'format':
                    // Format a date string according to specified format
                    if (!dateStr) {
                        return { success: false, error: 'date is required for format operation' };
                    }
                    const dateToFormat = new Date(dateStr);
                    if (isNaN(dateToFormat.getTime())) {
                        return { success: false, error: 'Invalid date provided' };
                    }
                    let formattedDate;
                    switch (format?.toLowerCase()) {
                        case 'iso':
                            formattedDate = dateToFormat.toISOString();
                            break;
                        case 'locale':
                            formattedDate = dateToFormat.toLocaleDateString();
                            break;
                        case 'time':
                            formattedDate = dateToFormat.toLocaleTimeString();
                            break;
                        case 'datetime':
                            formattedDate = dateToFormat.toLocaleString();
                            break;
                        default:
                            formattedDate = dateToFormat.toString();
                    }
                    return {
                        success: true,
                        data: {
                            originalDate: dateStr,
                            formattedDate,
                            format,
                            message: 'Date formatted successfully'
                        }
                    };
                case 'parse':
                    // Parse a date string and return its components
                    if (!dateStr) {
                        return { success: false, error: 'date is required for parse operation' };
                    }
                    const parsedDate = new Date(dateStr);
                    if (isNaN(parsedDate.getTime())) {
                        return { success: false, error: 'Invalid date provided' };
                    }
                    return {
                        success: true,
                        data: {
                            originalInput: dateStr,
                            parsedDate: parsedDate.toISOString(),
                            year: parsedDate.getFullYear(),
                            month: parsedDate.getMonth() + 1,
                            day: parsedDate.getDate(),
                            hour: parsedDate.getHours(),
                            minute: parsedDate.getMinutes(),
                            second: parsedDate.getSeconds(),
                            timezoneOffset: parsedDate.getTimezoneOffset(),
                            message: 'Date parsed successfully'
                        }
                    };
                default:
                    return { success: false, error: 'Invalid operation. Use: now, calculate, format, or parse' };
            }
        }
        catch (error) {
            Logger_1.Logger.error(`DateTime operation failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.DateTimeTool = DateTimeTool;
class TimezoneTool {
    constructor() {
        this.name = 'timezone_conversion';
        this.description = 'Convert time between different timezones';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const dateTime = params.dateTime;
            const sourceTz = params.sourceTz;
            const targetTz = params.targetTz;
            if (!dateTime) {
                return { success: false, error: 'dateTime is required' };
            }
            if (!targetTz) {
                return { success: false, error: 'targetTz is required' };
            }
            // Parse the input datetime
            const date = new Date(dateTime);
            if (isNaN(date.getTime())) {
                return { success: false, error: 'Invalid date provided' };
            }
            // For this implementation, we'll simulate timezone conversion
            // A full implementation would use Intl.DateTimeFormat for actual conversions
            return {
                success: true,
                data: {
                    originalDateTime: date.toISOString(),
                    sourceTimezone: sourceTz || 'Local',
                    targetTimezone: targetTz,
                    convertedDateTime: date.toISOString(), // Placeholder - in real implementation this would be converted
                    message: 'Timezone conversion (simulated)'
                }
            };
        }
        catch (error) {
            Logger_1.Logger.error(`Timezone conversion failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.TimezoneTool = TimezoneTool;
class CalendarTool {
    constructor() {
        this.name = 'calendar_operations';
        this.description = 'Perform calendar-related operations';
        this.category = 'system';
    }
    async execute(params) {
        try {
            const operation = params.operation;
            const dateStr = params.date;
            if (!operation) {
                return { success: false, error: 'operation is required (getDaysInMonth, isWeekend, daysBetween)' };
            }
            switch (operation.toLowerCase()) {
                case 'getdaysinmonth':
                    // Get number of days in a month
                    const date = dateStr ? new Date(dateStr) : new Date();
                    const year = date.getFullYear();
                    const month = date.getMonth(); // 0-indexed (0 = January)
                    // Calculate days in month
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    return {
                        success: true,
                        data: {
                            year,
                            month: month + 1, // Convert back to 1-indexed
                            daysInMonth,
                            monthName: date.toLocaleString('default', { month: 'long' }),
                            message: 'Days in month calculated'
                        }
                    };
                case 'isweekend':
                    // Check if a date falls on weekend
                    const checkDate = dateStr ? new Date(dateStr) : new Date();
                    const dayOfWeek = checkDate.getDay(); // 0 = Sunday, 6 = Saturday
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                    return {
                        success: true,
                        data: {
                            date: checkDate.toISOString().split('T')[0],
                            dayOfWeek,
                            dayName: checkDate.toLocaleString('default', { weekday: 'long' }),
                            isWeekend,
                            message: 'Weekend check completed'
                        }
                    };
                case 'daysbetween':
                    // Calculate days between two dates
                    const startDateStr = params.startDate;
                    const endDateStr = params.endDate;
                    if (!startDateStr || !endDateStr) {
                        return { success: false, error: 'Both startDate and endDate are required for daysBetween operation' };
                    }
                    const startDate = new Date(startDateStr);
                    const endDate = new Date(endDateStr);
                    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                        return { success: false, error: 'Invalid date(s) provided' };
                    }
                    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
                    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                    return {
                        success: true,
                        data: {
                            startDate: startDate.toISOString().split('T')[0],
                            endDate: endDate.toISOString().split('T')[0],
                            daysBetween: daysDiff,
                            message: 'Days between dates calculated'
                        }
                    };
                default:
                    return { success: false, error: 'Invalid operation. Use: getDaysInMonth, isWeekend, or daysBetween' };
            }
        }
        catch (error) {
            Logger_1.Logger.error(`Calendar operation failed`, { error: error.message });
            return { success: false, error: error.message };
        }
    }
}
exports.CalendarTool = CalendarTool;
