{{#bean}}
	<div class="layui-form-item layui-col-xs12">
		<span class="hr-title">基础信息</span><hr>
	</div>
    <div class="layui-form-item layui-col-xs6">
        <label class="layui-form-label">真实姓名</label>
        <div class="layui-input-block ver-center">
        	{{userName}}
        </div>
    </div>
    <div class="layui-form-item layui-col-xs6">
        <label class="layui-form-label">入职时间<i class="red">*</i></label>
        <div class="layui-input-block ver-center">
            {{entryTime}}
        </div>
    </div>
    <div class="layui-form-item layui-col-xs6">
        <label class="layui-form-label">身份证件<i class="red">*</i></label>
        <div class="layui-input-block">
        	<input type="text" id="userIdCard" name="userIdCard" placeholder="请输入身份证件" class="layui-input" maxlength="18" win-verify="required|identity" value="{{userIdCard}}"/>
        </div>
    </div>
    <div class="layui-form-item layui-col-xs6">
		<label class="layui-form-label">性别<i class="red">*</i></label>
		<div class="layui-input-block winui-radio">
			<input type="radio" name="userSex" value="0" title="保密"/>
			<input type="radio" name="userSex" value="1" title="男" />
			<input type="radio" name="userSex" value="2" title="女" />
        </div>
    </div>
    <div class="layui-form-item layui-col-xs6">
        <label class="layui-form-label">个人头像<i class="red">*</i></label>
        <div class="layui-input-block">
        	<div class="upload" id="userPhoto"></div>
        </div>
    </div>
    <div class="layui-form-item layui-col-xs6">
        <label class="layui-form-label">参加工作时间<i class="red">*</i></label>
        <div class="layui-input-block">
            <input type="text" id="workTime" name="workTime" win-verify="required" placeholder="XXXX-XX-XX" class="layui-input" value="{{workTime}}"/>
        </div>
    </div>
    <div class="layui-form-item layui-col-xs12">
		<span class="hr-title">联系方式</span><hr>
	</div>
    <div class="layui-form-item layui-col-xs6">
        <label class="layui-form-label">邮箱</label>
        <div class="layui-input-block">
        	<input type="text" id="email" name="email" placeholder="请输入邮箱地址" class="layui-input" maxlength="50" value="{{email}}"/>
        </div>
    </div>
    <div class="layui-form-item layui-col-xs6">
        <label class="layui-form-label">手机号</label>
        <div class="layui-input-block">
        	<input type="text" id="phone" name="phone" placeholder="请输入手机号" class="layui-input" maxlength="11" value="{{phone}}"/>
        </div>
    </div>
    <div class="layui-form-item layui-col-xs6">
        <label class="layui-form-label">家庭电话</label>
        <div class="layui-input-block">
        	<input type="text" id="homePhone" name="homePhone" placeholder="请输入家庭号码" class="layui-input" maxlength="20" value="{{homePhone}}"/>
        </div>
    </div>
    <div class="layui-form-item layui-col-xs6">
        <label class="layui-form-label">QQ</label>
        <div class="layui-input-block">
        	<input type="text" id="qq" name="qq" placeholder="请输入qq" class="layui-input" maxlength="15" value="{{qq}}"/>
        </div>
    </div>
    <div class="layui-form-item layui-col-xs12">
		<span class="hr-title">组织机构</span><hr>
	</div>
	<div class="layui-form-item layui-col-xs12">
		<label class="layui-form-label">职位信息<i class="red">*</i></label>
        <div class="layui-input-block">
            <div class="layui-form-item layui-col-xs3">
            	<ul id="demoTree1" class="dtree" data-id="0" style="overflow-y: auto;height: 250px;"></ul>
            </div>
            <div class="layui-form-item layui-col-xs3">
            	<ul id="demoTree2" class="dtree" data-id="0" style="overflow-y: auto;height: 250px;"></ul>
            </div>
            <div class="layui-form-item layui-col-xs3">
            	<ul id="demoTree3" class="dtree" data-id="0" style="overflow-y: auto;height: 250px;"></ul>
            </div>
            <div class="layui-form-item layui-col-xs3">
                <ul id="demoTree4" class="dtree" data-id="0" style="overflow-y: auto;height: 250px;"></ul>
            </div>
        </div>
	</div>
	<div class="layui-form-item layui-col-xs12">
		<label class="layui-form-label">考勤段<i class="red">*</i></label>
		<div class="layui-input-block" id="checkTimeBox">
			
		</div>
	</div>
    <div class="layui-form-item layui-col-xs12">
		<span class="hr-title">个性签名</span><hr>
	</div>
    <div class="layui-form-item layui-col-xs12">
        <label class="layui-form-label">签名</label>
        <div class="layui-input-block">
        	<textarea id="userSign" name="userSign"  placeholder="请输入签名" class="layui-textarea" style="height: 100px;" maxlength="200">{{userSign}}</textarea>
        </div>
    </div>
    <div class="layui-form-item layui-col-xs12">
        <div class="layui-input-block">
            <button class="winui-btn" id="cancle">关闭</button>
            <button class="winui-btn" lay-submit lay-filter="formEditBean"><language showName="com.skyeye.save"></language></button>
        </div>
    </div>
{{/bean}}