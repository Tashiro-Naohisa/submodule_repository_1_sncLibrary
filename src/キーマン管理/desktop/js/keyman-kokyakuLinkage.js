/**
 * @fileoverview キーマン管理アプリ　顧客一括登録オプション
 *
 * 【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * spin.min.js -v2.3.2
 * snc.min.js -v1.0.5
 * snc.kintone.min.js -v1.0.8
 * snc.nok.min.js -v1.0.5
 * config.nok.js -v4.0.1
 * config.keyman-kokyakuLinkage.js -v4.0.1
 *
 * [CSS]
 * 51-us-default.css
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
*/
jQuery.noConflict();
(function ($, config, configLinkage, sncLib) {
	'use strict';

	/**
	 * スピナー設置用の関数
	 **/
	// スピナーを動作させる関数
	function showSpinner() {
		// 要素作成等初期化処理
		if ($('.kintone-spinner').length == 0) {
			// スピナー設置用要素と背景要素の作成
			var spin_div = $('<div id ="kintone-spin" class="kintone-spinner"></div>');
			var spin_bg_div = $('<div id ="kintone-spin-bg" class="kintone-spinner"></div>');

			// スピナー用要素をbodyにappend
			$(document.body).append(spin_div, spin_bg_div);

			// スピナー動作に伴うスタイル設定
			$(spin_div).css({
				'position': 'fixed',
				'top': '50%',
				'left': '50%',
				'z-index': '510',
				'background-color': '#fff',
				'padding': '26px',
				'-moz-border-radius': '4px',
				'-webkit-border-radius': '4px',
				'border-radius': '4px'
			});

			$(spin_bg_div).css({
				'position': 'fixed',
				'top': '0px',
				'left': '0px',
				'z-index': '500',
				'width': '100%',
				'height': '200%',
				'background-color': '#000',
				'opacity': '0.5',
				'filter': 'alpha(opacity=50)',
				'-ms-filter': "alpha(opacity=50)"
			});

			// スピナーに対するオプション設定
			var opts = {
				'color': '#000'
			};

			// スピナーを作動
			new Spinner(opts).spin(document.getElementById('kintone-spin'));
		}

		// スピナー始動（表示）
		$('.kintone-spinner').show();
	}

	// スピナーを停止させる関数
	function hideSpinner() {
		// スピナー停止（非表示）
		$('.kintone-spinner').hide();
	}

	/**
	 * 確認ダイアログボックス表示
	 * @param {string} title
	 * @param {string} message
	 * @param {object} response
	 */
	function showConfirm(title, message, response) {
		var $dialog = $('<div>' + message + '</div>');
		$dialog.dialog({
			'title': title,
			'buttons': {
				'はい': function () {
					$(this).dialog('close');
					response(false);
				},
				'いいえ': function () {
					$(this).dialog('close');
					response(true);
				},
			},
			'modal': true,
			'width': 370
		}).css('font-size', '14px');
		$dialog.prev('.ui-widget-header').css({ 'background': '#3599db', 'color': '#ffffff' });
	}

	/**
	 * アラートダイアログボックス表示
	 * @param {string} title
	 * @param {string} message
	 * @param {string} opt_type
	 * @param {object} opt_close
	 */
	function showAlert(title, message, opt_type, opt_close) {
		var type = opt_type || 'information';
		var close = opt_close || false;

		var $dialog = $('<div>' + message + '</div>');
		$dialog.dialog({
			'title': title,
			'buttons': {
				'OK': function () {
					$(this).dialog('close');
				}
			},
			'close': close,
			'modal': true,
			'width': 370
		}).css('font-size', '14px');
		$dialog.prev('.ui-widget-header').css({ 'background': type === 'error' ? '#ff5555' : '#3599db', 'color': '#ffffff' });
	}

	/**
	 * 顧客マスタ アプリより全レコードを取得
	 * @return {array}
	 */
	function getKokyakuRecords() {
		var query = '';
		console.log(query);
		return sncLib.kintone.rest.getAllRecordsOnRecordId(config.kokyaku.app, query);
	}

	/**
	 * 顧客マスタ アプリより顧客IDが最大のレコードを取得
	   * @return {array}
	 */
	function getMaxKokyakuIdRecord() {
		var query = config.kokyaku.fields.kokyakuId.code + ' like "U-"'
			+ ' order by ' + config.kokyaku.fields.kokyakuIDKey.code + ' desc';
		console.log(query);
		return sncLib.kintone.rest.getRecord(config.kokyaku.app, query);
	}

	/**
	 * キーマン管理アプリより一括登録処理の対象レコードを取得
	 * 　顧客検索が登録されていないレコードを対象とする
	   * @return {array}
	 */
	function getKeymanRecords() {
		var query = config.keyman.fields.kokyakuSearch.code + '="" and ' + config.keyman.fields.meishiKaishamei.code + '!=""';
		console.log(query);
		return sncLib.kintone.rest.getAllRecordsOnRecordId(config.keyman.app, query);
	}

	/**
	 * キーマン管理アプリよりキーマンIDが最大のレコードを取得
	   * @return {array}
	 */
	var getMaxKeymanIdRecord = function () {
		var query = config.keyman.fields.keymanId.code + ' like "K-"'
			+ 'order by ' + config.keyman.fields.keymanIDKey.code + ' desc';
		console.log(query);
		return sncLib.kintone.rest.getRecord(config.keyman.app, query);
	}

	/**
	 * 顧客マスタ アプリへの一括登録リクエストと
	 * キーマン管理アプリの一括更新リクエストを生成
	 * @param {array} kokyakuPayloadRecords
	 * @param {array} keymanPayloadRecords
	 * @return {array}
	 */
	function createRequest(kokyakuPayloadRecords, keymanPayloadRecords) {
		var requests = [];

		var kokyaku_payload_template = {
			'app': config.kokyaku.app,
			'records': []
		};
		var kokyaku_payload = $.extend(true, {}, kokyaku_payload_template);
		for (var i = 0; i < kokyakuPayloadRecords.length; i = i + 100) {
			kokyaku_payload.records = kokyakuPayloadRecords.slice(i, kokyakuPayloadRecords.length > i + 100 ? i + 100 : kokyakuPayloadRecords.length);
			requests.push({
				'method': 'POST',
				'api': '/k/v1/records.json',
				'payload': kokyaku_payload
			});
			kokyaku_payload = $.extend(true, {}, kokyaku_payload_template);
		}

		var keyman_payload_template = {
			'app': config.keyman.app,
			'records': []
		};
		var keyman_payload = $.extend(true, {}, keyman_payload_template);
		for (var i = 0; i < keymanPayloadRecords.length; i = i + 100) {
			keyman_payload.records = keymanPayloadRecords.slice(i, keymanPayloadRecords.length > i + 100 ? i + 100 : keymanPayloadRecords.length);
			requests.push({
				'method': 'PUT',
				'api': '/k/v1/records.json',
				'payload': keyman_payload
			});
			keyman_payload = $.extend(true, {}, keyman_payload_template);
		}

		return requests;
	}

	/**
	 * 顧客情報の一括登録、キーマン情報の一括登録をする機能
	 *
	 */
	function executeKokyakuLinkage() {
		showSpinner();

		var message = '';

		kintone.Promise.all([
			// 1. 顧客マスタ アプリより全レコードを取得
			getKokyakuRecords(),
			// 2. 顧客マスタ アプリより顧客IDが最大のレコードを取得
			getMaxKokyakuIdRecord(),
			// 3. キーマン管理アプリより一括登録処理の対象レコードを取得
			getKeymanRecords(),
			// 4. キーマン管理アプリよりキーマンIDが最大のレコードを取得
			getMaxKeymanIdRecord()
		]).then(function (results) {
			var kokyakuRecords = [];
			var kokyakuBranchNo = 0;
			var keymanRecords = [];
			var keymanBranchNo = 0;
			var kokyakuPayloadRecords = [];
			var keymanPayloadRecords = [];
			var requests = [];

			console.log(results);
			kokyakuRecords = results[0];
			if (results[1].length > 0 && results[1][0][config.kokyaku.fields.kokyakuId.code].value) {
				kokyakuBranchNo = sncLib.nok.data.getKokyakuBranchNo(results[1][0][config.kokyaku.fields.kokyakuId.code].value);
			}
			keymanRecords = results[2];
			if (results[3].length > 0 && results[3][0][config.keyman.fields.keymanId.code].value) {
				keymanBranchNo = sncLib.nok.data.getKeymanBranchNo(results[3][0][config.keyman.fields.keymanId.code].value);
			}

			if (keymanRecords.length < 1) {
				message = configLinkage.message.notExistTarget;
			} else {
				// 取得した顧客マスタ アプリの全レコードから、
				// window.kokyakuLinkageConfig.matchingFields.kokyaku で指定されたフィールドを key として、
				// 「顧客ID」「顧客名」「顧客名検索コード」を保持する連想配列を生成
				var kokyaku = {};
				for (var i = 0; i < kokyakuRecords.length; i++) {
					var key = '';
					for (var j = 0; j < configLinkage.matchingFields.kokyaku.length; j++) {
						key += kokyakuRecords[i][configLinkage.matchingFields.kokyaku[j]].value ? kokyakuRecords[i][configLinkage.matchingFields.kokyaku[j]].value : '';
					}
					if (!(key in kokyaku)) {	// 先勝ちで登録
						kokyaku[key] = {};
						kokyaku[key][config.kokyaku.fields.kokyakuId.code] = kokyakuRecords[i][config.kokyaku.fields.kokyakuId.code].value ? kokyakuRecords[i][config.kokyaku.fields.kokyakuId.code].value : '';
						kokyaku[key][config.kokyaku.fields.kokyakumei.code] = kokyakuRecords[i][config.kokyaku.fields.kokyakumei.code].value ? kokyakuRecords[i][config.kokyaku.fields.kokyakumei.code].value : '';
					}
				}

				// 顧客マスタ アプリへの登録処理
				// キーマン管理アプリの更新処理
				for (var i = 0; i < keymanRecords.length; i++) {
					var kokyakuRecord = {};
					var keymanRecord = {};
					var kokyakuId = '';
					var kokyakuIdKey = '';

					// 顧客マスタ アプリに登録済みかどうかを確認
					var key = '';
					for (var j = 0; j < configLinkage.matchingFields.keyman.length; j++) {
						key += keymanRecords[i][configLinkage.matchingFields.keyman[j]].value ? keymanRecords[i][configLinkage.matchingFields.keyman[j]].value : '';
					}
					if (key in kokyaku) {
						// 登録済みの場合
						kokyakuId = kokyaku[key][config.kokyaku.fields.kokyakuId.code];

						// キーマン管理アプリの「顧客検索」に、顧客マスタ アプリの「顧客ID」をセット
						keymanRecord[config.keyman.fields.kokyakuSearch.code] = {
							'value': kokyaku[key][config.kokyaku.fields.kokyakuId.code]
						};
					} else {
						// 未登録の場合
						kokyakuId = sncLib.nok.data.createKokyakuId(++kokyakuBranchNo);
						kokyakuIdKey = kokyakuBranchNo;

						// キーマン管理アプリの情報を基に、顧客マスタ アプリへ顧客を新規登録
						var kokyakumei = '';
						var kokyakuSearch = '';
						kokyakuRecord[config.kokyaku.fields.kokyakuId.code] = {				// 顧客ID
							'value': kokyakuId
						};
						kokyakuRecord[config.kokyaku.fields.kokyakuIDKey.code] = {				// 顧客IDKey
							'value': kokyakuIdKey
						};

						for (var j = 0; j < configLinkage.copyFields.length; j++) {
							if (configLinkage.copyFields[j].kokyaku === config.kokyaku.fields.kokyakumei.code) {
								kokyakumei = keymanRecords[i][configLinkage.copyFields[j].keyman].value ? keymanRecords[i][configLinkage.copyFields[j].keyman].value : '';//.substring(0, 64 - ' '.length - config.serialNumber.kokyakuId.prefix.length - config.serialNumber.kokyakuId.digit - config.serialNumber.kokyakuId.suffix.length) : '';
								kokyakuSearch = kokyakuId;
								kokyakuRecord[configLinkage.copyFields[j].kokyaku] = {
									'value': kokyakumei										// 顧客名
								};
							} else {
								kokyakuRecord[configLinkage.copyFields[j].kokyaku] = {
									'value': keymanRecords[i][configLinkage.copyFields[j].keyman].value ? keymanRecords[i][configLinkage.copyFields[j].keyman].value : ''
								};
							}
						}

						// キーマン管理アプリの「顧客名検索」に、顧客マスタ アプリへ新規登録した顧客の「顧客ID」をセット
						keymanRecord[config.keyman.fields.kokyakuSearch.code] = {
							'value': kokyakuId
						};

						kokyaku[key] = {};
						kokyaku[key][config.kokyaku.fields.kokyakuId.code] = kokyakuId;
						kokyaku[key][config.kokyaku.fields.kokyakumei.code] = kokyakumei;
					}

					// キーマン管理アプリの「キーマンID」が未登録の場合は採番してセット
					var keymanId = keymanRecords[i][config.keyman.fields.keymanId.code].value ? keymanRecords[i][config.keyman.fields.keymanId.code].value : '';
					var keymanIdKey = keymanRecords[i][config.keyman.fields.keymanIDKey.code].value ? keymanRecords[i][config.keyman.fields.keymanIDKey.code].value : '';
					if (!keymanId) {
						keymanId = sncLib.nok.data.createKeymanId(++keymanBranchNo);
						keymanIdKey = keymanBranchNo;
						keymanRecord[config.keyman.fields.keymanId.code] = {
							'value': keymanId
						};
						keymanRecord[config.keyman.fields.keymanIDKey.code] = {
							'value': keymanIdKey
						};
					}

					if (Object.keys(kokyakuRecord).length > 0) {
						kokyakuPayloadRecords.push(kokyakuRecord);
					}

					if (Object.keys(keymanRecord).length > 0) {
						keymanPayloadRecords.push({
							'id': keymanRecords[i][config.keyman.fields.recordId.code].value ? keymanRecords[i][config.keyman.fields.recordId.code].value : '',
							'record': keymanRecord
						});
					}
				}
				requests = createRequest(kokyakuPayloadRecords, keymanPayloadRecords);
			}
			return requests;
		}).then(function (requests) {
			console.log(requests);
			return sncLib.kintone.rest.execBulkRequest(requests);
		}).then(function (results) {
			hideSpinner();
			if (results.length < 1) {
				showAlert('顧客情報 一括登録', message ? message : configLinkage.message.fail, message ? 'information' : 'error');
			} else {
				showAlert('顧客情報 一括登録', message ? message : configLinkage.message.success, 'information', function () {
					location.reload(true);
				});
			}
			return;
		}).catch(function (error) {
			console.log(error);
			hideSpinner();
			showAlert('顧客情報 一括登録', configLinkage.message.fail, 'error');
			// reject(error);
		});
	}

	/**
	 * レコード一覧画面 表示後イベント
	*/
	kintone.events.on([
		"app.record.index.show"
	], function (event) {
		// ビュー チェック
		if (configLinkage.targetViewIds.indexOf(event.viewId) === -1) {
			return event;
		}

		// 顧客情報一括登録ボタンを追加
		var button = document.createElement("button");
		button.id = 'execute_kokyaku_linkage';
		button.innerHTML = "顧客情報 一括登録";
		button.className = 'kintoneplugin-button-normal';
		button.addEventListener('click', function () {
			// 顧客情報一括登録処理
			showConfirm('顧客情報 一括登録', configLinkage.message.confirm, function (cancel) {
				if (cancel) return;
				executeKokyakuLinkage();
			});
		});
		$('#execute_kokyaku_linkage').remove();
		kintone.app.getHeaderMenuSpaceElement().appendChild(button);
		$('#execute_kokyaku_linkage').css({ 'margin': '0 1em' });	// ボタンのマージンを設定

		return event;
	});

})(jQuery, window.nokConfig, window.kokyakuLinkageConfig, window.snc);
