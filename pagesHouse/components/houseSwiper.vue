<template>
	<form report-submit @submit="formSubmit">
		<view class="swiper_view">
			<swiper @change="swiperChange" class="swiper_box" :current="swiperIndex">
                <block v-for="(item, index) of list" :key="index">
                    <swiper-item class="swiper_item">
                    	<button hover-class="none" form-type="submit" @click.stop="swiperDetailBtn(item)" class="swiper_cont">
							<image mode="aspectFill" class="swiper_img" :src="item.url"></image>

                            <view v-if="item.type === 'vr'" class="vr_icon f_c_c">
                            	<image class="vr_img_view" mode="aspectFill" src="https://zdzfapi.haofang.net/Public/wxApp/images/detail/720/1.png"></image>
                            </view>

                            <view v-if="item.type === 'video'" class="video_icon"></view>
                    	</button>
                    </swiper-item>
                </block>
			</swiper>

			<view class="swiper_btn_view f_r_b">
                <view form-type="submit" @click="swiperBtn('vr')" v-if="hasVr"
					  class="swiper_btn_item"
                	:class="{active: currenClickType == 'vr'}">720°</view>
                <view form-type="submit" @click="swiperBtn('video')" v-if="hasVideo"
					  class="swiper_btn_item"
                	:class="{active: currenClickType == 'video'}">视频</view>
                <view form-type="submit" @click="swiperBtn('img')" v-if="hasImg"
					  class="swiper_btn_item"
                    :class="{active: currenClickType == 'img'}">图片</view>
			</view>

			<view v-if="playVideoIng" class="video_fixed f_c_c">
				<video :style="{height: windowHeight}" class="myVideo_swiper" id="myVideo" :src="videoSrc" autoplay></video>
				<view form-type="submit" @click="closeVideo" class="close_video"></view>
			</view>

			<view v-if="swiperIndex - otherNum >= 0 && imgNum > 0"
				class="page_view">{{ swiperIndex - otherNum + 1 }}/{{ imgNum }}</view>
		</view>
	</form>
</template>

<script>
    export class HouseSwiperItem {
        url = "";
        type = ""; // vr video img
        sourceUrl = "";  // 资源路径
        name = ""; // 房源名字
    }

	export default {
		data() {
			return {
				swiperIndex: 0,
                hasVr: false,
                hasVideo: false,
                hasImg: false,

                playVideoIng: false,
                currenClickType: "",

                videoValue: null,
                videoSrc: "",

                windowHeight: "40%",
                imgNum: 10,
                otherNum: 1
			};
		},

        props: {
            list: {
                type: Array,
                default: []
            },
			height: {
				type: String,
				default: "480upx"
			}
        },

        watch: {
        	list(newValue, oldValue) {
        		this.upBtn();
        	}
        },

        mounted() {
        	this.upBtn();
            let res = uni.getSystemInfoSync();
            this.windowHeight = res.windowWidth + "px";
			new this.InitFormSubmit(this);
        },

        methods: {
        	swiperChange(e) {
                if(e.detail.source) {
                    this.swiperIndex = e.detail.current;
                    this.currenClickType = this.list[e.detail.current].type;
                }
        	},
            upBtn() {
                this.hasVr = false;
                this.hasVideo = false;
                this.hasImg = false;
                let imgNum = 0;
                let otherNum = 0;
                this.list.map((val,index) => {
                    if(index === 0) {
                       this.currenClickType = val.type;
                    }
                    // #ifndef MP-ALIPAY
                    if(val.type === "vr") {
                       this.hasVr = true;
                       otherNum++;
                    }
                    if(val.type === "video") {
                        otherNum++;
                       this.hasVideo = true;
                       this.videoValue = uni.createVideoContext('myVideo');
                       this.videoSrc = val.sourceUrl;
                    }
                    // #endif
                    if(val.type === "img") {
                       this.hasImg = true;
                       imgNum++;
                    }
                });
                this.imgNum = imgNum;
                this.otherNum = otherNum;
                if(this.hasVideo) {
                    this.currenClickType = "video";
                }
                if(this.hasVr) {
                    this.currenClickType = "vr";
                }
                if(!this.hasVideo && !this.hasVr) {
                    this.hasImg = false;
                }
            },
            swiperBtn(type) {
                this.currenClickType = type;
                for(let i = 0;i<this.list.length;i++) {
                   if(this.list[i].type === type) {
                       this.swiperIndex = i;
                       break;
                   }
                }
            },
            swiperDetailBtn(item) {
                if(item.type === "img") {
					this.PlatformUserBehavior.lookHousePhoto();
					let urls = [];
					for(let imgInfo of this.list) {
						if(imgInfo.type !== "img") continue;

						urls.push(imgInfo.url);
					}
					uni.previewImage({
						current: item.url,
						urls: urls
					});
					return;
				}

                if(item.type === "vr") {
                    this.PlatformUserBehavior.lookVr();
                    uni.navigateTo({
                        url: "/pages/webView/webView?url="+escape(item.sourceUrl)+"&title="+item.name+"VR展示"
                        + "&type=escape"
                    });
                    return;
                }

                if(item.type === "video") {
                    this.playVideoIng = true;
                }
            },

            closeVideo() {
               this.playVideoIng = false;
               this.videoValue.pause();
            }
        },
	}
</script>

<style scoped>
    .swiper_view{
        position:relative;
        width:100%;
		height: 578upx;
        background:url(http://cdn.haofang.net/static/wxPlusApp/yjk/house/house_detail_default.png) no-repeat center center;
        background-size:60%;
        background-color:#F7F7F9;
    }
    .swiper_box,.swiper_item,.swiper_cont,.swiper_img{
        width: 100%;
        height: 100%;
    }
    button.swiper_cont{
        border-radius: 0;
		will-change: transform;
        position: relative;
    }
    button.swiper_cont::after{
        border-radius: 0;
		will-change: transform;
    }
    .swiper_btn_view{
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
        bottom: 20upx;
        z-index: 20;
    }
    .swiper_btn_view .swiper_btn_item{
        width:80upx;
        height:40upx;
        line-height:40upx;
        border-radius:20upx;
		will-change: transform;
        font-size:22upx;
        text-align:center;
        color:#666;
        background:rgba(255,255,255,0.8);
        margin-right: 15upx;
    }
    .swiper_btn_view .active{
        background-color: #ffd900;
        color: #101d37;
        background-image: none;
    }

    .vr_icon{
        position:absolute;
        width:116upx;
        height:116upx;
        border-radius:100%;
		will-change: transform;
        background:rgba(0,0,0,0.35);
        top:50%;
        left:50%;
        margin-top:-58upx;
        margin-left:-58upx;
        z-index:20;
    }
    .vr_img_view{
        width:100upx;
        height:64upx;
        margin: auto;
        flex-shrink: 0;
    }
    .video_icon{
        position:absolute;
        left:0;
        right:0;
        top:0;
        bottom:0;
        margin:auto;
        width:116upx;
        height:116upx;
        background:url(http://cdn.haofang.net/static/uuminiapp/index/video_icon.png) no-repeat;
        background-size:100% 100%;
    }

     /* 视频播放 */
    .video_fixed{
        position: fixed;
        width:100%;
        height:100%;
        left: 0;
        top: 0;
        background:#000;
        z-index:50000;
    }
    .video_fixed video{
        width: 100%;
    }
    .close_video{
        position:absolute;
        left:0;
        right:0;
        margin:auto;
        bottom:120upx;
        width:70upx;
        height:70upx;
        background:url(http://cdn.haofang.net/static/uuminiapp/detail/close-viedo.png) no-repeat;
        background-size:100%;
    }
    .myVideo_swiper{
        width: 100%;
        margin: auto 0;
    }
    .page_view{
        position:absolute;
        bottom:18upx;
        right:40upx;
        display:flex;
        padding:8upx 20upx;
		box-sizing: border-box;
        border-radius:18upx;
		will-change: transform;
        color:#fff;
        text-align:center;
        font-size:22upx;
        justify-content:center;
        align-items:center;
        z-index:100;
        background:rgba(0,0,0,.7);
    }
</style>
