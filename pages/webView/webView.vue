<template>
	<view class="web_view">
		<web-view class="web" :webview-styles="webviewStyles" :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#ff5a1f'
					}
				},
				src: ""
			}
		},

		onShow() {
			new this.SetMetaInfo().initDefault();
		},

		onLoad(query) {
			if (query.url && query.type != "escape") {
				let src = "https://" + query.url;
				if (query.type === "urlParams") {
					let jsonParam = JSON.parse(decodeURIComponent(query.url));
					let index = 0;
					src = jsonParam.url;
					for (let k in jsonParam) {
						if (k === "url") continue;

						if (index === 0) {
							src += "?" + k + "=" + jsonParam[k];
						} else {
							src += "&" + k + "=" + jsonParam[k];
						}
						index++;
					}
				}
				
				// #ifdef MP-ALIPAY || MP-BAIDU || MP-TOUTIAO
				if (query.url.indexOf("zdzfapi.haofang.net/Mini/Html/aboutUs") >= 0) {
					// #ifdef MP-BAIDU
					src = "https://" + query.url + "?fromType=baidu";
					// #endif
					// #ifdef MP-ALIPAY
					src = "https://" + query.url + "?fromType=alipay";
					// #endif
				}
				// #endif
				
				if (query.type == 'active') {
					// #ifdef MP-ALIPAY
					src = "http://" + query.url + "?fromType=alipay";
					// #endif
					// #ifdef MP-BAIDU
					src = "http://" + query.url + "?fromType=baidu";
					// #endif
				}

				console.error(src);
				this.src = src;
			}
			if (query.url && query.type == "escape") {
				this.src = unescape(query.url);
			}
			uni.setNavigationBarTitle({
				title: query.title || "悠居客"
			});
			uni.setNavigationBarColor({
				frontColor: query.color || "#000000",
				backgroundColor: query.bgColor || "#ffffff",
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			});
		}
	}
</script>

<style>
	.web_view {
		background: #FFFFFF;
		width: 100%;
		height: 100%;
	}

	.web {
		background: #FFFFFF;
		width: 100%;
		height: 100%;
	}
</style>
