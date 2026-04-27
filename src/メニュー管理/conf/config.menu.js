/**
 * @fileoverview メニュー管理アプリ
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
*/
(function (config) {
    'use strict';

    const cfgMenuFields = config.menu.fields;

    // グローバル変数
    window.menuConfig = window.menuConfig || {
        // =============================
        // ポータル設定アプリでのルックアップフィールド
        // =============================
        portalSettingLookup: [
            cfgMenuFields.menuAppMei.code,
            cfgMenuFields.menuAppId.code,
            cfgMenuFields.menuIchiranMei.code,
            cfgMenuFields.menuIchiranUrl.code,
            cfgMenuFields.menuBase64Mojiretsu.code
        ],
        messages: {
            'error': 'エラーが発生しました。もう一度お試しください。',
            'cannotDelete': 'ポータル設定で参照しているデータのため削除できません。',
            'imageOneSelect': 'ファイルは10MB以下の1つの画像（BMP、GIF、JPG、PNG）を選択してください。',
            'updateFail': '更新に失敗しました。',
            'waitLoad': '画像のサムネイルが表示されてから、保存ボタンをもう一度おしてください。',
            'icon': {
                'error': 'error',
                'success': 'success'
            }
        }
    };
})(window.nokConfig);
