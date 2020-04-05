<template>
	<form report-submit @submit="formSubmit">
		<!-- <view class="step_31_view"></view> -->
		<scrollLoading v-if="isLoading" :isScrollIng="true"></scrollLoading>

		<view v-if="!isLoading" class="entrust f_c_s">
			<!-- 顶部banner区 -->
			<block v-if="isEdit != 1">
				<image v-if="step == 1" class="top_img" mode="aspectFit"
					src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/registration/banner4.png"></image>
				<image  v-if="step == 2" class="top_img" mode="aspectFit"
					src="http://cdn.haofang.net/static/wxPlusApp/yjk/entrust/banner2.png"></image>
				<image v-if="step == 3" class="top_img" mode="aspectFit"
					src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/banner5.jpg"></image>
			</block>

			<!-- 内容区 -->
			<view class="box">
				<!-- 步骤一 选择区域 || 小区 -->
				<block v-if="step == 1">
					<entrustTitle :title="caseType == 1 ? '你想卖哪的房子' : '你想出租哪的房子？'"></entrustTitle>

					<view class="step_31_view"></view>
					<!-- 合租整租 -->
					<radioView :type="'zuType'" :currentId="isHeZu"
						v-if="caseType == 2" @onRadioChanged="onRadioChanged"
						:list="zuTypeList"></radioView>

					<view v-if="caseType != 2" class="step_31_view"></view>
					<!-- 你想买的房屋类型 -->
					<radioView :type="'houseType'" :title="'你想出售的房屋类型？'" :currentId="houseTypeId"
						@onRadioChanged="onRadioChanged"
						:list="houseTypeList"></radioView>

					<!-- 展示小区 -->
					<smallTitle :title="'房屋所在小区？'"></smallTitle>
					<chooseBuild :buildName="buildName" :buildId="buildId"
						:regId="regionId" :caseType="caseType"
						@onNearBuildChanged="onNearBuildChanged"
						:nearBuildList="nearBuildList"></chooseBuild>

					<view class="step_1_230_view"></view>
				</block>

				<!-- 步骤二 房屋信息-->
				<block v-if="step == 2">
					<entrustTitle :title="'你的房屋基本情况？'"></entrustTitle>

					<view class="step_36_view"></view>
					<!--进入房源联卖的样式-->
					<view class="slider_title_lianmai" v-show="isEdit != 1">你{{ caseType == 1 ? '出售' : '出租' }}的房屋位置？</view>
					<view class="type-list-input" v-show="houseTypeId != 3">
						<view class="type-ul-input">
							<view class="type-ul-input-li">
								<input type="text" @focus="focusHouseRoof"
									   @blur="blurHouseRoof" :maxlength="roofMax"
									   data-long="11" data-type="栋"
									   :value="houseRoof + (roofMax ==11 ? '栋' : '')"
									   placeholder="几栋"
									   placeholder-class='addr-type-placehoder' />
							</view>
							<view class="type-ul-input-li">
								<input type="text" @focus="focusHouseUnit"
									   @blur="blurHouseUnit" :maxlength="unitMax"
									   data-long="12" data-type="单元"
									   :value="houseUnit + (unitMax == 12 ?'单元':'')"
									   placeholder="几单元"
									   placeholder-class='addr-type-placehoder' />
							</view>
							<view class="type-ul-input-li">
								<input type="text" @focus="focusHouseFloor"
									   @blur="blurHouseFloor" :maxlength="floorMax"
									   data-long="6" data-type="楼"
									   :value="houseFloor + (floorMax==6 ? '楼' : '')"
									   placeholder="几楼"
									   placeholder-class='addr-type-placehoder' />
							</view>
							<view class="type-ul-input-li">
								<input type="text" @focus="focusHouseNum"
									   @blur="blurHouseNum" :maxlength="numMax"
									   data-long="6" data-type="号"
									   :value="houseNum + (numMax==6?'号':'')"
									   placeholder="几号"
									   placeholder-class='addr-type-placehoder' />
							</view>
						</view>
					</view>
					<!--商铺类型显示地址-->
					<view class="trade-addr" v-show="houseTypeId == 3 && isEdit != 1">
						<input type="text" @input="tradeAddrInput"
							   maxlength="40"  :value="houseRoof + (roofMax==11?'栋':'')"
							   placeholder="请输入商铺所在地址" />
					</view>
					<!--以前不进入到房源联卖的样式-->
                    <!--<view>
                       <radioView :type="'room'"
                       	:title="caseType == 1 ? '你出售的房屋户型？' : '你出租的房屋户型？'"
                       	:currentId="roomId"
                       	@onRadioChanged="onRadioChanged"
                       	:list="roomList"></radioView>
                    </view>-->

					<!--<view class="step_17_view"></view>-->
					<!--<louCengSliderView :type="'louCeng'"-->
						<!--:title="caseType == 1 ? '你出售的房屋所在楼层？' : '你出租的房屋所在楼层？'"-->
						<!--:currentVal="currentLouCengVal"-->
						<!--@onSliderChanged="onSliderChanged" :caseType="caseType"-->
						<!--:list="louCengList" :unit="'层'"></louCengSliderView>-->

					<!--<view class="step_70_view"></view>-->
					<view class="step_17_view"></view>
					<saleAreaSlider :type="'area'"
						:title="caseType == 1 ? '你出售的房屋面积？' : '你出租的房屋面积？'"
						:currentVal="currentAreaVal"
						@onSliderChanged="onSliderChanged"
						:list="areaList" :unit="'㎡'"></saleAreaSlider>

					<view class="step_70_view"></view>
					<salePriceSliderView :type="'price'"
						:title="caseType == 1 ? '你出售的房屋价格？' : '你出租的房屋价格？'"
						:currentVal="currentPriceVal"
						@onSliderChanged="onSliderChanged" :caseType="caseType"
						:list="priceList" :unit="caseType == 1 ? '万' : '元'"></salePriceSliderView>

					<view v-show="caseType == 2">
						<view class="step_110_view"></view>
						<entrustTitle :title="'你的租金收款方式？'"></entrustTitle>

						<view class="step_36_view"></view>
						<radioView :type="'zuJinType'"
							:currentId="zuJinTypeId" @onRadioChanged="onRadioChanged"
							:list="zuJinTypeList"></radioView>

						<view v-show="isHeZu == 1">
							<view class="step_36_view"></view>
							<entrustTitle :title="'你出租的房间类型？'"></entrustTitle>
							<view class="step_28_view"></view>
							<radioView :type="'chuZuRoomType'"
								:currentId="chuZuRoomTypeId" @onRadioChanged="onRadioChanged"
								:list="chuZuRoomTypeList"></radioView>

							<view class="step_36_view"></view>
							<entrustTitle :title="'你的房屋装修情况？'"></entrustTitle>
							<view class="step_28_view"></view>
							<radioView :type="'zhuangXiuStatus'"
								:currentId="zhuangXiuStatusId" @onRadioChanged="onRadioChanged"
								:list="houseZhuangXiuList"></radioView>

							<view v-show="isEdit == 1">
								<view class="step_36_view"></view>
								<entrustTitle :title="'你期望的租客性别？'"></entrustTitle>
								<view class="step_28_view"></view>
								<radioView :type="'zuKeSex'"
									:currentId="zuKeSexId" @onRadioChanged="onRadioChanged"
									:list="sexLimitMap"></radioView>
							</view>

							<view class="step_36_view"></view>
							<entrustTitle :title="'你的房屋配套情况？'"></entrustTitle>
							<view class="step_28_view"></view>
							<checkboxView :type="'housePeiTao'" :title="''"
								:maxlength="housePeiTaoList.length"
								:currentId="housePeiTaoId" @onCheckboxChanged="onCheckboxChanged"
								:list="housePeiTaoList"></checkboxView>
						</view>
					</view>

					<view class="step_60_view" v-if="caseType != 2"></view>
					<otherInfoInput :maxlength="'60'" :placeholder="'请输入装修配套等体现房屋亮点的简单描述(选填)'"
						@onOtherInputChanged="onOtherInputChanged"
						:value="otherInfoVal"></otherInfoInput>

					<view class="step_90_view"></view>
					<saleAddHouseImg @onHouseImgChanged="onHouseImgChanged"
						:imgList="imgList"
						:title="'多图房源更容易接到客户来电哦（最多9张图）'"></saleAddHouseImg>

					<view class="step_1_230_view"></view>
				</block>

				<!-- 步骤三 选择服务 -->
				<block v-if="step == 3">
					<entrustTitle :title="caseType == 1 ? '选择你的出售方式？' : '选择你的出租方式？'"></entrustTitle>

					<view class="choose_service_type f_r_b">
						<view :class="(toSend == 0 || toSend == 3) ? 'choose_service_active global-selecet-box' : ''"
							@click="chooseServiceType(0)"
							class="choose_service_item">委托经纪人</view>

						<view :class="toSend == 1 ? 'choose_service_active global-selecet-box' : ''"
							@click="chooseServiceType(1)"
							class="choose_service_item">{{ caseType == 1 ? '自助卖房' : '自助出租' }}</view>
					</view>

					<block v-if="toSend == 0 || toSend == 3">
						<view class="step_60_view"></view>
						<chooseAgent @onAgentSexChanged="onAgentSexChanged" :title="'挑选你的经纪人'"
							:currentVal="agentSexVal" :list="agentList"></chooseAgent>
					</block>

					<block v-if="toSend == 1">
						<view class="step_60_view"></view>
						<mySaleHouse :hasPhone="hasPhone" :telephone="telephone"
							@onPhoneChanged="onPhoneChanged"></mySaleHouse>
					</block>
				</block>
			</view>

			<!-- 下一步 -->
			<view class="next" v-if="(isVip == 1 && step < 2) || (isVip != 1 && isEdit == 2 && step <= 2)">
				<view @click="netStep" class="next_text global-confirm-btn">下一步</view>
			</view>

			<!-- 发布 -->
			<view class="next" v-if="((isVip == 1 && step == 2) || (isVip != 1 && isEdit == 2 && step == 3))">
				<view v-if="havePhoneNumber" @click="pushEntrust" class="next_text global-confirm-btn">发布</view>

				<button v-else hover-class="none" open-type="getPhoneNumber"
						@getphonenumber="getPhone" class="next_text global-confirm-btn">发布</button>
			</view>

			<!-- 编辑 确定 -->
			<view class="next" v-if="isEdit == 1">
				<view @click="pushEntrust" class="next_text global-confirm-btn">确定修改</view>
			</view>
		</view>

		<!-- 发布成功弹出层 -->
		<view id="g-mask" v-show="hidden" @touchmove.stop.prevent="moveHandle">
			<view class="g-mask-box" @click="closeMask"></view>
			<view class="g-mask-content">
				<view class="g-mask-center">
					<image class="g-mask-icon" src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/newUiStyle/success.png" mode=""></image>
					<text class="g-mask-title">{{releaseInfo.releaseStatus}}</text>
					<text class="g-mask-text">我们已收到您的{{releaseInfo.ourShuom}}，客服人员会尽快联系您确认委托信息，请耐心等待！</text>
					<view class="g-mask-info">修改信息或图片，进入“<text class="s-orange global-font-color">我的</text>”-“
						<text class="s-orange global-font-color">{{releaseInfo.releaseReply}}</text>”
					</view>
					<view class="g-mask-btn global-confirm-btn" @click="closeMask">知道了</view>
				</view>
			</view>
		</view>
	</form>
</template>

<script>
	import { GetScreenList } from "../../net/GetScreenList.js";
	import { GetPushEntrustBaseInfo } from "../../net/entrust/GetPushEntrustBaseInfo.js";
	import { Notification } from "../../utils/Notification.js";
	import { Notify } from "../../utils/Notify.js";
	import { GpsInfoModel } from "../../model/GpsInfoModel.js";
	import entrustTitle from "../../components/entrust/edit/entrustTitle.vue";
	import smallTitle from "../../components/entrust/edit/smallTitle.vue";
	import chooseRegion from "../../components/entrust/edit/chooseRegion.vue";
	import chooseBuild from "../../components/entrust/edit/chooseBuild.vue";
	import radioView from "../../components/entrust/edit/radioView.vue";
	import saleAreaSlider from "../../components/entrust/edit/saleAreaSlider.vue";
	import salePriceSliderView from "../../components/entrust/edit/salePriceSliderView.vue";
	import louCengSliderView from "../../components/entrust/edit/louCengSliderView.vue";
	import chooseFeiYong from "../../components/entrust/edit/chooseFeiYong.vue";
	import chooseAgent from "../../components/entrust/edit/chooseAgent.vue";
	import otherInfoInput from "../../components/entrust/edit/otherInfoInput.vue";
	import saleAddHouseImg from "../../components/entrust/edit/saleAddHouseImg.vue";
	import mySaleHouse from "../../components/entrust/edit/mySaleHouse.vue";
	import checkboxView from "../../components/entrust/edit/checkboxView.vue";
	import { CheckUserInfo,BindUserMobile } from "@/net/common/CheckUserInfo.js"
	import { UserInfoModel } from "@/model/UserInfoModel.js";
	import { CheckMobileCaptcha } from "@/net/common/CheckMobileCaptcha.js";
	import { Const } from "../../utils/Const.js";
	import {GetUserTel} from "../../utils/common";
	import { PushHouseEntrust, GetHouseEntrustDetail, UpSaleEntrustDetail, UpLeaseEntrustDetail } from "@/net/entrust/PushEntrust.js";

	let entrustPrivate = {
		currentAreaVal: 140,
		currentPriceVal: 0,
		heZuAreaList: [],
		leaseAreaList: [],
		params: {},
		detailPhotoList: []
	};

	export default {
		components: {
			entrustTitle,
			chooseRegion,
			chooseBuild,
			radioView,
			saleAreaSlider,
			salePriceSliderView,
			chooseFeiYong,
			chooseAgent,
			otherInfoInput,
			smallTitle,
			louCengSliderView,
			saleAddHouseImg,
			mySaleHouse,
			checkboxView
		},

		data() {
			return {
				hidden: false,
				releaseInfo: {
					releaseStatus: '提交成功！',
					ourShuom: '',
					releaseReply: '',
				},
				isLoading: true,
				caseType: "",
				cityId: "1",
				step: 1,  // 步骤
				isEdit: 2,  // 是否是编辑状态  1 是   2 否
				toSend: 3,  // 服务方式 0: 委托经纪人  1: 自助买房 3: 联卖
				telephone: "", // 用户电话
				hasPhone: false,  // 是否有电话

				// 区域筛选
				regionList: [],  // [[四项], [四项]]
				sectionMap: {},  //  {id: []}

				// 附近小区
				nearBuildList: [],  // 附近小区列表

				// 房屋信息
				houseZhuangXiuList: Const.houseFitmentMap,  // 装修情况
				roomList: Const.entrustRoomList,  // 室
				areaList: [50, 70, 100, 150, 200],  // 面积范围
				currentAreaVal: 0,  // 面积slider当前的滑动位置
				currentPriceVal: 0,  // 价格slider当前的滑动位置
				currentLouCengVal: 15,  // 楼层slider当前的滑动位置
				louCengList: [1, 15, 30, 60, 90],  // 楼层范围
				priceList: [],  // 价格范围
				feiYongList: [],  // 中介费用数组
				agentList: Const.sexMap,  // 经纪人性别数组

				// --租房相关----
				// 整合/合租数组
				zuTypeList: [
					{id: 0, text: "整租"},
					{id: 1, text: "合租"}
				],
				// 租金类型
				zuJinTypeList: Const.zuJinTypeList,
				// 出租房间类型
				chuZuRoomTypeList: Const.chuZuRoomTypeList,
				// 配套设置
				housePeiTaoList: Const.housePeiTaoMap,
				// 合租性别
				sexLimitMap: [
					{id:1, text:'男士'},
					{id:2, text:'女士'},
					{id:3, text:'不限'},
				],

				// ---------- 以下参数用于提交请求 -----------
				sourceType: '1', //委托来源 1 微信 2 APP 3 SOLR 4优家公众号 5 优家微店公众号 6公司微店公众号 7 门店微店
				rewardType: '0', //奖励类型（0普通类型1有奖委托 默认0）
				rewardMoney: '', //奖励金额（如果是有奖委托必传）
				isVip: 2,  // 是否是专属委托  1 是  2 否  (房源详情页小区专家的专属委托)
				regionId: "",  // 当前区域id
				sectionId: "",  // 当前商圈id
				regionName: "",  // 当前区域名称
				sectionName: "不限",  // 当前商圈名称
				zhuangXiuStatusId:  '7',//7装修不限、5豪装、4精装、2简装、1毛坯-合租信息才需要该字段
				buildName: "",  // 小区名称
				buildId: "",   // 小区id
				houseTypeId: "1",    // 房屋类型id
				roomId: "3",  // 几室id
				area: 0,  // 面积
				price: 0,  // 价格
				agentSexVal: "",  // 经纪人性别
				otherInfoVal: "",  // 其他信息的输入框内容
				louCengVal: 15,  // 楼层值
				imgList: [],  // 房源图片数组
				captchaCode: "",  // 验证码

				// 租房相关
				isHeZu: "0",  // 0: 整租, 1: 合租
				zuJinTypeId: 1,  // 付款方式:1月付、2季付、3半年付、4年付----整租合租信息才有该值-必填
				chuZuRoomTypeId: 1, //合租的房间类型：1类型不限、2次卧、3主卧、4单间、默认:0----合租信息才有该值
				housePeiTaoId: [],  // 配套设置
				zuKeSexId: '3', //合租的性别限制

				fromStatus: "",
				archiveId: "", // 经纪人id
				pushLogId: "",
				compId: "",  // 公司id
				houseId: "",  // 房源id
				specialOper: 0,  // 1:从房源详情点击的委托、0:其他业务、后续可能还会增加
				isHelp: 0,     // 是否需要经纪人帮助填写信息-专属委托时候才需要填写，默认:0,需要:1

				// 联卖新增参数
				roofMax: '',  // 栋 最大值
				unitMax: "",  // 单元 最大值
				floorMax: "", // 楼 最大值
				numMax: "", // 房号 最大值
				houseRoof: "",  // 栋
				houseUnit: "", // 单元
				houseFloor: "", // 楼
				houseNum: "", // 房号
				tradeAddr: "", // 商铺地址
			};
		},

		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},

		computed: {
			// 房屋类型
			houseTypeList() {
				let list = [];
				Const.entrustHouseTypeList.map((item) => {
					if(list.length < 3) {
						list.push(item);
					}
				});
				return list;
			},
			// 是否有手机号
			havePhoneNumber() {
				return (new UserInfoModel().getModel("telephone") || "");
			}
		},

		// params 接受 serviceRegionId（区域id） 和 caseType
		onLoad(params = {}) {
			this.initParams(params);

			this.upGpsInfo();
			new this.InitFormSubmit(this);

			// 监听gps变化
			new Notification().addObserver(this, "GpsChanged", Notify.GpsChanged.Name);

			let showInfo = {
				1: { releaseReply: '卖房委托', ourShuom: '出售委托' },
				2: { releaseReply: '出租委托', ourShuom: '出租委托' },
				3: { releaseReply: '卖房委托', ourShuom: '出售委托' },
				4: { releaseReply: '卖房委托', ourShuom: '出售委托' },
			};
			//获取提交数据
			this.releaseInfo = {
				releaseStatus: '提交成功！',
				releaseReply: showInfo[this.caseType].releaseReply,
				ourShuom: showInfo[this.caseType].ourShuom
			};
			this.upTitle();
		},

        onShow() {
            new this.SetMetaInfo().initDefault();
        },

		onUnload() {
			// 反注册通知
			new Notification().removeObserverAllNotification(this);
		},

		onReady() {
			this.getPhoneInfo();
		},

		methods: {
			moveHandle() {},

			setData(obj) {
				for (let key in obj) {
					this[key] = obj[key];
				}
			},

			// 栋 聚焦
			focusHouseRoof(e) {
				let val = e.detail.value;
				if(val) {
					val = parseInt(val);
				}
				let num = e.currentTarget.dataset.long - e.currentTarget.dataset.type.length;
				this.setData({ houseRoof: val, roofMax: num });
			},
			// 栋 失去聚焦
			blurHouseRoof(e) {
				let val = e.detail.value.replace(/[^\d|\u4E00-\u9FA5|\a-\z\A-\Z]/g, "");
				let num = e.currentTarget.dataset.long;
				let letterNum = /^[^\u4e00-\u9fa5]+$/;
				let count = 0;
				if(val == ''){
					num = e.currentTarget.dataset.long - e.currentTarget.dataset.type.length;
				}
				// 如果是字母或数字 只能输入5位
				if(letterNum.test(val)){
					if(val.length > 5){
						count = val.length - 5
					}
					val = val.substr(0, val.length - count);
				}
				this.setData({ houseRoof: val, roofMax: num });
			},

			// 单元 聚焦
			focusHouseUnit(e) {
				let val = e.detail.value;
				if(val) {
					val = parseInt(val);
				}
				let num = e.currentTarget.dataset.long - e.currentTarget.dataset.type.length;
				this.setData({ houseUnit: val, unitMax: num });
			},
			// 单元 失去聚焦
			blurHouseUnit(e){
				let val = e.detail.value.replace(/[^\d|\u4E00-\u9FA5|\a-\z\A-\Z]/g, "");
				let num = e.currentTarget.dataset.long;
				let letterNum = /^[^\u4e00-\u9fa5]+$/;
				let count = 0;
				if(val == ''){
					num = e.currentTarget.dataset.long - e.currentTarget.dataset.type.length;
				}
				// 如果是字母或数字 只能输入5位
				if(letterNum.test(val)){
					if(val.length > 5){
						count = val.length - 5
					}
					val = val.substr(0, val.length - count);
				}
				this.setData({ houseUnit: val, unitMax: num });
			},

			// 楼 聚焦
			focusHouseFloor(e){
				let val = e.detail.value;
				if(val) {
					val = parseInt(val);
				}
				let num = e.currentTarget.dataset.long - e.currentTarget.dataset.type.length;
				this.setData({ houseFloor: val, floorMax: num });
			},
			// 楼 失去聚焦
			blurHouseFloor(e){
				let val = e.detail.value.replace(/[^\d]/g, "");
				let num = e.currentTarget.dataset.long;
				if(val > 200){
					val = 200
				}
				if(val == ''){
					num = e.currentTarget.dataset.long - e.currentTarget.dataset.type.length;
				}
				this.setData({ houseFloor: val, floorMax: num });
			},

			// 房号 聚焦
			focusHouseNum(e){
				let val = e.detail.value;
				if(val) {
					val = parseInt(val);
				}
				let num = e.currentTarget.dataset.long - e.currentTarget.dataset.type.length;
				this.setData({ houseNum: val, numMax: num });
			},
			// 房号 失去聚焦
			blurHouseNum(e){
				let val = e.detail.value.replace(/[^\d|\a-\z\A-\Z]/g, "");
				let num = e.currentTarget.dataset.long;
				if(val == ''){
					num = e.currentTarget.dataset.long - e.currentTarget.dataset.type.length;
				}
				this.setData({ houseNum: val, numMax: num });
			},

			// 商铺地址输入
			tradeAddrInput(e) {
				this.setData({ tradeAddr: e.detail.value });
			},

			// 更新title
			upTitle() {
				if(this.isEdit == 1) {
					let newTitle = '出售房源编辑';
					if(this.caseType == 2 && this.isHeZu ==0){newTitle='整租房源编辑'}
					if(this.caseType == 2 && this.isHeZu ==1){newTitle='合租房源编辑'}
					uni.setNavigationBarTitle({
						title: newTitle
					});
					this.step = 2;
					return;
				}

				uni.setNavigationBarTitle({
					title: "发布委托"
				});
			},

			// 初始化传入参数
			initParams(params = {}) {
				if(params.serviceRegionId) {
					this.regionId = params.serviceRegionId;
				}
				if(params.caseType || params.casetype) {
					this.caseType = params.caseType || params.casetype || "";
					this.feiYongList = Const.feeMap[this.caseType];
					this.wfFee = this.caseType == 3 ? '0.015|0.02' : '0.5|1';
				}
				if(params.houseType) {
					this.houseTypeId = params.houseType;
				}
				if(params.zhuangXiuStatus) {
					this.zhuangXiuStatusId = params.zhuangXiuStatus;
				}
				this.isHelp = 0;
				this.isVip = params.isVip == 1 ? 1 : 2;
				if(params.isVip == 1) {
					this.isHelp = 1;
				}

				// key 是url参数, value是页面data参数
				let keyMap = new Map()
					.set("fromStatus", "fromStatus")
					.set("vipCaseId", "houseId")
					.set("cityId", "cityId")
					.set("isHezu", "isHeZu")
					.set("pushLogId", "pushLogId")
					.set("archiveId", "archiveId")
					.set("isEdit", "isEdit")
					.set("compId", "compId")
                    .set("buildId", "buildId")
					.set("buildName", "buildName")
					.set("pushLogId", "pushLogId")
					.set("houseRoof", "houseRoof")
					.set("houseUnit", "houseUnit")
					.set("houseFloor", "houseFloor")
					.set("houseNum", "houseNum")
					.set("tradeAddr", "tradeAddr");
				for(let key in params) {
					if(keyMap.has(key) && params[key]) {
						this[keyMap.get(key)] = params[key];
					}
				}

				// 初始化时有单元等信息时增加单位
				if (this.houseRoof && this.houseRoof != "0") {
					this.roofMax = 11;
				}
				if (this.houseUnit && this.houseUnit != "0") {
					this.unitMax = 12;
				}
				if (this.houseFloor && this.houseFloor != "0") {
					this.floorMax = 6;
				}
				if (this.houseNum && this.houseNum != "0") {
					this.numMax = 6;
				}
			},

			// 获取设备信息
			getPhoneInfo() {
			    let res = uni.getSystemInfoSync();
			},

			upGpsInfo() {
			    if(!new GpsInfoModel().getModel("cityInfo")) return;

			    let item = new GpsInfoModel().getModel("cityInfo");
			    this.cityId = item.cityId || "1";
				if(!this.regionId && item.regId) {
					this.regionId = item.regId;
					this.regionName = item.regName;
				}
			    this.initData();
			},
			// gps change 回调
			GpsChanged(name, item) {
			    this.upGpsInfo();
			},


			// 更新编辑信息
			upEditInfo() {
				if(this.isEdit != 1) {
					this.isLoading = false;
					return;
				}

				new GetHouseEntrustDetail({
					cityId: this.cityId,
					brokerArchiveId: this.archiveId,
					pushLogId: this.pushLogId,
					vipCaseId: this.houseId,
					caseType: this.caseType,
				}).send()
					.then(res => {
						if(res.STATUS != 1) {
							this.isLoading = false;
							return;
						}

						let data = res.DATA || {};
						// console.error("---GetHouseEntrustDetail---", data);
						if(this.isHeZu == 1 && this.caseType == 2) {
							this.areaList = entrustPrivate.heZuAreaList;
							this.toSend = 1;
						}
						this.buildId = data.buildId;
						this.buildName = data.buildName;
						this.houseTypeId = data.houseUseage;
						this.area = data.houseArea;
						this.currentAreaVal = data.houseArea;
						this.roomId = (data.houseRoom && parseInt(data.houseRoom) > 5) ? 20 : data.houseRoom;
						this.price = data.houseTotalPrice || 2000;
						this.currentPriceVal = data.houseTotalPrice || 2000;
						this.otherInfoVal = data.houseDesc ? decodeURI(data.houseDesc) : "";
						this.louCengVal = (data.houseFloor && data.houseFloor!=0)
							? parseInt(data.houseFloor) : 15;
						this.currentLouCengVal = (data.houseFloor && data.houseFloor!=0)
							? parseInt(data.houseFloor) : 15;
						this.zuKeSexId = data.sexLimit || 3;

						let photoList = data.photoList || [];
						let imgList = [];
						let detailPhotoList = [];
						photoList.map(info => {
							if(info.picUrl && info.picUrl.indexOf("http://pic.myfun7.com/") >= 0) {
								imgList.push({photoId: info.photoId, picUrl: info.picUrl,
									saveUrl: info.picUrl.split("http://pic.myfun7.com/")[1]});
								detailPhotoList.push({photoId: info.photoId, picUrl: info.picUrl,
									saveUrl: info.picUrl.split("http://pic.myfun7.com/")[1]});
							}
							if(info.picUrl && info.picUrl.indexOf("http://pic.myfun7.com/") < 0) {
								imgList.push({photoId: info.photoId, picUrl: "http://pic.myfun7.com/" + info.picUrl,
									saveUrl: info.picUrl});
								detailPhotoList.push({photoId: info.photoId, picUrl: "http://pic.myfun7.com/" + info.picUrl,
									saveUrl: info.picUrl});
							}
						});
						entrustPrivate.detailPhotoList = detailPhotoList;
						this.imgList = imgList;
						if (this.caseType == 2) {
							this.zuJinTypeId = data.caseAccount;
							this.isHeZu = data.isHezu || 0;
							if (this.isHeZu == 1) {
								let houseSetArr = data.houseSet ? data.houseSet.split(',') : [];
								houseSetArr.map((val, index) => {
									houseSetArr[index] = parseInt(val);
								});
								this.housePeiTaoId = houseSetArr;
								this.zhuangXiuStatusId = data.houseFitment;
								this.chuZuRoomTypeId = (data.houseType && data.houseType !=0)
									? data.houseType : 1;
							}
						}
						if(this.isHeZu == 1) {
							this.toSend = 1;
						}
						this.isLoading = false;
					})
					.catch(() => {
						this.isLoading = false;
					});
			},


			// 选择服务类型
			chooseServiceType(type) {
				if(type == 0 && this.isHeZu == 1) {
					uni.showToast({
						icon: "none",
						title: "合租只能自助出租哦"
					});
					return;
				}

				// 只有普通委托和专属 2020.02.12
				this.toSend = type == 3 ? 0 : type;
				// this.toSend = type == 0 ? 3 : type;
			},

			initData() {
				let gpsInfo = new GpsInfoModel().getModel("gpsInfo") || {};
				let me = new UserInfoModel().getModel("me") || {};
				let tel = new UserInfoModel().getModel("telephone") || "";
				return new Promise((resolve, reject) => {
					Promise.all([
						new GetPushEntrustBaseInfo({cityId: this.cityId, dlat: gpsInfo.lat, dlng: gpsInfo.lng}).send(),
						new GetScreenList({cityId: this.cityId}).send()])
						.then(res => {
							let baseData = res[0] ? res[0].DATA || {} : {};
							let screenData = res[1] ? res[1].DATA || {} : {};
							// console.error(baseData,"---GetPushEntrustBaseInfo----");
							// console.error(screenData,"---GetScreenList---");

							this.drawNearBuildList(baseData);
							this.drawLouCengList(baseData);
							this.drawAreaList(baseData);
							this.drawPriceList(baseData);

							this.drawRegionList(screenData);
							this.drawSectionMap(screenData);
							this.upEditInfo();
						});

					if(me.userId) {
						if(tel) {
							this.telephone = tel;
							this.hasPhone = true;
							return;
						}

						new CheckUserInfo({userId: me.userId}).send()
							.then(res => {
								// console.error("--CheckUserInfo---", res);
								let data = res.DATA || {};
								if(res.STATUS != 1) {
									this.telephone = "";
									this.hasPhone = false;
									return;
								}

								if(data.WX_MOBILE) {
									new UserInfoModel().setModel(data.WX_MOBILE, "telephone");
									this.telephone = data.WX_MOBILE;
									this.hasPhone = true;
									return;
								}

								this.telephone = "";
								this.hasPhone = false;
							})
							.catch(() => {
								this.telephone = "";
								this.hasPhone = false;
							});
					}
				});
			},
			// 渲染区域数据
			drawRegionList(data = {}) {
				let regionData = data.REG_DATA || [];
				let regionList = [];
				let contList = [];
				for(let i = 0;i<regionData.length;i++) {
					let dataItem = regionData[i] || {};
					if(!dataItem.REG_ID) continue;

					contList.push({
						id: dataItem.REG_ID,
						name: dataItem.REG_NAME
					});

					if(contList.length === 4 ) {
						regionList.push(contList);
						contList = [];
					}

					if(i === (regionData.length - 1) && ((regionData%4) !== 0)) {
						regionList.push(contList);
						contList = [];
					}
				}
				this.regionList = regionList;
			},
			// 渲染商圈数据
			drawSectionMap(data = {}) {
				let sectionData = data.SECTION_DATA || {};
				let sectionMap = {};
				for(let key in sectionData) {
					let sectionList = sectionData[key] || [];
					let list = [{
						id: "",
						name: "不限"
					}];
					sectionList.map((info) => {
						list.push({
							id: info[1],
							name: info[0]
						});
					});
					sectionMap[key] = list;
				}
				this.sectionMap = sectionMap;
			},
			// 渲染附近小区
			drawNearBuildList(data = {}) {
				let list = data.buildList || [];
				let nearBuildList = [];
				list.map((item) => {
					nearBuildList.push({
						buildId: item.buildId || "",
						buildName: item.buildName || "",
						regId: item.buildRegion || "",
						regName: item.regName || ""
					});
				});
				this.nearBuildList = nearBuildList;
			},
			// 渲染价格范围
			drawPriceList(data = {}) {
				let priceList = [];
				let list = this.caseType == 1 ? (data.salePriceList || []) : (data.leasePriceList || []);
				list.map((item) => {
					priceList.push(parseInt(item));
				});
				this.priceList = priceList;
				this.currentPriceVal = priceList[2];
				this.price = priceList[2];
			},
			// 渲染楼层范围
			drawLouCengList(data = {}) {
				let louCengList = [];
				let floorList = data.floorList || [];
				floorList.map((item) => {
					louCengList.push(parseInt(item));
				});
				this.louCengList = louCengList;
			},
			// 渲染面积
			drawAreaList(data = {}) {
				let areaList = [];
				let list = this.caseType == 1 ? (data.saleArea || []) : (data.leaseArea || []);
				//合租面积区间和默认面积
				if(this.caseType == 2) {
					this.area = entrustPrivate.params.area ? entrustPrivate.params.area : 90;
					this.currentAreaVal = entrustPrivate.params.area ? entrustPrivate.params.area : 90;
				}else{
					this.area = entrustPrivate.params.area ? entrustPrivate.params.area : 140;
					this.currentAreaVal = entrustPrivate.params.area ? entrustPrivate.params.area : 140;
				}
				let zuList = data.hezuArea || [];
				entrustPrivate.heZuAreaList = [];
				zuList.map((item) => {
					entrustPrivate.heZuAreaList.push(parseInt(item));
				});
				if(this.caseType == 2 && this.isHeZu == 1) {
					this.area = entrustPrivate.params.area ? entrustPrivate.params.area : 30;
					this.currentAreaVal = entrustPrivate.params.area ? entrustPrivate.params.area : 30;
				}
				list.map((item) => {
					areaList.push(parseInt(item));
				});
				entrustPrivate.leaseAreaList = areaList;
				this.areaList = areaList;
			},

			// 下一步
			netStep() {
				if(this.step == 1 && !this.buildId) {
					uni.showToast({
						icon: "none",
						title: "请选择小区"
					});
					return;
				}

				if (this.step == 2 && this.houseTypeId == 3 && !this.tradeAddr) {
					uni.showToast({
						icon: "none",
						title: "请先完善商铺位置信息"
					});
					return;
				}

				if (this.step == 2 && this.houseTypeId != 3
						&& (!parseInt(this.houseRoof) || !parseInt(this.houseUnit)
								|| !parseInt(this.houseFloor) || !parseInt(this.houseNum))) {
					uni.showToast({
						icon: "none",
						title: "请先完善房屋位置信息"
					});
					return;
				}

				if(this.step == 4) return;

				this.step++;
				this.upTitle();
			},
			// 确定编辑
			confirmEdit() {
				this.step = 4;
				this.upTitle();
			},

			// 区域筛选回调
			onRegSectionChanged(info) {
				// console.error("---onRegSectionChanged-----", info);
				this.regionId = info.regId;
				this.sectionId = info.sectionId;
				this.buildName = "";
				this.buildId = "";
				this.regionName = info.regName;
				this.sectionName = info.sectionName;
			},
			// 附近小区的回调
			onNearBuildChanged(info) {
				// console.error("---onNearBuildChanged-----", info);
				this.regionId = info.regId;
				this.sectionId = "";
				this.buildName = info.buildName;
				this.buildId = info.buildId;
				this.regionName = info.regName;
				this.sectionName = "不限";
			},
			// 单选回调
			onRadioChanged(info) {
				// console.error("---onRadioChanged----", info);
				if(info.type == "room") {
					this.roomId = info.id;
				}
				if(info.type == "houseType") {
					this.houseTypeId = info.id;
				}
				if(info.type == "zhuangXiuStatus") {
					this.zhuangXiuStatusId = info.id;
				}

				// ---- 租房相关 -----
				if(info.type == "zuType") {
					this.isHeZu = info.id;
					if(this.caseType == 2) {
						if(this.isHeZu == 1) {
							this.area = !entrustPrivate.params.area
								? entrustPrivate.heZuAreaList[2] : entrustPrivate.params.area;
							this.currentAreaVal = !entrustPrivate.params.area
								? entrustPrivate.heZuAreaList[2] : entrustPrivate.params.area;
							this.areaList = entrustPrivate.heZuAreaList;
							this.toSend = 1;
						}else{
							this.area = !entrustPrivate.params.area
								? entrustPrivate.leaseAreaList[2] : entrustPrivate.params.area;
							this.currentAreaVal = !entrustPrivate.params.area
								? entrustPrivate.leaseAreaList[2] : entrustPrivate.params.area;
							this.areaList = entrustPrivate.leaseAreaList;
							// 只有普通委托和专属 2020.02.12
							this.toSend = 0;
							// this.toSend = 3;
						}
					}
				}
				if(info.type == "zuJinType") {
					this.zuJinTypeId = info.id;
				}
				if(info.type == "chuZuRoomType") {
					this.chuZuRoomTypeId = info.id;
				}
				if(info.type == "zuKeSex") {
					this.zuKeSexId = info.id;
				}
			},
			// 多选回调
			onCheckboxChanged(info) {
				// console.error("---onCheckboxChanged----", info);
				if(info.type == "housePeiTao") {
					let housePeiTaoId = [];
					(info.list || []).map((item) => {
						housePeiTaoId.push(item.id);
					});
					this.housePeiTaoId = housePeiTaoId;
				}
			},
			// slider回调
			onSliderChanged(info) {
				// console.error("---onSliderChanged----", info);
				if(info.type == "area") {
					this.area = info.area;
				}
				if(info.type == "price") {
					this.price = info.price;
				}
				if(info.type == "louCeng") {
					this.louCengVal = parseInt(info.louCeng);
				}
			},
			// 增加图片回调
			onHouseImgChanged(info) {
				// console.error("---onHouseImgChanged----", info);
				this.imgList = info.imgList;
			},
			// 经纪人性别回调
			onAgentSexChanged(info) {
				// console.error("---onAgentSexChanged----", info);
				this.agentSexVal = info;
			},
			// 其他需求input回调
			onOtherInputChanged(info) {
				// console.error("---onOtherInputChanged----", info);
				this.otherInfoVal = info;
			},
			// 输入手机号回调
			onPhoneChanged(info) {
				// console.error("-------onPhoneChanged-------", info);
				this.telephone = info.telephone || "";
				this.captchaCode = info.code || "";
			},
			// 找房条件回调
			onFindConditionChanged(info) {
				// console.error("----onFindConditionChanged-----", info);
				this.isEdit = 1;
				this.step = info.step || 1;
				if(info.step == 2) {
					this.currentAreaVal = entrustPrivate.currentAreaVal;
					this.currentPriceVal = entrustPrivate.currentPriceVal;
				}
			},

			// 我知道了
			closeMask() {
				uni.redirectTo({
					url: "/pagesEntrust/trustList/trustList?caseType="+ this.caseType
				});
				this.hidden = false;
			},

			// 获取手机号
			getPhone(e) {
				let that = this;
				//拒绝授权
				if(e.detail.errMsg && e.detail.errMsg.indexOf("fail user deny") >= 0) {
					return;
				}

				// 您的微信还未绑定手机号
				if(e.detail.errMsg && e.detail.errMsg.indexOf("resp data is empty") >= 0) {
					uni.showModal({
						title:"未获取到授权信息",
						content:"您还未绑定手机号",
						confirmText: "去绑定",
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									url: "/pagesTool/changePhone/changePhone"
								});
							}
						}
					});
				}

				if (!e.detail.encryptedData) {
					return;
				}

				GetUserTel.init(e).then(tel => {
					if(!tel) {
						uni.showToast({title: "暂无手机号"});
						return;
					}

					new BindUserMobile({
						userId: new UserInfoModel().getModel("me").userId,
						mobile: new UserInfoModel().getModel("telephone") || ""
					}).send().then(() => {
						that.pushEntrust();
					});
				});
			},

			// 发布委托
			pushEntrust() {
				let me = new UserInfoModel().getModel("me") || {};
				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
				let gpsInfo = new GpsInfoModel().getModel("gpsInfo") || {};
				if(cityInfo.cityId != gpsInfo.cityId) {
					uni.showModal({
						showCancel: false,
						confirmColor: "#ab7f2e",
						confirmText: "立即切换",
						title: "切换城市",
						content: "特权找房只能在定位城市发布委托",
						success: (res) => {
							if (res.confirm) {
								cityInfo["cityId"] = gpsInfo.cityId || "";
								cityInfo["cityName"] = gpsInfo.cityName || "";
								cityInfo["regId"] = gpsInfo.regId || "";
								cityInfo["regName"] = gpsInfo.regName || "";
								new GpsInfoModel().setModel(cityInfo, "cityInfo");
								new Notification().postNotification(Notify.GpsChanged.Name);
                                uni.reLaunch({
                                	url: "/pages/index/index"
                                });
							}
						}
					});
					return;
				}

				let requestData = {
					caseType: this.caseType,
					cityId: this.cityId,
					buildId: this.buildId,
					buildName: this.buildName,
					houseUseage: this.houseTypeId,
					houseArea: this.area,
					houseRoom: this.roomId > 5 ? 6 : this.roomId,
					price: this.price,
					descp: this.otherInfoVal,
					isVip: this.isVip == 1 ? this.isVip : 0,
					youyouUserId: me.userId || "",
					sourceType: this.sourceType,
					rewardType: this.rewardType,
					rewardMoney: this.rewardMoney,
					houseFloor: this.houseFloor,
					houseRoof: this.houseRoof,
					houseUnit: this.houseUnit,
					houseNum: this.houseNum,
					tradeAddr: this.tradeAddr,
					//(1自助 3委托 默认0) 新版联卖默认 为 3
					// toSend: this.toSend == 0 ? 3 : this.toSend,
					// 只有普通委托和专属 2020.02.12
					toSend: this.toSend == 3 ? 0 : this.toSend,
				};
				//兼容处理 提交时 houseArea 为空导致报错的问题
				if (!requestData['houseArea']){
					requestData['houseArea'] = 90;
				}
				let imgUrlMap = new Map();
				entrustPrivate.detailPhotoList.map(info => {
					imgUrlMap.set(info.saveUrl, info);
				});
				let imgUrlArr = [];
				// console.error("---imgUrlMap---", imgUrlMap);
				(this.imgList || []).map(item => {
					if(!imgUrlMap.has(item.saveUrl)) {
						imgUrlArr.push(item.saveUrl);
					}
				});
				requestData['fileAddrs'] = imgUrlArr.join(',');
				//出租委托
				if (this.caseType == 2) {
				  requestData['caseAccount'] = this.zuJinTypeId; //付款方式
				  requestData['ishezu'] = this.isHeZu;           //是否是合租信息

				  if (this.isHeZu == 1) {
					//合租委托
					requestData['masterRoom'] = this.chuZuRoomTypeId;     //合租的房间类型
					requestData['houseFitment'] = this.zhuangXiuStatusId; //合租的房间装修
					requestData['houseSet'] = (this.housePeiTaoId || []).join(",");         //合租,配套设施
				  }
				}

				//专属委托
				if (this.isVip == 1) {
					requestData['archiveId'] = this.archiveId;
					this.submitData(requestData);
					return;
				}

				//如果是编辑委托
				if (this.isEdit == 1) {
					requestData['vipCaseId'] = this.houseId;
					requestData['houseType'] = this.chuZuRoomTypeId; //编辑委托时 , masterRoom 字段修改为 houseType
					requestData['dataCityId'] = this.cityId;
					requestData['houseFloor'] = 2;
					if(this.louCengVal && this.louCengVal != "undefined") {
						requestData['houseFloor'] = this.louCengVal;
					}
					if(this.houseFloor && this.houseFloor != "undefined") {
						requestData['houseFloor'] = this.houseFloor;
					}
					requestData['sexLimit'] = this.zuKeSexId;
					this.updateData(requestData);
				  return;
				}

				//非专属委托 和编辑委托
				if (this.toSend == 0 || this.toSend == 3) {
					//委托经纪人时选择性别
					requestData['wfSex'] = this.agentSexVal;
					this.submitData(requestData);
					return;
				}

				//自助时 需要判断手机号码是否绑定
				if (this.hasPhone) {
					this.submitData(requestData);
					return;
				}

				if (!this.telephone) {
					uni.showToast({ title: '为了客户能及时联系到您，请绑定手机号码', icon: 'none' });
					return;
				}

				if (!this.captchaCode) {
					uni.showToast({ title: '为了客户能及时联系到您，请绑定手机号码', icon: 'none' });
					return;
				}

				new CheckMobileCaptcha({mobile: this.telephone,captcha: this.captchaCode,userId: me.userId}).send()
					.then(res => {
						if(res.STATUS == 1) {
                            new UserInfoModel().setModel(this.telephone, "telephone");
                            if(res.DATA && res.DATA.wxId) {
                                res.DATA.wxId = res.DATA.wxId.indexOf("uu") >= 0 ? res.DATA.wxId.replace("uu_", "") : res.DATA.wxId;
                                new UserInfoModel().setModel(res.DATA.wxId, "accid");
                            }
                            if(res.DATA && res.DATA.youyouUserId) {
                                let oldMe = new UserInfoModel().getModel("me") || {};
                                oldMe["userId"] = res.DATA.youyouUserId;
                                new UserInfoModel().setModel(oldMe, "me");
                            }
							this.submitData(requestData);
							return;
						}

						uni.showToast({ title: res.INFO || '发布失败，请稍后重试。', icon: 'none' });
					})
					.catch(err => {
						console.error("---CheckMobileCaptcha----", err);
						uni.showToast({ title: '发布失败，请稍后重试。', icon: 'none' });
					});
			},

			submitData(requestData = {}) {
				// console.log("---requestData---", requestData);
				uni.showLoading({ title: '数据提交中...'});
				new PushHouseEntrust(requestData).send()
					.then(res => {
						uni.hideLoading();
						if(res.STATUS == 1) {
							this.hidden = true;
							return;
						}

						if(res.msg && res.msg.indexOf("3个") >= 0) {
							uni.showModal({
								confirmText: "立即查看",
								confirmColor: "#ab7f2e",
								title: "",
								content: "你只能发布3个委托，请等待经纪人为你服务或取消多余的委托。",
								success: function(res) {
									if(res.confirm) {
										uni.navigateTo({
											url: "/pagesEntrust/trustList/trustList"
										});
									}
								}
							});
							return;
						}

						uni.showModal({
							title: '',
							confirmColor: "#ab7f2e",
							confirmText: "我知道了",
							showCancel: false,
							content: res.msg || "发布委托失败啦！请稍后重试。",
						});
					})
					.catch(err => {
						uni.hideLoading();
						uni.showModal({
							title: '',
							confirmColor: "#ab7f2e",
							confirmText: "我知道了",
							showCancel: false,
							content: err.msg || "发布委托失败啦！请稍后重试。",
						});
					});
			},

			updateData(requestData = {}) {
				console.error("---requestData---", requestData);
				uni.showLoading({ title: '数据提交中...'});
				if(this.caseType == 1) {
					new UpSaleEntrustDetail(requestData).send()
						.then(res => {
							this.updateDataSuccess(res);
						})
						.catch(err => {
							this.updateDataFail(err);
						});
					return;
				}

				new UpLeaseEntrustDetail(requestData).send()
					.then(res => {
						this.updateDataSuccess(res);
					})
					.catch(err => {
						this.updateDataFail(err);
					});
			},
			updateDataSuccess(res = {}) {
				if(res.STATUS == 1) {
					uni.showToast({ title: '修改成功', icon: 'none'});
					setTimeout(() => {
                        uni.navigateBack({
                        	delta: 1
                        })
					}, 1000);
					return;
				}

				this.updateDataFail(res);
			},
			updateDataFail(err = {}) {
				console.error("----updateDataFail---", err);
				uni.hideLoading();
				uni.showModal({
					title: '',
					confirmColor: "#ab7f2e",
					confirmText: "我知道了",
					showCancel: false,
					content: err.INFO || "发布委托失败啦！请稍后重试。",
				});
			}
		},
	}
</script>

<style>
	.slider_title_lianmai{
		text-align:left;
		font-size:28upx;
		color:#101d36;
		height:40upx;
		line-height:40upx;
		position:relative;
		-webkit-box-sizing:border-box;
		box-sizing:border-box;
	}
	/* 房源联卖新增字段样式 */
	.type-list-input {
		margin: 0 auto 40upx;
		box-sizing: border-box;
	}
	.type-ul-input {
		display: flex;
		flex-direction: row;
		justify-content: start;
		flex-wrap: wrap;
		padding: 28upx 0 0upx 0upx;
		box-sizing: border-box;
	}
	.type-ul-input-li {
		width: 150upx;
		height: 64upx;
		line-height: 64upx;
		text-align: center;
		border: none;
		font-size: 28upx;
		color: #c6cacf;
		margin-right: 16upx;
		border: solid 1upx #c6cacf;
		border-radius: 8upx;
		overflow: hidden;
		opacity: 0.8;
	}
	.type-ul-input-li:last-child {
		margin-right: 0;
	}
	.type-ul-input-li input {
		display: block;
		width: 100%;
		height: 100%;
		color: #333;
		background-color: #ffffff;
	}
	.addr-type-placehoder{
		color: #c6cacf
	}
	.trade-addr{
		width:100%;
		overflow:hidden;
		border:1rpx solid #c6cacf;
		box-sizing:border-box;
		border-radius:5rpx;
		opacity: 0.8;
		margin-top:25rpx;
	}
	.trade-addr input{
		width:100%;
		height:80rpx;
		line-height:80rpx;
		resize:none;
		color:#101d36;
		background-color:#FFFFFF;
		text-align:left;
		border:none;
		border-radius:0;
		padding:0 20rpx;
		box-sizing:border-box;
		font-size:28rpx;
	}

	/* 顶部 */
    .top_img{
        position:relative;
        width: 100%;
        height: 260upx;
    }
    .box{
        box-sizing:border-box;
        padding:0 40upx;
    }
	.step_1_24_view{
		margin-top: 24upx;
	}
    .step_1_230_view{
		height: 230upx;
		width: 100%;
	}
	.step_36_view{
		height: 36upx;
		width: 100%;
	}
	.step_17_view{
		height: 17upx;
		width: 100%;
	}
	.step_31_view{
		height: 31upx;
		width: 100%;
	}
	.step_60_view{
		height: 60upx;
		width: 100%;
	}
	.step_70_view{
		height: 70upx;
		width: 100%;
	}
	.step_90_view{
		height: 90upx;
		width: 100%;
	}
	.step_110_view{
		height: 110upx;
		width: 100%;
	}
	.step_28_view{
		height: 28upx;
		width: 100%;
	}

	/* 底部 */
	.filter_buy_one{
		text-align:left;
		position:fixed;
		bottom:166upx;
		height:50upx;
		line-height:99upx;
		z-index:100;
		background:#FFFFFF;
		left:0;
		padding-left:40upx;
		box-sizing:border-box;
		font-size:28upx;
		color:#fe8615;
		width:100%;
	}
	.next{
		position:fixed;
		bottom:0;
		left:0;
		width:100%;
		padding:40upx;
		box-sizing:border-box;
		z-index:99;
		background-color:#FFFFFF;
	}
	.next_text{
		width:100%;
		height:90upx;
		line-height:90upx;
		text-align:center;
		font-size:36upx;
		background:#ff6f2e;
		background:-webkit-linear-gradient(left, #fe8e0d, #ff6f2e);
		color:#FFFFFF;
		border-radius:8upx;
		will-change: transform;
		box-sizing:border-box;
	}

	/* 选择服务方式 */
	.choose_service_type{
		width: 100%;
		margin-top: 48upx;
	}
	.choose_service_type .choose_service_item:first-child{
		margin-right: 23upx;
	}
	.choose_service_type .choose_service_active{
		background-color:#FFFFFF;
		color:#ab7f2e;
		border:1upx solid #ab7f2e;
	}
	.choose_service_item{
		width:100%;
		height:120upx;
		line-height:120upx;
		text-align:center;
		color:#101d36;
		font-size:28upx;
		background-color:#f1f3f6;
		border-radius:12upx;
		will-change: transform;
		margin:auto 0;
		box-sizing:border-box;
		overflow:hidden;
	}

	/* 遮罩弹出 */
	#g-mask{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		z-index: 999;
	}
	.g-mask-box{
		width: 100%;
		height: 100%;
		background-color: #000000;
		opacity: 0.5;
	}
	.g-mask-content{
		width: 630upx;
		height: auto;
		background-color: #ffffff;
		border-radius: 10upx;
		margin: auto;
		z-index: 999;
		padding-bottom: 70upx;
		position: absolute;
		top: 20%;
		left: 0;
		right: 0;
	}
	.g-mask-center{
		width: 530upx;
		height: 100%;
		margin: 0 auto;
	}
	.g-mask-icon{
		width: 102upx;
		height: 129upx;
		display: block;
		margin: 0 auto;
		padding-top: 50upx;
	}
	.g-mask-title{
		display: block;
		text-align: center;
		color: #333333;
		font-size: 36upx;
		padding: 20upx 0 18upx 0;
		font-weight: bold;
	}
	.g-mask-text{
		display: block;
		height: auto;
		font-size: 28upx;
		color: #666666;
	}
	.g-mask-info{
		padding-top: 50upx;
		font-size: 24upx;
		color: #666666;
	}

	.s-orange{
		color: #ab7f2e;
	}
	.g-mask-btn{
		width: 530upx;
		height: 80upx;
		line-height: 80upx;
		color: #ffffff;
		font-size: 32upx;
		background-image: linear-gradient(-90deg,
		#fe8e0d 0%,
		#ff6f2e 100%),
		linear-gradient(
				#919191,
				#919191);
		background-blend-mode: normal,
		normal;
		border-radius: 40upx;
		text-align: center;
		margin: 39upx auto 0 auto;
	}
</style>
