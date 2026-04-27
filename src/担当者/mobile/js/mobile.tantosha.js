/**
 * @fileoverview 担当者マスタアプリ カスタマイズ（モバイル版）
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
(function (config, sncLib) {
	'use strict';
	const cfgTantoshaFields = config.tantosha.fields;

	/**
	 * レコード編集画面（新規、編集、一覧編集）の表示イベント
	 * 　フィールドの表示/非表示設定
	 * 　フィールドの入力可/否 を設定
	*/
	kintone.events.on([
		'mobile.app.record.create.show',
		'mobile.app.record.edit.show',
		'mobile.app.record.detail.show',

	], function (event) {
		// ログインユーザーのアカウントを取得
		var loginUser = kintone.getLoginUser();

		// ログインユーザーが管理アカウントではない場合
		if (config.kanriUsers.indexOf(loginUser.code) == -1) {
			// フィールドの表示/非表示設定
			sncLib.nok.util.setMobileAppFieldsShown(cfgTantoshaFields);
			if (
				event.type == 'mobile.app.record.create.show'
				|| event.type == 'mobile.app.record.edit.show'
				|| event.type == 'mobile.app.record.index.edit.show'
			) {
				// フィールドの入力可/否設定
				sncLib.nok.util.setAppFieldsDisabled(event.record, cfgTantoshaFields);
			}
		}
		return event;
	});

	/**
	 * レコード編集画面（新規、編集、一覧編集）の登録前イベント
	 * 　担当者名検索コードの更新
	*/
	kintone.events.on([
		'mobile.app.record.create.submit',
		'mobile.app.record.edit.submit',
	], function (event) {
		var record = event.record;
		// 担当者名
		var tantoshamei = record[cfgTantoshaFields.tantoshaMei.code].value ? record[cfgTantoshaFields.tantoshaMei.code].value : '';
		// 担当者ID
		var tantoshaId = record[cfgTantoshaFields.tantoshaId.code].value ? record[cfgTantoshaFields.tantoshaId.code].value : '';
		// 担当者名検索コード
		event.record[cfgTantoshaFields.tantoshaSearchId.code].value = sncLib.nok.data.createTantoshaSearchId(tantoshamei, tantoshaId);

		return event;
	});

})(window.nokConfig, window.snc);
