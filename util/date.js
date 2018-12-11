exports.getSomeTimeStap = function (hour, minute, second, msecond) {
    return new Date(new Date().setHours(...arguments)).getTime();
}
