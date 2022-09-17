const env = process.env.NODE_ENV || 'development';

let envConfig;
switch (env) {
  case 'dev':
  case 'development':
    ({ envConfig } = await import('./dev.js'));
    break;
  case 'test':
  case 'testing':
    ({ envConfig } = await import('./testing.js'));
    break;
  case 'prod':
  case 'production':
    ({ envConfig } = await import('./prod.js'));
    break;
  default:
    ({ envConfig } = await import('./dev.js'));
}

const { mongoPort, mongoDBName, mongoDBUri } = envConfig;

export { mongoDBName, mongoDBUri, mongoPort };
