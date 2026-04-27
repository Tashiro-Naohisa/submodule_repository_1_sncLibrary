/**
 * @fileoverview グラフ管理アプリ カスタマイズ
 *
 *【必要ライブラリ】
 * [JavaScript]
 * sweetalert2@9.js
 * jquery.min.js -v2.2.3
 * snc.min.js -v1.0.5
 * snc.kintone.min.js -v1.0.8
 * snc.nok.min.js -v1.0.5
 * config.nok.js -v4.0.1
 * datepicker-1.0.10.min.js
 * datepicker-1.0.10.ja-JP.js
 * config.graph.js -v4.0.1
 *
 * [CSS]
 * sweetalert2.min.css
 * datepicker-1.0.10.min.css
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
*/
jQuery.noConflict();
(function ($, config, graphConfig, sncLib) {
    'use strict';

    const cfgGraphFields = config.graph.fields;
    const cfgGraphType = config.graph.types;
    const cfgPortalSettingFields = config.portalSetting.fields;
    const cfgPortalSettingApp = config.portalSetting.app;

    // グラフのフィールドコード
    const paipurainGraph = cfgGraphFields.paipurainGraph.code;
    const tsumiageGraph = cfgGraphFields.tsumiageGraph.code;
    const handonatsuGraph = cfgGraphFields.handonatsuGraph.code;
    const tateboGraph = cfgGraphFields.tateboGraph.code;

    // グラフのタイプ
    const paipurain = cfgGraphType.paipurain.code;
    const tsumiage = cfgGraphType.tsumiage.code;
    const handonatsu = cfgGraphType.handonatsu.code;
    const tatebo = cfgGraphType.tatebo.code;

    const messagesConfig = graphConfig.messages;
    const fieldListConfig = graphConfig.fieldList;
    const lookupGraphConfig = graphConfig.portalSettingLookup;
    const deviceConfig = graphConfig.device;

    const graphList = [
        paipurainGraph,
        tsumiageGraph,
        handonatsuGraph,
        tateboGraph
    ];

    const beforeUpdateRecord = {};

    // グローバル変数
    window.graphMain = window.graphMain || {

        /**
         * グラフタイプに応じてグラフグループを表示
         * device：デスクトップ・モバイル
        */
        processInitialGraph: function (event, device) {
            const record = event.record;
            let graphType = record[cfgGraphFields.graphType.code].value;
            // 選択したグラフタイプに応じてグラフグループを表示
            selectChangeGraphTypeHandle(graphType, device);
            if (device === deviceConfig.desktop) {
                if (event.type !== 'app.record.detail.show') showCalendarHandle(graphType, device);
                else hideSpaceBlank(graphType);
            } else {
                if (event.type !== 'mobile.app.record.detail.show') showCalendarHandle(graphType, device);
            }
            showValueToCalendar(record, graphType);
            return event;
        },

        /**
         * submitの前にデータを処理
        */
        processDataBeforeSubmit: function (event) {
            const record = event.record;

            if (event.type !== 'app.record.index.edit.submit') {
                // 必須項目チェック
                let check = true;

                //グラフタイプ選択ありをチェック
                let graphTypeField = cfgGraphFields.graphType.code;
                if (!checkRequired(record, graphTypeField)) check = false;

                // グラフタイプに応じてフィールド必須項目をチェック
                let graphType = record[graphTypeField].value;

                switch (graphType) {
                    case paipurain:
                        let paipurainFields = fieldListConfig.paipurain.slice();
                        if (record[cfgGraphFields.paipurainTaisho.code].value === '組織') {
                            paipurainFields.push(cfgGraphFields.paipurainSoshiki.code);
                        }
                        paipurainFields.forEach(function (field) {
                            if (field !== cfgGraphFields.paipurainNengetsu.code) {
                                if (!checkRequired(record, field)) check = false;
                            } else {
                                let paipurainStartMonth = $('#' + cfgGraphFields.paipurainCalendarSpace.code).val();
                                $('#error-' + cfgGraphFields.paipurainCalendarSpace.code).remove();
                                if (!paipurainStartMonth) {
                                    check = false;
                                    // エラーメッセージを表示
                                    createElementError(cfgGraphFields.paipurainCalendarSpace.code);
                                }
                            }
                        });
                        break;
                    case tsumiage:
                        let tsumiageFields = fieldListConfig.tsumiage.slice();
                        if (record[cfgGraphFields.tsumiageTaisho.code].value === '組織') {
                            tsumiageFields.push(cfgGraphFields.tsumiageSoshiki.code);
                        }
                        tsumiageFields.forEach(function (field) {
                            if (field !== cfgGraphFields.tsumiageNengetsu.code) {
                                if (!checkRequired(record, field)) check = false;
                            } else {
                                let tsumiageStartMonth = $('#' + cfgGraphFields.tsumiageCalendarSpace.code).val();
                                $('#error-' + cfgGraphFields.tsumiageCalendarSpace.code).remove();
                                if (!tsumiageStartMonth) {
                                    check = false;
                                    // エラーメッセージを表示
                                    createElementError(cfgGraphFields.tsumiageCalendarSpace.code);
                                }
                            }
                        });
                        break;
                    case handonatsu:
                        let handonatsuFields = fieldListConfig.handonatsu.slice();
                        if (record[cfgGraphFields.handonatsuTaisho.code].value === '組織') {
                            handonatsuFields.push(cfgGraphFields.handonatsuSoshiki.code);
                        }
                        handonatsuFields.forEach(function (field) {
                            if (field !== cfgGraphFields.handonatsuNengetsu.code) {
                                if (!checkRequired(record, field)) check = false;
                            } else {
                                let handonatsuStartMonth = $('#' + cfgGraphFields.handonatsuCalendarSpace.code).val();
                                $('#error-' + cfgGraphFields.handonatsuCalendarSpace.code).remove();
                                if (!handonatsuStartMonth) {
                                    check = false;
                                    // エラーメッセージを表示
                                    createElementError(cfgGraphFields.handonatsuCalendarSpace.code);
                                }
                            }
                        });
                        break;
                    case tatebo:
                        let tateboFieslds = fieldListConfig.tatebo.slice();
                        if (record[cfgGraphFields.tateboTaisho.code].value === '組織') {
                            tateboFieslds.push(cfgGraphFields.tateboSoshiki.code);
                        }
                        tateboFieslds.forEach(function (field) {
                            if (field !== cfgGraphFields.tateboNengetsu.code) {
                                if (!checkRequired(record, field)) check = false;
                            } else {
                                let tateboStartMonth = $('#' + cfgGraphFields.tateboCalendarSpace.code).val();
                                $('#error-' + cfgGraphFields.tateboCalendarSpace.code).remove();
                                if (!tateboStartMonth) {
                                    check = false;
                                    // エラーメッセージを表示
                                    createElementError(cfgGraphFields.tateboCalendarSpace.code);
                                }
                            }
                        });
                        break;
                }

                // 必須項目エラーがある場合
                if (!check) {
                    event.error = messagesConfig.requiredError;
                    return event;
                }
            }

            // submitの前にデータを処理
            processBeforeSubmit(event);

            return event;
        },

        /**
         *　編集画面の表示後レコードを取得
        */
        getCurrentRecord: function (event) {
            const record = event.record;
            // 表示しているレコードを取得
            lookupGraphConfig.forEach(function (field) {
                beforeUpdateRecord[field] = record[field].value;
            });
            return event;
        },

        /**
         *　組織選択の表示有無
        */
        processShowSoshiki: function (event, device) {
            const record = event.record;
            showSoshikiHandle(record, device);
            return event;
        },

        /**
         *　グラフの変種後、ポータル設定へ更新
        */
        processUpdateRecord: function (event) {
            const record = event.record;
            const graphId = record[cfgGraphFields.graphId.code].value;

            return new kintone.Promise(function (resolve, reject) {
                // ポータル設定アプリから更新対象のレコードを取得
                resolve(getPortalSettingRecords(graphId));
            }).then(function (portalSettingRecords) {
                // グラフがまだ、使用されない場合、ポータル設定アプリ更新必要はない
                if (portalSettingRecords.length === 0) {
                    return event;
                }

                // ルークアップのフィールドは編集しない場合、ポータル設定アプリ更新必要はない
                if (!checkHaveLookupFieldChanged(record, beforeUpdateRecord)) {
                    return event;
                }

                let request = createPortalSettingUpdateRequest(portalSettingRecords, graphId);
                // リクエストを実行
                return sncLib.kintone.rest.execBulkRequest(request);
            }).then(function () {
                return event;
            }).catch(function (error) {
                console.log(error);
                showMessage(messagesConfig.icon.error, messagesConfig.updateFail);
                return event;
            });
        },

        /**
         *　グラフアプリのレコードを削除
        */
        processDeleteRecord: function (event) {
            const record = event.record;
            const graphId = record[cfgGraphFields.graphId.code].value;

            return new kintone.Promise(function (resolve, reject) {
                // ポータル設定アプリから更新対象のレコードを取得
                resolve(getPortalSettingRecord(graphId));
            }).then(function (result) {
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
    * ポータル設定アプリから更新対象のレコードを取得
    * @param {string} graphId
    * @return {array}
    */
    function getPortalSettingRecords(graphId) {
        let query = cfgPortalSettingFields.graphId.code + ' in ("' + graphId + '")';
        return sncLib.kintone.rest.getAllRecordsOnRecordId(cfgPortalSettingApp, query);
    }

    /**
     * 変更ありのフィールドをチェック
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
    * ポータル設定アプリから1レコードを取得
    * @param {string} graphId
    * @return {array}
    */
    function getPortalSettingRecord(graphId) {
        let query = cfgPortalSettingFields.graphId.code + ' in ("' + graphId + '")';
        return sncLib.kintone.rest.getRecord(cfgPortalSettingApp, query);
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
            'app': cfgPortalSettingApp,
            'records': []
        };
        let payload = $.extend(true, {}, payload_template);
        portalSettingRecords.forEach(function (portalSettingRecord) {
            let record = {};
            let table = portalSettingRecord[cfgPortalSettingFields.graphPattern.code].value;
            record[cfgPortalSettingFields.graphPattern.code] = {
                'value': table
            };

            payload.records.push({
                'id': portalSettingRecord['$id'].value,
                'record': record
            });

            // 更新レコード数が上限に達した場合、リクエスト追加
            if (payload.records.length === 100) {
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
     * datepickerをフィールドに追加
     * @param {string} field
     * @param {string} spaceElementId
     * @param {string} labelName
    */
    function showCalendar(field, spaceElementId, labelName, device) {
        let spaceElement = {};
        if (device === deviceConfig.desktop) {
            kintone.app.record.setFieldShown(field, false);
            spaceElement = kintone.app.record.getSpaceElement(spaceElementId);
        } else {
            kintone.mobile.app.record.setFieldShown(field, false);
            spaceElement = kintone.mobile.app.record.getSpaceElement(spaceElementId);
        }
        createElementToSelecteNengetsu(spaceElement, spaceElementId, labelName);
    }

    /**
     * レコードの年月値をdatepickerに設定
     * @param {Object} record
     * @param {string} nengetsu
     * @param {string} id
    */
    function setDateForDatePicker(record, nengetsu, id) {
        let date = record[nengetsu].value;
        $('#' + id).datepicker('setDate', date);
    }

    /**
     * 年月入力用のカレンダーエレメントを作成
     * @param {string} spaceElement スペースコンポーネントにカレンダー値表示
     * @param {string} spaceElementId
     * @param {string} labelName
    */
    function createElementToSelecteNengetsu(spaceElement, spaceElementId, labelName) {
        const spaceElValue = $('#' + spaceElementId).val();
        if (!spaceElValue) {
            // スペースコンポーネントを初期化する
            spaceElement.innerHTML = '';

            let d1 = document.createElement('div');
            let d2 = document.createElement('div');
            let d3 = document.createElement('div');
            let d4 = document.createElement('div');
            let d5 = document.createElement('div');

            // 文字列のdiv (d3 + d4)
            let inputDate = document.createElement('input');
            inputDate.type = 'text';
            inputDate.id = spaceElementId;
            inputDate.readOnly = true;
            inputDate.className = 'kintoneplugin-input-text';
            inputDate.style = 'height: 40px';
            d4.className = 'kintoneplugin-input-outer';
            d4.appendChild(inputDate);

            d3.className = 'control-value-gaia value-' + spaceElementId;
            d3.style = 'overflow: visible;';
            d3.appendChild(d4);

            // ラベルのdiv (d2)
            let span = document.createElement('span');
            span.className = 'control-label-text-gaia';
            span.textContent = labelName;
            d2.className = 'control-label-gaia label-' + spaceElementId;
            d2.appendChild(span);

            d5.className = 'control-design-gaia';

            // ラッパーのdiv (d1)
            d1.className = 'control-gaia control-single_line_text-field-gaia field-' + spaceElementId;
            d1.style = 'box-sizing: border-box; width: 193px; height: auto;';

            d1.appendChild(d2);
            d1.appendChild(d3);
            d1.appendChild(d5);
            spaceElement.appendChild(d1);

            // スペースクリック時にカレンダーを表示
            $('#' + spaceElementId).datepicker({
                format: 'YYYY-MM',
                language: 'ja-JP',
                autoHide: true,
                zIndex: 2048
            });
        }
    }

    /**
     * エラーメッセージを作成
     * @param {string} spaceElementId
    */
    function createElementError(spaceElementId) {
        let errDiv = document.getElementById('error-' + spaceElementId);
        if (!errDiv) {
            errDiv = document.createElement('div');
            errDiv.id = 'error-' + spaceElementId;
            errDiv.style = 'background: #e74c3c; position: relative; display: block; margin: 8px 0;padding: 4px 18px;color: #fff;';
            errDiv.innerText = messagesConfig.requiredField;
            let calendarSpace = document.getElementsByClassName('value-' + spaceElementId)[0];
            calendarSpace.appendChild(errDiv);
        }
    }

    /**
     * 選択したグラフタイプに応じてグラフグループを表示
     * @param {string} graphType
     * @param {string} device デスクトップ・モバイル
    */
    function selectChangeGraphTypeHandle(graphType, device) {
        switch (graphType) {
            case paipurain:
                showGroupGraph(graphList, false, device);
                showGroupGraph([paipurainGraph], true, device);
                break;
            case tsumiage:
                showGroupGraph(graphList, false, device);
                showGroupGraph([tsumiageGraph], true, device);
                break;
            case handonatsu:
                showGroupGraph(graphList, false, device);
                showGroupGraph([handonatsuGraph], true, device);
                break;
            case tatebo:
                showGroupGraph(graphList, false, device);
                showGroupGraph([tateboGraph], true, device);
                break;
            default:
                showGroupGraph(graphList, false, device);
                break;
        }
    }

    /**
     * datepickerを表示
     * @param {string} graphType
    */
    function showCalendarHandle(graphType, device) {
        switch (graphType) {
            case paipurain:
                showCalendar(cfgGraphFields.paipurainNengetsu.code, cfgGraphFields.paipurainCalendarSpace.code, '開始年月', device)
                break;
            case tsumiage:
                showCalendar(cfgGraphFields.tsumiageNengetsu.code, cfgGraphFields.tsumiageCalendarSpace.code, '開始年月', device)
                break;
            case handonatsu:
                showCalendar(cfgGraphFields.handonatsuNengetsu.code, cfgGraphFields.handonatsuCalendarSpace.code, '開始年月', device)
                break;
            case tatebo:
                showCalendar(cfgGraphFields.tateboNengetsu.code, cfgGraphFields.tateboCalendarSpace.code, '開始年月', device)
                break;
        }
    }

    /**
     * 編集の時、レコードの年月値を取得し、datapickerに表示
     * @param {Object} record
     * @param {string} graphType
    */
    function showValueToCalendar(record, graphType) {
        switch (graphType) {
            case paipurain:
                setDateForDatePicker(record, cfgGraphFields.paipurainNengetsu.code, cfgGraphFields.paipurainCalendarSpace.code);
                break;
            case tsumiage:
                setDateForDatePicker(record, cfgGraphFields.tsumiageNengetsu.code, cfgGraphFields.tsumiageCalendarSpace.code);
                break;
            case handonatsu:
                setDateForDatePicker(record, cfgGraphFields.handonatsuNengetsu.code, cfgGraphFields.handonatsuCalendarSpace.code);
                break;
            case tatebo:
                setDateForDatePicker(record, cfgGraphFields.tateboNengetsu.code, cfgGraphFields.tateboCalendarSpace.code);
                break;
        }
    }

    /**
     * submitの前にデータを処理
     *１．選択したグラフタイプ以外、他のグラフタイプのフィールドを削除
     *２．選択したカレンダー値をレコードの開始年月フィールドに入れ
     * @param {Object} record
    */
    function processBeforeSubmit(event) {
        const record = event.record;
        let graphType = record[cfgGraphFields.graphType.code].value;
        let activeGraphFields = [];
        switch (graphType) {
            case paipurain:
                activeGraphFields = fieldListConfig.paipurain.slice();
                if (event.type !== 'app.record.index.edit.submit') {
                    // 開始年月のカレンダーに値を取り込む
                    let paipurainStartMonth = $('#' + cfgGraphFields.paipurainCalendarSpace.code).val();
                    record[cfgGraphFields.paipurainNengetsu.code].value = paipurainStartMonth;
                }

                // 表示対象は組織の場合、グラフの組織値を削除しない
                if (record[cfgGraphFields.paipurainTaisho.code].value === '組織') {
                    activeGraphFields.push(cfgGraphFields.paipurainSoshiki.code);
                }
                break;
            case tsumiage:
                activeGraphFields = fieldListConfig.tsumiage.slice();
                if (event.type !== 'app.record.index.edit.submit') {
                    // 開始年月のカレンダーに値を取り込む
                    let tsumiageStartMonth = $('#' + cfgGraphFields.tsumiageCalendarSpace.code).val();
                    record[cfgGraphFields.tsumiageNengetsu.code].value = tsumiageStartMonth;
                }

                // 表示対象は組織の場合、グラフの組織値を削除しない
                if (record[cfgGraphFields.tsumiageTaisho.code].value === '組織') {
                    activeGraphFields.push(cfgGraphFields.tsumiageSoshiki.code);
                }
                break;
            case handonatsu:
                activeGraphFields = fieldListConfig.handonatsu.slice();
                if (event.type !== 'app.record.index.edit.submit') {
                    // 開始年月のカレンダーに値を取り込む
                    let handonatsuStartMonth = $('#' + cfgGraphFields.handonatsuCalendarSpace.code).val();
                    record[cfgGraphFields.handonatsuNengetsu.code].value = handonatsuStartMonth;
                }

                // 表示対象は組織の場合、グラフの組織値を削除しない
                if (record[cfgGraphFields.handonatsuTaisho.code].value === '組織') {
                    activeGraphFields.push(cfgGraphFields.handonatsuSoshiki.code);
                }
                break;
            case tatebo:
                activeGraphFields = fieldListConfig.tatebo.slice();
                if (event.type !== 'app.record.index.edit.submit') {
                    // 開始年月のカレンダーに値を取り込む
                    let tateboStartMonth = $('#' + cfgGraphFields.tateboCalendarSpace.code).val();
                    record[cfgGraphFields.tateboNengetsu.code].value = tateboStartMonth;
                }

                // 表示対象は組織の場合、グラフの組織値を削除しない
                if (record[cfgGraphFields.tateboTaisho.code].value === '組織') {
                    activeGraphFields.push(cfgGraphFields.tateboSoshiki.code);
                }
                break;
            default:
                activeGraphFields = fieldListConfig.kyotsu;
                break;
        }

        // 関係ないフィールドをクリアする
        let activeFields = fieldListConfig.kyotsu.concat(activeGraphFields);
        for (const field in record) {
            if (!activeFields.includes(field)) {
                if (record[field].type === 'ORGANIZATION_SELECT' || record[field].type === 'CHECK_BOX') {
                    record[field].value = [];
                } else {
                    record[field].value = '';
                }
            }
        }
    }

    /**
     * グラフタイプの表示対象に応じて組織選択フィールドを表示・非表示処理
     * @param {Object} record
    */
    function showSoshikiHandle(record, device) {
        let graphType = record[cfgGraphFields.graphType.code].value;
        let targetType = '';
        switch (graphType) {
            case paipurain:
                targetType = record[cfgGraphFields.paipurainTaisho.code].value;
                showSoshiki(targetType, cfgGraphFields.paipurainSoshiki.code, device);
                break;
            case tsumiage:
                targetType = record[cfgGraphFields.tsumiageTaisho.code].value;
                showSoshiki(targetType, cfgGraphFields.tsumiageSoshiki.code, device);
                break;
            case handonatsu:
                targetType = record[cfgGraphFields.handonatsuTaisho.code].value;
                showSoshiki(targetType, cfgGraphFields.handonatsuSoshiki.code, device);
                break;
            case tatebo:
                targetType = record[cfgGraphFields.tateboTaisho.code].value;
                showSoshiki(targetType, cfgGraphFields.tateboSoshiki.code, device);
                break;
        }
    }

    /**
      * 組織選択の表示有無
      * @param {string} targetType
      * @param {string} soshiki
    */
    function showSoshiki(targetType, soshiki, device) {
        if (device === deviceConfig.desktop) {
            if (targetType === '組織') {
                kintone.app.record.setFieldShown(soshiki, true);
            } else {
                kintone.app.record.setFieldShown(soshiki, false);
            }
        } else {
            if (targetType === '組織') {
                kintone.mobile.app.record.setFieldShown(soshiki, true);
            } else {
                kintone.mobile.app.record.setFieldShown(soshiki, false);
            }
        }
    }

    /**
     *　必須項目をチェック
     * @param {Object} record
     * @param {string} fieldName
    */
    function checkRequired(record, field) {
        const fieldValue = record[field].value;
        if (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
            record[field].error = messagesConfig.requiredField;
            return false;
        }
        return true;
    }

    /**
     * 表示・非表示グラフグループ
     * @param {array} graphList
     * @param {boolean} isShow　true: 表示, false: 非表示
     * @param {string} device デスクトップ・モバイル
    */
    function showGroupGraph(graphList, isShow, device) {
        graphList.forEach(function (graph) {
            if (device === deviceConfig.desktop) kintone.app.record.setFieldShown(graph, isShow);
            else kintone.mobile.app.record.setFieldShown(graph, isShow);
        });
    }

    /**
     * 年月開始スペースブランクを非表示
     * @param {string} graphType
    */
    function hideSpaceBlank(graphType) {
        switch (graphType) {
            case paipurain:
                $('#user-js-' + cfgGraphFields.paipurainCalendarSpace.code).parent().remove();
                break;
            case tsumiage:
                $('#user-js-' + cfgGraphFields.tsumiageCalendarSpace.code).parent().remove();
                break;
            case handonatsu:
                $('#user-js-' + cfgGraphFields.handonatsuCalendarSpace.code).parent().remove();
                break;
            case tatebo:
                $('#user-js-' + cfgGraphFields.tateboCalendarSpace.code).parent().remove();
                break;
        }
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

})(jQuery, window.nokConfig, window.graphConfig, window.snc);
