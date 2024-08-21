import Google from '../Google.js';
import CountryCalendar from './Assets/EnabledCalendarIdMap.js';
import Bugsnag from '@bugsnag/js';

/**
 * @class Calendar
 * @summary used for interaction with Google calendar for key events
 */
class Calendar extends Google {

    static async getCalendarEvents({ country, year }) {
        try {
            const formatCountry = country.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const calendarId = CountryCalendar[formatCountry];
            if (!calendarId) {
                return false;
            }
            const calendar = await super.getService('calendar');
            const events = await calendar.events.list({
                calendarId,
                timeMin: (new Date(`${year}-01-01`)).toISOString(),
                timeMax: (new Date(`${year}-12-31`)).toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
            });

            return events.data.items;
        } catch (error) {
            Bugsnag.notify(error);
            console.log(error);
            return false;
        }
    }
}

export default Calendar;