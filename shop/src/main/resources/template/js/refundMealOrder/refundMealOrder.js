
layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui'], function (exports) {
    winui.renderColor();
    layui.use(['form'], function (form) {
        var index = parent.layer.getFrameIndex(window.name);
        var price = GetUrlParam("price");
        var storeId = GetUrlParam("");
        var $ = layui.$,
            form = layui.form,
            table = layui.table;
        soulTable = layui.soulTable;
        var selTemplate = getFileContent('tpl/template/select-option.tpl');

        // 加载当前用户所属门店
        let storeHtml = '';
        AjaxPostUtil.request({url: sysMainMation.shopBasePath + "storeStaff005", params: {}, type: 'json', method: "GET", callback: function(json) {
                // storeHtml = getDataUseHandlebars(selTemplate, json);
                // initTable(storeHtml);
                console.log(99,json)
            }});

        var storeId = "";
        form.on('select(storeId)', function(data) {
            var thisRowValue = data.value;
            storeId = isNull(thisRowValue) ? "" : thisRowValue;
            loadTable();
        });

        // 套餐订单退款原因
        sysDictDataUtil.showDictDataListByDictTypeCode(sysDictData["shopMealRefundOrderReason"]["key"], 'select', "mealRefundReasonId", '', form);
        // 回显退款金额
        $("#refundPrice").val(price);

        // if(parent.dataMation.mealNum == parent.dataMation.remainMealNum){
        //     // 套餐未使用
        //     $("#refundPrice").val(parent.dataMation.unformatPayPrice);
        // } else {
        //     var mealSinglePrice = division(parent.dataMation.unformatPayPrice, parent.dataMation.mealNum);
        //     var refundPrice = multiplication(mealSinglePrice, parent.dataMation.remainMealNum);
        //     $("#refundPrice").val(refundPrice);
        // }


        matchingLanguage();
        form.render();
        form.on('submit(formAddBean)', function (data) {
            if (winui.verifyForm(data.elem)) {
                var params = {
                    mealOrderChildId: parent.dataMation.mealOrderChildId,
                    mealRefundReasonId: $("#mealRefundReasonId").val(),
                    storeId:storeId,
                    refundPrice: $("#refundPrice").val(),
                };

                AjaxPostUtil.request({url: shopBasePath + "refundMealOrder", params: params, type: 'json', method: "POST", callback: function (json) {
                    parent.layer.close(index);
                    parent.refreshCode = '0';
                }, async: true});
            }
            return false;
        });

        function loadTable() {
            table.reloadData("messageTable", {where: getTableParams()});
        }

        function getTableParams() {
            let params = {
                holderId: storeId,
            };
            return $.extend(true, params, initTableSearchUtil.getSearchValue("messageTable"));
        }

        $("body").on("click", "#cancle", function() {
            parent.layer.close(index);
        });
    });
});