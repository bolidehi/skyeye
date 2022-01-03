var layedit, form;

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui'].concat(dsFormUtil.mastHaveImport), function (exports) {
	winui.renderColor();
	var index = parent.layer.getFrameIndex(window.name);
    var $ = layui.$;
	layedit = layui.layedit,
	form = layui.form;
	
	var actKey = parent.actKey;
	
	// 加载动态表单页
	AjaxPostUtil.request({url:reqBasePath + "dsformpage012", params:{rowId: parent.dsFormId}, type:'json', callback:function(json){
 		if(json.returnCode == 0){
			dsFormUtil.loadDsFormItemToEdit("showForm", json.rows);
 			$("#showForm").append('<div class="layui-form-item layui-col-xs12"><div class="layui-input-block">' +
 					'<button class="winui-btn" id="cancle">' + systemLanguage["com.skyeye.cancel"][languageType] + '</button>' +
 					'<button class="winui-btn" lay-submit="" lay-filter="formAddBean">提交审批</button>' +
 					'</div></div>');
			matchingLanguage();
			form.render();
		}else{
 			winui.window.msg(json.returnMessage, {icon: 2,time: 2000});
 		}
 	}});
 	
	form.on('submit(formAddBean)', function (data) {
        if (winui.verifyForm(data.elem)) {
			activitiUtil.startProcess(parent.dsFormId, function (approvalId) {
				if(isNull(actKey)){
					winui.window.msg('流程对象为空，无法启动.', {icon: 2,time: 2000});
					return false;
				}
				var jStr = {
					keyName: actKey,
					jsonStr: JSON.stringify(dsFormUtil.getPageData($("#showForm"))),
					pageId: parent.dsFormId,
					approvalId: approvalId
				};
				AjaxPostUtil.request({url:reqBasePath + "activitimode022", params: jStr, type:'json', callback:function(json){
					if(json.returnCode == 0){
						winui.window.msg("申请提交成功，等待审核...", {icon: 1,time: 2000}, function(){
							parent.layer.close(index);
							parent.refreshCode = '0';
						});
					}else{
						winui.window.msg(json.returnMessage, {icon: 2,time: 2000});
					}
				}});
			});
        }
        return false;
    });
	
	// 取消
    $("body").on("click", "#cancle", function(){
    	parent.layer.close(index);
    });
});