/**
 * @fileoverview 案件管理アプリ（モバイル版）
 *
 *【必要ライブラリ】
 * [JavaScript]
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
(function (config, sncLib) {
	'use strict';

	const cfgAnken = config.anken;
	const cfgAnkenFields = config.anken.fields;

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
		var record = event.record;
		// ログインユーザーのアカウントを取得
		var loginUser = kintone.getLoginUser();

		/// 担当者情報の取得
		if (event.type == 'mobile.app.record.create.show') {
			// 担当者情報を取得
			record[cfgAnkenFields.tantoshaSearch.code].value = loginUser.code;
			record[cfgAnkenFields.tantoshaSearch.code].lookup = true;
		}

		if (
			event.type === 'mobile.app.record.create.show'
		) {
			// 顧客名が設定されていれば、ルックアップを更新
			if (record[cfgAnkenFields.kokyakuSearch.code].value) {
				record[cfgAnkenFields.kokyakuSearch.code].lookup = true;
			}
		}

		// ログインユーザーが管理アカウントではない場合
		if (config.kanriUsers.indexOf(loginUser.code) == -1) {
			// フィールドの表示/非表示設定
			sncLib.nok.util.setMobileAppFieldsShown(cfgAnkenFields);
			if (
				event.type == 'mobile.app.record.create.show'
				|| event.type == 'mobile.app.record.edit.show'
				|| event.type == 'mobile.app.record.index.edit.show'
			) {
				// フィールドの入力可/否設定
				sncLib.nok.util.setAppFieldsDisabled(event.record, cfgAnkenFields);
			}
		}

		return event;
	});

})(window.nokConfig, window.snc);
