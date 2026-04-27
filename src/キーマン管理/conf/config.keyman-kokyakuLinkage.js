/**
 * @fileoverview キーマン管理アプリ　顧客一括登録オプション
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
(function (config) {
	'use strict';

	// グローバル変数
	window.kokyakuLinkageConfig = window.kokyakuLinkageConfig || {
		targetViewIds: [
			5529925
		],
		matchingFields: {
			'keyman': [config.keyman.fields.meishiKaishamei.code, config.keyman.fields.jusho.code/*, config.keyman.fields.tatemonomei.code*/],
			'kokyaku': [config.kokyaku.fields.kokyakumei.code, config.kokyaku.fields.jusho.code/*, config.kokyaku.fields.tatemonomei.code*/]
		},
		copyFields: [
			{
				'keyman': config.keyman.fields.meishiKaishamei.code,
				'kokyaku': config.kokyaku.fields.kokyakumei.code
			},
			{
				'keyman': config.keyman.fields.yubinBango.code,
				'kokyaku': config.kokyaku.fields.yubinBango.code
			},
			{
				'keyman': config.keyman.fields.jusho.code,
				'kokyaku': config.kokyaku.fields.jusho.code
			},
			{
				'keyman': config.keyman.fields.tatemonomei.code,
				'kokyaku': config.kokyaku.fields.tatemonomei.code
			},
			{
				'keyman': config.keyman.fields.tel.code,
				'kokyaku': config.kokyaku.fields.tel.code
			},
			{
				'keyman': config.keyman.fields.fax.code,
				'kokyaku': config.kokyaku.fields.fax.code
			}
		],
		message: {
			'confirm': '顧客情報の一括登録を行います。<br/>よろしいですか？',
			'success': '一括登録処理が完了しました。',
			'fail': '一括登録処理に失敗しました。',
			'notExistTarget': '一括登録対象のキーマンは存在しませんでした。<br/>（「顧客名検索コード」が未登録、かつ、「会社名(名刺情報)」が登録済のキーマン）'
		}
	};
})(window.nokConfig);
