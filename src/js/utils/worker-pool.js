const workerpool = require('workerpool');

if(!Boolean(window.workerpool_pool)) {

    window.workerpool_pool = workerpool.pool(null, {minWorkers: "max"});
}

module.exports = window.workerpool_pool;