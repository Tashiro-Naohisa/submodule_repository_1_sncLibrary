/**
 * @fileoverview メニュー管理アプリ カスタマイズ（モバイル版）
 *
 *【必要ライブラリ】
 * [JavaScript]
 * menu-main.js -v4.0.1
 *
 * [CSS]
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
*/
jQuery.noConflict();
(function ($, menuMain) {
    'use strict';

    /**
     * レコード追加画面の表示後イベント
     * レコード一覧画面のインライン編集開始イベント
     * レコード編集画面の表示後イベント
     * 「base64文字」フィールドに入力不可を設定
    */
    kintone.events.on([
        'mobile.app.record.create.show',
        'mobile.app.record.edit.show'
    ], function (event) {
        let iconSrc = '';
        // 編集イベントでアイコンのURLを取得
        if (event.type === 'mobile.app.record.edit.show') {
            const previewElements = document.getElementsByClassName('forms-file-preview-img-gaia');
            if (previewElements.length > 0) {
                iconSrc = previewElements[0].style.backgroundImage.slice(4, -1).replace(/"/g, "");
            }
        }
        return menuMain.getCurrentRecordAndDisabledField(event, iconSrc);
    });

    /**
     * レコード追加画面の保存実行前イベント
     * レコード編集画面の保存実行前イベント
     * 　画像は一つしか選択できないをチェック
     * 　サムネイル画像をbase64変換する
    */
    kintone.events.on([
        'mobile.app.record.create.submit',
        'mobile.app.record.edit.submit'
    ], function (event) {
        // 全てのアップロードファイルの数
        let numberFileUpload = $('.forms-file-preview-img-gaia').length;
        // アップロードファイルの形式は「BMP,GIF,JPG,PNG」以外
        let numberFileInvalid = $('.forms-file-preview-img-empty-gaia').length;

        if (!menuMain.checkSelectedOneImageForMobile(event, numberFileUpload, numberFileInvalid)) {
            return event;
        }

        let element = document.getElementsByClassName('forms-file-preview-img-gaia');
        let backgroundImage = element[0].style.backgroundImage.slice(4, -1).replace(/"/g, "");
        let currentIconSrc = backgroundImage.includes(location.origin) ? backgroundImage : location.origin + backgroundImage;

        return menuMain.fillBase64Image(event, currentIconSrc);
    });

    /**
     * レコード編集画面の保存成功後イベント
     * 　ポータル設定アプリから更新対象のレコードを取得
     * 　ポータル設定アプリを更新
    */
    kintone.events.on([
        'mobile.app.record.edit.submit.success'
    ], function (event) {
        return menuMain.processUpdateRecord(event);
    });

    /**
     * レコード詳細画面の削除前イベント
     * 　ポータル設定アプリから更新対象のレコードを取得
     * 　レスポンスの中にポータル設定レコードデータがある場合: 削除中断
    */
    kintone.events.on([
        'mobile.app.record.detail.delete.submit'
    ], function (event) {
        return menuMain.processDeleteRecord(event);
    });

})(jQuery, window.menuMain);
