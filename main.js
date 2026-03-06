// 引入主应用组件
import App from './App';




// #ifndef VUE3
import Vue from 'vue';
import './uni.promisify.adaptor'; // 引入适配器
import uView from '@/uni_modules/uview-ui'; // 引入 uView UI

Vue.config.productionTip = false; // 关闭生产提示
App.mpType = 'app'; // 设置应用类型



// 使用 uView UI
Vue.use(uView);
const app = new Vue({
	...App
})

app.$mount()


// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue';
import uView from '@/uni_modules/uview-ui'; // 引入 uView UI

export function createApp() {
	const app = createSSRApp(App);

	// 使用 uView UI
	app.use(uView);

	return {
		app
	};
}
// #endif