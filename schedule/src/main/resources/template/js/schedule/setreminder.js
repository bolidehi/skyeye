layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui'], function (exports) {
	winui.renderColor();
	layui.use(['form'], function (form) {
		var index = parent.layer.getFrameIndex(window.name);
	    var $ = layui.$,
	    	form = layui.form;
	    
	    $("#noticeModel").html('尊敬的XXX,您好：<br/>您于XXXX年XX月XX日设定的日程《...》即将于XXXXXXXXXXX开始，请做好准备哦。');
		form.render();
		
		//日程重要性
		form.on('radio(menuLevel)', function (data) {
        });
		
        matchingLanguage();
	    form.on('submit(formAddBean)', function (data) {
	        if (winui.verifyForm(data.elem)) {
	        	var params = {
        			id: parent.rowId,
        			remindType: $("#remindType").val()
 	        	};
 	        	AjaxPostUtil.request({url: sysMainMation.scheduleBasePath + "syseveschedule013", params: params, type: 'json', method: 'POST', callback: function (json) {
					parent.layer.close(index);
					parent.refreshCode = '0';
	 	   		}});
	        }
	        return false;
	    });
	    
	    // 取消
	    $("body").on("click", "#cancle", function() {
	    	parent.layer.close(index);
	    });
	});
	    
});