/* @flow */

/*
    Contains techniques from koa-mount
    https://github.com/koajs/mount/
*/

import type KoaType from "koa";
import compose from "koa-compose";

const mount: (prefix: string, app: KoaType) => KoaMiddlewareType = function(prefix, app) {

    if (!(/^\//.test(prefix))) {
        prefix = "/" + prefix;
    }

    const downstream: KoaMiddlewareType = compose(app.middleware);

    return async function(context, next) {
        const oldPath = context.path;

        /*
            a prefix == url OR
            a prefix/ at the beginning of url OR
            or prefix? at the beginning of url OR
            is a match
        */

        const reqPath = context.path.toLowerCase();

        const isMatch = reqPath === prefix ||
            reqPath.indexOf(prefix + "?") === 0 ||
            reqPath.indexOf(prefix + "/") === 0 ||
            reqPath.indexOf(prefix + "/?") === 0;

        if (isMatch) {
            const newPath = context.path.replace(prefix, '') || "/";
            context.path = newPath;
            await downstream(context, async function() {
                context.path = oldPath;
                await next();
                context.path = newPath;
            });
            context.path = oldPath;
        }
        else {
            await next();
        }

    };
};

export default mount;
