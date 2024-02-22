import http from 'http';
import https from 'https';
// import hmr from 'node-hmr';
import routesGen from '@app/router';
import { app, lifeCycle } from './app';
import { closeSQLite, createSQLite } from '@app/database';

const startHttp = async (callback: http.RequestListener) => {
  await lifeCycle?.http?.beforeStart?.call(app, app);
  return http.createServer(callback.call(app)).listen(process.env.PORT || 4000, lifeCycle?.http?.afterStart?.bind(app, app));
};

const startHttps = async (callback: http.RequestListener) => {
  await lifeCycle?.https?.beforeStart?.call(app, app);
  // const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  // const certificate = fs.readFileSync(certificatePath, 'utf8');
  const credentials = { key: 'privateKey', cert: 'certificate' };
  return https.createServer(credentials, callback.call(app)).listen(process.env.PORT2 || 4001, lifeCycle?.https?.afterStart?.bind(app, app));
};

const start = async () => {
  await lifeCycle.prepare(app);
  await routesGen(app);
  await createSQLite(app);

  const callback: http.RequestListener = app.callback;
  // if (process.env.NODE_ENV === 'development') {
  //   hmr(() => {
  //     console.log('\x1b[42;30m HMR \x1b[40;32m hot module replacement ... \x1b[0m');
  //     const cb = app.callback();
  //     callback = (...rest: Parameters<ReturnType<typeof app.callback>>) => cb(...rest);
  //   }, {
  //     watchDir: './app/'
  //   });
  // }

  // if (process.env.NODE_ENV === 'development' && process.env.npm_lifecycle_event === 'server:dev') {
  //   process.on('SIGTERM', () => {
  //     process.kill(process.pid, 'SIGINT');
  //   });
  // }

  // await Promise.all([startHttp(callback), startHttps(callback)]);

  let server: http.Server | https.Server;
  if (process.env.NODE_ENV === 'production') {
    server = await startHttps(callback);
  } else {
    server = await startHttp(callback);
  }

  server.on('close', () => {
    closeSQLite(app);
    console.log('\x1b[42;30m http \x1b[40;32m 服务已关闭 \x1b[0m');
  });

  process.on('SIGINT', () => {
    server.close();
  });
};

start();
