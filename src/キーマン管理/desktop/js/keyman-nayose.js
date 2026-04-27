/**
 * @fileoverview キーマン管理アプリ　名寄せ
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
 * config.keyman-nayose.js -v4.0.1
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
(function ($, config, configNayose, sncLib) {
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
				value = luxon.DateTime.fromSQL(field.value).toFormat('yyyy-MM-dd HH:mm');
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
	 * 営業レポート アプリから更新対象のレコードを取得
	 * @param {string} keymanSearch
	 * @return {array}
	 */
	function getEigyoReportRecords(keymanId) {
		var query = config.eigyoRepoto.fields.keymanId.code + ' in ("' + keymanId + '")';
		console.log(query);
		return sncLib.kintone.rest.getAllRecords(config.eigyoRepoto.app, query);
	};

	/**
	 * 営業レポート アプリの一括更新リクエストを生成
	 * @param {array} eigyoreportRecords
	 * @param {string} remainKeymanId
	 * @param {string} deleteKeymanId
	 * @return {array}
	 */
	function createEigyoReportUpdateRequest(eigyoreportRecords, remainKeymanId, deleteKeymanId) {
		if (eigyoreportRecords.length < 1) return [];

		var requests = [];
		var payload_template = {
			'app': config.eigyoRepoto.app,
			'records': []
		};
		var payload = $.extend(true, {}, payload_template);

		for (var i = 0; i < eigyoreportRecords.length; i++) {
			var record = {};

			// 面談者検索コード：「残すデータのキーマン検索コード」をそのままセット
			var table = eigyoreportRecords[i][config.eigyoRepoto.fields.keymanTable.code].value;
			for (var j = 0; j < table.length; j++) {
				if (table[j].value[config.eigyoRepoto.fields.keymanId.code].value === deleteKeymanId) {
					table[j].value[config.eigyoRepoto.fields.keymanSearch.code].value = remainKeymanId;
				}
			}
			record[config.eigyoRepoto.fields.keymanTable.code] = {
				'value': table
			};

			payload.records.push({
				'id': eigyoreportRecords[i]['$id'].value,
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
	 * キーマン管理アプリの削除リクエストを生成
	 * @param {number} deleteRecordNo
	 */
	function createKeymanDeleteRequest(deleteRecordNo) {
		return [{
			'method': 'DELETE',
			'api': '/k/v1/records.json',
			'payload': {
				'app': config.keyman.app,
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
		var remainKeymanId = event.records[remainRowIndex][config.keyman.fields.keymanId.code].value ? event.records[remainRowIndex][config.keyman.fields.keymanId.code].value : '';
		var deleteKeymanId = event.records[deleteRowIndex][config.keyman.fields.keymanId.code].value ? event.records[deleteRowIndex][config.keyman.fields.keymanId.code].value : '';

		console.log('残すデータ　　：' + remainKeymanId);
		console.log('削除するデータ：' + deleteKeymanId);

		return new kintone.Promise(function (resolve, reject) {
			// 1. 営業レポート アプリから更新対象のレコードを取得
			resolve(getEigyoReportRecords(deleteKeymanId));
		}).then(function (result) {
			console.log(result);
			var requests = [];
			// 2. 営業レポート アプリの一括更新リクエストを生成
			requests = requests.concat(createEigyoReportUpdateRequest(result, remainKeymanId, deleteKeymanId));
			// 3. キーマン管理アプリの削除リクエストを生成
			requests = requests.concat(createKeymanDeleteRequest(event.records[deleteRowIndex][config.keyman.fields.recordNo.code].value));
			console.log(requests);
			return requests;
		}).then(function (requests) {
			// 4. リクエストを実行
			return sncLib.kintone.rest.execBulkRequest(requests);
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
			reject(error);
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
		var aNodes = kintone.app.getFieldElements(config.keyman.fields.recordNo.code);
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
})(jQuery, window.nokConfig, window.keymanNayoseConfig, window.snc);
