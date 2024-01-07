
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
	
	authBtn('1590311376667'); // 单选题权限
	authBtn('1595035353158'); // 多选题权限
	authBtn('1595035365737'); // 填空题权限
	authBtn('1595035378333'); // 评分题权限
	authBtn('1595035394243'); // 排序题权限
	authBtn('1595035411818'); // 多项填空题权限
	authBtn('1595035460391'); // 矩阵单选题权限
	authBtn('1595035432596'); // 矩阵多选题权限
	authBtn('1595035473610'); // 矩阵评分题权限
	authBtn('1595035491337'); // 矩阵填空题权限

	table.render({
		id: 'messageTable',
		elem: '#messageTable',
		method: 'post',
		url: sysMainMation.schoolBasePath + 'schoolquestionbank001',
		where: getTableParams(),
		even: true,
		page: true,
		limits: getLimits(),
		limit: getLimit(),
		cols: [[
			{ title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
			{ field: 'quTitle', width:250, title: '题目', templet: function (d) {
				return d.quTitle;
			}},
			{ field: 'type', width:80, title: '类型', align: 'center', templet: function (d) {
				if(d.type == 1){
					return '<span style="color: blue">' + d.typeName + '</span>';
				} else {
					return '<span style="color: goldenrod">' + d.typeName + '</span>';
				}
			}},
			{ field: 'cName', width: 100, title: '题型'},
			{ field: 'schoolName', width: 150, title: '学校'},
			{ field: 'gradeName', width: 80, align: 'center', title: '年级'},
			{ field: 'subjectName', width: 80, align: 'center', title: '科目'},
			{ field: 'createTime', title: systemLanguage["com.skyeye.createTime"][languageType], align: 'center', width: 140 },
			{ title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', width: 150, toolbar: '#tableBar'}
		]],
		done: function(json) {
			matchingLanguage();
			initTableSearchUtil.initAdvancedSearch(this, json.searchFilter, form, "暂不支持搜索", function () {
				table.reloadData("messageTable", {page: {curr: 1}, where: getTableParams()});
			});
		}
	});

	table.on('tool(messageTable)', function (obj) {
		var data = obj.data;
		var layEvent = obj.event;
		if (layEvent === 'del') { //删除
			del(data, obj);
		} else if (layEvent === 'edit') { //编辑
			edit(data);
		}
	});

	// 删除
	function del(data, obj) {
		layer.confirm(systemLanguage["com.skyeye.deleteOperationMsg"][languageType], {icon: 3, title: systemLanguage["com.skyeye.deleteOperation"][languageType]}, function (index) {
			layer.close(index);
            AjaxPostUtil.request({url:schoolBasePath + "schoolquestionbank003", params: {rowId: data.id}, type: 'json', callback: function (json) {
				winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
				loadTable();
    		}});
		});
	}
	
	// 编辑
	function edit(data) {
		rowId = data.id;
		var url = "";
		var title = "编辑";
		if (data.quType == '1'){
			url = "../../tpl/schoolQuestionBank/radioAdd.html";
		} else if (data.quType == '2'){
			url = "../../tpl/schoolQuestionBank/checkBoxAdd.html";
		} else if (data.quType == '3'){
			url = "../../tpl/schoolQuestionBank/fillblankAdd.html";
		} else if (data.quType == '4'){
			url = "../../tpl/schoolQuestionBank/multiFillblankAdd.html";
		} else if (data.quType == '8'){
			url = "../../tpl/schoolQuestionBank/scoreAdd.html";
		} else if (data.quType == '9'){
			url = "../../tpl/schoolQuestionBank/orderbyAdd.html";
		} else if (data.quType == '11'){
			url = "../../tpl/schoolQuestionBank/chenRadioAdd.html";
		} else if (data.quType == '12'){
			url = "../../tpl/schoolQuestionBank/chenFbkAdd.html";
		} else if (data.quType == '13'){
			url = "../../tpl/schoolQuestionBank/chenCheckBoxAdd.html";
		} else if (data.quType == '18'){
			url = "../../tpl/schoolQuestionBank/chenScoreAdd.html";
		}
		title += data.cName;
		_openNewWindows({
			url: url, 
			title: title,
			pageId: "editQuestionBankMation",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
	}
	
    // 新增单选题
    $("body").on("click", "#addRadio", function() {
    	rowId = "";
    	_openNewWindows({
			url: "../../tpl/schoolQuestionBank/radioAdd.html", 
			title: "新增单选题",
			pageId: "radioAdd",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
    });
    
    // 新增多选题
    $("body").on("click", "#addCheckBox", function() {
    	rowId = "";
    	_openNewWindows({
			url: "../../tpl/schoolQuestionBank/checkBoxAdd.html", 
			title: "新增多选题",
			pageId: "checkBoxAdd",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
    });
    
    // 新增填空题
    $("body").on("click", "#addFillblank", function() {
    	rowId = "";
    	_openNewWindows({
			url: "../../tpl/schoolQuestionBank/fillblankAdd.html", 
			title: "新增填空题",
			pageId: "fillblankAdd",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
    });
    
    // 新增评分题
    $("body").on("click", "#addScore", function() {
    	rowId = "";
    	_openNewWindows({
			url: "../../tpl/schoolQuestionBank/scoreAdd.html", 
			title: "新增评分题",
			pageId: "scoreAdd",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
    });
    
    // 新增排序题
    $("body").on("click", "#addOrderby", function() {
    	rowId = "";
    	_openNewWindows({
			url: "../../tpl/schoolQuestionBank/orderbyAdd.html", 
			title: "新增排序题",
			pageId: "orderbyAdd",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
    });
    
    // 新增多项填空题
    $("body").on("click", "#addMultiFillblank", function() {
    	rowId = "";
    	_openNewWindows({
			url: "../../tpl/schoolQuestionBank/multiFillblankAdd.html", 
			title: "新增多项排序题",
			pageId: "multiFillblankAdd",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
    });
    
    // 新增矩阵单选题
    $("body").on("click", "#addChenradio", function() {
    	rowId = "";
    	_openNewWindows({
			url: "../../tpl/schoolQuestionBank/chenRadioAdd.html", 
			title: "新增矩阵单选题",
			pageId: "chenRadioAdd",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
    });
    
    // 新增矩阵多选题
    $("body").on("click", "#addChencheckbox", function() {
    	rowId = "";
    	_openNewWindows({
			url: "../../tpl/schoolQuestionBank/chenCheckBoxAdd.html", 
			title: "新增矩阵多选题",
			pageId: "chenCheckBoxAdd",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
    });
    
    // 新增矩阵评分题
    $("body").on("click", "#addChenscore", function() {
    	rowId = "";
    	_openNewWindows({
			url: "../../tpl/schoolQuestionBank/chenScoreAdd.html", 
			title: "新增矩阵评分题",
			pageId: "chenScoreAdd",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
    });
    
    // 新增矩阵填空题
    $("body").on("click", "#addChenfbk", function() {
    	rowId = "";
    	_openNewWindows({
			url: "../../tpl/schoolQuestionBank/chenFbkAdd.html", 
			title: "新增矩阵填空题",
			pageId: "chenFbkAdd",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
    });

	form.render();
	$("body").on("click", "#reloadTable", function() {
		loadTable();
	});
	function loadTable() {
		table.reloadData("messageTable", {where: getTableParams()});
	}

	function getTableParams() {
		return $.extend(true, {}, initTableSearchUtil.getSearchValue("messageTable"));
	}
    
    exports('schoolQuestionBankList', {});
});
