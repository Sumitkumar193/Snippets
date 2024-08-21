import Twilio from 'twilio';

class TwilioService {
  static fromPhone;
  static sid;
  static authToken;
  static client;

  static init() {
    if (!this.client) {
      this.fromPhone = process.env.TWILIO_PHONE_NUMBER;
      this.sid = process.env.TWILIO_ACCOUNT_SID;
      this.authToken = process.env.TWILIO_AUTH_TOKEN;
      this.client = Twilio(this.sid, this.authToken);
      console.log('Twilio client initialized');
    }
  }

  static async sendSMS({ body, to }) {
    try {
      if (!TwilioService.client) {
        this.init();
      }
      await TwilioService.client.messages.create(
        {
          body,
          to,
          from: this.fromPhone,
        },
        (err, item) => {
          if (err) {
            console.error('Error sending SMS:', err);
          } else {
            console.log('SMS sent:', item?.sid);
          }
        },
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default TwilioService;
