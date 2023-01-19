var tplContentVal; //数据模板中用{{}}包裹的词
var jsonStr = [];

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui'].concat(dsFormUtil.mastHaveImport), function (exports) {
	winui.renderColor();
	var index = parent.layer.getFrameIndex(window.name);
	var $ = layui.$,
		element = layui.element,
		colorpicker = layui.colorpicker,
		form = layui.form;

	showGrid({
		id: "showForm",
		url: reqBasePath + "queryDsFormComponentMationById",
		params: {id: parent.rowId},
		pagination: false,
		method: 'GET',
		template: $("#beanTemplate").html(),
		ajaxSendLoadBefore: function(hdb) {
			hdb.registerHelper("compare2", function (v1, options) {
				if (v1 == '1') {
					return 'checked';
				} else if (v1 == '2') {
					return '';
				} else {
					return '';
				}
			});
			hdb.registerHelper("compare3", function (v1, options) {
				if (v1 == '1') {
					return 'true';
				} else if (v1 == '2') {
					return 'false';
				} else {
					return 'false';
				}
			});
		},
		ajaxSendAfter: function(json) {
			// 加载图标信息
			systemCommonUtil.initEditIconChooseHtml('iconMation', form, colorpicker, 12, json.bean);

			// 组件分类
			sysDictDataUtil.showDictDataListByDictTypeCode(sysDictData["dsFormContentType"]["key"], 'select', "dsFormContentType", json.bean.typeId, form);
			skyeyeClassEnumUtil.showEnumDataListByClassName("dsFormShowType", 'select', "showType", json.bean.showType, form);

			// 根据类型获取部分功能的使用说明
			systemCommonUtil.queryExplainMationByType(2, function (json) {
				$(".layui-colla-title").html(json.bean.title);
				$(".layui-colla-content").html(json.bean.content);
			});
			element.init();

			var htmlEditor = CodeMirror.fromTextArea(document.getElementById("htmlContent"), codeUtil.getConfig('xml'));
			var jsEditor = CodeMirror.fromTextArea(document.getElementById("jsContent"), codeUtil.getConfig('text/javascript'));
			var jsValue = CodeMirror.fromTextArea(document.getElementById("jsValue"), codeUtil.getConfig('text/javascript'));
			var jsDisplayValue = CodeMirror.fromTextArea(document.getElementById("jsDisplayValue"), codeUtil.getConfig('text/javascript'));
			var jsFitValue = CodeMirror.fromTextArea(document.getElementById("jsFitValue"), codeUtil.getConfig('text/javascript'));


			if (json.bean.linkedData == 1) {
				$(".dataTpl").removeClass("layui-hide");
				initDisplayTemplate(json.bean.displayTemplateId);//初始化关联的数据类型
				var str = '<textarea class="layui-textarea" readonly>' + json.bean.dsFormDisplayTemplate.content + '</textarea>';
				$("#templateContent").html(str);
				tplContentVal = strMatchAllByTwo(json.bean.dsFormDisplayTemplate.content, '{{', '}}');//取出数据模板中用{{}}包裹的词
				removeByValue(tplContentVal, "#each this");
				removeByValue(tplContentVal, "/each");
			}

			//是否关联数据
			form.on('switch(linkedData)', function (data) {
				//关联数据值
				$(data.elem).val(data.elem.checked);
				if ($("#linkedData").val() == 'true') {
					$(".dataTpl").removeClass("layui-hide");
					if (!initDatatpl) {
						initDisplayTemplate(json.bean.displayTemplateId);
					}
				} else {
					$(".dataTpl").addClass("layui-hide");
				}
			});

			//初始化关联的数据类型
			var initDatatpl = false;
			function initDisplayTemplate(id){
				initDatatpl = true;
				showGrid({
					id: "displayTemplateId",
					url: reqBasePath + "dsformdisplaytemplate006",
					params: {},
					pagination: false,
					method: 'GET',
					template: getFileContent('tpl/template/select-option.tpl'),
					ajaxSendLoadBefore: function(hdb) {},
					ajaxSendAfter:function (json) {
						$("#displayTemplateId").val(id);
						form.render('select');
						jsonStr = json.rows;
					}
				});
			}
			//数据展示模板监听事件
			form.on('select(displayTemplateId)', function(data) {
				var displayTemplateValue = $('#displayTemplateId').val();
				if (displayTemplateValue.length == 0){
					$("#templateContent").html("");
				} else {
					$.each(jsonStr, function(i, item) {
						if (displayTemplateValue == item.id) {
							var str = '<textarea class="layui-textarea" readonly>' + item.content + '</textarea>';
							$("#templateContent").html(str);
							tplContentVal = strMatchAllByTwo(item.content, '{{','}}');//取出数据模板中用{{}}包裹的词
							removeByValue(tplContentVal, "#each this");
							removeByValue(tplContentVal, "/each");
							return false;
						}
					});
				}
			});

			matchingLanguage();
			form.render();
			form.on('submit(formEditBean)', function (data) {
				if (winui.verifyForm(data.elem)) {
					if(isNull(htmlEditor.getValue())){
						winui.window.msg('请输入模板内容', {icon: 2, time: 2000});
					} else {
						var params = {
							numCode: $("#numCode").val(),
							name: $("#name").val(),
							htmlContent: encodeURIComponent(htmlEditor.getValue()),
							jsContent: encodeURIComponent(jsEditor.getValue()),
							jsValue: encodeURIComponent(jsValue.getValue()),
							jsDisplayValue: encodeURIComponent(jsDisplayValue.getValue()),
							jsFitValue: encodeURIComponent(jsFitValue.getValue()),
							typeId: $("#dsFormContentType").val(),
							showType: $("#showType").val(),
							linkedData: '2',
							displayTemplateId: '',
							defaultData: '',
							id: parent.rowId
						};
						if ($("#linkedData").val() == 'true') {
							params.linkedData = '1';
							params.displayTemplateId = $("#displayTemplateId").val();
							if (isNull(params.displayTemplateId)) {
								winui.window.msg('请选择数据展示模板', {icon: 2, time: 2000});
								return false;
							}
							var defaultDataStr = $("#defaultData").val();//默认数据值
							if (defaultDataStr.length != 0) {
								if (isJSON(defaultDataStr)) {
									var defaultKey = getOutKey(defaultDataStr);//从默认数据中取出json串的键
									if (subset(tplContentVal, defaultKey)) {
										params.defaultData = defaultDataStr;
									} else {
										winui.window.msg('默认数据内容有误，请重新填写!', {icon: 2, time: 2000});
										return false;
									}
								} else {
									winui.window.msg('默认数据格式不正确，请重新填写!', {icon: 2, time: 2000});
									return false;
								}
							} else {
								winui.window.msg('请填写默认数据', {icon: 2, time: 2000});
								return false;
							}
						}

						// 获取图标信息
						params = systemCommonUtil.getIconChoose(params);
						if (!params["iconChooseResult"]) {
							return false;
						}

						AjaxPostUtil.request({url: reqBasePath + "writeDsFormComponent", params: params, type: 'json', method: 'POST', callback: function (json) {
							parent.layer.close(index);
							parent.refreshCode = '0';
						}});
					}
				}
				return false;
			});

		}
	});

	// 取消
	$("body").on("click", "#cancle", function() {
		parent.layer.close(index);
	});
});