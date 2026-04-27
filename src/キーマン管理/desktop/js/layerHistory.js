/**
 * @fileoverview 担当情報
 * - レイヤーの変更履歴を登録する
 * - 現職キー、前職キーを作成する
 *
 *【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * luxon.min.js -v3.1.1
 *
 * [CSS]
 *
 * @author SNC
 * @version 1.0.0
 * @customer XXXXXX (yyyy-mm-dd)
 */
jQuery.noConflict();
(function ($, nokConfig) {
    'use strict';

    const dateTime = luxon.DateTime.local();

    const tantoJohoConfig = nokConfig.keyman.fields;
    let beforeData;

    /*-------------------------------------------------------------------------------------------------------------------*/

    /**
     * レイヤー履歴サブテーブルの行データを作成する
     * @param {object} record
     * @return {object} サブテーブル空行のデータ
     */
    function addRowData(record) {
        // 行追加用のデータを作成
        let newRow = {};
        $.each(record[tantoJohoConfig.layerTable.code].value[0].value, function (key, val) {
            newRow[key] = {
                type: val.type,
                value: ''
            };
        });
        return newRow;
    };

    /**
     * 指定されたフィールドの値が変更されたか判定する
     * @param {object} record
     * @param {array} comparisonList 指定されたフィールド群の情報を持った配列
     * @return {boolean} true false
     */
    function changeCheck(record, comparisonList) {
        let result = false;

        for (let i = 0; i < comparisonList.length; i++) {
            // 編集後データの値が空の場合空文字を入れる（編集前データの値が空の場合、空文字が入っておりそちらに合わせる為）
            if (!record[tantoJohoConfig[comparisonList[i]].code].value) {
                record[tantoJohoConfig[comparisonList[i]].code].value = '';
            };
            // 編集後データと編集前データが一致していない
            if (record[tantoJohoConfig[comparisonList[i]].code].value !== beforeData[tantoJohoConfig[comparisonList[i]].code].value) {
                result = true;
                break;
            };
        };
        return result;
    };

    // /**
    //  * 履歴サブテーブル並び替え
    //  * @param {object} record
    //  * @return
    //  */
    // function layerTableSort(record) {
    //     record[tantoJohoConfig.layerTable.code].value.sort((a, b) => {
    //         // aの始に値がない時、b が先に来るようにする
    //         if (!a.value[tantoJohoConfig.startDateTB.code].value) return 1;
    //         // bの始に値がない時、a が先に来るようにする
    //         if (!b.value[tantoJohoConfig.startDateTB.code].value) return -1;
    //         // aの方の始が小さい時、b が先にくるようにする
    //         if (moment(a.value[tantoJohoConfig.startDateTB.code].value).isBefore(b.value[tantoJohoConfig.startDateTB.code].value)) return 1;
    //         // aの方の始が大きい時、a が先にくるようにする
    //         if (moment(a.value[tantoJohoConfig.startDateTB.code].value).isAfter(b.value[tantoJohoConfig.startDateTB.code].value)) return -1;
    //         // aの終に値がない時、a が先に来るようにする
    //         if (!a.value[tantoJohoConfig.endDateTB.code].value) return -1;
    //         // bの終に値がない時、b が先に来るようにする
    //         if (!a.value[tantoJohoConfig.endDateTB.code].value) return 1;
    //         return 0;
    //     });
    // };

    /*
    * レコード編集画面の表示イベント
    * レコード一覧画面のインライン編集開始時イベント
    * データをグローバル変数に保存
    * */
    kintone.events.on([
        'app.record.edit.show',
        'app.record.index.edit.show',
    ], function (event) {
        beforeData = event.record;
        return event;
    });


    /*
    * レコード編集画面（新規、編集、一覧）の保存実行前イベント
    * レイヤーの変更履歴をレイヤー履歴サブテーブルに登録（行頭）
    * 現職キー、前職キーを作成する
    * */
    kintone.events.on([
        'app.record.create.submit',
        'app.record.edit.submit',
        'app.record.index.edit.submit',
    ], function (event) {
        let record = event.record;
        let layerTable = record[tantoJohoConfig.layerTable.code].value;
        let today = dateTime.toFormat('yyyy-MM-dd');

        if (event.type === 'app.record.create.submit') {
            // テーブル1行目にデータを登録
            // 役職
            layerTable[0].value[tantoJohoConfig.lyakushokuTB.code].value = record[tantoJohoConfig.yakushoku.code].value;
            // 所属
            layerTable[0].value[tantoJohoConfig.ShozokuTB.code].value = record[tantoJohoConfig.busho.code].value;
            // 始
            layerTable[0].value[tantoJohoConfig.startDateTB.code].value = today;

        } else {
            // テーブル並び替え
            // layerTableSort(record);
            // 役職履歴変更チェック
            let comparisonList1 = nokConfig.keyman.layerChangeList.layerHistory;
            if (changeCheck(record, comparisonList1)) {
                // 空行データ作成
                let newRow = addRowData(record);
                // 役職
                newRow[tantoJohoConfig.lyakushokuTB.code].value = record[tantoJohoConfig.yakushoku.code].value;
                // 所属
                newRow[tantoJohoConfig.ShozokuTB.code].value = record[tantoJohoConfig.busho.code].value;
                // 始
                newRow[tantoJohoConfig.startDateTB.code].value = today;
                // テーブル1行目の終
                layerTable[0].value[tantoJohoConfig.endDateTB.code].value = today;
                // テーブル1行目にデータを追加
                record[tantoJohoConfig.layerTable.code].value.unshift({ value: newRow });
            };
        };
        return event;
    });


    /*
    * レコード編集画面（新規、編集）の表示イベント
    * レコード編集画面（新規、編集）のレイヤーテーブル行追加・削除時イベント
    * レイヤー履歴サブテーブルを非活性にする
    * */
    kintone.events.on([
        'app.record.create.show',
        'app.record.edit.show',
        'app.record.create.change.' + tantoJohoConfig.layerTable.code,
        'app.record.edit.change.' + tantoJohoConfig.layerTable.code,
    ], function (event) {
        let record = event.record;
        let layerTable = record[tantoJohoConfig.layerTable.code].value;

        // 非活性処理
        for (let i = 0; i < layerTable.length; i++) {
            $.each(layerTable[i].value, function (key) {
                layerTable[i].value[key].disabled = true;
            });
        };
        return event;
    });

})(jQuery, window.nokConfig);
