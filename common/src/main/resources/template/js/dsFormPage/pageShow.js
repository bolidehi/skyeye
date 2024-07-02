
// 以下两个参数开启团队权限时有值
var objectId = '', objectKey = '';
// 根据以下两个参数判断：工作流的判断是否要根据serviceClassName的判断
var serviceClassName;

layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'table'], function (exports) {
    winui.renderColor();
    var $ = layui.$;
    var pageId = GetUrlParam("pageId");
    var callbackFun = GetUrlParam("callbackFun");

    serviceClassName = GetUrlParam("serviceClassName");
    if (isNull(pageId)) {
        winui.window.msg("请传入布局id", {icon: 2, time: 2000});
        return false;
    }

    // 获取布局信息
    var pageMation = null;
    AjaxPostUtil.request({url: reqBasePath + "dsformpage006", params: {id: pageId}, type: 'json', method: 'GET', callback: function (json) {
        pageMation = json.bean;
        if (isNull(pageMation)) {
            winui.window.msg("该布局信息不存在", {icon: 2, time: 2000});
            return false;
        } else {
            if (pageMation.serviceBeanCustom.serviceBean.teamAuth) {
                objectKey = GetUrlParam("objectKey");
                objectId = GetUrlParam("objectId");
                if (isNull(objectKey) || isNull(objectId)) {
                    winui.window.msg("请传入适用对象信息", {icon: 2, time: 2000});
                    return false;
                }
            }
            init();
        }
    }});

    var pageHtml = {
        'createOrEdit': `<div style="margin:0 auto;padding:20px;">
                        <form class="layui-form" action="" id="showForm" autocomplete="off">
                            <div id="content"></div>
                            <div class="layui-form-item layui-col-xs12">
                                <div class="layui-input-block">
                                    <button class="winui-btn" type="button" id="cancle"><language showName="com.skyeye.cancel"></language></button>
                                    <button class="winui-btn" lay-submit lay-filter="formWriteBean" id="formWriteBean"><language showName="com.skyeye.save"></language></button>
                                </div>
                            </div>
                        </form>
                    </div>`,

        'simpleTable': `<div class="winui-toolbar">
                            <div class="winui-tool" id="toolBar">
                                <button id="reloadTable" class="winui-toolbtn search-table-btn-right"><i class="fa fa-refresh" aria-hidden="true"></i><language showName="com.skyeye.refreshDataBtn"></language></button>
                            </div>
                        </div>
                        <div style="margin:auto 10px;">
                            <table id="messageTable" lay-filter="messageTable"></table>
                            <script type="text/html" id="actionBar">
                                
                            </script>
                        </div>`,

        'details': `<div style="margin:0 auto;padding:20px;">
                        <form class="layui-form" action="" id="showForm" autocomplete="off">
                            <div id="content"></div>
                        </form>
                    </div>`,

    };

    // 初始化加载
    function init() {
        var html;
        if (pageMation.type == 'create' || pageMation.type == 'edit') {
            html = pageHtml['createOrEdit'];
        } else {
            html = pageHtml[pageMation.type];
        }
        $("body").append(html);
        // 加载工作流的提交按钮信息
        if (pageMation.type == 'create' || pageMation.type == 'edit') {
            initSaveForDraftBtn();
        }

        // 加载页面
        initPage();
    }

    function initPage() {
        var businessId = GetUrlParam("id");
        var serviceClassName = pageMation.className;
        if (pageMation.type == 'create') {
            // 创建布局
            initSavePre();
            dsFormUtil.initCreatePage('content', pageMation);
        } else if (pageMation.type == 'edit') {
            // 编辑布局
            initSavePre();
            dsFormUtil.getBusinessData(businessId, serviceClassName, pageMation, function (data) {
                dsFormUtil.initEditPage('content', pageMation, data);
            });
        }  else if (pageMation.type == 'details') {
            // 详情布局
            dsFormUtil.getBusinessData(businessId, serviceClassName, pageMation, function (data) {
                dsFormUtil.initDetailsPage('content', pageMation, data);
            });
        } else if (pageMation.type == 'simpleTable') {
            // 基本表格
            dsFormTableUtil.initDynamicTable('messageTable', pageMation);
        }
    }

    function initSavePre() {
        dsFormUtil.options.savePreParams = function (params) {
            if (!isNull(callbackFun)) {
                //就相当于parent.updateShowFileName(参数1,参数2。。)
                parent[callbackFun](params)
            }
        }
    }

    function initSaveForDraftBtn() {
        var flowable = dsFormUtil.getFlowable(pageMation);
        if (flowable) {
            // 开启工作流
            $('#formWriteBean').before(`<button class="winui-btn" lay-submit lay-filter="formSaveDraft" id="formSaveDraft">保存为草稿</button>`);
            $('#formWriteBean').html('提交');
        }
    }

    exports('pageShow', {});
});
