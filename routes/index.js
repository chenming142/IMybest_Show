var express = require('express');
var router = express.Router();

router.route('/scene/pageList/:sceneId')
    .get(function(req, res, next){
        var JSON = {"success":true,"code":200,"msg":"操作成功","obj":null,"map":null,"list":[{"id":43101838,"sceneId":2915210,"num":1,"name":null,"properties":null,"elements":null,"scene":null}]};
        res.json(JSON);
    });

router.route('/scene/design/:pageId')
    .get(function (req, res, next) {
        var JSON = {"success":true,"code":200,"msg":"操作成功","obj":{"id":43101838,"sceneId":2915210,"num":1,"name":null,"properties":null,"elements":[],"scene":{"id":2915210,"name":"ss","createUser":"4a2d8af94bc9d828014bfd542d520ade","createTime":1427189428000,"type":101,"pageMode":2,"image":{"imgSrc":"group1/M00/61/8A/yq0KA1T2vYSAEgo7AACovQVgHxk048.jpg","isAdvancedUser":false},"isTpl":0,"isPromotion":0,"status":1,"openLimit":0,"startDate":null,"endDate":null,"updateTime":1427189503000,"publishTime":null,"applyTemplate":0,"applyPromotion":0,"sourceId":null,"code":"iMZmtIa9","description":null,"sort":0,"bgAudio":null,"cover":null,"property":null,"pageCount":0,"dataCount":0,"showCount":0,"userLoginName":null,"userName":null}},"map":null,"list":null};
        res.json(JSON);
    });

module.exports = router;
