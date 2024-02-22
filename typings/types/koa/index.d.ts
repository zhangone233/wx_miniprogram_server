declare module 'koa' {
  import Router from '@koa/router';
  import Application from "@/node_modules/@types/koa";
  import { type Controller } from '@app/controller';
  import { type sqlite3 } from 'sqlite3';

  declare class App<
    StateT = Application.DefaultState,
    ContextT = Application.DefaultContext
    > extends Application<StateT, ContextT> {
    // router: Router extends new (...rest: unknown[]) => infer T ? T : Router;
    router: Router<StateT, ContextT>;
    controller: Controller;
    context: Application.BaseContext & ContextT & {
      db: sqlite3.Database;
      sqlite3: sqlite3;
    };
  }

  declare namespace App {
    interface Context extends Application.Context {}
  }

  export {
    App as Koa
  };

  export = Application;
}
