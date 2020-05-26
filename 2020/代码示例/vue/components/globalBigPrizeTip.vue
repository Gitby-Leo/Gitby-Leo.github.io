<template>
	<div
		class="fixed globalBigPrizeTip"
		v-show="isGlobalBigPrizeTipTimerStart"
		@click="closePop"
	>
		<div v-if="isGlobalBigPrizeTipShow" @click="btnClick">
			<img src="@/assets/images/result/result-back-big.png" alt="" />
		</div>
		<div v-show="false">
			<time-count-down
				:componentStatus="componentStatus"
				@listenStatusEvent="getStatus"
				@listenTimeZeroEvent="checkTimeZero"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.globalBigPrizeTip {
	width: 100%;
	z-index: 20;
}
</style>

<script lang="ts">
/**
     *  使用
     *  // 结果页
            if(大奖时间段，有pincode){}
            this.$store.commit("SET_isGlobalTipTimerStart", true);

        // App.vue 全局的中奖弹窗
            <global-big-prize-tip v-if="isGlobalBigPrizeTipTimerStart" :isGlobalBigPrizeTipTimerStart="isGlobalBigPrizeTipTimerStart" @globalBigPrizeTipClose="globalBigPrizeTipClose" />
            import组件globalBigPrizeTip

            // store改变props通知倒计时开始
            @Getter("getIsGlobalTipTimerStart") isGlobalBigPrizeTipTimerStart: boolean;
            // 关闭中奖弹窗
            globalBigPrizeTipClose() {
                this.$store.commit("SET_isGlobalTipTimerStart", false);
            }
        // game.vue 游戏结束改变store
            this.$store.commit("SET_canGlobalTipShowCheck", true);
     */
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { State, Getter } from "vuex-class";
import timeCountDown from "@/components/timeCountDown.vue";
import Api from "@/utils/api.ts";

@Component({
	components: {
		timeCountDown,
	},
})
export default class globalBigPrizeTip extends Vue {
	private mounted(): void {
		this.onInit();
	}
	onInit() {}

	btnClick(type: number) {
		this.$emit("globalBigPrizeTipClose");
	}

	@Prop({ default: false, type: Boolean })
	isGlobalBigPrizeTipTimerStart: boolean;

	isGlobalBigPrizeTipShow = false; // 显示中奖提示
	componentStatus = "start"; // 默认开启全局倒计时

	closePop() {
		this.$emit("globalBigPrizeTipClose");
	}

	getStatus(data: number) {
		console.log("====getStatus", data);
	}

	handleArr = []; // 订阅列表，存入回调函数
	// 全局倒计时结束
	checkTimeZero(data: boolean) {
		console.log("====checkTimeZero", data);

		// 离开结果页，开关未关闭
		if (this.$store.getters.getIsGlobalTipTimerStart == true) {
			// 拉取中奖信息
			this.checkPrizeInfo();

			// 如果中奖,拿到结果后，暂停倒计时
			this.componentStatus = "stop";

			// 过滤指定页面
			if (
				this.$route.name == "result" ||
				this.$route.name == "personalCenter"
			) {
				return;
			}

			if (this.$route.name == "game") {
				// 情况1 在特定页面，如游戏页，等游戏结束显示中奖提示
				// 存入订阅列表
				(this.handleArr as any).push(() => {
					this.$store.commit("SET_canGlobalTipShow", true);
				});
				console.log("存入，待执行", this.handleArr);
			} else {
				// 情况2 在普通页面，直接显示中奖提示
				this.$store.commit("SET_canGlobalTipShow", true);
			}
		}
	}
	// 拉取逻辑
	checkPrizeInfo() {}

	// 根据store中canGlobalTipShow的状态显示弹窗
	@State canGlobalTipShow: boolean;
	@Watch("canGlobalTipShow")
	handleWatchCanGlobalTipShow(val: boolean, oldVal: boolean) {
		console.log("val", val, "oldVal", oldVal);
		if (val) {
			this.showTip();
		}
	}

	@State canGlobalTipShowCheck: boolean;
	@Watch("canGlobalTipShowCheck")
	handleWatchCanGlobalTipShowCheck() {
		// 如果订阅列表有值，执行发布,执行完成删除订阅
		if (this.handleArr.length > 0) {
			(this.handleArr[0] as any)();
			this.handleArr = [];
			this.$store.commit("SET_canGlobalTipShowCheck", false);
		}
	}

	// 可以显示弹窗
	showTip() {
		this.isGlobalBigPrizeTipShow = true;
	}
}
</script>
