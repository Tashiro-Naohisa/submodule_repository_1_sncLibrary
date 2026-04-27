/**
 * @fileoverview 営業活動レポート
 * - 日報IDを作成する
 * - 終了時間を自動設定する
 * - 顧客管理アプリの訪問履歴に値をセットする
 *
 * 【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * snc.min.js -v1.0.5
 * snc.kintone.min.js -v1.1.0
 * snc.nok.min.js -v1.0.5
 * config.nok.js -v4.0.1
 * config.eigyoRepoto-kokyakuLinkage.js -v4.0.1
 * eigyoRepoto-kokyakuLinkage.js -v4.0.1
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
	 * レコード詳細画面、印刷画面の表示イベント
	 * 　フィールドの表示/非表示設定
	 * 　フィールドの入力可/否 を設定
	 *
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
		var loginUser = kintone.getLoginUser();

		if (event.type === 'app.record.create.show') {
			// 担当者情報を取得
			record[cfgEigyoRepotoFields.tantoshaSearch.code].value = loginUser.code;
			record[cfgEigyoRepotoFields.tantoshaSearch.code].lookup = true;
		}

		if (event.type === 'app.record.create.show') {
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
		if (
			event.type === 'app.record.create.show'
			|| event.type === 'app.record.edit.show'
			|| event.type === 'app.record.index.edit.show'
		) {
			// 顧客名が設定されていれば、ルックアップを更新
			if (record[cfgEigyoRepotoFields.kokyakuSearch.code].value) {
				record[cfgEigyoRepotoFields.kokyakuSearch.code].lookup = true;
			}
		}

		// 案件名更新処理
		if (event.type === 'app.record.create.show') {
			// 案件名が設定されていれば、ルックアップを更新
			if (record[cfgEigyoRepotoFields.ankenSearch.code].value) {
				record[cfgEigyoRepotoFields.ankenSearch.code].lookup = true;
			}
		}

		// ログインユーザーが管理アカウントではない場合
		if (config.kanriUsers.indexOf(loginUser.code) === -1) {
			// フィールドの表示/非表示設定
			sncLib.nok.util.setAppFieldsShown(cfgEigyoRepotoFields);
			// レコード編集画面（新規、追加）の場合、
			// フィールドの入力可/否も設定する
			if (
				event.type === 'app.record.create.show'
				|| event.type === 'app.record.edit.show'
				|| event.type === 'app.record.index.edit.show'
			) {
				sncLib.nok.util.setAppFieldsDisabled(event.record, cfgEigyoRepotoFields);
			}

			// ルックアップフィールドの表示設定
			if (
				event.type === 'app.record.index.show'
				|| event.type === 'app.record.detail.show'
				|| event.type === 'app.record.print.show'
			) {
				// kintone.app.record.setFieldShown(cfgEigyoRepotoFields.kokyakuSearch.code, false);
				kintone.app.record.setFieldShown(cfgEigyoRepotoFields.tantoshaSearch.code, false);
				// kintone.app.record.setFieldShown(cfgEigyoRepotoFields.ankenSearch.code, false);
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
		'app.record.create.change.' + cfgEigyoRepotoFields.katsudobi.code,
		'app.record.edit.change.' + cfgEigyoRepotoFields.katsudobi.code,
		'app.record.index.edit.change.' + cfgEigyoRepotoFields.katsudobi.code,
		'app.record.create.change.' + cfgEigyoRepotoFields.tantoshaId.code,
		'app.record.edit.change.' + cfgEigyoRepotoFields.tantoshaId.code,
		'app.record.index.edit.change.' + cfgEigyoRepotoFields.tantoshaId.code
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
		'app.record.create.change.' + cfgEigyoRepotoFields.kaishijikoku.code,
		'app.record.edit.change.' + cfgEigyoRepotoFields.kaishijikoku.code,
		'app.record.index.edit.change.' + cfgEigyoRepotoFields.kaishijikoku.code
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
		'app.record.create.submit.success',
		'app.record.edit.submit.success',
		'app.record.index.delete.submit',
		'app.record.detail.delete.submit'
	], async function (event) {
		try {
			await sncLib.eigyoKokyakuLinkage(event, config, configLinkage);
			return event;
		} catch (err) {
			console.log(err);
			if (event.type === 'app.record.create.submit.success' || event.type === 'app.record.edit.submit.success') {
				// sweetalert
				return Swal.fire({
					icon: 'error',
					title: cfgEigyoRepotoMessages.exceptionError
				}).then(function () {
					return event;
				});
			} else if (event.type === 'app.record.index.delete.submit' || event.type === 'app.record.detail.delete.submit') {
				event.error = cfgEigyoRepotoMessages.exceptionError
			}
			return event;
		}
	});

})(jQuery, window.nokConfig, window.kokyakuLinkageConfig, window.snc);
