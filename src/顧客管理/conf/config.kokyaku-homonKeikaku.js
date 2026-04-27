/**
 * @fileoverview 顧客管理アプリ　訪問計画
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
(function (config) {
    'use strict';

    const cfgKokyakuFields = config.kokyaku.fields;

    // グローバル変数
    window.koyakuHomonKeikakuConfig = window.koyakuHomonKeikakuConfig || {
        // 一覧画面のビューID
        targetViewIds: [
            6011768
        ],
        // ヘッダーの表示項目の設定
        headerItems: [
            {
                'label': '顧客名',
                'css': 'width:12%;',
                'code': cfgKokyakuFields.kokyakumei.code
            },
            {
                'label': '顧客ID',
                'css': 'width:4%;',
                'code': cfgKokyakuFields.kokyakuId.code
            },
            {
                'label': '郵便番号',
                'css': 'width:5.5%;',
                'code': cfgKokyakuFields.yubinBango.code
            },
            {
                'label': '住所',
                'css': 'width:10.5%;',
                'code': cfgKokyakuFields.jusho.code
            },
        ],
        // セルの色設定
        cellColor: {
            yoteiAfter: {
                // 予定登録済の色設定
                'color': 'green',
                // 予定登録済の色の説明
                'description': '：予定登録済'
            },
            yoteiBefore: {
                // 予定登録前の色設定
                'color': 'lime',
                'description': '：予定登録前'
            },
            jisseki: {
                // 実績登録済の色設定
                'color': 'blue',
                'description': '：実績登録済'
            },
            delete: {
                // 予定削除の色設定
                'color': 'red',
                'description': '：予定削除'
            }
        },
        // ヘッダー:曜日の色設定
        dayColor: {
            // 土曜の色設定
            'saturday': '#6495ED',
            // 日曜の色設定
            'sunday': '#FA8072',
            // 平日の色設定
            'weekday': '#F1CD6C',
            // 休日・祝日の色設定
            'holiday': '#FA8072',
            // 今日の色設定
            'today': '#FFCCFF'
        },
        // カレンダーの表示開始日設定
        // startingTodayがtrueなら開始日が当日スタート
        // startingTodayがfalseなら開始日が月初スタート
        calendarSetting: {
            // 'startingToday': true
            'startingToday': false
        }
    };
})(window.nokConfig);
