
layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'table', 'jquery', 'winui', 'upload'], function (exports) {
	winui.renderColor();
	var $ = layui.$,
		form = layui.form,
		upload = layui.upload;
	
	authBtn('1552959527026');
	
    showGrid({
	 	id: "showForm",
	 	url: reqBasePath + "sysevewinbgpic001",
	 	params: {},
	 	pagination: true,
	 	pagesize: 18,
	 	template: getFileContent('tpl/sysEveWinBgPic/bgpic-item.tpl'),
	 	ajaxSendLoadBefore: function(hdb) {
	 		hdb.registerHelper("compare1", function(v1, options){
				return fileBasePath + v1;
			});
	 	},
	 	options: {'click .del':function(index, row){
				layer.confirm('确认删除选中数据吗？', { icon: 3, title: '删除win系统桌面图片' }, function (index) {
					layer.close(index);
		            AjaxPostUtil.request({url: reqBasePath + "sysevewinbgpic003", params: {rowId: row.id}, type: 'json', callback: function (json) {
						winui.window.msg(systemLanguage["com.skyeye.deleteOperationSuccessMsg"][languageType], {icon: 1, time: 2000});
						loadTable();
		    		}});
				});
	 		}, 'click .sel':function(index, row){
				systemCommonUtil.showPicImg(fileBasePath + row.picUrl);
	 		}
	 	},
	 	ajaxSendAfter:function (json) {
	 		authBtn('1552959489421');
	 		matchingLanguage();
	 	}
    });
	
	//刷新数据
    $("body").on("click", "#reloadTable", function() {
    	loadTable();
    });
    
	var uploadInst = upload.render({
		elem: '#addBean', // 绑定元素
		url: reqBasePath + 'common003', // 上传接口
		data: {type: 2},
		done: function(json) {
			// 上传完毕回调
			if (json.returnCode == 0) {
				AjaxPostUtil.request({url: reqBasePath + "sysevewinbgpic002", params: {picUrl: json.bean.picUrl}, type: 'json', callback: function (json) {
					winui.window.msg("上传成功", {icon: 1, time: 2000});
					loadTable();
	    		}});
			} else {
				winui.window.msg(json.returnMessage, {icon: 2, time: 2000});
			}
		},
		error: function(e) {
			// 请求异常回调
			console.log(e);
		}
	});
    
    function loadTable() {
    	refreshGrid("showForm", {params:{}});
    }
    
    exports('sysEveWinBgPicList', {});
});
