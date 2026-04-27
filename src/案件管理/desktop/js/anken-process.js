/**
 * @fileoverview 案件マスタアプリ カスタマイズ
 * - 商談プロセス表示。
 *
 *【必要ライブラリ】
 * [JavaScript]
 * snc.min.js -v1.0.5
 * snc.kintone.min.js -v1.0.8
 * snc.nok.min.js -v1.0.5
 * config.nok.js -v4.0.1
 * config.anken-process.js -v4.0.1
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
(function (config, configAnkenProcess, sncLib) {
	'use strict';

	const cfgEigyoRepoto = config.eigyoRepoto;

	/**
	 * 背景色を設定
	 * @param {date} baseDate
	 * @param {date} targetDate
	 */
	function getShodanProcessBackColor(baseDate, targetDate) {

		var configTerms = configAnkenProcess.terms;
		var processTerms = {};
		var bgColor = '';
		var startDay = 0;
		var endDay = 0;
		var diffDay = sncLib.util.calcDiffDate(targetDate, baseDate);

		for (var i = 0; i < configAnkenProcess.terms.length; i++) {
			var processTerm = {};
			endDay = configAnkenProcess.terms[i].days;

			if (startDay === 0) {
				if (diffDay <= endDay) {
					bgColor = configAnkenProcess.terms[i].color;
					break;
				}
			} else {
				if (startDay < diffDay && diffDay <= endDay) {
					bgColor = configAnkenProcess.terms[i].color;
					break;
				}
			}
			startDay = endDay;
			if (configAnkenProcess.terms.length - 1 === i) {
				bgColor = configAnkenProcess.terms[i].color;
				break;
			}
		}
		return bgColor;
	}

	/**
	 *指定アプリ、レコードの詳細画面を表示するURLを作成
	 * @param {number} targetAppId
	 * @param {number} targetRecordNo
	 */
	function getTargetURL(targetAppId, targetRecordNo) {
		return '/k/' + targetAppId + '/show#record=' + targetRecordNo;
	}

	/**
	 * 商談プロセス用のセルを設定
	 *   活動日からの経過日数による背景色設定
	 * 　対象となる営業レポートへのリンク
	 * @param {array} record
	 * @param {number} targetAppId
	 * @param {string} processDateCode
	 * @param {string} processIdCode
	 * @param {array} element
	 */
	function setProcessElement(record, targetAppId, processDateCode, processIdCode, element) {
		var processDateValue = record[processDateCode].value;
		// 商談プロセスの日付が入力されている場合
		if (processDateValue) {
			var processDate = processDateValue ? sncLib.util.toDate(processDateValue) : '';
			var recordId = record[processIdCode].value;
			var baseDate;

			// 活動日との経過日数が案件アプリ内のフィールドが設定されている場合は、
			// 案件アプリより基準となる値を設定
			// 設定されていない場合はシステム日付を設定
			if (configAnkenProcess.baseDate.code) {
				baseDate = sncLib.util.toDate(record[configAnkenProcess.baseDate.code].value);
			} else {
				var today = new Date();
				baseDate = today;
			}

			// 背景色を設定
			element.style.backgroundColor = getShodanProcessBackColor(baseDate, processDate);
			// 営業レポートのレコード番号が存在する場合、活動日へリンクを付与
			if (recordId) {
				element.innerHTML = '<div class="line-cell-gaia recordlist-ellipsis-gaia">'
					+ '<a href="' + getTargetURL(targetAppId, recordId) + '" target="_brank" title="営業活動の詳細を表示する">'
					+ '<span>' + processDateValue + '</span>'
					+ '</a>'
					+ '</div>'
					;
			}
		}
	}

	/**
	 * レコード一覧表示イベント
	 * 　フィールドの表示/非表示設定
	 * 　フィールドの入力可/否 を設定
	 * 　背景色の変更
	*/
	kintone.events.on([
		'app.record.index.show'
	], function (event) {
		var record = event.record;

		// 商談プロセスの背景色設定
		// 商談プロセスが有効、かつ、指定のビューIDの場合、背景色を変更
		if (
			configAnkenProcess.option &&
			configAnkenProcess.targetViewIds.indexOf(event.viewId) != -1
		) {
			var elProcess = [];
			var fieldElementsList = [];
			// フィールド要素を取得する
			for (var colIndex = 0; colIndex < configAnkenProcess.list.length; colIndex++) {
				var fieldElementsInfo = {};
				var dateFieldCode = configAnkenProcess.list[colIndex].dateFieldCode;
				var eigyoRepotoIdFieldCode = configAnkenProcess.list[colIndex].eigyoRepotoIdFieldCode;
				var fieldElements = kintone.app.getFieldElements(dateFieldCode);
				if (fieldElements) {
					fieldElementsInfo['fieldElements'] = fieldElements;
					fieldElementsInfo['dateFieldCode'] = dateFieldCode;
					fieldElementsInfo['eigyoRepotoIdFieldCode'] = eigyoRepotoIdFieldCode;
					fieldElementsList.push(fieldElementsInfo);
				}
			}

			if (fieldElementsList.length > 0) {
				var records = event.records;
				for (var rowIndex = 0; rowIndex < records.length; rowIndex++) {
					var record = records[rowIndex];

					for (var index = 0; index < fieldElementsList.length; index++) {
						var fieldElementsInfo = fieldElementsList[index];
						setProcessElement(record, cfgEigyoRepoto.app, fieldElementsInfo.dateFieldCode, fieldElementsInfo.eigyoRepotoIdFieldCode, fieldElementsInfo.fieldElements[rowIndex]);
					}
				}
			}
		}
		return event;
	});

})(window.nokConfig, window.ankenProcessConfig.process, window.snc);
