const db = require('../model/util');
const getSomeTimeStap = require('../util/date.js').getSomeTimeStap;
exports.addToDo = function (req, res, next) {
    const content = req.body.content;
    const type = req.body.type;
    let collectionName = '';
    let startTime = 0;
    let endTime = 0;
    if (type === 'today' || type === 'tomorrow') {
        collectionName = 'datedTodo';
        if (type === 'today') {
            startTime = getSomeTimeStap(0, 0, 0, 0);
            endTime = getSomeTimeStap(23, 59, 59, 999);
        } else {
            startTime = getSomeTimeStap(0, 0, 0, 0) + (24 * 60 * 60 * 1000);
            endTime = getSomeTimeStap(23, 59, 59, 999) + (24 * 60 * 60 * 1000);
        }
    } else {
        collectionName = type + 'Todo';
        startTime = null;
        endTime = null;
    }
    const todo = {
        content,
        startTime,
        endTime,
        user: req.session.uid,
        id: new Date().getTime()
    }
    db.__insertOne(collectionName, todo, function (err, result) {
        if (err) {
            return next(err);
        }
        res.json({ retCode: 200, data: {
            todo
        } });
    })
}

exports.getToDoList = function (req, res, next) {
    const type = req.query.type;
    const currentTime = new Date().getTime();
    let queryObj = {
        "user": req.session.uid
    };
    if (type === 'today' || type === 'tomorrow') {
        collectionName = 'datedTodo';
        if (type === 'today') {
            queryObj.startTime = {
                $lt: currentTime,
            }
        } else {
            queryObj.startTime = {
                $lt: currentTime + (24 * 60 * 60 * 1000),
            }
            queryObj.endTime = {
                $gte: currentTime + (24 * 60 * 60 * 1000),
            }
        }
    } else {
        collectionName = type + 'Todo';
    }
    db.__find(collectionName, queryObj, (err, result) => {
        if (err) {
            return next(err);
        }
        res.json({ retCode: 200, data: {
            todoList: result || []
        }})
    })
}
