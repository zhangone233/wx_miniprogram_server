import { type Middleware } from 'koa';

export default (): Middleware => async (ctx, next) => {
  await next();
  if (ctx.status === 404) {
    ctx.status = 404;
    ctx.body = {
      code: 404,
      message: 'Not Found',
    };
  }
};
