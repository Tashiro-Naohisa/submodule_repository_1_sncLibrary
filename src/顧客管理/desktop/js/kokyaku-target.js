
/**
 * @fileoverview 顧客マスタアプリ　ターゲット・準ターゲット設定機能　ターゲット解除機能
 *
 *【必要ライブラリ】
 * [JavaScript]
 * sweetalert2.min.js
 * jquery.min.js -v2.2.3
 * jquery-ui.min.js -v1.12.1
 * snc.min.js -v1.0.5
 * snc.kintone.min.js -v1.0.8
 * snc.nok.min.js -v1.0.5
 * config.nok.js -v4.0.1
 *
 * [CSS]
 * sweetalert2.min.css
 * jquery-ui.css -v1.12.1
 * 51-us-default-1.css
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
jQuery.noConflict();
(function ($, config, configTarget, sncLib) {
    'use strict';

    /**
     * ターゲットボタンのクリックイベント
     * @param {element} $setTarget
     */
    function targetClick($setTarget, target, event) {
        let title = '';
        // sweetalertのタイトル設定
        switch (target) {
            case 0:
                title = 'ターゲット設定';
                break;
            case 1:
                title = '準ターゲット設定';
                break;
            case 2:
                title = 'ターゲット解除';
                break;
        }
        $setTarget.on('click', function (clickEvent) {
            let checkedRecordCount = $(':checkbox[name="row_index"]:checked').length;
            if (checkedRecordCount === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'データが選択されていません。',
                    text: '一覧から1件以上、チェックして選択してください。',
                    width: '25%'
                }).then(function (result) {
                    return;
                });
                return;
            }
            Swal.fire({
                title: title,
                text: 'データを更新します。よろしいですか？',
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3498db',
                cancelButtonColor: '#aaa',
                confirmButtonText: 'OK',
                cancelButtonText: 'キャンセル'
            }).then(function (result) {
                if (result.value) {
                    setTarget(target, event);
                }
            });
        });
        return;
    }

    /**
     * ターゲット設定関数
     * @param {value} target
     * @param {object} event
     * @returns event
     */
    function setTarget(target, event) {
        const appId = kintone.app.getId();
        const loginUser = kintone.getLoginUser();

        const tantoshaAppId = config.tantosha.app;
        let query = config.tantosha.fields.tantoshaId.code + '= "' + loginUser.code + '" ';

        return new kintone.Promise(function (resolve, reject) {
            resolve(sncLib.kintone.rest.getRecord(tantoshaAppId, query));
        }).then(function (resp) {
            console.log(resp);
            let requests = [];
            let payload_template = {
                'app': appId,
                'records': []
            }
            let payload = $.extend(true, {}, payload_template);

            // チェックされたレコードの更新リクエストの作成
            $(':checkbox[name="row_index"]:checked').each(function (index) {
                let record = {};
                let row_index = parseInt($(this).val(), 10);
                let eventRecord = event.records[row_index];
                let recordId = eventRecord['$id'].value;
                // ターゲット分類の設定
                switch (target) {
                    case 0:
                        record[config.kokyaku.fields.kokyakuTarget.code] = {
                            'value': 'ターゲット'
                        }
                        record[config.kokyaku.fields.tantoshaSearch.code] = {
                            'value': resp[0][config.tantosha.fields.tantoshaSearchId.code].value
                        }
                        break;
                    case 1:
                        record[config.kokyaku.fields.kokyakuTarget.code] = {
                            'value': '準ターゲット'
                        }
                        record[config.kokyaku.fields.tantoshaSearch.code] = {
                            'value': resp[0][config.tantosha.fields.tantoshaSearchId.code].value
                        }
                        break;
                    case 2:
                        record[config.kokyaku.fields.kokyakuTarget.code] = {
                            'value': ''
                        }
                        record[config.kokyaku.fields.tantoshaSearch.code] = {
                            'value': ''
                        }
                        break;
                }
                payload.records.push({
                    'id': recordId,
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
            })

            if (payload.records.length > 0) {
                // 更新レコードが存在する場合、リクエスト追加
                requests.push({
                    'method': 'PUT',
                    'api': '/k/v1/records.json',
                    'payload': payload
                });
            }

            return sncLib.kintone.rest.execBulkRequest(requests);
        }).then(function (resp) {
            Swal.fire({
                icon: 'success',
                title: 'データを更新しました。',
            }).then(function (result) {
                window.location.reload();
                return event;
            });
        }).catch(function (err) {
            console.log(err);
            Swal.fire({
                icon: 'error',
                title: '更新に失敗しました。',
            }).then(function (result) {
                return event;
            });
        });

    }

    /**
     * 全選択・全解除機能関数
     * @param {value} allCheckbox
     * @returns
     */
    function allCheckClick($allCheck) {
        $allCheck.on('click', function () {
            let $checkbox = $(':checkbox[name="row_index"]')
            if ($(':checkbox[name="allCheck"]').prop('checked')) {
                $checkbox.prop('checked', true);
            } else {
                $checkbox.prop('checked', false);
            }
        });
    }

    /**
     * レコード一覧画面 表示後イベント(ターゲット・準ターゲット設定)
     */
    kintone.events.on([
        "app.record.index.show"
    ], function (event) {
        // ビュー チェック
        if (configTarget.targetViewIds.indexOf(event.viewId) === -1) {
            return event;
        }

        // レコード番号列にチェックボックスを追加
        let aNodes = kintone.app.getFieldElements(configTarget.ckeckboxField);
        for (let i = 0; i < event.records.length; i++) {
            let $cell = $(aNodes[i]).children('div:first').children('span:first');
            let $checkbox = $('<input type="checkbox" name="row_index" value="' + i + '" style="transform: scale(1.5); margin-right: 10px;">');
            $cell.prepend($checkbox);
            $cell.wrap('<label/>');
        }

        // ターゲット設定ボタンを追加
        let $setTarget = $('<button id="set_target" class="kintoneplugin-button-normal">ターゲット設定</button>');
        $setTarget.css({ 'margin-left': '10px', 'margin-right': '10px' });
        let target = 0;
        targetClick($setTarget, target, event);

        // 準ターゲット設定ボタンを追加
        let $setSemiTarget = $('<button id="set_semiTarget" class="kintoneplugin-button-normal">準ターゲット設定</button>');
        $setSemiTarget.css({ 'margin-left': '10px', 'margin-right': '10px' });
        let semiTarget = 1;
        targetClick($setSemiTarget, semiTarget, event);

        // 全選択・全解除のチェックボックスを追加
        let $allCheck = $('<label for="allCheck" class="allCheck">' +
            '<input class="allCheck" id="allCheck" name="allCheck" type="checkbox" style="transform: scale(1.5);"> 全選択・全解除</label>');
        $allCheck.css({ 'margin-left': '10px', 'margin-right': '10px' });
        allCheckClick($allCheck);

        $('#set_target').remove();
        $('#set_semiTarget').remove();
        $('.allCheck').remove();
        let $divElement = $('<div id="targetFunction">');
        $divElement.append($setTarget);
        $divElement.append($setSemiTarget);
        $divElement.append($allCheck);
        // $divElement.css({ 'display': 'block', 'minWidth': '1500px' });
        let aNode = kintone.app.getHeaderMenuSpaceElement();
        $(aNode).append($divElement);
        return event;
    });

    /**
     * レコード一覧画面 表示後イベント(ターゲット解除)
     * 表示レコードは一覧の絞込みで設定
     */
    kintone.events.on([
        "app.record.index.show"
    ], function (event) {
        // ビュー チェック
        if (configTarget.liftTargetViewIds.indexOf(event.viewId) === -1) {
            return event;
        }

        // レコード番号列にチェックボックスを追加
        let aNodes = kintone.app.getFieldElements(configTarget.ckeckboxField);
        for (let i = 0; i < event.records.length; i++) {
            let $cell = $(aNodes[i]).children('div:first').children('span:first');
            let $checkbox = $('<input type="checkbox" name="row_index" value="' + i + '" style="transform: scale(1.5); margin-right: 10px">');
            $cell.prepend($checkbox);
            $cell.wrap("<label/>");
        }

        // ターゲット解除ボタンを追加
        let $setLiftTarget = $('<button id="set_liftTarget" class="kintoneplugin-button-normal">ターゲット解除</button>');
        $setLiftTarget.css({ 'margin-left': '10px', 'margin-right': '10px' });
        let liftTarget = 2;
        targetClick($setLiftTarget, liftTarget, event);

        // 全選択・全解除のチェックボックスを追加
        let $allCheck = $('<label for="allCheck" class="allCheck">' +
            '<input class="allCheck" id="allCheck" name="allCheck" type="checkbox" style="transform: scale(1.5);"> 全選択・全解除</label>');
        $allCheck.css({ 'margin-left': '10px', 'margin-right': '10px' });
        allCheckClick($allCheck);

        $('#set_liftTarget').remove();
        $('.allCheck').remove();
        let $divElement = $('<div id="targetFunction">');
        $divElement.append($setLiftTarget);
        $divElement.append($allCheck);
        let aNode = kintone.app.getHeaderMenuSpaceElement();
        $(aNode).append($divElement);
        return event;
    });

})(jQuery, window.nokConfig, window.kokyakuTargetConfig, window.snc);
