/**
 * @fileoverview 予算・実績管理アプリ　予算・実績表
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
(function (config) {
	'use strict';

	const cfgAnkenFields = config.anken.fields;

	// グローバル変数
	window.yojitsuConfig = window.yojitsuConfig || {
		targetViewIds: [
			5540844
		],
		// 0：過去データは実績、当月と翌月以降は案件管理より集計
		// 1：過去データは実績、当月と実績値の集計＋翌月以降は案件管理より集計
		summaryPattern: 0,
		// 年度の開始月を指定
		periodStartMonth: 4,
		// 検索条件設定
		searchItems: {
			nengetsuFrom: {
				id: 'searchCondition-nengetsu-from',
				label: '',
				// initialValue: ''
			},
			nengetsuTo: {
				id: 'searchCondition-nengetsu-to',
				label: '',
				// initialValue: ''
			},
			kakudo: {
				id: 'searchCondition-kakudo',
				label: '確度',
				// values: ['受注', '内示', 'A', 'B', 'C', 'D'],
				// initialValue: ''
			},
			uriageArari: {
				id: 'searchCondition-uriage_arari',
				label: '表示項目',
				// values: ['売上＋粗利', '売上', '粗利'],
				// initialValue: '売上＋粗利'
			}
		},
		fields: {
			anken: {
				targetDate: cfgAnkenFields.kenshuyoteibi.code,
				kakudo: cfgAnkenFields.kakudo.code
			}
		},
		yojitsuSetting: {
			moveViewID: '5527116'
		}
	};
})(window.nokConfig);
