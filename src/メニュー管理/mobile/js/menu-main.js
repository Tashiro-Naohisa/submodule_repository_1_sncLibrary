
/**
 * @fileoverview メニュー管理アプリ カスタマイズ
 *
 *【必要ライブラリ】
 * [JavaScript]
 * sweetalert2@9.js
 * jquery.min.js -v2.2.3
 * snc.min.js -v1.0.5
 * snc.kintone.min.js -v1.0.8
 * snc.nok.min.js -v1.0.5
 * config.nok.js -v4.0.1
 * config.menu.js -v4.0.1
 *
 * [CSS]
 * sweetalert2.min.css
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
*/
jQuery.noConflict();
(function ($, config, menuConfig, sncLib) {
    'use strict';
    const cfgMenuFields = config.menu.fields;
    const cfgPortalSettingFields = config.portalSetting.fields;

    const messagesConfig = menuConfig.messages;
    const lookupMenuConfig = menuConfig.portalSettingLookup;

    let beforeIconSrc = '';
    let beforeUpdateRecord = {};
    // グローバル変数
    window.menuMain = window.menuMain || {
        getCurrentRecordAndDisabledField: function (event, iconSrc) {
            const record = event.record;
            beforeIconSrc = iconSrc;
            // base64文字列フィールドに入力不可を設定
            record[cfgMenuFields.menuBase64Mojiretsu.code].disabled = true;

            // レコードの値を取得
            lookupMenuConfig.forEach(function (field) {
                beforeUpdateRecord[field] = record[field].value;
            });
            return event;
        },

        /**
         * 画像のBase64を取得処理
         * @param {Object} event
         * @param {string} currentIconSrc
         * @returns event
        */
        fillBase64Image: function (event, currentIconSrc) {
            const record = event.record;
            // 新規登録と編集の画像変更ありの場合、サムネイル画像をbase64変換する
            if (beforeIconSrc !== currentIconSrc) {
                let base64Text = fillBase64Field(currentIconSrc);

                //　base64変換失敗時、「data:,」を返却 (length: 6)
                if (base64Text && base64Text.length > 6) {
                    record[cfgMenuFields.menuBase64Mojiretsu.code].value = base64Text;
                } else {
                    event.error = messagesConfig.waitLoad;
                }
            }
            return event;
        },

        /**
         * メニューアイコン：一つしか選択できないをチェック
         * @param {Object} event
         * @param {integer} numberFileUpload 全てのアップロードファイル
         * @param {integer} numberFileValid アップロードファイルの形式は「BMP,GIF,JPG,PNG」
         * @returns boolean
        */
        checkSelectedOneImageForDesktop: function (event, numberFileUpload, numberFileValid) {
            const record = event.record;
            if (numberFileValid !== 1 || numberFileUpload > 1) {
                record[cfgMenuFields.menuIcon.code].error = messagesConfig.imageOneSelect;
                return false;
            }
            return true;
        },

        /**
         * メニューアイコン：一つしか選択できないをチェック
         * @param {Object} event
         * @param {integer} numberFileUpload 全てのアップロードファイル
         * @param {integer} numberFileInvalid アップロードファイルの形式は「BMP,GIF,JPG,PNG」以外
         * @returns boolean
        */
        checkSelectedOneImageForMobile: function (event, numberFileUpload, numberFileInvalid) {
            const record = event.record;
            if (numberFileUpload !== 1 || numberFileInvalid > 0) {
                record[cfgMenuFields.menuIcon.code].error = messagesConfig.imageOneSelect;
                return false;
            }
            return true;
        },

        /**
         * メニューアプリのレコードを更新
         * @param {Object} event
         * @returns event
        */
        processUpdateRecord: function (event) {
            const record = event.record;
            const menuId = record[cfgMenuFields.menuId.code].value;

            return new kintone.Promise(function (resolve, reject) {
                // ポータル設定アプリから更新対象のレコードを取得
                resolve(getPortalSettingRecords(menuId));
            }).then(function (portalSettingRecords) {

                // メニューがまだ、使用されない場合、ポータル設定アプリ更新必要はない
                if (portalSettingRecords.length === 0) {
                    return event;
                }

                // ルークアップのフィールドは編集しない場合、ポータル設定アプリ更新必要はない
                if (!checkHaveLookupFieldChanged(record, beforeUpdateRecord)) {
                    return event;
                }

                let requests = createPortalSettingUpdateRequest(portalSettingRecords);
                // リクエストを実行
                return sncLib.kintone.rest.execBulkRequest(requests);
            }).then(function () {
                return event;
            }).catch(function (error) {
                console.log(error);
                showMessage(messagesConfig.icon.error, messagesConfig.updateFail);
                return event;
            });
        },

        /**
         * メニューアプリのレコードを削除
         * @param {Object} event
         * @returns event
        */
        processDeleteRecord: function (event) {
            const record = event.record;
            const menuId = record[cfgMenuFields.menuId.code].value;
            return new kintone.Promise(function (resolve, reject) {
                // ポータル設定アプリから更新対象のレコードを取得
                resolve(getPortalSettingRecord(menuId));
            }).then(function (result) {
                // レスポンスの中にポータル設定レコードデータがある
                if (result.length > 0) {
                    // 削除処理をキャンセル
                    event.error = messagesConfig.cannotDelete;
                }
                return event;
            }).catch(function (error) {
                console.log(error);
                // 削除処理をキャンセル
                event.error = messagesConfig.error;
                return event;
            });
        }
    }

    /**
    * ポータル設定アプリから更新対象のレコードを取得
    * @param {string} menuId
    * @return {array}
    */
    function getPortalSettingRecords(menuId) {
        let query = cfgPortalSettingFields.menuId.code + ' in ("' + menuId + '")';
        return sncLib.kintone.rest.getAllRecordsOnRecordId(config.portalSetting.app, query);
    }

    /**
    * ポータル設定アプリから1レコードを取得
    * @param {string} menuId
    * @return {array}
    */
    function getPortalSettingRecord(menuId) {
        let query = cfgPortalSettingFields.menuId.code + ' in ("' + menuId + '")';
        return sncLib.kintone.rest.getRecord(config.portalSetting.app, query);
    }

    /**
     * 編集フィールドがあるをチェック
     * @param {Object} record
     * @param {Object} beforeUpdateRecord
     * @returns boolean
     */
    function checkHaveLookupFieldChanged(record, beforeUpdateRecord) {
        for (const [key, bfValue] of Object.entries(beforeUpdateRecord)) {
            if (record[key].value !== bfValue) return true;
        }
        return false;
    }

    /**
     * ポータル設定アプリの一括更新リクエストを生成
     * @param {array} portalSettingRecords
     * @return {array}
     */
    function createPortalSettingUpdateRequest(portalSettingRecords) {
        if (portalSettingRecords.length < 1) return [];

        let requests = [];
        let payload_template = {
            'app': config.portalSetting.app,
            'records': []
        };
        let payload = $.extend(true, {}, payload_template);

        portalSettingRecords.forEach(function (portalSettingRecord) {
            let record = {};
            let table = portalSettingRecord[cfgPortalSettingFields.menuPattern.code].value;

            record[cfgPortalSettingFields.menuPattern.code] = {
                'value': table
            };

            payload.records.push({
                'id': portalSettingRecord['$id'].value,
                'record': record
            });
            if (payload.records.length === 100) {
                // 更新レコード数が上限に達した場合、リクエスト追加
                requests.push({
                    'method': 'PUT',
                    'api': '/k/v1/records.json',
                    'payload': payload
                });
                // 初期化
                payload = $.extend(true, {}, payload_template);
            }
        });

        if (payload.records.length > 0) {
            // 更新レコードが存在する場合、リクエスト追加
            requests.push({
                'method': 'PUT',
                'api': '/k/v1/records.json',
                'payload': payload
            });
        }

        return requests;
    }

    /**
     * 画像からBase64タイプの画像に変換
     * @param {string} imgURL 画像URL
     * @returns string
     */
    function convertImageToBase64(imgURL) {
        // 画像オブジェクトを作成
        let imgLogo = new Image();
        imgLogo.src = imgURL;

        // Canvasオブジェクトを作成
        let canvas = document.createElement('canvas');
        let canvasWidth = imgLogo.width;
        let canvasHeight = imgLogo.height;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        let context = canvas.getContext('2d');

        // Canvasに画像を表記
        context.drawImage(imgLogo, 0, 0);

        // base64画像に変換
        let base64Text = canvas.toDataURL();
        return base64Text;
    }

    /**
     * 画像のBase64を取得処理
     * @param {string} imgSrc
     */
    function fillBase64Field(imgSrc) {
        let base64Text = '';
        try {
            base64Text = convertImageToBase64(imgSrc);
        } catch (error) {
            base64Text = '';
            showMessage(messagesConfig.icon.error, messagesConfig.error);
        }
        return base64Text;
    }

    /**
     * メッセージを表示
     * @param {string} iconMessage メッセージのアイコン
     * @param {string} textMessage メッセージのタイトル
     * @returns Object
     */
    function showMessage(iconMessage, textMessage) {
        return Swal.fire({
            icon: iconMessage,
            title: textMessage
        });
    }

})(jQuery, window.nokConfig, window.menuConfig, window.snc);
