/**
 * @fileoverview 営業活動レポート　案件管理アプリ連携（モバイル版）
 * - 案件管理アプリの追加登録画面へ遷移するボタンを追加する
 * - 営業活動レポート内の情報を案件管理アプリへ登録する。
 * - 案件進捗一覧情報として活動日と営業活動レポートのレポートNo.を
 * 　案件管理アプリへ登録する。
 *
 * 【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * snc.min.js -v1.0.5
 * snc.kintone.min.js -v1.0.8
 * snc.nok.min.js -v1.0.5
 * config.nok.js -v4.0.1
 * config.eigyoRepoto-ankenLinkage.js -v4.0.1
 *
 * [CSS]
 * 51-us-default.css
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
jQuery.noConflict();
(function ($, config, configLinkage, configAnkenProcess, sncLib) {
	'use strict';

	const cfgEigyoRepotoFields = config.eigyoRepoto.fields;

	/**
	 * 営業レポートより更新対象となる案件情報を取得
	 *
	 * @param {string} query
	 */
	function getLatesteigyoRepotoProcess(query) {
		return sncLib.kintone.rest.getAllRecords(
			config.eigyoRepoto.app,
			query
		);
	}

	/**
	 * 更新前に進捗管理情報を登録していた案件情報を取得
	 * @param {int} recordId
	 * @param {int} ankenRecordId
	 */
	function getPreAnkenInfo(recordId, ankenRecordId) {
		var ankenJohoFields = config.anken.fields;
		var query = '';
		// クエリ作成
		for (var i = 0; i < configAnkenProcess.list.length; i++) {
			if (query) {
				query += 'or ';
			}
			query += configAnkenProcess.list[i].eigyoRepotoIdFieldCode + '=' + recordId + ' ';
		}
		//console.log(query);
		return sncLib.kintone.rest.getRecord(config.anken.app, query);
	}

	/**
	 * 商談プロセス情報を初期化
	 */
	function initShodanProcessInfo() {
		var processInfo = {};
		for (var i = 0; i < configAnkenProcess.list.length; i++) {
			var processFieldCode = configAnkenProcess.list[i]['dateFieldCode'];
			var processIDFieldCode = configAnkenProcess.list[i]['eigyoRepotoIdFieldCode'];
			processInfo[processFieldCode] = {};
			processInfo[processFieldCode].value = '';
			processInfo[processIDFieldCode] = {};
			processInfo[processIDFieldCode].value = '';
		}
		return processInfo;
	}

	/**
	 * 商談プロセスの設定情報
	 */
	function getShodanProcessSetting() {
		var shodanProcessInfo = {};
		for (var i = 0; i < configAnkenProcess.list.length; i++) {
			var value = configAnkenProcess.list[i]['value'];
			var dateFieldCode = configAnkenProcess.list[i]['dateFieldCode'];
			var eigyoRepotoIdFieldCode = configAnkenProcess.list[i]['eigyoRepotoIdFieldCode'];
			var key = value;
			shodanProcessInfo[key] = {};
			shodanProcessInfo[key]['value'] = value;
			shodanProcessInfo[key]['processCode'] = dateFieldCode;
			shodanProcessInfo[key]['processIdCode'] = eigyoRepotoIdFieldCode;
		}
		return shodanProcessInfo;
	}

	/**
	 * 案件情報更新
	 * @param {array} requests
	 * @param {array} record
	 */
	function addRequestUpdateAnkenInfo(requests, record) {

		// 案件連携オプションが設定されている場合
		if (configLinkage.option) {
			var updateRecord = {};
			var apiUrl = '/k/v1/records.json';
			var payloadTemplate = {
				'app': null,
				'records': []
			};
			// payloadの初期化
			var payload = $.extend(true, {}, payloadTemplate);
			// 案件アプリのアプリID
			payload.app = config.anken.app;

			// 案件アプリのレコードNo.
			var ankenRecordId = record[configLinkage.key.code].value;

			if (ankenRecordId) {
				for (var i = 0; i < configLinkage.list.length; i++) {
					var compareValue = record[configLinkage.list[i]['compareFieldCode']].value;
					var sourceValue = record[configLinkage.list[i]['sourceFieldCode']].value;
					var targetValue = record[configLinkage.list[i]['targetFieldCode']].value;
					var targetFieldCode = configLinkage.list[i]['targetFieldCode'];
					// 更新フィールド値がブランクではない、かつ、
					// 更新フィールド値と比較フィールド値が一致しない場合
					if (sourceValue && (sourceValue != compareValue)) {
						// 更新情報をセット
						updateRecord[targetFieldCode] = {};
						updateRecord[targetFieldCode].value = sourceValue;
					}
				}
			}

			// 登録データが存在する場合、登録処理を実施
			if (Object.keys(updateRecord).length > 0) {
				payload.records.push({
					'id': ankenRecordId,
					'record': updateRecord
				})

				requests.push({
					'method': 'PUT',
					'api': apiUrl,
					'payload': payload
				});
			}
		}
		return requests;
	}

	/**
	 * 案件情報　商談プロセス情報の更新
	 * @param {array} requests
	 * @param {array} results
	 */
	function addRequestUpdateEigyoRepotoProcess(requests, results) {
		var updateRecord = {};
		var apiUrl = '/k/v1/records.json';
		var payloadTemplate = {
			'app': null,
			'records': []
		};
		// payloadの初期化
		var payload = $.extend(true, {}, payloadTemplate);
		// 案件アプリのアプリID
		payload.app = config.anken.app;

		var shodanProcessSettings = getShodanProcessSetting();

		for (var i = 0; i < results.length; i++) {
			if (results[i].length > 0) {
				var result = results[i];
				// console.log(result);
				var ankenRecordId;
				var processInfo = {};
				var preProcess = '';
				var saishuHomonbi = '';
				processInfo = initShodanProcessInfo();

				// 案件アプリのレコードIDを取得
				ankenRecordId = result[0][cfgEigyoRepotoFields.ankenRecordId.code].value;

				for (var row = 0; row < result.length; row++) {
					var process = result[row][configAnkenProcess.target.code].value;
					if (preProcess != process) {
						// プロセスが設定情報内に含まれている場合
						if (process in shodanProcessSettings) {
							var katsudobi = result[row][cfgEigyoRepotoFields.katsudobi.code].value;
							// 活動日
							processInfo[shodanProcessSettings[process].processCode].value = katsudobi;
							// レコードNo
							processInfo[shodanProcessSettings[process].processIdCode].value = result[row][cfgEigyoRepotoFields.recordId.code].value;

							// 最終訪問日を取得
							if (!saishuHomonbi) {
								saishuHomonbi = katsudobi;
							} else if (sncLib.util.calcDiffDate(sncLib.util.toDate(saishuHomonbi), sncLib.util.toDate(katsudobi)) > 0) {
								saishuHomonbi = katsudobi
							}
						}
					}
					preProcess = process;
				}
				// // 最終訪問日
				// processInfo[config.anken.fields.saishuHomonbi.code] = {};
				// processInfo[config.anken.fields.saishuHomonbi.code].value= saishuHomonbi;

				// 案件IDが存在する場合
				// 案件が設定されている場合
				if (ankenRecordId) {
					payload.records.push({
						'id': ankenRecordId,
						'record': processInfo
					});

					// リクエストを追加
					requests.push({
						'method': 'PUT',
						'api': apiUrl,
						'payload': payload
					});

					// payloadの初期化
					payload = $.extend(true, {}, payloadTemplate);
					// アプリIDを設定
					payload.app = config.anken.app;
				}
			}
		}
		//console.log(requests);
		return requests;
	}

	/**
	 * レコード削除処理時の案件情報を更新する
	 * @param {object} record
	 * @return {boolean}
	 */
	function updateAnkenProcessFields(record) {
		// 案件進捗一覧オプションが設定されている場合
		if (configAnkenProcess.option) {
			var ankenRecordId = record[cfgEigyoRepotoFields.ankenRecordId.code].value;
			// 案件レコードNo.が設定されていない場合、
			// 更新処理を終了
			if (!ankenRecordId) {
				return true;
			}

			// レコードNo.
			var recordId = record[cfgEigyoRepotoFields.recordId.code].value;
			// 案件情報を更新するため、同一案件のレコードを取得。
			// 但し、削除対象のレコードは除く。
			var ankenQuery = cfgEigyoRepotoFields.ankenRecordId.code + '=' + ankenRecordId + ' '
				+ 'and ' + cfgEigyoRepotoFields.recordId.code + '!=' + recordId + ' '
				+ 'order by ' + configAnkenProcess.target.code + ' asc '
				+ ', ' + cfgEigyoRepotoFields.katsudobi.code + ' desc ';

			return kintone.Promise.all([
				getLatesteigyoRepotoProcess(ankenQuery)
			]).then(function (results) {
				var requests = [];
				addRequestUpdateEigyoRepotoProcess(requests, results);
				// console.log(requests);
				if (requests.length < 1) {
					return [];
				} else {
					return sncLib.kintone.rest.execBulkRequest(requests);
				}
			}).then(function () {
				return true;
			}).catch(function (error) {
				// エラーメッセージを表示
				console.log(error);
				alert(configAnkenProcess.messages.deleteError);
				return false;
			});
		} else {
			return true;
		}
	}

	/**
	 * 案件アプリ連携
	 *   営業レポート内のフィールドを案件アプリへ登録
	 *   案件進捗状況を案件アプリへ登録
	 * @param {obeject} record
	 */
	function executeAnkenLinkage(record) {
		var recordId = record[cfgEigyoRepotoFields.recordId.code].value;
		var ankenRecordId = record[cfgEigyoRepotoFields.ankenRecordId.code].value;
		var requests = [];
		// 案件情報を更新するリクエストを作成
		addRequestUpdateAnkenInfo(requests, record);

		// 案件IDが設定されている場合
		// 同一案件IDを取得するクエリをセット
		// 設定されていない場合は、レコードNoを0とする
		if (!ankenRecordId) {
			ankenRecordId = 0;
		}

		// オプションの確認
		if (!configAnkenProcess.option) {
			// 案件情報の更新のみを実施
			return new kintone.Promise(function (resolve, reject) {
				if (requests.length < 1) {
					resolve();
				} else {
					sncLib.kintone.rest.execBulkRequest(requests).then(
						//updateAnkenRecords(requests).then(
						function (result) {
							resolve(result);
						}, function (error) {
							reject(error);
						}
					)

				}
			}).then(function () {
				return true;
			}).catch(function (error) {
				// エラーメッセージを表示
				console.log(error);
				alert(configAnkenProcess.messages.saveError);
				return false;
			});
		} else {
			// 案件情報の更新、及び、案件進捗情報を更新
			return new kintone.Promise(function (resolve, reject) {
				getPreAnkenInfo(recordId, ankenRecordId).then(
					function (result) {
						// console.log(result);
						resolve(result);
					});
			}).then(function (result) {
				var ankenQuery = '';
				var preAnkenRecordId = 0;
				if (result.length > 0) {
					preAnkenRecordId = result[0][config.anken.fields.recordId.code].value;
					if (ankenRecordId == preAnkenRecordId) {
						preAnkenRecordId = 0;
					}
				}
				// 更新後の案件情報を取得するクエリ
				var ankenQuery = cfgEigyoRepotoFields.ankenRecordId.code + '=' + ankenRecordId + ' '
					+ 'order by ' + configAnkenProcess.target.code + ' asc '
					+ ', ' + cfgEigyoRepotoFields.katsudobi.code + ' desc ';

				// 更新前の案件情報を取得するクエリ
				var preAnkenQuery = cfgEigyoRepotoFields.ankenRecordId.code + '=' + preAnkenRecordId + ' '
					+ 'order by ' + configAnkenProcess.target.code + ' asc '
					+ ', ' + cfgEigyoRepotoFields.katsudobi.code + ' desc ';

				// 営業レポートより更新対象の情報を取得
				return kintone.Promise.all([
					getLatesteigyoRepotoProcess(ankenQuery),
					getLatesteigyoRepotoProcess(preAnkenQuery)
				]).then(function (results) {
					addRequestUpdateEigyoRepotoProcess(requests, results);
					if (requests.length < 1) {
						return [];
					} else {
						return sncLib.kintone.rest.execBulkRequest(requests);
					}
				}).then(function () {
					return true;
				}).catch(function (error) {
					// エラーメッセージを表示
					console.log(error);
					alert(configAnkenProcess.messages.saveError);
					return false;
				});
			})
		}
	}

	/**
	 *
	 * レコード編集画面（新規、追加）の表示イベント
	 * 　案件情報の登録ボタンを表示
	 *
	*/
	kintone.events.on([
		'mobile.app.record.create.submit',
		'mobile.app.record.edit.submit'
	], function (event) {
		// ローカルストレージへ値をセット
		window.localStorage.setItem('anken_linkage', true);
		return event;
	});

	/**
	 *
	 * 　案件管理を実施
	 *
	 */
	kintone.events.on([
		'mobile.app.record.detail.show'
	], function (event) {

		// ローカルストレージの対応チェック
		if (('localStorage' in window) && (window.localStorage !== null)) {
			var isUpdate = window.localStorage.getItem('anken_linkage');
			if (isUpdate) {
				// 案件アプリ連携
				executeAnkenLinkage(event.record);
			}
		}

		// ローカルストレージの値をクリア
		window.localStorage.removeItem('anken_linkage');
		return event;
	});

})(jQuery, window.nokConfig, window.ankenLinkageConfig, window.ankenProcessConfig.process, window.snc);
