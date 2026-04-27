/**
 * @fileoverview 顧客マスタアプリ　名寄せ
 * 顧客IDを利用した名寄せに変更
 * レコードが1万件以上取得可能
 * 営業アプリとの連携対応
 *
 *【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * jquery-ui.min.js -v1.12.1
 * luxon.min.js -v3.1.1
 * snc.min.js -v1.0.5
 * snc.kintone.min.js -v1.0.8
 * snc.nok.min.js -v1.0.5
 * config.nok.js -v4.0.1
 * config.kokyaku-nayose.js -v4.0.1
 *
 * [CSS]
 * jquery-ui.css -v1.12.1
 * nayose.css
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
jQuery.noConflict();
(function ($, config, configNayose, configLinkage, sncLib) {
	'use strict';

	luxon.Settings.defaultLocale = 'ja';

	/**
	 * フィールドの値を取得
	 * @param {object} field
	 */
	function getFieldValue(field) {
		var value = '';
		switch (field.type) {
			case 'CREATOR':
			case 'MODIFIER':
				value = field.value.name;
				break;
			case 'CREATED_TIME':
			case 'UPDATED_TIME':
			case 'DATETIME':
				value = luxon.DateTime.fromSQL((field.value + '/01').replace(/\//g, '-')).toFormat('yyyy-MM-dd HH:mm');
				break;
			case 'CHECK_BOX':
			case 'MULTI_SELECT':
			case 'CATEGORY':
				for (var i = 0; i < field.value.length; i++) {
					if (value.length > 0) value += '、';
					value += field.value[i];
				}
				break;
			case 'FILE':
			case 'USER_SELECT':
			case 'STATUS_ASSIGNEE':
			case 'ORGANIZATION_SELECT':
			case 'GROUP_SELECT':
				for (var i = 0; i < field.value.length; i++) {
					if (value.length > 0) value += '、';
					value += field.value[i].name;
				}
				break;
			case 'SUBTABLE':
				break;
			default:
				value = field.value;
				break;
		}
		return value;
	};

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
	};

	/**
	 * キーマン管理アプリから更新対象のレコードを取得
	 * @param {string} kokyakuId
	 * @return {array}
	 */
	function getKeymanRecords(kokyakuId) {
		var query = config.keyman.fields.kokyakuId.code + '="' + kokyakuId + '"';
		console.log(query);
		return sncLib.kintone.rest.getAllRecordsOnRecordId(config.keyman.app, query);
	};

	/**
	 * 案件管理アプリから更新対象のレコードを取得
	 * @param {string} kokyakuId
	 * @return {array}
	 */
	function getAnkenRecords(kokyakuId) {
		var query = config.anken.fields.kokyakuId.code + '="' + kokyakuId + '"';
		console.log(query);
		return sncLib.kintone.rest.getAllRecordsOnRecordId(config.anken.app, query);
	};

	/**
	 * 営業レポート アプリから更新対象のレコードを取得
	 * @param {string} kokyakuId
	 * @param {array} keymanRecords
	 * @param {array} ankenRecords
	 * @return {array}
	 */
	function getEigyoReportRecords(kokyakuId, keymanRecords, ankenRecords) {
		var ids = '';
		var query = config.eigyoRepoto.fields.kokyakuId.code + '="' + kokyakuId + '"';
		ids = '';
		for (var i = 0; i < keymanRecords.length; i++) {
			if (ids.length > 0) ids += ',';
			ids += '"' + keymanRecords[i][config.keyman.fields.keymanId.code].value + '"';
		}
		if (ids.length > 0) query += ' or ' + config.eigyoRepoto.fields.keymanId.code + ' in (' + ids + ')';
		ids = '';
		for (var i = 0; i < ankenRecords.length; i++) {
			if (ids.length > 0) ids += ',';
			ids += '"' + ankenRecords[i][config.anken.fields.ankenId.code].value + '"';
		}
		if (ids.length > 0) query += ' or ' + config.eigyoRepoto.fields.ankenId.code + ' in (' + ids + ')';
		console.log(query);
		return sncLib.kintone.rest.getAllRecordsOnRecordId(config.eigyoRepoto.app, query);
	};

	/**
	 * お問合せクレーム アプリから更新対象のレコードを取得
	 * @param {string} kokyakuId
	 * @return {array}
	 */
	function getToiawaseRecords(kokyakuId) {
		var query = config.toiawase.fields.kokyakuId.code + '="' + kokyakuId + '"';
		console.log(query);
		return sncLib.kintone.rest.getAllRecordsOnRecordId(config.toiawase.app, query);
	};

	/**
	 * キーマン管理アプリの一括更新リクエストを生成
	 * @param {array} keymanRecords
	 * @param {string} remainKokyakuId
	 * @return {array}
	 */
	function createKeymanUpdateRequest(keymanRecords, remainKokyakuId) {
		if (keymanRecords.length < 1) return [];

		var requests = [];
		var payload_template = {
			'app': config.keyman.app,
			'records': []
		};
		var payload = $.extend(true, {}, payload_template);

		for (var i = 0; i < keymanRecords.length; i++) {
			var record = {};

			// 顧客名検索コード：「残すデータの顧客名検索コード」をそのままセット
			record[config.keyman.fields.kokyakuSearch.code] = {
				'value': remainKokyakuId
			};

			payload.records.push({
				'id': keymanRecords[i]['$id'].value,
				'record': record
			});

			if (payload.records.length === 100) {
				// 更新レコード数が上限に達した場合、リクエスト追加
				requests.push({
					'method': 'PUT',
					'api': '/k/v1/records.json',
					'payload': payload
				});
				// 初期化
				payload = $.extend(true, {}, payload_template);
			}
		}

		if (payload.records.length > 0) {
			// 更新レコードが存在する場合、リクエスト追加
			requests.push({
				'method': 'PUT',
				'api': '/k/v1/records.json',
				'payload': payload
			});
		}
		return requests;
	};

	/**
	 * 案件管理アプリの一括更新リクエストを生成
	 * @param {array} ankenRecords
	 * @param {string} remainKokyakuId
	 * @param {string} deleteKokyakuId
	 * @return {array}
	 */
	function createAnkenUpdateRequest(ankenRecords, remainKokyakuId, deleteKokyakuId) {
		if (ankenRecords.length < 1) return [];

		var requests = [];
		var payload_template = {
			'app': config.anken.app,
			'records': []
		};
		var payload = $.extend(true, {}, payload_template);

		for (var i = 0; i < ankenRecords.length; i++) {
			var record = {};

			var ankenKokyakuId = ankenRecords[i][config.anken.fields.kokyakuId.code].value ? ankenRecords[i][config.anken.fields.kokyakuId.code].value : '';
			if (deleteKokyakuId === ankenKokyakuId) {
				// 削除されるデータの顧客IDと顧客IDが一致する場合
				// 顧客名検索：「残すデータの顧客ID」をそのままセット
				record[config.anken.fields.kokyakuSearch.code] = {
					'value': remainKokyakuId
				};
			}

			if (Object.keys(record).length > 0) {
				payload.records.push({
					'id': ankenRecords[i]['$id'].value,
					'record': record
				});
			}

			if (payload.records.length === 100) {
				// 更新レコード数が上限に達した場合、リクエスト追加
				requests.push({
					'method': 'PUT',
					'api': '/k/v1/records.json',
					'payload': payload
				});
				// 初期化
				payload = $.extend(true, {}, payload_template);
			}
		}

		if (payload.records.length > 0) {
			// 更新レコードが存在する場合、リクエスト追加
			requests.push({
				'method': 'PUT',
				'api': '/k/v1/records.json',
				'payload': payload
			});
		}
		return requests;
	};

	/**
	 * 営業レポート アプリの一括更新リクエストを生成
	 * @param {array} eigyoreportRecords
	 * @param {string} remainKokyakuId
	 * @param {string} deleteKokyakuId
	 * @param {array} keymanRecords
	 * @param {array} ankenRecords
	 * @return {array}
	 */
	function createEigyoReportUpdateRequest(eigyoreportRecords, remainKokyakuId, deleteKokyakuId, keymanRecords, ankenRecords) {
		if (eigyoreportRecords.length < 1) return [];

		var requests = [];
		var payload_template = {
			'app': config.eigyoRepoto.app,
			'records': []
		};
		var payload = $.extend(true, {}, payload_template);
		var keyman = {};	// key:keymanId value:[keymanId]
		var anken = {};		// key:ankenId value:[ankenId]

		for (var i = 0; i < keymanRecords.length; i++) {
			if (keymanRecords[i][config.keyman.fields.keymanId.code].value)
				keyman[keymanRecords[i][config.keyman.fields.keymanId.code].value] = [keymanRecords[i][config.keyman.fields.keymanId.code].value ? keymanRecords[i][config.keyman.fields.keymanId.code].value : '', keymanRecords[i][config.keyman.fields.keymanmei.code].value ? keymanRecords[i][config.keyman.fields.keymanmei.code].value : ''];
		}

		for (var i = 0; i < ankenRecords.length; i++) {
			if (ankenRecords[i][config.anken.fields.ankenId.code].value)
				anken[ankenRecords[i][config.anken.fields.ankenId.code].value] = ankenRecords[i][config.anken.fields.ankenmei.code].value ? ankenRecords[i][config.anken.fields.ankenmei.code].value : '';
		}

		for (var i = 0; i < eigyoreportRecords.length; i++) {
			var record = {};

			var kokyakuId = eigyoreportRecords[i][config.eigyoRepoto.fields.kokyakuId.code].value ? eigyoreportRecords[i][config.eigyoRepoto.fields.kokyakuId.code].value : '';
			if (deleteKokyakuId === kokyakuId) {
				// 削除されるデータの顧客IDと顧客IDが一致する場合
				// 顧客名検索：「残すデータの顧客ID」をそのままセット
				record[config.eigyoRepoto.fields.kokyakuSearch.code] = {
					'value': remainKokyakuId
				};
			}

			var update = false;
			var keymanTable = eigyoreportRecords[i][config.eigyoRepoto.fields.keymanTable.code].value;
			for (var j = 0; j < keymanTable.length; j++) {
				var keymanId = keymanTable[j].value[config.eigyoRepoto.fields.keymanId.code].value;
				// 面談者検索：「残すデータのキーマンID」をセット
				keymanTable[j].value[config.eigyoRepoto.fields.keymanSearch.code].value = keymanId;
				update = true;
			}
			if (update) {
				record[config.eigyoRepoto.fields.keymanTable.code] = {
					'value': keymanTable
				};
			}

			var ankenId = eigyoreportRecords[i][config.eigyoRepoto.fields.ankenId.code].value ? eigyoreportRecords[i][config.eigyoRepoto.fields.ankenId.code].value : '';
			// 案件検索：「残すデータの案件ID」をセット
			record[config.eigyoRepoto.fields.ankenSearch.code] = {
				'value': ankenId
			};

			if (Object.keys(record).length > 0) {
				payload.records.push({
					'id': eigyoreportRecords[i]['$id'].value,
					'record': record
				});
			}

			if (payload.records.length === 100) {
				// 更新レコード数が上限に達した場合、リクエスト追加
				requests.push({
					'method': 'PUT',
					'api': '/k/v1/records.json',
					'payload': payload
				});
				// 初期化
				payload = $.extend(true, {}, payload_template);
			}
		}

		if (payload.records.length > 0) {
			// 更新レコードが存在する場合、リクエスト追加
			requests.push({
				'method': 'PUT',
				'api': '/k/v1/records.json',
				'payload': payload
			});
		}
		return requests;
	};

	/**
	 * お問合せクレーム アプリの一括更新リクエストを生成
	 * @param {array} toiawaseRecords
	 * @param {string} remainKokyakuId
	 * @return {array}
	 */
	function createToiawaseUpdateRequest(toiawaseRecords, remainKokyakuId) {
		if (toiawaseRecords.length < 1) return [];

		var requests = [];
		var payload_template = {
			'app': config.toiawase.app,
			'records': []
		};
		var payload = $.extend(true, {}, payload_template);

		for (var i = 0; i < toiawaseRecords.length; i++) {
			var record = {};

			// 顧客検索：「残すデータの顧客ID」をそのままセット
			record[config.toiawase.fields.kokyakuSearch.code] = {
				'value': remainKokyakuId
			};

			payload.records.push({
				'id': toiawaseRecords[i]['$id'].value,
				'record': record
			});

			if (payload.records.length === 100) {
				// 更新レコード数が上限に達した場合、リクエスト追加
				requests.push({
					'method': 'PUT',
					'api': '/k/v1/records.json',
					'payload': payload
				});
				// 初期化
				payload = $.extend(true, {}, payload_template);
			}
		}

		if (payload.records.length > 0) {
			// 更新レコードが存在する場合、リクエスト追加
			requests.push({
				'method': 'PUT',
				'api': '/k/v1/records.json',
				'payload': payload
			});
		}
		return requests;
	};

	/**
	 * 顧客マスタ アプリの削除リクエストを生成
	 * @param {number} deleteRecordNo
	 */
	function createKokyakuDeleteRequest(deleteRecordNo) {
		return [{
			'method': 'DELETE',
			'api': '/k/v1/records.json',
			'payload': {
				'app': config.kokyaku.app,
				'ids': [deleteRecordNo]
			}
		}];
	};

	/**
	 * 名寄せ処理実行
	 * @param {Object} event
	 * @param {Number} remainRowIndex
	 * @param {Number} deleteRowIndex
	 */
	function executeNayose(event, remainRowIndex, deleteRowIndex) {
		var remainKokyakuId = event.records[remainRowIndex][config.kokyaku.fields.kokyakuId.code].value ? event.records[remainRowIndex][config.kokyaku.fields.kokyakuId.code].value : '';
		var deleteKokyakuId = event.records[deleteRowIndex][config.kokyaku.fields.kokyakuId.code].value ? event.records[deleteRowIndex][config.kokyaku.fields.kokyakuId.code].value : '';
		var keymanRecords = [];
		var ankenRecords = [];
		var eigyoreportRecords = [];

		console.log('残すデータ　　：' + remainKokyakuId);
		console.log('削除するデータ：' + deleteKokyakuId);

		return new kintone.Promise(function (resolve, reject) {
			// 1. 各アプリから更新対象のレコードを取得
			// 1.1 キーマン管理アプリから更新対象のレコードを取得
			resolve(getKeymanRecords(deleteKokyakuId));
		}).then(function (result) {
			keymanRecords = result;
			console.log(keymanRecords);
			// 1.2 案件管理アプリから更新対象のレコードを取得
			return getAnkenRecords(deleteKokyakuId);
		}).then(function (result) {
			ankenRecords = result;
			console.log(ankenRecords);
			// 1.3 営業レポート アプリから更新対象のレコードを取得
			return getEigyoReportRecords(deleteKokyakuId, keymanRecords, ankenRecords);
		}).then(function (result) {
			eigyoreportRecords = result;
			console.log(eigyoreportRecords);
			// 1.4 お問合せクレーム アプリから更新対象のレコードを取得
			return getToiawaseRecords(deleteKokyakuId);
		}).then(function (toiawaseRecords) {
			console.log(toiawaseRecords);
			var requests = [];
			// 2. 各アプリの更新リクエストを生成
			// 2.1 キーマン管理アプリの一括更新リクエストを生成
			requests = requests.concat(createKeymanUpdateRequest(keymanRecords, remainKokyakuId));
			// 2.2 案件管理アプリの一括更新リクエストを生成
			requests = requests.concat(createAnkenUpdateRequest(ankenRecords, remainKokyakuId, deleteKokyakuId));
			// 2.3 営業レポート アプリの一括更新リクエストを生成
			requests = requests.concat(createEigyoReportUpdateRequest(eigyoreportRecords, remainKokyakuId, deleteKokyakuId, keymanRecords, ankenRecords));
			// 2.4 お問合せクレーム アプリの一括更新リクエストを生成
			requests = requests.concat(createToiawaseUpdateRequest(toiawaseRecords, remainKokyakuId));
			// 3. 顧客マスタ アプリの削除リクエストを生成
			requests = requests.concat(createKokyakuDeleteRequest(event.records[deleteRowIndex][config.kokyaku.fields.recordNo.code].value));
			console.log(requests);
			return requests;
		}).then(function (requests) {
			// 4. リクエストを実行
			return sncLib.kintone.rest.execBulkRequest(requests);
		}).then(function () {
			// 5. 顧客アプリと営業報告アプリ再連携（訪問履歴の更新）を実行
			return window.snc.eigyoKokyakuLinkage(event, config, configLinkage, remainKokyakuId);
		}).then(function () {
			showAlert('名寄せ実行', 'データの更新が完了しました。', 'information', function () {
				$('#dialog_pain').dialog('close');
				location.reload(true);
			});
			return;
		}).catch(function (error) {
			console.log(error);
			$('.nortification').html('※利用しない方のデータは削除されます。');
			showAlert('名寄せ実行', 'データの更新に失敗しました。', 'error', function () {
				$('#dialog_pain').dialog('close');
			});
			// reject(error);
		});
	};

	/**
	 * 名寄せダイアログ表示
	 * @param {Object} event
	 */
	function showNayoseDialog(event) {
		// 名寄せダイアログボックスを生成
		var $dialog_pain = $('<div id="dialog_pain"></div>');
		var $pains = $('<div id="pains"></div>');
		$(':checkbox[name="row_index"]:checked').each(function (index) {
			var row_index = parseInt($(this).val(), 10);
			var record = event.records[row_index];
			var align = index === 0 ? 'left' : 'right';
			var number = index === 0 ? 1 : 2;
			var $pain = $('<div id="pain_' + align + '"><h3 class="title">' + number + 'つ目のデータ</h3></div>');
			var $dl = $('<dl>');
			for (var i = 0; i < configNayose.dialogItems.length; i++) {
				$dl.append($('<dt>' + sncLib.util.escapeHtml(configNayose.dialogItems[i].label) + '</dt>'));
				var dd = '';
				for (var j = 0; j < configNayose.dialogItems[i].fields.length; j++) {
					if (dd !== '') dd += ' ';
					dd += getFieldValue(record[configNayose.dialogItems[i].fields[j]]);
				}
				if (dd === '') {
					dd = '&nbsp';
				} else {
					dd = sncLib.util.escapeHtml(dd);
				}
				$dl.append($('<dd>' + dd + '</dd>'));
			}
			$dl.append($('</dl>'));
			var $button = $('<div id="select_pain_' + align + '" class="select_pain unit-button unit-button-danger" data-row_index="' + row_index + '"><a href="javascript:void(0);" >' + number + 'つ目のデータを利用する</a></div>');
			$pain.append($dl);
			$pain.append($button);
			$pains.append($pain);
		});
		$pains.append('<p class="nortification" style="padding-top:20px; clear:both; text-align:center">※利用しない方のデータは削除されます。</p>');
		$dialog_pain.append($pains);
		$('#dialog_pain').remove();
		var aNode = kintone.app.getHeaderMenuSpaceElement();
		$(aNode).append($dialog_pain);

		$('div#pain_left,div#pain_right').find('div.select_pain').on('click', function () {
			$pains.find('.select_pain').addClass('unit-button-disabled');
			$('.ui-dialog-titlebar-close').prop('disabled', true);
			$('.nortification').html('処理を実行しています。しばらくこのままでお待ち下さい。');
			var remainRowIndex = parseInt($(this).data('row_index'), 10);
			var deleteRowIndex;
			$(':checkbox[name="row_index"]:checked').each(function () {
				var rowIndex = parseInt($(this).val(), 10);
				if (remainRowIndex !== rowIndex) {
					deleteRowIndex = rowIndex;
				}
			});

			// 名寄せ処理を実行
			executeNayose(event, remainRowIndex, deleteRowIndex);
		});

		// 名寄せダイアログボックスを表示
		$('#dialog_pain').dialog({
			'closeText': 'キャンセル',
			'closeOnEscape': false,
			'title': '利用するデータを選択して下さい',
			'modal': true,
			'width': '900px'
		}).css('font-size', '14px');
		$('#dialog_pain').prev('.ui-widget-header').css({ 'background': '#3599db', 'color': '#ffffff' });
	};

	/**
	 * レコード一覧画面 表示後イベント
	 */
	kintone.events.on([
		"app.record.index.show"
	], function (event) {
		// 管理ユーザー チェック
		var loginUser = kintone.getLoginUser();
		if (config.nayose_kanriUsers.indexOf(loginUser.code) === -1) {
			return event;
		}
		// ビュー チェック
		if (configNayose.targetViewIds.indexOf(event.viewId) === -1) {
			return event;
		}

		// レコード番号列にチェックボックスを追加
		var aNodes = kintone.app.getFieldElements(config.kokyaku.fields.recordNo.code);
		for (var i = 0; i < event.records.length; i++) {
			// 名寄せ必須項目チェック
			var requireFields = 'OK';
			for (var j = 0; j < configNayose.requireFields.length; j++) {
				if (!getFieldValue(event.records[i][configNayose.requireFields[j]])) {
					// 名寄せ必須項目がブランクの場合
					requireFields = 'NG';
					break;
				}
			}
			// 名寄せ必須項目が全て入力されている場合、チェックボックスを追加
			if (requireFields === 'OK') {
				var $cell = $(aNodes[i]).children('div:first').children('span:first');
				var $checkbox = $('<input type="checkbox" name="row_index" value="' + i + '">');
				$cell.prepend($checkbox);
				$cell.wrap("<label/>");
			}
		}

		// 名寄せ実行ボタンを追加
		var $show_nayose_dialog = $('<div id="show_nayose_dialog" class="unit-button unit-button-danger"><a href="javascript:void(0)">選択したデータで名寄せ実行</a>');
		$show_nayose_dialog.on('click', function (clickEvent) {
			var checkedRecordCount = $(':checkbox[name="row_index"]:checked').length;
			if (checkedRecordCount !== 2) {
				var message;
				switch (checkedRecordCount) {
					case 0:
						message = 'データが選択されていません。<br/>一覧から2件をチェックして選択してください。';
						break;
					case 1:
						message = '比較対象がありません。<br/>一覧から2件選択してください。';
						break;
					default:
						message = 'データが' + checkedRecordCount + '件選択されています。<br/>2件選択してください。';
						break;
				}
				showAlert('名寄せ選択', message, 'error');
				return;
			}
			clickEvent.preventDefault();

			// 名寄せダイアログボックスを表示
			showNayoseDialog(event);
		});
		$('#show_nayose_dialog').remove();
		var aNode = kintone.app.getHeaderMenuSpaceElement();
		$(aNode).append($show_nayose_dialog);

		return event;
	});
})(jQuery, window.nokConfig, window.kokyakuNayoseConfig, window.kokyakuLinkageConfig, window.snc);
