// erp工具函数
var erpOrderUtil = {

    /**
     * erp单据详情获取url地址
     * @param {} data
     * @return {}
     */
    getErpDetailUrl: function(data) {
        var url = "";
        if (data.subType == 1) {//采购入库---入库
            url = "../../tpl/purchasePut/purchasePutDetails.html";
        } else if (data.subType == 4) {//其他入库---入库
            url = "../../tpl/otherWarehous/otherWarehousDetails.html";
        } else if (data.subType == 2) {//销售退货---入库
            url = "../../tpl/salesReturns/salesReturnsDetails.html";
        } else if (data.subType == 6) {//采购退货---出库
            url = "../../tpl/purchaseReturns/purchaseReturnsDetails.html";
        } else if (data.subType == 9) {//其他出库---出库
            url = "../../tpl/otherOutlets/otherOutletsDetails.html";
        } else if (data.subType == 5) {//销售出库---出库
            url = "../../tpl/salesOutlet/salesOutletDetails.html";
        } else if (data.subType == 8) {//零售出库---出库
            url = "../../tpl/retailOutlet/retailOutletDetails.html";
        } else if (data.subType == 3) {//零售退货---入库
            url = "../../tpl/retailReturns/retailReturnsDetails.html";
        } else if (data.subType == 12) {//拆分单---其他,一进一出
            url = "../../tpl/splitDoc/splitDocDetails.html";
        } else if (data.subType == 13) {//组装单---其他,一进一出
            url = "../../tpl/assemblySheet/assemblySheetDetails.html";
        } else if (data.subType == 14) {//调拨单---其他,一进一出
            url = "../../tpl/allocation/allocationDetails.html";
        } else if (data.subType == 15) {//验收入库单
            url = "";
        } else if (data.subType == 16) {//加工单
            url = "../../tpl/erpMachin/erpMachinDetails.html";
        } else if (data.subType == 17) {//工序验收单
            url = "";
        } else if (data.subType == 18) {//生产计划单
            url = "../../tpl/erpProduction/erpProductionDetail.html";
        } else if (data.subType == 19) {//领料单
            url = "../../tpl/erpPick/erpRequisitionDetails.html";
        } else if (data.subType == 20) {//补料单
            url = "../../tpl/erpPick/erpPatchDetails.html";
        } else if (data.subType == 21) {//退料单
            url = "../../tpl/erpPick/erpReturnDetails.html";
        }
        return url;
    },

    /**
     * 根据单据类型获取单据提交类型
     *
     * @param key 订单唯一标识符
     * @returns {string} 1需要审核；2不需要审核
     */
    getSubmitTypeByKey: function (key) {
        // 1需要审核；2不需要审核
        var submitType = "";
        AjaxPostUtil.request({url: flowableBasePath + "erpcommon004", params: {key: key}, method: "GET", type: 'json', callback: function(json) {
            submitType = json.bean.needExamine;
        }, async: false});

        if (submitType == 1) {
            $(".submitTypeIsOne").show();
            $(".submitTypeIsTwo").hide();
        } else if (submitType == 2) {
            $(".submitTypeIsOne").hide();
            $(".submitTypeIsTwo").show();
        }
        return submitType;
    },

    /**
     * 根据根据提交类型以及当前的状态设置按钮
     *
     * @param submitType 单据提交类型  1需要审核；2不需要审核
     * @param state 单据状态
     */
    orderEditPageSetBtnBySubmitType: function(submitType, state) {
        if (submitType == 1) {
            if (state == 0 || state == 3 || state == 5) {
                $(".formEditBean").removeClass("layui-hide");
                $(".formSubOneBean").removeClass("layui-hide");
            } else if (state == 1) {
                $(".save").removeClass("layui-hide");
            }
        } else if (submitType == 2) {
            if (state != 1) {
                $(".formEditBean").removeClass("layui-hide");
                $(".formSubTwoBean").removeClass("layui-hide");
            }
        }
    },

    /**
     * 删除订单信息
     *
     * @param id 订单id
     * @param serviceClassName 单据类型
     */
    deleteOrderMation: function (id, serviceClassName, callback) {
        layer.confirm(systemLanguage["com.skyeye.deleteOperationMsg"][languageType], {icon: 3, title: systemLanguage["com.skyeye.deleteOperation"][languageType]}, function(index) {
            AjaxPostUtil.request({url: sysMainMation.erpBasePath + "erpcommon005", params: {id: id, serviceClassName: serviceClassName}, method: "DELETE", type: 'json', callback: function(json) {
                winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
                if (typeof (callback) == "function") {
                    callback();
                }
            }});
        });
    },

    /**
     * 提交订单信息
     *
     * @param id 订单id
     * @param serviceClassName 单据类型
     * @param submitType 单据提交类型  1.走工作流提交  2.直接提交
     * @param actKey 该地址为 sysServiceMation.json的key
     */
    submitOrderMation: function (id, serviceClassName, callback) {
        layer.confirm('确认要提交吗？', { icon: 3, title: '提交操作' }, function (index) {
            layer.close(index);
            activitiUtil.startProcess(serviceClassName, null, function (approvalId) {
                var params = {
                    id: id,
                    serviceClassName: serviceClassName,
                    approvalId: approvalId
                };
                AjaxPostUtil.request({url: sysMainMation.erpBasePath + "erpcommon006", params: params, method: "PUT", type: 'json', callback: function(json) {
                    winui.window.msg("提交成功。", {icon: 1, time: 2000});
                    if (typeof (callback) == "function") {
                        callback();
                    }
                }});
            });
        });
    },

    /**
     * 撤销订单信息
     *
     * @param processInstanceId 流程实例id
     * @param serviceClassName 单据类型
     */
    revokeOrderMation: function (processInstanceId, serviceClassName, callback) {
        layer.confirm('确认要撤销吗？', { icon: 3, title: '撤销操作' }, function (index) {
            var params = {
                processInstanceId: processInstanceId,
                serviceClassName: serviceClassName
            };
            AjaxPostUtil.request({url: sysMainMation.erpBasePath + "erpcommon003", params: params, type: 'json', method: "PUT", callback: function(json) {
                winui.window.msg("撤销成功。", {icon: 1, time: 2000});
                if (typeof(callback) == "function") {
                    callback();
                }
            }});
        });
    },

    /**
     * 获取提交类型名称
     *
     * @param data
     * @returns {string}
     */
    getSubmitTypeName: function (data) {
        if (data.submitType == 1) {
            return '工作流审批';
        } else if (data.submitType == 2) {
            return '自主提交';
        }
        return '';
    },

    getProcessInstanceIdBySubmitType: function (data) {
        if (data.submitType == 1) {
            return '<a lay-event="activitiProcessDetails" class="notice-title-click">' + data.processInstanceId + '</a>';
        } else if (data.submitType == 2) {
            return '不涉及';
        }
        return '';
    },

    /**
     * 获取所有仓库信息
     *
     * @param callback 回执函数
     */
    getDepotList: function (callback) {
        AjaxPostUtil.request({url: sysMainMation.erpBasePath + "queryAllStoreHouseList", params: {}, type: 'json', method: "GET", callback: function(json) {
            if (typeof(callback) == "function") {
                callback(json);
            }
        }, async: false});
    },

    /**
     * ERP商品选择对象以及工具函数
     */
    productCheckType: 1, // 商品选择类型：1.单选；2.多选
    chooseProductMation: {}, // 如果productCheckType=1，则为对象；如果productCheckType=2，则为集合
    openMaterialChooseChoosePage: function (callback) {
        _openNewWindows({
            url: "../../tpl/material/materialChoose.html",
            title: "选择商品",
            pageId: "productlist",
            area: ['90vw', '90vh'],
            callBack: function (refreshCode) {
                if (typeof (callback) == "function") {
                    callback(erpOrderUtil.chooseProductMation);
                }
            }
        });
    },

};