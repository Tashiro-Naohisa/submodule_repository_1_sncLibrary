/**
 * @fileoverview 営業活動レポートの案件情報関連処理
 * - 案件情報アプリより取得した値が変更された場合、
 * 　営業活動レポート内の値を変更する。
 *
 * 【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * snc.min.js -v1.0.5
 * snc.kintone.min.js -v1.0.8
 * snc.nok.min.js -v1.0.5
 * config.nok.js -v4.0.1
 *
 * [CSS]
 * 51-us-default.css
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
jQuery.noConflict();
(function ($, config, sncLib) {
	'use strict';

	const cfgEigyoRepotoFields = config.eigyoRepoto.fields;

	/**
	 *
	 * レコード編集画面の確度変更イベント
	 *
	*/
	kintone.events.on([
		'app.record.create.change.' + cfgEigyoRepotoFields.kakudo.code,
		'app.record.edit.change.' + cfgEigyoRepotoFields.kakudo.code,
		'app.record.index.edit.change.' + cfgEigyoRepotoFields.kakudo.code
	], function (event) {
		var record = event.record;
		if (!record[cfgEigyoRepotoFields.homongoKakudo.code].value) {
			// 「確度」の値を「訪問後確度」へコピー
			record[cfgEigyoRepotoFields.homongoKakudo.code].value = record[cfgEigyoRepotoFields.kakudo.code].value;
			return event;
		}
	});

	/**
	 *
	 *  レコード編集画面の訪問結果変更イベント
	 *
	*/
	kintone.events.on([
		'app.record.create.change.' + cfgEigyoRepotoFields.homonkekka.code,
		'app.record.edit.change.' + cfgEigyoRepotoFields.homonkekka.code,
		'app.record.index.edit.change.' + cfgEigyoRepotoFields.homonkekka.code
	], function (event) {
		var record = event.record;
		if (!record[cfgEigyoRepotoFields.homongoKekka.code].value) {
			// 「訪問結果」の値を「訪問後結果」へコピー
			record[cfgEigyoRepotoFields.homongoKekka.code].value = record[cfgEigyoRepotoFields.homonkekka.code].value;
			return event;
		}
	});

	/**
	 *
	 * レコード編集画面の売上変更イベント
	 *
	*/
	kintone.events.on([
		'app.record.create.change.' + cfgEigyoRepotoFields.uriage.code,
		'app.record.edit.change.' + cfgEigyoRepotoFields.uriage.code,
		'app.record.index.edit.change.' + cfgEigyoRepotoFields.uriage.code
	], function (event) {
		var record = event.record;
		if (!record[cfgEigyoRepotoFields.homongoUriage.code].value) {
			// 「売上」の値を「訪問後売上」へコピー
			record[cfgEigyoRepotoFields.homongoUriage.code].value = record[cfgEigyoRepotoFields.uriage.code].value;
			return event;
		}
	});

	/**
	 *
	 * レコード編集画面の付加価値変更イベント
	 *
	*/
	kintone.events.on([
		'app.record.create.change.' + cfgEigyoRepotoFields.fukakachi.code,
		'app.record.edit.change.' + cfgEigyoRepotoFields.fukakachi.code,
		'app.record.index.edit.change.' + cfgEigyoRepotoFields.fukakachi.code
	], function (event) {
		var record = event.record;
		if (!record[cfgEigyoRepotoFields.homongoFukakachi.code].value) {
			// 「原価」の値を「訪問後原価」へコピー
			record[cfgEigyoRepotoFields.homongoFukakachi.code].value = record[cfgEigyoRepotoFields.fukakachi.code].value;
			return event;
		}
	});

	/**
	 *
	 * レコード編集画面の受注予定日変更イベント
	 *
	*/
	kintone.events.on([
		'app.record.create.change.' + cfgEigyoRepotoFields.juchuyoteibi.code,
		'app.record.edit.change.' + cfgEigyoRepotoFields.juchuyoteibi.code,
		'app.record.index.edit.change.' + cfgEigyoRepotoFields.juchuyoteibi.code
	], function (event) {
		var record = event.record;
		if (!record[cfgEigyoRepotoFields.homongoJuchuyoteibi.code].value) {
			// 「受注予定日」の値を「訪問後受注予定日」へコピー
			record[cfgEigyoRepotoFields.homongoJuchuyoteibi.code].value = record[cfgEigyoRepotoFields.juchuyoteibi.code].value;
			return event;
		}
	});

	/**
	 *
	 * レコード編集画面の検収予定日変更イベント
	 *
	*/
	kintone.events.on([
		'app.record.create.change.' + cfgEigyoRepotoFields.kenshuyoteibi.code,
		'app.record.edit.change.' + cfgEigyoRepotoFields.kenshuyoteibi.code,
		'app.record.index.edit.change.' + cfgEigyoRepotoFields.kenshuyoteibi.code
	], function (event) {
		var record = event.record;
		if (!record[cfgEigyoRepotoFields.homongoKenshuyoteibi.code].value) {
			// 「検収予定日」の値を「訪問後検収予定日」へコピー
			record[cfgEigyoRepotoFields.homongoKenshuyoteibi.code].value = record[cfgEigyoRepotoFields.kenshuyoteibi.code].value;
			return event;
		}
	});

})(jQuery, window.nokConfig, window.snc);
