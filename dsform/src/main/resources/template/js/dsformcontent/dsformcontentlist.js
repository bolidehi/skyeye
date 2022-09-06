
var rowId = "";

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form', 'codemirror', 'xml', 'clike', 'css', 'htmlmixed', 'javascript', 'nginx',
           'solr', 'sql', 'vue'], function (exports) {
	winui.renderColor();
	var $ = layui.$,
		form = layui.form,
		table = layui.table;

	authBtn('1555857604181');
	
	table.render({
	    id: 'messageTable',
	    elem: '#messageTable',
	    method: 'post',
	    url: flowableBasePath + 'queryDsFormContentList',
	    where: getTableParams(),
	    even: true,
	    page: true,
		limits: getLimits(),
		limit: getLimit(),
	    cols: [[
	        { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
	        { field: 'contentName', title: '组件名称', width: 120 },
			{ field: 'typeName', title: '分类', width: 120 },
	        { title: 'HTML脚本', align: 'center', width: 90, templet: function (d) {
	        	return '<i class="fa fa-fw fa-html5 cursor" lay-event="htmlContent"></i>';
	        }},
	        { title: 'JS脚本', align: 'center', width: 80, templet: function (d) {
				if (!isNull(d.jsContent)) {
					return '<i class="fa fa-fw fa-html5 cursor" lay-event="jsContent"></i>';
				} else {
					return '-';
				}
	        }},
			{ field: 'id', title: '图标', align: 'center', width: 60, templet: function (d) {
				return systemCommonUtil.initIconShow(d);
			}},
			{ field: 'createName', title: systemLanguage["com.skyeye.createName"][languageType], width: 120 },
			{ field: 'createTime', title: systemLanguage["com.skyeye.createTime"][languageType], align: 'center', width: 150 },
			{ field: 'lastUpdateName', title: systemLanguage["com.skyeye.lastUpdateName"][languageType], align: 'left', width: 120 },
			{ field: 'lastUpdateTime', title: systemLanguage["com.skyeye.lastUpdateTime"][languageType], align: 'center', width: 150 },
	        { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', width: 140, toolbar: '#tableBar'}
	    ]],
	    done: function(json) {
	    	matchingLanguage();
			initTableSearchUtil.initAdvancedSearch(this, json.searchFilter, form, "请输入组件名称", function () {
				table.reloadData("messageTable", {page: {curr: 1}, where: getTableParams()});
			});
	    }
	});
	
	var editor = CodeMirror.fromTextArea(document.getElementById("modelContent"), {
        mode : "text/x-java",  // 模式
        theme : "eclipse",  // CSS样式选择
        indentUnit : 2,  // 缩进单位，默认2
        smartIndent : true,  // 是否智能缩进
        tabSize : 4,  // Tab缩进，默认4
        readOnly : true,  // 是否只读，默认false
        showCursorWhenSelecting : true,
        lineNumbers : true,  // 是否显示行号
        styleActiveLine: true, //line选择是是否加亮
        matchBrackets: true
    });
	
	table.on('tool(messageTable)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent === 'del') { //删除
        	del(data, obj);
        } else if (layEvent === 'edit') { //编辑
        	edit(data);
        } else if (layEvent === 'htmlContent') { //查看代码内容
        	var mode = returnModel(data.htmlType);
        	if (!isNull(mode.length)) {
				editor.setOption('mode', mode)
			} 
        	editor.setValue(data.htmlContent);
        	layer.open({
	            id: 'HTML模板内容',
	            type: 1,
	            title: 'HTML模板内容',
	            shade: 0.3,
	            area: ['90vw', '90vh'],
	            content: $("#modelContentDiv").html()
	        });
        } else if (layEvent === 'jsContent') { //查看代码内容
        	var mode = returnModel(data.jsType);
        	if (!isNull(mode.length)) {
				editor.setOption('mode', mode)
			} 
        	editor.setValue(data.jsContent);
        	layer.open({
	            id: 'JS模板内容',
	            type: 1,
	            title: 'JS模板内容',
	            shade: 0.3,
	            area: ['90vw', '90vh'],
	            content: $("#modelContentDiv").html()
	        });
        } else if (layEvent === 'iconPic') { // 图片
			systemCommonUtil.showPicImg(fileBasePath + data.iconPic);
		}
    });
	
	//删除
	function del(data, obj) {
		layer.confirm(systemLanguage["com.skyeye.deleteOperationMsg"][languageType], {icon: 3, title: systemLanguage["com.skyeye.deleteOperation"][languageType]}, function (index) {
			layer.close(index);
            AjaxPostUtil.request({url: flowableBasePath + "deleteDsFormContentMationById", params: {id: data.id}, type: 'json', method: 'DELETE', callback: function (json) {
				winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
				loadTable();
    		}});
		});
	}
	
	//编辑
	function edit(data) {
		rowId = data.id;
		_openNewWindows({
			url: "../../tpl/dsformcontent/dsformcontentedit.html", 
			title: systemLanguage["com.skyeye.editPageTitle"][languageType],
			pageId: "dsformcontentedit",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
	}

    //新增
    $("body").on("click", "#addBean", function() {
    	_openNewWindows({
			url: "../../tpl/dsformcontent/dsformcontentadd.html", 
			title: systemLanguage["com.skyeye.addPageTitle"][languageType],
			pageId: "dsformcontentadd",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
    });

	form.render();
	//刷新数据
	$("body").on("click", "#reloadTable", function() {
		loadTable();
	});
	
    function loadTable() {
    	table.reloadData("messageTable", {where: getTableParams()});
    }
    
	function getTableParams() {
		return $.extend(true, {}, initTableSearchUtil.getSearchValue("messageTable"));
	}
    
    exports('dsformcontentlist', {});
});
