
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'textool', 'form'], function (exports) {
	winui.renderColor();
	var index = parent.layer.getFrameIndex(window.name);
	var $ = layui.$,
		form = layui.form,
		textool = layui.textool;

	AjaxPostUtil.request({url: reqBasePath + "sys016", params: {rowId: parent.rowId}, type: 'json', method: "GET", callback: function(json){
		if (json.returnCode == 0) {
			$("#roleName").val(json.bean.roleName);
			$("#roleDesc").val(json.bean.roleDesc);
			textool.init({
				eleId: 'roleDesc',
				maxlength: 250,
				tools: ['count', 'copy', 'reset']
			});
		} else {
			winui.window.msg(json.returnMessage, {icon: 2, time: 2000});
		}
	}});

	matchingLanguage();
	form.render();
	form.on('submit(formEditBean)', function (data) {
		if (winui.verifyForm(data.elem)) {
			var params = {
				roleName: $("#roleName").val(),
				roleDesc: $("#roleDesc").val(),
				rowId: parent.rowId
			};

			AjaxPostUtil.request({url: reqBasePath + "sys017", params: params, type: 'json', method: "PUT", callback: function(json){
				if (json.returnCode == 0) {
					parent.layer.close(index);
					parent.refreshCode = '0';
				} else {
					winui.window.msg(json.returnMessage, {icon: 2, time: 2000});
				}
			}});
		}
		return false;
	});

	// 取消
	$("body").on("click", "#cancle", function() {
		parent.layer.close(index);
	});

});