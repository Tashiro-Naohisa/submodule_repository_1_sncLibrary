/**
 * @fileoverview ポータル設定アプリ
 * @author SNC
 * @version 4.5.0
 * @customer XXXXX（yyyy-mm-dd）
*/
(function (config) {
    'use strict';

    const menuMaxHyojijun = config.portalSetting.menu.maxHyojijun.code;   // 一行に設定可能なアプリ数(globalConfig.nok.jsを参照)
    const graphMaxHyojijun = config.portalSetting.graph.maxHyojijun.code; // 一行に設定可能なグラフ数(globalConfig.nok.jsを参照)

    // グローバル変数
    window.portalConfig = window.portalConfig || {
        // =============================
        // 共通設定
        // =============================
        messages: {
            'required': '必須です。',
            'requiredNaturalNumber': '自然数を入力してください。',
            'cannotDelete': '担当者マスタで参照しているデータのため削除できません。',
            'menuMax': 'メニューパターンの一行に設定可能なアプリ数は' + menuMaxHyojijun + '個です。',
            'graphMax': 'グラフパターンの一行に設定可能なグラフ数は' + graphMaxHyojijun + '個です。',
            'error': 'エラーが発生しました。',
            'titleError': '以下の入力内容にエラーがあるため保存できません。\n・'
        }
    };
})(window.nokConfig);
