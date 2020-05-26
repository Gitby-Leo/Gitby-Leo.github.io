import Component from "./resizeBottlePosition.vue";
const resizeBottlePosition = {
	install: (Vue: any) => {
		Vue.component("resizeBottlePosition", Component);
	},
};
export default resizeBottlePosition;

// import resizeBottlePosition from "@/components/resizeBottlePosition";
// Vue.use(resizeBottlePosition);

// <resizeBottlePosition class="abs img center button" :bgStyle="homeBtnStyle">
//     <img src="@/assets/images/home/button.png" alt @click="draw" />
// </resizeBottlePosition>
