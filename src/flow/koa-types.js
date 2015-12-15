/* @flow */
export type KoaType = {
    middleware: Array<KoaMiddlewareType>
}

export type KoaNextType = () => Promise

export type KoaContextType = {
    code: number;
    redirect: (url: string) => void;
    method: string;
    path: string;
    status: number;
}

export type KoaMiddlewareType = (context: KoaContextType, next: KoaNextType) => Promise
