import SimpleSchema from 'simpl-schema';

export const idType = {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
};

export const optionalIdType = {
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true,
    },
};

export const idSchema = new SimpleSchema(idType);
export const idArraySchema = new SimpleSchema({
    _ids: Array,
    '_ids.$': {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
});
