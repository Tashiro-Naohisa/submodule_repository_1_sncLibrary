/**
 * @fileoverview 関連レコード風テーブル表示機能
 * @author SNC
 * @version 1.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
(function (config) {
    'use strict';
    // グローバル変数
    window.tblConfig = window.tblConfig || {

        // 関連レコードテーブル設定情報（複数設定可）
        config: [
            // ==================================
            // 1つめの関連レコードテーブル用の設定
            // ==================================
            {
                // 参照先アプリId
                targetAppId: config.eigyoRepoto.app,
                // テーブル表示用のspaceId（※ユニーク値限定）
                tableSpaceId: 'mendansya_table',
                // テーブル表示用のtableId（※ユニーク値限定）
                tableId: 'mendansya_table_id',
                // テーブル表示項目設定
                // 添付ファイルフィールドは対象外
                displayFields: [
                    // label: カラムのラベル名,
                    // code: フィールドコード,
                    // subtableCode: サブテーブルのフィールドコード
                    // 　　　　　　　　対象カラムがサブテーブル内のフィールドの場合使用
                    // 　　　　　　　　サブテーブル内のフィールドではない場合はnullを指定
                    // width: 横幅（数値）
                    {
                        label: '活動日',
                        code: 'nok_活動日',
                        subtableCode: null,
                    },
                    {
                        label: '予定・実績',
                        code: 'nok_予定・実績',
                        subtableCode: null,
                    },
                    {
                        label: '活動目的',
                        code: 'nok_活動目的',
                        subtableCode: null,
                    },
                    {
                        label: '案件名',
                        code: 'nok_案件名',
                        subtableCode: null,
                    },
                    {
                        label: '結果',
                        code: 'nok_訪問後_結果',
                        subtableCode: null,
                    },
                    {
                        label: '同席者',
                        code: 'nok_キーマンTB_面談者',
                        subtableCode: 'nok_キーマンTB',
                        width: 200
                    },
                    {
                        label: '内容',
                        code: 'nok_活動内容',
                        subtableCode: null,
                        // width: 200
                    },
                ],
                // テーブル最大表示件数
                limit: 5,
                // 表示するレコードの条件（クエリ）
                // 複数指定可能
                // 現状、TEXTのフィールドタイプのみ指定可能
                query: {
                    conditions: [
                        // target : 検索対象フィールドコード
                        // source : 参照元値フィールドコード
                        // type : フィールドタイプ（TEXTのみ現状対応）
                        // subtable : サブテーブル内のフィールドかどうか
                        {
                            target: 'nok_キーマンTB_キーマン検索',
                            source: 'nok_キーマンID',
                            type: 'TEXT',
                            subtable: true
                        }
                    ],
                    // ソート条件（最大5つまで設定可能）
                    sortOrders: [
                        {
                            // 検索対象先アプリのフィールドコード
                            fieldCode: '$id',
                            order: 'desc',
                        },
                    ],
                    // and : すべての条件を満たす
                    // or: いずれかの条件を満たす
                    and_or: 'or',
                },
            },
        ]
    }
})(window.nokConfig);
