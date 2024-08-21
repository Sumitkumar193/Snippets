import Google from '../Google.js';
import Bugsnag from '@bugsnag/js';

/**
 * @class Drive
 * @summary used for changing the permission of file
 */
class Drive extends Google {

    static async givePermission({ fileId, shareOptions = {} }) {
        try {
            const drive = await super.getService('drive');
            await drive.permissions.create({
                fileId,
                requestBody: shareOptions,
            });
            return true;
        } catch (error) {
            Bugsnag.notify(error);
            console.log(error);
            return false;
        }
    }
}

export default Drive;