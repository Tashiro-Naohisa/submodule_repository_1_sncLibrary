/**
 * @fileoverview ヘッダーに合計値を表示する機能
 *
 * @author SNC
 * @version 5.0.0
 */
jQuery.noConflict();
(async function ($, nice, commonUtils) {
    'use strict';

    // 変数定義・初期化
    let targetFields = []; // 合計値を表示したいフィールドコードを指定
    let sncLib = {};

    /**
     * 画面（一覧）表示時のイベント
     * 　一覧のヘッダーに合計値を表示
     */
    kintone.events.on([
        'app.record.index.show'
    ], async function (event) {
        try {
            // 設定情報が取得済みかを判定
            if (!await nice.isConfigReady()) return event;
            sncLib = window.snc;

            if (nice.isEmptyObject(window.headerSummaryConfig)) return event;

            // 合計値の表示対象フィールドコードを取得
            targetFields = window.headerSummaryConfig.targetFields;

            const viewId = event.viewId;

            // 対象のビューIDかを判定
            if (window.headerSummaryConfig.notDisplayViewId.includes(viewId)) {
                return event;
            }

            // 既存の合計値表示を削除（重複防止）
            removePreviousTotals();

            // 遅延を入れて一覧の描画完了を待つ
            setTimeout(async () => {
                try {
                    await addTotalToHeaders(event);
                } catch (error) {
                    console.log(error);
                    // setTimeoutを使用しているため、Swal.fireのエラー処理を追加
                    return Swal.fire({
                        icon: 'error',
                        title: '合計表示エラー',
                        html: 'エラーが発生しました。<br>管理者に問い合わせて下さい。',
                        allowOutsideClick: false,
                        ...commonUtils.getSwalCustomClass()
                    });
                }
            }, 800);

        } catch (error) {
            console.log(error);
            return commonUtils.showErrorMessage(event);
        }

        return event;
    });

    /**
     * 画面（一覧）保存成功後のイベント
     * 　一覧のヘッダーに合計値を表示
     */
    kintone.events.on([
        'app.record.index.edit.submit.success',
        'app.record.index.delete.submit'
    ], async function (event) {
        try {
            // 設定情報が取得済みかを判定
            if (!await nice.isConfigReady()) return event;
            sncLib = window.snc;

            // 既存の合計値表示を削除（重複防止）
            removePreviousTotals();

            // 遅延を入れて一覧の描画完了を待つ
            setTimeout(async function () {
                try {
                    await addTotalToHeaders(event);
                } catch (error) {
                    console.log(error);
                    // setTimeoutを使用しているため、Swal.fireのエラー処理を追加
                    return Swal.fire({
                        icon: 'error',
                        title: '合計表示エラー',
                        html: 'エラーが発生しました。<br>管理者に問い合わせて下さい。',
                        allowOutsideClick: false,
                        ...commonUtils.getSwalCustomClass()
                    });
                }
            }, 1000);

        } catch (error) {
            console.log(error);
            return commonUtils.showErrorMessage(event);
        }

        return event;
    });

    // ----以下関数----

    /**
     * 既存の合計値表示を削除する関数
     * @returns {void}
     */
    function removePreviousTotals() {
        $('.custom-field-total').remove();
    }

    /**
     * 合計値をヘッダーに追加する関数
     * @returns {void}
     */
    async function addTotalToHeaders(event) {

        try {
            // kintoneの内部データから フィールド情報を取得
            const formData = cybozu?.data?.page?.FORM_DATA;

            if (!formData || !formData.schema) {
                throw new Error('FORM_DATAまたはschemaが取得できません');
            }

            // フィールド情報のマッピングを一括作成
            const mappings = createFieldMappings(formData.schema);
            const { fieldMapping, fieldNameMapping, fieldUnitMapping, fieldDigitMapping } = mappings;

            // 現在表示されている一覧のレコードを取得
            let query = kintone.app.getQueryCondition() || '';
            const appId = kintone.app.getId();

            if (event.type === 'app.record.index.delete.submit') {
                // レコード削除時は自分自身のレコードIDを除く
                if (!query) {
                    query = '$id != "' + event.record.$id.value + '"';
                } else {
                    query = '(' + query + ') and ( $id != "' + event.record.$id.value + '" )';
                }
            }

            const records = await sncLib.kintone.rest.getAllRecordsOnRecordIdAsync(appId, query);

            // 各対象フィールドについて処理
            targetFields.forEach(fieldCode => {
                // フィールドコードからフィールドIDを取得
                const fieldId = fieldMapping[fieldCode];
                // フィールドコードからフィールド名を取得
                const fieldName = fieldNameMapping[fieldCode];
                // フィールドコードからフィールド単位情報を取得
                const fieldUnitInfo = fieldUnitMapping[fieldCode];
                // フィールドコードからカンマ区切り情報を取得
                const useDigit = fieldDigitMapping[fieldCode];

                if (fieldId) {
                    // フィールドIDからヘッダー要素を取得
                    const $headerElement = getHeaderElementByFieldId(fieldId);
                    if ($headerElement && $headerElement.length > 0) {
                        // 合計値を計算（整数スケーリング法により浮動小数点誤差を回避）
                        const totalResult = calculateTotal(records, fieldCode);
                        // ヘッダーに合計値を表示
                        addTotalDisplay($headerElement, totalResult, fieldCode, fieldName, fieldUnitInfo, useDigit);
                    }
                }
            });

        } catch (error) {
            console.log(error);
            throw new Error('レコードの取得に失敗しました。', { cause: error });
        }
    }

    /**
     * フィールド情報のマッピングを一括作成する関数
     * @param {Object} schema - kintoneのフォームスキーマ
     * @returns {Object} フィールドマッピング情報
     */
    function createFieldMappings(schema) {
        const fieldMapping = {}; // フィールドコード -> フィールドID
        const fieldNameMapping = {}; // フィールドコード -> フィールド名
        const fieldUnitMapping = {}; // フィールドコード -> 単位情報
        const fieldDigitMapping = {}; // フィールドコード -> カンマ区切り情報

        // schema.table.fieldListが存在する場合、一括でマッピングを作成
        if (schema.table && schema.table.fieldList) {
            Object.keys(schema.table.fieldList).forEach(fieldId => {
                const field = schema.table.fieldList[fieldId];
                const fieldCode = field.var;

                if (fieldCode) {
                    // 数値フィールドと計算フィールド以外は処理対象外
                    if (field.type !== 'DECIMAL' && field.type !== 'CALC') {
                        return; // 数値・計算フィールド以外はスキップ
                    }

                    // 計算フィールドの場合、formatが'NUMBER'または'NUMBER_DIGIT'以外は処理対象外とする
                    if (field.type === 'CALC' && field.properties) {
                        const format = field.properties.format;
                        if (format !== 'NUMBER' && format !== 'NUMBER_DIGIT') {
                            return; // 数値形式以外の計算フィールドはスキップ
                        }
                    }

                    // フィールドID マッピング
                    if (field.id) {
                        fieldMapping[fieldCode] = field.id;
                    }

                    // フィールド名 マッピング
                    if (field.label) {
                        fieldNameMapping[fieldCode] = field.label;
                    }

                    // フィールド単位 マッピング
                    if (field.properties) {
                        let unit = field.properties.unit;
                        const unitPosition = field.properties.unitPosition;

                        // 単位が存在し、かつ空文字でない場合
                        if (unit && unit !== '') {
                            // バックスラッシュのエスケープを元に戻す
                            if (unit === '\\' || unit === '\\\\') {
                                unit = '￥';
                            }

                            fieldUnitMapping[fieldCode] = {
                                unit: unit,
                                position: unitPosition || 'AFTER' // デフォルトは後置き
                            };
                        }
                    }

                    // カンマ区切り マッピング
                    if (field.properties) {
                        // 数値フィールドの場合: digitプロパティに従う
                        if (field.type === 'DECIMAL') {
                            if (field.properties.digit === 'true') {
                                fieldDigitMapping[fieldCode] = { digit: true };
                            } else {
                                fieldDigitMapping[fieldCode] = { digit: false };
                            }
                        }
                        // 計算フィールドの場合: NUMBER_DIGITならカンマ区切りあり
                        else if (field.type === 'CALC') {
                            if (field.properties.format === 'NUMBER_DIGIT') {
                                fieldDigitMapping[fieldCode] = { digit: true };
                            } else {
                                fieldDigitMapping[fieldCode] = { digit: false };
                            }
                        }
                    }
                }
            });
        }

        return {
            fieldMapping,
            fieldNameMapping,
            fieldUnitMapping,
            fieldDigitMapping
        };
    }

    /**
     * フィールドIDからヘッダー要素を取得する関数
     * @param {string} fieldId - 対象のフィールドID
     * @returns {jQuery} jQueryオブジェクト
     */
    function getHeaderElementByFieldId(fieldId) {

        // label-{fieldId} クラス名で検索
        const labelClass = `label-${fieldId}`;
        let $headerElement = $(`.${labelClass}`);

        if ($headerElement.length > 0) {
            // label-{fieldId}クラスを持つ要素の親要素（th）を取得
            const $thElement = $headerElement.closest('th');
            return $thElement.length > 0 ? $thElement : $headerElement;
        }

        return $();
    }

    /**
     * 合計値を計算する関数（整数スケーリング法により浮動小数点誤差を回避）
     * @param {*} records
     * @param {*} fieldCode
     * @returns {Object} {total: number, maxDecimalPlaces: number} - 合計値と最大小数点桁数
     */
    function calculateTotal(records, fieldCode) {
        // まず最大小数点桁数を検出し、値を収集
        let maxDecimalPlaces = 0;
        const values = [];

        // レコードから対象フィールドの値を取得
        records.forEach(record => {
            const fieldValue = record[fieldCode];
            if (fieldValue && fieldValue.value !== undefined && fieldValue.value !== null && fieldValue.value !== '') {
                // 数値型であることを確認（文字列として数値のみを含む場合のみ許可）
                const strValue = String(fieldValue.value).trim();
                // 数値として解釈可能で、かつ日付・時刻形式でないことを確認
                if (/^-?\d+(\.\d+)?$/.test(strValue)) {
                    const numValue = parseFloat(strValue);
                    if (!isNaN(numValue)) {
                        // 元の文字列から小数点以下の桁数を取得
                        const decimalPart = strValue.split('.')[1] || '';
                        maxDecimalPlaces = Math.max(maxDecimalPlaces, decimalPart.length);
                        values.push(numValue);
                    }
                }
            }
        });

        if (values.length === 0) {
            return { total: 0, maxDecimalPlaces: 0 };
        }

        // 整数スケーリング法で浮動小数点誤差を回避
        // 小数点以下の桁数に応じてスケール（10の累乗）を決定
        const scale = Math.pow(10, maxDecimalPlaces);
        let totalScaled = 0;

        values.forEach(value => {
            // 各値をスケールアップして整数として加算
            totalScaled += Math.round(value * scale);
        });

        // 最後にスケールダウンして元の単位に戻す
        const total = totalScaled / scale;

        return { total, maxDecimalPlaces };
    }

    /**
     * 合計値表示をヘッダーに追加する関数
     * @param {jQuery} $headerElement - jQueryオブジェクト
     * @param {Object} totalResult - {total: number, maxDecimalPlaces: number}
     * @param {string} fieldCode
     * @param {string} fieldName
     * @param {Object} fieldUnitInfo - 単位情報オブジェクト {unit: string, position: string}
     * @param {object} useDigit - カンマ区切りを使用するかどうか {digit: true}
     */
    function addTotalDisplay($headerElement, totalResult, fieldCode, fieldName, fieldUnitInfo, useDigit) {
        // 既存の合計値表示を削除
        $headerElement.find('.custom-field-total').remove();

        // フィールド名が取得できない場合はフィールドコードを使用
        const displayName = fieldName || fieldCode;

        // calculateTotalから返された値を取得
        const total = totalResult.total;
        const decimalPlaces = totalResult.maxDecimalPlaces;

        // 数値をフォーマット（整数スケーリング法により既に誤差は回避済み）
        const formattedTotal = useDigit.digit
            ? total.toLocaleString(undefined, {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces
            })
            : total.toFixed(decimalPlaces);

        // 単位付きの合計値テキストを作成
        let totalText = `計: ${formattedTotal}`;
        let tooltipText = `${displayName} 合計値: ${formattedTotal}`;

        if (fieldUnitInfo && fieldUnitInfo.unit) {
            const unit = fieldUnitInfo.unit;
            const position = fieldUnitInfo.position;

            if (position === 'BEFORE') {
                // 前置き単位の場合
                totalText = `計: ${unit}${formattedTotal}`;
                tooltipText = `${displayName} 合計値: ${unit}${formattedTotal}`;
            } else {
                // 後置き単位の場合（デフォルト）
                totalText = `計: ${formattedTotal}${unit}`;
                tooltipText = `${displayName} 合計値: ${formattedTotal}${unit}`;
            }
        }

        // 合計値表示要素を作成
        const $totalElement = $('<div>', {
            'class': 'custom-field-total',
            'title': tooltipText,
            'text': totalText
        });

        // CSSスタイルを適用
        $totalElement.css({
            'font-size': '11px',
            'color': '#666',
            'font-weight': 'bold',
            'margin-top': '2px',
            'text-align': 'right',
            'background-color': '#f0f0f0',
            'padding': '2px 4px',
            'border-radius': '3px',
            'border': '1px solid #ddd',
            'white-space': 'nowrap',
            'overflow': 'hidden',
            'text-overflow': 'ellipsis',
            'z-index': '1000',
            'position': 'relative'
        });

        // ヘッダーに追加
        $headerElement.append($totalElement);
    }

})(jQuery, window.nice, window.commonUtils);
