var layedit;

var userReturnList = new Array();//选择用户返回的集合或者进行回显的集合
var chooseOrNotMy = "1";//人员列表中是否包含自己--1.包含；其他参数不包含
var chooseOrNotEmail = "1";//人员列表中是否必须绑定邮箱--1.必须；其他参数没必要
var checkType = "1";//人员选择类型，1.多选；其他。单选

var userList = new Array();//选择用户返回的集合或者进行回显的集合

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'tableSelect', 'laydate', 'tagEditor'], function (exports) {
	winui.renderColor();
	layui.use(['form', 'layedit'], function (form) {
		var index = parent.layer.getFrameIndex(window.name);
	    var $ = layui.$,
	    tableSelect = layui.tableSelect,
    	laydate = layui.laydate;
	    layedit = layui.layedit;
	    //初始化一级公告类型
		function initNoticeType(id){
			showGrid({
			 	id: "noticeTypeId",
			 	url: reqBasePath + "noticetype011",
			 	params: {},
			 	pagination: false,
			 	template: getFileContent('tpl/template/select-option.tpl'),
			 	ajaxSendLoadBefore: function(hdb){},
			 	ajaxSendAfter:function(json){
			 		$("#noticeTypeId").val(id);
			 		form.render('select');
			 	}
		    });
		}
		//初始化二级公告类型
		function initSecondNoticeType(id){
			showGrid({
			 	id: "secondTypeId",
			 	url: reqBasePath + "noticetype013",
			 	params: {parentId: $("#noticeTypeId").val()},
			 	pagination: false,
			 	template: getFileContent('tpl/template/select-option.tpl'),
			 	ajaxSendLoadBefore: function(hdb){},
			 	ajaxSendAfter:function(json){
			 		$("#secondTypeId").val(id);
			 		form.render('select');
			 	}
		    });
		}
		
	    showGrid({
		 	id: "showForm",
		 	url: reqBasePath + "notice006",
		 	params: {rowId:parent.rowId},
		 	pagination: false,
		 	template: getFileContent('tpl/sysnotice/sysnoticeeditTemplate.tpl'),
		 	ajaxSendAfter:function(json){
		 		initNoticeType(json.bean.typeId);
		 		initSecondNoticeType(json.bean.secondTypeId);
		 		
		 		//一级公告类型监听事件
				form.on('select(noticeTypeId)', function(data){
					initSecondNoticeType("");
				});

				var userNames = "";
				if(json.bean.sendType === '2' || json.bean.sendType == 2){
					userList = json.bean.userInfo;
					$.each(userList, function (i, item) {
						userNames += item.name + ',';
	                });
				}
				
				//人员选择
				$('#userName').tagEditor({
			        initialTags: userNames.split(','),
			        placeholder: '填写完成后直接回车即可',
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

		 		//定时通知时间选择器
		 		laydate.render({
		 		  elem: '#delayedTime'
		 		  ,type: 'datetime'
		 		});
		 		
		 		//设置群发类型
		 		$("input:radio[name=sendType][value=" + json.bean.sendType + "]").attr("checked", true);
		 		//设置是否定时通知
		 		if(json.bean.timeSend == '2'){
		 			$("input:radio[name=timeSend][value=" + 2 + "]").attr("checked", true);
		 		}else{
		 			$("input:radio[name=timeSend][value=" + 1 + "]").attr("checked", true);
		 		}
		 		//设置是否邮件通知
		 		$("input:radio[name=whetherEmail][value=" + json.bean.whetherEmail + "]").attr("checked", true);
		 		//群发所有人
		 		if(json.bean.sendType == '1'){
		 			$("#sendTo").hide();
		 		}
		 		//群发类型变化事件
		 		form.on('radio(sendType)', function (data) {
		 			var val = data.value;
			    	if(val == '1'){//群发所有人
			    		$("#sendTo").hide();
			    	}else if(val == '2'){//选择性群发
			    		$("#sendTo").show();
			    	}else{
			    		winui.window.msg('状态值错误', {icon: 2,time: 2000});
			    	}
		        });
		 		//不设置定时上线
		 		if(json.bean.timeSend == '1'){
		 			$("#sendTime").hide();
		 		}
		 		//定时通知变化事件
		 		form.on('radio(timeSend)', function (data) {
		 			var val = data.value;
			    	if(val == '1'){//不设置定时通知
			    		$("#sendTime").hide();
			    	}else if(val == '2'){//设置定时通知
			    		$("#sendTime").show();
			    	}else{
			    		winui.window.msg('状态值错误', {icon: 2,time: 2000});
			    	}
		        });
		 		//富文本框编辑器
		 		var getContent = layedit.build('content', {
			    	tool: [
		    	       'strong' //加粗
		    	       ,'italic' //斜体
		    	       ,'underline' //下划线
		    	       ,'del' //删除线
		    	       ,'|' //分割线
		    	       ,'left' //左对齐
		    	       ,'center' //居中对齐
		    	       ,'right' //右对齐
		    	       ,'link' //超链接
		    	       ,'unlink' //清除链接
		    	       ,'face' //表情
		    	       ,'code'
		    	     ]
			    });
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
		 	    form.on('submit(formEditBean)', function (data) {
		 	        if (winui.verifyForm(data.elem)) {
		 	        	var params = {
		 	        		rowId: parent.rowId,
		 	        		title: $("#title").val(),
							typeId: $("#noticeTypeId").val(),
							secondTypeId: $("#secondTypeId").val(),
		 	        		sendType: $("input[name='sendType']:checked").val(),
		 	        		timeSend: $("input[name='timeSend']:checked").val(),
		 	        		whetherEmail: $("input[name='whetherEmail']:checked").val(),
		 	        		content: encodeURIComponent(layedit.getContent(getContent))
		 	        	};
		 	        	if($("input[name='sendType']:checked").val() === '2'){	//选择性群发
		 	        		if(userList.length == 0 || isNull($('#userName').tagEditor('getTags')[0].tags)){
		 	 	        		winui.window.msg('请选择收件人', {icon: 2,time: 2000});
		 	 	        		return false;
		 	 	        	}else{
		 	        			params.userInfo = JSON.stringify(userList);
		 	        		}
		 	        	}else{
		 	        		params.userInfo = "";
		 	        	}
		 	        	if($("input[name='timeSend']:checked").val() === '2'){	//设置定时通知
		 	        		if(isNull($("#delayedTime").val())){
		 	        			winui.window.msg('请选择定时通知时间', {icon: 2,time: 2000});
		 	 	        		return false;
		 	        		}else{
		 	        			params.delayedTime = $("#delayedTime").val();
		 	        		}
		 	        	}else{
		 	        		params.delayedTime = "";
		 	        	}
		    			if(isNull(layedit.getContent(getContent))){
		    				winui.window.msg('请填写公告内容', {icon: 2,time: 2000});
		    				return false;
		    			}
		    			AjaxPostUtil.request({url:reqBasePath + "notice007", params:params, type:'json', callback:function(json){
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
	    
	    $("body").on("click", "#cancle", function(){
	    	parent.layer.close(index);
	    });
	});
});