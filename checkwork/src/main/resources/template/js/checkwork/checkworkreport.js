
var rowId = "";
var startTime = "", endTime = "";
var isTable = true;
var reportparams = "";
var echartsparams = "";

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window',
    echarts: '../echarts/echarts',
    echartsTheme: '../echarts/echartsTheme'
}).define(['window', 'table', 'jquery', 'winui', 'form', 'echarts'], function (exports) {
	winui.renderColor();
	var $ = layui.$,
		form = layui.form,
		table = layui.table;
	var selTemplate = getFileContent('tpl/template/select-option.tpl');
	
	authBtn('1563415739069');
	
	$("#echartsPie").hide();
	form.on('radio(type)', function (data) {        
       if (data.value == "image"){
    	   isTable = false;
    	   $("#tableList").hide();
    	   $("#echartsPie").show();
    	   getPieData();
       } else if (data.value == "table"){
    	   isTable = true;
    	   $("#echartsPie").hide();
    	   $("#tableList").show();
    	   loadTable();
       }
    });
	
	table.render({
		id: 'messageTable',
		elem: '#messageTable',
		method: 'post',
		url: sysMainMation.checkworkBasePath + 'checkwork015',
		where: getTableParams(),
		even: true,
		page: true,
		limits: getLimits(),
		limit: getLimit(),
		cols: [[
			{ title: systemLanguage["com.skyeye.serialNumber"][languageType], type: 'numbers' },
			{ field: 'userId', title: 'ID', width: 50,style:'display:none;'},
			{ field: 'companyName', title: '公司', align: 'left', width: 200 },
			{ field: 'departmentName', title: '部门', align: 'left', width: 120 },
			{ field: 'jobName', title: '职位', align: 'left', width: 120 },
			{ field: 'userName', title: '姓名', align: 'left', width: 80 },
			{ field: 'shouldTime', title: '应出勤（次）', align: 'center', width: 100 },
			{ field: 'fullTime', title: '全勤（次）', align: 'center', width: 100, templet: function (d) {
				if(d.fullTime != '0'){
					return "<a class='checkwork-a'><span class='state-up' lay-event='fullTime'>" + d.fullTime + "</span></a>";
				} else {
					return d.fullTime;
				}
			}},
			{ field: 'absenteeism', title: '缺勤（次）', align: 'center', width: 100, templet: function (d) {
				if(d.absenteeism != '0'){
					return "<a class='checkwork-a'><span class='state-down' lay-event='absenteeism'>" + d.absenteeism + "</span></a>";
				} else {
					return d.absenteeism;
				}
			}},
			{ field: 'lackTime', title: '工时不足（次）', align: 'center', width: 100, templet: function (d) {
				if(d.lackTime != '0'){
					return "<a class='checkwork-a'><span class='state-down' lay-event='lackTime'>" + d.lackTime + "</span></a>";
				} else {
					return d.lackTime;
				}
			}},
			{ field: 'late', title: '迟到（次）', align: 'center', width: 100, templet: function (d) {
				if(d.late != '0'){
					return "<a class='checkwork-a'><span class='state-down' lay-event='late'>" + d.late + "</span></a>";
				} else {
					return d.late;
				}
			}},
			{ field: 'leaveEarly', title: '早退（次）', align: 'center', width: 100, templet: function (d) {
				if(d.leaveEarly != '0'){
					return "<a class='checkwork-a'><span class='state-down' lay-event='leaveEarly'>" + d.leaveEarly + "</span></a>";
				} else {
					return d.leaveEarly;
				}
			}},
			{ field: 'missing', title: '漏签（次）', align: 'center', width: 100, templet: function (d) {
				if(d.missing != '0'){
					return "<a class='checkwork-a'><span class='state-down' lay-event='missing'>" + d.missing + "</span></a>";
				} else {
					return d.missing;
				}
			}}
			]
		],
		done: function(json) {
			matchingLanguage();
			$('table.layui-table thead tr th:eq(1)').addClass('layui-hide');
		}
	});
	table.on('tool(messageTable)', function (obj) {
		var data = obj.data;
		var layEvent = obj.event;
		if (layEvent === 'fullTime') {
			detail(data, '1');
		} else if (layEvent === 'absenteeism'){
			detail(data, '2');
		} else if (layEvent === 'lackTime'){
			detail(data, '3');
		} else if (layEvent === 'late'){
			detail(data, '4');
		} else if (layEvent === 'leaveEarly'){
			detail(data, '5');
		} else if (layEvent === 'missing'){
			detail(data, '6');
		}
	});

	function detail(data, detailType){
		var userName = data.userName;
		var title = "";
		if(detailType === "1"){
			title = userName + " " + startTime + "至" + endTime + "的全勤详情";
		} else if (detailType === "2"){
			title = userName + " " + startTime + "至" + endTime + "的缺勤详情";
		} else if (detailType === "3"){
			title = userName + " " + startTime + "至" + endTime + "的工时不足详情";
		} else if (detailType === "4"){
			title = userName + " " + startTime + "至" + endTime + "的迟到详情";
		} else if (detailType === "5"){
			title = userName + " " + startTime + "至" + endTime + "的早退详情";
		} else if (detailType === "6"){
			title = userName + " " + startTime + "至" + endTime + "的漏签详情";
		}
		reportparams = {
			userId : data.userId,
			state: detailType,
			startTime: startTime,
			endTime: endTime
    	};
		_openNewWindows({
			url: "../../tpl/checkwork/reportdetail.html", 
			title: title,
			pageId: "detail",
			area: ['80vw', '70vh'],
			callBack: function (refreshCode) {
			}
		});
	}
	
	// 初始化公司
	function initCompany(){
		var companyId = "";
		// 获取当前登录员工信息
		systemCommonUtil.getSysCurrentLoginUserMation(function (data) {
			companyId = data.bean.companyId;
		});
		// 加载企业数据
		systemCommonUtil.getSysCompanyList(function(data) {
			$("#companyList").html(getDataUseHandlebars(selTemplate, data));
			$("#companyList").val(companyId);
			form.render('select');
		});
		initDepartment();
		initTable();
	}
	
	//初始化部门
	function initDepartment(){
		showGrid({
		 	id: "departmentList",
		 	url: reqBasePath + "companydepartment007",
		 	params: {companyId: $("#companyList").val()},
		 	pagination: false,
			method: 'POST',
		 	template: selTemplate,
		 	ajaxSendLoadBefore: function(hdb) {},
		 	ajaxSendAfter:function (json) {
		 		form.render('select');
		 	}
	    });
	}
	
	function initJob(){
		// 根据部门id获取岗位集合
		systemCommonUtil.queryJobListByDepartmentId($("#departmentList").val(), function(data) {
			$("#jobList").html(getDataUseHandlebars(selTemplate, data));
			form.render('select');
		});
	}
	
	form.render();
	
	// 公司监听事件
	form.on('select(companyList)', function(data) {
		initDepartment();
		initJob();
	});
	
	// 部门监听事件
	form.on('select(departmentList)', function(data) {
		initJob();
	});
	
	
	$("body").on("click", "#formSearch", function() {
		if(isTable){
			loadTable();
		} else {
			getPieData();
		}
	});
	
	$("body").on("click", "#reloadTable", function() {
		if(isTable){
			loadTable();
		} else {
			getPieData();
		}
    });
	
    function loadTable() {
    	if(isNull($("#checkTime").val())) {//一定要记得，当createTime为空时
    		winui.window.msg("请选择时间段", {icon: 2, time: 2000});
    	}else {
    		startTime = $("#checkTime").val().split('~')[0].trim();
    		endTime = $("#checkTime").val().split('~')[1].trim();
    		$("#title").text(startTime + "至" + endTime + " 考勤情况统计");
    		table.reloadData("messageTable", {where: getTableParams()});
    	}
    }
    
    function getPieData(){
    	var myChart;
    	var cellSize = [80, 80];
    	var pieRadius = 30;
    	startTime = $("#checkTime").val().split('~')[0].trim();
		endTime = $("#checkTime").val().split('~')[1].trim();
		$("#title").text(startTime + "至" + endTime + " 考勤情况统计");
		
    	function getVirtulData() {
    	    var date = +echarts.number.parseDate(startTime);
    	    var end = +echarts.number.parseDate(endTime);
    	    var dayTime = 3600 * 24 * 1000;
    	    var data = [];
    	    for (var time = date; time <= end; time += dayTime) {
    	        data.push([
    	            echarts.format.formatTime('yyyy-MM-dd', time),
    	            Math.floor(Math.random() * 10000)
    	        ]);
    	    }
    	    return data;
    	}

    	function getPieSeries(scatterData, chart, ydata) {
    	    return echarts.util.map(scatterData, function (item, index) {
    	        var center = chart.convertToPixel('calendar', item);
    	        return {
    	            id: index + 'pie',
    	            type: 'pie',
    	            center: center,
    	            label: {
    	                normal: {
    	                    formatter: '{c}',
    	                    position: 'inside'
    	                }
    	            },
    	            radius: pieRadius,
    	            data: [
    	                {name: '缺勤', value: ydata[index].absenteeism, day: ydata[index].checkDay},
    	                {name: '工时不足', value: ydata[index].lackTime, day: ydata[index].checkDay},
    	                {name: '迟到', value: ydata[index].late, day: ydata[index].checkDay},
    	                {name: '早退', value: ydata[index].leaveEarly, day: ydata[index].checkDay},
    	                {name: '漏签', value: ydata[index].missing, day: ydata[index].checkDay}
    	            ]
    	        };
    	    });
    	}

    	var scatterData = getVirtulData();

    	var option = {
    	    tooltip : {},
    	    legend: {
    	        data: ['缺勤', '工时不足', '迟到', '早退', '漏签'],
    	        bottom: 20
    	    },
    	    calendar: {
    	        top: 'middle',
    	        left: 'center',
    	        orient: 'vertical',
    	        cellSize: cellSize,
    	        yearLabel: {
    	            show: false,
    	            textStyle: {
    	                fontSize: 30
    	            }
    	        },
    	        dayLabel: {
    	            margin: 20,
    	            firstDay: 1,
    	            nameMap: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    	        },
    	        monthLabel: {
    	            show: false
    	        },
    	        range: [startTime, endTime]
    	    },
    	    series: [{
    	        id: 'label',
    	        type: 'scatter',
    	        coordinateSystem: 'calendar',
    	        symbolSize: 1,
    	        label: {
    	            normal: {
    	                show: true,
    	                formatter: function (params) {
    	                    return echarts.format.formatTime('dd', params.value[0]);
    	                },
    	                offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
    	                textStyle: {
    	                    color: '#000',
    	                    fontSize: 14
    	                }
    	            }
    	        },
    	        data: scatterData
    	    }]
    	};
    	
    	myChart = echarts.init($("#echartsPie")[0], layui.echartsTheme);
    	myChart.clear();//清空画布
    	myChart.setOption(option);
    	initEcharts();
    	
    	function initEcharts(){
	    	AjaxPostUtil.request({url: flowableBasePath + "checkwork016", params: getEchartsParams(), type: 'json', method: "POST", callback: function (json) {
				ydata = json.rows;
				var pieInitialized;
				setTimeout(function () {
					pieInitialized = true;
					myChart.setOption({
						series: getPieSeries(scatterData, myChart, ydata)
					});
				}, 10);
	    	}});
    	}
    	
    	function getEchartsParams(){
    		var date =+ echarts.number.parseDate(startTime);
    	    var end =+ echarts.number.parseDate(endTime);
    	    var dayTime = 3600 * 24 * 1000;
    	    var arr = [];
    	    for (var time = date; time <= end; time += dayTime) {
    	    	arr.push([
    	            echarts.format.formatTime('yyyy-MM-dd', time)
    	        ]);
    	    }
    		return {
				arr: arr,
				userName: $("#userName").val(), 
				companyName: $("#companyList").val(), 
				departmentName: isNull($("#departmentList").val()) ? "" : $("#jobList").val(), 
				jobName: isNull($("#jobList").val()) ? "" : $("#jobList").val()
	    	};
    	}

    	myChart.on('click', function (params) {
    		var name = params.data.name;
    		var echartstype = "";
    		if(name == "全勤"){
    			echartstype = 1;
    		} else if (name == "缺勤"){
    			echartstype = 2;
    		} else if (name == "工时不足"){
    			echartstype = 3;
    		} else if (name == "迟到"){
    			echartstype = 4;
    		} else if (name == "早退"){
    			echartstype = 5;
    		} else if (name == "漏签"){
    			echartstype = 6;
    		} else {
    			return false;
    		}
    		echartsparams = {
				userName: $("#userName").val(), 
				companyName: $("#companyList").val(), 
				departmentName: isNull($("#departmentList").val()) ? "" : $("#jobList").val(), 
				jobName: isNull($("#jobList").val()) ? "" : $("#jobList").val(),
				day : params.data.day,
				state: echartstype
	    	};
    		var title = params.data.day + " " + name + "的详情";
    		_openNewWindows({
    			url: "../../tpl/checkwork/echartsdetail.html", 
    			title: title,
    			pageId: "detail",
    			area: ['80vw', '70vh'],
    			callBack: function (refreshCode) {
                    
    			}
    		});
    	});
    }
    
    function getTableParams() {
    	return {
    		userName: $("#userName").val(),
    		companyName: $("#companyList").val(), 
			departmentName: isNull($("#departmentList").val()) ? "" : $("#jobList").val(), 
			jobName: isNull($("#jobList").val()) ? "" : $("#jobList").val(),
    		startTime: startTime,
    		endTime: endTime,
    		timeId: $("#timeId").val()
		};
    }

    exports('checkworkreport', {});
});
