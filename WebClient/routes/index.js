var express = require('express');
var router = express.Router();
var jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window);
global.document = new jsdom.JSDOM().window.document;
//var url_home = "http://192.168.43.19:3000";
var url_home = "http://192.168.0.106:3000";
//var url_home = "http://192.168.1.13:3000";

router.get('/', function (req, res, next) {
    res.render('index-login', {
        data: ""
    });

});
router.post('/signup', function (req, res, next) {
    var user = {
        username: req.body.username,
        password: req.body.password,
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        location: req.body.location,
        avatar: ""
    }
    $.ajax({
        url: url_home + "/signup",
        type: 'post',
        dataType: 'json',
        async: true,
        data: user,
        success: function (data) {
            var success = data["success"];
            console.log(success);
            if (success) {
                //                res.render('index-login');
                next();
            }
        },

    });

})


module.exports = router;
