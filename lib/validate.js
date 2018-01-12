import isArray from 'lodash/isArray';
import keys from 'lodash/keys';
import { Roles } from 'meteor/alanning:roles';
import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { idType } from './idType';

export function checkIfObjectExist(collection, _id) {
    let selector = { _id };
    let expectedCount = 1;
    if (isArray(_id)) {
        check(_id, [String]);
        expectedCount = _id.length;
        selector = { _id: { $in: _id } };
    } else {
        check(_id, String);
    }

    if (Meteor.isServer && collection.find(selector).count() !== expectedCount) {
        throw new Meteor.Error('error.not-found', 'Object does not exist');
    }
}

export function validateUpdate(schema) {
    return (doc) => {
        // only validate the _id and the given keys
        const validator = schema
            .pick(...keys(doc))
            .extend(idType)
            .validator();

        return validator(doc);
    };
}

// You should only use this helper if the schema is also attached to the
// collection you're updating. Otherwise it might allow objects to pass
// validation and enter methods with malicious entries being cleaned out solely
// during validation, not the collection mutation.
export function cleanedValidateUpdate(schema) {
    return (doc) => {
        // only validate the _id and the given keys
        const subSchema = schema.pick(...keys(doc)).extend(idType);
        const validator = subSchema.validator();

        // clean the doc so that strings are converted to numbers etc but do
        // not get autovalues. This would remove e.g. createdAt which then
        // again throws validation errors because it is required.
        const cleanDoc = subSchema.clean(doc, { getAutoValues: false });
        return validator(cleanDoc);
    };
}

export function createAccessDeniedError(reason = 'Must be an admin to perform this operation') {
    return new Meteor.Error('errors.access-denied', reason);
}

export function ensureAdminInPublication(publication, group) {
    if (!publication.userId) {
        publication.ready();

        return false;
    }

    if (!Roles.userIsInRole(publication.userId, 'admin', group)) {
        throw createAccessDeniedError();
    }

    return true;
}

export function validatePublicationOptions(options) {
    check(options, {
        limit: Match.Maybe(Number),
        skip: Match.Maybe(Number),
        sort: Match.Maybe(Object),
    });
}
