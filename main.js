import Vue from 'vue';
import App from './App';
import { InitFormSubmit, CheckIsIphoneX, SetMetaInfo, ShareAppMessage } from "./utils/common.js";
import { UserBehavior, HouseDetailParamsItem } from "./utils/UserBehavior.js";
import { PlatformUserBehavior } from "./utils/PlatformUserBehavior.js";
import getUserInfoView from './components/getUserInfoView.vue';
import loginView from './components/loginView.vue';
import houseListNoDataTrust from "./components/houseListNoDataTrust.vue";
import houseDetailLoading from "./components/houseDetailLoading.vue";
import scrollLoading from "./components/scrollLoading.vue";
import loadingData from "./components/loadingData.vue";
import { DifferenceApi } from "./utils/DifferenceApi.js";
import { SetH5BrowerTitle } from "./utils/SetH5BrowerTitle.js";
import { ImChart } from "./utils/ImChart.js";
import { Const } from './utils/Const.js';
import { Config } from './utils/config.js';
import collectFormId from "./components/collectFormId.vue";
import newMsgView from "./components/newMsgView.vue";
import showModal from "./components/common/showModal.vue";

Vue.component("get-user-info",getUserInfoView);
Vue.component("no-data-trust",houseListNoDataTrust);
Vue.component("houseDetailLoading",houseDetailLoading);
Vue.component("newMsgView",newMsgView);
Vue.component("scrollLoading", scrollLoading);
Vue.component("loadingData", loadingData);
Vue.component("loginView", loginView);
Vue.component("collectFormId", collectFormId);
Vue.component("showModal", showModal);

Vue.config.productionTip = false;

App.mpType = 'app';

// 全局绑定formid
Vue.prototype.InitFormSubmit = InitFormSubmit;

// 全局判断是否是iphone x
Vue.prototype.CheckIsIphoneX = CheckIsIphoneX;

// 用户行为统计
Vue.prototype.UserBehavior = UserBehavior;

// 平台用户行为统计
Vue.prototype.PlatformUserBehavior = PlatformUserBehavior;

// 用户房源统计 进入房源的类型
Vue.prototype.HouseDetailParamsItem = HouseDetailParamsItem;

// 差异性的接口api方法重定义
Vue.prototype.DifferenceApi = new DifferenceApi();

// h5隐藏title并动态设置浏览器title
Vue.prototype.SetH5BrowerTitle = SetH5BrowerTitle;

// 全局im聊天方法
Vue.prototype.ImChart = ImChart;

// 百度引流
Vue.prototype.SetMetaInfo = SetMetaInfo;

// 分享
Vue.prototype.ShareAppMessage = ShareAppMessage;

// 常量
Vue.prototype.Const = Const;

// 环境配置
Vue.prototype.Config = Config;


// 判断是否是pc
// #ifdef APP-PLUS-NVUE
import QRCode from 'qrcode' // 二维码生成器
class Browser {
	static noUseViewNodeId = "no_use_view";
	
	static init() {
		let that = this;
		window.addEventListener('resize', function() {
			window.location.reload();
			change();
		}, false);
		
		function change() {
			that.removeHtmlOverFlowHidden();
			that.removeView();

			if (!(navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
				that.setHtmlOverFlowHidden();
				that.appendView();
				return;
			}
		}
		window.onload = function () {
			change();
		}
	}
 
	static getHref() {
		let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		let url = window.location.href.indexOf('?') >= 0 ? window.location.href.split("?")[0] : window.location.href;
		for (let i = 0; i < hashes.length; i++) {
			let hash = hashes[i].split('=');
			let method = "?";
			if(i > 0) {
				method = "&";
			}
			url = url + method + hash[0] + "=" + decodeURI(hash[1]);
		}
		return url;
	}
 
	static appendView() {
		let body = document.body;
		let view = document.createElement("div");
		view.id = this.noUseViewNodeId;
		view.style.position = "fixed";
		view.style.zIndex = "99999999999";
		view.style.background = "#ffffff";
		view.style.left = 0;
		view.style.bottom = 0;
		view.style.right = 0;
		view.style.top = 0;
		view.style.display = "flex";
		view.style.flexDirection = "column";
		view.style.justifyContent = "center";
		body.appendChild(view);


		let canvasView = document.createElement("canvas");
		canvasView.id = "pc_tip_canvas";
		canvasView.style.height = "200px";
		canvasView.style.width = "200px";
		canvasView.style.marginLeft = "auto";
		canvasView.style.marginRight = "auto";
		canvasView.style.marginBottom = "20px";
		view.appendChild(canvasView);
		
		let href = this.getHref();
		let canvasNodeInfo = document.getElementById('pc_tip_canvas');
		QRCode.toCanvas(canvasNodeInfo,href, function (error) {});
		
		
		let oneView = document.createElement("p");
		oneView.innerHTML = "请使用手机浏览器，扫描上方二维码预览。";
		oneView.style.textAlign = "center";
		oneView.style.fontSize = "16px";
		oneView.style.marginBottom = "10px";
		view.appendChild(oneView);

		
		let twoView = document.createElement("p");
		twoView.innerHTML = "PC浏览器，请打开控制台并切换至手机模式后并再次刷新浏览。";
		twoView.style.textAlign = "center";
		twoView.style.fontSize = "16px";
		view.appendChild(twoView);
	}
 
	static removeView() {
		let noUseView = document.getElementById(this.noUseViewNodeId);
		if (noUseView != null) {
			noUseView.parentNode.removeChild(noUseView);
		}
	}

	static setHtmlOverFlowHidden() {
		let body = document.body;
		body.style.overflow = "hidden";
	}
	
	static removeHtmlOverFlowHidden() {
		let body = document.body;
		body.style.overflow = "visible";
	}
}
Browser.init();
// #endif


const app = new Vue({
    ...App
});
app.$mount();
