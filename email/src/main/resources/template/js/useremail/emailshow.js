
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'form'], function (exports) {
	winui.renderColor();
	var $ = layui.$,
		form = layui.form;
	
	// 邮件内容模板
	var emailContentMobel = $("#emailContentMobel").html();
	
	AjaxPostUtil.request({url: sysMainMation.emailBasePath + "useremail005", params: {id: parent.rowId}, type: 'json', method: 'GET', callback: function (json) {
		if (!isNull(json.bean.toPeople)){
			json.bean.toPeople = json.bean.toPeople.split(',');
		}
		if (!isNull(json.bean.toCc)){
			json.bean.toCc = json.bean.toCc.split(',');
		}
		if (!isNull(json.bean.toBcc)){
			json.bean.toBcc = json.bean.toBcc.split(',');
		}
		var str = getDataUseHandlebars(emailContentMobel, json);
		$("#emailRightContent").html(str);
		$("img").css({"width": "auto"});
		matchingLanguage();
	}});
	
	form.render();
	
	//信息隐藏和显示
	$("body").on("click", "#hideOrShowMessage", function (e) {
		if($(".send-mation-in").hasClass('message-height')){
			$("#hideOrShowMessage").html("显示信息");
			$(".send-mation-in").hide();
			$(".send-mation-in").removeClass("message-height");
		} else {
			$("#hideOrShowMessage").html("隐藏信息");
			$(".send-mation-in").show();
			$(".send-mation-in").addClass("message-height");
		}
	});
	
	// 下载
	$("body").on("click", ".enclosureItem", function (e) {
		var rowName = $(this).html();
		var rowPath = $(this).attr('rowpath');
		downloadImage(fileBasePath + rowPath, rowName);
	});
	
	// 转发邮件
    $("body").on("click", "#forwardEmail", function (e) {
        location.href = "../../tpl/useremail/sendemail.html?forwardId=" + $(this).attr("rowid");
    });
	
	form.render();
	
    exports('emailshow', {});
});
