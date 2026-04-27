/**
 * @fileoverview 営業活動レポートアプリ　案件管理アプリ連携の設定情報
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
(function (config) {
	'use strict';

	const cfgEigyoRepotoFields = config.eigyoRepoto.fields;
	const cfgAnkenFields = config.anken.fields;

	// グローバル変数
	window.ankenLinkageConfig = window.ankenLinkageConfig || {
		// 案件連携オプション
		//   true: on, false: off
		option: true,
		// 案件管理アプリ 更新キー
		key: {
			code: cfgEigyoRepotoFields.ankenRecordId.code,
		},
		// 更新対象フィールドリスト
		//   compareFieldCode: 営業活動レポート 更新比較用フィールド
		//   sourceFieldCode: 営業活動レポート 参照用フィールド
		//   targetFieldCode: 案件管理 更新用フィールド
		list: [
			// 確度
			{
				compareFieldCode: cfgEigyoRepotoFields.kakudo.code,
				sourceFieldCode: cfgEigyoRepotoFields.homongoKakudo.code,
				targetFieldCode: cfgAnkenFields.kakudo.code
			},
			// 訪問結果
			{
				compareFieldCode: cfgEigyoRepotoFields.homonkekka.code,
				sourceFieldCode: cfgEigyoRepotoFields.homongoKekka.code,
				targetFieldCode: cfgAnkenFields.homonkekka.code
			},
			// 売上
			{
				compareFieldCode: cfgEigyoRepotoFields.uriage.code,
				sourceFieldCode: cfgEigyoRepotoFields.homongoUriage.code,
				targetFieldCode: cfgAnkenFields.uriage.code
			},
			// 付加価値
			{
				compareFieldCode: cfgEigyoRepotoFields.fukakachi.code,
				sourceFieldCode: cfgEigyoRepotoFields.homongoFukakachi.code,
				targetFieldCode: cfgAnkenFields.fukakachi.code
			},
			// 受注予定日
			{
				compareFieldCode: cfgEigyoRepotoFields.juchuyoteibi.code,
				sourceFieldCode: cfgEigyoRepotoFields.homongoJuchuyoteibi.code,
				targetFieldCode: cfgAnkenFields.juchuyoteibi.code
			},
			// 検収予定日
			{
				compareFieldCode: cfgEigyoRepotoFields.kenshuyoteibi.code,
				sourceFieldCode: cfgEigyoRepotoFields.homongoKenshuyoteibi.code,
				targetFieldCode: cfgAnkenFields.kenshuyoteibi.code
			},
		],
		//　メッセージ
		message: {
			'saveError': '案件管理アプリの進捗情報の更新処理に失敗しました。\n案件管理アプリを更新するため、再度、営業レポートを更新してください。',
			'deleteError': '案件管理アプリの進捗情報の更新処理に失敗しました。\n削除処理を中断します。再度、削除を実行してください。'
		}
	};

})(window.nokConfig);
