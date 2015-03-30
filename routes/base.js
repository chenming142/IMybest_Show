var express = require('express');
var router = express.Router();

router.route('/class/tpl_page')
    .get(function(req, res, next){
        var JSON = {"success":true,"code":200,"msg":"操作成功","obj":null,"map":null,"list":[{"id":16630,"name":"版式","value":"1101","type":"tpl_page","sort":1,"status":1,"remark":null},{"id":16632,"name":"风格","value":"1103","type":"tpl_page","sort":2,"status":1,"remark":null},{"id":16631,"name":"互动","value":"1102","type":"tpl_page","sort":3,"status":1,"remark":null}]};
        res.json(JSON);
    });


module.exports = router;