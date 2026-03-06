SteamReverseProxyJSAndroid =
	var msgs = '',
		_this = '';
!(function() {
	if (document.getElementById('login_form') || document.getElementById('loginForm') || document.getElementById(
			'mainBody')) {} else {
		return false
	};
	CLoginPromptManager.prototype.HighlightFailure = function(msg) {
		if (this.m_fnOnFailure) {
			this.m_fnOnFailure(msg);
			if (this.m_bIsMobile && msg) $J('input:focus').blur();
		} else {
			var $ErrorElement = $J('#error_display');
			if (msg) {
				msgs = msg;
				_this = this;
				if (msg.indexOf('短期内来自您网络的失败登录过多') >= 0) {
					WebViewJavascriptBridge.postErrorMessage(msg);
				} else {
					$ErrorElement.text(msg);
				}
				$ErrorElement.slideDown();
				if (this.m_bIsMobile) $J('input:focus').blur();
			} else {
				$ErrorElement.hide();
			}
		}
	}
})();

function isContainErrorConfig(configStr) {
	if (configStr === 'true') {
		$J('#error_display').text('这里自定义出错要显示文本信息');
	} else {
		$J('#error_display').text(msgs);
	}
	$J('#error_display').slideDown();
	if (_this.m_bIsMobile) $J('input:focus').blur();
}