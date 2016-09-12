var express = require('express');
var router = express.Router();

Object.assign = require('object-assign');

/**
 * view list
 * @param  {[type]} req                [description]
 * @param  {[type]} res)               {               var db [description]
 * @param  {[type]} function(e,docs){                                       res.json(docs);    });} [description]
 * @return {[type]}                    [description]
 */
router.get('/', function(req, res) {
    var db = req.db;
    db.collection('list').find().toArray(function(err, items) {
        //res.json(items);
        res.render('index.html', { 'title': 'hello', 'items': JSON.stringify(items) });
    });
    //res.send("/ params: " + JSON.stringify(req.params) + "<br/>req: " + JSON.stringify(req.body));
});

/**
 * view list
 * @param  {[type]} req  [description]
 * @param  {[type]} res) {               res.send("params: " + JSON.stringify(req.params) + "<br/>req: " + JSON.stringify(req.body));} [description]
 * @return {[type]}      [description]
 */
router.get('/view', function(req, res) {
    res.send("/view params: " + JSON.stringify(req.params) + "<br/>req: " + JSON.stringify(req.body));
});

/**
 * add item to list
 * @param  {[type]} req                [description]
 * @param  {[type]} res)               {               var db [description]
 * @param  {[type]} function(e,docs){                                       res.json(docs);    });} [description]
 * @return {[type]}                    [description]
 */
router.post('/add', function(req, res) {
    console.log("/add params: " + JSON.stringify(req.params) + "<br/>req: " + JSON.stringify(req.body));
    console.log("subject: " + req.body.subject);
    console.log("content: " + req.body.content);

    var item = new Object();
    item._id = req.body._id;
    item.subject = req.body.subject;
    item.content = req.body.content;
    var db = req.db;
    db.collection('list').insert(item, function(err, result) {
        var msg = '';
        if (err != null)
            msg += 'error: ' + JSON.stringify(err) + '<br>';
        if (result != null)
            msg += 'msg: ' + JSON.stringify(result) + '<br>';

        res.send('msg: ' + msg);
    });
});

/**
 * edit item in list
 * @param  {[type]} req                [description]
 * @param  {[type]} res)               {               var db [description]
 * @param  {[type]} function(e,docs){                                       res.json(docs);    });} [description]
 * @return {[type]}                    [description]
 */
router.put('/edit', function(req, res) {
    res.send("/edit params: " + JSON.stringify(req.params) + "<br/>req: " + JSON.stringify(req.body));
});

/**
 * delete item from list
 * @param  {[type]} req  [description]
 * @param  {[type]} res) {}          [description]
 * @return {[type]}      [description]
 */
router.delete('/delete/:id', function(req, res) {
    res.send("/delete params: " + JSON.stringify(req.params) + "<br/>req: " + JSON.stringify(req.body));
});

module.exports = router;
