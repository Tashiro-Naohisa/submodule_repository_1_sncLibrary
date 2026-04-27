/**
 * @fileoverview 見積管理アプリ
 *
 *【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * snc.min.js -v1.0.5
 * snc.kintone.min.js -v1.0.8
 * snc.nok.min.js -v1.0.5
 * config.nok.js -v4.0.1
 *
 * [CSS]
 *
 * @author SNC
 * @version 4.0.1
 * @customer SNC（yyyy-mm-dd）
 */
jQuery.noConflict();
(function ($, config, sncLib) {
    'use strict'

    const cfgMitsumoriFields = config.mitsumori.fields;
    /**
     * レコード編集画面（新規、追加）の表示イベント
     * 　フィールドの表示/非表示設定
     * 　フィールドの入力可/否 を設定
    */
    kintone.events.on([
        'app.record.create.show',
        'app.record.edit.show',
        'app.record.index.edit.show',
        'app.record.index.show',
        'app.record.detail.show',
        'app.record.print.show'
    ], function (event) {
        let record = event.record;
        // ログインユーザーのアカウントを取得
        let loginUser = kintone.getLoginUser();

        // 担当者情報の取得
        if (event.type == 'app.record.create.show') {
            // 担当者情報を取得
            record[cfgMitsumoriFields.tantoshaSearch.code].value = loginUser.code;
            record[cfgMitsumoriFields.tantoshaSearch.code].lookup = true;
            //案件情報を取得
            if (record[cfgMitsumoriFields.ankenSearch.code].value) {
                record[cfgMitsumoriFields.ankenSearch.code].lookup = true;
            }
        }

        // ログインユーザーが管理アカウントではない場合
        if (config.kanriUsers.indexOf(loginUser.code) == -1) {
            // フィールドの表示/非表示設定
            sncLib.nok.util.setAppFieldsShown(cfgMitsumoriFields);

            if (
                event.type == 'app.record.create.show'
                || event.type == 'app.record.edit.show'
                || event.type == 'app.record.index.edit.show'
            ) {
                // フィールドの入力可/否設定
                sncLib.nok.util.setAppFieldsDisabled(record, cfgMitsumoriFields);
            }
        }
        if (
            event.type == 'app.record.create.show'
            || event.type == 'app.record.edit.show'
            || event.type == 'app.record.detail.show'
        ) {
            kintone.app.record.setFieldShown(cfgMitsumoriFields.meisaiTableNo_T.code, false);
        }
        return event;
    });


    /**
     * レコード編集画面（追加）の表示イベント
     *   レコード追加画面において、GETパラメータに値が設定されている場合、
     * 　パラメータを取得し、フィールドへ値をセット
     */
    kintone.events.on([
        'app.record.create.show'
    ], function (event) {

        // URLよりGETパラメータを取得し、
        // アプリ内にパラメータと一致するフィールドが存在すれば、
        // 値をセットする。
        let lets = sncLib.util.getUrlVars();
        for (let keyCode in lets) {
            if (event.record[keyCode]) {
                event.record[keyCode].value = lets[keyCode];
            }
        }

        return event;
    });


    /**
     * レコード追加画面が表示された時のイベント
     * レコード編集画面が表示された時のイベント
    */
    kintone.events.on([
        'app.record.create.show',
        'app.record.edit.show',
        'app.record.detail.show',
    ], function (event) {
        numberingMeisaiNo(event.record[cfgMitsumoriFields.mitsumoriMeisaiTB.code].value);
        kintone.app.record.setFieldShown(cfgMitsumoriFields.shohinId_T.code, false);
        return event;
    });

    /**
     * 見積原価サブテーブル行追加イベント
     * 見積原価サブテーブル行削除イベント
     */

    kintone.events.on([
        'app.record.create.change.' + cfgMitsumoriFields.mitsumoriMeisaiTB.code,
        'app.record.edit.change.' + cfgMitsumoriFields.mitsumoriMeisaiTB.code,
    ], function (event) {
        roopChecker = 0; //ループ制限off
        numberingMeisaiNo(event.record[cfgMitsumoriFields.mitsumoriMeisaiTB.code].value);
        return event;
    });

    /**
     * 見積原価サブテーブル商品id変更イベント
     *
     */
    kintone.events.on([
        'app.record.create.change.' + cfgMitsumoriFields.shohinId_T.code,
        'app.record.edit.change.' + cfgMitsumoriFields.shohinId_T.code,
    ], function (event) {
        searchItemsData(event, roopChecker);
        return event;
    });


    // 関連商品表示のループ制御用
    // 0 = 関連商品検索可能
    // 1 = 関連商品検索不可
    let roopChecker = 0;

    /**
     * サブテーブル[No]項目に連番を振る関数
     * @param {*} tableList
     */
    function numberingMeisaiNo(tableList) {
        //No項目に行数分数字を再配置
        for (let i = 0; i < tableList.length; i++) {
            let setNo = i + 1;
            tableList[i].value[cfgMitsumoriFields.meisaiNo_T.code].value = setNo;
            tableList[i].value[cfgMitsumoriFields.meisaiTableNo_T.code].value = setNo;
        }
    }

    /**
     * 見積原価サブテーブル
     * 商品ルックアップ時に関連商品検索実行
     */
    function searchItemsData(event) {

        // 変更中のデータを取得
        let changeShohinId = event.changes.row.value[cfgMitsumoriFields.shohinId_T.code].value;
        let meisaiNo = parseInt(event.changes.row.value[cfgMitsumoriFields.meisaiTableNo_T.code].value);
        let row = event.changes.row;
        const shohinAppId = config.shohinMaster.app;
        let kanrenIdArray = [];
        // 値がない=値がクリアされているため処理を止める
        if (changeShohinId === undefined || changeShohinId === '') {
            roopChecker = 0;
            return false;
        }
        return new kintone.Promise(function (resolve, reject) {

            // 変更中データを商品マスタから取得
            let query = config.shohinMaster.fields.shohinId.code + ' = "' + changeShohinId + '"';
            resolve(sncLib.kintone.rest.getRecord(shohinAppId, query));
        }).then(function (resp) {
            // ループ制限確認
            if (!resp.length || roopChecker === 1) {
                return false;
            }
            // 関連商品idを全て取得
            let kanrenList = resp[0][config.shohinMaster.fields.kanrenShohinTb.code].value;
            for (let i = 0; i < kanrenList.length; i++) {
                kanrenIdArray.push(kanrenList[i].value[config.shohinMaster.fields.kanrenShohinCode.code].value);
            }

            // 関連商品0の場合処理終了
            if (!kanrenIdArray.length) {
                kintone.app.record.set(event);
                numberingMeisaiNo(event.record[cfgMitsumoriFields.mitsumoriMeisaiTB.code].value);
                return false;
            }
            let query = '';
            return sncLib.kintone.rest.getAllRecordsOnRecordId(shohinAppId, query);
        }).then(function (resp) {
            if (roopChecker === 1) {
                return false;
            }
            // 関連商品の商品検索コードを探すためのobjectを生成
            let mapDatas = {};
            for (let i = 0; i < resp.length; i++) {
                let shohinId = resp[i][config.shohinMaster.fields.shohinId.code].value;
                let shohinSearchId = resp[i][config.shohinMaster.fields.shohinSearch.code].value;
                mapDatas[shohinId] = shohinSearchId;
            }
            // 関連商品の商品検索コードを格納
            let kanrenShohinSearchArray = [];
            for (let i = 0; i < kanrenIdArray.length; i++) {
                if (mapDatas[kanrenIdArray[i]] !== undefined) {
                    kanrenShohinSearchArray.push(mapDatas[kanrenIdArray[i]]);
                }
            }
            let record = kintone.app.record.get();
            let postRecords = record.record[cfgMitsumoriFields.mitsumoriMeisaiTB.code].value;
            // 関連商品の数分、テーブルに行を挿入するための配列を作成
            for (let i = 0; i < kanrenShohinSearchArray.length; i++) {
                let copyRow = $.extend(true, {}, row);
                // 行追加
                postRecords.splice(meisaiNo + i, 0, copyRow);
                let n = meisaiNo + i;
                // データセットテンプレート用にvalueをundefinedにする
                for (let key in postRecords[n].value) {
                    if (Object.hasOwnProperty.call(postRecords[n].value, key)) {
                        postRecords[n].value[key].value = null;
                    }
                }
                // セット対象フィールドへ値をセットし、自動ルックアップをON
                postRecords[n].value[cfgMitsumoriFields.shohinSearch_T.code].value = kanrenShohinSearchArray[i];
                postRecords[n].value[cfgMitsumoriFields.shohinSearch_T.code].lookup = true;
            }
            // console.log(postRecords);
            // テーブルの商品検索コードをルックアップ取得状態にする
            for (let i = 0; i < postRecords.length; i++) {
                if (postRecords[i].value[cfgMitsumoriFields.shohinSearch_T.code].value) {
                    postRecords[i].value[cfgMitsumoriFields.shohinSearch_T.code].lookup = true;
                }
            }
            // 既存(ルックアップデータ含) + 追加の関連商品をマージ
            record.record[cfgMitsumoriFields.mitsumoriMeisaiTB.code].value = postRecords;
            numberingMeisaiNo(record.record[cfgMitsumoriFields.mitsumoriMeisaiTB.code].value);
            kintone.app.record.set(record);
            roopChecker = 1;//ループ制限on
            return event;
        }).catch(function (err) {
            console.log(err);
            return event;
        });
    }

})(jQuery, window.nokConfig, window.snc);
