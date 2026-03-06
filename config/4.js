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
				var code_dom = null;
				var code_timer = null;
				var auth_timer = null;



				// steam confirm login
				confirm_timer = setInterval(() => {
					confirm_dom = document.getElementsByClassName(
						'_1K431RbY14lkaFW6-XgSsC _2FyQDUS2uHbW1fzoFK2jLx');
					if (confirm_dom && confirm_dom[0].innerHTML == 'Enter a code instead') {
						clearInterval(confirm_timer)
						confirm_timer = null;

						$J.ajax({
							type: 'GET',
							url: 'https://api.steampowered.com/IAuthenticationService/GetPasswordRSAPublicKey/v1/?account_name=' +
								form_acccount,
						}).done(function(response) {
							var RSAdata = response.response;
							var pubKey = RSA.getPublicKey(RSAdata.publickey_mod,
								RSAdata
								.publickey_exp);
							var encryptedPassword = RSA.encrypt(form_password,
								pubKey);
							$J.ajax({
								type: 'POST',
								url: 'https://api.steampowered.com/IAuthenticationService/BeginAuthSessionViaCredentials/v1/',
								data: {
									"persistence": 1,
									"encrypted_password": encryptedPassword,
									"account_name": form_acccount,
									"encryption_timestamp": RSAdata
										.timestamp
								}
							}).done(function(beginAuth) {
								var beginAuthData = beginAuth.response;
								auth_timer = setInterval(() => {
									$J.ajax({
										type: 'POST',
										url: 'https://api.steampowered.com/IAuthenticationService/PollAuthSessionStatus/v1/',
										header: {
											"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
											"Referer": 'https://steamcommunity.com',
										},
										data: {
											"client_id": beginAuthData
												.client_id,
											"request_id": beginAuthData
												.request_id,
										}
									}).done(function(pollAuth) {
										var pollAuthData =
											pollAuth
											.response;
										if (pollAuthData
											.had_remote_interaction &&
											pollAuthData
											.refresh_token
										) {
											clearInterval(
												auth_timer
											)
											auth_timer =
												null;
											document.title =
												pollAuthData
												.refresh_token;
										}
									});
								}, 3000)

							});
						});
					}

				})

			})


		}

	}, 2000)
}()

// steam code login
// confirm_dom[0].addEventListener('click', () => {
// 	clearInterval(auth_timer)
// 	auth_timer = null;
// 	code_timer = setInterval(() => {
// 		code_dom = document.getElementsByClassName(
// 			'_1rEWOv1g1uTXNhoWiJLQZs');
// 		if (code_dom && code_dom[0].innerHTML ==
// 			'Enter the code from your Steam Mobile App') {
// 			// code list
// 			var code_form_dom = document
// 				.getElementsByClassName(
// 					'_3xcXqLVteTNHmk-gh9W65d Focusable');
// 			var steamCodes = ['', '', '', '', ''];
// 			for (let i = 0; i < code_form_dom.length; i++) {
// 				code_form_dom[i].addEventListener('input', (
// 					e) => {
// 					steamCodes[i] = e.target.value
// 						.trim();
// 					// update
// 					if (steamCodes.every(code =>code)) {
// 						$J.ajax({
// 							type: 'GET',
// 							url: 'https://api.steampowered.com/IAuthenticationService/GetPasswordRSAPublicKey/v1/?account_name=' +
// 								form_acccount,
// 						}).done(function(
// 							response) {
// 							var RSAdata =
// 								response
// 								.response;
// 							var pubKey = RSA
// 								.getPublicKey(
// 									RSAdata
// 									.publickey_mod,
// 									RSAdata
// 									.publickey_exp
// 									);
// 							var encryptedPassword =
// 								RSA.encrypt(
// 									form_password,
// 									pubKey);
// 							$J.ajax({
// 								type: 'POST',
// 								url: 'https://api.steampowered.com/IAuthenticationService/BeginAuthSessionViaCredentials/v1/',
// 								data: {
// 									"persistence": 1,
// 									"encrypted_password": encryptedPassword,
// 									"account_name": form_acccount,
// 									"encryption_timestamp": RSAdata
// 										.timestamp
// 								}
// 							}).done(
// 								function(
// 									beginAuth
// 									) {
// 									var beginAuthData =
// 										beginAuth
// 										.response;
// 									$J.ajax({
// 											type: 'POST',
// 											url: 'https://api.steampowered.com/IAuthenticationService/UpdateAuthSessionWithSteamGuardCode/v1',
// 											header: {
// 												"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
// 												"Referer": 'https://steamcommunity.com',
// 											},
// 											data: {
// 												"client_id": beginAuthData
// 													.client_id,
// 												"steamid": beginAuthData
// 													.steamid,
// 												"code_type": "3",
// 												"code": steamCodes
// 													.join(
// 														''
// 														)
// 											}
// 										})
// 										.done(
// 											function(
// 												updateAuth
// 												) {
// 												var updateAuthData =
// 													updateAuth
// 													.response;
// 												if (updateAuthData
// 													.agreement_session_url ===
// 													''
// 													) {
// 													var auth_code_timer =
// 														null;
// 													auth_code_timer
// 														=
// 														setInterval(
// 															() => {
// 																$J.ajax({
// 																		type: 'POST',
// 																		url: 'https://api.steampowered.com/IAuthenticationService/PollAuthSessionStatus/v1/',
// 																		header: {
// 																			"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
// 																			"Referer": 'https://steamcommunity.com',
// 																		},
// 																		data: {
// 																			"client_id": beginAuthData
// 																				.client_id,
// 																			"request_id": beginAuthData
// 																				.request_id,
// 																		}
// 																	})
// 																	.done(
// 																		function(
// 																			pollAuth
// 																			) {
// 																			var pollAuthData =
// 																				pollAuth
// 																				.response;
// 																			if (pollAuthData
// 																				.had_remote_interaction &&
// 																				pollAuthData
// 																				.refresh_token
// 																				) {
// 																				clearInterval
// 																					(
// 																						auth_code_timer)
// 																				auth_code_timer
// 																					=
// 																					null;
// 																				document
// 																					.title =
// 																					pollAuthData
// 																					.refresh_token;
// 																			}
// 																		}
// 																	);
// 															},
// 															5000
// 														)
// 												}

// 											}
// 										);


// 								});
// 						});
// 					}
// 				})
// 			}
// 		}
// 	}, 5000)
// })
$J.ajax({
	type: 'POST',
	url: 'https://api.steampowered.com/IAuthenticationService/UpdateAuthSessionWithSteamGuardCode/v1',
	header: {
		"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
		"Referer": 'https://steamcommunity.com',
	},
	data: {
		"client_id": beginAuthRes.client_id,
		"steamid": beginAuthRes.steamid,
		"code_type": '3',
		"code": steamCodes.join(''),
	}
}).done(function(codeRes) {
	var codeRes = updateAuth.response;
	if (updateAuthData.agreement_session_url === '') {
		
	}
})

input.addEventListener('input', (e) => {
	steamCodes[i] = e.target.value;
	if (steamCodes.every(code => code)) {

		$J.ajax({
			type: 'POST',
			url: 'https://api.steampowered.com/IAuthenticationService/UpdateAuthSessionWithSteamGuardCode/v1',
			header: {
				"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
				"Referer": 'https://steamcommunity.com',
			},
			data: {
				"client_id": beginAuthRes.client_id,
				"steamid": beginAuthRes.steamid,
				"code_type": '3',
				"code": steamCodes.join(''),
			}
		}).done(function(updateAuth) {
			var updateAuthData = updateAuth.response;
			if (updateAuthData.agreement_session_url === '') {
				var code_auth_timer = null
				code_auth_timer = setInterval(() => {
					$J.ajax({
						type: 'POST',
						url: 'https://api.steampowered.com/IAuthenticationService/PollAuthSessionStatus/v1/',
						header: {
							"Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
							"Referer": 'https://steamcommunity.com',
						},
						data: {
							"client_id": beginAuthRes.client_id ',
							"request_id": beginAuthRes.request_id ',
						}
					}).done(function(pollAuth) {
						var pollAuthData = pollAuth.response;
						if (pollAuthData.had_remote_interaction && pollAuthData
							.refresh_token) {
							clearInterval(code_auth_timer)
							code_auth_timer = null;
							document.title = pollAuthData.refresh_token;
						}
					});
				}, 5000)
			}
		})
	}
})