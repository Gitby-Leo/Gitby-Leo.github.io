<template>
	<div class="outer-container">
		<div class="home">
			<resizeBottlePosition class="abs img bg" :bgStyle="homeBgStyle">
				<img src="@/assets/images/bg.jpg" alt />
			</resizeBottlePosition>

			<logo />

			<resizeBottlePosition
				class="abs img center button"
				:bgStyle="homeBtnStyle"
			>
				<img src="@/assets/images/home/button.png" alt @click="draw" />
			</resizeBottlePosition>
		</div>
		<home-normal-prize-tips
			:isShow="isShowPrizeTips"
			@go="draw"
			@hide="hidePrizeTips"
			style="z-index: 0;"
		/>

		<sprite-footer :isShowCenter="isShowCenter" />
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
	components: {},
})
export default class home extends Vue {
	isNormalPrizeTime: boolean = false; // 是否普通抽奖时间段
	isShowPrizeTips: boolean = false; // 显示普通抽奖时间段提示
	clickBtnTime = 0; //抽奖按钮点击次数,为了区分第一次点击和授权完成后点击
	isShowCenter = false;
	created() {}
	private mounted(): void {
		this.onInit();

		if (this.$store.getters.getIsNewCustomer != true) {
			this.isShowCenter = true;
		}
	}

	onInit() {
		let hour = new Date().getHours();
		if (hour < 12 || hour >= 18) {
			// 普通抽奖时间段
			this.isShowPrizeTips = true;
		}
		this.$store.commit("SET_tempPopItemType", -1);
	}
	trackDrawBeforeAuth() {}
	trackDrawAfterAuth() {}
	// 抽奖
	async draw() {
		this.clickBtnTime += 1;

		let checkUserInfo = await this.beforeDraw();
		if (checkUserInfo == "error") return;

		this.trackDrawAfterAuth();

		if (!this.$store.getters.getPinCode) {
			this.$router.replace({
				name: "scanTip",
			});
			return;
		}

		await this.stillDraw();
	}
	// 判断抽奖权限
	async beforeDraw() {
		if (
			this.$store.state.userInfo.unionId &&
			this.$store.state.userInfo.moiblePhone
		)
			return true;

		this.trackDrawBeforeAuth();
		let result = await this.getUserInfo();
		if (!result) {
			this.$toast.fail("网络繁忙 请稍后再试");
			return "error";
		}

		if (
			!this.$store.state.userInfo.unionId ||
			!this.$store.state.userInfo.moiblePhone
		) {
			window.wx.miniProgram.navigateTo({
				url: "/pages/auth/index",
				success: function () {
					console.log("wx.miniProgram.navigateTo success");
				},
				fail: function () {
					console.log("wx.miniProgram.navigateTo fail");
					this.$toast.fail("路径错误");
				},
			});
			return false;
		}

		return true;
	}
	// 获取用户信息
	async getUserInfo() {
		return await this.$store.dispatch("ASYNC_userInfo");
	}
	// 仍然抽奖
	async stillDraw() {
		let result = await this.$store.dispatch("ASYNC_draw1");
	}
	getResult() {}
	hidePrizeTips() {
		this.isShowPrizeTips = false;
	}
}
</script>
