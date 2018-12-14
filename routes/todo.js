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
        collectionName,
        user: req.session.uid,
        id: new Date().getTime(),
        isCompleted: false,
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

exports.editToDo = function (req, res, next) {
    const content = req.body.content;
    const id = req.body.id;
    const collectionName = getCollectionName(req.body.type);
    db.__updateOne(collectionName, { id }, { $set: {content} }, function (err, result) {
        if (err) {
            return next(err);
        }
        res.json({ retCode: 200});
    })
}

exports.getToDoList = function (req, res, next) {
    const type = req.query.type;
    const currentTime = new Date().getTime();
    let queryObj = null;
    if (type === 'completed') {
        queryObj = {
            "user": req.session.uid,
            "isCompleted": true
        };
    } else {
        queryObj = {
            "user": req.session.uid,
            "isCompleted": {
                $ne: true
            }
        };
    }
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

exports.addToCompletedOrBack = function (req, res, next) {
    const id = req.body.id;
    const from = req.body.from;
    const collectionName = getCollectionName(from);
    if (from === 'completed') {
        db.__find(collectionName, {id}, (err, result) => {
            if (err) {
                return next(err);
            }
            db.__updateOne(result[0].collectionName, {id}, { $set: {isCompleted: false} }, function (err, result) {
                if (err) {
                    return next(err);
                }
                db.__DeleteOne(collectionName, {id}, function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.json({ retCode: 200, data: {}});
                })
            })
        })
    } else {
        db.__updateOne(collectionName, {id}, { $set: {isCompleted: true} }, function (err, result) {
            if (err) {
                return next(err);
            }
            db.__find(collectionName, {id}, (err, result) => {
                if (err) {
                    return next(err);
                }
                db.__insertOne('completedTodo', result[0], function (err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.json({
                        retCode: 200,
                        data: {
                        }
                    });
                })
            })
        })
    }
}

function getCollectionName(type) {
    if (type === 'today' || type === 'tomorrow') {
        return 'datedTodo';
    }
    return type + 'Todo';
}
