
var processInstanceId = "";//流程id

var sequenceId = "";//动态表单类型的流程

var rowId = "";//用户提交的表单数据的id

var taskId = "";//任务id

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'form', 'laydate'], function (exports) {
	winui.renderColor();
	var $ = layui.$,
		table = layui.table,
		laydate = layui.laydate,
		form = layui.form;
	
	// '申请时间'页面的选取时间段表格
	laydate.render({elem: '#createTime', range: '~'});
	
	//申请时间
	var startTime = "", endTime = "";
	
	// 我启动的流程
	table.render({
	    id: 'messageMyStartTable',
	    elem: '#messageMyStartTable',
	    method: 'post',
	    url: flowableBasePath + 'activitimode013',
	    where:{startTime: startTime, endTime: endTime, processInstanceId: $("#processInstanceId").val()},
	    even: true,
	    page: true,
		limits: getLimits(),
		limit: getLimit(),
	    cols: [[
	        { title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
	        { field: 'processInstanceId', title: '流程ID', width: 100 },
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
	        { field: 'agencyName', title: '审批人', width: 120},
	        { field: 'suspended', title: '状态<i id="stateDesc" class="fa fa-question-circle" style="margin-left: 5px"></i>', align: 'center', width: 130, templet: function (d) {
	        	if(d.suspended){
	        		return "<span class='state-down'>挂起</span>";
	        	} else {
	        		return "<span class='state-up'>正常</span>";
	        	}
	        }},
	        { field: 'weatherEnd', title: '审批进度', align: 'left', width: 80, templet: function (d) {
				if (d.weatherEnd == 1) {
					return "<span class='state-up'>已完成</span>";
				} else {
					return "<span class='state-down'>进行中</span>";
				}
	        }},
	        { title: systemLanguage["com.skyeye.operation"][languageType], fixed: 'right', align: 'center', width: 240, toolbar: '#myStartTableBar'}
	    ]],
	    done: function(json) {
	    	matchingLanguage();
	    }
	});
	
	table.on('tool(messageMyStartTable)', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;
        if (layEvent === 'details') { //详情
			activitiUtil.activitiDetails(data);
        } else if (layEvent === 'refreshPic') { //刷新流程图
        	refreshPic(data);
        }
    });
	
	//刷新流程图
	function refreshPic(data) {
		layer.confirm('确认重新生成流程图吗？', { icon: 3, title: '刷新流程图操作' }, function (i) {
			layer.close(i);
            AjaxPostUtil.request({url: flowableBasePath + "activitimode027", params: {processInstanceId: data.processInstanceId}, type: 'json', callback: function (json) {
				winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
 	   		}});
		});
	}
	
    //刷新我启用的流程
	$("body").on("click", "#reloadMyStartTable", function() {
		reloadMyStartTable();
	});
	
	//搜索
	$("body").on("click", "#formSearch", function() {
		searchMyStartTable();
	});
	
    function reloadMyStartTable(){
    	if (!isNull($("#createTime").val())) {//一定要记得，当createTime为空时
    		startTime = $("#createTime").val().split('~')[0].trim() + ' 00:00:00';
    		endTime = $("#createTime").val().split('~')[1].trim() + ' 23:59:59';
    	} else {
    		startTime = "";
    		endTime = "";
    	}
    	table.reloadData("messageMyStartTable", {where:{startTime: startTime, endTime: endTime, processInstanceId: $("#processInstanceId").val()}});
    }
    
    function searchMyStartTable(){
    	if (!isNull($("#createTime").val())) {//一定要记得，当createTime为空时
    		startTime = $("#createTime").val().split('~')[0].trim() + ' 00:00:00';
    		endTime = $("#createTime").val().split('~')[1].trim() + ' 23:59:59';
    	} else {
    		startTime = "";
    		endTime = "";
    	}
    	table.reloadData("messageMyStartTable", {page: {curr: 1}, where:{startTime: startTime, endTime: endTime, processInstanceId: $("#processInstanceId").val()}});
    }
    
    $("body").on("click", "#stateDesc", function() {
		layer.tips('该状态分为挂机和正常，被挂机待办无法进行审批操作', $("#stateDesc"), {
			tips: [1, '#3595CC'],
			time: 4000
		});
	});
    
    exports('initiatedProcess', {});
});
