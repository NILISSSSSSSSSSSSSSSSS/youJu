<template>
	<form report-submit @submit="formSubmit">
		<button hover-class="none" form-type="submit" @click="mapFindHouse" class="map_find_house_btn"></button>
	</form>
</template>

<script>
	export default {
		props: {
			type: {
				type: String,
				default: ""
			},
		},

		mounted() {
			new this.InitFormSubmit(this);
		},

		methods: {
			mapFindHouse() {
				let url = "/pagesTool/mapFindHouse/mapFindHouse";
				if(this.type) {
					url += "?type="+this.type;
				}
				uni.navigateTo({
					url: url
				});
			}
		},
	}
</script>

<style scoped>
	button.map_find_house_btn{
		width:100upx;
		height:100upx;
		position:fixed;
		right:21upx;
		bottom:115upx;
		border-radius:50%;
		will-change: transform;
		background:url('http://cdn.haofang.net/static/uuminiapp/pageNewUi/btn_map.png') center no-repeat;
		background-size:100% 100%;
		box-shadow:0px 0px 33px 2px rgba(0, 0, 0, 0.16);
		z-index:9;
	}
</style>
