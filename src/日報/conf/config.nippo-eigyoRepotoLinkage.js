/**
 * @fileoverview  一括報告アプリ　営業レポート連携設定情報
 * @author SNC
 * @version 4.5.0
 * @customer XXXXX（yyyy-mm-dd）
 */
(function (config) {
	const cfgNippoFields = config.nippo.fields;
	const cfgEigyoRepotoFields = config.eigyoRepoto.fields;

	// グローバル変数 更新対象情報
	window.eigyoRepotoLinkageConfig = window.eigyoRepotoLinkageConfig || {
		fields: {
			header: [
				// 活動日
				{
					source: {
						code: cfgNippoFields.katsudobi.code,
						required: true
					},
					target: {
						type: 'DATE',
						code: cfgEigyoRepotoFields.katsudobi.code
					}
				},
				// 担当者検索コード
				{
					source: {
						code: cfgNippoFields.tantoshaSearch.code,
						required: true
					},
					target: {
						type: 'SINGLE_LINE_TEXT',
						code: cfgEigyoRepotoFields.tantoshaSearch.code
					}
				},
				// 予定・実績
				{
					source: {
						code: cfgNippoFields.yoteiJisseki.code,
						required: true
					},
					target: {
						type: 'RADIO_BUTTON',
						code: cfgEigyoRepotoFields.yoteiJisseki.code
					}
				},
				// 日報ID
				{
					source: {
						code: cfgNippoFields.nippoId.code,
						required: true
					},
					target: {
						type: 'SINGLE_LINE_TEXT',
						code: cfgEigyoRepotoFields.nippoId.code
					}
				}
			],
			detail: [
				// 開始時刻
				{
					source: {
						code: cfgNippoFields.kaishijikoku.code,
						required: true
					},
					target: {
						type: 'DATETIME',
						code: cfgEigyoRepotoFields.kaishijikoku.code
					}
				},
				// 終了時刻
				{
					source: {
						code: cfgNippoFields.shuryojikoku.code,
						required: true
					},
					target: {
						type: 'DATETIME',
						code: cfgEigyoRepotoFields.shuryojikoku.code
					}
				}
				,
				// 顧客名検索コード
				{
					source: {
						code: cfgNippoFields.kokyakuSearch.code,
						required: false
					},
					target: {
						type: 'SINGLE_LINE_TEXT',
						code: cfgEigyoRepotoFields.kokyakuSearch.code
					}
				},
				// 訪問目的
				{
					source: {
						code: cfgNippoFields.homonMokuteki.code,
						required: false
					},
					target: {
						type: 'DROP_DOWN',
						code: cfgEigyoRepotoFields.homonMokuteki.code
					}
				},
				// 訪問結果
				{
					source: {
						code: cfgNippoFields.homongoKekka.code,
						required: false
					},
					target: {
						type: 'DROP_DOWN',
						code: cfgEigyoRepotoFields.homongoKekka.code
					}
				},
				// 備考
				{
					source: {
						code: cfgNippoFields.biko.code,
						required: false
					},
					target: {
						type: 'SINGLE_LINE_TEXT',
						code: cfgEigyoRepotoFields.biko.code
					}
				}
			]
		},
		// 一括アプリと営業報告アプリのマッピング
		mappings: {
			// 予定・実績
			yoteiJisseki: {
				nippoCode: cfgNippoFields.yoteiJisseki.code,
				eigyoCode: cfgEigyoRepotoFields.yoteiJisseki.code
			},
			// 顧客ID
			kokyakuId: {
				nippoCode: cfgNippoFields.kokyakuSearch.code,
				eigyoCode: cfgEigyoRepotoFields.kokyakuId.code
			},
			// 開始時刻
			kaishijikoku: {
				nippoCode: cfgNippoFields.kaishijikoku.code,
				eigyoCode: cfgEigyoRepotoFields.kaishijikoku.code
			},
			// 終了時刻
			shuryojikoku: {
				nippoCode: cfgNippoFields.shuryojikoku.code,
				eigyoCode: cfgEigyoRepotoFields.shuryojikoku.code
			},
			// 活動日
			katsudobi: {
				nippoCode: cfgNippoFields.katsudobi.code,
				eigyoCode: cfgEigyoRepotoFields.katsudobi.code
			},
			// 担当者名
			tantoshaMei: {
				nippoCode: cfgNippoFields.tantoshaMei.code,
				eigyoCode: cfgEigyoRepotoFields.tantoshaMei.code
			},
			// 活動目的
			homonMokuteki: {
				nippoCode: cfgNippoFields.homonMokuteki.code,
				eigyoCode: cfgEigyoRepotoFields.homonMokuteki.code
			},
			// 活動内容
			biko: {
				nippoCode: cfgNippoFields.biko.code,
				eigyoCode: cfgEigyoRepotoFields.biko.code
			}
		}
	};
})(window.nokConfig);
