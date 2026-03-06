SteamCheckOfferJSAndroid = !(function() {
	var canCall = true;
	if (location.href && location.pathname.indexOf('/tradeoffer/') > -1) {
		try {
			var baojia = setInterval(() => {
				if (document.querySelector('#trade_confirm_message') || document.querySelector(
						'#error_msg')) {
					if (document.querySelector('#trade_confirm_message')) {
						setInterval(() => {
							var pp = document.querySelector('.title_text');
							if (pp && pp.innerHTML === '需要额外确认' && canCall) {
								WebViewJavascriptBridge.postMessage(1);
								canCall = false;
							}
						}, 800);
					} else {
						WebViewJavascriptBridge.postMessage(0);
					}
					clearInterval(baojia);
				}
			}, 500);
		} catch (error) {}
	}
})();