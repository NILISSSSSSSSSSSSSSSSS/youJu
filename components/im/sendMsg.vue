<template>
	<view class="send_msg_cont">
		<view class="send_msg f_r_b">
			<view class="send_msg_left f_r_s">
			<!-- 	<image @click.top="changeOftenUseType" :class="oftenUseMap[oftenUseBtnShow].className"
					class="send_often_btn" 
					mode="aspectFit" :src="oftenUseMap[oftenUseBtnShow].src"></image> -->
				<view class="m-common-language" @click.top="changeOftenUseType" >
					常用语
				</view>
				 <!-- @confirm="sendTextBtn" 手机键盘确认键 -->
				<input @click="sendNewMsgClick" class="send_input f_r_s" placeholder="请输入聊天内容"
					@input="sendTextInput" @focus="sendTextFocus" 
					confirm-type="发送" confirm-hold="true"
					:value="inputText" placeholder-class="send_input_pl"  fixed="true" />
			</view>
			
			<view class="send_msg_right f_r_e">
				<image style="position: relative;" 
				@click="changeEmojiType" mode="aspectFit" :class="emojiMap[emojiBtnShow].className" 
					:src="emojiMap[emojiBtnShow].src"></image>
				
				<image v-if="!inputText" class="send_more_type" mode="aspectFit" @click="lookMoreSendType"
					src="http://cdn.haofang.net/static/kdbweb/zdzfminiapp/more_icon.png"></image>
					
				<view @click="sendTextBtn" v-if="inputText" class="send_text_btn">
					发送
				</view>	
			</view>
		</view>
		
		<!-- 常用语列表 -->
		<scroll-view scroll-y v-if="oftenUseBtnShow" class="send_often_use_list">
			<block v-for="(text,index) in oftenUserList" :key="index">
				<view @click="sendOftenUseMsg(text)" class="send_often_use_list_item">{{ text }}</view>
			</block>
		</scroll-view>
		
		<!-- 表情swiper -->
		<view v-if="emojiBtnShow" class="send_emoji_list">
			<swiper class="send_emoji_swiper" indicator-dots indicator-active-color="#999999" indicator-color="#e5e5e5">
				<block v-for="(info, key) in emojiSwiperList" :key="key">
					<swiper-item class="send_emoji_swiper_item f_r_s">
						<view @click="addEmoji(emojiItem)" class="send_emoji_item_view f_r_c" 
							v-for="(emojiItem, index) in info" :key="index">
							<image mode="aspectFit" class="send_emoji_img" :src="emojiItem.img"></image>
						</view>
						
						<view @click="delEmoji" class="send_emoji_del f_c_c">
							<image class="send_emoji_del_img" mode="aspectFit" 
								src="http://cdn.haofang.net/static/uuminiapp/im/delete.png"></image>
						</view>
					</swiper-item>
				</block>
			</swiper>
		</view>
		
		<!-- 更多功能 -->
		<view v-if="moreTypeShow" class="send_more_type_list f_r_s">
			<block v-if="!startRecord">
				<view @click="senMoreMsg(item)" class="send_more_type_item" 
					v-for="(item, index) in moreSendTypeList" :key="index">
					<view class="send_more_img_view f_c_c">
						<image :style="{width: item.size,height: item.size}" mode="aspectFit" :src="item.imgSrc"></image>
					</view>
					
					<view v-if="item.event == 'pingBiChart'" class="send_more_text">{{ isPingBi ? '解除屏蔽' : item.text }}</view>
					<view v-else class="send_more_text">{{ item.text }}</view>
				</view>
			</block>
			
			<view @click="hideRecord" v-else class="send_record_view f_r_c">
				<view @click.stop="recordSend" @touchstart.stop="recordStart" @touchend.stop="recordEnd" 
					class="send_record_item f_c_c">
					<view class="send_record_img"></view>
					<view class="send_record_text">长按录音</view>
				</view>
			</view>
		</view>
	
	</view>
</template>

<script>
	import { Notify } from "../../utils/Notify.js";
	import { Notification } from "../../utils/Notification.js";
	import { ChartDetailItem, DealChartDetail, GetEmojiMap } from "../../utils/ImChart.js";
	import { formatTimeNew } from "../../utils/common.js";
	import { DealLastMsgTime, ImSendMessage } from "../../utils/ImChart.js";
	
    // #ifdef MP-WEIXIN
    const recorderManager = wx.getRecorderManager();
    // #endif
	let NcClickInfoTimeOutVal = null;
	let privateData = {
		addEmojiList: [],
		recordTimeOutVal: null,
        voiceStartTime: 0,  // 录音开始时间
	};
	
	export default {
		data() {
			return {
				oftenUseBtnShow: false,   // 常用语和输入法切换
				oftenUseMap: {
					false : {
						src: "http://cdn.haofang.net/static/wxPlusApp/yjk/useful-word.png",
						className: "chang_yong_yu"
					},
					true : {
						src: "http://cdn.haofang.net/static/uuminiapp/im/keyboard-new.png",
						className: "chang_input_icon"
					}
				},
				
				emojiBtnShow: false,   // 表情和输入法的切换
				emojiMap: {
					false: {
						src: "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/expression.png",
						className: "emoji_type_input"
					},
					true: {
						src: "http://cdn.haofang.net/static/uuminiapp/im/keyboard.png",
						className: "key_type_input"
					}
				},
				
				moreTypeShow: false,  // 更多
				
				// 常用语列表
				oftenUserList: [
					'这套房子的情况能给我详细介绍一下吗？',
					'什么时候可以看房呢？',
					'这套房子价格怎样？是必须全款吗？',
					'可以按揭吗？商贷/公积金贷都可以吗？',
					'有装修比较新的房子吗？',
					'这房子房东还有抵押吗？',
					'你们公司收佣是多少呢？',
					'你好，我想要这个区套三双卫的精装房，能帮我推荐几套合适的房子吗？',
					'我想看看附近的学区房，麻烦给我推荐一下，谢谢！',
					'你好，我想咨询几个买房问题',
					'你们会帮忙办理过户等后续手续吗？',
					'小区环境怎么样？还有周边的交通和配套如何？',
					'有啥优惠政策没？'
				],
				
				// 表情swiper
				emojiSwiperList: {},
				
				// 更多功能列表
				moreSendTypeList: [
					{
						event: "getPhoto",
						imgSrc: "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/album.png",
						text: "相册",
						size: "100%"
					},
					{
						event: "getTakePhoto",
						imgSrc: "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/photograph.png",
						text: "拍照",
						size: "100%"
					},
					// {
					// 	event: "pingBiChart",
					// 	imgSrc: "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/btn_pinbi.png",
					// 	text: "屏蔽",
					// 	size: "100%"
					// },
					// #ifndef H5
					{
						event: "voiceSend",
						imgSrc: "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/btn_yuyin.png",
						text: "语音",
						size: "100%"
					}
					// #endif
				],
				
				// input text
				inputText: "",
				isPingBi: false,  // 是否是屏蔽
				startRecord: false,  // 开始录音
                haveVoiceAuthSetting: false,  // 是否有语音权限
			}
		},
		
		props: {
			messageId: {
				type: String,
				default: ""
			},
			isShield: {
				type: String | Number,
				default: 0
			}
		},
		
		watch: {
			isShield() {
				if(this.isShield == 1) {
					this.isPingBi = true;
				} else{
					this.isPingBi = false;
				}
			}
		},
		
		mounted() {
            let that = this;
			this.initEmojiSwiperData();
			// 监听点击scroll区域
			new Notification().addObserver(this, "ClickChartDetailScroll", Notify.ClickChartDetailScroll.Name);
			if(this.isShield == 1) {
				this.isPingBi = true;
			}else{
				this.isPingBi = false;
			}
            uni.getSetting({
            	success(res) {
                    that.haveVoiceAuthSetting = res.authSetting['scope.record'] || false;
            	}
            });
            this.onRecordStop();
		},
		
		destroyed() {
		    // 反注册通知
		    new Notification().removeObserverAllNotification(this);
		},
		
		methods: {
			// 初始化表情
			initEmojiSwiperData() {
				let map = new GetEmojiMap().dealEmojiSwiperData();
				this.emojiSwiperList = map.emojiList || {};
			},
			
			// 切换常用语和文字输入
			changeOftenUseType() {
				this.oftenUseBtnShow = !this.oftenUseBtnShow;
				if(this.oftenUseBtnShow) {
					this.emojiBtnShow = false;
					this.moreTypeShow = false;
				}
				this.NcClickInfo();
			},
			
			// 切换表情和文字输入
			changeEmojiType() {
				this.emojiBtnShow = !this.emojiBtnShow;
				if(this.emojiBtnShow) {
					this.oftenUseBtnShow = false;
					this.moreTypeShow = false;
				}
				this.NcClickInfo();
			},
			
			// 切换更多功能
			lookMoreSendType() {
				if(this.startRecord) {
					this.startRecord = false;
					return;
				}
				
				this.moreTypeShow = !this.moreTypeShow;
				if(this.moreTypeShow) {
					this.oftenUseBtnShow = false;
					this.emojiBtnShow = false;
				}
				this.NcClickInfo();
			},
			
			// 点击输入框
			sendNewMsgClick() {
				// this.moreTypeShow = false;
				// this.oftenUseBtnShow = false;
				// this.emojiBtnShow = false;
				this.NcClickInfo();
			},
			
			// 点击scroll区域的回调
			ClickChartDetailScroll() {
				this.sendNewMsgClick();
			},
			
			// 点击推送
			NcClickInfo() {
				let view = uni.createSelectorQuery().select(".sned_msg_view");
				clearTimeout(NcClickInfoTimeOutVal)
				NcClickInfoTimeOutVal = null;
				NcClickInfoTimeOutVal = setTimeout(() => {
					view.boundingClientRect(data => {
						new Notification().postNotification(Notify.ClickChartMoreInfo.Name, {height: data.height});
					}).exec();
				}, 100);
			},
			
			// 更多点击
			senMoreMsg(item) {
				if(this.isPingBi && item.event != "pingBiChart") {
					uni.showToast({
						title: '您已把对方屏蔽，解除屏蔽后才能进行联系',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				
				this[item.event](item);
			},
			
			// 选择图片
			getPhoto(item) {
				this.getTakePhoto(item, ["album"]);
			},
			// 拍照
			getTakePhoto(item, sourceType = ["camera"]) {
				let that = this;
				uni.chooseImage({
					count: 1,
					sourceType: sourceType,
					success: function(res) {
						// #ifdef H5
						let canvas = document.createElement('canvas');
						let ctx = canvas.getContext('2d');
						let img = new Image;
						img.crossOrigin = 'Anonymous';
						img.onload = function(){
							//生成比例
							let width = img.width, height = img.height;
							//计算缩放比例
							let maxLen = 720;
							let rate = 1;
							let widthBi = parseInt(width/maxLen);
							let heightBi = parseInt(height/maxLen);
							if(widthBi >= 1.6 || heightBi >= 1.6) {
								rate =  0.6 - ( 0.7*(widthBi > heightBi ? widthBi : heightBi)/10);
								if(rate < 0.15) {
									rate = 0.15
								}
							}
							img.width = width * rate;
							img.height = height * rate;
							 //生成canvas
							let ctx = canvas.getContext("2d");
							canvas.width = img.width;
							canvas.height = img.height;
							ctx.drawImage(img, 0, 0, img.width, img.height);
							let base64 = canvas.toDataURL('image/jpeg', 0.9);
							that.uploadImg(base64);
							canvas = null;
						};
						img.src = res.tempFilePaths[0];
						// #endif
						
						// #ifdef MP
						that.uploadImg(res.tempFilePaths[0]);
						// #endif
					}
				});
			},
			// 上传图片
			uploadImg(url = "") {
				let that = this;
				if(!url) {
					uni.showToast({
						title: '暂无图片路径，无法发送',
						icon: 'none',
					});
					return;
				}
				
				if(!this.messageId) {
					uni.showToast({
						title: '暂无收件人id',
						icon: 'none',
					});
					return;
				}
				
				new ImSendMessage(this.messageId).sendImage(url)
					.then(() => {
						let item = new ChartDetailItem();
						item.type = "img";
						item.content = url;
						item.mySend = true;
						item.time = formatTimeNew(new Date().getTime());
						item.showTime = DealLastMsgTime.checkShowTime(this.messageId, new Date().getTime());
						DealLastMsgTime.setTime(new Date().getTime(), this.messageId);
						new Notification().postNotification(Notify.UpChartMsgChanged.Name, item);
					});
			},
		
			// 发送常用语
			sendOftenUseMsg(text = "") {
				if(this.isPingBi) {
					uni.showToast({
						title: '您已把对方屏蔽，解除屏蔽后才能进行联系',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				
				this.sendTextMsgCommon(text);
			},
			// 发送input
			sendTextInput(e) {
				let value = e.detail.value;
				value = value.replace(/(^\s*)|(\s*$)/g, "");
				this.inputText = value;
			},
			// input focus
			sendTextFocus() {
				this.NcClickInfo();
			},
		
			// 发送btn
			sendTextBtn() {
				if(this.isPingBi) {
					uni.showToast({
						title: '您已把对方屏蔽，解除屏蔽后才能进行联系',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				
				this.sendTextMsgCommon(this.inputText);
				this.inputText = "";
			},
			// 添加表情
			addEmoji(item) {
				this.inputText += item.fileName;
				privateData.addEmojiList.push(item.fileName);
			},
			// 删除表情
			delEmoji() {
				if(privateData.addEmojiList.length === 0) return;
				
				let str = this.inputText;
				let delFileName = privateData.addEmojiList[privateData.addEmojiList.length - 1];
				let i = str.lastIndexOf(delFileName);
				str = str.substring(0,i) + str.substring(i+delFileName.length,str.length);
				this.inputText = str;
			},
			// 发送的通用方法
			sendTextMsgCommon(text) {
				new ImSendMessage(this.messageId).sendText(text)
					.then(() => {
						let emoji =  new DealChartDetail().dealEmoji(text);
						let item = new ChartDetailItem();
						item.type = "text";
						item.content = text;
						item.mySend = true;
						item.time = formatTimeNew(new Date().getTime());
						item.emoji = emoji;
						item.hasEmoji = (emoji[1].length > 0);
						item.showTime = DealLastMsgTime.checkShowTime(this.messageId, new Date().getTime());
						DealLastMsgTime.setTime(new Date().getTime(), this.messageId);
						new Notification().postNotification(Notify.UpChartMsgChanged.Name, item);
					});
			},
			
			
			// 屏蔽
			pingBiChart() {
				this.ImChart.blockMsg(this.messageId, !(this.isPingBi))
					.then(res => {
						this.isPingBi = !this.isPingBi;
					});
			},
			
			// 切换语音发送
			voiceSend() {
				this.startRecord = true;
			},
			// 隐藏语音发送
			hideRecord() {
				this.startRecord = false;
			},
            // 语音发送
            recordSend() {},
			 // 监听录音结束
			onRecordStop() {
			    let that = this;
			    recorderManager.onStop((res) => {
			        if(!that.haveVoiceAuthSetting) return;
			       
			        // 小于1s的录音舍弃
			        if(new Date().getTime() - privateData.voiceStartTime < 800) {
			           return;
			        }
			       
			        if(res.duration < 800) {
			            uni.showToast({
			              title: '录音时间太短',
			              image: 'http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/warning.png',
			              duration: 600
			            });
			            return;
			        }
			        
			        if(!res.tempFilePath) {
			            uni.showToast({
			              title: "录音失败,暂无文件",
			              icon: "none"
			            });
			            return;
			        }
			        console.log('---发---',res.tempFilePath)
			        new ImSendMessage(this.messageId).sendVoice(res.tempFilePath)
			        	.then((msg) => {
			        		let item = new ChartDetailItem();
			        		item.type = "voice";
			        		item.content = msg.file.url;
			        		item.mySend = true;
			                item.voiceLength = res.duration ? Math.round(Number(res.duration)/1000) : 1;
			        		item.time = formatTimeNew(new Date().getTime());
			        		item.showTime = DealLastMsgTime.checkShowTime(this.messageId, new Date().getTime());
			        		DealLastMsgTime.setTime(new Date().getTime(), this.messageId);
			        		new Notification().postNotification(Notify.UpChartMsgChanged.Name, item);
			        	});
			    });
			},
			// 录音开始
			recordStart(e) {
				let that = this;
			    if(!that.haveVoiceAuthSetting) {
			        uni.getSetting({
			        	success(res) {
			                that.haveVoiceAuthSetting = res.authSetting['scope.record'] || false;
			                if(res.authSetting['scope.record'] != undefined && !res.authSetting['scope.record']) {
			                    uni.showToast({
			                        icon: "none",
			                        title: "请开启语音权限"
			                    });
			                    return;
			                }
			                
			                uni.authorize({
			                	scope: 'scope.record',
			                	success(res) {
			                        that.haveVoiceAuthSetting = true;
			                	}
			                });
			        	}
			        });
			        return;
			    }
			    
			    privateData.voiceStartTime = new Date().getTime();
				that.upRecordStart();
			},
			// 录音结束
			recordEnd(e) {
			    let that = this;
			    clearTimeout(privateData.recordTimeOutVal);
			    privateData.recordTimeOutVal = null;
			    if(!that.haveVoiceAuthSetting) return;
			    
			    uni.hideToast();
			    recorderManager.stop();
			},
			// 更新录音开始动画
			upRecordStart() {
				clearTimeout(privateData.recordTimeOutVal);
				privateData.recordTimeOutVal = null;
				privateData.recordTimeOutVal = setTimeout(() => {
					uni.showToast({
						title: '录音中',
						image: "http://cdn.haofang.net/static/kdbweb/zdzfminiapp/zdzfPlatform/common/ht_icon.png",
						duration: 990000
					});
			        let options = {
			            duration: 600000,
			            sampleRate: 44100,
			            numberOfChannels: 1,
			            encodeBitRate: 192000,
			            format: 'mp3'
			        };
			        recorderManager.start(options);
				}, 300);
			},
		}
	}
</script>

<style>
	.send_msg_cont{
		width: 100%;
		background: #FFFFFF;
		position: relative;
		z-index: 999;
	}
	.send_msg{
		width:100%;
		background-color:#fff;
		height: 100upx;
		line-height: 100upx;
		padding: 0 20upx;
		box-sizing: border-box;
	}
	.m-common-language{
		width: 150upx;
		height: 30upx;
		line-height: 1;
		margin-top: 35upx;
		margin-right: 20upx;
		display: inline-block;
		font-size: 30upx;
		color: #101d36;
		border-right: 1upx solid #babfc5;
		position: relative;
	}
	.send_often_btn{
		height: 75upx;
		width:150upx;
		text-align:center;
		margin: auto 20upx auto 0;
		flex-shrink: 0;
	}
	.send_msg_right{
		flex-shrink: 0;
	}
	.send_msg_right image{
		width: 46upx;
		height: 46upx;
		margin: auto 0;
		flex-shrink: 0;
		margin-left: 30upx;
	}
	.send_more_type{
		width: 46upx;
		height: 46upx;
		margin: auto 0;
		flex-shrink: 0;
		position: relative;
	}
	.emoji_type_input,.key_type_input{
		width: 70upx;
		height: 70upx;
		margin: auto 10upx auto 0;
		flex-shrink: 0;
	}
	.send_msg .chang_yong_yu{
		border-radius: 8upx;
	}
	.send_msg .chang_input_icon{
		height: 48upx;
		width: 120upx;
		margin: auto 35upx auto 15upx;
		flex-shrink: 0;
	}
	.send_input{
		width: 100%;
		text-align: left;
		height: 60upx;
		line-height: 60upx;
		margin: auto 0;
		padding-right: 20upx;
		box-sizing: border-box;
		font-size: 30upx;
		color: #101D36;
	}
	.send_input input{
		height: 60upx;
		line-height: 60upx;
	}
	.send_input_pl{
		color: #999999;
		font-size: 30upx;
	}
	.send_text_btn{
		width:90upx;
		height:65upx;
		color:#ffffff;
		background:#5786f2;
		line-height:65upx;
		text-align:center;
		display:inline-block;
		font-size:26upx;
		border-radius:4upx;
		margin: auto 0 auto 10upx;
		position: relative;
	}

	/* 常用语列表 */
	.send_often_use_list{
		padding: 20upx 0 20upx 20upx;
		box-sizing: border-box;
		height: 306upx;
		background: #FFFFFF;
		border-top: 1upx solid #e7e7e7;
	}
	.send_often_use_list_item{
		text-align: left;
		font-size:28upx;
		line-height:56upx;
		box-sizing:border-box;
		border-bottom:1upx solid #e7e7e7;
		white-space:normal;
		padding: 23upx 20upx 23upx 0;
	}
	
	/* 表请输入 */
	.send_emoji_list{
		height: 430upx;
		padding-top: 20upx;
		background: #FFFFFF;
		border-top: 1upx solid #e7e7e7;
		width: 100%;
		box-sizing: border-box;
	}
	.send_emoji_swiper,.send_emoji_swiper_item{
		width: 100%;
		height: 100%;
	}
	.send_emoji_swiper_item{
		flex-wrap: wrap;
		padding-bottom: 40upx;
		box-sizing: border-box;
	}
	.send_emoji_item_view,.send_emoji_del{
		width: 14.2%;
		height: 80upx;
		flex-shrink: 0;
	}
	.send_emoji_img,.send_emoji_del_img{
		height: 80%;
		width: 100%;
		margin: auto;
	}
	
	/* 更多 */
	.send_more_type_list{
		flex-wrap: wrap;
		width: 100%;
		padding: 40upx 0;
		background: #fafafa;
		border-top: 1upx solid #d9d9d9;
		box-sizing: border-box;
	}
	.send_more_type_item{
		width: 25%;
		flex-shrink: 0;
	}
	.send_more_img_view{
		width:104upx;
		height:104upx;
		border:2upx solid #d6d6d6;
		border-radius:24upx;
		flex-shrink: 0;
		margin: 0 auto;
		background-color: #f9f9f9;
	}
	.send_more_img_view image{
		height: 50%;
		width: 50%;
		margin: auto;
	}
	.send_more_text{
		padding-top: 26upx;
		font-size:28upx;
		color:#101d36;
		letter-spacing:1upx;
		text-align: center;
	}

	/* 录音 */
	.send_record_view{
		width: 100%;
		height: 160upx;
		flex-shrink: 0;
	}
	.send_record_img{
		width:114upx;
		height:114upx;
		border:2upx solid #d6d6d6;
		box-sizing: border-box;
		border-radius:50%;
		background:url(http://cdn.haofang.net/static/uuminiapp/im/im-voice.png) no-repeat center center;
		background-size:104%;
		margin: auto;
		background-color:#ffffff;
	}
	.send_record_text{
		font-size:20upx;
		color:#787878;
		letter-spacing:1upx;
		margin-top:10upx;
		text-align: center;
	}
</style>
