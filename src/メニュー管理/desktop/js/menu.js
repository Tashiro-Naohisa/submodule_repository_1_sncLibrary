/**
 * @fileoverview メニュー管理アプリ カスタマイズ
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
        'app.record.create.show',
        'app.record.edit.show',
        'app.record.index.edit.show'
    ], function (event) {
        let iconSrc = '';
        // 編集イベントでアイコンのURLを取得
        if (event.type === 'app.record.edit.show') {
            const thumbnailElements = document.getElementsByClassName('gaia-ui-slideshow-thumbnail');
            if (thumbnailElements.length > 0) {
                iconSrc = thumbnailElements[0].src;
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
        'app.record.create.submit',
        'app.record.edit.submit'
    ], function (event) {
        // 画像ファイルの数
        let numberFileValid = $('.gaia-ui-slideshow-thumbnail').length;
        // アップロードファイルの形式は「BMP,GIF,JPG,PNG」以外
        let numberFileUpload = $('.plupload_file_name').length;
        if (!menuMain.checkSelectedOneImageForDesktop(event, numberFileUpload, numberFileValid)) {
            return event;
        }
        let currentIconSrc = document.getElementsByClassName('gaia-ui-slideshow-thumbnail')[0].src;

        return menuMain.fillBase64Image(event, currentIconSrc);
    });

    /**
     * レコード編集画面の保存成功後イベント
     * レコード一覧画面のインライン編集の保存成功後イベント
     * 　ポータル設定アプリから更新対象のレコードを取得
     * 　ポータル設定アプリを更新
    */
    kintone.events.on([
        'app.record.edit.submit.success',
        'app.record.index.edit.submit.success'
    ], function (event) {
        return menuMain.processUpdateRecord(event);
    });

    /**
     * レコード一覧画面の削除前イベント
     * レコード詳細画面の削除前イベント
     * 　ポータル設定アプリから更新対象のレコードを取得
     * 　レスポンスの中にポータル設定レコードデータがある場合: 削除中断
    */
    kintone.events.on([
        'app.record.index.delete.submit',
        'app.record.detail.delete.submit'
    ], function (event) {
        return menuMain.processDeleteRecord(event);
    });

})(jQuery, window.menuMain);
