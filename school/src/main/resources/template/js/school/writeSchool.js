
var map, district, polygons = [];
var citySelect;
var districtSelect;
var marker = null;

var longitude = "";//经度
var latitude = "";//纬度

layui.config({
	base: basePath, 
	version: skyeyeVersion
}).extend({
    window: 'js/winui.window'
}).define(['window', 'jquery', 'winui', 'form'], function (exports) {
	winui.renderColor();
	var index = parent.layer.getFrameIndex(window.name);
	var $ = layui.$,
		form = layui.form;
	var id = GetUrlParam("id");

	if (!isNull(id)) {
		AjaxPostUtil.request({url: sysMainMation.schoolBasePath + "querySchoolById", params: {id: id}, type: 'json', method: 'GET', callback: function (json) {
			$("#name").val(json.bean.name);
			$("#remark").val(json.bean.remark);
			skyeyeClassEnumUtil.showEnumDataListByClassName("schoolPower", 'radio', "power", json.bean.power, form);

			longitude = json.bean.longitude;
			latitude = json.bean.latitude;
			initMap();
			$("#longitude").val(longitude);
			$("#latitude").val(latitude);
			$("#absoluteAddress").val(json.bean.absoluteAddress);
		}});
	} else {
		skyeyeClassEnumUtil.showEnumDataListByClassName("schoolPower", 'radio', "power", null, form);
	}
	matchingLanguage();
	form.render();

	form.on('submit(formAddBean)', function (data) {
		if (winui.verifyForm(data.elem)) {
			var pId = '0';
			if($("input[name='schoolType']:checked").val() == '2'){
				if(isNull($("#OverAllSchool").val())) {
					winui.window.msg('请选择父学校', {icon: 2, time: 2000});
					return false;
				} else {
					pId = $("#OverAllSchool").val();
				}
			}
			var lnglatXY = [$("#longitude").val(), $("#latitude").val()];//地图上所标点的坐标
			geocoder.getAddress(lnglatXY, function(status, result) {
				if (status === 'complete' && result.info === 'OK') {
					var params = {
						id: isNull(id) ? '' : id,
						name: $("#name").val(),
						remark: $("#remark").val(),
						provinceId: result.regeocode.addressComponent.province,
						cityId: result.regeocode.addressComponent.city,
						areaId: result.regeocode.addressComponent.district,
						townshipId: '',
						longitude: $("#longitude").val(),
						latitude: $("#latitude").val(),
						power: dataShowType.getData('power'),
						absoluteAddress: $("#absoluteAddress").val()
					};

					AjaxPostUtil.request({url: sysMainMation.schoolBasePath + "writeSchool", params: params, type: 'json', method: 'POST', callback: function (json) {
						parent.layer.close(index);
						parent.refreshCode = '0';
					}});
				} else {
					winui.window.msg('地图信息获取失败.', {icon: 2, time: 2000});
				}
			});
		}
		return false;
	});

	//加载地图
	initMap();
	function initMap(){
		if (!isNull(latitude) && !isNull(longitude)){
			map = new AMap.Map('container', {
				resizeEnable: true,
				zoom: 11,
				center: [longitude, latitude]
			});
		} else {
			map = new AMap.Map('container', {
				resizeEnable: true,
				zoom: 5,
				center: [113.65, 34.76]
			});
		}
		//加载插件
		AMap.service('AMap.Geocoder',function(){//回调函数
			//实例化Geocoder
			geocoder = new AMap.Geocoder({});
		});
		//在地图上进行标记
		marker = new AMap.Marker({
			map: map,
			bubble: true
		});
		//通过地址获取经纬度
		var input = document.getElementById('absoluteAddress');
		map.on('click', function (e) {
		  geocoder.getAddress(e.lnglat, function(status,result){
			  if (status == 'complete') {
				  input.value = result.regeocode.formattedAddress;
				  var address = input.value;
				  geocoder.getLocation(address, function (status, result) {
					  if (status == 'complete' && result.geocodes.length) {
						  marker.setPosition(result.geocodes[0].location);
						  map.setCenter(marker.getPosition());
						  $("#longitude").val(result.geocodes[0].location.lng);
						  $("#latitude").val(result.geocodes[0].location.lat);
					  }
				  })
			  }
		  });
		});
		input.onchange = function (e) {
			var address = input.value;
			geocoder.getLocation(address, function(status, result){
				if(status == 'complete' && result.geocodes.length){
					marker.setPosition(result.geocodes[0].location);
					map.setCenter(marker.getPosition());
					$("#longitude").val(result.geocodes[0].location.lng);
					$("#latitude").val(result.geocodes[0].location.lat);
				}
			})
		};

		citySelect = document.getElementById('city');
		districtSelect = document.getElementById('district');
		//行政区划查询
		var opts = {
			subdistrict: 1,   //返回下一级行政区
			showbiz: false  //最后一级返回街道信息
		};
		district = new AMap.DistrictSearch(opts);//注意：需要使用插件同步下发功能才能这样直接使用
		district.search('中国', function(status, result) {
			if (status == 'complete') {
				getData(result.districtList[0]);
			}
		});
		$("#qp").click(function (e) {
			$("#qpDiv").fullScreen();
		});
	}

	function getData(data, level) {
		var bounds = data.boundaries;
		if (level === 'district') {
			for (var i = 0, l = bounds.length; i < l; i++) {
				var polygon = new AMap.Polygon({
					map: map,
					fillColor: '#CCF3FF',
					fillOpacity: 0.5,
					path: bounds[i],
					strokeColor: "#FF33FF",//线颜色
					strokeOpacity: 1,//线透明度
					strokeWeight: 3,//线宽
					strokeStyle: "solid"//线样式
				});
				var input = document.getElementById('absoluteAddress');
				polygon.on('click', function(e) {
					geocoder.getAddress(e.lnglat, function(status, result){
						if(status=='complete'){
							input.value = result.regeocode.formattedAddress;
							var address = input.value;
							geocoder.getLocation(address, function(status, result){
								if(status == 'complete' && result.geocodes.length){
									marker.setPosition(result.geocodes[0].location);
									map.setCenter(marker.getPosition());
									$("#longitude").val(result.geocodes[0].location.lng);
									$("#latitude").val(result.geocodes[0].location.lat);
								}
							})
						}
				  });
				});
				polygons.push(polygon);
			}
			map.setFitView();//地图自适应
		}

		var subList = data.districtList;
		if (subList) {
			var contentSub = new Option('--请选择--');
			var curlevel = subList[0].level;
			var curList =  document.querySelector('#' + curlevel);
			if (!isNull(curList)) {
				curList.add(contentSub);
			}
			for (var i = 0, l = subList.length; i < l; i++) {
				var name = subList[i].name;
				var levelSub = subList[i].level;
				var cityCode = subList[i].citycode;
				contentSub = new Option(name);
				contentSub.setAttribute("value", levelSub + i);
				contentSub.center = subList[i].center;
				contentSub.adcode = subList[i].adcode;
				if (!isNull(curList)){
					curList.add(contentSub);
				}
				if(level != 'district'){
					district.search(subList[i].adcode, function(status, result) {
						if(status === 'complete'){
							var bounds = result.districtList[0].boundaries;
							if (bounds) {
								for (var i = 0, l = bounds.length; i < l; i++) {
									var polygon = new AMap.Polygon({
										map: map,
										fillColor: '#CCF3FF',
										fillOpacity: 0.5,
										path: bounds[i],
										strokeColor: "#FF33FF",//线颜色
										strokeOpacity: 1,//线透明度
										strokeWeight: 3,//线宽
										strokeStyle: "solid"//线样式
									});
									var input = document.getElementById('absoluteAddress');
									polygon.on('click', function(e) {
										geocoder.getAddress(e.lnglat, function(status, result){
											if(status == 'complete'){
												input.value = result.regeocode.formattedAddress;
												var address = input.value;
												geocoder.getLocation(address, function(status, result){
													if(status == 'complete' && result.geocodes.length){
														marker.setPosition(result.geocodes[0].location);
														map.setCenter(marker.getPosition());
														$("#longitude").val(result.geocodes[0].location.lng);
														$("#latitude").val(result.geocodes[0].location.lat);
													}
												})
											}
										});
									});
									polygons.push(polygon);
								}
								map.setFitView();//地图自适应
							}
						}
					});
				}
			}
		}
		form.render("select");
	}

	form.on('select(province)', function(data) {
		citySelect.innerHTML = '';
		districtSelect.innerHTML = '';
		form.render("select");
		search(document.getElementById('province'));
	});
	form.on('select(city)', function(data) {
		districtSelect.innerHTML = '';
		form.render("select");
		search(document.getElementById('city'));
	});
	form.on('select(district)', function(data) {
		search(document.getElementById('district'));
	});

	function search(obj) {
		//清除地图上所有覆盖物
		for (var i = 0, l = polygons.length; i < l; i++) {
			polygons[i].setMap(null);
		}
		var option = obj[obj.options.selectedIndex];
		var keyword = option.text; //关键字
		var adcode = option.adcode;
		district.setLevel(option.value); //行政区级别
		district.setExtensions('all');
		//行政区查询
		//按照adcode进行查询可以保证数据返回的唯一性
		district.search(adcode, function (status, result) {
			if (status === 'complete') {
				getData(result.districtList[0], obj.id);
			}
		});
	}

	function setCenter(obj){
		map.setCenter(obj[obj.options.selectedIndex].center)
	}

	// 取消
	$("body").on("click", "#cancle", function() {
		parent.layer.close(index);
	});

});