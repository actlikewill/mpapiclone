const Email = require('email-templates');

export const email = new Email({
  message: {
    from: 'niftylettuce@gmail.com'
  },
  // uncomment below to send emails in development/test env:
  // send: true
  transport: {
    jsonTransport: true
  }
});

