
var companyId = "";
var departmentId = "";
var jobId = "";
var jobScoreId = "";

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'fileUpload', 'dtree', 'laydate'], function (exports) {
	winui.renderColor();
	layui.use(['form'], function (form) {
		var index = parent.layer.getFrameIndex(window.name);
	    var $ = layui.$,
			laydate = layui.laydate,
	    	dtree = layui.dtree;
	    
	    showGrid({
		 	id: "showForm",
		 	url: reqBasePath + "staff003",
		 	params: {rowId: parent.rowId},
		 	pagination: false,
			method: "GET",
		 	template: $("#beanTemplate").html(),
		 	ajaxSendLoadBefore: function(hdb) {
		 		hdb.registerHelper("compare1", function(v1, options){
					if(isNull(v1)){
						return path + "assets/img/uploadPic.png";
					} else {
						return basePath + v1;
					}
				});
		 	},
		 	
		 	ajaxSendAfter:function (json) {
				// 参加工作时间
				laydate.render({elem: '#workTime', range: false});

		 		// 设置性别
		 		$("input:radio[name=userSex][value=" + json.bean.userSex + "]").attr("checked", true);
				// 初始化上传
				$("#userPhoto").upload(systemCommonUtil.uploadCommon003Config('userPhoto', 6, json.bean.userPhoto, 1));

		 		// 初始化公司
		 		dtree.render({
		 			elem: "#demoTree1",  // 绑定元素
		 			url: reqBasePath + 'queryCompanyMationListTree', // 异步接口
		 			dataStyle: 'layuiStyle',
		 			done: function(json) {
		 				if($("#demoTree1 li").length > 0){
		 					for(var i = 0; i < $("#demoTree1 li").length; i++){
	 							if($("#demoTree1 li").eq(i).attr("data-id") == json.bean.companyId){
	 								$("#demoTree1 li").eq(i).children('div').click();
	 								return;
	 							}
	 						}
		 				}
		 			}
		 		});
		 		
		 		dtree.on("node('demoTree1')" ,function(param){
		 			companyId = param.nodeId;
		 			// 初始化部门
		 			dtree.render({
		 				elem: "#demoTree2",  // 绑定元素
		 				url: reqBasePath + 'companydepartment006?companyId=' + companyId, // 异步接口
		 				dataStyle: 'layuiStyle',
		 				done: function(json) {
		 					departmentId = "";
		 					if($("#demoTree2 li").length > 0){
		 						for(var i = 0; i < $("#demoTree2 li").length; i++){
		 							if($("#demoTree2 li").eq(i).attr("data-id") == json.bean.departmentId){
		 								$("#demoTree2 li").eq(i).children('div').click();
		 								return;
		 							}
		 						}
		 					} else {
		 						jobId = "";
		 						//初始化职位
		 			 			dtree.render({
		 			 				elem: "#demoTree3",  //绑定元素
		 			 				url: reqBasePath + 'companyjob006?departmentId=0', //异步接口
		 			 				dataStyle: 'layuiStyle',
		 			 				done: function(json) {
		 			 				}
		 			 			});
		 					}
		 				}
		 			});
		 		});
		 		
		 		dtree.on("node('demoTree2')" ,function(param){
		 			departmentId = param.nodeId;
		 			//初始化职位
		 			dtree.render({
		 				elem: "#demoTree3",  //绑定元素
		 				url: reqBasePath + 'companyjob006?departmentId=' + departmentId, //异步接口
		 				dataStyle: 'layuiStyle',
		 				done: function(json) {
		 					jobId = "";
		 					if($("#demoTree3 li").length > 0){
		 						for(var i = 0; i < $("#demoTree3 li").length; i++){
		 							if($("#demoTree3 li").eq(i).attr("data-id") == json.bean.jobId){
		 								$("#demoTree3 li").eq(i).children('div').click();
		 								return;
		 							}
		 						}
		 					}
		 				}
		 			});
		 		});

				dtree.on("node('demoTree3')" ,function(param){
					jobId = param.nodeId;
					// 初始化职位定级
					dtree.render({
						elem: "#demoTree4",
						url: reqBasePath + 'companyjobscore008?jobId=' + jobId,
						dataStyle: 'layuiStyle',
						method: 'GET',
						done: function(json) {
							jobScoreId = "";
							if($("#demoTree4 li").length > 0){
								for(var i = 0; i < $("#demoTree4 li").length; i++){
									if($("#demoTree4 li").eq(i).attr("data-id") == json.bean.jobScoreId){
										$("#demoTree4 li").eq(i).children('div').click();
										return;
									}
								}
							}
						}
					});
				});

				dtree.on("node('demoTree4')" ,function(param){
					jobScoreId = param.nodeId;
				});
		 		
		 		// 考勤时间段
		 		showGrid({
			     	id: "checkTimeBox",
			     	url: sysMainMation.checkworkBasePath + "queryEnableCheckWorkTimeList",
			     	params: {},
					method: 'GET',
			     	pagination: false,
			     	template: $("#checkTimeStrTemplate").html(),
			     	ajaxSendLoadBefore: function(hdb) {
			     	},
			     	ajaxSendAfter:function(data) {
			     		for(var i in json.bean.checkTimeStr){
							$('input:checkbox[rowId="' + json.bean.checkTimeStr[i].timeId + '"]').attr("checked", true);
						}
			     		form.render('checkbox');
			     	}
			    });
		 		
			    matchingLanguage();
		 		form.render();
		 	    form.on('submit(formEditBean)', function (data) {
		 	        if (winui.verifyForm(data.elem)) {
		 	        	if(isNull(companyId)){
		 	        		winui.window.msg('请选择所属公司', {icon: 2, time: 2000});
		 	        		return false;
		 	        	}
		 	        	if(isNull(departmentId)){
		 	        		winui.window.msg('请选择所属部门', {icon: 2, time: 2000});
		 	        		return false;
		 	        	}
		 	        	if(isNull(jobId)){
		 	        		winui.window.msg('请选择职位信息', {icon: 2, time: 2000});
		 	        		return false;
		 	        	}
		 	        	
		 	        	var timeIds = "";
			        	$.each($('input:checkbox:checked'),function(){
			        		timeIds = timeIds + $(this).attr("rowId") + ",";
			            });
			            if(isNull(timeIds)){
		 	        		winui.window.msg('请选择考勤段', {icon: 2, time: 2000});
		 	        		return false;
		 	        	}
		 	        	
		 	        	var params = {
		 	        		rowId: parent.rowId,
		 	        		userIdCard: $("#userIdCard").val(),
							userName: $("#userName").html(),
		 	        		userSex: $("input[name='userSex']:checked").val(),
		 	        		email: $("#email").val(),
		 	        		qq: $("#qq").val(),
		 	        		phone: $("#phone").val(),
		 	        		homePhone: $("#homePhone").val(),
		 	        		userSign: $("#userSign").val(),
							workTime: $("#workTime").val(),
							entryTime: $("#entryTime").html(),
		 	        		companyId: companyId,
		 	        		departmentId: departmentId,
		 	        		jobId: jobId,
							jobScoreId: jobScoreId,
		 	        		checkTimeStr: timeIds,
							state: $("#state").attr("state"),
							trialTime: $("#trialTime").html()
		 	        	};
		 	        	params.userPhoto = $("#userPhoto").find("input[type='hidden'][name='upload']").attr("oldurl");
		 	        	if(isNull(params.userPhoto)){
		 	        		winui.window.msg('请上传头像', {icon: 2, time: 2000});
		 	        		return false;
		 	        	}

		 	        	AjaxPostUtil.request({url: reqBasePath + "staff004", params: params, type: 'json', callback: function (json) {
							parent.layer.close(index);
							parent.refreshCode = '0';
			 	   		}});
		 	        }
		 	        return false;
		 	    });
		 	}
		});
	    
	    $("body").on("click", "#cancle", function() {
	    	parent.layer.close(index);
	    });
	});
});