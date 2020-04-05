<template>
	<view>
		<view class="choose_agent_title" v-if="title">{{ title }}</view>

		<view class="choose_agent_cont f_r_b">
			<view :class="clickVal == item.id ? 'choose_agent_item_active' : ''" class="choose_agent_item f_r_s"
				@click="changeAgentSexBtn(item)"
				v-for="(item, index) in list" :key="index">
				<view class="choose_agent_img">
					<image mode="aspectFill" :src="item.headImg"></image>
				</view>

				<view class="choose_agent_text f_c_c">{{ item.text }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ""
			},
			list: {
				type: Array,
				default(){
					return [];
				}
			},
			currentVal: {
				type: String | Number,
				default: ""
			}
		},

		watch: {
			currentVal(newValue, oldValue) {
				this.clickVal = this.currentVal;
			}
		},

		data() {
			return {
				clickVal: this.currentVal
			}
		},

		methods: {
			changeAgentSexBtn(item) {
				if(this.clickVal == item.id) {
					this.clickVal = "";
					this.$emit("onAgentSexChanged", "");
					return;
				}

				this.clickVal = item.id;
				this.$emit("onAgentSexChanged", item.id);
			}
		},
	}
</script>

<style scoped>
	.choose_agent_title{
		text-align:left;
		font-size:28upx;
		color:#101d36;
		height:40upx;
		line-height:40upx;
		position:relative;
		box-sizing:border-box;
		margin-bottom: 28upx;
	}
	.choose_agent_cont{
		padding:0 60upx 0 42upx;
		box-sizing:border-box;
	}
	.choose_agent_img{
		width:120upx;
		height:120upx;
		margin:auto 26upx auto 0;
		box-sizing:border-box;
		display:flex;
		flex-direction:column;
		justify-content:center;
		flex-shrink:0;
		border:2upx solid #ffffff;
		border-radius:100%;
		will-change: transform;
	}
	.choose_agent_img>image{
		width: 96%;
		height: 96%;
		margin: auto;
	}
	.choose_agent_item_active .choose_agent_img{
		border:2upx solid #ab7f2e;
	}
	.choose_agent_item_active .choose_agent_text{
		color:#ab7f2e;
	}
</style>
