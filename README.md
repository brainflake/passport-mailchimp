# Passport-MailChimp

[Passport](http://passportjs.org/) strategy for authenticating with [MailChimp](http://www.mailchimp.com/)
using the OAuth 2.0 API.

This module lets you authenticate using MailChimp in your Node.js applications.
By plugging into Passport, MailChimp authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Usage

#### Configure Strategy

The MailChimp authentication strategy authenticates users using a MailChimp
account and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which
accepts these credentials and calls `done` providing a user, as well as
`options` specifying a app ID, app secret, and callback URL.

    passport.use(new MailChimpStrategy({
        clientID: MAILCHIMP_APP_ID,
        clientSecret: MAILCHIMP_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/mailchimp/callback"
      }, function (accessToken, refreshToken, profile, done) {
        User.findOrCreate({ mailchimpId: mailchimp.id }, function(err, user) {
          return done(err, user);
        });
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'mailchimp'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

    app.get('/auth/mailchimp', passport.authenticate('mailchimp'));

    app.get('/auth/mailchimp/callback',
      passport.authenticate('mailchimp', { failureRedirect: '/login' }),
      function(req, res) {
        // Successul authentication, redirect home.
        res.redirect('/');
      });

## Credits

Created by [Brian Falk](http://github.com/brainflake)

Code based on passport-facebook by [Jared Hanson](http://github.com/jaredhanson)

## License

[The MIT License](http://opensource.org/licenses/MIT)
