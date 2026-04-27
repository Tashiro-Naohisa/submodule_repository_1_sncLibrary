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
                id: 'msd_multiple_id_0',
                // 検索対象先AppId
                app: config.menu.app,
                // 検索先アプリのデータ取得フィールドコード（※ユニーク値限定）
                sourceField: 'nok_メニューID',
                // 自アプリのセット対象サブテーブルフィールドコード
                targetSubtableField: 'nok_メニューパターン',
                // 自アプリのセット対象フィールドコード（サブテーブル内のルックアップフィールド限定）
                targetField: 'nok_メニュー検索',
                // 検索ダイアログの設定
                dialog: {
                    title: 'メニュー検索ダイアログ',    // タイトル
                    spaceId: 'modal_multiple_space_0', // ダイアログ要素作成用のスペースId
                    maxResults: 500,                 // 最大取得件数　overSearchResultsメッセージも合わせて変更すること
                    searchOpenDialog: true,          // 検索ダイアログ表示時に検索を行うかどうか
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
                        menumei: {
                            label: 'メニュー名',
                            code: 'nok_メニュー名',
                            type: 'text',
                            val: null,
                            init: null,
                        },
                        appmei: {
                            label: 'アプリ名',
                            code: 'nok_アプリ名',
                            type: 'text',
                            val: null,
                            init: null,
                        },
                        ichiranmei: {
                            label: '一覧名',
                            code: 'nok_一覧名',
                            type: 'text',
                            val: null,
                            init: null,
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
                            label: 'メニュー名',
                            code: 'nok_メニュー名',
                            type: 'SINGLE_LINE_TEXT',
                        },
                        {
                            label: 'アプリ名',
                            code: 'nok_アプリ名',
                            type: 'SINGLE_LINE_TEXT',
                        },
                        {
                            label: '一覧名',
                            code: 'nok_一覧名',
                            type: 'SINGLE_LINE_TEXT',
                        },
                        {
                            label: '一覧URL',
                            code: 'nok_一覧URL',
                            type: 'LINK',
                        },
                        {
                            label: 'メニューID',
                            code: 'nok_メニューID',
                            type: 'SINGLE_LINE_TEXT',
                        },
                        {
                            label: 'アプリID',
                            code: 'nok_アプリID',
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
                        spaceId: 'menu_search_btn',
                        id: 'menuSearchBtn',
                        label: 'メニュー検索'
                    }
                }
            },
            // =============================
            // 2つ目のダイアログ設定
            // =============================
            {
                // ダイアログ要素生成コンテンツDIV要素ID（任意文字列、重複禁止）
                id: 'msd_multiple_id_1',
                // 検索対象先AppId
                app: config.graph.app,
                // 検索先アプリのデータ取得フィールドコード（※ユニーク値限定）
                sourceField: 'nok_グラフID',
                // 自アプリのセット対象サブテーブルフィールドコード
                targetSubtableField: 'nok_グラフパターン',
                // 自アプリのセット対象フィールドコード（サブテーブル内のルックアップフィールド限定）
                targetField: 'nok_グラフ検索',
                // 検索ダイアログの設定
                dialog: {
                    title: 'グラフ検索ダイアログ',    // タイトル
                    spaceId: 'modal_multiple_space_1', // ダイアログ要素作成用のスペースId
                    maxResults: 500,                 // 最大取得件数　overSearchResultsメッセージも合わせて変更すること
                    searchOpenDialog: true,          // 検索ダイアログ表示時に検索を行うかどうか
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
                        graphmei: {
                            label: 'グラフ名',
                            code: 'nok_グラフ名',
                            type: 'text',
                            val: null,
                            init: null,
                        },
                        graphtype: {
                            label: 'グラフタイプ',
                            code: 'nok_グラフタイプ',
                            type: 'select',
                            val: [
                                'パイプライングラフ',
                                '積み上げ縦棒グラフ',
                                '半ドーナツグラフ',
                                '前年対比棒グラフ'
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
                            label: 'グラフ名',
                            code: 'nok_グラフ名',
                            type: 'SINGLE_LINE_TEXT',
                        },
                        {
                            label: 'グラフタイプ',
                            code: 'nok_グラフタイプ',
                            type: 'DROP_DOWN',
                        },
                        {
                            label: 'グラフ説明',
                            code: 'nok_グラフ説明',
                            type: 'SINGLE_LINE_TEXT',
                        },
                        {
                            label: 'グラフID',
                            code: 'nok_グラフID',
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
                        spaceId: 'graph_search_btn',
                        id: 'graphSearchBtn',
                        label: 'グラフ検索'
                    }
                }
            },
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
