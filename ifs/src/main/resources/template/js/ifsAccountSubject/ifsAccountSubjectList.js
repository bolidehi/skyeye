
var rowId = "";

layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form'], function (exports) {
    winui.renderColor();
    var $ = layui.$,
        form = layui.form,
        table = layui.table;

    authBtn('1638095858826');

    var selTemplate = getFileContent('tpl/template/select-option.tpl');
    $("#type").html(getDataUseHandlebars(selTemplate, {rows: accountSubjectUtil.accountSubjectType}));

    table.render({
        id: 'messageTable',
        elem: '#messageTable',
        method: 'post',
        url: reqBasePath + 'ifsaccountsubject001',
        where: getTableParams(),
        even: true,
        page: true,
        limits: getLimits(),
        limit: getLimit(),
        cols: [[
            { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers'},
            { field: 'num', title: '编号', align: 'left', width: 180},
            { field: 'name', title: '会计科目名称', align: 'left', width: 200, templet: function(d){
                return '<a lay-event="select" class="notice-title-click">' + d.name + '</a>';
            }},
            { field: 'type', title: '类型', align: 'center', width: 120, templet: function(d){
                return getInPoingArr(accountSubjectUtil.accountSubjectType, "id", d.type, "name");
            }},
            { field: 'state', title: '状态', align: 'center', width: 80},
            { field: 'remark', title: '备注', align: 'left', width: 200},
            { field: 'createName', title: systemLanguage["com.skyeye.createName"][languageType], width: 100 },
            { field: 'createTime', title: systemLanguage["com.skyeye.createTime"][languageType], align: 'center', width: 150 },
            { field: 'lastUpdateName', title: systemLanguage["com.skyeye.lastUpdateName"][languageType], align: 'left', width: 100 },
            { field: 'lastUpdateTime', title: systemLanguage["com.skyeye.lastUpdateTime"][languageType], align: 'center', width: 150},
            { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', width: 200, toolbar: '#tableBar'}
        ]],
	    done: function(){
	    	matchingLanguage();
	    }
    });

    table.on('tool(messageTable)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent === 'edit') { //编辑
            edit(data);
        }else if (layEvent === 'delete') { //删除
            delet(data);
        }else if (layEvent === 'select'){//查看详情
            selectDetails(data);
        }
    });

    // 编辑
    function edit(data){
        rowId = data.id;
        _openNewWindows({
            url: "../../tpl/ifsAccountSubject/ifsAccountSubjectEdit.html",
            title: systemLanguage["com.skyeye.editPageTitle"][languageType],
            pageId: "ifsAccountSubjectEdit",
            area: ['90vw', '90vh'],
            callBack: function(refreshCode){
                if (refreshCode == '0') {
                    winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1,time: 2000});
                    loadTable();
                } else if (refreshCode == '-9999') {
                    winui.window.msg(systemLanguage["com.skyeye.operationFailed"][languageType], {icon: 2,time: 2000});
                }
            }
        });
    }

    // 删除
    function delet(data){
        layer.confirm(systemLanguage["com.skyeye.deleteOperationMsg"][languageType], {icon: 3, title: systemLanguage["com.skyeye.deleteOperation"][languageType]}, function(index){
            layer.close(index);
            AjaxPostUtil.request({ url: reqBasePath + "ifsaccountsubject005", params: {rowId: data.id}, type: 'json', method: "DELETE", callback: function(json){
                if(json.returnCode == 0){
                    winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
                    loadTable();
                }else{
                    winui.window.msg(json.returnMessage, {icon: 2, time: 2000});
                }
            }});
        });
    }

    function selectDetails(data){
        rowId = data.id;
        _openNewWindows({
            url: "../../tpl/ifsAccountSubject/ifsAccountSubjectDetails.html",
            title: systemLanguage["com.skyeye.detailsPageTitle"][languageType],
            pageId: "ifsAccountSubjectDetails",
            area: ['90vw', '90vh'],
            callBack: function(refreshCode){
            }
        });
    }

    // 添加
    $("body").on("click", "#addBean", function(){
        _openNewWindows({
            url: "../../tpl/ifsAccountSubject/ifsAccountSubjectAdd.html",
            title: systemLanguage["com.skyeye.addPageTitle"][languageType],
            pageId: "ifsAccountSubjectAdd",
            area: ['90vw', '90vh'],
            callBack: function(refreshCode){
                if (refreshCode == '0') {
                    winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1,time: 2000});
                    loadTable();
                } else if (refreshCode == '-9999') {
                    winui.window.msg(systemLanguage["com.skyeye.operationFailed"][languageType], {icon: 2,time: 2000});
                }
            }});
    });

    form.render();
    form.on('submit(formSearch)', function (data) {
        if (winui.verifyForm(data.elem)) {
            refreshTable();
        }
        return false;
    });

    $("body").on("click", "#reloadTable", function() {
        loadTable();
    });

    // 刷新
    function loadTable(){
        table.reload("messageTable", {where: getTableParams()});
    }

    // 搜索
    function refreshTable(){
        table.reload("messageTable", {page: {curr: 1}, where: getTableParams()})
    }

    function getTableParams(){
        return {
            name: $("#name").val(),
            state: $("#state").val(),
            type: $("#type").val()
        };
    }

    exports('ifsAccountSubjectList', {});
});