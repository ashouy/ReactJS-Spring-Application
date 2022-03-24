'use strict';
const rest = require('rest');
const defaultRequest = require('rest/interceptor/defaultRequest');
const mime = require('rest/interceptor/mime');
const errorCode = require('rest/interceptor/errorCode');
const baseRegistry = require('rest/mime/registry');
const uriTemplateInterceptor = require('./api/uriTemplateInterceptor');

const registry = baseRegistry.child();

registry.register('text/uri-list', require('./api/uriListConverter'));
registry.register('application/hal+json', require('rest/mime/type/application/hal'));

module.exports = rest
    .wrap(mime, { registry: registry })
    .wrap(errorCode)
    .wrap(uriTemplateInterceptor)
    .wrap(defaultRequest, { headers: { 'Accept': 'application/hal+json' }});