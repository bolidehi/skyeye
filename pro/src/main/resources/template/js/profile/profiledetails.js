
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui'], function (exports) {
	winui.renderColor();
	layui.use(['form'], function (form) {
		var index = parent.layer.getFrameIndex(window.name);
	    var $ = layui.$;
	    
	    var useTemplate = $("#useTemplate").html();
	    
	    AjaxPostUtil.request({url: flowableBasePath + "profile003", params:{rowId: parent.rowId}, type: 'json', callback: function(json){
    		if(json.returnCode == 0) {
    			//任务说明附件回显
    			var str = "暂无附件";
                if(json.bean.enclosureInfo.length != 0 && !isNull(json.bean.enclosureInfo)){
                	str = "";
                    $.each([].concat(json.bean.enclosureInfo), function(i, item){
                        str += '<a rowid="' + item.id + '" class="enclosureItem" rowpath="' + item.fileAddress + '" href="javascript:;" style="color:blue;">' + item.name + '</a><br>';
                    });
                }
    			var _html = getDataUseHandlebars(useTemplate, json);//加载数据
    			$("#showForm").html(_html);
    			$("#enclosureInfoBox").html(str);
    			matchingLanguage();
    		}else {
    			winui.window.msg(json.returnMessage, {icon: 2, time: 2000});
    		}
	    }});
	    
	    $("body").on("click", ".enclosureItem", function() {
	    	download(fileBasePath + $(this).attr("rowpath"), $(this).html());
	    });
	    
	});
});