<template>
	<view>
		<view class="f_r_s room_btn_scroll">
			<block v-for="(room,index) in huXingBtnList" :key="index">
				<view :class="{ room_btn_active : room == clickRoom }"
					@click="roomBtn(room)"
					class="room_btn_item">{{ room == 1000 ? '全部' : room + '居' }}({{ huXingListMap[room].length }})</view>
			</block>
		</view>

		<view class="room_cont">
			<block v-for="(item,index) in huXingListMap[clickRoom]" :key="index">
				<view @click="lookMaxImg(item)" class="room_cont_item">
					<view v-if="item.status == 1" class="wait_house">待售</view>
					<view v-if="item.status == 2" class="selling_house">在售</view>
					<view v-if="item.status == 3" class="soldOut_house">售罄</view>

					<view class="f_r_s room_cont_des">
						<view>{{ item.shiNum }}室</view>
						<view>{{ item.area }}㎡</view>
						<view :class="{main_color : item.price, gray_color : !item.price}">{{ item.price ? item.price + "万起" : "价格待定" }}</view>
					</view>

					<view class="room_cont_img">
						<image :src="item.imgUrl" mode="aspectFill"></image>
					</view>
				</view>
			</block>
		</view>

		<view @click="closeMaxImg" class="max_img_view" v-if="showMaxImg">
			<swiper style="100%;" class="max_img_swiper" :current="swiperCurrentIndex" @change="swiperChange">
				<block v-for="(item, index) in SwiperMaxImgList" :key="index">
					<swiper-item class="max_img_swiper_item f_c_c">
						<image class="max_img_url" mode="aspectFill" :src="item.imgUrl"></image>

                        <!-- #ifndef MP-ALIPAY -->
                        <view class="max_img_des">{{ item.status == 1 ? '待售' : item.status == 2 ? '在售' : '售罄' }} {{ item.shiNum }}室{{ item.area }}㎡ {{ item.price }}</view>
                        <!-- #endif -->
					</swiper-item>
				</block>
			</swiper>

            <!-- #ifdef MP-ALIPAY -->
            <view class="max_img_des" v-if="currentItem.shiNum">{{ currentItem.status == 1 ? '待售' : currentItem.status == 2 ? '在售' : '售罄' }} {{ currentItem.shiNum }}室{{ currentItem.area }}㎡ {{ currentItem.price }}</view>
            <!-- #endif -->

			<view class="max_img_btn f_r_e">
				<view @click="fangDaiBtn" class="max_img_btn_text">房贷计算</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { GetHuXingList } from "../../net/houseApi/GetHuXingList.js";

	class HuXIngListItem {
		imgUrl = "";  // 户型图
		status = "";  // 类型  1：待售， 2： 在售， 3： 售罄
		shiNum = "";  // 几室
		area = "";  // 面积
		price = "";
	}

	// 全部 使用 1000 居室
	export default {
		data() {
			return {
				huXingListMap: {},
				clickRoom: "",
				buildId: "",
				huXingBtnList: [],
				showMaxImg: false,
				swiperCurrentIndex: 0,
				SwiperMaxImgList: [],
                currentItem: {}
			}
		},

		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},

		onLoad(params) {
			if(params.buildId) {
				this.buildId = params.buildId;
			}
			this.initData();
		},

        onShow() {
            new this.SetMetaInfo().initDefault();
        },

		methods: {
			initData() {
				if(!this.buildId) return;

				new GetHuXingList({buildId: this.buildId}).send()
					.then(res => {
						if(res.STATUS != 1) {
							this.failModel();
							return;
						}

						let list = res && res.DATA ? res.DATA.list || [] : [];
						let huXingListMap = {};
						let huXingBtnList = [];
						let SwiperMaxImgList = [];
						list.map((item) => {
							if(item.layoutPic1 && item.layoutStatus && item.rooms) {
								let roomItem = new HuXIngListItem();
								roomItem.imgUrl = item.layoutPic1;
								roomItem.status = item.layoutStatus;
								roomItem.shiNum = item.rooms;
								roomItem.area = item.buildArea;
								roomItem.price = item.price && item.price.indexOf("价格") < 0 ? parseInt(item.price) : "";
								SwiperMaxImgList.push(roomItem);
								if(!huXingListMap[item.rooms]) {
									huXingListMap[item.rooms] = [];
									huXingBtnList.push(Number(item.rooms));
								}
								huXingListMap[item.rooms].push(roomItem);
							}
						});
						huXingListMap[1000] = SwiperMaxImgList;
						huXingBtnList.push(1000);
						huXingBtnList.sort((a,b)=>{return b-a;});
						this.clickRoom = 1000;
						this.SwiperMaxImgList = SwiperMaxImgList;
						this.huXingListMap = huXingListMap;
						this.huXingBtnList = huXingBtnList;
                        this.currentItem = SwiperMaxImgList[0];
					})
					.catch(err => {
						this.failModel();
					});
			},

			failModel() {
				uni.showModal({
					title: '温馨提示',
					content: '获取户型介绍失败啦！请稍后重试。',
					showCancel: false,
					confirmText: "我知道了",
					confirmColor: "#ab7f2e"
				});
			},

			roomBtn(room) {
				this.clickRoom = room;
			},

			lookMaxImg(item) {
				this.showMaxImg = true;
				let swiperCurrentIndex = 0;
				this.SwiperMaxImgList.map((info,index) => {
					let isAllNeed = true;
					for(let key in info) {
						if(info[key] != item[key]) {
							isAllNeed = false;
						}
					}
					if(isAllNeed) {
						swiperCurrentIndex = index;
					}
				});
				this.swiperCurrentIndex = swiperCurrentIndex;
			},

			closeMaxImg() {
				this.showMaxImg = false;
			},

			fangDaiBtn() {
				let item = this.SwiperMaxImgList[this.swiperCurrentIndex] || {};
				let price = item.price ? parseInt(item.price) : 0;
				let url = "/pagesTool/calculatorFangDai/calculatorFangDai";
				if(price) {
					url += "?price=" + price;
				}
				uni.navigateTo({
					url: url
				});
			},

			swiperChange(e) {
				let current = e && e.detail ? e.detail.current : 0;
				this.swiperCurrentIndex = current;
                this.currentItem = this.SwiperMaxImgList.length > 0 ? this.SwiperMaxImgList[current] : {};
			}
		},
	}
</script>

<style>
	page{
		background: #f2f2f2;
	}
	.room_btn_scroll{
		background: #FFFFFF;
		overflow-x: auto;
		border-bottom:1px solid #F5F5F5;
		white-space:nowrap;
		box-sizing: border-box;
	}
	.room_btn_scroll .room_btn_active{
		color:#ab7f2e;
		border-color:#ab7f2e;
	}
	.room_btn_item{
		height:96upx;
		line-height:96upx;
		text-align:center;
		font-size:31upx;
		color:#101D36;
		border-bottom:2upx solid #ffffff;
		padding:0 10upx;
		margin: 0 30upx;
		flex-shrink: 0;
		box-sizing: border-box;
	}
	.room_cont{
		padding-top: 20upx;
	}
	.room_cont_item{
		margin-bottom: 20upx;
		background: #FFFFFF;
	}
	.wait_house{
		color:#4daaf0;
		height:80upx;
		line-height:80upx;
		border-top:1px solid #F5F5F5;
		border-bottom:1px solid #F5F5F5;
		font-size:32upx;
		padding-left:40upx;
		box-sizing: border-box;
	}
	.selling_house{
		color:#1bc964;
		height:80upx;
		line-height:80upx;
		border-top:1px solid #F5F5F5;
		border-bottom:1px solid #F5F5F5;
		font-size:32upx;
		padding-left:40upx;
		box-sizing: border-box;
	}
	.soldOut_house{
		color:#808080;
		height:80upx;
		line-height:80upx;
		border-top:1px solid #F5F5F5;
		border-bottom:1px solid #F5F5F5;
		font-size:32upx;
		padding-left:40upx;
		box-sizing: border-box;
	}
	.room_cont_des{
		font-size:28upx;
		color:#101D36;
		padding-top:30upx;
		padding-left: 40upx;
		box-sizing: border-box;
	}
	.room_cont_des>view{
        margin: auto 30upx auto 0;
	}
	.room_cont_img{
		padding: 40upx;
		box-sizing: border-box;
		height: 480upx;
		border-bottom: 1upx solid #F5F5F5;
		background:url(http://cdn.haofang.net/static/wxPlusApp/yjk/house/house_list_default.png) no-repeat center center;
		background-size:80%;
		background-color:#FFFFFF;
	}
	.room_cont_img image{
		width: 100%;
		height: 100%;
	}

	/* 查看大图 */
	.max_img_view{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
        overflow: hidden;
		background: #000000;
	}
	.max_img_swiper{
		position: fixed;
		top: 50%;
        transform: translateY(-50%);
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
	}
	.max_img_swiper_item{
		width: 100%;
		/* position: relative; */
	}
	.max_img_des{
		color:#fff;
		font-size:26upx;
		background:#000000;
		border:1px solid #ffffff;
		padding:9upx 12upx;
		border-radius:6upx;
		will-change: transform;
		line-height:1;
		position:absolute;
		bottom:152upx;
		left:32upx;
	}
	.max_img_url{
		width: 100%;
	}
	.max_img_btn{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height:120upx;
		border-top:1px solid #2e2e2e;
		background:#191919;
		padding-right: 40upx;
		box-sizing: border-box;
	}
	.max_img_btn_text{
		width:210upx;
		height:64upx;
		line-height:64upx;
		text-align:center;
		border:1px solid #fefefe;
		border-radius:32upx;
		will-change: transform;
		color:#fefefe;
		font-size:32upx;
		margin:auto 0;
	}
</style>
