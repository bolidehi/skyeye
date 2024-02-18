
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'cookie'], function (exports) {
	winui.renderColor();
	layui.use(['form'], function (form) {
		var index = parent.layer.getFrameIndex(window.name);
		var $ = layui.$;
		
		var rowId = GetUrlParam("id");
	    
		AjaxPostUtil.request({url: sysMainMation.diskCloudBasePath + "queryShareFileMationById", params: {id: rowId}, type: 'json', method: 'GET', callback: function (json) {
			if (isNull(json.bean)) {
				$("#showForm").hide();
				$("#showFormNone").show();
			} else {
				if (json.bean.shareType == 2) {//私密分享
					$("#showFormNone").hide();
					$("#showForm").show();
					$("#userName").html(json.bean.createMation.name);
					$("#userPhoto").attr("src", json.bean.createMation.userPhoto);
					$("#userPhoto").attr("alt", json.bean.createMation.name);
				} else if (json.bean.shareType == 1) {//公开分享--跳转列表页面
					location.href = "../../tpl/shareFile/shareFileList.html?id=" + rowId;
				}
			}

			matchingLanguage();
			form.render();
   		}});
		
		$("body").on("click", "#tqShareFile", function (e) {
			if(isNull($("#sharePassword").val())) {
				winui.window.msg("请输入提取码", {icon: 2, time: 2000});
				return;
			}
			AjaxPostUtil.request({url: sysMainMation.diskCloudBasePath + "fileconsole020", params: {id: rowId, sharePassword: $("#sharePassword").val()}, type: 'json', method: 'POST', callback: function (json) {
				if (isNull(json.bean)) {
					$("#showForm").hide();
					$("#showFormNone").show();
				} else {//跳转列表页面
					$.cookie("file" + rowId, $("#sharePassword").val(), {path: '/' });
					location.href = "../../tpl/shareFile/shareFileList.html?id=" + rowId;
				}
	   		}});
		});
		
	});
});

