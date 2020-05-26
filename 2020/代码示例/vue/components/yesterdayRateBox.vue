<template>
	<section>
		<ul class="luckyDrawListTitle">
			<li class="item1">时间段</li>
			<li class="item2">参与人数</li>
			<li class="item3">实际中奖率</li>
		</ul>

		<div class="rel mcenter getRateList">
			<div class="getRateListWrapper" ref="getRateListWrap">
				<ul class="getRateListContent">
					<li
						v-for="(item, index) in getRateList"
						:key="index"
						class="drawItem"
					>
						<div class="item_time">{{ item.time }}</div>
						<div class="item_prize">{{ item.amount }}</div>
						<div class="item_status">{{ item.rate }}</div>
					</li>
				</ul>
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import BScroll from "better-scroll";
import { Decimal } from "decimal.js";
interface IGetRateListItem {
	[propName: string]: any;
}
@Component({})
export default class yesterdayRateBox extends Vue {
	getRateList: IGetRateListItem = [];
	_getRateList: IGetRateListItem = [];

	private mounted(): void {
		this.onInit();
	}
	async onInit() {
		await this.getYesterdayGlobalPrizeInfo();
	}
	async getYesterdayGlobalPrizeInfo() {
		if (this.$store.getters.getYesterdayGlobalPrizeInfo.length != 0) {
			this.useData();
			return;
		}
		let result = await this.$store.dispatch("ASYNC_yesterdayGlobalPrizeInfo");
		if (
			!result ||
			this.$store.getters.getYesterdayGlobalPrizeInfo.data.length == 0 ||
			this.$store.getters.getYesterdayGlobalPrizeInfo.data.reduce(
				(prev: any, next: any) => {
					return prev + next;
				}
			) == 0
		) {
			this.getRateList = [
				{
					time:
						new Date().getFullYear() +
						"." +
						(new Date().getMonth() + 1) +
						"." +
						new Date().getDate(),
					amount: "还未获取到昨日参与人数",
					rate: "",
				},
			];
			this.showList();
			return;
		}
		this.useData();
	}
	useData() {
		let yesterdayInfo = this.$store.getters.getYesterdayGlobalPrizeInfo;
		let day =
			yesterdayInfo.timestamp.slice(0, 4) +
			"." +
			yesterdayInfo.timestamp.slice(4, 6) +
			"." +
			yesterdayInfo.timestamp.slice(6, 8);
		let config = {
			day,
			data: yesterdayInfo.data,
		};
		this.updateRateInfo(config);
	}
	updateRateInfo({ day, data }: any) {
		const rateDay = day;
		const hourList = [12, 13, 14, 15, 16, 17, 18];
		const minutesList = ["00", "15", "30", "45"];

		var arr = [];
		for (let i = 0, j = 0; i < 24; i++) {
			if (i > 0 && i % 4 == 0) j++;
			let item = {
				time: rateDay + "\n" + hourList[j] + " - " + minutesList[i % 4],
				amount: data[i],
				rate: "",
			};

			let len = (item.amount + "").length;
			let rate = (1 / +item.amount) * 100;
			let rate_2 = "";

			if (item.amount == 0) {
				rate_2 = 0 + "%";
			}
			if (item.amount > 0 && len <= 8) {
				if (rate % 1 == 0) {
					// 整数
					rate_2 = new Decimal(rate).toFixed(len);
				} else {
					// 有余数
					if (rate > 1) {
						// 大于100
						rate_2 = new Decimal(rate).toFixed(2);
					} else {
						// 小于100
						rate_2 = new Decimal(rate).toFixed(len - 1);
					}
				}

				rate_2 = +rate_2 + "%";
			}
			if (len > 8) {
				rate_2 = new Decimal(rate).toFixed(len - 1);
				rate_2 = +rate_2 + "%";
			}
			item.rate = rate_2;

			arr.push(item);
		}
		this._getRateList = arr;
		this.getRateList = this._getRateList;
		this.showList();
	}
	showList() {
		this.$nextTick(() => {
			(this as any).scroll = new BScroll((this as any).$refs.getRateListWrap, {
				probeType: 3, // 允许实时监听 scroll
				scrollY: true,
				click: true,
				// useTransition: false,
				bounce: false, // 当滚动超过边缘的时候会有一小段回弹动画。设置为 true 则开启动画。
				tap: true,
				mouseWheel: true,
				scrollbar: {
					fade: true,
				},
			});
			(this as any).scroll.refresh();
		});
	}
}
</script>
>

<style lang="scss" scoped>
.luckyDrawListTitle {
	display: flex;
	padding: 0 5px;
	border-radius: 5px 5px 0 0;
	background: #099245;

	li {
		flex: 1;
		padding: rem(20) 0;
		text-align: center;
		font-size: rem(24);
		color: #fff;
	}

	.item2 {
		flex: 2;
		border-left: 2px solid #fff;
		border-right: 2px solid #fff;
	}

	.item3 {
		margin-right: rem(8); // 留出侧边条位置
	}
}

.getRateList {
	width: 100%;

	.getRateListWrapper {
		width: 100%;
		max-height: rem(610);
		padding: 0 5px;
		background: #fef6dc;
		overflow: hidden;
	}

	.getRateListContent {
		width: 100%;
		font-size: rem(24);
		color: #000;
		background: #fef6dc;
	}

	.drawItem {
		display: flex;
		align-items: stretch;
		border-top: 1px solid #fff;
		border-bottom: 1px solid #fff;

		.item_time {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			line-height: 1.2;
			white-space: pre-wrap;
		}

		.item_prize {
			flex: 2;
			padding-top: rem(30);
			padding-bottom: rem(30);
			border-left: 2px solid #fff;
			border-right: 2px solid #fff;
			line-height: 1.2;
			text-align: center;
		}

		.item_status {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: rem(8);
			border-right: 0px solid #fff;
			text-align: center;
			line-height: 1.2;
			white-space: pre-wrap;
		}
	}
}
</style>
