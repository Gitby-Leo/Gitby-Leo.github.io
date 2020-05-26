<template>
	<section
		class="fixed integralDrawPrizeModal"
		v-if="choosePrizeId"
		@click="close"
	>
		<div class="abs modalBox" @click.stop>
			<div class="rel prizeBox">
				<div class="rel img mcenter prizeModal_title" v-if="prizeInfo.type">
					<img
						:src="
							require(`@/static/images/integralDraw/prizeModal/title_${prizeInfo.type}.png`)
						"
						alt
					/>
				</div>
				<div class="rel img mcenter prizeModal_prizeName" v-if="choosePrizeId">
					<img
						:src="
							require(`@/static/images/integralDraw/prizeModal/prizeName_${choosePrizeId}.png`)
						"
						alt
					/>
				</div>
				<div
					class="rel img mcenter prizeModal_tips"
					v-if="prizeInfo.prizeIdList.length > 1"
				>
					<img src="@/assets/images/integralDraw/prizeModal/tips.png" alt />
				</div>

				<div
					class="rel prizeModal_prizeList_wrapper"
					ref="prizeModal_prizeList_wrapper"
				>
					<van-swipe
						class="prizeModal_prizeList_content"
						ref="prizeModal_prizeList_content"
						:loop="true"
						:autoplay="0"
						indicator-color="white"
						@change="onPrizeListChange"
					>
						<van-swipe-item
							v-for="(item, index) in prizeInfo.prizeIdList"
							:key="index"
						>
							<div class="rel img mcenter prizeImg">
								<img
									:src="
										require(`@/static/images/integralDraw/prizeModal/prizeImg_${item}.png`)
									"
									alt
								/>
							</div>
						</van-swipe-item>
					</van-swipe>
					<span
						class="abs prev"
						@click="handlePrevEvent"
						v-if="prizeInfo.prizeIdList.length > 1"
					></span>
					<span
						class="abs next"
						@click="handNextEvent"
						v-if="prizeInfo.prizeIdList.length > 1"
					></span>
				</div>
			</div>
			<div class="rel img mcenter usePoints" v-if="prizeInfo.type">
				<img
					:src="
						require(`@/static/images/integralDraw/prizeModal/usePoints_${prizeInfo.points}.png`)
					"
					alt
				/>
			</div>
			<div class="rel img mcenter draw" @click="draw">
				<img src="@/assets/images/integralDraw/prizeModal/draw.png" alt />
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

interface IPrizeInfo {
	type: string;
	points: string;
	prizeIdList: Array<string>;
}
interface IPostPrizeInfo {
	type: string;
	points: string;
	prizeId: string;
}

@Component({})
export default class integralDrawPrizeModal extends Vue {
	choosePrizeId = ""; // 当前选中的产品id

	@Prop({ default: false, type: Boolean })
	isShow?: boolean;

	@Prop()
	prizeInfo: IPrizeInfo;

	@Watch("prizeInfo")
	onPrizeInfoChanged(val: IPrizeInfo, oldVal: IPrizeInfo) {
		this.choosePrizeId = this.prizeInfo.prizeIdList[0];
	}

	private mounted(): void {
		this.onInit();
		this.choosePrizeId = this.prizeInfo && this.prizeInfo.prizeIdList[0];
	}
	onInit() {}

	onPrizeListChange(index: number) {
		this.choosePrizeId = this.prizeInfo.prizeIdList[index];
		console.log("当前 Swipe 索引：" + index, this.choosePrizeId);
	}
	handlePrevEvent() {
		(this.$refs.prizeModal_prizeList_content as any).prev();
	}
	handNextEvent() {
		(this.$refs.prizeModal_prizeList_content as any).next();
	}
	draw() {
		console.log("cac");
		let postPrizeInfo: IPostPrizeInfo = {
			type: this.prizeInfo.type,
			points: this.prizeInfo.points,
			prizeId: this.choosePrizeId,
		};
		this.$emit("draw", postPrizeInfo);
	}
	close() {
		this.$emit("close");
	}
}
</script>

<style lang="scss" scoped>
.integralDrawPrizeModal {
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 5;

	&::before {
		content: "";
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.8);
	}

	.modalBox {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		// overflow: hidden;

		.prizeBox {
			width: rem(636);
			// padding-bottom: rem(20);
			background: #fff;

			.prizeModal_title {
				width: rem(407);

				img {
					margin-top: rem(-88);
				}
			}

			.prizeModal_prizeName {
				width: rem(540);
				margin-top: rem(26);
			}

			.prizeModal_tips {
				width: rem(438);
				margin-top: rem(16);
			}

			.prizeModal_prizeList_wrapper {
				// margin-top: rem(10);
				margin-top: rem(20);
				overflow: hidden;

				.van-swipe-item {
					display: inline-block;
				}

				.prizeImg {
					width: rem(438);
				}

				.prev {
					width: rem(39);
					height: rem(72);
					top: 50%;
					left: rem(46);
					transform: translate(0, -50%);
					background: url("../assets/images/integralDraw/prizeModal/prev.png")
						no-repeat !important;
					background-size: 100% 100% !important;
				}

				.next {
					width: rem(39);
					height: rem(72);
					top: 50%;
					right: rem(46);
					transform: translate(0, -50%);
					background: url("../assets/images/integralDraw/prizeModal/next.png")
						no-repeat !important;
					background-size: 100% 100% !important;
				}
			}

			// .prizeModal_prizeList_wrapper {
			//     // width: 100%;
			//     // height: 100%;
			//     overflow: hidden;
			//     overflow-x: scroll;
			//     z-index: 1;

			//     .prizeModal_prizeList_content {
			//         position: relative;
			//         // width: 100%;
			//         margin: 0 auto;

			//         .prizeModal_prizeList_item {
			//             display: inline-block;
			//         }
			//     }
			// }
		}

		.usePoints {
			width: rem(208);
			margin-top: rem(20);
		}

		.draw {
			width: rem(442);
			margin-top: rem(10);
		}
	}
}
</style>
