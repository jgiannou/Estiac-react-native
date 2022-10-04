'use strict';

/**
 * estia service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::estia.estia');
