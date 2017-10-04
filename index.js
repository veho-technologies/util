import isArray from 'lodash/isArray';
import { Meteor } from 'meteor/meteor';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

// lodash doesn't get recognized by check-npm-versions because we never import
// the whole thing, but only f.e. lodash/isArray. This fixes that.
import 'lodash/package.json';

checkNpmVersions({
    lodash: '4.17.x',
    'simpl-schema': '0.x',
}, 'veho:util');

export * from './lib/idType';
export * from './lib/validate';
export * from './lib/math';

export function promisify(fn, ...args) {
    const [_fn, ctx] = isArray(fn) ? fn : [fn, undefined];
    return new Promise((resolve, reject) => {
        _fn.call(ctx, ...args, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export function aggregate(collection, pipeline, options = {}) {
    const coll = collection.rawCollection();
    const _aggregate = Meteor.wrapAsync(coll.aggregate, coll);

    return _aggregate(pipeline, options);
}

export function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
