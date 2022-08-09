
var userList = new Array();//选择用户返回的集合或者进行回显的集合

// 用品信息
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'fileUpload', 'tagEditor'], function (exports) {
	winui.renderColor();
	layui.use(['form'], function (form) {
		var index = parent.layer.getFrameIndex(window.name);
	    var $ = layui.$;

		// 用品类别
		sysDictDataUtil.showDictDataListByDictTypeCode(sysDictData["admAssetArticlesType"]["key"], 'select', "typeId", '', form);

		skyeyeEnclosure.init('enclosureUpload');
 		matchingLanguage();
 		form.render();
 	    form.on('submit(formAddBean)', function (data) {
 	        if (winui.verifyForm(data.elem)) {
 	        	var params = {
        			articlesName: $("#articlesName").val(),
        			typeId: $("#typeId").val(),
        			specifications: $("#specifications").val(),
        			unitOfMeasurement: $("#unitOfMeasurement").val(),
        			initialNum: $("#initialNum").val(),
        			storageArea: $("#storageArea").val(),
        			roomAddDesc: $("#roomAddDesc").val(),
					enclosureInfo: skyeyeEnclosure.getEnclosureIdsByBoxId('enclosureUpload'),
					assetAdmin: systemCommonUtil.tagEditorGetItemData('assetAdmin', userList)
 	        	};
 	        	AjaxPostUtil.request({url: flowableBasePath + "writeAssetArticlesMation", params: params, type: 'json', method: "POST", callback: function (json) {
					parent.layer.close(index);
					parent.refreshCode = '0';
	 	   		}});
 	        }
 	        return false;
 	    });
 	    
 	    // 用品管理人
	    $('#assetAdmin').tagEditor({
	        initialTags: [],
	        placeholder: '请选择用品管理人',
	        editorTag: false,
	        beforeTagDelete: function(field, editor, tags, val) {
				userList = [].concat(arrayUtil.removeArrayPointName(userList, val));
	        }
	    });
	    // 用品管理人选择
		$("body").on("click", "#userNameSelPeople", function (e) {
			systemCommonUtil.userReturnList = [].concat(userList);
			systemCommonUtil.chooseOrNotMy = "1"; // 人员列表中是否包含自己--1.包含；其他参数不包含
			systemCommonUtil.chooseOrNotEmail = "2"; // 人员列表中是否必须绑定邮箱--1.必须；其他参数没必要
			systemCommonUtil.checkType = "2"; // 人员选择类型，1.多选；其他。单选
			systemCommonUtil.openSysUserStaffChoosePage(function (userReturnList) {
				// 重置数据
				userList = [].concat(systemCommonUtil.tagEditorResetData('assetAdmin', userReturnList));
			});
		});
 	    
	    $("body").on("click", "#cancle", function() {
	    	parent.layer.close(index);
	    });
	});
});