import isArray from 'lodash/isArray';
// lodash doesn't get recognized by check-npm-versions because we never import
// the whole thing, but only f.e. lodash/isArray. This fixes that.
import 'lodash/package.json';
import { Meteor } from 'meteor/meteor';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import { logger } from 'meteor/veho:logging';

checkNpmVersions({
    lodash: '4.17.x',
    'simpl-schema': '1.5.3',
}, 'veho:util');

export * from './lib/idType';
export * from './lib/validate';
export * from './lib/math';
export * from './lib/slack';
export * from './lib/googleSheets';

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

export function createIndex(collection, keys, options, rejectOnError = false) {
    /* eslint-disable consistent-return */
    return collection.rawCollection()
        .createIndex(keys, options)
        .then((idx) => {
            logger.debug(`successfully created index ${idx} on ${collection._name}`);

            return idx;
        }, (error) => {
            logger.error(`error creating index on ${collection._name}`, error);

            if (rejectOnError) {
                return Promise.reject(error);
            }
        });
    /* eslint-enable consistent-return */
}
