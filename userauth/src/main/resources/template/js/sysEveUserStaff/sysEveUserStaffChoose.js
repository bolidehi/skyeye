
var rowId = "";

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form', 'tableCheckBoxUtil'], function (exports) {
	winui.renderColor();
	var index = parent.layer.getFrameIndex(window.name);
	var $ = layui.$,
		form = layui.form,
		table = layui.table,
		tableCheckBoxUtil = layui.tableCheckBoxUtil;
	var selTemplate = getFileContent('tpl/template/select-option.tpl')

	// 选择类型，默认单选，true:多选，false:单选
	var userStaffCheckType = isNull(parent.systemCommonUtil.userStaffCheckType) ? false : parent.systemCommonUtil.userStaffCheckType;

	// 设置提示信息
	var s = '员工选择规则：';
	if(userStaffCheckType){
		s += '1.多选；如没有查到要选择的员工，请检查员工信息是否满足当前规则。';
		// 多选保存的员工对象信息
		var checkStaffMation = [].concat(parent.systemCommonUtil.checkStaffMation);
		// 初始化值
		var ids = [];
		$.each(checkStaffMation, function(i, item) {
			ids.push(item.id);
		});
		tableCheckBoxUtil.setIds({
			gridId: 'messageTable',
			fieldName: 'id',
			ids: ids
		});
		tableCheckBoxUtil.init({
			gridId: 'messageTable',
			filterId: 'messageTable',
			fieldName: 'id'
		});
	} else {
		s += '双击要选择的数据即可选中';
		$("#saveCheckBox").hide();
	}
	$("#showInfo").html(s);
	
	table.render({
	    id: 'messageTable',
	    elem: '#messageTable',
	    method: 'post',
	    url: reqBasePath + 'staff008',
	    where: getTableParams(),
		even: true,
	    page: true,
	    limits: getLimits(),
	    limit: getLimit(),
	    cols: [[
	    	{ type: userStaffCheckType ? 'checkbox' : 'radio', rowspan: '3', fixed: 'left'},
	        { title: systemLanguage["com.skyeye.serialNumber"][languageType], rowspan: '3', fixed: 'left', type: 'numbers' },
	        { field: 'userName', title: '姓名', rowspan: '3', align: 'left', width: 150, fixed: 'left', templet: function (d) {
	        	return d.jobNumber + ' ' + d.userName;
	        }},
	        { field: 'staffType', title: '类型', rowspan: '3', align: 'left', width: 90, templet: function (d) {
	        	if(d.staffType == 1){
	        		return '普通员工';
	        	} else if (d.staffType == 2){
	        		return '教职工';
	        	} else {
	        		return '参数错误';
	        	}
	        }},
	        { field: 'email', title: '邮箱', rowspan: '3', align: 'left', width: 170 },
	        { field: 'userPhoto', title: '头像', rowspan: '3', align: 'center', width: 60, templet: function (d) {
	        	if(isNull(d.userPhoto)){
	        		return '<img src="../../assets/images/os_windows.png" class="photo-img">';
	        	} else {
	        		return '<img src="' + fileBasePath + d.userPhoto + '" class="photo-img" lay-event="userPhoto">';
	        	}
	        }},
	        { field: 'userIdCard', title: '身份证', rowspan: '3', align: 'center', width: 160 },
	        { field: 'userSex', title: '性别', width: 60, rowspan: '3', align: 'center', templet: function (d) {
				return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("sexEnum", 'id', d.userSex, 'name');
	        }},
	        { field: 'state', title: '状态', rowspan: '3', width: 60, align: 'center', templet: function (d) {
				return skyeyeClassEnumUtil.getEnumDataNameByCodeAndKey("userStaffState", 'id', d.state, 'name');
	        }},
	        { title: '公司信息', align: 'center', colspan: '3'},
	        { field: 'phone', title: '手机号', rowspan: '3', align: 'center', width: 100},
	        { field: 'homePhone', title: '家庭电话', rowspan: '3', align: 'center', width: 100},
	        { field: 'qq', title: 'QQ', rowspan: '3', align: 'left', width: 100}
	    ],[
	    	{ field: 'companyName', title: '公司', align: 'left', width: 120},
	        { field: 'departmentName', title: '部门', align: 'left', width: 120},
	        { field: 'jobName', title: '职位', align: 'left', width: 120}
	       ]
	    ],
	    done: function(res, curr, count){
	    	matchingLanguage();
	    	if(!loadCompany){
	    		initCompany();
	    	}
			if(userStaffCheckType){
				// 设置选中
				tableCheckBoxUtil.checkedDefault({
					gridId: 'messageTable',
					fieldName: 'id'
				});
			} else {
				$('#messageTable').next().find('.layui-table-body').find("table" ).find("tbody").children("tr").on('dblclick',function(){
					var dubClick = $('#messageTable').next().find('.layui-table-body').find("table").find("tbody").find(".layui-table-hover");
					dubClick.find("input[type='radio']").prop("checked", true);
					form.render();
					var chooseIndex = JSON.stringify(dubClick.data('index'));
					var obj = res.rows[chooseIndex];
					parent.systemCommonUtil.checkStaffMation = obj;

					parent.refreshCode = '0';
					parent.layer.close(index);
				});

				$('#messageTable').next().find('.layui-table-body').find("table" ).find("tbody").children("tr").on('click',function(){
					var click = $('#messageTable').next().find('.layui-table-body').find("table").find("tbody").find(".layui-table-hover");
					click.find("input[type='radio']").prop("checked", true);
					form.render();
				});
			}
	    }
	});
	
	table.on('tool(messageTable)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
    });
	
	var loadCompany = false;
	// 初始化公司
	function initCompany(){
		loadCompany = true;
		systemCommonUtil.getSysCompanyList(function (json) {
			// 加载企业数据
			$("#companyList").html(getDataUseHandlebars(selTemplate, json));
			form.render('select');
		});
	}
	
	// 初始化部门
	function initDepartment(){
		showGrid({
		 	id: "departmentList",
		 	url: reqBasePath + "companydepartment007",
		 	params: {companyId: $("#companyList").val()},
		 	pagination: false,
			method: 'POST',
		 	template: selTemplate,
		 	ajaxSendLoadBefore: function(hdb) {},
		 	ajaxSendAfter:function (json) {
		 		form.render('select');
		 	}
	    });
	}
	
	function initJob() {
		// 根据部门id获取岗位集合
		systemCommonUtil.queryJobListByDepartmentId($("#departmentList").val(), function(data) {
			$("#jobList").html(getDataUseHandlebars(selTemplate, data));
			form.render('select');
		});
	}
	
	// 公司监听事件
	form.on('select(companyList)', function(data) {
		initDepartment();
		initJob();
	});
	
	// 部门监听事件
	form.on('select(departmentList)', function(data) {
		initJob();
	});
	
	// 保存
	$("body").on("click", "#saveCheckBox", function() {
		var selectedData = tableCheckBoxUtil.getValue({
			gridId: 'messageTable'
		});
		if(selectedData.length == 0){
			winui.window.msg("请选择员工", {icon: 2, time: 2000});
			return false;
		}
		AjaxPostUtil.request({url: reqBasePath + "staff009", params: {ids: selectedData.toString()}, type: 'json', method: "POST", callback: function (json) {
			parent.systemCommonUtil.checkStaffMation = [].concat(json.rows);
			parent.layer.close(index);
			parent.refreshCode = '0';
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
    
    function loadTable() {
    	table.reloadData("messageTable", {where: getTableParams()});
    }
    
    function refreshTable(){
    	table.reloadData("messageTable", {page: {curr: 1}, where: getTableParams()});
    }

	function getTableParams() {
		return {
			userName: $("#userName").val(),
    		userSex: $("#userSex").val(),
    		userIdCard: $("#userIdCard").val(),
    		companyName: $("#companyList").val(),
    		departmentName: $("#departmentList").val(),
    		jobName: $("#jobList").val()
		};
	}
	
    exports('sysEveUserStaffChoose', {});
});