/**
 * @fileoverview 顧客マスタアプリ　ターゲット・準ターゲット設定　ターゲット解除
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
(function (config) {
    'use strict';

    // グローバル変数
    window.kokyakuTargetConfig = window.kokyakuTargetConfig || {
        // ターゲット設定の一覧画面のビューID
        targetViewIds: [
            6014311
        ],
        // ターゲット解除の一覧画面のビューID
        liftTargetViewIds: [
            6014313
        ],
        // チェックボックスを表示する一覧のフィールドコード
        // ckeckboxField: 'nok_顧客レコード番号'
        ckeckboxField: 'nok_顧客名'
    };
})(window.nokConfig);
