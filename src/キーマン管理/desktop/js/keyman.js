/**
 * @fileoverview キーマン管理アプリ カスタマイズ
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

	const cfgKeyman = config.keyman;
	const cfgKeymanFields = config.keyman.fields;

	/**
	 * レコード編集画面（新規、追加）の表示イベント
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
		// ログインユーザーのアカウントを取得
		var loginUser = kintone.getLoginUser();
		var record = event.record;

		// 顧客名更新処理
		if (
			event.type === 'app.record.create.show'
		) {
			// 顧客名が設定されていれば、ルックアップを更新
			if (record[cfgKeymanFields.kokyakuSearch.code].value) {
				record[cfgKeymanFields.kokyakuSearch.code].lookup = true;
			}
		}

		// ログインユーザーが管理アカウントではない場合
		if (config.kanriUsers.indexOf(loginUser.code) == -1) {
			// フィールドの表示/非表示設定
			sncLib.nok.util.setAppFieldsShown(cfgKeymanFields);
			if (
				event.type == 'app.record.create.show'
				|| event.type == 'app.record.edit.show'
				|| event.type == 'app.record.index.edit.show'
			) {
				// フィールドの入力可/否設定
				sncLib.nok.util.setAppFieldsDisabled(event.record, cfgKeymanFields);
			}
		}

		// フィールドの初期化
		if (event.type == 'app.record.create.show') {
			event.record[cfgKeymanFields.keymanId.code].value = '';
			// event.record[cfgKeymanFields.keymanSearch.code].value = '';
		}
		return event;
	});

})(window.nokConfig, window.snc);
