/**
 * @fileoverview 複数ルックアップ検索ダイアログ 設定情報
 * @author SNC
 * @version 1.0.7
 * @customer XXXXX（2023-05-25）
 */
(function (config) {
    'use strict';
    // グローバル変数
    window.msdConfig = window.msdConfig || {

        dialogs: [
            // =============================
            // 1つ目のダイアログ設定
            // =============================
            {
                // ダイアログ要素生成コンテンツDIV要素ID（任意文字列、重複禁止）
                id: 'msd_multiple_id',
                // 検索対象先AppId
                app: config.kokyaku.app,
                // 検索先アプリのデータ取得フィールドコード（※ユニーク値限定）
                sourceField: 'nok_顧客ID',
                // 自アプリのセット対象サブテーブルフィールドコード
                targetSubtableField: 'nok_営業報告TB',
                // 自アプリのセット対象フィールドコード（サブテーブル内のルックアップフィールド限定）
                targetField: 'nok_顧客検索',
                // 検索ダイアログの設定
                dialog: {
                    title: '顧客検索ダイアログ',     // タイトル
                    spaceId: 'modal_multiple_space_0', // ダイアログ要素作成用のスペースId
                    maxResults: 200,                 // 最大取得件数　overSearchResultsメッセージも合わせて変更すること
                    searchOpenDialog: true,         // 検索ダイアログ表示時に検索を行うかどうか
                    initQuery: '',                   // 初期条件のクエリ
                    defaultCondition: 'and',         // and/orで設定　デフォルト検索条件がand検索かor検索か
                    // 検索対象フィールドの設定
                    // キーは重複禁止
                    // キー（任意）: {
                    //  label:検索項目ラベル名
                    //  code:検索対象アプリ先のフィールドコード
                    //  type: フィールドタイプ　※2022/09/12 対象フィールドタイプはテキスト、ドロップダウン、日付
                    //  val: 選択肢（ドロップダウンの場合のみ使用、使用しない場合はnull）
                    //  init: 初期設定（使用しない場合はnull） {　
                    //    code: 自アプリのフィールドコード（テキストの場合のみ使用、使用しない場合はnull）
                    //    set: 初期設定値（ドロップダウンの場合のみ使用、使用しない場合はnull）
                    //    date: 指定期間（日付の場合のみ使用、使用しない場合はnull）
                    //        （yesterday, today, tomorrow, lastWeek, week, nextWeek, lastMonth, month, nextMonth, lastYear, year, nextYear）
                    //  }
                    // }
                    searchFieldConfig: {
                        kigyoumei: {
                            label: '顧客名',
                            code: 'nok_顧客名',
                            type: 'text',
                            val: null,
                            init: null,
                        },
                        jusho: {
                            label: '住所',
                            code: 'nok_顧客住所',
                            type: 'text',
                            val: null,
                            init: null,
                        },
                        yakushokukurasu: {
                            label: '顧客ランク',
                            code: 'nok_顧客ランク',
                            type: 'select',
                            val: [
                                'Aランク',
                                'Bランク',
                                'Cランク',
                                'Dランク',
                            ],
                            init: {
                                code: null,
                                set: [
                                ]
                            }
                        },
                    },
                    // 検索結果テーブルに表示されるフィールドの設定
                    // {
                    //  label:列名（任意）
                    //  code:フィールドコード
                    //  type:フィールドタイプを設定（https://developer.cybozu.io/hc/ja/articles/202166330-%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB%E3%83%89%E5%BD%A2%E5%BC%8F）
                    //  ※2021/11/19 対象外フィールドタイプは以下
                    //    FILE,SUBTABLE,REFERENCE_TABLE,CATEGORY,STATUS,STATUS_ASSIGNEE,
                    // }
                    showTableColumn: [
                        {
                            label: '顧客名',
                            code: 'nok_顧客名',
                            type: 'SINGLE_LINE_TEXT',
                        },
                        {
                            label: '住所',
                            code: 'nok_顧客住所',
                            type: 'SINGLE_LINE_TEXT',
                        },
                        {
                            label: 'TEL',
                            code: 'nok_TEL',
                            type: 'SINGLE_LINE_TEXT',
                        },
                        {
                            label: '顧客ランク',
                            code: 'nok_顧客ランク',
                            type: 'SINGLE_LINE_TEXT',
                        },
                    ],
                    // フッター部分に配置するオプションボタン設定
                    // 新規登録画面への遷移機能限定
                    // {
                    //  id:ボタンId（重複禁止）
                    //  appId:遷移先
                    //  label:ボタン表示名（任意）
                    //  target:他アプリ遷移後値セットフィールドコード（ルックアップフィールド限定）
                    //  source:自アプリ値参照フィールドコード
                    // }
                    optionBtn: [
                        {
                            id: 'kokyaku_create_btn',
                            appId: config.kokyaku.app,
                            label: '新規顧客作成',
                            target: 'nok_担当者検索',
                            source: 'nok_担当者ID',
                            checkField: 'nok_報告一括確認'
                        },
                    ]
                },
                // 検索ボタンの設定（ダイアログ表示用）
                btnConfig: {
                    // キー（任意）: {
                    //  spaceId:ボタン配置スペースId
                    //  id:ボタンId（重複禁止）
                    //  label:ボタン表示名（任意）
                    // }
                    searchBtn: {
                        spaceId: 'kokyaku_search_btn',
                        id: 'kokyakuSearchBtn',
                        label: '顧客検索'
                    }
                }
            }
        ],

        // =============================
        // 共通設定
        // =============================
        messages: {
            'noResult': '対象レコードが存在しません',
            'errorGetRecord': 'レコードの取得に失敗しました',
            'leaveTheScreenEndOfTheSearch': '検索終了まで画面はそのままにしてください',
            'errorIncorrectDate': '日付の前後関係が正しくありません。',
        },

    }
})(window.nokConfig);
