import __polyfill from "babel-polyfill";
import should from 'should';
import koa from "koa";
import http from "http";
import mount from "../isotropy-mount";

describe("Isotropy mount", () => {

    const makeRequest = (port, host, path, method, headers, cb, onErrorCb) => {
        const options = { host, port, path, method, headers };

        let result = "";
        const req = http.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function(data) { result += data; });
            res.on('end', function() { cb(result); });
        });
        req.on('error', function(e) { onErrorCb(e); });
        req.end();
    };


    it(`GET outside child path should not invoke childApp`, () => {
        const app = new koa();
        const childApp = new koa();
        app.use(mount("/childapp", childApp));

        const calls = [];
        app.use(async (ctx, next) => { calls.push("upstream"); await next(); })
        childApp.use(async (ctx, next) => { calls.push("downstream"); await next(); })

        const promise = new Promise((resolve, reject) => {
            app.listen(function(err) {
                if (err) {
                    reject(err);
                }
                makeRequest(this.address().port, "localhost", "", "GET", { 'Content-Type': 'application/x-www-form-urlencoded' }, resolve, reject);
            });
        });

        return promise.then(() => {
            calls.length.should.equal(1);
            calls[0].should.equal("upstream");
        });
    });


    it(`GET inside child path should only invoke childApp`, () => {
        const app = new koa();
        const childApp = new koa();
        app.use(mount("/childapp", childApp));

        const calls = [];
        app.use(async (ctx, next) => { calls.push("upstream"); await next(); })
        childApp.use(async (ctx, next) => { calls.push("downstream"); await next(); })

        const promise = new Promise((resolve, reject) => {
            app.listen(function(err) {
                if (err) {
                    reject(err);
                }
                makeRequest(this.address().port, "localhost", "/childapp", "GET", { 'Content-Type': 'application/x-www-form-urlencoded' }, resolve, reject);
            });
        });

        return promise.then(() => {
            calls.length.should.equal(1);
            calls[0].should.equal("downstream");
        });
    })


    it(`GET /childappabcd should not invoke childApp`, () => {
        const app = new koa();
        const childApp = new koa();
        app.use(mount("/childapp", childApp));

        const calls = [];
        app.use(async (ctx, next) => { calls.push("upstream"); await next(); })
        childApp.use(async (ctx, next) => { calls.push("downstream"); await next(); })

        const promise = new Promise((resolve, reject) => {
            app.listen(function(err) {
                if (err) {
                    reject(err);
                }
                makeRequest(this.address().port, "localhost", "/childappabcd", "GET", { 'Content-Type': 'application/x-www-form-urlencoded' }, resolve, reject);
            });
        });

        return promise.then(() => {
            calls.length.should.equal(1);
            calls[0].should.equal("upstream");
        });
    })

});
