/**
 * @fileoverview キーマン管理アプリ　名寄せ
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
(function (config) {
	'use strict';

	// グローバル変数
	window.keymanNayoseConfig = window.keymanNayoseConfig || {
		targetViewIds: [
			5528456
		],
		requireFields: [
			config.keyman.fields.keymanId.code
		],
		dialogItems: [
			{
				label: 'レコード番号',
				fields: [config.keyman.fields.recordNo.code]
			},
			{
				label: 'キーマンID',
				fields: [config.keyman.fields.keymanId.code]
			},
			{
				label: '顧客名',
				fields: [config.keyman.fields.kokyakumei.code]
			},
			{
				label: '氏名',
				fields: [config.keyman.fields.keymanmei.code]
			},
			{
				label: '部署',
				fields: [config.keyman.fields.busho.code]
			},
			{
				label: '役職',
				fields: [config.keyman.fields.yakushoku.code]
			},
			{
				label: '住所',
				fields: [config.keyman.fields.jusho.code, config.keyman.fields.tatemonomei.code]
			},
			{
				label: 'TEL',
				fields: [config.keyman.fields.tel.code]
			},
			{
				label: 'FAX',
				fields: [config.keyman.fields.fax.code]
			},
			{
				label: 'メールアドレス',
				fields: [config.keyman.fields.mail.code]
			}
		]
	};
})(window.nokConfig);
