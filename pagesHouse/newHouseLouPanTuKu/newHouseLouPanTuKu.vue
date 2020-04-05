<template>
	<view class="lou_pan_view">
		<view class="lou_pan_item" v-for="(item, index) in louPanList" :key="index">
			<view class="lou_pan_text">{{ item.text }} ({{ item.imgList.length }})</view>

			<view class="f_r_s lou_pan_cont">
				<view @click="lookMaxImg(item, key)" class="lou_pan_img" v-for="(url, key) in item.imgList" :key="key">
					<image :src="url" mode="aspectFill"></image>
				</view>
			</view>
		</view>

		<view @click="closeMaxImg" class="max_img_view" v-if="showMaxImg">
			<swiper class="max_img_swiper" :current="swiperCurrentIndex" @change="swiperChange">
				<block v-for="(item, index) in SwiperMaxImgList" :key="index">
					<swiper-item class="max_img_swiper_item f_c_c">
						<image class="max_img_url" mode="aspectFill" :src="item.imgUrl"></image>
					</swiper-item>
				</block>
			</swiper>

			<scroll-view scroll-x class="max_img_btn">
                <block v-for="(text, index) in maxImgBtnList" :key="index">
                    <view @click.stop="maxImgBtn(text)" :class="{ max_img_btn_active : maxImgActiveTypeText == text }"
                        class="max_img_btn_text">{{ text }}</view>
                </block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import { GetLouPanTuKuList } from "../../net/houseApi/GetLouPanTuKuList.js";

	class LouPanListItem {
		imgList = [];  // 图片数组  例：["url"]
		text = ""; // 对应的类型文案
	}

	class SwiperMaxImgItem {
		imgUrl = ""; // 图片路径
		text = "";  // 对应的类型文案
	}

	export default {
		data() {
			return {
				louPanList: [],
				buildId: "",
				showMaxImg: false,
				swiperCurrentIndex: 0,
				SwiperMaxImgList: [],
				maxImgBtnList: [],
				maxImgActiveTypeText: ""
			}
		},

        onShow() {
            new this.SetMetaInfo().initDefault();
        },

		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},

		onLoad(params) {
			if(params.buildId) {
				this.buildId = params.buildId;
			}
			this.initList();
		},

		methods: {
			initList() {
				if(!this.buildId) return;

				new GetLouPanTuKuList({buildId: this.buildId}).send()
					.then(res => {
						let list = res && res.DATA ? res.DATA.list : [];
						if(res.STATUS != 1) {
							this.failModel();
							return;
						}

						let louPanList = [];
						let SwiperMaxImgList = [];
						let maxImgBtnList = [];
						list.map((item) => {
							if(item.photoType) {
								let louPanItem = new LouPanListItem();
								louPanItem.text = item.photoType || "";
								louPanItem.imgList = [];
								if(!this.maxImgActiveTypeText) {
									this.maxImgActiveTypeText = item.photoType;
								}
								maxImgBtnList.push(item.photoType);
								(item.photoList || []).map((info) => {
									if (info.photoAddr) {
										let maxImgItem = new SwiperMaxImgItem();
										louPanItem.imgList.push(info.photoAddr || "");
										maxImgItem.imgUrl = info.photoAddr;
										maxImgItem.text = item.photoType;
										SwiperMaxImgList.push(maxImgItem);
									}
								});
								louPanList.push(louPanItem);
							}
						});
						this.louPanList = louPanList;
						this.SwiperMaxImgList = SwiperMaxImgList;
						this.maxImgBtnList = maxImgBtnList;
					})
					.catch(err => {
						this.failModel();
					});
			},

			failModel() {
				uni.showModal({
					title: '温馨提示',
					content: '获取楼盘图库失败啦！请稍后重试。',
					showCancel: false,
					confirmText: "我知道了",
					confirmColor: "#ab7f2e"
				});
			},

			swiperChange(e) {
				let current = e && e.detail ? e.detail.current || 0 : 0;
				let item = this.SwiperMaxImgList[current];
                // #ifndef MP-BAIDU
                this.maxImgActiveTypeText = item.text;
                // #endif
			},

			maxImgBtn(text) {
				this.maxImgActiveTypeText = text;
				this.swiperCurrentIndex = this.SwiperMaxImgList.findIndex((item, index) => {
					return item.text == text;
				});
			},

			lookMaxImg(info, key) {
				this.showMaxImg = true;
				let index = this.SwiperMaxImgList.findIndex((item, index) => {
					return item.text == info.text;
				});
				this.swiperCurrentIndex = index + key;
				this.maxImgActiveTypeText = info.text;
			},

			closeMaxImg() {
				this.showMaxImg = false;
			}
		}
	}
</script>

<style>
	.lou_pan_view{
		padding: 40upx 0 40upx 40upx;
		box-sizing: border-box;
		width: 100%;
	}
	.lou_pan_item{}
	.lou_pan_text{
		height:70upx;
		box-sizing:border-box;
		padding:12upx 0 28upx 0;
		font-size:30upx;
		line-height:30upx;
		color:rgb(51,51,51);
	}
	.lou_pan_cont{
		flex-wrap: wrap;
	}
	.lou_pan_img{
		width:33%;
		padding-right:30upx;
		padding-bottom:30upx;
		overflow:hidden;
		height:210upx;
		box-sizing:border-box;
		background:url(http://cdn.haofang.net/static/wxPlusApp/yjk/house/house_list_default.png?t=20190716) no-repeat center center;
		background-size:contain;
	}
	.lou_pan_img>image{
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
		background: #000000;
        overflow: hidden;
	}
	.max_img_swiper{
		position: fixed;
		top: 50%;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100%;
        transform: translateY(-50%);
	}
	.max_img_swiper_item{
		width: 100%;
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
        white-space: nowrap;
		background:#000;
	}
	.max_img_btn .max_img_btn_active{
		border-color:#1bc964;
		color:#1bc964;
	}
	.max_img_btn_text{
		padding:0 20upx;
		height:50upx;
		line-height:50upx;
		text-align:center;
		border:1px solid #000;
		border-radius:32upx;
		will-change: transform;
		color:#fff;
		font-size:30upx;
		margin:0 22upx;
        display: inline-block;
	}
</style>
