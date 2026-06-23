const dayjs = require('dayjs');

function overlaps(existingStart, existingEnd, start, end) {
    return !(dayjs(end).isSameOrBefore(existingStart) || dayjs(start).isSameOrAfter(existingEnd));
}

module.exports = { overlaps };
