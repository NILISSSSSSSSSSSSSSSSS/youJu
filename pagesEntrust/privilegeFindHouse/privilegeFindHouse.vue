<template>
	<form report-submit @submit="formSubmit">
		<view>
			<image class="banner-top" src="https://zdzfapi.haofang.net/Public/wxApp/images/findHouse/banner.png" mode="aspectFill"></image>
			<view class="cont-wraper">
				<view class="cont-wraper-box">
					<button form-type="submit" hover-class="none" @click="findBtn('entrust', '3')" class="cont-box f_c_s">
						<image class="cont-img" src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/findHouse/entrust_btn_buyahouse.png"></image>
						<view class="cont-box-find-house">我要买房</view>
					</button>
					<button form-type="submit" hover-class="none" @click="findBtn('entrust', '4')" class="cont-box f_c_s">
						<image class="cont-img" src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/findHouse/entrust_btn_rentingahouse.png"></image>
						<view class="cont-box-find-house">我要租房</view>
					</button>
					<button form-type="submit" hover-class="none" @click="findBtn('registration', '1')" class="cont-box f_c_s">
						<image class="cont-img" src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/findHouse/entrust_btn_sellinghouse.png"></image>
						<view class="cont-box-find-house">我要卖房</view>
						<!-- <view class="have_jiang"></view> -->
					</button>
					<button form-type="submit" hover-class="none" @click="findBtn('registration', '2')" class="cont-box f_c_s">
						<image class="cont-img" src="http://cdn.haofang.net/static/uuminiapp/pageNewUi/findHouse/entrust_btn_rent.png"></image>
						<view class="cont-box-find-house">我要出租</view>
					</button>
				</view>
			</view>
		</view>
	</form>
</template>

<script>
	import { GpsInfoModel } from "@/model/GpsInfoModel.js";
    import { Notification } from "@/utils/Notification.js";
    import { Notify } from "@/utils/Notify.js";

	export default {
		data() {
			return {
				animationData1: null,
                animationData2: null,
                animationData3: null,
                animationData4: null,
			};
		},

        onShow() {
            new this.SetMetaInfo().initDefault();
        },

		onShareAppMessage() {
			return new this.ShareAppMessage().init();
		},

		onLoad() {
			new this.InitFormSubmit(this);
		},

        methods: {
            createAnimation() {
                setTimeout(() => {
                    let animation1 = uni.createAnimation({
                        transformOrigin: "50% 50%",
                        duration: 200,
                        timingFunction: "ease",
                        delay: 0
                    });
                    animation1.scale3d(0.9, 0.9, 0.9).step();
                    animation1.scale3d(1.1, 1.1, 1.1).step();
                    animation1.scale3d(0.9, 0.9, 0.9).step();
                    animation1.scale3d(1.03, 1.03, 1.03).step();
                    animation1.scale3d(.97, .97, .97).step();
                    animation1.scale3d(1, 1, 1).step();
                    this.animationData1 = animation1.export();
                }, 0);
                setTimeout(() => {
                    let animation2 = uni.createAnimation({
                        transformOrigin: "50% 50%",
                        duration: 200,
                        timingFunction: "ease",
                        delay: 0
                    });
                    animation2.scale3d(0.9, 0.9, 0.9).step();
                    animation2.scale3d(1.1, 1.1, 1.1).step();
                    animation2.scale3d(0.9, 0.9, 0.9).step();
                    animation2.scale3d(1.03, 1.03, 1.03).step();
                    animation2.scale3d(.97, .97, .97).step();
                    animation2.scale3d(1, 1, 1).step();
                    this.animationData2 = animation2.export();
                }, 100);
                setTimeout(() => {
                    let animation3 = uni.createAnimation({
                        transformOrigin: "50% 50%",
                        duration: 200,
                        timingFunction: "ease",
                        delay: 0
                    });
                    animation3.scale3d(0.9, 0.9, 0.9).step();
                    animation3.scale3d(1.1, 1.1, 1.1).step();
                    animation3.scale3d(0.9, 0.9, 0.9).step();
                    animation3.scale3d(1.03, 1.03, 1.03).step();
                    animation3.scale3d(.97, .97, .97).step();
                    animation3.scale3d(1, 1, 1).step();
                    this.animationData3 = animation3.export();
                }, 200);
                setTimeout(() => {
                    let animation4 = uni.createAnimation({
                        transformOrigin: "50% 50%",
                        duration: 100,
                        timingFunction: "ease",
                        delay: 0
                    });
                    animation4.scale3d(0.9, 0.9, 0.9).step();
                    animation4.scale3d(1.1, 1.1, 1.1).step();
                    animation4.scale3d(0.9, 0.9, 0.9).step();
                    animation4.scale3d(1.03, 1.03, 1.03).step();
                    animation4.scale3d(.97, .97, .97).step();
                    animation4.scale3d(1, 1, 1).step();
                    this.animationData4 = animation4.export();
                }, 300);
            },

        	findBtn(page, casetype) {
				let gpsInfo = new GpsInfoModel().getModel("gpsInfo") || {};
				let cityInfo = new GpsInfoModel().getModel("cityInfo") || {};
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

                if(!page) {
                    throw new Error("请配置跳转的页面名称");
                }

                let url = "/pagesEntrust/"+page+"/"+page;
                if(casetype) {
                    url = url + "?casetype=" + casetype;
                }
                uni.navigateTo({
                    url: url
                });
        	}
        },
	}
</script>

<style>
    page{
        width: 100%;
        height: 100%;
    }
    .banner-top{
        position: relative;
        display: block;
        width: 100%;
        height: 362upx;

    }
    .cont-wraper {
        position: relative;
        width:100%;
        height: 688upx;
        margin: 0 auto;
        background-size: 100% 100%;
    }
    .cont-wraper-box{
        position: relative;
        width: 100%;
        height: 100%;
        display:flex;
        flex-wrap:wrap;
        padding: 0 30upx;
        box-sizing: border-box;
    }
    .cont-box{
        position:relative;
        flex-shrink:0;
        width:50%;
        height:340upx;
        color:#666666;
        font-size:30upx;
        text-align:center;
        box-sizing:border-box;
    }
    .cont-img{
        margin: 70upx auto 20upx;
		width: 128upx;
		height: 128upx;
        flex-shrink: 0;
    }

    .sale-box {
		height:64px;
		width:64px;
		background-position:-254px 0;
    }
    .lease-box{
		height:64px;
		width:64px;
		background-position:-190px 0;
	}
    .buy-box{
		height:64px;
		width:64px;
		background-position:-126px 0;
	}
    .rent-box{
		height:64px;
		width:64px;
		background-position:-62px 0;
	}

    /*有奖委托图标*/
    .have_jiang{
        margin: 10upx auto 0;
		background:url(http://cdn.haofang.net/static/uuminiapp/pageNewUi/entrust_choose_sprites.png)  no-repeat;
		background-size:318px 64px;
		height:15px;
		width:62px;
		background-position:0 0;
    }

    .cont-box-find-house {
        color: #101d36;
        font-size: 30upx;
    }
</style>
