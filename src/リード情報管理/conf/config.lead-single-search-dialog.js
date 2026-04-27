/**
 * @fileoverview 単一ルックアップ検索ダイアログ 設定情報
 * @author SNC
 * @version 1.0.4
 * @customer XXXXX（2023-05-25）
 */
(function (config) {
    'use strict';
    // グローバル変数
    window.ssdConfig = window.ssdConfig || {
        dialogs: [
            // =============================
            // 1つ目のダイアログ設定
            // =============================
            {
                // ダイアログ要素生成コンテンツDIV要素ID（任意文字列、重複禁止）
                id: 'ssd_single_id_0',
                // 検索対象先AppId
                app: config.kokyaku.app,
                // 検索先アプリのデータ取得フィールドコード（※ユニーク値限定）
                sourceField: 'nok_顧客ID',
                // 自アプリのセット対象フィールドコード（ルックアップフィールド限定）
                targetField: 'nok_顧客検索',
                // 検索ダイアログの設定
                config: {
                    title: '顧客検索ダイアログ',     // タイトル
                    spaceId: 'modal_single_space_0', // ダイアログ要素作成用のスペースId
                    maxResults: 500,                // 最大取得件数　overSearchResultsメッセージも合わせて変更すること
                    searchOpenDialog: true,        // 検索ダイアログ表示時に検索を行うかどうか
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
                        saishutaiobi: {
                            label: '最終対応日',
                            code: 'nok_最終対応日',
                            type: 'date',
                            val: null,
                            // init: { date: 'nextWeek' },
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
                            type: 'DROP_DOWN',
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
                    //  checkField:他アプリの戻り処理用チェックボックスフィールドコード
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
                        spaceId: 'kokyaku_search_btn',
                        id: 'kokyakuSearchBtn',
                        label: '顧客検索'
                    }
                },
                // メッセージ設定
                messages: {
                    'exceedSearchResults': '検索結果が500件を超えています。<br> 検索条件を入力して再度検索して下さい。',
                },
            },
            // =============================
            // 2つ目のダイアログ設定
            // =============================
            {
                // ダイアログ要素生成コンテンツDIV要素ID（任意文字列、重複禁止）
                id: 'ssd_single_id_1',
                // 検索対象先AppId
                app: config.keyman.app,
                // 検索先アプリのデータ取得フィールドコード（※ユニーク値限定）
                sourceField: 'nok_キーマンID',
                // 自アプリのセット対象フィールドコード（ルックアップフィールド限定）
                targetField: 'nok_キーマン検索',
                // 検索ダイアログの設定
                config: {
                    title: 'キーマン検索ダイアログ',     // タイトル
                    spaceId: 'modal_single_space_1', // ダイアログ要素作成用のスペースId
                    maxResults: 500,               // 最大取得件数　overSearchResultsメッセージも合わせて変更すること
                    searchOpenDialog: true,        // 検索ダイアログ表示時に検索を行うかどうか
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
                        m_kigyoumei: {
                            label: '顧客名',
                            code: 'nok_顧客名',
                            type: 'text',
                            val: null,
                            init: {
                                code: 'nok_顧客名',
                                set: null
                            },
                        },
                        m_busyomei: {
                            label: '部署名',
                            code: 'nok_部署',
                            type: 'text',
                            val: null,
                            init: null
                        },
                        m_shimei: {
                            label: '氏名',
                            code: 'nok_氏名',
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
                            label: '氏名',
                            code: 'nok_氏名',
                            type: 'SINGLE_LINE_TEXT',
                        },
                        {
                            label: '顧客名',
                            code: 'nok_顧客名',
                            type: 'SINGLE_LINE_TEXT',
                        },
                        {
                            label: '部署',
                            code: 'nok_部署',
                            type: 'SINGLE_LINE_TEXT',
                        },
                        {
                            label: '役職',
                            code: 'nok_役職',
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
                    //  checkField:他アプリの戻り処理用チェックボックスフィールドコード
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
                        spaceId: 'mendansha_search_btn',
                        id: 'mendanshaSearchBtn',
                        label: 'キーマン検索'
                    }
                },
                // メッセージ設定
                messages: {
                    'exceedSearchResults': '検索結果が500件を超えています。<br> 検索条件を入力して再度検索して下さい。',
                },
            },
        ],

        // =============================
        // 共通設定
        // =============================

        messages: {
            'noResult': '対象レコードが存在しません',
            'errorGetRecord': 'レコードの取得に失敗しました',
            'leaveTheScreenEndOfTheSearch': '検索終了まで画面はそのままにしてください',
        }
    }
})(window.nokConfig);
