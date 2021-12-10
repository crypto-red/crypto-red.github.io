const workerpool = require('workerpool');
const pool = workerpool.pool(null, {minWorkers: "max"});

module.exports = pool;