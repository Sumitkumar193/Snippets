import Bugsnag from '@bugsnag/js';
import Google from '../Google.js';
import Drive from './Drive.js';

/**
 * @class Sheet
 * @summary used for interaction with google spreadsheet
 */
class Sheet extends Google {

    /**
     * Function to be used for creating a spreadsheet
     */
    static async createSheet({ title = 'Test Sheet', sheetName = 'Sheet1', options = {}, sheetOptions = {} }) {
        try {
            const sheets = await super.getService('sheets');
            const res = await sheets.spreadsheets.create({
                resource: {
                    properties: {
                        title,
                        ...options,
                    },
                    sheets: [{
                        properties: {
                            title: sheetName,
                            ...sheetOptions,
                        },
                    }]
                },
            });

            await Drive.givePermission({
                fileId: res.data.spreadsheetId,
                shareOptions: {
                    type: "user",
                    role: "writer",
                    emailAddress: process.env.GOOGLE_SHEET_SHARE_EMAIL?.split(','),
                }
            });

            return res.data;
        } catch (error) {
            Bugsnag.notify(error);
            console.log(error);
            return false;
        }
    }

    /**
     * Function to be used for adding a sheet to a given spreadsheet
     */
    static async addSheet({ spreadsheetId, title = 'Sheet', options = {} }) {
        try {
            const sheets = await super.getService('sheets');
            const res = await sheets.spreadsheets.batchUpdate({
                spreadsheetId,
                requestBody: {
                    requests: [
                        {
                            addSheet: {
                                properties: {
                                    title,
                                    ...options,
                                },
                            },
                        },
                    ],
                },
            });

            return res.data;
        } catch (error) {
            Bugsnag.notify(error);
            console.log(error);
            return false;
        }
    }

    /**
     * Function to be used for saving data (Overwrites the previous)
     */
    static async saveData({ spreadsheetId, range, values }) {
        try {
            const sheets = await super.getService('sheets');
            const res = await sheets.spreadsheets.values.update({
                spreadsheetId,
                range,
                valueInputOption: 'RAW',
                resource: {
                    values,
                },
            });
            return res.data;
        } catch (error) {
            Bugsnag.notify(error);
            console.log(error);
            return false;
        }
    }

    /**
     * Function to be used for appending data to a given sheet
     */
    static async appendData({ spreadsheetId, range, values}) {
        try {
            const sheets = await super.getService('sheets');
            const res = await sheets.spreadsheets.values.append({
                spreadsheetId,
                range,
                valueInputOption: 'RAW',
                resource: {
                    values,
                },
            });
            return res.data;
        } catch (error) {
            Bugsnag.notify(error);
            console.log(error);
            return false;
        }
    }

}

export default Sheet;