/**
 * @fileoverview 顧客マスタアプリ（モバイル版）
 *
 *【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * snc.min.js -v1.0.5
 * snc.kintone.min.js -v1.0.8
 * snc.nok.min.js -v1.0.5
 * config.nok.js -v4.0.1
 *
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
*/
jQuery.noConflict();
(function ($, config, sncLib) {
	'use strict';

	const cfgKokyaku = config.kokyaku;
	const cfgKokyakuFields = config.kokyaku.fields;

	/**
	 * レコード編集画面（新規、追加）の表示イベント
	 * 　フィールドの表示/非表示設定
	 * 　フィールドの入力可/否 を設定
	*/
	kintone.events.on([
		'mobile.app.record.create.show',
		'mobile.app.record.edit.show',
		'mobile.app.record.index.edit.show',
		'mobile.app.record.index.show',
		'mobile.app.record.detail.show',
		'mobile.app.record.print.show'
	], function (event) {
		// ログインユーザーのアカウントを取得
		var loginUser = kintone.getLoginUser();

		// ログインユーザーが管理アカウントではない場合
		if (config.kanriUsers.indexOf(loginUser.code) == -1) {
			// フィールドの表示/非表示設定
			sncLib.nok.util.setMobileAppFieldsShown(cfgKokyakuFields);
			if (
				event.type == 'mobile.app.record.create.show'
				|| event.type == 'mobile.app.record.edit.show'
				|| event.type == 'mobile.app.record.index.edit.show'
			) {
				// フィールドの入力可/否設定
				sncLib.nok.util.setAppFieldsDisabled(event.record, cfgKokyakuFields);
			}
		}
		return event;
	});

})(jQuery, window.nokConfig, window.snc);
