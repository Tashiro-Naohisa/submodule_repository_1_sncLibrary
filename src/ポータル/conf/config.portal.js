/**
 * @fileoverview NICE営業 on kintone ポータルグラフ設定情報
 * @author SNC
 * @version 4.5.1
 * @customer XXXXX（yyyy-mm-dd）
*/
(function (globalConfig) {
    'use strict';

    // グローバル変数
    window.portalConfigGlobal = window.portalConfigGlobal || {
        // 1つ目のスペース（Ver4.0）の設定
        spaceId_7: {
            graph: {
                // グラフの値と軸の表示タイトル設定
                titles: {
                    '売上': '合計（売上）',
                    '粗利': '合計（粗利）',
                    '件数': '件数',
                    '月': '月',
                    '担当者': '担当者',
                    '組織': '組織'
                },
                // パイプライングラフの設定
                pipeline: {
                    labels: ['商談発生', '商談進展', '見積提示', '受注', '納品'], // 表示する凡例設定
                    colors: { // カラーコードでも指定可能
                        backgroundColor: [
                            'rgba(255, 26, 104, 0.2)', // 商談発生バーの色　
                            'rgba(54, 162, 235, 0.2)', // 商談進展バーの色
                            'rgba(255, 206, 86, 0.2)', // 見積提示バーの色
                            'rgba(75, 192, 192, 0.2)', // 受注バーの色
                            'rgba(153, 102, 255, 0.2)' // 納品バーの色
                        ],
                        borderColor: [
                            'rgba(255, 26, 104, 1)',    // 商談発生枠の色
                            'rgba(54, 162, 235, 1)',    // 商談進展枠の色
                            'rgba(255, 206, 86, 1)',    // 見積提示枠の色
                            'rgba(75, 192, 192, 1)',    // 受注枠の色
                            'rgba(153, 102, 255, 1)'    // 納品枠の色
                        ]
                    },
                },
                // 積み上げ棒グラフの設定
                stackedBar: {
                    kakudoOrder: ['確度A', '確度B', '確度C', '受注'],// 表示する確度
                    colors: {
                        backgroundColor: [
                            'rgba(255, 26, 104, 0.2)', // 確度Aバーの色
                            'rgba(54, 162, 235, 0.2)', // 確度Bバーの色
                            'rgba(255, 206, 86, 0.2)', // 確度Cバーの色
                            'rgba(75, 192, 192, 0.2)'  // 受注バーの色
                        ],
                        borderColor: [
                            'rgba(255, 26, 104, 1)',   // 確度A枠の色
                            'rgba(54, 162, 235, 1)',   // 確度B枠の色
                            'rgba(255, 206, 86, 1)',   // 確度C枠の色
                            'rgba(75, 192, 192, 1)'    // 受注枠の色
                        ]
                    },
                },
                // 半ドーナツグラフの設定
                halfDonut: {
                    colors: {
                        backgroundColor: [
                            'rgba(255, 26, 104, 0.2)', // 実績金額の色
                            'rgba(54, 162, 235, 0.2)' // 残予算金額の色
                        ],
                        borderColor: [
                            'rgba(255, 26, 104, 1)', // 実績金額枠の色
                            'rgba(54, 162, 235, 1)', // 残予算金額枠の色
                        ]
                    },
                },
                // 縦棒グラフ（対前年比グラフ）の設定
                verticalBar: {
                    colors: {
                        backgroundColor: [
                            'rgba(255, 26, 104, 0.2)', // 今年度の色
                            'rgba(54, 162, 235, 0.2)', // 前年度の色
                        ],
                        borderColor: [
                            'rgba(255, 26, 104, 1)', // 今年度枠の色
                            'rgba(54, 162, 235, 1)', // 前年度枠の色
                        ]
                    },
                }
            },
            // 予算・実績管理アプリのconfig.yojitsu.jsのfieldsの設定と同様
            fields: {
                anken: {
                    targetDate: globalConfig.spaceId_7.anken.fields.kenshuyoteibi.code,
                    kakudo: globalConfig.spaceId_7.anken.fields.kakudo.code
                },
            },
            // 予算・実績管理アプリのconfig.yojitsu.jsのsummaryPatternの設定と同様
            // 0：先月までは実績（予実アプリから取得）、見込みは　当月＋翌月以降は案件管理より集計
            // 1：先月までは実績（予実アプリから取得）、見込みは　当月は実績値の集計（予実アプリから）＋ 翌月以降は案件管理より集計
            summaryPattern: 1,
        },
        // 2つ目のスペース（Ver4.5）の設定
        spaceId_3: {
            graph: {
                // グラフの値と軸の表示タイトル設定
                titles: {
                    '売上': '合計（売上）',
                    '粗利': '合計（粗利）',
                    '件数': '件数',
                    '月': '月',
                    '担当者': '担当者',
                    '組織': '組織'
                },
                // パイプライングラフの設定
                pipeline: {
                    labels: ['商談発生', '商談進展', '見積提示', '受注', '納品'], // 表示する凡例設定
                    colors: { // カラーコードでも指定可能
                        backgroundColor: [
                            'rgba(255, 26, 104, 0.2)', // 商談発生バーの色　
                            'rgba(54, 162, 235, 0.2)', // 商談進展バーの色
                            'rgba(255, 206, 86, 0.2)', // 見積提示バーの色
                            'rgba(75, 192, 192, 0.2)', // 受注バーの色
                            'rgba(153, 102, 255, 0.2)' // 納品バーの色
                        ],
                        borderColor: [
                            'rgba(255, 26, 104, 1)',    // 商談発生枠の色
                            'rgba(54, 162, 235, 1)',    // 商談進展枠の色
                            'rgba(255, 206, 86, 1)',    // 見積提示枠の色
                            'rgba(75, 192, 192, 1)',    // 受注枠の色
                            'rgba(153, 102, 255, 1)'    // 納品枠の色
                        ]
                    },
                },
                // 積み上げ棒グラフの設定
                stackedBar: {
                    kakudoOrder: ['確度A', '確度B', '確度C', '受注'],// 表示する確度
                    colors: {
                        backgroundColor: [
                            'rgba(255, 26, 104, 0.2)', // 確度Aバーの色
                            'rgba(54, 162, 235, 0.2)', // 確度Bバーの色
                            'rgba(255, 206, 86, 0.2)', // 確度Cバーの色
                            'rgba(75, 192, 192, 0.2)'  // 受注バーの色
                        ],
                        borderColor: [
                            'rgba(255, 26, 104, 1)',   // 確度A枠の色
                            'rgba(54, 162, 235, 1)',   // 確度B枠の色
                            'rgba(255, 206, 86, 1)',   // 確度C枠の色
                            'rgba(75, 192, 192, 1)'    // 受注枠の色
                        ]
                    },
                },
                // 半ドーナツグラフの設定
                halfDonut: {
                    colors: {
                        backgroundColor: [
                            'rgba(255, 26, 104, 0.2)', // 実績金額の色
                            'rgba(54, 162, 235, 0.2)' // 残予算金額の色
                        ],
                        borderColor: [
                            'rgba(255, 26, 104, 1)', // 実績金額枠の色
                            'rgba(54, 162, 235, 1)', // 残予算金額枠の色
                        ]
                    },
                },
                // 縦棒グラフ（対前年比グラフ）の設定
                verticalBar: {
                    colors: {
                        backgroundColor: [
                            'rgba(255, 26, 104, 0.2)', // 今年度の色
                            'rgba(54, 162, 235, 0.2)', // 前年度の色
                        ],
                        borderColor: [
                            'rgba(255, 26, 104, 1)', // 今年度枠の色
                            'rgba(54, 162, 235, 1)', // 前年度枠の色
                        ]
                    },
                }
            },
            // 予算・実績管理アプリのconfig.yojitsu.jsのfieldsの設定と同様
            fields: {
                anken: {
                    targetDate: globalConfig.spaceId_3.anken.fields.kenshuyoteibi.code,
                    kakudo: globalConfig.spaceId_3.anken.fields.kakudo.code
                },
            },
            // 予算・実績管理アプリのconfig.yojitsu.jsのsummaryPatternの設定と同様
            // 0：先月までは実績（予実アプリから取得）、見込みは　当月＋翌月以降は案件管理より集計
            // 1：先月までは実績（予実アプリから取得）、見込みは　当月は実績値の集計（予実アプリから）＋ 翌月以降は案件管理より集計
            summaryPattern: 1,
        },
    }
})(window.nokConfigGlobal);
