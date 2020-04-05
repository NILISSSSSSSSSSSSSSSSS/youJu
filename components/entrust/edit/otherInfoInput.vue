<template>
	<view class="other_info_input_view">
		<input placeholder-class="other_info_input_place" class="other_info_input"
			:maxlength="maxlength"
			:placeholder="placeholder" :value="newValue" @input="otherInfoInputChange" />
	</view>
</template>

<script>
	export default {
		props: {
			placeholder: {
				type: String | Number,
				default: ""
			},
			value: {
				type: String | Number,
				default: ""
			},
			maxlength: {
				type: String | Number,
				default: "60"
			}
		},

		data() {
			return {
				newValue: this.value
			}
		},

		watch: {
			value(newValue, oldValue) {
				this.newValue = newValue;
			}
		},

		methods: {
			otherInfoInputChange(e) {
				this.$emit("onOtherInputChanged", (e && e.detail ? e.detail.value || "" : ""));
			}
		},
	}
</script>

<style scoped>
	.other_info_input_view{
		position:relative;
		width:100%;
		margin:0 auto;
		overflow:hidden;
		border:1upx solid #ececec;
		box-sizing:border-box;
		border-radius:10upx;
		will-change: transform;
	}
	.other_info_input{
		width:100%;
		height:80upx;
		line-height:80upx;
		resize:none;
		color:#101d36;
		background-color:#FFFFFF;
		text-align:left;
		border:none;
		border-radius:0;
		will-change: transform;
		padding:0 20upx;
		box-sizing:border-box;
		font-size:28upx;
	}
	.other_info_input_place{
		color: #c3c6cc;
		font-size: 28upx;
		text-align: left;
		max-width: 100%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
