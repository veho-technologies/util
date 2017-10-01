/* eslint func-names: "off" */
/* eslint prefer-arrow-callback: "off" */

Package.describe({
    name: 'veho:util',
    version: '0.0.1',
    summary: 'tools collection',
    git: 'git@github.com:veho-technologies/util.git',
    documentation: 'README.md',
});

Npm.depends({
    querystring: '0.2.0',
});

Package.onUse(function (api) {
    api.versionsFrom('1.5.1');
    api.use([
        'ecmascript',
        'tmeasday:check-npm-versions',
    ]);

    api.mainModule('index.js');
});
