var layedit;

var userReturnList = new Array();//选择用户返回的集合或者进行回显的集合
var chooseOrNotMy = "2";//人员列表中是否包含自己--1.包含；其他参数不包含
var chooseOrNotEmail = "2";//人员列表中是否必须绑定邮箱--1.必须；其他参数没必要
var checkType = "1";//人员选择类型，1.多选；其他。单选

var userList = new Array();//选择用户返回的集合或者进行回显的集合

// 我的月报
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'tagEditor'], function (exports) {
	winui.renderColor();
	layui.use(['form', 'layedit'], function (form) {
		var index = parent.layer.getFrameIndex(window.name);
	    var $ = layui.$;
		    layedit = layui.layedit;
		var reg = new RegExp("<br>", "g");
	    var userId = "";            //月报接收人id
	    
	    layedit.set({
	    	uploadImage: {
	    		url: reqBasePath + "common003", //接口url
    			type: 'post', //默认post
    			data: {
    				type: '13'
    			}
	    	}
	    });
	    
	    var layEditParams = {
	    	tool: [
    	       'html'
    	       ,'strong' //加粗
    	       ,'italic' //斜体
    	       ,'underline' //下划线
    	       ,'del' //删除线
    	       ,'addhr'
    	       ,'|'
    	       ,'removeformat'
    	       ,'fontFomatt'
    	       ,'fontfamily'
    	       ,'fontSize'
    	       ,'colorpicker'
    	       ,'fontBackColor'
    	       ,'face' //表情
    	       ,'|' //分割线
    	       ,'left' //左对齐
    	       ,'center' //居中对齐
    	       ,'right' //右对齐
    	       ,'link' //超链接
    	       ,'unlink' //清除链接
    	       ,'code'
    	       ,'image' //插入图片
    	       ,'attachment'
    	       ,'table'
    	       ,'|'
    	       ,'fullScreen'
    	       ,'preview'
    	       ,'|'
    	       ,'help'
    	     ],
    	     uploadFiles: {
    	 		url: reqBasePath + "common003",
    	 		accept: 'file',
    	 		acceptMime: 'file/*',
    	 		size: '20480',
    	 		data: {
    				type: '13'
    			},
    	 		autoInsert: true, //自动插入编辑器设置
    	 		done: function(data) {
    	 		}
    	 	}
	    };

	    showGrid({
		 	id: "showForm",
		 	url: reqBasePath + "diary020",
		 	params: {rowId:parent.rowId},
		 	pagination: false,
		 	template: getFileContent('tpl/jobdiaryMySend/jobdiaryMySendMonthEditTemplate.tpl'),
		 	ajaxSendLoadBefore: function(hdb){
		 		hdb.registerHelper("compare1", function(v1, options){
					return v1.replace(reg, "\n");
				});
		 	},
		 	ajaxSendAfter:function(json){
		 		var userNames = "";
                var userList = json.bean.userInfo;
                $.each(userList, function (i, item) {
                	userNames += item.name + ',';
                });
                //人员选择
                $('#userName').tagEditor({
                	initialTags: userNames.split(','),
                	placeholder: '请选择接收人',
					editorTag: false,
                	beforeTagDelete: function(field, editor, tags, val) {
                		var inArray = -1;
                		$.each(userList, function(i, item) {
                			if(val === item.name) {
                				inArray = i;
                				return false;
                			}
                		});
                		if(inArray != -1) { //如果该元素在集合中存在
                			userList.splice(inArray, 1);
                		}
                	}
                });
		 		var monthCompletedContent = layedit.build('monthCompletedContent', layEditParams);
			    var monthWorkSummaryContent = layedit.build('monthWorkSummaryContent', layEditParams);
			    var monthNextWorkPlanContent = layedit.build('monthNextWorkPlanContent', layEditParams);
			    var monthCoordinaJobContent = layedit.build('monthCoordinaJobContent', layEditParams);
				// 附件回显
				skyeyeEnclosure.initTypeISData({'enclosureUpload': json.bean.enclosureInfo});
			    //人员选择
                $("body").on("click", "#userNameSelPeople", function(e){
                    userReturnList = [].concat(userList);
                    _openNewWindows({
                        url: "../../tpl/common/sysusersel.html", 
                        title: "人员选择",
                        pageId: "sysuserselpage",
                        area: ['80vw', '80vh'],
                        callBack: function(refreshCode){
                            if (refreshCode == '0') {
                                //移除所有tag
                                var tags = $('#userName').tagEditor('getTags')[0].tags;
                                for (i = 0; i < tags.length; i++) { 
                                    $('#userName').tagEditor('removeTag', tags[i]);
                                }
                                userList = [].concat(userReturnList);
                                //添加新的tag
                                $.each(userList, function(i, item){
                                    $('#userName').tagEditor('addTag', item.name);
                                });
                            } else if (refreshCode == '-9999') {
                                winui.window.msg(systemLanguage["com.skyeye.operationFailed"][languageType], {icon: 2,time: 2000});
                            }
                        }});
                });
                
                matchingLanguage();
			    form.render();
			    form.on('switch(monthCompletedImagetext)', function (data) {
		 			//是否图文模式
		 			$(data.elem).val(data.elem.checked);
		 			if(data.elem.value === 'true' || data.elem.value === true){
		 				$("#monthCompletedText").parent().hide();
			    		$("#monthCompletedContent").parent().show();
			    		layedit.setContent(monthCompletedContent, $("#monthCompletedText").val().replace(/\n|\r\n/g, "<br>"), false);
		 			}else{
		 				$("#monthCompletedText").parent().show();
			    		$("#monthCompletedContent").parent().hide();
			    		$("#monthCompletedText").val(layedit.getText(monthCompletedContent).replace(reg, "\n").replace(/<[^>]+>/g,""));
		 			}
		 		});
			    form.on('switch(monthWorkSummaryImagetext)', function (data) {
		 			//是否图文模式
		 			$(data.elem).val(data.elem.checked);
		 			if(data.elem.value === 'true' || data.elem.value === true){
		 				$("#monthWorkSummaryText").parent().hide();
			    		$("#monthWorkSummaryContent").parent().show();
			    		layedit.setContent(monthWorkSummaryContent, $("#monthWorkSummaryText").val().replace(/\n|\r\n/g, "<br>"), false);
		 			}else{
		 				$("#monthWorkSummaryText").parent().show();
			    		$("#monthWorkSummaryContent").parent().hide();
			    		$("#monthWorkSummaryText").val(layedit.getText(monthWorkSummaryContent).replace(reg, "\n").replace(/<[^>]+>/g,""));
		 			}
		 		});
			    form.on('switch(monthNextWorkPlanImagetext)', function (data) {
		 			//是否图文模式
		 			$(data.elem).val(data.elem.checked);
		 			if(data.elem.value === 'true' || data.elem.value === true){
		 				$("#monthNextWorkPlanText").parent().hide();
			    		$("#monthNextWorkPlanContent").parent().show();
			    		layedit.setContent(monthNextWorkPlanContent, $("#monthNextWorkPlanText").val().replace(/\n|\r\n/g, "<br>"), false);
		 			}else{
		 				$("#monthNextWorkPlanText").parent().show();
			    		$("#monthNextWorkPlanContent").parent().hide();
			    		$("#monthNextWorkPlanText").val(layedit.getText(monthNextWorkPlanContent).replace(reg, "\n").replace(/<[^>]+>/g,""));
		 			}
		 		});
			    form.on('switch(monthCoordinaJobImagetext)', function (data) {
		 			//是否图文模式
		 			$(data.elem).val(data.elem.checked);
		 			if(data.elem.value === 'true' || data.elem.value === true){
		 				$("#monthCoordinaJobText").parent().hide();
			    		$("#monthCoordinaJobContent").parent().show();
			    		layedit.setContent(monthCoordinaJobContent, $("#monthCoordinaJobText").val().replace(/\n|\r\n/g, "<br>"), false);
		 			}else{
		 				$("#monthCoordinaJobText").parent().show();
			    		$("#monthCoordinaJobContent").parent().hide();
			    		$("#monthCoordinaJobText").val(layedit.getText(monthCoordinaJobContent).replace(reg, "\n").replace(/<[^>]+>/g,""));
		 			}
		 		});
			    
			    form.on('submit(monthSubmit)', function (data) {
			        if (winui.verifyForm(data.elem)) {
		        		var params = {
		        			jobRemark: encodeURIComponent($("#monthJobRemark").val()),
		        			jobTitle: $("#jobMonthTitle").val(),
		        			id: json.bean.id,
							monthenclosureInfo: skyeyeEnclosure.getEnclosureIdsByBoxId('enclosureUpload')
		        		};
		        		if(userList.length == 0 || isNull($('#userName').tagEditor('getTags')[0].tags)){
                            winui.window.msg('请选择收件人', {icon: 2,time: 2000});
                            return false;
                        }else{
                            $.each(userList, function (i, item) {
                                userId += item.id + ',';
                            });
                            params.userId = userId;
                        }
		        		if(data.field.monthCompleted === 'true'){
		        			if(isNull(layedit.getContent(monthCompletedContent))){
		        				winui.window.msg('请填写本月已完成工作', {icon: 2,time: 2000});
		        				return false;
		        			}else{
		        				params.completedJob = encodeURIComponent(layedit.getContent(monthCompletedContent));
		        			}
		        		}else{
		        			if(isNull($("#monthCompletedText").val())){
		        				winui.window.msg('请填写本月已完成工作', {icon: 2,time: 2000});
		        				return false;
		        			}else{
		        				params.completedJob = encodeURIComponent($("#monthCompletedText").val().replace(/\n|\r\n/g, "<br>"));
		        			}
		        		}
		        		if(data.field.monthCoordinaJob === 'true'){
		        			params.coordinaJob = encodeURIComponent(layedit.getContent(monthCoordinaJobContent));
		        		}else{
		        			params.coordinaJob = encodeURIComponent($("#monthCoordinaJobText").val().replace(/\n|\r\n/g, "<br>"));
		        		}
		        		if(data.field.monthNextWorkPlan === 'true'){
		        			params.nextWorkPlan = encodeURIComponent(layedit.getContent(monthNextWorkPlanContent));
		        		}else{
		        			params.nextWorkPlan = encodeURIComponent($("#monthNextWorkPlanText").val().replace(/\n|\r\n/g, "<br>"));
		        		}
		        		if(data.field.monthWorkSummary === 'true'){
		        			params.thisWorkSummary = encodeURIComponent(layedit.getContent(monthWorkSummaryContent));
		        		}else{
		        			params.thisWorkSummary = encodeURIComponent($("#monthWorkSummaryText").val().replace(/\n|\r\n/g, "<br>"));
		        		}
		        		
		        		AjaxPostUtil.request({url:reqBasePath + "diary021", params:params, type:'json', callback:function(json){
                            if(json.returnCode == 0){
                                parent.layer.close(index);
                                 parent.refreshCode = '0';
                            }else{
                                winui.window.msg(json.returnMessage, {icon: 2,time: 2000});
                            }
                        }});
			        }
			        return false;
		 	    });
		 	}
		});

	    //取消
	    $("body").on("click", "#monthCancle", function(){
	    	parent.layer.close(index);
	    });
	});
});