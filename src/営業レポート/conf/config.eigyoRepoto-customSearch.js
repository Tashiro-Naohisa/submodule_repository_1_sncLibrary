/**
 * @fileoverview 営業報告アプリ　検索機能拡張設定情報
 * @author SNC
 * @version 3.0.4
 * @customer XXXXX（yyyy-mm-dd）
 */
(function (config) {
	'use strict';
	const cfgEigyoRepotoFields = config.eigyoRepoto.fields;

	// グローバル変数
	window.customSearchConfig = window.customSearchConfig || {
		// 対象となる一覧のIDを設定
		targetViewIds: [
			5355980
		],
		items: {
			item01: {
				fieldCode: cfgEigyoRepotoFields.kokyakumei.code,
				labelName: '顧客名 : ',
				operator: 'like',
				width: 200
			},
			item02: {
				fieldCode: cfgEigyoRepotoFields.tantoshaMei.code,
				labelName: '担当者名 : ',
				operator: 'like',
				width: 200
			}
		},
		buttons: {
			run: {
				labelName: '検索',
				width: 50
			},
			clear: {
				labelName: 'クリア',
				width: 50
			}
		},
		// 各項目の検索オプション
		// and: 全ての条件をみたす
		// or : いずれかの条件をみたす
		conditionOption: 'and'
	};

})(window.nokConfig);
