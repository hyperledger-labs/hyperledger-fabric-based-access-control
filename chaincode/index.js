/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const abacFabric = require('./lib/attributebased');

module.exports.AttributeBased = abacFabric;
module.exports.contracts = [ abacFabric ];
