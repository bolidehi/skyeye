
// 加工单绑定工序的验收id
var childId = "";

// 提交类型，1.工序验收；2.生成验收单
var subType = 1;

// 需要加工的数量
var needNum = 0;

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'jqprint'], function (exports) {
	winui.renderColor();
	layui.use(['form'], function (form) {
		var index = parent.layer.getFrameIndex(window.name);
	    var $ = layui.$,
		    form = layui.form;
	    
		showGrid({
			id: "showForm",
			url: flowableBasePath + "erpmachin006",
			params: {id: parent.rowId},
			pagination: false,
			method: 'GET',
			template: $("#useTemplate").html(),
			ajaxSendLoadBefore: function(hdb, json){
				needNum = json.bean.needNum;

				hdb.registerHelper('compare1', function(v1, v2, options) {
					return (parseFloat(v1) * parseFloat(v2)).toFixed(2);
				});

				var loadOperatorBtn = false;
				$.each(json.bean.procedure, function(i, item) {
					item.unitPrice = parseFloat(item.unitPrice).toFixed(2);
					if(item.state == 1){
						item.stateName = "<span class='state-down'>待验收</span>";
						if(!loadOperatorBtn){
							loadOperatorBtn = true;
							if(i == (json.bean.procedure.length - 1)){
								item.operator = '<button type="button" class="layui-btn layui-btn-xs layui-btn-normal acceptance" rowId="' + item.id + '" subType="2">生成验收单</button>';
							} else {
								item.operator = '<button type="button" class="layui-btn layui-btn-xs layui-btn-normal acceptance" rowId="' + item.id + '" subType="1">工序验收</button>';
							}
						} else {
							if(i == (json.bean.procedure.length - 1)){
								item.operator = '<button type="button" class="layui-btn layui-btn-xs layui-btn-normal layui-btn-disabled">生成验收单</button>';
							} else {
								item.operator = '<button type="button" class="layui-btn layui-btn-xs layui-btn-normal layui-btn-disabled">工序验收</button>';
							}
						}
					} else if (item.state == 2){
						item.stateName = "<span class='state-up'>已验收</span>"
					}
				});

				$.each(json.bean.material, function(i, item) {
					item.unitPrice = parseFloat(item.unitPrice).toFixed(2);
				});
			},
			ajaxSendAfter: function (json) {
				matchingLanguage();
				form.render();
			}
		});

		// 打印
		$("body").on("click", "#jprint", function (e) {
			$("#showForm").jqprint({
				title: sysMainMation.mationTitle,
				debug: false, //如果是true则可以显示iframe查看效果（iframe默认高和宽都很小，可以再源码中调大），默认是false
				importCSS: true, //true表示引进原来的页面的css，默认是true。（如果是true，先会找$("link[media=print]")，若没有会去找$("link")中的css文件）
				printContainer: true, //表示如果原来选择的对象必须被纳入打印（注意：设置为false可能会打破你的CSS规则）。
				operaSupport: true//表示如果插件也必须支持歌opera浏览器，在这种情况下，它提供了建立一个临时的打印选项卡。默认是true
			});
		});
		
		// 图片预览
		$("body").on("click", ".barCode", function (e) {
			systemCommonUtil.showPicImg($(this).attr("src"));
		});
		
		// 验收
		$("body").on("click", ".acceptance", function (e) {
			childId = $(this).attr("rowId");
			subType = $(this).attr("subType");
			_openNewWindows({
	            url: "../../tpl/erpMachin/erpMachinAcceptance.html",
	            title: "工序验收",
	            pageId: "erpMachinAcceptance",
	            area: ['60vw', '60vh'],
	            callBack: function (refreshCode) {
					winui.window.msg(systemLanguage["com.skyeye.successfulOperation"][languageType], {icon: 1, time: 2000});
					initData();
	            }});
		});
		
	});
});