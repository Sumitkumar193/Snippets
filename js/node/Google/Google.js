import { google } from 'googleapis';
import path from 'path';

// Drive, Sheets, Calendar
const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets', 
    'https://www.googleapis.com/auth/drive', 
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/calendar'
];

/**
 * @class Google
 * @summary init the session and returns the service
 */
class Google {
    static authInstance = null;

    static async getAuth() {
        if (!this.authInstance) {
            console.log('Getting auth instance');
            const auth = new google.auth.GoogleAuth({
                keyFile: path.resolve(process.cwd(), 'credentials.json'),
                scopes: SCOPES,
            });
            this.authInstance = await auth.getClient();
        }
        return this.authInstance;
    }

    static async getService(service) {
        const auth = await Google.getAuth();
        return google[service]({ version: service === 'sheets' ? 'v4' : 'v3', auth });
    }
}

export default Google;