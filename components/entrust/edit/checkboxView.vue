<template>
	<view class="radio_choose_view">
		<view class="radio_choose_title" v-if="title">{{ title }}</view>

		<view class="radio_choose_list">
			<view :class="(checkboxChooseMap[0] && checkboxChooseMap[0].id == item.id) || (checkboxChooseMap[1] && checkboxChooseMap[1].id == item.id) || (checkboxChooseMap[2] && checkboxChooseMap[2].id == item.id) || (checkboxChooseMap[3] && checkboxChooseMap[3].id == item.id) || (checkboxChooseMap[4] && checkboxChooseMap[4].id == item.id) || (checkboxChooseMap[5] && checkboxChooseMap[5].id == item.id) || (checkboxChooseMap[6] && checkboxChooseMap[6].id == item.id) || (checkboxChooseMap[7] && checkboxChooseMap[7].id == item.id) ? 'radio_choose_list_item_active global-selecet-box' : ''"
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
				type: Array,
				default() {
					return []
				}
			},
			list: {
				type: Array,
				default() {
					return []
				}
			},
			type: {
				type: String | Number,
				default: ""
			},
			maxlength: {
				type: Number,
				default: 99999999999999
			}
		},

		data() {
			return {
				checkboxChooseMap: []
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
				let checkboxChooseMap = [];
				let idMap = new Map();
				(this.currentId || []).map(id => {
					idMap.set(parseInt(id), true);
				});
				(this.list || []).map((item) => {
					if(idMap.has(item.id)) {
						checkboxChooseMap.push(item);
					}
				});
				this.checkboxChooseMap = checkboxChooseMap;
			},

			changeRadioBtn(item) {
				let index = (this.checkboxChooseMap).findIndex((info) => {
					return info.id == item.id;
				});
				do{
					if(index >= 0) {
						this.checkboxChooseMap.splice(index, 1);
						break;
					}

					if(this.checkboxChooseMap.length >= this.maxlength) {
						this.checkboxChooseMap.shift();
						this.checkboxChooseMap.push(item);
						break;
					}

					this.checkboxChooseMap.push(item);
				}while(false);
				this.$emit("onCheckboxChanged", {list: this.checkboxChooseMap, type: this.type});
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
		padding:4upx 0 28upx;
		box-sizing:border-box;
	}
	.radio_choose_list_item{
		width:155upx;
		padding: 11upx 0;
		text-align:center;
		color:#101d36;
		font-size:28upx;
		background-color:#f1f3f6;
		border-radius:5upx;
		will-change: transform;
		margin:0 16upx 16upx 0;
		box-sizing:border-box;
	}
	.radio_choose_list_item:nth-child(4n) {
		margin-right: 0;
	}
	.radio_choose_list .radio_choose_list_item_active{
		background-color:#FFFFFF;
		color:#ab7f2e;
		border:1upx solid #ab7f2e;
	}
</style>
