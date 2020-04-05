<template>
	<view class="web_view">
	    <web-view v-if="src" :webview-styles="webviewStyles"
				  @message="onWebMessage"
			class="web" :src="src"></web-view>
	</view>
</template>

<script>
    import { UserInfoModel } from "@/model/UserInfoModel.js";
    let privateData = {
    	pageScrollTimeOutVal: null,
    	imgList: [],
    	caseId: "",
    	cityId: "",
    	caseType: "",
    	reSource: ""
    };

	export default {
		data() {
			return {
				webviewStyles: {
				    progress: {
				        color: '#ff5a1f'
				    }
				},
                src: "",
                messageId: "",
                name: "",
                isShield: "",
                userId: "",
                openId: ""
			}
		},

        onLoad(params) {
            this.params = params;
            for(let key in params) {
                if(params[key]) {
                    this[key] = params[key];
                }
            }
            let privateKeys = ["caseId", "cityId", "caseType", "reSource"];
            privateKeys.map((key) => {
            	privateData[key] = params[key] || "";
            });
        },

        onShow() {
            new this.SetMetaInfo().initDefault();
            this.src = "";
            let fromType = "";
            // #ifdef MP-ALIPAY
            fromType = "alipay";
            // #endif
            // #ifdef MP-BAIDU
            fromType = "baidu";
            // #endif
//             this.src = ("http://cd.wjc.net/uuIndex.html?t=1554887036#/pagesTool/messageDetail/messageDetail")
//                + "?userId=" + this.userId+ "&openId=" + this.openId
//                + "&messageId=" + this.messageId + "&name=" + this.name
//                + "&caseId=" + privateData.caseId + "&cityId=" + privateData.cityId
//                + "&caseType=" + privateData.caseType + "&reSource=" + privateData.reSource
//                + "&isShield=" + this.isShield + "&fromType=" + fromType;


            this.src = ("http://uuweb.hftsoft.com/uuAppIndex.html?t=1554887036#/pages/messageDetail/messageDetail")
                + "?userId=" + this.userId+ "&openId=" + this.openId
                + "&messageId=" + this.messageId
                // + "&name=" + this.name
                + "&caseId=" + privateData.caseId + "&cityId=" + privateData.cityId
                + "&caseType=" + privateData.caseType + "&reSource=" + privateData.reSource
                + "&isShield=" + this.isShield + "&fromType=" + fromType;
            console.error(this.src);


            // this.src = ("https://zdzfapi.haofang.net/uuIndex.html?t=1554887036#/pagesTool/messageDetail/messageDetail")
            //   + "?userId=" + this.userId+ "&openId=" + this.openId
            //   + "&messageId=" + this.messageId
            //     // + "&name=" + this.name
            //   + "&caseId=" + privateData.caseId + "&cityId=" + privateData.cityId
            //   + "&caseType=" + privateData.caseType + "&reSource=" + privateData.reSource
            //   + "&isShield=" + this.isShield + "&fromType=" + fromType;

            // this.src = "https://zdzfapi.haofang.net/B/Home/Exam/index?archiveId=558818";

            // this.src = "https://cdn.haofang.net/tmp/textIndex.html";

            // this.src = ("https://cdn.haofang.net/uuIndex.html#/pagesTool/messageDetail/messageDetail")
            //   + "?userId=" + this.userId+ "&openId=" + this.openId
            //   + "&messageId=" + this.messageId + "&name=" + this.name
            //   + "&caseId=" + privateData.caseId + "&cityId=" + privateData.cityId
            //   + "&caseType=" + privateData.caseType + "&reSource=" + privateData.reSource
            //   + "&isShield=" + this.isShield + "&fromType=" + fromType;

			let time = 1500;
			// #ifdef APP-PLUS || APP-PLUS-NVUE
            time = 2500;
			// #endif
            setTimeout(() => {
                // #ifdef MP-ALIPAY
                my.setNavigationBar({
                  title: (this.name || "")
                });
                // #endif

                // #ifndef MP-ALIPAY
                uni.setNavigationBarTitle({
                    title: (this.name || "")
                });
                // #endif
            }, time);

            // let webview = plus.webview.create(this.src,
			// 	'test',
			// 	{
			// 	    'titleNView':{
			// 	    	'backgroundColor':'#ffffff',
			// 			'titleText': this.name,
			// 			'titleColor':'#000000',
			// 			// autoBackButton:true
			// 	    }
			// 	}
			// );
            // webview.addEventListener('close', function(){
            //     webview=null;
            // });
            // webview.addEventListener('titleUpdate', function(){
            //     webview.show();
            // });
        },

		methods: {
            onWebMessage(e) {
                console.error(JSON.stringify(e));
			}
		}
	}
</script>

<style>
    .web_view{
        background: #FFFFFF;
    }
    .web{
        background: #FFFFFF;
    }
    ::-webkit-scrollbar-track-piece {
        background-color:#F2F2F2;
    }
    ::-webkit-scrollbar {
        width:0px;
    }
    ::-webkit-scrollbar-thumb {
        background-color:#F2F2F2;
        background-clip:padding-box;
    }
    ::-webkit-scrollbar-thumb:hover {
        background-color:#F2F2F2;
    }
</style>
