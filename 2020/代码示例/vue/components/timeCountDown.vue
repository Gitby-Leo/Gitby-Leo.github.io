<template>
	<!-- <div v-if="showTimeStatus== 0 || showTimeStatus== 1 ||showTimeStatus== 3" class="showTimeStatus3"> -->
	<div class="timeCountDown">
		<ul v-show="nowTime.hoursStr" class="srpiteTimeBox">
			<li class="item timeNumber" v-if="showTimeStatus != 1">
				<span class="timeNumberBg"></span>
				<span class="timeNumberTxt">{{ nowTime.hoursStr[0] }}</span>
			</li>
			<li class="item timeNumber" v-if="showTimeStatus != 1">
				<span class="timeNumberBg"></span>
				<span class="timeNumberTxt">{{ nowTime.hoursStr[1] }}</span>
			</li>
			<li class="item" v-if="showTimeStatus != 1">:</li>
			<li class="item timeNumber">
				<span class="timeNumberBg"></span>
				<span class="timeNumberTxt">{{ nowTime.minutesStr[0] }}</span>
			</li>
			<li class="item timeNumber">
				<span class="timeNumberBg"></span>
				<span class="timeNumberTxt">{{ nowTime.minutesStr[1] }}</span>
			</li>
			<li class="item">
				<span>:</span>
			</li>
			<li class="item timeNumber">
				<span class="timeNumberBg"></span>
				<span class="timeNumberTxt">{{ nowTime.secondsStr[0] }}</span>
			</li>
			<li class="item timeNumber">
				<span class="timeNumberBg"></span>
				<span class="timeNumberTxt">{{ nowTime.secondsStr[1] }}</span>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
.timeCountDown {
	text-align: center;

	.srpiteTimeBox {
		font-size: 0;

		.item {
			position: relative;
			display: inline-block;

			padding: 10/100 + rem 6/100 + rem;
			font-size: 60/100 + rem;
			font-weight: 500;
			color: #000;
			overflow: hidden;
		}

		.timeNumber {
			margin: 0 4/100 + rem;
			padding: 10/100 + rem 15/100 + rem;
			text-align: center;
			border-radius: 5px;
			overflow: hidden;

			&::before {
				content: "";
				display: block;
				position: absolute;
				top: 50%;
				left: 0;
				transform: translate(0, -50%);
				width: rem(2);
				height: rem(15);
				border: 1px solid #f6edc9;
				background: linear-gradient(#b1b2b1, #060606);
				z-index: 1;
			}

			&::after {
				content: "";
				display: block;
				position: absolute;
				top: 50%;
				right: 0;
				transform: translate(0, -50%);
				width: rem(2);
				height: rem(15);
				border: 1px solid #f6edc9;
				background: linear-gradient(#b1b2b1, #060606);
				z-index: 1;
			}

			.timeNumberBg {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;

				&::before {
					content: "";
					display: block;
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 50%;
					border-bottom: 1px solid #fbe597;
					background: #fadc71;
				}

				&::after {
					content: "";
					display: block;
					position: absolute;
					top: 50%;
					left: 0;
					width: 100%;
					height: 50%;
					border-top: 1px solid #fbe597;
					background: #fbd653;
					// animation: time_rotate 1s infinite;
				}
			}

			.timeNumberTxt {
				position: relative;
				z-index: 1;
			}
		}
	}
}
</style>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

interface IDateNumber {
	hours: number;
	minutes: number;
	seconds: number;
}
interface IDateString {
	hoursStr: string;
	minutesStr: string;
	secondsStr: string;
}

@Component({})
export default class timeCountDown extends Vue {
	test = false;
	showTimeStatus = 0;
	nowTime = {
		hoursStr: "",
		minutesStr: "",
		secondsStr: "",
	};
	updateTimeTimer = 0;

	@Prop()
	timeStamp: string;
	@Prop()
	componentStatus: string;

	@Watch("componentStatus")
	onComponentStatusChanged(val: string, oldVal: string) {
		// console.log('componentStatus', val, oldVal)
		if (val == "start") {
			this.onInit();
		}
		if (val == "stop") {
			clearTimeout(this.updateTimeTimer);
		}
	}

	private mounted(): void {
		this.onInit();
		// this.testTime();
	}
	onInit() {
		if (this.componentStatus == "start") {
			this.updateRemainingTime();
		}
	}
	//更新剩余时间
	// 时间段
	// 每天10点前--别急活动马上开始倒计时           new Date().getHours() < 10
	// 10-17--更多惊喜即将开始倒计时+扫瓶盖按钮     new Date().getHours() >= 10 && new Date().getHours() < 17
	// 17-18--每5分钟倒计时+扫瓶盖按钮             new Date().getHours() >= 17 && new Date().getHours() < 18
	// 18之后--别急活动马上开始倒计时              new Date().getHours() >= 18
	updateRemainingTime(): void {
		// 倒计时显示延迟8秒
		let $timestamp = new Date().getTime();
		let $gap = 8000;

		let _status = this.getTimeHoursStatus(
			new Date($timestamp - $gap).getHours()
		);
		this.nowTime = this.getRemainingTime(new Date($timestamp - $gap), _status);
		if (
			_status == 1 &&
			this.nowTime.minutesStr == "00" &&
			this.nowTime.secondsStr == "01"
		) {
			setTimeout(() => {
				this.$emit("listenTimeZeroEvent", true);
			}, 400);
		}
		clearTimeout(this.updateTimeTimer);
		this.updateTimeTimer = setTimeout(() => {
			this.updateRemainingTime();
		}, 1000);
	}

	/**
	 * @method 获取活动时间段处于哪个状态
	 * @param {}
	 * @return {number} 0:活动当天未开始 1:活动当日普通奖 2:活动当日每5分钟大奖 3:活动次日开始
	 */
	getTimeHoursStatus($hour: number): number {
		// 系统默认的时间
		// let nowHour: number = new Date().getHours();
		// test 测试使用传递进来的时间处于什么状态
		// let nowHour: number = this.test
		// 	? new Date(this.timeStamp).getHours()
		// 	: new Date().getHours();
		let nowHour = $hour;
		let status = 0;

		switch (true) {
			case nowHour < 12:
				status = 0;
				break;
			case nowHour >= 12 && nowHour < 18:
				status = 1;
				break;
			case nowHour >= 18:
				status = 2;
				break;
			default:
				break;
		}
		// console.log('checkTimeHoursStatus:', status, this.componentStatus)

		this.$emit("listenStatusEvent", status);
		this.showTimeStatus = status;
		return status;
	}

	/**
	 * @method 获取当前时间的 时 分 秒
	 * @param {}
	 * @return {object} {hours minutes seconds}
	 */
	getNowTime($Date: Date): IDateNumber {
		// let propDateData = new Date();
		//test
		// let propDateData = this.test ? new Date(this.timeStamp) : new Date();
		let propDateData = $Date;

		let hours = propDateData.getHours();
		let minutes = propDateData.getMinutes();
		let seconds = propDateData.getSeconds();
		return { hours, minutes, seconds };
	}

	/**
	 * @method 获取距离下一个活动时间段的倒计时结果对象
	 * @param {number} status 活动时间段状态
	 * @return {object} {hours minutes seconds}
	 */
	getRemainingTime($Date: Date, status: number): IDateString {
		let { hours, minutes, seconds } = this.getNowTime($Date);
		// 根据不同状态返回
		switch (status) {
			case 0:
				hours = 12 - hours - 1;
				minutes = 60 - minutes;
				seconds = 60 - seconds;
				break;
			case 1:
				// 每15分钟
				// 00:00-04:59 05:00-09:59 55:00-59:59
				hours = 18 - hours - 1;
				minutes = 15 - (minutes % 15);
				seconds = 60 - seconds;
				break;
			case 2:
				hours = 24 - hours + 10 - 1;
				minutes = 60 - minutes;
				seconds = 60 - seconds;
				break;
			default:
				break;
		}
		// console.log(`${hours}:${minutes}:${seconds}`)

		let _hours = hours;
		let _minutes = minutes;
		let _seconds = seconds;

		// 整时整分整秒 时进1 分0秒0
		if (minutes == 60 && seconds == 60) {
			_hours += 1;
			_minutes = 0;
			_seconds = 0;
		}
		// 非整时/整分 分退1
		if (minutes <= 60 && seconds != 60) {
			_minutes -= 1;
		}

		// 整分 分进1秒0
		if (minutes != 60 && seconds == 60) {
			_seconds = 0;
		}

		let { hoursStr, minutesStr, secondsStr } = this.formateTime(
			_hours,
			_minutes,
			_seconds
		);
		return { hoursStr, minutesStr, secondsStr };
	}

	/**
	 * @method 格式化当前时间 补十位0
	 * @param {number} timeStamp 时间字符串
	 * @return {object}  {hours minutes seconds}
	 */
	formateTime(hours: number, minutes: number, seconds: number): IDateString {
		return {
			hoursStr: this.numerAddZero(hours),
			minutesStr: this.numerAddZero(minutes),
			secondsStr: this.numerAddZero(seconds),
		};
	}

	/**
	 * @method 数字补位 1->01
	 * @param {number} timeStamp 时间字符串
	 * @return {string}
	 */
	numerAddZero(n: number): string {
		if (n < 10) {
			let new_n = "0" + n;
			return new_n;
		} else {
			return n + "";
		}
	}
}
</script>
