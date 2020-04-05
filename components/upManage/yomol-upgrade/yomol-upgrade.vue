<template>
	<view v-if="visible" class="mark" :class="{'show_mark' : visible}">
		<view class="view" :class="{'show' : visible}">
			<image class="icon-top" src="http://cdn.haofang.net/static/wxPlusApp/yjk/common/up_icon.png"></image>

			<view @click="hide" class="close_view">
				<image class="close_icon" src="http://cdn.haofang.net/static/wxPlusApp/yjk/common/close_up.png"></image>
			</view>

			<view class="title">发现新版本</view>
			<view class="version">V{{ versionName }}</view>
			<scroll-view class="scroll" scroll-y>
				<view class="item" v-for="(item,index) in contents" :key="index">
					{{item}}
				</view>
			</scroll-view>
			<view v-if="!downloading" class="btns">
				<view class="sure" @click="onSureClick()">立即升级</view>
			</view>
			<view v-else class="progress-view">
				<progress style="width: 100%;height: 10upx;" :percent="progress"
									show-info stroke-width="3" />
			</view>
			<!--<cmd-progress v-else class="progress" type="circle" stroke-color="#C40000" :percent="progress"></cmd-progress>-->
		</view>
	</view>
</template>

<script>
	import cmdProgress from '../cmd-progress/cmd-progress.vue'
	export default {
		components: {
			cmdProgress
		},
		data() {
			return {
				visible: false,
				progress: 0,
				contents: [],
				downloading: false,
				success: true
			}
		},
		props: {
			type: {
				type: String,
				default: 'pkg'
			},
			url: {
				type: String,
				default: ''
			},
			title: {
				type: String,
				default: '版本更新'
			},
			versionName: {
				type: String,
				default: '1.0.0'
			},
			content: {
				type: String,
				default: ""
			}
		},
		watch: {
			content() {
				var strs = this.content.split('\n');
				for (var i = 0; i < strs.length; i++) {
					this.contents.push(strs[i])
				}
			}
		},
		methods: {
			show() {
				setTimeout(() => {
					if(this.success){
						this.visible = true
					}
				}, 100);
			},
			hide(){
				setTimeout(() => {
					this.visible = false
				}, 100);
			},
			onCancelClick(){
				this.hide()
			},
			onSureClick(){
				var platform = uni.getSystemInfoSync().platform;
				if(platform == 'ios'){
					plus.runtime.openURL(this.url);
				}else{
					this.downloading = true;
					var downloadTask = uni.downloadFile({
						url: this.url,
						success: (downloadResult) => {
							console.log(downloadResult);
							this.hide();
							if (downloadResult.statusCode === 200) {
								plus.runtime.install(downloadResult.tempFilePath, {
									force: false
								}, function() {
									plus.runtime.restart();
								}, (e) => {
									console.log(e);
									this.success = false
									uni.showToast({
										title: '安装升级包失败',
										icon: 'none'
									})
								});
							}
						}
					});
					downloadTask.onProgressUpdate((e)=>{
						this.progress = e.progress
					})
				}
			}
		},
	}
</script>

<style>
	@keyframes show{
		0%{transform: scale(0); background: rgba(255, 255, 255, 0.3);}
		50%{transform: scale(1.1); background: rgba(255, 255, 255, 0.6);}
		100%{transform: scale(1); background: rgba(255, 255, 255, 1);}
	}
	@keyframes showMark{
		0%{transform: scale(1); background: rgba(0,0,0,0.1);}
		100%{transform: scale(1); background: rgba(0,0,0,0.6);}
	}
	.show{
		animation: show .4s ease-in-out forwards;
	}
	.show_mark{
		animation: showMark .2s ease-in-out forwards;
	}
	.mark{
		position: fixed;
		top: 0;
		left: 0;
		min-height: 100vh;
		width: 100vw;
		background: rgba(0,0,0,0.1);
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}
	.view{
		padding-top: 147upx;
		box-sizing: border-box;
		width: 80vw;
		min-height: 70vw;
		background-color: white;
		border-radius: 20upx;
		display: flex;
		flex-flow: column;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}
	.close_view{
		width: 78upx;
		height: 78upx;
		position: absolute;
		left: 50%;
		bottom: -118upx;
		transform: translateX(-50%);
	}
	.close_icon{
		width: 100%;
		height: 100%;
	}
	.icon-top{
		position: absolute;
		width: 300upx;
		height: 260upx;
		left: 50%;
		top: -130upx;
		transform: translateX(-50%);
		z-index: 99;
	}
	.title{
		line-height: 60upx;
		text-align: center;
		font-weight: bold;
		font-family: PingFang-SC-Bold;
		font-size: 40upx;
		font-stretch: normal;
		color: #191f25;
	}
	.version{
		width: 100%;
		line-height: 42px;
		height: 42px;
		font-family: PingFang-SC-Medium;
		font-size: 28upx;
		font-weight: normal;
		font-stretch: normal;
		color: #191f25;
		text-align: center;
		margin-bottom: 30upx;
	}

	.scroll{
		width: 100%;
		min-height: 100upx;
		display: flex;
		flex-flow: column;
		justify-content: flex-start;
		align-items: flex-start;
		padding: 0 60upx 48upx;
		box-sizing: border-box;
	}
	.item{
		line-height: 50upx;
		font-family: PingFang-SC-Medium;
		font-size: 28upx;
		font-weight: normal;
		font-stretch: normal;
		color: #191f25;
		text-align: left;
	}

	.btns{
		width: 100%;
		padding: 0 40upx 70upx;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
	}
	.sure{
		width: 100%;
		height: 90upx;
		line-height: 90upx;
		background-color: #ffb109;
		border-radius: 10upx;
		box-sizing: border-box;
		font-family: PingFang-SC-Bold;
		font-size: 32upx;
		font-weight: normal;
		font-stretch: normal;
		color: #fffffe;
		text-align: center;
	}
	.progress-view{
		width: 100%;
		padding: 48upx 30upx 68upx;
		height: 206upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		box-sizing: border-box;
	}
	.progress{
		margin-bottom: 20upx;
	}
</style>
