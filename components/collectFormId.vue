<template>
	<!-- 获取formId -->
	<form class="collect-form-id " @submit="formSubmit" report-submit="true">
		<button formType="submit"></button>
   </form>
</template>

<script>
	import {UserInfoModel} from "@/model/UserInfoModel";
	import {PostFormId} from "@/net/kaidanbao/PostFormId/PostFormId";

	export default{
		methods: {
			formSubmit(e) {
				return;
				let me = new UserInfoModel().getModel("me") || {};
				if(!me.userId || !me.openId) return;

				if (e.detail && e.detail.formId){
					console.log("收集的formId", e.detail.formId);
					new PostFormId({
						formId: e.detail.formId,
						userId: me.userId,
						openId: me.openId,
						formType: 13,
						formSource: "kdb"
					}).send()
				}
			}
		}
	}

</script>

<style>
	.collect-form-id {
		position: absolute;
	   	width: 100%;
	   	height: 100%;
	   	left: 0;
	   	top: 0;
	   	opacity: 0;
		z-index: 1;
	}
	.collect-form-id button {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		opacity: 0;
		padding: 0;
		z-index: 1;
	}
</style>
