/**
 * @fileoverview 案件進捗一覧設定情報
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
(function (config) {

	const cfgEigyoRepotoFields = config.eigyoRepoto.fields;
	const cfgAnkenFields = config.anken.fields;

	// グローバル変数
	window.ankenProcessConfig = window.ankenProcessConfig || {
		process: {
			option: true,
			// 表示対象のビューID
			targetViewIds: [
				5355972
			],
			// 進捗管理対象フィールド
			target: {
				code: cfgEigyoRepotoFields.homongoKekka.code
			},
			// 進捗管理の経過日数算出の基準となる日付項目を設定
			// 設定されていない場合、システム日付とする
			baseDate: {
				code: ''
			},
			// 進捗情報
			// value: 進捗状態
			// dateFieldCode: 案件管理 訪問日用フィールド
			// eigyoRepotoIdFieldCode: 案件管理 営業活動レポート レコードNo.用フィールド
			list: [
				{
					value: '商談発生',
					dateFieldCode: cfgAnkenFields.shodanProcess01.code,
					eigyoRepotoIdFieldCode: cfgAnkenFields.shodanProcessID01.code,
				},
				{
					value: '商談進展',
					dateFieldCode: cfgAnkenFields.shodanProcess02.code,
					eigyoRepotoIdFieldCode: cfgAnkenFields.shodanProcessID02.code,
				},
				{
					value: '見積提示',
					dateFieldCode: cfgAnkenFields.shodanProcess03.code,
					eigyoRepotoIdFieldCode: cfgAnkenFields.shodanProcessID03.code,
				},
				{
					value: '受注',
					dateFieldCode: cfgAnkenFields.shodanProcess04.code,
					eigyoRepotoIdFieldCode: cfgAnkenFields.shodanProcessID04.code,
				},
				{
					value: '納品',
					dateFieldCode: cfgAnkenFields.shodanProcess05.code,
					eigyoRepotoIdFieldCode: cfgAnkenFields.shodanProcessID05.code,
				},
				{
					value: '失注',
					dateFieldCode: cfgAnkenFields.shodanProcess06.code,
					eigyoRepotoIdFieldCode: cfgAnkenFields.shodanProcessID06.code,
				},
				{
					value: '変化なし',
					dateFieldCode: cfgAnkenFields.shodanProcess07.code,
					eigyoRepotoIdFieldCode: cfgAnkenFields.shodanProcessID07.code,
				},
				{
					value: '商談プロセス08',
					dateFieldCode: cfgAnkenFields.shodanProcess08.code,
					eigyoRepotoIdFieldCode: cfgAnkenFields.shodanProcessID08.code,
				},
				{
					value: '商談プロセス09',
					dateFieldCode: cfgAnkenFields.shodanProcess09.code,
					eigyoRepotoIdFieldCode: cfgAnkenFields.shodanProcessID09.code,
				},
				{
					value: '商談プロセス10',
					dateFieldCode: cfgAnkenFields.shodanProcess10.code,
					eigyoRepotoIdFieldCode: cfgAnkenFields.shodanProcessID10.code,
				}
			],
			terms: [
				{
					'color': '#ff7fbf',
					//					'color': '#610B5E',
					'days': 0
				},
				{
					'color': '#ff8ec6',
					//					'color': '#8A0886',
					'days': 10
				},
				{
					'color': '#ff9ece',
					//					'color': '#B404AE',
					'days': 20
				},
				{
					'color': '#ffadd6',
					//					'color': '#DF01D7',
					'days': 30
				},
				{
					'color': '#ffbcdd',
					//					'color': '#FF00FF',
					'days': 40
				},
				{
					'color': '#ffcce5',
					//					'color': '#FE2EF7',
					'days': 50
				},
				{
					'color': '#ffdbed',
					//					'color': '#FA58F4',
					'days': 60
				},
				{
					'color': '#ffeaf4',
					//					'color': '#F5A9F2',
					'days': 70
				},
				{
					'color': '#ffeaf4',
					//					'color': '#F6CEF5',
					'days': 80
				},
				{
					'color': '#ffeaf4',
					//					'color': '#F8E0F7',
					'days': 90
				},
				{
					'color': '#ffeaf4',
					//					'color': '#FBEFFB',
					'days': 100
				},
			],
			//　メッセージ
			messages: {
				saveError: '案件管理アプリの進捗情報の更新処理に失敗しました。\n案件管理アプリを更新するため、再度、営業レポートを更新してください。',
				deleteError: '案件管理アプリの進捗情報の更新処理に失敗しました。\n削除処理を中断します。再度、削除を実行してください。'
			}
		}
	};

})(window.nokConfig);
