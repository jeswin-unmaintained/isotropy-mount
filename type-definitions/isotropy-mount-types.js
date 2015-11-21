type NextType = () => Promise;
type OptionsType = { index?: bool | string, root?: string, defer?: bool };
type ContextType = { code: number, redirect: (url: string) => void, method: string, path: string, status: number };
type MiddlewareType = (context: ContextType, next: NextType) => Promise;
type KoaType = { middleware: Array<MiddlewareType> };
