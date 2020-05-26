<template>
	<div class="game">
		<points v-show="isGameResult" />
		<iframe :src="iframeSrc" ref="iframe" @load="iframeLoad"></iframe>
		<!-- <div @click="sendMessage">点我向iframe发送信息</div>
        <div>显示{{iframeData&&iframeData.leoVal||'值'}}</div>
		<div>计数{{iframeData&&iframeData.num||'值'}}</div>-->
		<sprite-footer
			v-show="isGameResult || isGrameHome"
			:isShowRule="isShowRule"
			:isShowDraw="isShowDraw"
			@toCenter="toCenter"
		/>
	</div>
</template>

<style lang="scss" scoped>
iframe {
	width: 100%;
	height: 100vh;
	border: 0;
}
</style>

<script>
import points from "@/components/points.vue";
import spriteFooter from "@/components/spriteFooter.vue";
import Api from "@/utils/api.ts";
export default {
	name: "game",
	components: { points, spriteFooter },
	data() {
		return {
			iframeSrc: "",
			iframeData: null,
			isGrameHome: false, // 首页显示底
			isGameResult: false,
			isShowRule: false,
			isShowDraw: true,
			loyalUser: false // 是否老用户
		};
	},
	created() {
		console.log("/////////////===============loadiframe");

		let url1 = window.location.href.split("?")[0];
		let url2 = url1.split("#")[0];
		let url3 = url2.split("index.html")[0];
		if (process.env.NODE_ENV === "production") {
			this.iframeSrc = url3 + "static/web-mobile/043001/index.html";
		} else {
			// this.iframeSrc = 'http://10.132.54.48:8002/web-mobile/'
			this.iframeSrc = "http://localhost:8000/";
			// this.iframeSrc = 'http://10.152.152.128:8000/'
		}
	},
	mounted() {
		console.log("显示fm");
		// 这里就拿到了iframe的对象
		// console.log("父", this.$refs.iframe);
		// 这里就拿到了iframe的window对象
		// console.log("父", this.$refs.iframe.contentWindow);

		this.$track._jcqPage("游戏首页");
		// 在外部vue的window上添加postMessage的监听，并且绑定处理函数handleMessage
		// window.addEventListener('message', this.handleMessage)
		// this.iframeWin = this.$refs.iframe.contentWindow
		// 测试用
		// this.$store.commit("SET_canGlobalTipShowCheck", true);
	},
	beforeDestroy() {
		window.removeEventListener("message", this.handleMessage);
	},
	beforeRouteEnter(to, from, next) {
		// console.log('>>>>beforeRouteEnter', to, from)
		next();
	},
	beforeRouteLeave(to, from, next) {
		// console.log('>>>>beforeRouteLeave', to, from)
		window.removeEventListener("message", this.handleMessage);
		// this.$store.commit("SET_gameIsOver", true);
		next();
	},
	methods: {
		iframeLoad() {
			console.log("/////////////===============iframeLoad");
			// 在外部vue的window上添加postMessage的监听，并且绑定处理函数handleMessage
			window.removeEventListener("message", this.handleMessage);
			window.addEventListener("message", this.handleMessage);
			this.iframeWin = this.$refs.iframe.contentWindow;
		},
		sendMessage(data) {
			// 外部vue向iframe内部传数据
			this.iframeWin.postMessage(data, "*");
		},
		async handleMessage(data) {
			// 解析iframe内部发回来的数据
			console.log("父 接收响应的data", data, data.data);
			console.log(`父 执行${data.data.type}`);

			let page = data.data.page;
			this.isGameResult = false;
			switch (page) {
				case "homePage":
					this.handlehomePage(data);
					break;
				case "startPage":
					this.handlestartPage(data);
					break;
				case "choosePage":
					this.handlechoosePage(data);
					break;
				case "endPage":
					this.handleendPage(data);
					break;
			}
		},
		async handlehomePage(data) {
			let type = data.data.type;
			switch (type) {
				case "show":
					this.isGrameHome = true;
					this.isShowRule = false;
					this.isShowDraw = true;
					// 需要vendor添加show事件
					break;
				case "start":
					await this.checkPlayTimes();
					this.sendMessage({
						page: "homePage",
						type: "start",
						staus: this.$store.getters.getPlayTimes > 0 ? true : false
					});
					this.isGrameHome = false;

					console.log("关闭全局大奖显示检测");
					this.$nextTick(() => {
						this.$store.commit("SET_canGlobalTipShowCheck", false);
					});

					this.$track._jcq("jfyouxi_start_cs");
					if (this.$store.getters.getPlayTimes == 0) {
						this.$track._jcqPage("游戏次数不足");
					}
					break;
				case "scan":
					Api.wechatScanQRCode()
						.then(res => {
							console.log("扫描瓶盖成功");
						})
						.catch(err => {
							this.$toast.fail("扫描瓶盖失败");
						});

					this.$track._jcq("jfyouxi_csbz_saoxingai");
					break;
			}
		},
		handlestartPage(data) {
			let type = data.data.type;
			switch (type) {
				case "start":
					// this.sendMessage({
					//     page: 'startPage',
					//     type: 'start',
					// })
					break;
				case "scan":
					Api.wechatScanQRCode()
						.then(res => {
							console.log("扫描瓶盖成功");
						})
						.catch(err => {
							this.$toast.fail("扫描瓶盖失败");
						});

					this.$track._jcq("jfyouxi_csbz_saoxingai");
					break;
			}
		},
		handlechoosePage(data) {
			let type = data.data.type;
			// 需要vendor修改
			if (type.indexOf("audition_") > -1) {
				console.log("audition_", type);
				// audition_G大调派对
				// audition_致幻爱丽丝
				// audition_土耳其狂欢
				// audition_欢乐脉冲
			}
			if (type.indexOf("choose_") > -1) {
				console.log("choose_", type);
				if (type == "choose_G大调派对") {
					this.$track._jcq("jfyouxi_xq_Gdadiao");
				}
				if (type == "choose_致幻爱丽丝") {
					this.$track._jcq("jfyouxi_xq_Alice");
				}
				if (type == "choose_土耳其狂欢") {
					this.$track._jcq("jfyouxi_xq_Turkey");
				}
				if (type == "choose_欢乐脉冲") {
					this.$track._jcq("jfyouxi_xq_Huanle");
				}
			}
		},
		async handleendPage(data) {
			let type = data.data.type;
			let tempCount = -1;
			switch (type) {
				case "submitPoints":
					var result = await this.submitGameResult(data.data.points);
					this.isGameResult = true;
					this.isShowRule = true;
					this.isShowDraw = false;
					console.log(".>>>>>>!!!!!>", result);
					this.sendMessage({
						page: "endPage",
						type: "submitPoints",
						// staus: result.points ? true : false,
						staus: true,
						// loyalUser: result.loyalUser || 0
						loyalUser: false
					});

					console.log("开启全局大奖显示检测");
					this.$store.commit("SET_canGlobalTipShowCheck", true);
					this.$nextTick(() => {
						console.log(
							"check globalTipShowCount 1 === ",
							this.$store.getters.getGlobalTipShowCount
						);
						tempCount = Number(this.$store.getters.getGlobalTipShowCount);
						console.log("check tempCount 1 === ", tempCount);
						tempCount = tempCount + 1;
						console.log("check tempCount 2 === ", tempCount);
						this.$store.commit("SET_globalTipShowCount", tempCount);
						this.$nextTick(() => {
							console.log(
								"check globalTipShowCount 2 === ",
								this.$store.getters.getGlobalTipShowCount
							);
						});
					});

					// if (result.loyalUser) {
					// 	this.loyalUser = true;
					// 	this.$track._jcqPage("游戏结果页_老用户");
					// } else {
					// 	this.$track._jcqPage("游戏结果页_新用户");
					// }
					this.$track._jcqPage("游戏结果页");

					break;
				case "restart":
					await this.checkPlayTimes();
					this.sendMessage({
						page: "endPage",
						type: "restart",
						staus: this.$store.getters.getPlayTimes > 0 ? true : false
					});
					// if (this.loyalUser) {
					// 	// 老用户首次提示
					// 	this.$track._jcq("jfyouxi_jgyl_chongxintiaoz");
					// } else {
					// 	this.$track._jcq("jfyouxi_jgyx_chongxintiaoz");
					// }
					this.$track._jcq("jfyouxi_jgy_chongxintiaoz");

					if (this.$store.getters.getPlayTimes == 0) {
						this.$track._jcqPage("游戏次数不足");
					}
					break;
				case "change":
					await this.checkPlayTimes();
					this.sendMessage({
						page: "endPage",
						type: "change",
						staus: this.$store.getters.getPlayTimes > 0 ? true : false
					});
					// if (this.loyalUser) {
					// 	// 老用户首次提示
					// 	this.$track._jcq("jfyouxi_jgyl_qiegezaiz");
					// } else {
					// 	this.$track._jcq("jfyouxi_jgyx_qiegezaiz");
					// }
					this.$track._jcq("jfyouxi_jgy_qiegezaiz");

					if (this.$store.getters.getPlayTimes == 0) {
						this.$track._jcqPage("游戏次数不足");
					}
					this.$track._jcqPage("游戏选曲页");
					break;
				case "store":
					// if (this.loyalUser) {
					// 	// 老用户首次提示
					// 	this.$track._jcq("jfyouxi_jgyl_jifenshangc");
					// } else {
					// 	this.$track._jcq("jfyouxi_jgyx_jifenshangc");
					// }
					this.$track._jcq("jfyouxi_jgy_jifenshangc");
					this.$router.push("/integralDraw");
					break;
				case "scan":
					Api.wechatScanQRCode()
						.then(res => {
							console.log("扫描瓶盖成功");
						})
						.catch(err => {
							this.$toast.fail("扫描瓶盖失败");
						});

					this.$track._jcq("jfyouxi_csbz_saoxingai");
					break;
				case "gotoMine":
					break;
				case "gotoRule":
					break;
			}
		},
		async checkPlayTimes() {
			await this.$store.dispatch("ASYNC_gameTimesRemain");
			console.log("父 剩余次数", this.$store.getters.getPlayTimes);
		},
		async submitGameResult(points) {
			return await this.$store.dispatch("ASYNC_submitGameResult", points);
		},
		toCenter(data) {
			if (data != "game") return;
			if (this.isGrameHome) {
				this.$track._jcq("jfyouxi_hp_backgrzx");
			}
			if (this.isGameResult) {
				// if (this.loyalUser) {
				// 	// 老用户首次提示
				// 	this.$track._jcq("jfyouxi_jgyl_grzx");
				// } else {
				// 	this.$track._jcq("jfyouxi_jgyx_grzx");
				// }
				this.$track._jcq("jfyouxi_jgy_grzx");
			}
		}
	}
};
</script>