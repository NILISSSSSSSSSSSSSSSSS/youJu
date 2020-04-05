<template>
	<view>
		<view v-if="hasPhone" class="my_sale_house_phone">
			<view class='my_sale_left'></view>
			<text>客户将会通过400电话转接拨号,\n隐藏电话号码，远离骚扰</text>
			<view class='my_sale_right'></view>
		</view>
		
		<view v-if="hasPhone" class="phone-400-box">
			<view class="phone-400-icon"></view>
		</view>
		
		<!--号码输入-->
		<view v-if="!hasPhone" class="my_sale_input_view">
			<view class="my_sale_input_tel_view f_r_b">
				<input class="input_tel_input" placeholder="请输入手机号" 
					maxlength="11" :value="phone" @input="phoneInput"></input>
				<view v-if="phone.length == 11" class="code-get-btn" @click="getCode">{{ time }}</view>
				<view v-else class="code-get-btn">{{ time }}</view>
			</view>

			<view class="input_captcha_view f_r_s">
				<input class="input_tel_input" placeholder="请输入验证码"
					maxlength="20"
					:value="inputCode" @input="codeInput"></input>
			</view>

			<view class="input_des">客户将会通过400电话转接拨号,隐藏电话号码，远离骚扰</view>
		</view>
	</view>
</template>

<script>
	import {GetCaptcha} from "@/net/GetCaptcha.js";
	class TimeOut {
		page = null;
		defaultText = "重新发送";
		time = 60;
		timeOutVal = null;
	
		constructor(page) {
		    this.page = page;
		}
	
		init() {
			this.interval();
		}
	
		interval() {
			let that = this;
			this.timeOutVal = setTimeout(() => {
				if(that.time <= 1) {
					that.setData({time: this.defaultText, getCodeDisabled: false});
					that.clear();
					return;
				}
	
				that.time--;
				that.setData({time: `${that.time}秒`});
				that.interval();
			}, 1000);
		}
	
		clear() {
			clearTimeout(this.timeOutVal);
			this.timeOutVal = null;
		}
	
		setData(obj) {
			for(let key in obj) {
				this.page[key] = obj[key];
			}
		}
	}
	
	export default {
		props: {
			telephone: {
				type: String | Number,
				default: ""
			},
			hasPhone: {
				type: Boolean,
				default: false
			}
		},
		
		data() {
			return {
				phone: "",
				time: "获取验证码",
				inputCode: "",
				timeOutVal: null,
				getCodeDisabled: false,
			}
		},
		
		mounted() {
			this.phone = this.telephone;
		},

		created() {
			this.phone = this.telephone;
		},
		
		watch: {
			telephone(newValue, oldValue) {
				this.phone = this.telephone;
			}
		},
		
		methods: {
			phoneInput(e) {
				this.phone = e.detail.value;
				this.$emit("onPhoneChanged", {telephone: this.phone, code: this.inputCode});
			},
			
			codeInput(e) {
				this.inputCode = e.detail.value;
				this.$emit("onPhoneChanged", {telephone: this.phone, code: this.inputCode});
			},
			
			getCode() {
				let reg = /^1[3-9][0-9]{9}$/;
				if(!this.phone) {
					uni.showToast({ title: '请输入手机号', icon: 'none' });
					return;
				}
				
				if (!reg.test(this.phone)) {
					uni.showToast({ title: '请输入11位有效手机号', icon: 'none' });
					return;
				}
				
				this.getCodeDisabled = true;
				new GetCaptcha({mobile: this.phone}).send()
					.then(res => {
						if(!res || !res.STATUS || res.STATUS != 1) {
							uni.showToast({
								title: res && res.INFO ? res.INFO : "获取验证码失败啦！",
								icon: "none"
							});
							this.getCodeDisabled = false;
							return;
						}
				
						this.$emit("onPhoneChanged", {telephone: this.phone, code: this.inputCode});
						this.getCodeLoading = false;
						new TimeOut(this).init();
					})
					.catch(err => {
						uni.showToast({
							title: err && err.INFO ? err.INFO : "获取验证码失败啦！",
							icon: "none"
						});
						this.getCodeDisabled = false;
					});
			}
		},
	}
</script>

<style scoped>
	.my_sale_house_phone{
		position:relative;
		width:100%;
		box-sizing:border-box;
		overflow:hidden;
		display:flex;
		align-items:center;
		justify-content:center;
		padding:30upx 60upx 20px;
		color:#999999;
		font-size:24upx;
	}
	.my_sale_left{
		width:67upx;
		height:12upx;
		margin-right:8upx;
		background:url(http://cdn.haofang.net/static/uuminiapp/entrustImg/ms_l_a.png)no-repeat center;
		background-size:100%;
	}
	.my_sale_right{
		width:67upx;
		height:12upx;
		margin-left:8upx;
		background:url(http://cdn.haofang.net/static/uuminiapp/entrustImg/ms_r_a.png)no-repeat center;
		background-size:100%;
	}
	.phone-400-box{
		padding-top:0upx;
	}
	.phone-400-icon{
		margin:0 auto;
		width:238upx;
		height:207upx;
		background:url(https://zdzfapi.haofang.net/Public/wxApp/images/registration/phone_400_icon.png) center no-repeat;
		background-size:100% 100%;
	}
	.my_sale_input_view{}
	.my_sale_input_tel_view{
		height:74upx;
		line-height:74upx;
		border-bottom:1upx solid #ececec;
		box-sizing:border-box;
	}
	.input_tel_input{
		width:100%;
		height:71upx;
		line-height:71upx;
        padding: 0;
		color:#101d36;
		font-size:28upx;
	}
	.code-get-btn{
		flex-shrink:0;
		text-align:right;
		line-height:73upx;
		font-size:28upx;
		color:#7a8190;
	}
	.input_captcha_view{
		margin-top:38upx;
		height:74upx;
		line-height:74upx;
		border-bottom:1upx solid #ececec;
		box-sizing:border-box;
	}
	.input_des{
		margin-top:28upx;
		text-align:left;
		line-height:38upx;
		color:#b4b5b8;
		font-size:26upx;
	}
</style>
