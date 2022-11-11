
layui.config({
    base: basePath,
    version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'tagEditor', 'textool'], function (exports) {
    winui.renderColor();
    layui.use(['form'], function (form) {
        var index = parent.layer.getFrameIndex(window.name);
        var $ = layui.$,
        	textool = layui.textool;
        
     	var chooseUser = new Array();
     	
     	textool.init({eleId: 'remark', maxlength: 200});
        
	    matchingLanguage();
        form.render();
        form.on('submit(formAddBean)', function (data) {
            if (winui.verifyForm(data.elem)) {
                var params = {
                    name: $("#houseName").val(),
                    address: $("#address").val(),
                    warehousing: $("#warehousing").val(),
                    truckage: $("#truckage").val(),
                    isDefault: $("input[name='isDefault']:checked").val(),
                    remark: $("#remark").val(),
                    principal: systemCommonUtil.tagEditorGetAllData('principal', chooseUser) // 仓库负责人
                };
                
                AjaxPostUtil.request({url: flowableBasePath + "writeDepotMation", params: params, type: 'json', method: "POST", callback: function (json) {
                    parent.layer.close(index);
                    parent.refreshCode = '0';
                }});
            }
            return false;
        });
        
        //仓库负责人
	    $('#principal').tagEditor({
	        initialTags: [],
	        placeholder: '请选择仓库负责人',
	        editorTag: false,
	        beforeTagDelete: function(field, editor, tags, val) {
                chooseUser = [].concat(arrayUtil.removeArrayPointName(chooseUser, val));
	        }
	    });
	    
	    // 仓库负责人选择
		$("body").on("click", "#principalUserIdSelPeople", function(e) {
			systemCommonUtil.userReturnList = [].concat(chooseUser);
			systemCommonUtil.chooseOrNotMy = "1"; // 人员列表中是否包含自己--1.包含；其他参数不包含
			systemCommonUtil.chooseOrNotEmail = "1"; // 人员列表中是否必须绑定邮箱--1.必须；其他参数没必要
			systemCommonUtil.checkType = "1"; // 人员选择类型，1.多选；其他。单选
			systemCommonUtil.openSysUserStaffChoosePage(function (userReturnList) {
				chooseUser = [].concat(userReturnList);
				// 重置数据
				systemCommonUtil.tagEditorResetData('principal', chooseUser);
			});
		});

        $("body").on("click", "#cancle", function() {
            parent.layer.close(index);
        });
    });
});