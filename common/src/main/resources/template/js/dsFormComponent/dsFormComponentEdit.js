
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'textool'].concat(dsFormUtil.mastHaveImport), function (exports) {
	winui.renderColor();
	var index = parent.layer.getFrameIndex(window.name);
	var $ = layui.$,
		element = layui.element,
		colorpicker = layui.colorpicker,
		textool = layui.textool;
		form = layui.form;

	showGrid({
		id: "showForm",
		url: reqBasePath + "queryDsFormComponentMationById",
		params: {id: parent.rowId},
		pagination: false,
		method: 'GET',
		template: $("#beanTemplate").html(),
		ajaxSendLoadBefore: function(hdb, json) {
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
			json.bean.remark = stringManipulation.textAreaShow(json.bean.remark);
		},
		ajaxSendAfter: function(json) {
			// 加载图标信息
			systemCommonUtil.initEditIconChooseHtml('iconMation', form, colorpicker, 12, json.bean);

			// 组件分类
			sysDictDataUtil.showDictDataListByDictTypeCode(sysDictData["dsFormContentType"]["key"], 'select', "dsFormContentType", json.bean.typeId, form);
			skyeyeClassEnumUtil.showEnumDataListByClassName("dsFormShowType", 'select', "showType", json.bean.showType, form);
			// 组件关联属性
			var attrKeys = isNull(json.bean.attrKeys) ? '' : json.bean.attrKeys.toString();
			skyeyeClassEnumUtil.showEnumDataListByClassName("componentAttr", 'verificationSelect', "attrKeys", attrKeys, form);
			// 组件适用范围
			skyeyeClassEnumUtil.showEnumDataListByClassName("componentApplyRange", 'radio', "applyRange", json.bean.applyRange, form);
			// 组件获取的值的合入接口入参的方式
			skyeyeClassEnumUtil.showEnumDataListByClassName("componentValueMergType", 'radio', "valueMergType", json.bean.valueMergType, form);

			textool.init({eleId: 'remark', maxlength: 200});

			// 根据类型获取部分功能的使用说明
			systemCommonUtil.queryExplainMationByType(2, function (json) {
				$(".layui-colla-title").html(json.bean.title);
				$(".layui-colla-content").html(json.bean.content);
			});
			element.init();

			var htmlEditor = CodeMirror.fromTextArea(document.getElementById("htmlContent"), codeUtil.getConfig('xml'));
			var htmlDataFromEditor = CodeMirror.fromTextArea(document.getElementById("htmlDataFrom"), codeUtil.getConfig('xml'));
			var jsEditor = CodeMirror.fromTextArea(document.getElementById("jsContent"), codeUtil.getConfig('text/javascript'));
			var jsValue = CodeMirror.fromTextArea(document.getElementById("jsValue"), codeUtil.getConfig('text/javascript'));
			var jsDisplayValue = CodeMirror.fromTextArea(document.getElementById("jsDisplayValue"), codeUtil.getConfig('text/javascript'));
			var jsFitValue = CodeMirror.fromTextArea(document.getElementById("jsFitValue"), codeUtil.getConfig('text/javascript'));

			// 是否关联数据
			form.on('switch(linkedData)', function (data) {
				$(data.elem).val(data.elem.checked);
			});

			loadRange(json.bean.applyRange, json.bean.applyObject);
			form.on('radio(applyRangeFilter)', function (data) {
				loadRange(data.value, null);
			});

			// 加载展示类型为【自定义】的脚本信息
			loadDetailsPageDom(json.bean.showType, json.bean.detailHtmlContent, json.bean.detailJsContent);
			var detailHtmlContentEditor, detailJsContentEditor;
			form.on('select(showType)', function (data) {
				loadDetailsPageDom(data.value, '', '');
			});

			function loadDetailsPageDom(value, detailHtmlContent, detailJsContent) {
				if (value == -1) {
					$("#customerDom").html(`
						<div class="layui-form-item layui-col-xs12">
							<span class="hr-title">详情页面脚本信息</span><hr>
						</div>
						<div class="layui-form-item layui-col-xs12">
							<label class="layui-form-label">HTML脚本</label>
							<div class="layui-input-block">
								<textarea id="detailHtmlContent">${detailHtmlContent}</textarea>
							</div>
						</div>
						<div class="layui-form-item layui-col-xs12">
							<label class="layui-form-label">JS脚本</label>
							<div class="layui-input-block">
								<textarea id="detailJsContent">${detailJsContent}</textarea>
							</div>
						</div>
					`);
					detailHtmlContentEditor = CodeMirror.fromTextArea(document.getElementById("detailHtmlContent"), codeUtil.getConfig('xml'));
					detailJsContentEditor = CodeMirror.fromTextArea(document.getElementById("detailJsContent"), codeUtil.getConfig('text/javascript'));
				} else {
					$("#customerDom").html('');
				}
			}

			matchingLanguage();
			form.render();
			form.on('submit(formEditBean)', function (data) {
				if (winui.verifyForm(data.elem)) {
					if (isNull(htmlEditor.getValue())) {
						winui.window.msg('请输入模板内容', {icon: 2, time: 2000});
					} else {
						var params = {
							numCode: $("#numCode").val(),
							name: $("#name").val(),
							htmlContent: encodeURIComponent(htmlEditor.getValue()),
							htmlDataFrom: encodeURIComponent(htmlDataFromEditor.getValue()),
							jsContent: encodeURIComponent(jsEditor.getValue()),
							jsValue: encodeURIComponent(jsValue.getValue()),
							jsDisplayValue: encodeURIComponent(jsDisplayValue.getValue()),
							jsFitValue: encodeURIComponent(jsFitValue.getValue()),
							typeId: $("#dsFormContentType").val(),
							showType: $("#showType").val(),
							linkedData: '2',
							attrKeys: $('#attrKeys').attr('value'),
							applyRange: $("#applyRange input:radio:checked").val(),
							applyObject: isNull($("#applyObject").attr("chooseId")) ? JSON.stringify([]) : $("#applyObject").attr("chooseId"),
							valueMergType: dataShowType.getData('valueMergType'),
							remark: $("#remark").val(),
							id: parent.rowId
						};
						if ($("#linkedData").val() == 'true') {
							params.linkedData = '1';
						}

						// 获取图标信息
						params = systemCommonUtil.getIconChoose(params);
						if (!params["iconChooseResult"]) {
							return false;
						}

						if (params.showType == -1) {
							params["detailHtmlContent"] = encodeURIComponent(detailHtmlContentEditor.getValue());
							params["detailJsContent"] = encodeURIComponent(detailJsContentEditor.getValue())
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

	var loadApplyObject = false;
	function loadRange(type, defaultValue) {
		if (type == 1) {
			$("#applyObjectBox").hide();
		} else {
			$("#applyObjectBox").show();
			if (!loadApplyObject) {
				AjaxPostUtil.request({url: reqBasePath + "queryServiceClassForTree", params: {}, type: 'json', method: 'GET', callback: function(json) {
					loadApplyObject = true;
					json.treeRows = json.rows;
					dataShowType.showData(json, 'checkboxTree', 'applyObject', JSON.stringify(defaultValue), form);
				}});
			}
		}
	}

	// 取消
	$("body").on("click", "#cancle", function() {
		parent.layer.close(index);
	});
});