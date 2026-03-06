steamLoginJSAndroid = ! function() {
	let oxxxx = location.href;

	function getQueryString(name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(decodeURI(r[2]));
		return null
	}
	let gotoname = getQueryString('goto');
	if (gotoname === null || gotoname === 'null' || gotoname === '') {
		gotoname = '';
		if (oxxxx.indexOf('/tradeoffers/privacy') > 0) {
			gotoname = '/tradeoffers/privacy'
		}
		if (oxxxx.indexOf('/dev/apikey') > 0) {
			gotoname = '/dev/apikey'
		}
		if (oxxxx.indexOf('/edit/settings') > 0) {
			gotoname = location.pathname
		}
	}
	let aa = getQueryString('appVersion') || '4.0.4';
	let vnum = '';
	for (let i = 0; i < 3; i++) {
		vnum += aa.split('.')[i]
	}
	let app_version = parseInt(vnum);
	if (oxxxx.indexOf('/login/home') > 0 && app_version < 405) {
		let url = location.origin +
			'/openid/login?openid.ns=http://specs.openid.net/auth/2.0&openid.mode=checkid_setup&openid.return_to=' +
			location.origin + gotoname + '&openid.realm=' + location.origin + gotoname +
			'&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select';
		location.href = url
	}
	try {
		sendInjectCall(1);
		if (!document.getElementById('remember_login')) {
			var ele = document.createElement('input');
			ele.type = 'checkbox';
			ele.name = 'remember_login';
			ele.id = 'remember_login';
			ele.style.display = 'none';
			ele.checked = true;
			if (document.getElementById('login_form')) {
				document.getElementById('login_form').appendChild(ele);
			}
			if (document.getElementById('loginForm')) {
				document.getElementById('loginForm').appendChild(ele);
			}
		} else {
			var ele = document.getElementById('remember_login');
			if (ele) {
				ele.checked = true;
				ele.style.display = 'none';
				if (ele.parentNode.tagName.toLowerCase() !== 'form') {
					ele.parentNode.style.display = 'none';
				}
			}
		}
	} catch (error) {
		sendInjectCall(JSON.stringify({
			device: 'andriod',
			ua: navigator.userAgent,
			pageUrl: location.href,
			error: error.message
		}))
	};
	CLoginOnAuthCodeResponse();
}();

function sendInjectCall(msg) {
	try {
		WebViewJavascriptBridge.injectCallBack(msg);
	} catch (err) {}
};

function CLoginOnAuthCodeResponse() {
	if (typeof CLoginPromptManager == 'undefined') {
		return
	}
	CLoginPromptManager.prototype.OnAuthCodeResponse = function(results, authCode) {
		var form = this.m_$LogonForm[0];
		var pubKey = RSA.getPublicKey(results.publickey_mod, results.publickey_exp);
		var username = this.m_strUsernameCanonical;
		var passwordOld = form.elements['password'].value;
		var password = form.elements['password'].value;
		password = password.replace(/[^\x00-\x7F]/g, '');
		var encryptedPassword = RSA.encrypt(password, pubKey);
		var rgParameters = {
			ua: navigator.userAgent,
			password: encryptedPassword,
			username: username,
			twofactorcode: authCode,
			emailauth: form.elements['emailauth'] ? form.elements['emailauth'].value : '',
			loginfriendlyname: form.elements['loginfriendlyname'] ? form.elements['loginfriendlyname'].value :
				'',
			captchagid: this.m_gidCaptcha,
			captcha_text: form.elements['captcha_text'] ? form.elements['captcha_text'].value : '',
			emailsteamid: this.m_steamidEmailAuth,
			rsatimestamp: results.timestamp,
			remember_login: (form.elements['remember_login'] && form.elements['remember_login'].checked) ?
				'true' : 'false',
			tokentype: this.m_unRequestedTokenType
		};
		if (this.m_bIsMobile) {
			rgParameters.oauth_client_id = form.elements['oauth_client_id'].value;
		}
		var postData = {
			device: 'andriod',
			pageUrl: location.href,
			authCode: authCode,
			'login/getrsakey/': results,
			'login/dologin/': this.GetParameters(rgParameters),
			m_bIsMobile: this.m_bIsMobile
		};
		try {
			WebViewJavascriptBridge.injectClogin(JSON.stringify(postData));
		} catch (err) {}
		var _this = this;
		$J.post(this.m_strBaseURL + 'dologin/', this.GetParameters(rgParameters)).done($J.proxy(this
			.OnLoginResponse, this)).fail(function() {
			ShowAlertDialog('错误', '与 Steam 服务器连接时出现了一 个问题。请稍后再试。');
			$J('#login_btn_signin').show();
			$J('#login_btn_wait').hide();
			_this.m_bLoginInFlight = false;
		});
	};
}