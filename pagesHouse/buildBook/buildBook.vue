<template>
	<view class="build_book_view">
		<view class="new_build_view">
			<!-- 头部信息 -->
			<view class="build_title_view">
				<view class="title-box">
					<view class="build-name">{{ buildBookItem.buildName }}</view>
					<view class="houseType-text">
						<view class="span-icon"></view>
						<view class="strong-icon">{{ buildBookItem.houseArea }}</view>
						<view v-if='buildBookItem.useageType' 
							class="em-icon">【{{ buildBookItem.useageType }}】</view>
					</view>
				</view>
			</view>
			
			<!-- 小区图片 -->
			<view class="houseimg-box">
				<view class="house-content" id="house-content">
					<image v-if="buildBookItem.buildPhoto && buildBookItem.buildPhoto[0]"
						:src="buildBookItem.buildPhoto[0]" 
						mode="aspectFill" lazy-load="false"></image>
				</view>
			</view>
			
			<!-- 价格 -->
			<view class="house-info-box">
				<view class="house-info-title">
					<view class="i-icon"></view>
					<view class="h3-text">
						<view class="no_price" 
							v-if="!buildBookItem.price">价格待定</view>
							
						<block wx:else>
							<view class="span-text">单价</view>
							<text>{{ buildBookItem.price }}元/㎡</text>
						</block>
					</view>
					
					<view v-if="buildBookItem.buildTag" 
						class="p-text">{{ buildBookItem.buildTag }}</view>
				</view>
			</view>
		
			<!-- 楼盘信息 -->
			<view class="house-content-box">
				<view class="house-info-box">
					<!-- 楼盘位置图片 -->
					<view class="h1-text"></view>
					<view class="houseimg">
						<view class="houseimg-list" id="houseimg-list">
							<image v-if="buildBookItem.buildPhoto && buildBookItem.buildPhoto[1]" 
								:src="buildBookItem.buildPhoto[1]" mode="aspectFill"></image>
						</view>
						<view class="i-text"></view>
					</view>
				
					<!-- 楼盘介绍 -->
					<view class="house-about">
						<view class="h2-text">楼盘介绍</view>
						<view class="p-text" 
							v-if="buildBookItem.buildDes">{{ buildBookItem.buildDes }}</view>
						<view class="i-text"></view>
					</view>
				
					<!-- 户型图 -->
					<view v-if="buildBookItem.huXingPhoto && buildBookItem.huXingPhoto.length > 0" 
						class="houseType-box">
						<view class="h2-text"></view>
						<view class="houseimg-list-box">
							<view v-if="buildBookItem.huXingPhoto[0]" 
								class="li" id="houseTypeimg-one">
								<image :src="buildBookItem.huXingPhoto[0]"
									mode="widthFix"></image>
							</view>
							
							<view v-if="buildBookItem.huXingPhoto[1]" 
								class="li" id="houseTypeimg-two">
								<image :src="buildBookItem.huXingPhoto[1]" 
									mode="widthFix"></image>
							</view>
						</view>
					</view>
				
					<!-- 小区位置 地图-->
					<view v-if="buildBookItem.positionMapUrl" class="area-info">
						<view class="h2-text"></view>
						<view class="map-box">
							<view id="map">
								<image lazy-load="true" mode="widthFix"
									:src="buildBookItem.positionMapUrl"
									class='map-img'></image>
							</view>
						</view>
					</view>
					
					<!-- 楼盘地址 -->
					<view class="check-out" v-if="buildBookItem.buildAddr || buildBookItem.deliverTime">
						<view class="i-text"></view>
						<view v-if="buildBookItem.deliverTime" class="p-text">预计交房时间: {{ buildBookItem.deliverTime }}</view>
						<view v-if="buildBookItem.buildAddr" class="address-info">楼盘地址：{{ buildBookItem.buildAddr }}</view>
					</view>
				
					<!-- 经纪人信息 -->
					<view class="broker-information">
						<view class="user-photo">
							<image class="i-text" :src="buildBookItem.agentHead" 
								mode="aspectFill"></image>
						</view>
						<view class="p-text">{{ buildBookItem.agentName }} {{ buildBookItem.agentPhone }}</view>
						<view class="h4-text" v-if="buildBookItem.agentService">{{ buildBookItem.agentService }}</view>
						<view class="h5-text">我是该楼盘专属顾问，欢迎随时来电咨询</view>
						<view class="i-text"></view>
					</view>
					
					<!-- 长按识别  暂时隐藏（源代码如此）-->
					<view class="ewm" v-if="buildBookItem.codeUrl">
						<image :src="buildBookItem.codeUrl" 
							mode="aspectFit|aspectFill|widthFix"></image>
						<view class="p-text">长按识别查看楼盘详情</view>
					</view>
				</view>	
			</view>
        </view>
		
		<!-- 咨询 -->
		<view class="f_r_b build_book_bottom">
			<!-- 经纪人信息 -->
			<view class="f_r_s bottom_agent_info">
				<view class="bottom_agent_head f_r_c">
					<image :src="buildBookItem.agentHead" mode="aspectFill"></image>
				</view>
				
				<view class="f_c_c">
					<view class="bottom_agent_name">{{ buildBookItem.agentName }}</view>
					<view class="bottom_agent_star_view f_r_s">
						<block v-for="(starUrl, index) in buildBookItem.agentStarList" 
							:key="index">
							<image :src="starUrl" mode="aspectFill"></image>
						</block>
					</view>
				</view>
			</view>
            
			<view class="f_r_e book_bottom_btn_view">
				<view @click="imChart" class="bottom_chart_btn">咨询置业顾问</view>
				<view @click="yuYueCarLookHouse" class="bottom_car_btn">预约专车看房</view>
			</view>
		</view>
		
		<view @click="closeLookHouse" class="car_look_house_view f_c_c"
			@touchmove.stop.prevent="moveHandle"
			v-if="carLookHouseTc">
			<view class="car_look_house_info" @click.stop="">
				<view @click="closeLookHouse" class="car_look_close f_c_c">
					<image mode="aspectFill" src='http://cdn.haofang.net/static/uuweb/activity/jinyin/list/phoneClose.png'></image>
				</view>
				<view class="car_look_title">预约专车看房</view>
				<view class="car_look_subtitle">您正在约看{{ buildBookItem.buildName }}楼盘，请填写联系信息</text></view>
				<view class="car_input_view">
					<input placeholder="请输入姓名" 
						class="car_input"
					    @input="inputName"
					    :value="carLookHouseInfo.name"
						placeholder-class="car_input_plac"
						placeholder-style='color:#aaa' />
				</view>
				<view class="car_input_view">
					<input placeholder="请输入手机号" 
						class="car_input"
						type="number"
						maxlength="11"
						:value="carLookHouseInfo.telephone"
						@input="inputPhone"
						placeholder-class="car_input_plac"
						placeholder-style='color:#aaa' />
				</view>
				<view class="f_r_s">
					<view class="car_input_view">
						<input placeholder="请输入验证码" 
							class="car_input"
							v-model="carLookHouseInfo.captcha"
							placeholder-class="car_input_plac"
							placeholder-style='color:#aaa' />
					</view>
					
					<view class="get_code global-font-color">
						<text @click="getCaptcha" v-if="testCodeTime < 1">获取验证码</text>
						<text v-if="testCodeTime > 0" style="color: #ccc;">已发送({{ testCodeTime }})</text>
					</view>
				</view>
				<view @click="submitCarLookHouse" class="car_look_submit global-confirm-btn">提交</view>
			</view>
		</view>
		
		<!-- 回到首页 -->
		<goBackHomePage></goBackHomePage>
		
		<!-- 授权 -->
		<get-user-info></get-user-info>
	</view>
</template>

<script>
	import { GetBuildBookDetail
		, SubmitYuYueLookHouseInfo } from "@/net/houseApi/GetBuildBookDetail.js";
	import goBackHomePage from "@/components/goBackHomePage.vue";
	import { GetStarList, OnlineChart, OnlineChartItem, ShareVisiting,SaveCclientUserType } from "@/utils/common.js";
	import { Notify } from "@/utils/Notify.js";
	import { Notification } from "@/utils/Notification.js";
	import { GpsInfoModel } from "@/model/GpsInfoModel.js";
	import {UserInfoModel} from "@/model/UserInfoModel.js";
	import {GetSendMsgBuildBook} from "@/net/GetCaptcha.js";
	import { AddWebsiteVisitorRecordsRequest, AddWebsiteVisitorRecords } from '@/net/coupon.js';
	
	class BuildBookDetailItem {
		buildName = "";  // 新房名称
		houseArea = "";  // 面积
		useageType = "";
		buildPhoto = null; // 房源图片数组
		price = "";  // 价格
		buildTag = "";  // 标签
		buildDes = "";  // 楼盘介绍
		huXingPhoto = [];  // 户型图数组
		lat = "";  // 小区纬度
		lng = "";  // 小区经度
		positionMapUrl = "";  // 小区位置的百度地图静态图片路径
		buildAddr = "";  // 楼盘地址
		deliverTime = "";  // 预计交房时间
		codeUrl = ""; // 房源详情的小程序二维码 

		agentHead = "";  // 经纪人头像
		agentName = "";  // 经纪人姓名
		agentPhone = "";  // 经纪人电话
		agentService = ""; // 经纪人服务区域
		agentStarList = [];  // 经纪人星数组
	}
	
	export default {
		components: {
			goBackHomePage
		},
		
		data() {
			return {
				recordsDate: 0, // 访客记录时长

				sourceTypeId: 2201, // 数据采集 - lh
				shareOption: {},
				params: {},
				cityId: "",  // 房源城市id
				caseId: "",  // 房源id
				caseType: "",  // 房源类型
				source: "",  // 页面的来源  例如: zshft
				archiveId: "",  // 经纪人id
				reSource: "",  // 房源的来源
				buildBookItem: new BuildBookDetailItem(),  // 新房楼书信息
				carLookHouseTc: false,  // 专车看房弹窗
				testCodeTime: 0, // 验证码发送剩余事件
				isSendCoding: false, // 是在发送验证码中
				// 预约专车看房字段
				carLookHouseInfo: {
					telephone: "",
					name: "",
					captcha: "",  // 验证码
				},
                codeTime: null,
			}
		},
		
		onLoad(params) {
			// 记录时长
			this.recordsDate = new Date().getTime();
			this.params = params;

			// 采集数据 - lh
			uni.setStorageSync('imSourceTypeId', 3301);
			this.sourceTypeId = 2301;

			let caseType = params.caseType || params.casetype || ''
			// 数据采集
			this.shareOption = {
				archiveId: params.archive_id || params.archiveid || params.archiveId || '',
				cityId: params.cityid || params.cityId || '',
				caseId: params.caseid || params.caseId || '',
				caseType: +caseType === 1 ? 1 : (+caseType === 6 ? 6 : 2)
			}
			let me = new UserInfoModel().getModel("me") || {};
			console.log(me)
			new ShareVisiting().behavior({
					archiveId: this.shareOption.archiveId || '', // 经济人档案id
					cUserId: me.userId || '', // c端用户id，分享时无
					caseId: this.shareOption.caseId || '', // 房源id
					caseType: this.shareOption.caseType, // 房源类型：1.出售，2.出租，6.新盘
					cityId: this.shareOption.cityId || '',
					sourceType: this.sourceTypeId, // 统计子分类
					statisType: 2, // 统计类型：1->B端推广分享，2->C端浏览，3->C端咨询，4-->B端回复咨询，5-->约看
					appSource: 'zdzf-buildBook-1'
			}).then(res => {
					console.log(res)
			});
      //平台用户来源采集(标记) 20191112 IM优化需求
			new SaveCclientUserType().behavior({
					archiveId: this.shareOption.archiveId || '', // 经济人档案id
					sourceType: 2, //sourceType 1 = 平台， 2 = 私有
			}).then(res => {console.log(res)})

			this.initParams(params);
			this.initData();
			// 监听用户信息事件
			new Notification().addObserver(this, "UserInfoChanged", Notify.UserInfoChanged.Name);
		},
        
        onShow() {
            new this.SetMetaInfo().initDefault();
        },
		
		onUnload() {
			this.websiteVisitorRecords()
			// 反注册通知
			new Notification().removeObserverAllNotification(this);
			this.PlatformUserBehavior.leaveNewHouse();
		},
		onHide () {
			this.websiteVisitorRecords()
		},
		
		onShareAppMessage() {
			let that = this;
			let paramsStr = "";
			for(let key in params) {
				paramsStr += "&" + key + "=" + params[key];
			}
			paramsStr = paramsStr.replace("&", "");
			return {
				title: that.buildBookItem.buildName,
				path: "/pagesHouse/buildBook/buildBook?" + paramsStr,
				success: function(res) {
					that.UserBehavior.newHouseShareAppMessage();
				}
			}
		},
		
		methods: {
			websiteVisitorRecords () {
				// 访客记录
				if (+this.recordsDate > 0) {
					if (!this.buildId || !this.cityId) return;
					let date = new Date().getTime();
					let me = new UserInfoModel().getModel("me") || {};
					let addWebsiteVisitorRecordsObj = new AddWebsiteVisitorRecordsRequest();
					addWebsiteVisitorRecordsObj.buildId = this.buildId;
					addWebsiteVisitorRecordsObj.cityId = this.cityId;
					addWebsiteVisitorRecordsObj.wxId = me.userId;
					addWebsiteVisitorRecordsObj.duration = Math.ceil((date - this.recordsDate) / 1000);
					console.log(addWebsiteVisitorRecordsObj);
					new AddWebsiteVisitorRecords(addWebsiteVisitorRecordsObj).send().then(res => {
						console.log(res)
						this.recordsDate = 0;
					})
				}
			},
			moveHandle() {},

			// 用户消息回调
			UserInfoChanged() {
				// 采集数据
				let me = new UserInfoModel().getModel("me") || {};
				new ShareVisiting().behavior({
						archiveId: this.shareOption.archiveId || '', // 经济人档案id
						cUserId: me.userId || '', // c端用户id，分享时无
						caseId: this.shareOption.caseId || '', // 房源id
						caseType: this.shareOption.caseType, // 房源类型：1.出售，2.出租，6.新盘
						cityId: this.shareOption.cityId || '',
						sourceType: this.sourceTypeId, // 统计子分类
						statisType: 2, // 统计类型：1->B端推广分享，2->C端浏览，3->C端咨询，4-->B端回复咨询，5-->约看
						appSource: 'zdzf-buildBook-2'
				}).then(res => {
						console.log(res)
				});
        //平台用户来源采集(标记) 20191112 IM优化需求
        new SaveCclientUserType().behavior({
            archiveId: this.shareOption.archiveId || '', // 经济人档案id
            sourceType: 2, //sourceType 1 = 平台， 2 = 私有
        }).then(res => {console.log(res)})
				this.initData();
			},
			
			initParams(params = {}) {
				let keyMap = {
					"cityid": "cityId",
					"cityId": "cityId",
					"caseId": "caseId",
					"caseid": "caseId",
					"casetype": "caseType",
					"caseType": "caseType",
					"source": "source",
					"archive_id": "archiveId",
					"reSource": "reSource",
					"resource": "reSource"
				}
				for(let key in params) {
					if(params[key] != undefined && keyMap[key]) {
						this[keyMap[key]] = params[key];
					}
				}
			},
			
			initData() {
				if(!this.caseId) {
					return Promise.reject("暂无caseId");
				}
				
				return new GetBuildBookDetail({
					archiveId: this.archiveId,
					caseType: this.caseType,
					cityId: this.cityId,
					caseId: this.caseId,
					reSource: this.reSource
				}).send()
					.then(res => {
						let data = res.data || {};
						let buildBookItem = new BuildBookDetailItem();
						buildBookItem.buildName = data.buildName || "";
						buildBookItem.houseArea = data.houseArea || "";
						buildBookItem.useageType = data.useage_type || "";
						buildBookItem.buildPhoto = data.building_photo || null;
						buildBookItem.price = data.price && parseInt(data.price) 
							? parseInt(data.price) || "" : "";
						buildBookItem.buildTag = data.build_tag || "";	
						buildBookItem.buildDes = data.build_descript || "";
						buildBookItem.huXingPhoto = data.huxing_photo || [];
						buildBookItem.lng = data.position_x || "";
						buildBookItem.lat = data.position_y || "";
						buildBookItem.positionMapUrl = buildBookItem.lng 
							&& buildBookItem.lat 
								? "https://apis.map.qq.com/ws/staticmap/v2/?center="
									+ buildBookItem.lat + "," + buildBookItem.lng
									+ "&zoom=16&scale=2&markers=size:large|icon:https://cd.haofang.net/Public/images/wap/icon_mylocation.png|" 
									+ buildBookItem.lat + "," + buildBookItem.lng
									+ "&key=DGFBZ-3IFW2-PDEUL-CBLCE-XOSYK-K5B5I&size=375*320"
								: "";
						buildBookItem.buildAddr = data.building_addr || "";
						buildBookItem.deliverTime = data.deliver_time || "";
						
						buildBookItem.agentHead = data.brokerPhoto || "http://cdn.haofang.net/static/uuweb/buildingBook/housingLongFigure/default_head.png";
						buildBookItem.agentName = data.brokerName || "";
						buildBookItem.agentPhone = data.brokerMobile || "";
						buildBookItem.agentService = data.service_zone || "";
						buildBookItem.codeUrl = data.codeUrl || "";
						// 接口没返回评分并且源代码就是5颗星
						buildBookItem.agentStarList = new GetStarList(5).getList();
						this.buildBookItem = buildBookItem;
						uni.setNavigationBarTitle({
							title: buildBookItem.buildName
						});
						let item = new this.HouseDetailParamsItem();
						item.shareArchiveId = this.archiveId || "671907";
						item.caseType = this.caseType;
						item.caseId = this.caseId || "";
						item.cityId = this.cityId || "";
						this.PlatformUserBehavior.enterNewHouse(item,
							{houseName: buildBookItem.buildName, houseInfo: ""});
					})
					.catch(err => {
						uni.showModal({
							title: "温馨提示",
							content: "获取楼书详情失败啦！请稍后重试。",
							showCancel: false,
							// confirmColor: "#ab7f2e",
							confirmColor: "#ab7f2e",
							confirmText: "我知道了"
						});
					});
			},
			
			// 咨询置业顾问
			imChart() {
				this.PlatformUserBehavior.buildBookChart();
				let item = new OnlineChartItem();
				item.archiveId = this.archiveId;
				item.archiveName = this.buildBookItem.agentName;
				new OnlineChart(item).goToPage();
			},
		
			// 预约专车看房
			yuYueCarLookHouse() {
				this.PlatformUserBehavior.buildBookYuYue();
				this.carLookHouseTc = true;
			},
			
			// 关闭预约专车看房
			closeLookHouse() {
				this.carLookHouseTc = false;
			},

			// 输入名字
			inputName(e) {
				this.carLookHouseInfo.name = e.detail.value;
			},

			// 输入手机号
			inputPhone(e) {
				this.carLookHouseInfo.telephone = e.detail.value;
			},
			
			// 获取验证码
			getCaptcha() {
				this.carLookHouseInfo.telephone = this.carLookHouseInfo.telephone.replace(/(^\s*)|(\s*$)/g, "");
				let reg = /^((1[3-9][0-9])+\d{8})$/;
				if(!this.carLookHouseInfo.telephone) {
					uni.showToast({
						icon: "none",
						title: "请输入手机号"
					});
					return;
				}
				
				if(this.carLookHouseInfo.telephone.length < 11) {
					uni.showToast({
						icon: "none",
						title: "请输入11位手机号"
					});
					return;
				}
				
				if(!(reg.test(this.carLookHouseInfo.telephone))) {
					uni.showToast({
						icon: "none",
						title: "手机号格式不正确"
					});
					return;
				}
				
				if(this.isSendCoding) return;
				
				this.isSendCoding = true;
				new GetSendMsgBuildBook({mobile: this.carLookHouseInfo.telephone}).send()
					.then(res => {
						if(!res.STATUS || res.STATUS != 1) {
							this.isSendCoding = false;
							uni.showToast({
								icon: "none",
								title: res.info || "获取验证码失败"
							});
							return;
						}
						
						let testCodeTime = 60;
						this.codeTime = setInterval(() => {
							testCodeTime -= 1;
							if (testCodeTime < 1) {
								this.testCodeTime = 0;
								this.isSendCoding = false;
								clearInterval(this.codeTime);
								this.codeTime = null;
								return;
							}
							
							this.testCodeTime = testCodeTime;
						}, 1000);
					})
					.catch(err => {
						this.isSendCoding = false;
						uni.showToast({
							icon: "none",
							title: "获取验证码失败"
						});
					});
			},
			
			// 提交专车看房
			submitCarLookHouse() {
				let reg = /^((1[3-9][0-9])+\d{8})$/;
				this.carLookHouseInfo.telephone = this.carLookHouseInfo.telephone.replace(/(^\s*)|(\s*$)/g, "");
				if(!this.carLookHouseInfo.name) {
					uni.showToast({
						icon: "none",
						title: "请输入姓名"
					});
					return;
				}
				
				if(!this.carLookHouseInfo.telephone) {
					uni.showToast({
						icon: "none",
						title: "请输入手机号"
					});
					return;
				}
				
				if(this.carLookHouseInfo.telephone.length < 11) {
					uni.showToast({
						icon: "none",
						title: "请输入11位手机号"
					});
					return;
				}
				
				if(!(reg.test(this.carLookHouseInfo.telephone))) {
					uni.showToast({
						icon: "none",
						title: "手机号格式不正确"
					});
					return;
				}
				
				if(!this.carLookHouseInfo.captcha) {
					uni.showToast({
						icon: "none",
						title: "请输验证码"
					});
					return;
				}
			
				uni.showLoading({
					title:'提交中',
					mask:true
				});
				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
				
				//custSource 客户来源 1，开发商 2，代理商 3，分享客户4，erp登记 5，优优登记 6,悠居客 		20190725
				new SubmitYuYueLookHouseInfo({
					cityId: cityInfo.cityId || "",
					bCityId: this.cityId,
					buildId: this.caseId,
					custName: this.carLookHouseInfo.name,
					custMobile: this.carLookHouseInfo.telephone,
					code: this.carLookHouseInfo.captcha,
					archiveId: this.archiveId,
					custSource: 6,		
				}).send()
					.then(data => {
						uni.hideLoading();
                        clearInterval(this.codeTime);
                        this.codeTime = null;
						this.testCodeTime = 0;
						if(!data.code || data.code != 1) {
							uni.showToast({
								title: data.msg || "提交失败",
								icon: 'none'
							});
							return;
						}
						
						uni.showToast({
							title: data.msg || "提交成功",
							icon: 'none'
						});
						this.carLookHouseTc = false;
					})
					.catch(err => {
						uni.hideLoading();
						uni.showToast({
							title: "提交失败",
							icon: 'none'
						});
					});
			},
		},
	}
</script>

<style>
	/* 专车看房弹窗 */
	.car_look_house_view{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 200;
		background: rgba(0,0,0,0.5);
	}
	.car_look_house_info{
		background: #FFFFFF;
		width:550upx;
		border-radius: 10upx;
		box-sizing: border-box;
		overflow: hidden;
		margin: auto;
		position: relative;
		padding: 40upx 30upx 50upx;
	}
	.car_look_title{
		text-align:center;
		font-size:38upx;
		color:#333;
		margin-bottom:16upx;
	}
	.car_look_close{
		text-align:center;
		height:60upx;
		position:absolute;
		top:0;
		right:0;
		width:60upx;
	}
	.car_look_close image{
		width:20upx;
		height:20upx;
		margin: auto;
	}
	.car_look_subtitle{
		text-align:center;
		font-size:24upx;
		line-height:35upx;
		color:#999;
		margin-bottom:16upx;
	}
	.car_input_view{
		margin-bottom:20upx;
	}
	.car_input{
		background-color:#f2f2f2;
		height:86upx;
		line-height: 86upx;
		padding:0upx 25upx;
		box-sizing: border-box;
		font-size:30upx;
		color:#333;
	}
	.car_input_plac{
		background-color:#f2f2f2;
		height:86upx;
		line-height: 86upx;
		padding:0upx;
		box-sizing: border-box;
		font-size:30upx;
		text-align: left;
		display: flex;
	}
	.get_code{
		width:213upx;
		text-align:center;
		color:#ab7f2e;
		font-size:28upx;
		line-height:86upx;
		flex-shrink: 0;
	}
	.car_look_submit{
		color:#fff;
		border-radius: 10upx;
		height: 90upx;
		line-height: 90upx;
		text-align: center;
		font-size: 36upx;
		color: #FFFFFF;
		background:linear-gradient(to right, #fe8e0d, #ff7f1e, #ff6f2e);
	}

	
	/* 头部 */
	.build_book_view{
		width: 100%;
		min-height: 100%;
	}
	.new_build_view{
		width: 100%;
		min-height: 100%;
		background-color: #fefefe;
		background-image: url(http://cdn.haofang.net/static/uuweb/buildingBook/newBuilding/foobg.png);
		background-position: center bottom;
		background-repeat: no-repeat;
		background-size: 100% auto;
	}
	.build_title_view{
		width: 100%;
		height: 420upx;
		padding-top: 188upx;
		text-align: center;
		background-image: url(http://cdn.haofang.net/static/uuweb/buildingBook/newBuilding/quality.png);
		background-repeat: no-repeat;
		background-position: center 72upx, center bottom;
		background-size: 82upx 118upx,100% auto;
		box-sizing: border-box;
	}
	.title-box{
		width: 630upx;
		height: 128upx;
		background: url(http://cdn.haofang.net/static/uuweb/buildingBook/newBuilding/title-bg.png) no-repeat center;
		background-size: 100%;
		margin: 0 auto;
		padding-top: 20upx;
		box-sizing: border-box;
	}
	.build-name{
		font-size: 60upx;
		color: #2e3746;
		font-weight: bold;
		margin-bottom: 24upx;
	}
	.houseType-text .span-icon{
		display: inline-block;
		width: 12upx;
		height: 32upx;
		background: url(http://cdn.haofang.net/static/uuweb/buildingBook/newBuilding/area.png) no-repeat center;
		background-size: 100%;
		margin-right: 10upx;
	}
	.houseType-text .strong-icon{
		display: inline-block;
		font-size: 40upx;
		font-weight: normal;
		margin-bottom: 6upx;
	}
	.houseType-text .em-icon{
		font-size: 28upx;
		display: inline-block;
		margin: 0;
	}
	
	/* 小区图片 */
	.houseimg-box{
		height: 472upx;
		border-top: 1upx solid #a6aebc;
		border-bottom: 1upx solid #a6aebc;
		padding-top: 6upx;
		padding-bottom: 6upx;
	}
	.houseimg-box .house-content{
		width: 100%;
		height: 100%;
		position: relative;
	}
	#house-content image{
		width: 100%;
		height: 100%;
	}

	/* 小区价格 */
	.house-info-box{
		width: 100%;
		padding-top: 70upx;
	}
	.house-info-title{
		text-align: center;
		margin-bottom: 108upx;
	}
	.house-info-title .i-icon{
		display: inline-block;
		width: 168upx;
		height: 4upx;
		background: url(http://cdn.haofang.net/static/uuweb/buildingBook/newBuilding/title-h.png) no-repeat center/100%;
		margin-bottom: 28upx;
	}
	.h3-text .span-text{
		display: inline-block;
		font-size: 18upx;
		color: #2e3746;
		width: 18upx;
	}
	.house-info-title .h3-text text{
		font-size: 40upx;
		color: #2e3746;
		margin-left: 4upx;
	}
	.house-info-title .p-text{
		font-size: 28upx;
		margin-top: 20upx;
		color: #2e3746;
	}
	.house-info-box .h1-text{
		margin: 0 auto;
		width: 670upx;
		height: 36upx;
		border-bottom: 1upx solid #a6aebc;
		background: url(http://cdn.haofang.net/static/uuweb/buildingBook/newBuilding/text-eg.png) no-repeat center;
		-webkit-background-size: 670upx 10upx;
		background-size: 670upx 10upx;
	}
	.no_price{
		font-size: 24upx;
		color: #aaaaaa;
	}

	/* 楼盘介绍 */
	.house-content-box{
		padding-bottom: 144upx;
	}
	.houseimg{
		width: 670upx;
		height: 440upx;
		margin: 0 auto;
		margin-top: 40upx;
		position: relative;
	}
	.houseimg-list{
		width: 100%;
		height: 100%;
		position: relative;
	}
	.houseimg .i-text{
		position: absolute;
		display: block;
		left: 0;
		right: 0;
		bottom: -32upx;
		z-index: 99;
		margin: auto;
		width: 64upx;
		height: 64upx;
		background: url(http://cdn.haofang.net/static/uuweb/buildingBook/newBuilding/pz-bg.png) no-repeat center;
		-webkit-background-size: 100%;
		background-size: 100%;
	}
	.house-about{
		margin-top: 80upx;
		padding: 0 40upx;
		padding-top: 52upx;
		background: url(http://cdn.haofang.net/static/uuweb/buildingBook/newBuilding/title-1.png) no-repeat 0.2upx top;
		background-size:  auto 8upx;
		margin-bottom: 138upx;
	}
	.house-about .h2-text{
		font-size: 40upx;
		color: #2e3746;
		margin-bottom: 38upx;
	}
	.house-about .p-text{
		font-size: 26upx;
		color: #4a515b;
		line-height: 40upx;
		margin-bottom: 20upx;
	}
	.house-about .i-text{
		display: block;
		width: 18upx;
		height: 18upx;
		background: url(http://cdn.haofang.net/static/uuweb/buildingBook/newBuilding/text-icon.png) no-repeat center;
		background-size: 100%;
	}
	#house-content,#houseimg-list{
		background: url(http://cdn.haofang.net/static/uuweb/buildingBook/housingLongFigure/no-img.png) no-repeat center;
		background-size: 146upx 104upx;
		background-color: #ebf0f5;
	}
	#houseimg-list image{
		width: 100%;
		height: 100%;
	}

	/* 户型介绍 */
	.houseType-box{
		width: 100%;
	}
	.houseType-box .h2-text{
		width: 362upx;
		height: 180upx;
		background: url(http://cdn.haofang.net/static/uuweb/buildingBook/newBuilding/houseTypeImgTitle.png) no-repeat center;
		background-size: 100%;
		margin: 0 auto;
		margin-bottom: 36upx;
	}
	.houseimg-list-box {
		padding: 0 40upx;
		width: 100%;
		box-sizing: border-box;
		margin: 0 auto;
	}
	.houseimg-list-box .li{
		width: 100%;
		position: relative;
		margin-bottom: 126upx;
	}
	.houseimg-list-box .li image{
		width: 100%;
		height: auto;
		display: block;
	}
	.houseimg-list-box li:last-child{
		margin-bottom: 0;
	}
	#houseTypeimg-one,#houseTypeimg-two{
		background-size: 146upx 104upx;
		background-color: #ebf0f5;
	}
	
	/* 位置地图 */
	.area-info{
		width: 100%;
		margin-top: 186upx;
	}
	.area-info .h2-text{
		width: 100%;
		height: 182upx;
		background: url(http://cdn.haofang.net/static/uuweb/buildingBook/newBuilding/area-title.png) no-repeat center;
		background-size: 100%;
		margin-bottom: 60upx;
	}
	.map-box{
		width: 100%;
		height: 476upx;
		background:url(http://cdn.haofang.net/static/uuweb/buildingBook/newBuilding/area-line.png) no-repeat 606upx top;
		-webkit-background-size: 126upx 56upx;
		background-size: 126upx 56upx;
		padding-top: 36upx;
	}
	#map{
		position: relative;
		width: 670upx;
		height: 440upx;
		margin: 0 auto;
		overflow: hidden;
	}
	#map image{
		width: 100%;
		height: 100%;
	}
	.BMap_Marker img{
		width: 100%;
	}

	/* 楼盘地址 */
	.check-out{
		margin-top: 94upx;
		width: 100%;
		text-align: center;
	}
	.check-out .i-text{
		display: inline-block;
		width: 90upx;
		height: 8upx;
		background: url(http://cdn.haofang.net/static/uuweb/buildingBook/newBuilding/livable-city.png) no-repeat center;
		background-size: 100%;
		margin-bottom: 26upx;
	}
	.check-out .p-text{
		font-size: 24upx;
		margin-bottom: 24upx;
		color: #2e3746;
	}
	.check-out .address-info{
		width: 606upx;
		min-height: 90upx;
		padding: 0 20upx;
		margin: 0 auto;
		background-size: 100% 6upx;
		border: 1upx solid #a6aebc;
		position: relative;
		font-size: 26upx;
		color: #2e3746;
		text-align: center;
		line-height: 1.8;
		padding-top: 30upx;
		padding-bottom: 16upx;
	}
	.address-info::after{
		content: '';
		position: absolute;
		right: 40upx;
		bottom: -10upx;
		width: 190upx;
		height: 20upx;
		background-image: url(http://cdn.haofang.net/static/uuweb/buildingBook/newBuilding/bottom-img.png);
		background-color:#fff;
		background-position: center;
		background-size: 172upx 16upx;
		background-repeat: no-repeat;
	}

	/* 经纪人信息 */
	.broker-information{
		width: 100%;
		margin-top: 200upx;
		height: 350upx;
		background: url(http://cdn.haofang.net/static/uuweb/buildingBook/housingLongFigure/user.png) no-repeat center;
		background-size: 550upx 350upx;
		position: relative;
		padding-top: 80upx;
		text-align: center;
		box-sizing: border-box;
	}
	.user-photo{
		position: absolute;
		border-radius: 50%;
		border:1upx solid #becbdc;
		width: 110upx;
		height: 110upx;
		background-image: url(http://cdn.haofang.net/static/uuweb/buildingBook/housingLongFigure/default_head.png);
		background-size: cover;
		background-position: center;
		left: 0;
		right: 0;
		margin: 0 auto;
		top: -50upx;
		background-color: #fff;
	}
	.user-photo .i-text{
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		/* background: ; */
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
	}
	.broker-information .p-text{
		font-size: 38upx;
		color: #4a5871;
		margin-top: 24upx;
		font-weight: bold;
	}
	.broker-information .h4-text{
		font-size: 24upx;
		color: #4a5871;
		margin-top: 20upx;
	}
	.broker-information .h5-text{
		font-size: 18upx;
		color: #909aad;
		margin-top: 24upx;
	}

	/* 长按识别 */
	.ewm{
		display: none;
		margin-top: 110upx;
		text-align: center;
	}
	.ewm image{
		width: 220upx;
		height: 220upx;
	}
	.ewm .p-text{
		margin-top: 32upx;
		font-size: 18upx;
		color: #909aad;
	}

	/* 咨询 */
	.build_book_bottom{
		position:fixed;
		bottom:0;
		left:0;
		width:100%;
		height:108upx;
		z-index:101;
		background:#fff;
		padding: 0 20upx;
		box-sizing: border-box;
	}
	.bottom_agent_head{
		width:80upx;
		height:80upx;
		background-image:url(http://cdn.haofang.net/static/uuweb/buildingBook/housingLongFigure/default_head.png);
		background-size:cover;
		background-position:center center;
		background-repeat:no-repeat;
		margin: auto 20upx auto 0;
		flex-shrink: 0;
		border-radius: 100%;
		overflow: hidden;
	}
	.bottom_agent_head image{
		width: 100%;
		height: 100%;
	}
	.bottom_agent_name{
		text-align:left;
		box-sizing:border-box;
		font-size:30upx;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.bottom_agent_star_view{
		margin-top: 5upx;
	}
	.bottom_agent_star_view image{
		height: 16upx;
		width: 16upx;
		margin: auto 5upx auto 0;
	}
	.book_bottom_btn_view {
		width: 450upx;
	}
	.book_bottom_btn_view>view{
		width: 200upx;
		height: 100upx;
		line-height: 100upx;
		color:#fff;
		font-size: 30upx;
		text-align: center;
		border-radius: 10upx;
	}
	.bottom_chart_btn{
		float: left;
		background-color: #febd3a;
	}
	.bottom_car_btn{
		float: left;
		background-color: #5786f2;
		margin-left: 14upx;
	}
</style>
