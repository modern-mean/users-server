'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
let serverConfig, clientConfig;

function load() {
  exports.config = serverConfig = {
    modules: {
      users: {
        enable: process.env.MM_USERS_ENABLE || 'true',
        api: {
          hostname: process.env.MM_USERS_API_HOSTNAME || '',
          endpoints: {
            me: process.env.MM_USERS_API_ME_ENDPOINT || '/api/me',
            auth: process.env.MM_USERS_API_AUTH_ENDPOINT || '/api/auth'
          }
        }
      },
      admin: {
        enable: process.env.MM_USERS_ADMIN_ENABLE || 'true',
        api: {
          hostname: process.env.MM_USERS_ADMIN_API_HOSTNAME || '',
          endpoint: process.env.MM_USERS_ADMIN_API_ENDPOINT || '/api/users'
        }
      }
    },
    jwt: {
      secret: process.env.MM_USERS_JWT_SECRET || 'MODERN!MEAN!t0p$3cr37!t0k3n',
      options: { //Anything From https://www.npmjs.com/package/jsonwebtoken
        expiresIn: process.env.MM_USERS_JWT_EXPIRES || '1d'
      }
    },
    logs: {
      //https://github.com/winstonjs/winston
      winston: {
        level: process.env.MM_USERS_WINSTON_LEVEL || process.env.MM_WINSTON_LEVEL || 'info', //{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
        file: process.env.MM_USERS_WINSTON_FILE || process.env.MM_WINSTON_FILE || './logs/users.log',
        console: process.env.MM_USERS_WINSTON_CONSOLE || process.env.MM_WINSTON_CONSOLE || 'true'
      }
    },
    mongoose: {
      uri: process.env.MM_USERS_MONGOOSE_URI || process.env.MM_MONGOOSE_URI || 'mongodb://localhost/',
      db: process.env.MM_USERS_MONGOOSE_DB || process.env.MM_MONGOOSE_DB || 'modern-mean-dev',
      options: {
        user: process.env.MM_USERS_MONGOOSE_USER || process.env.MM_MONGOOSE_USER || '',
        pass: process.env.MM_USERS_MONGOOSE_PASSWORD || process.env.MM_MONGOOSE_PASSWORD || ''
      },
      // Enable mongoose debug mode
      debug: process.env.MM_MONGOOSE_DEBUG || process.env.MM_USERS_MONGOOSE_DEBUG || 'false',
      seed: process.env.MM_MONGOOSE_SEED || process.env.MM_USERS_MONGOOSE_SEED || 'false'
    },
    social: {
      facebook: {
        enable: process.env.MM_USERS_SOCIAL_FACEBOOK_ENABLE || 'false',
        client: process.env.MM_USERS_SOCIAL_FACEBOOK_CLIENT || 'false',
        secret: process.env.MM_USERS_SOCIAL_FACEBOOK_SECRET || 'false',
        callback: process.env.MM_USERS_SOCIAL_FACEBOOK_CALLBACK || '/api/auth/facebook/callback'
      },
      twitter: {
        enable: process.env.MM_USERS_SOCIAL_TWITTER_ENABLE || 'false',
        client: process.env.MM_USERS_SOCIAL_TWITTER_CLIENT || 'false',
        secret: process.env.MM_USERS_SOCIAL_TWITTER_SECRET || 'false',
        callback: process.env.MM_USERS_SOCIAL_TWITTER_CALLBACK || '/api/auth/twitter/callback'
      },
      google: {
        enable: process.env.MM_USERS_SOCIAL_GOOGLE_ENABLE || 'false',
        client: process.env.MM_USERS_SOCIAL_GOOGLE_CLIENT || 'false',
        secret: process.env.MM_USERS_SOCIAL_GOOGLE_SECRET || 'false',
        callback: process.env.MM_USERS_SOCIAL_GOOGLE_CALLBACK || '/api/auth/google/callback'
      },
      linkedin: {
        enable: process.env.MM_USERS_SOCIAL_LINKEDIN_ENABLE || 'false',
        client: process.env.MM_USERS_SOCIAL_LINKEDIN_CLIENT || 'false',
        secret: process.env.MM_USERS_SOCIAL_LINKEDIN_SECRET || 'false',
        callback: process.env.MM_USERS_SOCIAL_LINKEDIN_CALLBACK || '/api/auth/linkedin/callback'
      },
      github: {
        enable: process.env.MM_USERS_SOCIAL_GITHUB_ENABLE || 'false',
        client: process.env.MM_USERS_SOCIAL_GITHUB_CLIENT || 'false',
        secret: process.env.MM_USERS_SOCIAL_GITHUB_SECRET || 'false',
        callback: process.env.MM_USERS_SOCIAL_GITHUB_CALLBACK || '/api/auth/github/callback'
      }
    },
    uploads: {
      profile: {
        destination: process.env.MM_USERS_PROFILE_UPLOAD || './public/img/profile/uploads/',
        public: process.env.MM_USERS_PROFILE_PUBLIC || '/img/profile/uploads/',
        limits: {
          fileSize: process.env.MM_USERS_PROFILE_SIZE || '1045876' // Max file size in bytes (1 MB)
        }
      }
    }
  };

  exports.clientConfig = clientConfig = {
    constants: {
      MODULES: serverConfig.modules,
      SOCIAL: {
        facebook: {
          enable: serverConfig.social.facebook.enable,
          callback: serverConfig.social.facebook.callback
        },
        twitter: {
          enable: serverConfig.social.facebook.enable,
          callback: serverConfig.social.twitter.callback
        },
        google: {
          enable: serverConfig.social.facebook.enable,
          callback: serverConfig.social.google.callback
        },
        linkedin: {
          enable: serverConfig.social.facebook.enable,
          callback: serverConfig.social.google.callback
        },
        github: {
          enable: serverConfig.social.facebook.enable,
          callback: serverConfig.social.google.callback
        }
      }
    },
    values: {
      UPLOAD: serverConfig.uploads
    }
  };
}

load();

exports.load = load;
exports.config = serverConfig;
exports.clientConfig = clientConfig;