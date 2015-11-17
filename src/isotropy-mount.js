/*
    Contains techniques from koa-mount
    https://github.com/koajs/mount/
*/

import compose from "koa-compose";
import pathToRegexp from "path-to-regexp";

const mount = (prefix, app) => {

    if (prefix[0] !== "/") {
        prefix = "/" + prefix;
    }

    if (prefix[0] !== "/") {
        prefix = "/" + prefix;
    }

    const re = pathToRegexp(prefix);

    // compose
    const downstream = app.middleware
      ? compose(app.middleware)
      : app;

    return async (context, next) => {
        const oldPath = context.path;

        const matches = re.exec(context.path);
        if (matches) {
            const newPath = context.path.replace(prefix, '');
            context.path = newPath;
            await downstream.call(this, async () => {
                this.path = oldPath;
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
