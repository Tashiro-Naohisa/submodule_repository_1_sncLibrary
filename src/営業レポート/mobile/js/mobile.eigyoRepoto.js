/**
 * @fileoverview 営業活動レポート（モバイル版）
 * - 日報IDを作成する
 * - 終了時間を自動設定する
 *
 * 【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * snc.min.js -v1.0.5
 * snc.kintone.min.js -v1.1.0
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
(function ($, config, configLinkage, sncLib) {
	'use strict';

	const cfgEigyoRepoto = config.eigyoRepoto;
	const cfgEigyoRepotoFields = config.eigyoRepoto.fields;
	const cfgEigyoRepotoMessages = config.eigyoRepoto.messages;

	/**
	 *
	 * レコード編集画面（新規、追加）の表示イベント
	 * レコード詳細画面の表示イベント
	 * 　フィールドの表示/非表示設定
	 * 　フィールドの入力可/否 を設定
	 *
	*/
	kintone.events.on([
		'mobile.app.record.create.show',
		'mobile.app.record.edit.show',
		'mobile.app.record.detail.show'
	], function (event) {
		var record = event.record;
		var loginUser = kintone.getLoginUser();

		if (event.type === 'mobile.app.record.create.show') {
			// 担当者情報を取得
			record[cfgEigyoRepotoFields.tantoshaSearch.code].value = loginUser.code;
			record[cfgEigyoRepotoFields.tantoshaSearch.code].lookup = true;
		}

		if (event.type === 'mobile.app.record.create.show') {
			// 「開始時刻」より「終了時刻」を設定
			var kaishi = record[cfgEigyoRepotoFields.kaishijikoku.code].value;
			if (kaishi) {
				var min = sncLib.util.strToMin(kaishi) + cfgEigyoRepoto.offsetMinutes;
				// 開始時刻+N分が24時を超えるかを設定
				if (min >= 24 * 60) {
					// 23時59分となるように調整
					min = 24 * 60 - 1;
				}
				var shuryo = sncLib.util.minToStr(min);
				event.record[cfgEigyoRepotoFields.shuryojikoku.code].value = shuryo;
			}
		}

		// 顧客名更新処理
		if (event.type === 'mobile.app.record.create.show' ||
			event.type === 'mobile.app.record.edit.show'
		) {
			// 顧客名が設定されていれば、ルックアップを更新
			if (record[cfgEigyoRepotoFields.kokyakuSearch.code].value) {
				record[cfgEigyoRepotoFields.kokyakuSearch.code].lookup = true;
			}
		}

		// ログインユーザーが管理アカウントではない場合
		if (config.kanriUsers.indexOf(loginUser.code) === -1) {
			// フィールドの表示/非表示設定
			sncLib.nok.util.setMobileAppFieldsShown(cfgEigyoRepotoFields);
			// レコード編集画面（新規、追加）の場合、
			// フィールドの入力可/否も設定する
			if (event.type === 'mobile.app.record.create.show' ||
				event.type === 'mobile.app.record.edit.show'
			) {
				sncLib.nok.util.setAppFieldsDisabled(event.record, cfgEigyoRepotoFields);
			}

			// ルックアップフィールドの表示設定
			if (event.type === 'mobile.app.record.detail.show') {
				// kintone.mobile.app.record.setFieldShown(cfgEigyoRepotoFields.kokyakuSearchId.code, false);
				kintone.mobile.app.record.setFieldShown(cfgEigyoRepotoFields.tantoshaSearch.code, false);
				// kintone.mobile.app.record.setFieldShown(cfgEigyoRepotoFields.ankenSearchId.code, false);
			}
		}
		return event;
	});

	/**
	 *
	 * フィールド変更イベント（新規、編集、一覧編集）
	 *   「活動日」、「社員ID」が変更されたタイミング
	 *   「日報ID」へ「活動日＋社員ID」の値をセット
	 *
	*/
	kintone.events.on([
		'mobile.app.record.create.change.' + cfgEigyoRepotoFields.katsudobi.code,
		'mobile.app.record.edit.change.' + cfgEigyoRepotoFields.katsudobi.code,
		'mobile.app.record.create.change.' + cfgEigyoRepotoFields.tantoshaId.code,
		'mobile.app.record.edit.change.' + cfgEigyoRepotoFields.tantoshaId.code,
	], function (event) {
		var record = event.record;
		var katsudobi = record[cfgEigyoRepotoFields.katsudobi.code].value;
		var tantoshaId = record[cfgEigyoRepotoFields.tantoshaId.code].value;
		var nippoId = '';
		if (katsudobi && tantoshaId) {
			nippoId = sncLib.nok.data.createNippoId(katsudobi, tantoshaId);
		}
		record[cfgEigyoRepotoFields.nippoId.code].value = nippoId;
		return event;
	});

	/**
	 * フィールド変更イベント（新規、編集、一覧編集）
	 *   「開始時刻」が変更されたタイミング
	 *   「終了時刻」へ「開始時刻＋N分」の値をセット
	 * 　　　Nはconfig側のoffsetMinutesにて設定
	 *    ※関連レコード一覧の条件に文字列（自動計算）を指定している場合、
	 * 　　 return eventにより関連レコード一覧の内容がクリアされる。
	 * 　　 自動計算の変わりにJSにて自動計算を実装
	*/
	kintone.events.on([
		'mobile.app.record.create.change.' + cfgEigyoRepotoFields.kaishijikoku.code,
		'mobile.app.record.edit.change.' + cfgEigyoRepotoFields.kaishijikoku.code
	], function (event) {
		var field = event.changes.field;
		var kaishi = field.value;
		// 「開始時刻」の入力、数値チェック
		if (kaishi) {
			var min = sncLib.util.strToMin(kaishi) + cfgEigyoRepoto.offsetMinutes;
			// 開始時刻+N分が24時を超えるかを設定
			if (min >= 24 * 60) {
				// 23時59分となるように調整
				min = 24 * 60 - 1;
			}
			var shuryo = sncLib.util.minToStr(min);
			event.record[cfgEigyoRepotoFields.shuryojikoku.code].value = shuryo;
			return event;
		}
	});

	/**
 * 営業報告アプリと顧客アプリの連携
 * レコード追加画面の保存成功後イベント
 * レコード編集画面の保存成功後イベント
 */
	kintone.events.on([
		'mobile.app.record.create.submit.success',
		'mobile.app.record.edit.submit.success',
		'mobile.app.record.index.delete.submit',
		'mobile.app.record.detail.delete.submit'
	], async function (event) {
		try {
			await sncLib.eigyoKokyakuLinkage(event, config, configLinkage);
			return event;
		} catch (err) {
			console.log(err);
			if (event.type === 'mobile.app.record.create.submit.success' || event.type === 'mobile.app.record.edit.submit.success') {
				Swal.fire({
					icon: 'error',
					title: cfgEigyoRepotoMessages.exceptionError
				});
			} else if (event.type === 'mobile.app.record.index.delete.submit' || event.type === 'mobile.app.record.detail.delete.submit') {
				event.error = cfgEigyoRepotoMessages.exceptionError;
			}
			return event;
		}
	});


})(jQuery, window.nokConfig, window.kokyakuLinkageConfig, window.snc);
