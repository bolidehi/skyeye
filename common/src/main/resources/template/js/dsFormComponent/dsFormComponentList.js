
var rowId = "";

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui'], function (exports) {
	winui.renderColor();
	var $ = layui.$,
		form = layui.form,
		table = layui.table;

	authBtn('1555857604181');
	
	table.render({
	    id: 'messageTable',
	    elem: '#messageTable',
	    method: 'post',
	    url: reqBasePath + 'queryDsFormComponentList',
	    where: getTableParams(),
	    even: true,
	    page: true,
		limits: getLimits(),
		limit: getLimit(),
	    cols: [[
	        { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
			{ field: 'numCode', title: '编码', width: 250 },
	        { field: 'name', title: '名称', width: 160 },
			{ field: 'typeName', title: '分类', width: 100 },
			{ field: 'valueMergType', title: '值合入方式', width: 120, templet: function (d) {
				return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("componentValueMergType", 'id', d.valueMergType, 'name');
			}},
			{ field: 'showType', title: '显示类型', width: 120, templet: function (d) {
				return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("dsFormShowType", 'id', d.showType, 'name');
			}},
			{ field: 'applyRange', title: '适用对象范围', width: 120, templet: function (d) {
				return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("componentApplyRange", 'id', d.applyRange, 'name');
			}},
			{ field: 'id', title: '图标', align: 'center', width: 60, templet: function (d) {
				return systemCommonUtil.initIconShow(d);
			}},
			{ field: 'attrUseNum', title: '组件使用数量', width: 120, templet: function (d) {
				return isNull(d.attrUseNum) ? '0' : d.attrUseNum + '<img src="' + systemCommonUtil.getFilePath('images/util/assest/common/img/analysis.png') + '" class="photo-img" lay-event="attrUseNum">';
			}},
			{ field: 'createName', title: systemLanguage["com.skyeye.createName"][languageType], width: 120 },
			{ field: 'createTime', title: systemLanguage["com.skyeye.createTime"][languageType], align: 'center', width: 150 },
			{ field: 'lastUpdateName', title: systemLanguage["com.skyeye.lastUpdateName"][languageType], align: 'left', width: 120 },
			{ field: 'lastUpdateTime', title: systemLanguage["com.skyeye.lastUpdateTime"][languageType], align: 'center', width: 150 },
	        { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', width: 140, toolbar: '#tableBar' }
	    ]],
	    done: function(json) {
	    	matchingLanguage();
			initTableSearchUtil.initAdvancedSearch(this, json.searchFilter, form, "请输入名称，编码", function () {
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
        } else if (layEvent === 'iconPic') { // 图片
			systemCommonUtil.showPicImg(fileBasePath + data.iconPic);
		} else if (layEvent === 'attrUseNum') { // 组件使用情况
			attrUseNum(data);
		}
    });
	
	// 删除
	function del(data, obj) {
		layer.confirm(systemLanguage["com.skyeye.deleteOperationMsg"][languageType], {icon: 3, title: systemLanguage["com.skyeye.deleteOperation"][languageType]}, function (index) {
			layer.close(index);
            AjaxPostUtil.request({url: reqBasePath + "deleteDsFormComponentMationById", params: {id: data.id}, type: 'json', method: 'DELETE', callback: function (json) {
				winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
				loadTable();
    		}});
		});
	}
	
	// 编辑
	function edit(data) {
		rowId = data.id;
		_openNewWindows({
			url: "../../tpl/dsFormComponent/dsFormComponentEdit.html",
			title: systemLanguage["com.skyeye.editPageTitle"][languageType],
			pageId: "dsFormComponentEdit",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
				loadTable();
			}});
	}

	// 组件使用情况
	function attrUseNum(data) {
		_openNewWindows({
			url: "../../tpl/classServer/classServerList.html?componentId=" + data.id,
			title: '组件使用明细',
			pageId: "classServerList",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
			}});
	}

    // 新增
    $("body").on("click", "#addBean", function() {
    	_openNewWindows({
			url: "../../tpl/dsFormComponent/dsFormComponentAdd.html",
			title: systemLanguage["com.skyeye.addPageTitle"][languageType],
			pageId: "dsFormComponentAdd",
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
    
    exports('dsFormComponentList', {});
});
