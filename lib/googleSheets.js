/* eslint max-len: 0 */
import { Meteor } from 'meteor/meteor';
import GoogleSpreadsheet from 'google-spreadsheet';
import async from 'async';
import Sentry from '@sentry/node';
import { isNil } from 'lodash';

const doc1 = new GoogleSpreadsheet('1DTTUghb7oqBlcE8fb4uuR3E-D-fW1zgGs2ji6aOBmV0');
const doc2 = new GoogleSpreadsheet('1rUswqNsg3_HeqaQUYE0XI1RFc1MWBfVlLFpD8HQwXFo');
const doc3 = new GoogleSpreadsheet('1eeA08sED5KNvYHofzD83JmNRX9u7QqZ6zjM1EqZseAI');
let sheet1;
let sheet2;
let sheet3;
const creds = {
    client_email: Meteor.settings.googleApiCredentials.client_email,
    private_key: Meteor.settings.googleApiCredentials.private_key,
};

export function appendToSheet(_package) {
    if (Meteor.settings.environment === 'production') {
        Sentry.addBreadcrumb({ message: 'sending to google spreadsheet' });
        const populateSpreadsheets = async.seq(
            (step) => {
                doc1.useServiceAccountAuth(creds, step);
            },
            (step) => {
                doc2.useServiceAccountAuth(creds, step);
            },
            (step) => {
                doc3.useServiceAccountAuth(creds, step);
            },
            (step) => {
                doc1.getInfo((err, info) => {
                    sheet1 = info.worksheets[0];
                    step();
                });
            },
            (step) => {
                doc2.getInfo((err, info) => {
                    sheet2 = info.worksheets[0];
                    step();
                });
            },
            (step) => {
                doc3.getInfo((err, info) => {
                    sheet3 = info.worksheets[0];
                    step();
                });
            },
            (step) => {
                const options = {
                    timeZone: 'America/Denver',
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    timeZoneName: 'short',
                };
                const formatter = new Intl.DateTimeFormat([], options);
                const localCreatedAt = formatter.format(new Date(_package.createdAt));

                const data = {
                    street: _package.destination.street,
                    city: _package.destination.city,
                    state: _package.destination.state,
                    zipcode: _package.destination.zipCode,
                    country: 'us',
                    recipient: _package.recipient,
                    phone: _package.phone,
                    notes: `${isNil(_package.destination.apartment) ? '' : `Apartment: ${_package.destination.apartment}`}${!isNil(_package.instructions) && !isNil(_package.destination.apartment) ? '\n' : ''}${isNil(_package.instructions) ? '' : `Instructions: ${_package.instructions}`}`,
                    signaturerequired: _package.signatureRequired,
                    bol: _package.barcode,
                    created: localCreatedAt,
                    environment: Meteor.settings.environment,
                    client: _package.clientName,
                    service: _package.serviceClass,
                    declaredvalue: _package.declaredValue,
                    externalid: _package.externalId,
                };
                sheet1.addRow(data, (err) => { step(err, data); });
            },
            (data, step) => {
                sheet2.addRow(data, (err) => { step(err, data); });
            },
            (data, step) => {
                sheet3.addRow(data, (err) => { step(err, data); });
            },
        );

        populateSpreadsheets((err) => {
            if (err) {
                Sentry.addBreadcrumb({ message: 'error sending to spreadsheet' });
            }
        });
    }
}
