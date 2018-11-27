//var url_home = "http://192.168.43.19:3000";
var url_home = "http://172.16.194.40:3000";
//var url_home = "http://192.168.1.13:3000";
var express = require('express');
var router = express.Router();



router.post('/authenticate', function (req, res, next) {

    var jsonRequest = {
        username: req.body.username,
        password: req.body.password
    }
    $.ajax({
        url: url_home + "/authenticate",
        type: 'post',
        dataType: 'json',
        async: true,
        data: jsonRequest,
        success: function (data) {
            var success = data["success"];
            if (success) {
                var user = data["user"];
                res.render('index', {
                    data: user
                });
            } else {
                res.render('index-login', {
                    data: data
                });
            }
            console.log(data);
        },
        error: function (XMLHttpRequest, textStatus, err) {
            res.render('index-login', {
                success: false,
                message: textStatus
            });
            next();
        }
    });

})



module.exports = router;
