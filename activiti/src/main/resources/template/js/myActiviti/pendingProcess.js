
var taskId = "";//任务id

var taskType = "";//流程类型

var processInstanceId = "";//流程id

var sequenceId = "";//动态表单类型的流程

// 待我审批
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form'], function (exports) {
	winui.renderColor();
	var $ = layui.$,
		table = layui.table,
		form = layui.form;

	// 待我审批
	table.render({
	    id: 'messageMyNeedDealtTable',
	    elem: '#messageMyNeedDealtTable',
	    method: 'post',
	    url: flowableBasePath + 'activitimode008',
	    where: getTableParams(),
	    even: true,
	    page: true,
		limits: getLimits(),
		limit: getLimit(),
	    cols: [[
	        { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
	        { field: 'processInstanceId', title: '流程ID', width: 280, templet: function (d) {
				return '<a lay-event="details" class="notice-title-click">' + getNotUndefinedVal(d.processInstanceId) + '</a>';
			}},
	        { field: 'taskType', title: '类型', width: 150, templet: function (d) {
				return d.processMation.title;
			}},
	        { field: 'createName', title: '申请人', width: 120, templet: function (d) {
				return d.processMation.createName;
			}},
	        { field: 'createTime', title: '申请时间', align: 'center', width: 150, templet: function (d) {
				return d.processMation.createTime;
			}},
	        { field: 'name', title: '当前节点', width: 130, templet: function (d) {
	        	return '[' + d.name + ']';
	        }},
	        { field: 'suspended', title: '状态<i id="stateDesc" class="fa fa-question-circle" style="margin-left: 5px"></i>', align: 'center', width: 130, templet: function (d) {
	        	if(d.suspended){
	        		return "<span class='state-down'>挂起</span>";
	        	} else {
	        		return "<span class='state-up'>正常</span>";
	        	}
	        }},
	        { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', width: 100, toolbar: '#myNeedDealtTableBar'}
	    ]],
	    done: function(json) {
	    	matchingLanguage();
	    }
	});
	
	table.on('tool(messageMyNeedDealtTable)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent === 'subTasks') { //提交任务
        	subTasks(data, obj);
        } else if (layEvent === 'details') { //详情
			activitiUtil.activitiDetails(data);
        }
    });

	// 提交任务
	function subTasks(data, obj){
		taskId = data.id;
		taskType = data.taskType;
		processInstanceId = data.processInstanceId;
		_openNewWindows({
			url: "../../tpl/approvalActiviti/approvalProcessTask.html",
			title: "流程审批",
			pageId: "approvalProcess",
			area: ['90vw', '90vh'],
			callBack: function (refreshCode) {
				winui.window.msg("提交成功", {icon: 1, time: 2000});
				loadMyNeedDealtTable();
			}});
	}
	
    $("body").on("click", "#stateDesc", function() {
		layer.tips('该状态分为挂机和正常，被挂机待办无法进行审批操作', $("#stateDesc"), {
			tips: [1, '#3595CC'],
			time: 4000
		});
	});

	form.render();
	form.on('submit(formSearch)', function (data) {
		if (winui.verifyForm(data.elem)) {
			table.reloadData("messageMyNeedDealtTable", {page: {curr: 1}, where: getTableParams()});
		}
		return false;
	});

	// 刷新我的待办
	$("body").on("click", "#reloadMyNeedDealtTable", function() {
		loadMyNeedDealtTable();
	});

	function loadMyNeedDealtTable(){
		table.reloadData("messageMyNeedDealtTable", {where: getTableParams()});
	}

    function getTableParams() {
    	return {
    		taskName: $("#taskName").val(),
			processInstanceId: $("#processInstanceId").val()
    	};
	}
    
    exports('pendingProcess', {});
});
