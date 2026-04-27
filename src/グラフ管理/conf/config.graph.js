/**
 * @fileoverview グラフ管理アプリ
 * @author SNC
 * @version 4.5.0
 * @customer XXXXX（yyyy-mm-dd）
*/
(function (config) {
    'use strict';

    const cfgGraphFields = config.graph.fields;
    // グローバル変数
    window.graphConfig = window.graphConfig || {
        // =============================
        // 共通設定
        // =============================
        fieldList: {
            // 共通設定フィールド
            kyotsu: [
                cfgGraphFields.graphId.code,
                cfgGraphFields.graphIdKey.code,
                cfgGraphFields.graphType.code,
                cfgGraphFields.graphMei.code,
                cfgGraphFields.graphSetsumei.code,
            ],
            // パイプライングラフのデフォルトフィールド
            paipurain: [
                cfgGraphFields.paipurainTaisho.code,
                cfgGraphFields.paipurainAtai.code,
                cfgGraphFields.paipurainHanrei.code,
                cfgGraphFields.paipurainNengetsu.code,
            ],
            // 積み上げ縦棒グラフのデフォルトフィールド
            tsumiage: [
                cfgGraphFields.tsumiageTaisho.code,
                cfgGraphFields.tsumiageJiku.code,
                cfgGraphFields.tsumiageAtai.code,
                cfgGraphFields.tsumiageHanrei.code,
                cfgGraphFields.tsumiageNengetsu.code,
            ],
            // 半ドーナツグラフのデフォルトフィールド
            handonatsu: [
                cfgGraphFields.handonatsuTaisho.code,
                cfgGraphFields.handonatsuAtai.code,
                cfgGraphFields.handonatsuKakudo.code,
                cfgGraphFields.handonatsuNengetsu.code,
            ],
            // 縦棒グラフのデフォルトフィールド
            tatebo: [
                cfgGraphFields.tateboTaisho.code,
                cfgGraphFields.tateboJiku.code,
                cfgGraphFields.tateboAtai.code,
                cfgGraphFields.tateboKakudo.code,
                cfgGraphFields.tateboNengetsu.code,
            ]
        },
        // ポータル設定アプリでのルックアップフィールド
        portalSettingLookup: [
            cfgGraphFields.graphType.code,
            cfgGraphFields.graphMei.code,
            cfgGraphFields.graphSetsumei.code,
        ],
        messages: {
            'error': 'エラーが発生しました。',
            'requiredField': '必須です。',
            'cannotDelete': 'ポータル設定で参照しているデータのため削除できません。',
            'updateFail': '更新に失敗しました。',
            'requiredError': '必須エラーがあります。',
            'icon': {
                'error': 'error'
            }
        },
        device: {
            desktop: 'デスクトップ',
            mobile: 'モバイル'
        }
    };
})(window.nokConfig);
