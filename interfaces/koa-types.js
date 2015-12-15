declare module "koa-types" {
    declare type KoaType = {
        middleware: Array<KoaMiddlewareType>
    }

    declare type KoaNextType = () => Promise

    declare type KoaContextType = {
        code: number;
        redirect: (url: string) => void;
        method: string;
        path: string;
        status: number;
    }

    declare type KoaMiddlewareType = (context: KoaContextType, next: KoaNextType) => Promise
}
