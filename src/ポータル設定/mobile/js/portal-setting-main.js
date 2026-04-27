/**
 * @fileoverview ポータル設定 カスタマイズ
 *
 *【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * snc.min.js -v1.0.5
 * snc.kintone.min.js -v1.0.8
 * snc.nok.min.js -v1.0.5
 * config.nok.js -v4.0.1
 * config.portal-setting.js -v4.0.1
 *
 * [CSS]
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
*/
jQuery.noConflict();
(function ($, config, portalConfig, sncLib) {
    'use strict';

    const cfgPortalSetting = config.portalSetting;
    const cfgPortalSettingFields = cfgPortalSetting.fields;

    const cfgTantosha = config.tantosha;
    const cfgTantoshaFields = cfgTantosha.fields;

    const messagesConfig = portalConfig.messages;
    const menuMaxHyojijun = config.portalSetting.menu.maxHyojijun.code;
    const graphMaxHyojijun = config.portalSetting.graph.maxHyojijun.code;

    // グローバル変数
    window.portalSettingMain = window.portalSettingMain || {

        // レコードをsubmitする時、データを処理
        checkDataBeforeSubmit: function (event) {
            const record = event.record;
            const errors = validationRecord(record);

            // 複数エラーがある場合は、改行して表示させる
            if (errors.length > 0) {
                if (!document.getElementById('error-message-show')) {
                    let messageElement = document.createElement('style');
                    messageElement.id = 'error-message-show';
                    messageElement.innerText = '.notifier-body-cybozu li { white-space: pre; }';
                    document.head.appendChild(messageElement);
                }
                event.error = messagesConfig.titleError + errors.join('\n・');
            }
            return event;
        },

        /**
         * ポータル設定アプリのレコードを削除
         * @param {Object} event
         * @returns event
        */
        processDeleteRecord: function (event) {
            const record = event.record;
            const portalId = record[cfgPortalSettingFields.portalId.code].value;
            return new kintone.Promise(function (resolve, reject) {
                // 担当者アプリからポータル対象のレコードを取得
                resolve(getTantoshaRecord(portalId));
            }).then(function (result) {
                // レスポンスデータがある場合、削除できません
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
        },
    }

    /**
     * 担当者アプリからポータル対象のレコードを取得
     * @param {string} portalId
     * @return {array}
    */
    function getTantoshaRecord(portalId) {
        let query = cfgTantoshaFields.portalId.code + '="' + portalId + '"';
        return sncLib.kintone.rest.getRecord(cfgTantosha.app, query);
    }

    /**
     * // メニュー検索とグラフ選択に値が入っていたら、表示順と段の必須チェック
     * @param {array} patternList メニューパターン・グラフパターン
     * @param {string} lookupField ルークアップ
     * @param {array} fieldCheckList 必須項目
     */
    function checkRequiredIfLookupFieldExists(patternList, lookupField, fieldCheckList) {
        patternList.forEach(function (pattern) {
            let lookupSearch = pattern.value[lookupField].value;
            if (lookupSearch) {
                fieldCheckList.forEach(function (fieldCheckItem) {
                    if (!pattern.value[fieldCheckItem].value) {
                        pattern.value[fieldCheckItem].error = messagesConfig.required;
                    }
                });
            }
        });
    }

    /**
     * 表示順の自然数チェック
     * 表示順最大値のチェック
     * @param {Object} record
     * @return {array}
    */
    function validationRecord(record) {
        let menus = record[cfgPortalSettingFields.menuPattern.code].value;
        let graphs = record[cfgPortalSettingFields.graphPattern.code].value;
        let menuFieldCheckList = [
            cfgPortalSettingFields.menuDan.code,
            cfgPortalSettingFields.menuHyojijun.code
        ];
        let graphFieldCheckList = [
            cfgPortalSettingFields.graphDan.code,
            cfgPortalSettingFields.graphHyojijun.code,
            cfgPortalSettingFields.graphSize.code
        ];

        // メニュー検索とグラフ選択に値が入っていたら、表示順と段の必須チェック
        checkRequiredIfLookupFieldExists(menus, cfgPortalSettingFields.menuSearch.code, menuFieldCheckList);
        checkRequiredIfLookupFieldExists(graphs, cfgPortalSettingFields.graphSearch.code, graphFieldCheckList);

        // 表示順の自然数チェック
        let errors = [];
        let menuError = checkIsNaturalNumber(menus, cfgPortalSettingFields.menuHyojijun.code, 'メニュー');
        let graphError = checkIsNaturalNumber(graphs, cfgPortalSettingFields.graphHyojijun.code, 'グラフ');

        // 表示順最大値のチェック
        let maxMenuError = checkMaxHyojiMenu(menus);
        let maxGraphError = checkMaxHyojiGraph(graphs);

        if (menuError !== '') errors.push(menuError);
        if (graphError !== '') errors.push(graphError);
        if (maxMenuError !== '') errors.push(maxMenuError);
        if (maxGraphError !== '') errors.push(maxGraphError);

        return errors;
    }

    /**
     * 表示順の自然数チェック
     * @param {array} hyojijunArr
     * @param {string} hyojijunField
     * @param {string} type
     * @returns string
    */
    function checkIsNaturalNumber(hyojijunArr, hyojijunField, type) {
        let naturalNumber = true;
        hyojijunArr.forEach(function (item) {
            let hyojijun = item.value[hyojijunField].value;
            if (hyojijun) {
                let isNaturalNumber = (hyojijun > 0 && hyojijun % 1 === 0);
                if (!isNaturalNumber) {
                    item.value[hyojijunField].error = messagesConfig.requiredNaturalNumber;
                    naturalNumber = false;
                }
            }
        });
        if (!naturalNumber) return type + 'の表示順';
        else return '';
    }

    /**
     * 一段で表示最大アプリ数をチェック
     * @param {array} menuSubtable
     * @returns string
    */
    function checkMaxHyojiMenu(menuSubtable) {

        /*
         * {
                1: [obj, obj, ... , obj],
                2: [obj, obj, ... , obj],
                3: [obj, obj, ... , obj],
            }
         */
        const groupedObj = menuSubtable.reduce(function (groupObj, currObj) {
            let menuRow = currObj.value;
            let dan = menuRow[cfgPortalSettingFields.menuDan.code].value;
            if (!groupObj[dan]) {
                groupObj[dan] = [];
            }
            groupObj[dan].push(menuRow);
            return groupObj;
        }, {});

        const menusArr = Object.values(groupedObj);
        let checkMax = '';
        menusArr.forEach(function (menus) {
            if (menus.length > menuMaxHyojijun) {
                checkMax = messagesConfig.menuMax; // 一段は最大10アプリが設定できる
                return;
            }
        });
        return checkMax;
    }

    /**
     * 一段で表示最大グラフ数をチェック
     * @param {array} graphSubtable
     * @returns string
    */
    function checkMaxHyojiGraph(graphSubtable) {

        /*
         * {
                1: [obj, obj, ... , obj],
                2: [obj, obj, ... , obj],
                3: [obj, obj, ... , obj],
            }
         */
        const groupedObj = graphSubtable.reduce(function (groupObj, currObj) {
            let graphRow = currObj.value;
            let dan = graphRow[cfgPortalSettingFields.graphDan.code].value;
            if (!groupObj[dan]) {
                groupObj[dan] = [];
            }
            groupObj[dan].push(graphRow);
            return groupObj;
        }, {});

        const graphsArr = Object.values(groupedObj);
        let checkMax = '';
        graphsArr.forEach(function (graphs) {
            if (graphs.length > graphMaxHyojijun) {
                checkMax = messagesConfig.graphMax; // 一段は最大3グラフが設定できる
                return;
            }
        });
        return checkMax;
    }

})(jQuery, window.nokConfig, window.portalConfig, window.snc);
