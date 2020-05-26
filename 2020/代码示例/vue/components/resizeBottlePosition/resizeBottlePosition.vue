<template>
	<div :class="[`abs img`, containerClass]" :style="bg_Style">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

interface Ibg_Style {
	type?: string;
	top: string;
	oldTop: string;
}

@Component({
	components: {},
})
export default class resizeBottlePosition extends Vue {
	containerClass = "";
	bg_Style: Ibg_Style = {
		top: "",
		oldTop: "",
	};
	bg_Style_type = "";
	component_bgStyle = "";

	@Prop({})
	bgStyle: Ibg_Style;

	private get $bgStyle() {
		this.bg_Style = this.bgStyle;
		this.bg_Style.oldTop = this.bgStyle.top;

		if (this.bg_Style.type) {
			this.bg_Style_type = this.bg_Style.type;
		}
		return this.bg_Style;
	}
	private set $bgStyle(obj) {
		this.bg_Style = obj;
	}

	private mounted(): void {
		window.addEventListener("resize", this.resizeStyle);
		this.resizeStyle();
	}
	beforeDestroy() {
		window.removeEventListener("resize", this.resizeStyle);
	}
	resizeStyle() {
		const psW = 750; // 设计稿宽
		const logoH = 1380; // 指定显示的高度
		const pingkouH = 730; // 瓶口高度 用于按钮定位
		const dy = (psW * window.innerHeight) / window.innerWidth - logoH; // 浏览器访问高度与指定显示高度的差异距离
		// console.log(window.innerWidth, window.innerHeight, dy)

		// 只有小于零时重置
		if (dy > 0) return;
		// 重置背景高度
		// this.$bgStyle = { top: dy / 100 + 'rem' };

		if (this.$bgStyle) {
			this.$bgStyle = {
				top: this.$bgStyle.oldTop,
				oldTop: this.$bgStyle.oldTop,
			};
			const old_$bgStyle_top =
				+this.$bgStyle.oldTop.replace("rem", "").replace("px", "") * 100;

			// console.group()
			// console.log('old_$bgStyle_top', old_$bgStyle_top)
			// console.log('dy', dy, '-dy', -dy)
			// console.log('old_$bgStyle_top - (-dy) > 0 ?', old_$bgStyle_top - (-dy))
			// console.groupEnd()

			if (this.bg_Style_type) {
				if (old_$bgStyle_top - -dy < 0) {
					let new_$bgStyle_top = old_$bgStyle_top + old_$bgStyle_top - -dy;
					new_$bgStyle_top = new_$bgStyle_top / 2;

					this.$bgStyle = {
						top: new_$bgStyle_top / 100 + "rem",
						oldTop: this.$bgStyle.oldTop,
					};
				}
				return;
			}

			if (old_$bgStyle_top - -dy > 0) {
				let new_$bgStyle_top = old_$bgStyle_top - -dy;

				this.$bgStyle = {
					top: new_$bgStyle_top / 100 + "rem",
					oldTop: this.$bgStyle.oldTop,
				};
			} else {
				this.$bgStyle = {
					top: dy / 100 + "rem",
					oldTop: dy / 100 + "rem",
				};
			}
		}
	}
}
</script>
