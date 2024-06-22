
// 学校模块相关工具类
var schoolUtil = {

    /**
     * 获取当前登陆用户所属的学校列表
     *
     * @param callback 回执函数
     */
    queryMyBelongSchoolList: function (callback) {
        AjaxPostUtil.request({url: schoolBasePath + "schoolmation008", params: {}, type: 'json', method: "POST", callback: function(json) {
            if (typeof(callback) == "function") {
                callback(json);
            }
        }, async: false});
    },

};