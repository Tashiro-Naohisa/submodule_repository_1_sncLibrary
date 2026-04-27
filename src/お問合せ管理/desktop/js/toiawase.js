/**
 * @fileoverview お問合せアプリ カスタマイズ
 *
 *【必要ライブラリ】
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

	const cfgToiawase = config.toiawase;
	const cfgToiawaseFields = config.toiawase.fields;

	/**
	 * レコード編集画面（新規、編集、一覧編集）の表示イベント
	 * 　フィールドの表示/非表示設定
	 * 　フィールドの入力可/否 を設定
	*/
	kintone.events.on([
		'app.record.create.show',
		'app.record.edit.show',
		'app.record.index.edit.show',
		'app.record.index.show',
		'app.record.detail.show',
		'app.record.print.show'
	], function (event) {
		var record = event.record;
		// ログインユーザーのアカウントを取得
		var loginUser = kintone.getLoginUser();

		if (event.type === 'app.record.create.show') {
			// 担当者情報を取得
			record[cfgToiawaseFields.tantoshaSearch.code].value = loginUser.code;
			record[cfgToiawaseFields.tantoshaSearch.code].lookup = true;
		}
		// 顧客名更新処理
		if (
			event.type === 'app.record.create.show'
		) {
			// 顧客名が設定されていれば、ルックアップを更新
			if (record[cfgToiawaseFields.kokyakuSearch.code].value) {
				record[cfgToiawaseFields.kokyakuSearch.code].lookup = true;
			}
		}
		// ログインユーザーが管理アカウントではない場合
		if (config.kanriUsers.indexOf(loginUser.code) == -1) {
			// フィールドの表示/非表示設定
			sncLib.nok.util.setAppFieldsShown(cfgToiawaseFields);
			if (
				event.type == 'app.record.create.show'
				|| event.type == 'app.record.edit.show'
				|| event.type == 'app.record.index.edit.show'
			) {
				// フィールドの入力可/否設定
				sncLib.nok.util.setAppFieldsDisabled(event.record, cfgToiawaseFields);
			}
		}
		return event;
	});

})(jQuery, window.nokConfig, window.snc);
