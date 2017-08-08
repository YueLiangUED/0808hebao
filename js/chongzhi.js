var topImgPath = "./images/";

window.onload = function(){
	
	//轮播图片
	var adImg = ["banner_001.png"];
	//和上面的图片列表一一对应
	var imgUrls = ['http://221.179.131.140/activity/100f520160422/rule.html'];
	//初始化Slider 实例
	var s = new Slider({
		dom : document.getElementById('canvas'),
		list : adImg,
		//urlList : imgUrls,
		hasPage:true,
		//滑动组件窗口的高
		containHeight:160
	});
}
Vue.component('money', {
  props: ['moneys','chosedMoney'],
  template: '#money-template',
  methods: {
    activeMoney: function (val) {
      //将选中的值传给父亲组件
      this.$emit('chosed', val);
    }
  }
});
new Vue({
	el:'#contain',
	data:{
		radioChk:'1',
		btnGray:false,//提交按钮置灰标识
		loginMsisdn : '',//当前登录号码，初始值从服务端获取
		inputPhone:'',//页面输入的充值号码
		phoneNotValid:false,//页面输入的手机号无效
		chosedMoney:0,//金额选项框选中的值
		paymentAmount:0,//实付金额
		actualArrival:0,//到账金额
		commonPay:0,
		otherAmount:'',//其它金额输入框中的值
		payPhone:'',//form表单中的手机号
		brandId:'',//form表单中的参数
		brandflag:'',//form表单中的参数
		nextMethod:'',//form表单中的参数 action的操作名称
		sort:'',//form表单中的参数 请求渠道
		key:'',//form表单中的参数 订单号
		pay_type:'',
		version:'',//微信支付用以是否展示微信支付按钮,
		random:'',//form表单中的参数 登录号的加密串
		scode:'',
		transactionid:'',
		useSos:'',//form表单中的参数:SOS方式
		moneyList:[{id:10,val:'10元'},{id:30,val:'30元'},{id:50,val:'50元'},
		{id:100,val:'100元'},{id:300,val:'300元'},{id:500,val:'500元'}]
	},
	//实例已经创建完成之后被调用
	created:function(){
		//请求后台初始化相关参数
		//暂时写死
		this.useSos = true;
		this.key = "333";
		this.version = "0";//0:不满足展开微信支付的条件 1:满足展开微信支付的条件
		this.sort = "3";
		this.loginMsisdn = "15810972811";
		this.inputPhone = this.loginMsisdn;
		this.random = "4BC33C8CFC01DAFC5F59C088D369060C47A17F9ED48B548C752E880B759443265C331C089B5549EE";
		this.brandflag = "2";
	},
	computed:{
		
	},
	watch:{
		radioChk:function(){
			if(this.radioChk == '1'){//为当前号码充值
				this.inputPhone = this.loginMsisdn
			}else{
				this.inputPhone = '';//为其它号码充值
			}
			if (this.chosedMoney) {
				this.comPaymentAmount(this.chosedMoney);
			}else{
				this.clearAmount();
			}
			
		}
	},
	methods:{
		choseMoney:function(val){
			this.chosedMoney = val;
			this.otherAmount = '';
			this.comPaymentAmount(val);
		},
		autheMsisdn:function(){
			if (!this.inputPhone || this.inputPhone.length != 11) {
				this.phoneNotValid = true;
				return false;
			}
			//请求服务端验证手机号的正确性
			//TODO /paymentAction.do?method=queryArea
			//此处先写死
			var json = "{'stat':'success'}";
			var data = eval("(" + json + ")");
			if (data.stat == 'fail') {
				this.phoneNotValid = true;
				return false;
			} else if (data.stat == 'success') {
				this.phoneNotValid = false;
				var commonPay = this.commonPay;// 获取上次写入commonPay的值
				if (commonPay == null || commonPay == "") {
					this.comPaymentAmount(100);//新增判断是否符合优惠条件
					this.chosedMoney = 100;
				} else {
					this.comPaymentAmount(commonPay);//新增判断是否符合优惠条件
				}
			} else if (data.stat == 'error') {// 校验手机号码异常
				window.location = '/internetFee_new/jsp/payment_h5pages/error.jsp';
			}
		},
		//其它金额获取到焦点的事件
		clearAmount:function(){
			this.chosedMoney = '';//取消选项框的选中样式
			this.paymentAmount = 0;//实付金额
			this.actualArrival = 0;//到账金额
		},
		//其它金额失去焦点的事件
		verificationOtherAmount:function(){
			if (!this.inputPhone) {// 输入框输入的需要充值的手机号码（或者当前登录号码）为空
				alert("请先输入需要充值的手机号码！");
				this.otherAmount = '';
			} else {
				this.chosedMoney = '';//取消选项框的选中样式
				var money = parseInt(this.otherAmount);
				if (money >= 10 && money <= 3000) {// 判断是否符合10~3000的条件
					this.comPaymentAmount(money);//判断是否满足优惠条件
				} else {
					this.otherAmount = '';// 置输入框为空串值
				}
			}
		},
		comPaymentAmount:function(num){//计算实付金额
			this.payPhone = this.inputPhone;
			this.commonPay = num;
			//优惠条件:登录号码与充值号码一致
			if (this.inputPhone == this.loginMsisdn) {
				
				//TODO 调用服务端查询实付金额信息
				//paymentAction.do?method=queryDiscount
				//模拟后台返回的数据
				var json = "{'stat':'success','account_amount':'100.0','pay_amount':'99.5','discount_amount':'0.5','discount_rate':'995'}";
				var data = eval("(" + json + ")");
			
				if (data.stat == 'success') {
					this.paymentAmount = data.pay_amount;//实付金额
					if (data.pay_amount == data.account_amount) {
						this.actualArrival = data.account_amount;
					}else{
						var rate = data.discount_rate;
						if(rate != '100'){
							this.actualArrival = '主账户 <span>'+data.pay_amount+'</span>元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
									'副2账户<span>'+data.discount_amount+'</span>';
						}else{
							this.actualArrival = data.account_amount;
						}
					}
				}
			}else{
				this.paymentAmount = num;//实付金额
				this.actualArrival = num;//到账金额
			}
		},
		//开始充值（跳转到充值缴费订单确认和支付方式选择界面）
		btnSubmit:function () {
			this.autheMsisdn();// 校验手机号码
			var money = this.commonPay; // 金额
			if (this.phoneNotValid == false && money != "" && money != null) {
				this.btnGray = true;
				this.nextMethod = 'btnGoPayReCharge';
				this.key = '';
				//document.forms[0].submit();
				console.info("提交表单======");
			} else {
				alert("请确认充值信息无误！");
			}
			//add by yj 插码
			/*if(Webtrends){
				Webtrends.multiTrack({args:{ "WT.event":"HFCZ_CZ"},delayTime: 100});
			}*/
		}
	}
});

//轮播图片封装函数  add by qhuang
function Slider(opts){
	var self = this;
	var hasPage = opts.hasPage;
	self.wrap = opts.dom;
	self.list = opts.list;
	self.IdList = opts.urlList;
	
	//滑动组件窗口的宽和高
	self.containW = window.innerWidth;
	self.containH = opts.containHeight;
	var timeInterval;
	var init = function(){
		//设定窗口比率
		self.radio = self.containW/self.containH;
		//设定一页的宽度
		self.pageW = self.containW;
		//设定初始的索引值
		self.idx = 0;
		self.liList = '';

	}
	//第二步 -- 根据数据渲染DOM
	var renderDOM = function(){
		var wrap = self.wrap,
		 	data = self.list,
			len = data.length;
		self.outer = document.createElement('ul');

		self.outer.style.cssText = "list-style: none;margin: 0;padding: 0;height: 100%;overflow: hidden;";
		//根据元素的
		for(var i = 0; i < len; i++){
			var li = document.createElement('li');
			li.webkitTransition = 'all .5s ease-out';
			var item = data[i];
			li.style.width = self.containW +'px';
			if(item){
				var imgP  = topImgPath + item;
				if (i == 0) {
					li.innerHTML = '<img style="height:'+self.containH+'px;width:'+self.containW+'px;" src="'+ imgP +'">';	
				}else{
					li.innerHTML = '<img style="height:'+self.containH+'px; width:0;" src="'+ imgP +'">';
				}
				
			}
			self.outer.appendChild(li);
		}

		//UL的宽度和画布宽度一致
		self.outer.style.cssText += 'width:' + self.pageW +'px';
		//判断是否要加分页小按钮
		if(hasPage && len > 1){//图片个数大于1
			var div = document.createElement('div');
			div.setAttribute("class","page-wrap");
			var span,divW = 16 * len;
			div.style.cssText = "width:"+divW+"px;margin-left:-"+ (divW/2)+"px";
			for(var i = 0; i < len; i++){
				span = document.createElement("span");
				span.setAttribute("class", "page-point");
				span.style.left = (i*16)+"px";
				div.appendChild(span);
			}
			span = document.createElement("span");
			span.setAttribute("class", "page-point cur-point");
			self.curPagePoint = span;
			div.appendChild(span);
			self.outer.appendChild(div);
		}
		
		wrap.style.height = self.containH + 'px';
		wrap.appendChild(self.outer);
	};

	var bindDOM = function(){
		var outer = self.outer;
		var len = self.list.length;
		self.liList = self.outer.getElementsByTagName('li');
		//绑定事件
		outer.addEventListener('touchstart', startHandler);
		outer.addEventListener('touchmove', moveHandler);
		outer.addEventListener('touchend', endHandler);
	};
	
		//手指按下的处理事件
	var startHandler = function(evt){
		clearInterval(timeInterval);
		//记录刚刚开始按下的时间
		self.startTime = new Date() * 1;
		
		//记录手指按下的坐标
		self.startX = evt.touches[0].pageX;

		//清除偏移量
		self.offsetX = 0;

		//事件对象
		var target = evt.target;
		while(target.nodeName != 'LI' && target.nodeName != 'BODY'){
			target = target.parentNode;
		}
		self.target = target;

	};

	//手指移动的处理事件
	var moveHandler = function(evt){
		//兼容chrome android，阻止浏览器默认行为
		evt.preventDefault();

		//计算手指的偏移量
		self.offsetX = evt.targetTouches[0].pageX - self.startX;

		var lis = self.liList;//self.outer.getElementsByTagName('li');
		//最小化改变DOM属性
		//起始索引
		var i = self.idx - 1;
		//结束索引
		var m = i + 3;
	};

	//手指抬起的处理事件
	var endHandler = function(evt){
		evt.preventDefault();

		//边界就翻页值
		var boundary = self.pageW/6;

		//手指抬起的时间值
		var endTime = new Date() * 1;

		//当手指移动时间超过300ms 的时候，按位移算
		if(endTime - self.startTime > 300){
			if(self.offsetX >= boundary){				
				goIndex('-1');
			}else if(self.offsetX < 0 && self.offsetX < -boundary){
				goIndex('+1');
			}else{
				goPage(self.idx);//跳到详情页面

			}
		}else{
			//快速移动也能使得翻页
			if(self.offsetX > 50){
				goIndex('-1');
			}else if(self.offsetX < -50){
				goIndex('+1');
			}else{
				goPage(self.idx);//跳到详情页面
			}
		}
		timeInterval = setInterval(autoShow,3000);
	};
	var goPage = function(idx){
		window.location.href = self.IdList[idx];
	}
	var goIndex = function(n){
		var idx = self.idx;
		var lis = self.liList;;
		var data = self.list;
		var len = data.length;
		var cidx;

		cidx = idx + n*1;

		//当索引右超出
		if(cidx > len-1){
			cidx = len - 1;
		//当索引左超出	
		}else if(cidx < 0){
			cidx = 0;
		}
		//保留当前图片列表的索引值
		self.idx = cidx;
		//最小化改变DOM属性
		for(i=0; i < lis.length; i++){
			if (i == cidx) {
				lis[i].style.cssText = 'opacity:1;width:'+self.containW+'px;height:'+self.containH+'px';
				lis[i].firstChild.style.cssText = 'opacity:1;width:'+self.containW+'px;height:'+self.containH+'px';
			}else {
				lis[i].style.cssText = 'width:0px;height:0px;opacity:0';
				lis[i].firstChild.style.cssText = 'width:0px;height:0px';
			}
			
			lis[i] && (lis[i].style.webkitTransition = 'width 1s ease-out,opacity 1s ease-out');
		}
		if(hasPage && len > 1){
			self.curPagePoint.style.webkitTransform = 'translate3d('+ cidx*16 +'px, 0, 0)';
		}
	};

	//自动播放
	var autoShow = function(){
		var len = self.list.length;
		if(self.idx == len-1){
			self.idx = 0;
			goIndex('0');
		}else{
			goIndex('+1');
		}
	};
	init();
	renderDOM();
	bindDOM();
	//如果需要自动轮播图片，则放开注释
	//timeInterval = setInterval(autoShow,3000);
}