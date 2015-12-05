import { KoaMiddlewareType } from "koa";
declare module "koa-compose" {
    declare function exports(middleware: Array<KoaMiddlewareType>) : KoaMiddlewareType
}
