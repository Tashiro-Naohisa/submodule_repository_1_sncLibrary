/**
 * @fileoverview 顧客マスタアプリ　名寄せ
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
(function (config) {
	'use strict';

	// グローバル変数
	window.kokyakuNayoseConfig = window.kokyakuNayoseConfig || {
		targetViewIds: [
			5528458
		],
		requireFields: [
			config.kokyaku.fields.kokyakuId.code
		],
		dialogItems: [
			{
				label: 'レコード番号',
				fields: [config.kokyaku.fields.recordNo.code]
			},
			{
				label: '顧客ID',
				fields: [config.kokyaku.fields.kokyakuId.code]
			},
			{
				label: '顧客名',
				fields: [config.kokyaku.fields.kokyakumei.code]
			},
			{
				label: '住所',
				fields: [config.kokyaku.fields.jusho.code, config.kokyaku.fields.tatemonomei.code]
			},
			{
				label: 'TEL',
				fields: [config.kokyaku.fields.tel.code]
			},
			{
				label: 'FAX',
				fields: [config.kokyaku.fields.fax.code]
			}
		],
	};
})(window.nokConfig);
