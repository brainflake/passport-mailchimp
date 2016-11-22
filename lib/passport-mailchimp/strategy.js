var OAuth2Strategy = require('passport-oauth2')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError
  , util = require('util');

/**
 * `Strategy` constructor.
 *
 * MailChimp uses the OAuth 2.0 protocol for authentication.
 *
 * Applications using this must supply a callback to verify the credentials which
 * accepts an `accessToken`, `refreshToken`, and a `profile`. After verifying the
 * credentials it should call `done` with the user object and any error that may
 * have occured as the first parameter.
 *
 * Options:
 *   - `clientID`	your MailChimp application's App ID
 *   - `clientSecret`	your MailChimp application's App Secret
 *   - `callbackURL`	URL to which MailChimp will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new MailChimpStrategy({
 *         clientID: 'MAILCHIMP_APP_ID',
 *         clientSecret: 'SECRET_SAUCE',
 *         callbackURL: 'https://www.example.net/auth/mailchimp/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://login.mailchimp.com/oauth2/authorize';
  options.tokenURL = options.tokenURL || 'https://login.mailchimp.com/oauth2/token';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'mailchimp';
  this._oauth2._useAuthorizationHeaderForGET = true;
}

util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from MailChimp.
 *
 * This function constructs a profile from the MailChimp metadata call:
 *
 *   - `provider`	set to `mailchimp`
 *   - `id`		the user's MailChimp ID
 *   - `
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get('https://login.mailchimp.com/oauth2/metadata', accessToken, function (err, body, res) {
    if (err) {
      return done(new InternalOAuthError('Failed to fetch user metadata', err));
    }

    try {
      var json = JSON.parse(body);

      var profile = { provider: 'mailchimp' };
      profile.id = json.login && json.login.login_id
      profile.accessToken = accessToken;
      profile.api_endpoint = json.api_endpoint;
      profile.login_url = json.login_url;
      profile.accountname = json.accountname;
      profile.role = json.role;
      profile.dc = json.dc;

      profile._raw = body;
      profile._json = json;

      done(null, profile);
    } catch (e) {
      done(e);
    }
  });
}

module.exports = Strategy;
