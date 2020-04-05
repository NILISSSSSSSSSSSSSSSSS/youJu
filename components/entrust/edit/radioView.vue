<template>
	<view class="radio_choose_view">
		<view class="radio_choose_title" v-if="title && title != true">{{ title == true?'':title }}</view>

		<view class="radio_choose_list">
			<view :class="radioChooseId == item.id ? 'radio_choose_list_item_active global-selecet-box' : ''"
				class="radio_choose_list_item" @click="changeRadioBtn(item)"
				v-for="(item, index) in list" :key="index">{{ item.text }}</view>
		</view>
	</view>
</template>

<script>
	class ListItem {
		id = "";
		text = "";
	}

	export default {
		props: {
			title: {
				type: String,
				default: ""
			},
			currentId: {
				type: String | Number,
				default: ""
			},
			list: {
				type: Array,
				default() {
					return [];
				}
			},
			type: {
				type: String | Number,
				default: ""
			}
		},

		data() {
			return {
				radioChooseId: ""
			}
		},

		watch: {
			currentId(newValue, oldValue) {
				this.initId();
			}
		},

		mounted() {
			this.initId();
		},

		created() {
			this.initId();
		},

		methods: {
			initId() {
				this.radioChooseId = this.currentId;
			},

			changeRadioBtn(item) {
				this.radioChooseId = item.id;
				this.$emit("onRadioChanged", {id: item.id, type: this.type, text: item.text});
			}
		},
	}
</script>

<style scoped>
	.radio_choose_title{
		text-align:left;
		font-size:28upx;
		color:#101d36;
		height:40upx;
		line-height:40upx;
		position:relative;
		box-sizing:border-box;
		margin-bottom: 28upx;
	}
	.radio_choose_list{
		display:flex;
		flex-direction:row;
		justify-content:start;
		flex-wrap:wrap;
		padding:2upx 0 28upx;
		box-sizing:border-box;
	}
	.radio_choose_list_item{
		width:150upx;
		padding: 11upx 0;
		text-align:center;
		color:#101d36;
		font-size:28upx;
		background-color:#f1f3f6;
		border-radius:5upx;
		will-change: transform;
		margin:0 14upx 16upx 2upx;
		box-sizing:border-box;
        border:1upx solid #f1f3f6;
	}
	.radio_choose_list_item:nth-child(4n) {
		margin-right: 0;
	}
    .radio_choose_list_item:nth-child(5n) {
    	margin-left: 0;
    }
	.radio_choose_list .radio_choose_list_item_active{
		background-color:#FFFFFF;
		color:#ab7f2e;
		border:1upx solid #ab7f2e;
	}
</style>
