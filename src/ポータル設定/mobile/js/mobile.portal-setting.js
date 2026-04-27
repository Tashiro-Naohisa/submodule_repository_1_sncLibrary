/**
 * @fileoverview ポータル設定 カスタマイズ（モバイル版）
 *
 *【必要ライブラリ】
 * [JavaScript]
 * portal-setting-main.js -v4.0.1
 *
 * [CSS]
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
*/
jQuery.noConflict();
(function ($, portalSettingMain) {
    'use strict';

    /**
     * レコード追加画面の保存実行前イベント
     * レコード編集画面の保存実行前イベント
     *    レコードをsubmitする時、データを処理
    */
    kintone.events.on([
        'mobile.app.record.create.submit',
        'mobile.app.record.edit.submit'
    ], function (event) {
        return portalSettingMain.checkDataBeforeSubmit(event);
    });

    /**
     * レコード詳細画面の削除前イベント
     *    担当者アプリからポータル対象のレコードを取得
     *    レスポンスデータがある場合、削除できません: 削除中断
    */
    kintone.events.on([
        'mobile.app.record.detail.delete.submit'
    ], function (event) {
        return portalSettingMain.processDeleteRecord(event);
    });

})(jQuery, window.portalSettingMain);
