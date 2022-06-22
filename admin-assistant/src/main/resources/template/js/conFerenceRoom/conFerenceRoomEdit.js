
var userList = new Array();//选择用户返回的集合或者进行回显的集合

// 会议室信息
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'fileUpload', 'tagEditor', 'textool'], function (exports) {
	winui.renderColor();
	layui.use(['form'], function (form) {
		var index = parent.layer.getFrameIndex(window.name);
	    var $ = layui.$,
	    	textool = layui.textool;

	    showGrid({
		 	id: "showForm",
		 	url: flowableBasePath + "conferenceroom008",
		 	params: {rowId: parent.rowId},
		 	pagination: false,
		 	template: getFileContent('tpl/conFerenceRoom/conFerenceRoomEditTemplate.tpl'),
		 	ajaxSendLoadBefore: function(hdb){
		 		hdb.registerHelper("compare1", function(v1, options){
					if(isNull(v1)){
						return path + "assets/img/uploadPic.png";
					}else{
						return basePath + v1;
					}
				});
		 	},
		 	ajaxSendAfter:function(json){
		 		// 初始化上传
		 		$("#roomImg").upload({
		            "action": reqBasePath + "common003",
		            "data-num": "1",
		            "data-type": "PNG,JPG,jpeg,gif",
		            "uploadType": 6,
		            "data-value": json.bean.roomImg,
		            // 该函数为点击放大镜的回调函数，如没有该函数，则不显示放大镜
		            "function": function (_this, data) {
		                show("#roomImg", data);
		            }
		        });
		        
		        textool.init({
			    	eleId: 'roomAddDesc',
			    	maxlength: 200,
			    	tools: ['count', 'copy', 'reset']
			    });
		        
		 		var userNames = [];
		 		userList = [].concat(json.bean.roomAdmin);
		 		$.each(json.bean.roomAdmin, function(i, item){
		 			userNames.push(item.name);
		 		});
		 		
		 		// 管理人员选择
				$('#roomAdmin').tagEditor({
			        initialTags: userNames,
			        placeholder: '请选择会议室管理人',
			        editorTag: false,
			        beforeTagDelete: function(field, editor, tags, val) {
			        	var inArray = -1;
				    	$.each(userList, function(i, item) {
				    		if(val === item.name) {
				    			inArray = i;
				    			return false;
				    		}
				    	});
				    	if(inArray != -1) {
				    		userList.splice(inArray, 1);
				    	}
			        }
			    });

				// 附件回显
				skyeyeEnclosure.initTypeISData({'enclosureUpload': json.bean.enclosureInfo});
		 		matchingLanguage();
		 		form.render();
		 	    form.on('submit(formEditBean)', function (data) {
		 	        if (winui.verifyForm(data.elem)) {
		 	        	var params = {
	 	        			rowId: parent.rowId,
	 	        			roomName: $("#roomName").val(),
	 	        			roomCapacity: $("#roomCapacity").val(),
	 	        			roomPosition: $("#roomPosition").val(),
	 	        			roomEquipment: $("#roomEquipment").val(),
	 	        			roomAddDesc: $("#roomAddDesc").val(),
							enclosureInfo: skyeyeEnclosure.getEnclosureIdsByBoxId('enclosureUpload')
	 	 	        	};
	 	 	        	params.roomImg = $("#roomImg").find("input[type='hidden'][name='upload']").attr("oldurl");
	 	 	        	if(isNull(params.roomImg)){
	 	 	        		winui.window.msg('请上传会议室图片', {icon: 2,time: 2000});
	 	 	        		return false;
	 	 	        	}
	 	 	        	if(userList.length == 0 || isNull($('#roomAdmin').tagEditor('getTags')[0].tags)){
	 	 	        		params.roomAdmin = "";
	 	 	        	}else{
	 	        			params.roomAdmin = userList[0].id;
	 	        		}
	 	 	        	AjaxPostUtil.request({url: flowableBasePath + "conferenceroom009", params: params, type: 'json', callback: function(json){
	 		 	   			if(json.returnCode == 0){
	 			 	   			parent.layer.close(index);
	 			 	        	parent.refreshCode = '0';
	 		 	   			}else{
	 		 	   				winui.window.msg(json.returnMessage, {icon: 2, time: 2000});
	 		 	   			}
	 		 	   		}});
		 	        }
		 	        return false;
		 	    });
		 	}
		});
	    
	    // 管理人员选择
	    $("body").on("click", "#userNameSelPeople", function(e){
			systemCommonUtil.userReturnList = [].concat(userList);
			systemCommonUtil.chooseOrNotMy = "1"; // 人员列表中是否包含自己--1.包含；其他参数不包含
			systemCommonUtil.chooseOrNotEmail = "2"; // 人员列表中是否必须绑定邮箱--1.必须；其他参数没必要
			systemCommonUtil.checkType = "2"; // 人员选择类型，1.多选；其他。单选
			systemCommonUtil.openSysUserStaffChoosePage(function (userReturnList) {
				// 重置数据
				userList = [].concat(systemCommonUtil.tagEditorResetData('roomAdmin', userReturnList));
			});
	    });
	    
	    $("body").on("click", ".enclosureItem", function(){
	    	download(fileBasePath + $(this).attr("rowpath"), $(this).html());
	    });
	    
	    $("body").on("click", "#cancle", function(){
	    	parent.layer.close(index);
	    });
	});
});