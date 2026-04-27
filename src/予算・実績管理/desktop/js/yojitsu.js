/**
 * @fileoverview 予算・実績管理の予実績表示
 * - リソース：
 * - イベント：
 *
 * 【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * luxon.min.js -v3.1.1
 * datepicker.min.js -v1.0.10
 * datepicker.ja-JP.js -v1.0.10
 * lang-all.js
 * config.nok.js -v4.0.1
 * config.yojitsu.js -v4.0.1
 *
 * [CSS]
 * 51-us-default.css
 * datepicker-1.0.10.min.css
 * yojitsu-view.css
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 *
*/
jQuery.noConflict();
(function ($, config, configYojitsu, sncLib) {
    'use strict';

    const dateTime = luxon.DateTime.local();

    const cfgYojitsu = config.yojitsu;
    const cfgYojitsuFields = config.yojitsu.fields;
    const cfgYojitsuSetting = config.yojitsuSetting;
    const cfgYojitsuSettingFields = config.yojitsuSetting.fields;

    const cfgAnken = config.anken;
    const cfgAnkenFields = config.anken.fields;
    const cfgtantosha = config.tantosha;
    const cfgtantoshaFields = config.tantosha.fields;

    const Type = {
        TANTOSHA: 'tantosha',
        BUSHO: 'busho',
        KYOTEN: 'kyoten'
    };

    const dataType = {
        SHOKEI: 'shokei',
        GOKEI: 'gokei'
    };

    const displayItem = {
        URIAGE_ARARI: 'uriage_arari',
        URIAGE: 'uriage',
        ARARI: 'arari'
    };

    const summaryPatternToGetsu = {
        MIKOMI: 0,
        JISSEKI_MIKOMI: 1
    };

    var hyojiSettei = {};

    /**
     * 検索条件のオブジェクト情報を生成
     * @param {*} start
     * @param {*} end
     * @param {*} kakudo
     * @param {*} arariUriage
     */
    function createSearchData(start, end, kakudo, arariUriage) {

        // 予実情報
        // 目標 売上:粗利
        return {
            'items': {
                'kikanStart': start,
                'kikanEnd': end,
                'kakudo': kakudo,
                'uriageArari': arariUriage
            }
        }
    };

    /**
     * 予実情報検索・表示処理
     */
    function yojitsu_search() {

        // 検索条件を取得
        var elNengetsuFrom = $('#' + configYojitsu.searchItems.nengetsuFrom.id).val();
        var elNengetsuTo = $('#' + configYojitsu.searchItems.nengetsuTo.id).val();

        // 画面より確度の選択値を取得
        var kakudoElements = document.getElementsByName('searchCondition-kakudo');
        var checkedKakudos = [];
        for (var i = 0; i < kakudoElements.length; i++) {
            if (kakudoElements[i].checked == true) {
                checkedKakudos.push(kakudoElements[i].value);
            }
        }

        // 画面より売上/粗利の選択値を取得
        var uriageArariElements = document.getElementsByName('searchCondition-uriage_arari');
        var selectedUriageArari = displayItem.URIAGE_ARARI;
        for (var i = 0; i < uriageArariElements.length; i++) {
            if (uriageArariElements[i].checked == true) {
                if (uriageArariElements[i].value === '売上のみ') {
                    selectedUriageArari = displayItem.URIAGE;
                } else if (uriageArariElements[i].value === '粗利のみ') {
                    selectedUriageArari = displayItem.ARARI;
                } else {
                    selectedUriageArari = displayItem.URIAGE_ARARI;
                }
                break;
            }
        }

        var searchInfo = createSearchData(elNengetsuFrom, elNengetsuTo, checkedKakudos, selectedUriageArari);
        // 検索期間-開始
        var searchInfoKikanStart = searchInfo.items.kikanStart;
        // 検索期間-終了
        var searchInfoKikanEnd = searchInfo.items.kikanEnd;
        // 当月
        var toGetsu = dateTime.toFormat('yyyy-MM');

        var mjKikanStart = '';
        var mjKikanEnd = '';
        var anKikanStart = '';
        var anKikanEnd = '';
        // 当月が検索期間の前か、範囲内か後かを判定
        if (toGetsu < searchInfoKikanStart) {
            // 　１．当月が検索期間-開始以前の場合、見込のみを集計
            //　　　　　目標実績の範囲指定は、ブランク
            //　　　　　案件管理の範囲指定は、検索期間と同一とする
            mjKikanStart = '';
            mjKikanEnd = '';
            anKikanStart = searchInfoKikanStart;
            anKikanEnd = searchInfoKikanEnd;
        } else if (toGetsu > searchInfoKikanEnd) {
            // 　２．当月が検索期間-終了以降の場合、実績のみを集計
            //　　　　　目標実績の範囲指定は、検索期間と同一
            //　　　　　案件管理の範囲指定は、ブランクとする
            mjKikanStart = searchInfoKikanStart;
            mjKikanEnd = searchInfoKikanEnd;
            anKikanStart = '';
            anKikanEnd = '';
        } else {
            // 　３．当月が検索期間範囲内の場合、実績と見込より集計
            //　　　　　目標実績の範囲指定は、検索期間-開始 ～ 当月
            //　　　　　案件管理の範囲指定は、当月～検索期間-終了
            //　　　　　　　※目標実績アプリの当月レコードの実績集計期間（至）の考慮は集計時に実装
            mjKikanStart = searchInfoKikanStart;
            mjKikanEnd = toGetsu;

            anKikanStart = toGetsu;
            anKikanEnd = searchInfoKikanEnd;
        }

        // データ取得処理
        //  1.予実アプリより、目標情報を取得
        //  2.予実アプリより、実績情報を取得
        //  3.案件アプリより、見込情報を取得
        //  4.担当者アプリより、担当者情報を取得
        return kintone.Promise.all([
            getMokuhyoJisseki(searchInfoKikanStart, searchInfoKikanEnd),
            getMokuhyoJisseki(mjKikanStart, mjKikanEnd),
            getAnkenData(anKikanStart, anKikanEnd, searchInfo.items.kakudo),
            getTantoshaData()
        ]).then(function (results) {
            // console.log(results);

            // 表示設定より、表示する担当者、部署、拠点情報を取得
            var selectedHyojiSettei = hyojiSettei[$('#searchCondition-hyojiSettei').val()];

            // 描画領域をクリア
            initBody();

            // 目標用データ
            var mokuhyoData = results[0];
            // 実績用データ
            var jissekiData = results[1];
            // 見込用データ
            var ankenData = results[2];

            // 拠点別
            var kyotenTable = selectedHyojiSettei[cfgYojitsuSettingFields.kyotenTable.code];
            if (!isBlankSubTableValue(kyotenTable, cfgYojitsuSettingFields.kyoten.code)) {
                var kyotenList = getYojitsuHyojiList(selectedHyojiSettei[cfgYojitsuSettingFields.kyotenTable.code],
                    [cfgYojitsuSettingFields.kyoten.code],
                    [cfgYojitsuSettingFields.kyoten.code]
                );
                // 予実表を表示
                createYojitsuHyo(kyotenList, Type.KYOTEN, mokuhyoData, jissekiData, ankenData, selectedUriageArari);
            }

            // 部署別
            var bushoTable = selectedHyojiSettei[cfgYojitsuSettingFields.bushoTable.code];
            if (!isBlankSubTableValue(bushoTable, cfgYojitsuSettingFields.busho.code)) {

                var bushoTmpList = [];
                // 部署用リストの改訂
                /* */
                // 担当者管理に登録されている担当者情報より表示リストを作成
                // 担当者情報から拠点と部署の重複を省く
                var distinctTantoshaList = results[3].filter(sncLib.util.distinct(
                    [cfgtantoshaFields.kyoten.code, cfgtantoshaFields.busho.code]
                ));
                if (bushoTable.length > 0) {
                    for (var i = 0; i < bushoTable.length; i++) {
                        var row = bushoTable[i].value;
                        var busho = row[cfgYojitsuSettingFields.busho.code].value;
                        row[cfgYojitsuSettingFields.bushoKyoten.code] = {};
                        row[cfgYojitsuSettingFields.bushoKyoten.code].value = '';
                        var bushoKyotenList = [];
                        // 担当者情報より部署-拠点情報を取得
                        for (var j = 0; j < distinctTantoshaList.length; j++) {

                            if (busho === distinctTantoshaList[j][cfgtantoshaFields.busho.code].value) {
                                var kyoten = distinctTantoshaList[j][cfgtantoshaFields.kyoten.code].value;
                                if (bushoKyotenList.indexOf(kyoten) < 0) {
                                    bushoKyotenList.push(kyoten);
                                }
                            }
                        }
                        for (var j = 0; j < bushoKyotenList.length; j++) {
                            var copy_data = $.extend(true, {}, bushoTable[i]);
                            copy_data.value[cfgYojitsuSettingFields.bushoKyoten.code].value = bushoKyotenList[j];
                            bushoTmpList.push(copy_data);
                        }
                    }

                    // 担当者情報より部署-拠点情報が取得できなかった場合は、元の値をセット
                    if (bushoTmpList.length === 0) {
                        bushoTmpList = bushoTable;
                    }
                }
                // 実績情報と案件情報に登録されている担当者情報より表示リストを作成
                var bushoList = getYojitsuHyojiList(bushoTmpList,
                    [cfgYojitsuSettingFields.busho.code, cfgYojitsuSettingFields.bushoKyoten.code],
                    [cfgYojitsuSettingFields.busho.code, cfgYojitsuSettingFields.bushoKyoten.code]);
                // 予実表を表示
                createYojitsuHyo(bushoList, Type.BUSHO, mokuhyoData, jissekiData, ankenData, selectedUriageArari);
            }

            // 担当者別
            var tantoshaTable = selectedHyojiSettei[cfgYojitsuSettingFields.tantoshaTable.code];
            if (!isBlankSubTableValue(tantoshaTable, cfgYojitsuSettingFields.tantoshaSearch.code)) {
                var tantoshaList = getYojitsuHyojiList(selectedHyojiSettei[cfgYojitsuSettingFields.tantoshaTable.code],
                    // ['nok_担当者テーブル_担当者検索コード'],
                    // ['nok_担当者テーブル_拠点', 'nok_担当者テーブル_部署']);
                    [cfgYojitsuSettingFields.tantoshaSearch.code],
                    [cfgYojitsuSettingFields.tantoshaKyoten.code, cfgYojitsuSettingFields.tantoshaBusho.code]);
                // 予実表を表示
                createYojitsuHyo(tantoshaList, Type.TANTOSHA, mokuhyoData, jissekiData, ankenData, selectedUriageArari);
            }
        });
    };

    /**
     * サブテーブルの値が存在しているかを確認
     * @param {*} kintoneSubTable
     * @param {*} field
     * @returns
     */
    function isBlankSubTableValue(kintoneSubTable, field) {
        for (var i = 0; i < kintoneSubTable.length; i++) {
            if (kintoneSubTable[i].value[field].value) {
                return false;
            }
        }
        return true;
    };

    /**
     * 予実表に表示する情報を取得
     * @param {*} kintoneSubTable
     * @param {*} distinctFieldsList
     * @param {*} sortFieldsList
     */
    function getYojitsuHyojiList(kintoneSubTable, distinctFieldsList, sortFieldsList) {
        var list = [];
        kintoneSubTable.forEach(function (val) {
            list.push(val.value);
        });
        // 重複を省く
        var distinctList = list.filter(sncLib.util.distinct(distinctFieldsList));
        var preTargetItem = '';
        var targetList = [];
        var hyoujiList = [];
        // 並び替え
        for (var i = 0; i < distinctList.length; i++) {
            var targetItem1 = '';
            sortFieldsList.forEach(function (val) {
                if (targetItem1) {
                    targetItem1 += '-';
                }
                targetItem1 += distinctList[i][val].value;
            });

            // 前回の値との比較チェック
            if (preTargetItem === targetItem1) {
                continue;
            }
            // 存在チェック
            if (targetList.indexOf(targetItem1) >= 0) {
                continue;
            }

            // 再帰的に処理を行う
            for (var j = 0; j < distinctList.length; j++) {

                var targetItem2 = '';
                sortFieldsList.forEach(function (val) {
                    if (targetItem2) {
                        targetItem2 += '-';
                    }
                    targetItem2 += distinctList[j][val].value;
                });

                // 存在チェック
                if (targetList.indexOf(targetItem2) >= 0) {
                    continue;
                }

                // 同じ値だった場合、
                if (targetItem1 === targetItem2) {
                    hyoujiList.push(distinctList[j]);
                }
            }
            preTargetItem = targetItem1;
            targetList.push(preTargetItem);
        }
        return hyoujiList;
    };

    /********************************************************
     * 表作成
     *******************************************************/
    function createYojitsuHyo(hyojiList, type, mokuhyoData, jissekiData, ankenData, displayItem) {

        if (hyojiList.length === 0) {
            return;
        }
        var yojitsuData = [];

        // 表示名
        var hDisplayNameFieldCode = cfgYojitsuSettingFields.tantoshamei.code;
        // 表示対象フィールド
        var hTargetFieldList = [cfgYojitsuSettingFields.tantoshaSearch.code];
        // 目標実績データの表示対象フィールド
        var mjTargetFieldList = [cfgYojitsuFields.tantoshaCodeYojisseki.code];
        // 案件データの表示対象フィールド
        var anTargetFieldList = [cfgAnkenFields.tantoshaSearch.code];
        // 小計単位
        var shokeiKeyList = [cfgYojitsuSettingFields.tantoshaKyoten.code, cfgYojitsuSettingFields.tantoshaBusho.code];
        // 小計の表示名用
        var shokeiDisplayNameFieldList = [cfgYojitsuSettingFields.tantoshaKyoten.code, cfgYojitsuSettingFields.tantoshaBusho.code];

        //　目標・実績情報
        var mokuhyoUriageKingakuFieldCode = cfgYojitsuFields.mokuhyoUriageKingaku.code;
        var jissekiUriageKingakuFieldCode = cfgYojitsuFields.jissekiUriageKingaku.code;
        var mikomiUriageKingakuFieldCode = cfgAnkenFields.uriage.code;
        var mokuhyoArariKingakuFieldCode = cfgYojitsuFields.mokuhyoArariKingaku.code;
        var jissekiArariKingakuFieldCode = cfgYojitsuFields.jissekiArariKingaku.code;
        var mikomiArariKingakuFieldCode = cfgAnkenFields.fukakachi.code;

        // 担当者情報の表示
        if (type === Type.TANTOSHA) {
            hDisplayNameFieldCode = cfgYojitsuSettingFields.tantoshamei.code;
            hTargetFieldList = [cfgYojitsuSettingFields.tantoshaSearch.code];
            mjTargetFieldList = [cfgYojitsuFields.tantoshaCodeYojisseki.code];
            anTargetFieldList = [cfgAnkenFields.tantoshaSearch.code];
            shokeiKeyList = [cfgYojitsuSettingFields.tantoshaKyoten.code, cfgYojitsuSettingFields.tantoshaBusho.code];
            shokeiDisplayNameFieldList = [cfgYojitsuSettingFields.tantoshaKyoten.code, cfgYojitsuSettingFields.tantoshaBusho.code];
        }
        // 部署情報の表示
        else if (type === Type.BUSHO) {
            hDisplayNameFieldCode = cfgYojitsuSettingFields.busho.code;
            hTargetFieldList = [cfgYojitsuSettingFields.bushoKyoten.code, cfgYojitsuSettingFields.busho.code];
            mjTargetFieldList = [cfgYojitsuFields.kyoten.code, cfgYojitsuFields.busho.code];
            anTargetFieldList = [cfgAnkenFields.tantoshaKyoten.code, cfgAnkenFields.tantoshaBusho.code];
            shokeiKeyList = [cfgYojitsuSettingFields.bushoKyoten.code, cfgYojitsuSettingFields.busho.code];
            shokeiDisplayNameFieldList = [cfgYojitsuSettingFields.bushoKyoten.code];
        }
        // 拠点情報の表示
        else if (type === Type.KYOTEN) {
            hDisplayNameFieldCode = cfgYojitsuSettingFields.kyoten.code;
            hTargetFieldList = [cfgYojitsuSettingFields.kyoten.code];
            mjTargetFieldList = [cfgYojitsuFields.kyoten.code];
            anTargetFieldList = [cfgAnkenFields.tantoshaKyoten.code];
            shokeiKeyList = [];
            shokeiDisplayNameFieldList = [];
        }

        // 集計処理
        summaryYojitsuData(yojitsuData, type, hyojiList, mokuhyoData, jissekiData, ankenData, hDisplayNameFieldCode,
            hTargetFieldList, mjTargetFieldList, anTargetFieldList,
            shokeiKeyList,
            shokeiDisplayNameFieldList,
            mokuhyoUriageKingakuFieldCode, jissekiUriageKingakuFieldCode, mikomiUriageKingakuFieldCode,
            mokuhyoArariKingakuFieldCode, jissekiArariKingakuFieldCode, mikomiArariKingakuFieldCode, displayItem);

        // 表示データが存在する場合
        if (yojitsuData.length > 0) {
            createListInfo(type);
            createHeader();
            createBody(yojitsuData);
            createFooter();
        } else {
            // 表示するデータが存在しない場合。


        }
        return true;
    };

    /**
     * 予実データ集計処理
     * @param {*} yojitsuData
     * @param {*} type
     * @param {*} hyojiList
     * @param {*} mokuhyoData
     * @param {*} jissekiData
     * @param {*} ankenData
     * @param {*} hDisplayNameFieldCode
     * @param {*} hTargetFieldCode
     * @param {*} mjTargetFieldCode
     * @param {*} anTargetFieldList
     * @param {*} shokeiKeyList
     * @param {*} mokuhyoUriageKingakuFieldCode
     * @param {*} jissekiUriageKingakuFieldCode
     * @param {*} mikomiUriageKingakuFieldCode
     * @param {*} mokuhyoArariKingakuFieldCode
     * @param {*} jissekiArariKingakuFieldCode
     * @param {*} mikomiArariKingakuFieldCode
     * @param {*} displayItem
     */
    function summaryYojitsuData(
        yojitsuData,
        type, hyojiList, mokuhyoData, jissekiData, ankenData,
        hDisplayNameFieldCode, hTargetFieldList,
        mjTargetFieldList, anTargetFieldList,
        shokeiKeyList, shokeihDisplayNameFieldList,
        mokuhyoUriageKingakuFieldCode, jissekiUriageKingakuFieldCode, mikomiUriageKingakuFieldCode,
        mokuhyoArariKingakuFieldCode, jissekiArariKingakuFieldCode, mikomiArariKingakuFieldCode, displayItem
    ) {

        var summaryPattern = configYojitsu.summaryPattern;
        var shokeiDispayFlg = shokeiKeyList.length > 0 ? true : false;
        // 小計用
        var sMokuhyoUriage = 0;
        var sMokuhyoArari = 0;
        var sJissekiUriage = 0;
        var sJissekiArari = 0;
        var sMikomiUriage = 0;
        var sMikomiArari = 0;
        //　合計用
        var gMokuhyoUriage = 0;
        var gMokuhyoArari = 0;
        var gJissekiUriage = 0;
        var gJissekiArari = 0;
        var gMikomiUriage = 0;
        var gMikomiArari = 0;
        var checkShokeiKey = '';

        for (var i = 0; i < hyojiList.length; i++) {
            var mokuhyoUriage = 0;
            var mokuhyoArari = 0;
            var jissekiUriage = 0;
            var jissekiArari = 0;
            var mikomiUriage = 0;
            var mikomiArari = 0;
            var row = hyojiList[i];
            // var hTargetCode = row[hTargetFieldCode].value;
            var hDisplayName = row[hDisplayNameFieldCode].value;

            var htList = [];
            // キーコードのフィールドリストより値を取得
            for (var j = 0; j < hTargetFieldList.length; j++) {
                htList.push(row[hTargetFieldList[j]].value);
            }
            var hTargetCode = htList.join('-');

            // 実績集計日（至）の初期値として当月の1日をセット
            var jissekiShukeisumiBi = dateTime.toFormat('yyyy-MM-01');

            var shokeiKey = '';
            var shokeihDisplayName = '';
            // 小計を表示する場合
            if (shokeiDispayFlg) {
                // キーコード作成
                var keyList = [];
                // キーコードのフィールドリストより値を取得
                for (var j = 0; j < shokeiKeyList.length; j++) {
                    keyList.push(row[shokeiKeyList[j]].value);
                }
                shokeiKey = keyList.join('-');

                var sdList = [];
                // キーコードのフィールドリストより値を取得
                for (var j = 0; j < shokeihDisplayNameFieldList.length; j++) {
                    sdList.push(row[shokeihDisplayNameFieldList[j]].value);
                }
                shokeihDisplayName = sdList.join('-');
            }

            // 目標データ
            for (var j = 0; j < mokuhyoData.length; j++) {
                var mjRow = mokuhyoData[j];
                var targetList = [];
                // キーコードのフィールドリストより値を取得
                for (var k = 0; k < mjTargetFieldList.length; k++) {
                    targetList.push(mjRow[mjTargetFieldList[k]].value);
                }
                var mjTargetCode = targetList.join('-');

                if (mjTargetCode === hTargetCode) {
                    mokuhyoUriage += sncLib.util.toInt(mjRow[mokuhyoUriageKingakuFieldCode].value);
                    mokuhyoArari += sncLib.util.toInt(mjRow[mokuhyoArariKingakuFieldCode].value);
                }
            }

            // 実績データ
            for (var j = 0; j < jissekiData.length; j++) {
                var mjRow = jissekiData[j];

                var targetList = [];
                // キーコードのフィールドリストより値を取得
                for (var k = 0; k < mjTargetFieldList.length; k++) {
                    targetList.push(mjRow[mjTargetFieldList[k]].value);
                }
                var mjTargetCode = targetList.join('-');

                if (mjTargetCode === hTargetCode) {
                    // 先月までの場合、実績集計
                    if (!dateTime.hasSame(mjRow[cfgYojitsuFields.shukeiyoNengetsu.code].value, 'month')) {
                        jissekiUriage += sncLib.util.toInt(mjRow[jissekiUriageKingakuFieldCode].value);
                        jissekiArari += sncLib.util.toInt(mjRow[jissekiArariKingakuFieldCode].value);
                    } else {
                        // 当月のデータの場合
                        // 集計フラグが当月=実績+見込み時
                        if (summaryPattern === summaryPatternToGetsu.JISSEKI_MIKOMI) {
                            // 実績集計期間（至）に値が存在する場合のみ実績に加算
                            if (mjRow[cfgYojitsuFields.jissekiShukeiKikanItaru.code].value) {
                                jissekiUriage += sncLib.util.toInt(mjRow[jissekiUriageKingakuFieldCode].value);
                                jissekiArari += sncLib.util.toInt(mjRow[jissekiArariKingakuFieldCode].value);
                                // 見込みの判定で使用する実績集計期間（至）の値を更新
                                jissekiShukeisumiBi = mjRow[cfgYojitsuFields.jissekiShukeiKikanItaru.code].value;
                            }
                        }
                    }
                }
            }

            // 案件データ
            for (var j = 0; j < ankenData.length; j++) {
                var anRow = ankenData[j];
                var anList = [];

                // 案件用ターゲットコードのフィールドリストより値を取得
                for (var k = 0; k < anTargetFieldList.length; k++) {
                    anList.push(anRow[anTargetFieldList[k]].value);
                }
                var anTargetCode = anList.join('-');
                // 案件管理アプリと予実表示設定アプリの対象コードを比較
                if (anTargetCode === hTargetCode) {

                    // 当月の集計対象が実績＋見込の場合
                    if (summaryPattern === summaryPatternToGetsu.JISSEKI_MIKOMI) {
                        var anTargetDate = anRow[configYojitsu.fields.anken.targetDate].value;
                        // 案件管理アプリの集計対象日と目標実績管理アプリの実績の集計済日付と比較
                        if (anTargetDate > jissekiShukeisumiBi) {
                            mikomiUriage += sncLib.util.toInt(anRow[mikomiUriageKingakuFieldCode].value);
                            mikomiArari += sncLib.util.toInt(anRow[mikomiArariKingakuFieldCode].value);
                        }
                    } else {
                        mikomiUriage += sncLib.util.toInt(anRow[mikomiUriageKingakuFieldCode].value);
                        mikomiArari += sncLib.util.toInt(anRow[mikomiArariKingakuFieldCode].value);
                    }
                }
            }

            // 集計中の拠点＋部署情報と異なる場合
            if (shokeiDispayFlg) {
                // 小計用キーの存在チェック
                if (!checkShokeiKey) {
                    // 存在しない場合、最初のタイトル行を追加
                    yojitsuData.push(createYojitsuData('title', shokeihDisplayName, 0, 0, 0, 0, 0, 0, displayItem, 0));
                }

                // 小計用キーが変更されるタイミングをチェック
                if (checkShokeiKey && checkShokeiKey !== shokeiKey) {
                    // 小計用の行を追加
                    yojitsuData.push(createYojitsuData(dataType.SHOKEI, '小計', sMokuhyoUriage, sMokuhyoArari, sJissekiUriage, sJissekiArari, sMikomiUriage, sMikomiArari, displayItem, 0));
                    // 小計データの初期化
                    sMokuhyoUriage = 0;
                    sJissekiUriage = 0;
                    sMokuhyoArari = 0;
                    sJissekiArari = 0;
                    sMikomiUriage = 0;
                    sMikomiArari = 0;
                    // タイトル行用データ
                    yojitsuData.push(createYojitsuData('title', shokeihDisplayName, 0, 0, 0, 0, 0, 0, displayItem, 0));
                }
            }

            // 予実データの格納
            yojitsuData.push(createYojitsuData(type, hDisplayName, mokuhyoUriage, mokuhyoArari, jissekiUriage, jissekiArari, mikomiUriage, mikomiArari, displayItem, i));
            // 小計を表示する場合
            if (shokeiDispayFlg) {
                checkShokeiKey = shokeiKey;
                //小計を計算
                sMokuhyoUriage += mokuhyoUriage;    // 小計 - 目標売上
                sJissekiUriage += jissekiUriage;    // 小計 - 実績売上
                sMikomiUriage += mikomiUriage;      // 小計 - 見込売上
                sMokuhyoArari += mokuhyoArari;      // 小計 - 目標粗利
                sJissekiArari += jissekiArari;      // 小計 - 実績粗利
                sMikomiArari += mikomiArari;        // 小計 - 見込粗利
            }

            // 総合計を計算
            gMokuhyoUriage += mokuhyoUriage;        // 総合計 - 目標売上
            gJissekiUriage += jissekiUriage;        // 総合計 - 実績売上
            gMikomiUriage += mikomiUriage;          // 総合計 - 見込売上
            gMokuhyoArari += mokuhyoArari;          // 総合計 - 目標粗利
            gJissekiArari += jissekiArari;          // 総合計 - 実績粗利
            gMikomiArari += mikomiArari;            // 総合計 - 見込粗利
        }
        if (shokeiDispayFlg) {
            // 最後の小計
            yojitsuData.push(createYojitsuData(dataType.SHOKEI, '小計', sMokuhyoUriage, sMokuhyoArari, sJissekiUriage, sJissekiArari, sMikomiUriage, sMikomiArari, displayItem, 0));
        }
        // 総合計
        yojitsuData.push(createYojitsuData(dataType.GOKEI, '総合計', gMokuhyoUriage, gMokuhyoArari, gJissekiUriage, gJissekiArari, gMikomiUriage, gMikomiArari, displayItem, 0));
    };

    /**
     * 指定の年月から目標・実績を取得する
     * @param {*} year
     * @param {*} month
     */
    function getMokuhyoJisseki(fromYearMonth, toYearMonth) {

        if (!fromYearMonth || !toYearMonth) {
            return [];
        }

        // 日付項目での検索とするため、'YYYY/MM'から'YYYY-MM-01'とする。
        var fromDate = (fromYearMonth + '/01').replace(/\//g, '-');
        // 末日を設定('YYYY/MM/DD'ではエラーとなるため、'YYYY-MM-DD'とする)
        var toDate = luxon.DateTime.fromSQL((toYearMonth + '/01').replace(/\//g, '-')).endOf('month').toFormat('yyyy-MM-dd');

        // 指定月の目標・実績を取得
        var query = cfgYojitsuFields.shukeiyoNengetsu.code + ' >="' + fromDate + '" and '
            + cfgYojitsuFields.shukeiyoNengetsu.code + ' <= "' + toDate + '" ';

        return sncLib.kintone.rest.getAllRecords(
            config.yojitsu.app,
            query
        );
    };

    /**
     * 案件管理アプリよりレコードを取得
     * @param {*} fromYearMonth
     * @param {*} toYearMonth
     * @param {*} kakudo
     */
    function getAnkenData(fromYearMonth, toYearMonth, kakudo) {

        if (!fromYearMonth || !toYearMonth) {
            return [];
        }

        // 日付項目での検索とするため、'YYYY/MM'から'YYYY-MM-01'とする。
        var fromDate = (fromYearMonth + '/01').replace(/\//g, '-');
        // 末日を設定('YYYY/MM/DD'ではエラーとなるため、'YYYY-MM-DD'とする)
        var toDate = luxon.DateTime.fromSQL((toYearMonth + '/01').replace(/\//g, '-')).endOf('month').toFormat('yyyy-MM-dd');
        var checkedKakudo = '"' + kakudo.join('","') + '"';
        var targetDateCode = configYojitsu.fields.anken.targetDate;
        var kakudoCode = configYojitsu.fields.anken.kakudo;

        // 指定月の目標・実績を取得
        var query = targetDateCode + ' >="' + fromDate + '" and '
            + targetDateCode + ' <= "' + toDate + '" ';
        if (checkedKakudo) {
            // 確度
            query += ' and ' + kakudoCode + ' in (' + checkedKakudo + ') '
        }
        query += ' order by ' + cfgAnkenFields.tantoshaSearch.code + ', ' + targetDateCode;

        return sncLib.kintone.rest.getAllRecords(
            config.anken.app,
            query
        );
    };

    /**
     * 担当者管理アプリよりレコードを取得
     * @returns
     */
    function getTantoshaData() {

        var query = 'order by ' + cfgtantoshaFields.busho.code + ' asc,' + cfgtantoshaFields.kyoten.code + ' asc';
        return sncLib.kintone.rest.getAllRecords(
            config.tantosha.app,
            query
        );
    };

    /**
     * 率を計算
     * @param {*} numerator
     * @param {*} denominater
     * @param {*} opt_digit
     */
    function getRatio(numerator, denominater, opt_digit) {
        var digit = opt_digit || 2;
        var ratio = 0;
        if (denominater) {
            ratio = parseInt(numerator, 10) / parseInt(denominater, 10) * 100;
        }
        ratio = ratio.toFixed(digit);
        ratio += "%";
        return ratio;
    };

    /**
     * 予実データオブジェクトを作成
     * @param {*} type
     * @param {*} targetName
     * @param {*} mokuhyoUriage
     * @param {*} mokuhyoArari
     * @param {*} jissekiUriage
     * @param {*} jissekiArari
     * @param {*} order
     */
    function createYojitsuData(type, targetName, mokuhyoUriage, mokuhyoArari, jissekiUriage, jissekiArari, mikomiUriage, mikomiArari, displayItem, order) {

        var yotatsuritsuUriage = 0;
        var yotatsuritsuArari = 0;
        var tasseiritsuUriage = 0;
        var tasseiritsuArari = 0;
        var mokuhyozanUriage = 0;
        var mokuhyozanArari = 0;

        // 予達率
        yotatsuritsuUriage = getRatio(jissekiUriage, mokuhyoUriage, 1);
        yotatsuritsuArari = getRatio(jissekiArari, mokuhyoArari, 1);

        // 達成率
        tasseiritsuUriage = getRatio(jissekiUriage + mikomiUriage, mokuhyoUriage, 1);
        tasseiritsuArari = getRatio(jissekiArari + mikomiArari, mokuhyoArari, 1);

        // 目標残
        mokuhyozanUriage = mokuhyoUriage - (jissekiUriage + mikomiUriage);
        mokuhyozanArari = mokuhyoArari - (jissekiArari + mikomiArari);

        // 予実情報
        // 目標 売上:粗利
        return {
            // 'yojitsu': {
            'type': type,
            'target': targetName,
            'displayItem': displayItem,
            'data': {
                'mokuhyo': {
                    'uriage': sncLib.util.addComma(mokuhyoUriage),
                    'arari': sncLib.util.addComma(mokuhyoArari),
                },
                'jisseki': {
                    'uriage': sncLib.util.addComma(jissekiUriage),
                    'arari': sncLib.util.addComma(jissekiArari),
                },
                'yotatsuritsu': {
                    'uriage': yotatsuritsuUriage,
                    'arari': yotatsuritsuArari,
                },
                'mikomi': {
                    'uriage': sncLib.util.addComma(mikomiUriage),
                    'arari': sncLib.util.addComma(mikomiArari),
                },
                'jissekiMikomi': {
                    'uriage': sncLib.util.addComma(jissekiUriage + mikomiUriage),
                    'arari': sncLib.util.addComma(jissekiArari + mikomiArari),
                },
                'tasseiritsu': {
                    'uriage': tasseiritsuUriage,
                    'arari': tasseiritsuArari,
                },
                'mokuhyozan': {
                    'uriage': sncLib.util.addComma(mokuhyozanUriage),
                    'arari': sncLib.util.addComma(mokuhyozanArari),
                },
            },
            'order': order
            // }
        }
    };

    /**
     * 表の出力領域の初期化
     */
    function initBody() {
        // 描画領域をクリア
        $('#yojitsu_result_area').find('tbody').empty();
    };

    /**
     * 表のタイトル部を作成
     * @param {*} type
     */
    function createListInfo(type) {

        var listInfoClass = 'list_info_area';
        var tHeader = $('#yojitsu_result_area').find('tbody');
        var title = '';
        if (type === Type.KYOTEN) {
            title = '拠点';
        } else if (type === Type.BUSHO) {
            title = '部署';
        } else if (type === Type.TANTOSHA) {
            title = '担当者';
        }
        $('<div/>', { text: title, 'class': listInfoClass }).appendTo(tHeader);
    };

    /**
     * ヘッダーを作成
     */
    function createHeader() {
        // 行の内容に応じたスタイルを付与する
        var rowClass_row = 'header';
        var tHeader = $('#yojitsu_result_area').find('tbody');
        var tr_Header_row = $('<tr/>', { 'class': rowClass_row });
        $('<td/>', { text: '', 'class': rowClass_row, colspan: 2, rowspan: 1 }).appendTo(tr_Header_row);
        $('<td/>', { text: '目標', 'class': rowClass_row }).appendTo(tr_Header_row);
        $('<td/>', { text: '販売実績', 'class': rowClass_row }).appendTo(tr_Header_row);
        $('<td/>', { text: '予達率', 'class': rowClass_row }).appendTo(tr_Header_row);
        $('<td/>', { text: '見込', 'class': rowClass_row }).appendTo(tr_Header_row);
        $('<td/>', { text: '実績＋見込', 'class': rowClass_row }).appendTo(tr_Header_row);
        $('<td/>', { text: '達成率', 'class': rowClass_row }).appendTo(tr_Header_row);
        $('<td/>', { text: '目標残', 'class': rowClass_row }).appendTo(tr_Header_row);
        // 行追加
        tr_Header_row.appendTo(tHeader);
    };

    /**
     * フッターを作成
     */
    function createFooter() {
        var tFooter = $('#yojitsu_result_area').find('tbody');
        $('<br/>').appendTo(tFooter);
        // $('<br/>').appendTo(tFooter);
    };

    /**
     *予実表のBODY部分を作成
     *
     * @param {*} yojitsuDatas
     * @returns
     */
    function createBody(yojitsuDatas) {
        for (var i = 0; i < yojitsuDatas.length; i++) {
            var rowData = yojitsuDatas[i];
            createYojissekiRow(rowData);
        }
        return;
    };

    /**
     * 予実表の行を生成
     * @param {*} rowData
     */
    function createYojissekiRow(rowData) {
        var nameClass = 'name_cell';
        var uriageClass = 'uriage_cell';
        var arariClass = 'arari_cell';
        var uriageHeaderClass = 'uriage_header_cell' + ' ' + uriageClass;
        var arariHeaderClass = 'arari_header_cell' + ' ' + arariClass;
        var totalKensuClass = 'total_kensu_cell';

        // 行の内容に応じたスタイルを付与する
        var rowClass_row = 'title_row';
        var rowClass_row1 = 'uriage_row';
        var rowClass_row2 = 'arari_row';

        var tBody = $('#yojitsu_result_area').find('tbody');
        var tr_Title = $('<tr/>', { 'class': rowClass_row });
        var tr_Uriage = $('<tr/>', { 'class': rowClass_row1 });
        var tr_Arari = $('<tr/>', { 'class': rowClass_row2 });

        var rowTypeClass = '';
        if (rowData.type === dataType.SHOKEI) {
            rowTypeClass = 'shokei_row';
        } else if (rowData.type === dataType.GOKEI) {
            rowTypeClass = 'gokei_row';
        } else if (rowData.type === 'title') {
            rowTypeClass = 'title_row';
        }

        // クラス追加
        if (rowTypeClass) {
            nameClass += ' ' + rowTypeClass;
            uriageHeaderClass += ' ' + rowTypeClass;
            arariHeaderClass += ' ' + rowTypeClass;
            uriageClass += ' ' + rowTypeClass;
            arariClass += ' ' + rowTypeClass;
        }

        // ヘッダーの列数
        var headerColSpan = 9;
        // ヘッダーの行数
        var headerRowSpan = 1;
        // 行ヘッダーの列数
        var rowHeaderColSpan = 1;
        // 行ヘッダーの行数
        var rowHeaderRowSpan = 2;

        if (rowData.displayItem === displayItem.URIAGE) {
            arariHeaderClass += ' ' + 'row_hide';
            arariClass += ' ' + 'row_hide';
            // 行ヘッダーの行数を変更
            // rowHeaderRowSpan = 1;
        } else if (rowData.displayItem === displayItem.ARARI) {
            uriageHeaderClass += ' ' + 'row_hide';
            uriageClass += ' ' + 'row_hide';
            // 行ヘッダーの行数を変更
            // rowHeaderRowSpan = 1;
        }

        var name = rowData.target;
        var mokuhyoUriage = rowData.data.mokuhyo.uriage;
        var mokuhyoArari = rowData.data.mokuhyo.arari;
        var jissekiUriage = rowData.data.jisseki.uriage;
        var jissekiArari = rowData.data.jisseki.arari;
        var yotatsuritsuUriage = rowData.data.yotatsuritsu.uriage;
        var yotatsuritsuArari = rowData.data.yotatsuritsu.arari;
        var mikomiUriage = rowData.data.mikomi.uriage;
        var mikomiArari = rowData.data.mikomi.arari;
        var jissekiMikomiUriage = rowData.data.jissekiMikomi.uriage;
        var jissekiMikomiArari = rowData.data.jissekiMikomi.arari;
        var tasseiritsuUriage = rowData.data.tasseiritsu.uriage;
        var tasseiritsuArari = rowData.data.tasseiritsu.arari;
        var mokuhyoZanUriage = rowData.data.mokuhyozan.uriage;
        var mokuhyoZanArari = rowData.data.mokuhyozan.arari;
        var tatoshaInfo = rowData.tantosha;

        if (rowData.type === 'title') {
            // 行ヘッダー部
            $('<td/>', { text: name, 'class': nameClass, colspan: headerColSpan, rowspan: headerRowSpan }).appendTo(tr_Title);
            tr_Title.appendTo(tBody);
        } else {

            // 行ヘッダー部
            $('<td/>', { text: name, 'class': nameClass, colspan: rowHeaderColSpan, rowspan: rowHeaderRowSpan }).appendTo(tr_Uriage);
            // $('<td/>', { text: 'Total', 'class': totalKensuClass, rowspan: 2 }).appendTo(tr_Header_row1);

            $('<td/>', { text: '売上', 'class': uriageHeaderClass }).appendTo(tr_Uriage);
            $('<td/>', { text: '粗利', 'class': arariHeaderClass }).appendTo(tr_Arari);


            // Body部
            // 目標
            // 売上
            $('<td/>', { text: mokuhyoUriage, 'class': uriageClass }).appendTo(tr_Uriage);
            // 粗利
            $('<td/>', { text: mokuhyoArari, 'class': arariClass }).appendTo(tr_Arari);

            // 販売実績
            // 売上
            $('<td/>', { text: jissekiUriage, 'class': uriageClass }).appendTo(tr_Uriage);
            // 粗利
            $('<td/>', { text: jissekiArari, 'class': arariClass }).appendTo(tr_Arari);

            // 予達率
            // 売上
            $('<td/>', { text: yotatsuritsuUriage, 'class': uriageClass }).appendTo(tr_Uriage);
            // 粗利
            $('<td/>', { text: yotatsuritsuArari, 'class': arariClass }).appendTo(tr_Arari);

            // 見込
            // 売上
            $('<td/>', { text: mikomiUriage, 'class': uriageClass }).appendTo(tr_Uriage);
            // 粗利
            $('<td/>', { text: mikomiArari, 'class': arariClass }).appendTo(tr_Arari);

            // 実績＋見込
            // 売上
            $('<td/>', { text: jissekiMikomiUriage, 'class': uriageClass }).appendTo(tr_Uriage);
            // 粗利
            $('<td/>', { text: jissekiMikomiArari, 'class': arariClass }).appendTo(tr_Arari);

            // 達成率
            // 売上
            $('<td/>', { text: tasseiritsuUriage, 'class': uriageClass }).appendTo(tr_Uriage);
            // 粗利
            $('<td/>', { text: tasseiritsuArari, 'class': arariClass }).appendTo(tr_Arari);

            // 目標残
            // 売上
            $('<td/>', { text: mokuhyoZanUriage, 'class': uriageClass }).appendTo(tr_Uriage);
            // 粗利
            $('<td/>', { text: mokuhyoZanArari, 'class': arariClass }).appendTo(tr_Arari);

            tr_Uriage.appendTo(tBody);
            tr_Arari.appendTo(tBody);
        }
    };

    /********************************************************
     * 検索表示関連
     *******************************************************/
    /**
     * 年月入力用
     * @param {*} container
     * @param {*} id
     * @param {*} opt_initValue
     */
    function setSearchConditionNengetsu(container, id, dateType, initValueType, labelName, periodStartMonth) {

        var inpDate = document.createElement("input");
        inpDate.type = "text";
        inpDate.id = id;
        inpDate.className = 'input-text-cybozu';

        var div = document.createElement("div");
        div.className = 'input-text-outer-cybozu';
        var label = document.createElement('label');
        label.className = 'search_label';
        label.appendChild(document.createTextNode(labelName));
        div.appendChild(label);
        div.appendChild(inpDate);
        container.appendChild(div);

        $(inpDate/*'#searchCondition-nengetsu'*/).width('100');
        // container.appendChild(inpDate);
        var searchDate = $('#' + id).datepicker({
            format: 'YYYY-MM',
            language: 'ja-JP',
            autoHide: true,
            zIndex: 2048
        });
    };

    /**
     * 年月の初期値を設定
     * @param {*} dateType
     * @param {*} initValueType
     * @param {*} opt_startMonth
     */
    function setInitValueNengetsu(dateType, initValueType, opt_startMonth) {
        var nengetsu = dateTime.toFormat('yyyy-MM');
        var year = dateTime.toFormat('yyyy');
        var month = dateTime.toFormat('M');
        var startMonth = opt_startMonth ? opt_startMonth : 4;

        // startMonthをMMの形に変換
        var dm = luxon.DateTime.fromObject({
            month: startMonth
        });
        startMonth = dm.toFormat('MM');
        var initValue = nengetsu.replace(/\//g, '-');
        var startNengetsu = luxon.DateTime.fromSQL(year + '-' + startMonth + '-01').toFormat('yyyy-MM');

        // 開始年月が現在より未来になっている場合、１年前を開始年月とする
        if (startNengetsu > nengetsu) {
            startNengetsu = luxon.DateTime.fromSQL(startNengetsu + '-01').minus({ years: 1 }).toFormat('yyyy-MM');
        };

        // 年度の開始月を基に、各四半期の開始月、終了月を設定
        var quarter1Start = parseInt(luxon.DateTime.fromSQL(startNengetsu + '-01').toFormat('yyyyMM'));
        var quarter1End = parseInt(luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 2 }).toFormat('yyyyMM'));
        var quarter2Start = parseInt(luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 3 }).toFormat('yyyyMM'));
        var quarter2End = parseInt(luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 5 }).toFormat('yyyyMM'));
        var quarter3Start = parseInt(luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 6 }).toFormat('yyyyMM'));
        var quarter3End = parseInt(luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 8 }).toFormat('yyyyMM'));
        var quarter4Start = parseInt(luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 9 }).toFormat('yyyyMM'));
        var quarter4End = parseInt(luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 11 }).toFormat('yyyyMM'));
        var ym = parseInt(dateTime.toFormat('yyyyMM'));

        switch (initValueType) {
            case '当月':
                initValue = [year, month].join('/');
                break;
            case '四半期':
                if (ym >= quarter1Start && ym <= quarter1End) {
                    if (dateType === 'from') {
                        initValue = startNengetsu;
                    } else {
                        initValue = luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 2 }).toFormat('yyyy/MM');
                    }
                } else if (ym >= quarter2Start && ym <= quarter2End) {
                    if (dateType === 'from') {
                        initValue = luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 3 }).toFormat('yyyy/MM');
                    } else {
                        initValue = luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 5 }).toFormat('yyyy/MM');
                    }
                } else if (ym >= quarter3Start && ym <= quarter3End) {
                    if (dateType === 'from') {
                        initValue = luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 6 }).toFormat('yyyy/MM');
                    } else {
                        initValue = luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 8 }).toFormat('yyyy/MM');
                    }
                } else if (ym >= quarter4Start && ym <= quarter4End) {
                    if (dateType === 'from') {
                        initValue = luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 9 }).toFormat('yyyy/MM');
                    } else {
                        initValue = luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 11 }).toFormat('yyyy/MM');
                    }
                }
                break;
            case '半期':
                if (ym >= quarter1Start && ym <= quarter2End) {
                    if (dateType === 'from') {
                        initValue = startNengetsu;
                    } else {
                        initValue = luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 5 }).toFormat('yyyy/MM');
                    }
                }
                else {
                    if (dateType === 'from') {
                        initValue = luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 6 }).toFormat('yyyy/MM');
                    } else {
                        initValue = luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 11 }).toFormat('yyyy/MM');
                    }
                }
                break;
            case '通期':
                if (dateType === 'from') {
                    initValue = startNengetsu;
                } else {
                    initValue = luxon.DateTime.fromSQL(startNengetsu + '-01').plus({ months: 11 }).toFormat('yyyy/MM');
                }
                break;
            default:
                break;
        }
        return initValue;
    };

    /**
     * 四半期を計算
     * @param {*} month
     * @param {*} start
     */
    function calcQEx(month, start) {
        // startを仮想1月としたら何月になるか
        var index = month - start + (month < start ? 13 : 1);
        return calcQ(index);
    };

    /**
     * 四半期を返す
     * @param {Number} month 月
     * @return {Number} 四半期
     *  1：1月～3月、2：4月～6月、3：7月～9月、4：10月～12月
     */
    function calcQ(month) {
        return parseInt((month - 1) / 3, 10) + 1;
    };

    /**
     * 検索条件表示エリアの生成
     *
     * @param {*} container
     * @param {*} id
     * @param {*} label
     */
    function setSearchConditionHyojiSettei(container, id, label) {
        var item = document.createElement('div');
        item.className = 'item';

        var label = document.createElement('label');
        label.className = 'search_label';
        label.appendChild(document.createTextNode('予実表示設定'));
        item.appendChild(label);

        var outerDiv = document.createElement('div');
        $(outerDiv).addClass('kintoneplugin-select-outer');
        var selectDiv = document.createElement('div');
        $(selectDiv).addClass('kintoneplugin-select');
        outerDiv.appendChild(selectDiv);

        var selElement;
        selElement = document.createElement('select');
        selElement.id = id;
        selElement.name = id;
        selElement.className = 'nok_select';
        selectDiv.appendChild(selElement);


        var div = document.createElement('div');
        div.className = 'select-cybozu';

        var label = document.createElement('label');
        label.className = 'search_label';
        label.appendChild(document.createTextNode('表示項目'));
        div.appendChild(outerDiv);

        // 検索ボタン設置
        var elRunButton = document.createElement('button');
        elRunButton.id = 'nok_yojitsuSetting_button';
        elRunButton.className = 'nok_button_normal nok_padding';
        elRunButton.innerHTML = '予算・実績表設定';
        elRunButton.onclick = function () {
            //yojitsu_search();
            // 別タブで案件アプリの新規追加画面を開く
            // ※ゲストスペース利用時は、パスの変更が必要
            var url = '/k/' + cfgYojitsuSetting.app + '/';
            if (configYojitsu.yojitsuSetting.moveViewID) {
                url += '?view=' + configYojitsu.yojitsuSetting.moveViewID;
            }
            window.open(url, '_blank');
        };

        div.appendChild(elRunButton);

        item.appendChild(div);
        container.appendChild(item);

        getHyojiSetteiFromYojitsuSettei()
            .then(function (results) {
                for (var i = 0; i < results.length; i++) {
                    var option = document.createElement('option');
                    option.setAttribute('value', results[i][cfgYojitsuSettingFields.recordId.code].value);
                    option.innerHTML = results[i][cfgYojitsuSettingFields.hyojimei.code].value;
                    selElement.appendChild(option);

                    hyojiSettei[results[i][cfgYojitsuSettingFields.recordId.code].value] = {};
                    hyojiSettei[results[i][cfgYojitsuSettingFields.recordId.code].value][cfgYojitsuSettingFields.kikan.code] = results[i][cfgYojitsuSettingFields.kikan.code].value;
                    hyojiSettei[results[i][cfgYojitsuSettingFields.recordId.code].value][cfgYojitsuSettingFields.kakudo.code] = results[i][cfgYojitsuSettingFields.kakudo.code].value;
                    hyojiSettei[results[i][cfgYojitsuSettingFields.recordId.code].value][cfgYojitsuSettingFields.uriageArari.code] = results[i][cfgYojitsuSettingFields.uriageArari.code].value;
                    hyojiSettei[results[i][cfgYojitsuSettingFields.recordId.code].value][cfgYojitsuSettingFields.tantoshaTable.code] = results[i][cfgYojitsuSettingFields.tantoshaTable.code].value;
                    hyojiSettei[results[i][cfgYojitsuSettingFields.recordId.code].value][cfgYojitsuSettingFields.bushoTable.code] = results[i][cfgYojitsuSettingFields.bushoTable.code].value;
                    hyojiSettei[results[i][cfgYojitsuSettingFields.recordId.code].value][cfgYojitsuSettingFields.kyotenTable.code] = results[i][cfgYojitsuSettingFields.kyotenTable.code].value;
                }
                return results;
            }).then(function (results) {
                // 拠点データセット後、年月をセットする
                setSearchConditionInitValues(hyojiSettei[results[0][cfgYojitsuSettingFields.recordId.code].value]);
            });

        // ドロップダウン変更時イベント
        selElement.onchange = function () {
            // 初期値を変更する。
            var initValues = hyojiSettei[$(this).val()];
            setSearchConditionInitValues(initValues);
            return;
        };
    };

    /**
     * 検索条件の初期化処理
     * @param {*} initValues
     */
    function setSearchConditionInitValues(initValues) {

        var startMonth = yojitsuConfig.periodStartMonth;

        // 検索条件を表示
        // 年月（From）
        var searchDateFrom = $('#searchCondition-nengetsu-from');
        searchDateFrom.datepicker('setDate', setInitValueNengetsu('from', initValues[cfgYojitsuSettingFields.kikan.code], startMonth));
        // 年月（To）
        var searchDateTo = $('#searchCondition-nengetsu-to');
        searchDateTo.datepicker('setDate', setInitValueNengetsu('to', initValues[cfgYojitsuSettingFields.kikan.code], startMonth));

        // 確度
        var kakudoElements = document.getElementsByName('searchCondition-kakudo');
        var checkedKakudos = initValues[cfgYojitsuSettingFields.kakudo.code];
        for (var i = 0; i < kakudoElements.length; i++) {
            // 初期値用の配列内とチェックボックスの値が存在する場合、チェックを入れる
            if (checkedKakudos.indexOf(kakudoElements[i].value) >= 0) {
                kakudoElements[i].checked = true;
            } else {
                kakudoElements[i].checked = false;
            }
        }

        // 売上/粗利
        var uriageArariElements = document.getElementsByName('searchCondition-uriage_arari');
        var selectedUriageArari = initValues[cfgYojitsuSettingFields.uriageArari.code];
        for (var i = 0; i < uriageArariElements.length; i++) {
            if (selectedUriageArari === uriageArariElements[i].value) {
                uriageArariElements[i].checked = true;
                break;
            }
        }
    };

    /**
     * 予実設定管理より、ログインユーザー毎の表示設定を取得
     */
    function getHyojiSetteiFromYojitsuSettei() {

        var loginUser = kintone.getLoginUser();
        // レコード取得用クエリを作成
        var query = cfgYojitsuSettingFields.accountId.code + ' in ("' + loginUser.code + '") '
            + 'order by ' + cfgYojitsuSettingFields.hyojijun.code + ' asc';;

        return sncLib.kintone.rest.getAllRecords(
            config.yojitsuSetting.app,
            query
        );
    };

    /**
     * アプリのフィールド情報を取得
     * @param {*} appId
     */
    function getKintoneAppFormFields(appId) {
        return sncLib.kintone.rest.getAppFormFields(
            appId
        );
    };

    /**
     * チェックボックス生成
     * @param {*} container
     * @param {*} id
     * @param {*} values
     * @param {*} labelName
     */
    function setSearchConditionCheckBox(container, id, values, labelName) {

        var item = document.createElement("div");
        item.className = 'item';

        var label = document.createElement('label');
        label.className = 'search_label';
        label.appendChild(document.createTextNode(labelName));
        item.appendChild(label);

        var div = document.createElement("div");
        div.className = 'input-checkbox-cybozu';

        values.forEach(
            function (value, index) {
                // 入力項目
                var inpCheck = document.createElement("input");
                inpCheck.type = "checkbox";
                inpCheck.id = id + '_' + index;
                inpCheck.name = id;
                inpCheck.value = value;
                // ラベル
                var label = document.createElement('label');
                label.htmlFor = id + '_' + index;
                label.appendChild(document.createTextNode(value));

                var span = document.createElement('span');
                span.className = 'input-checkbox-item-cybozu';
                span.appendChild(inpCheck);
                span.appendChild(label);
                div.appendChild(span);
            }
        );
        item.appendChild(div);
        container.appendChild(item);
    };

    /**
     * ラジオボタン生成
     * @param {*} container
     * @param {*} id
     * @param {*} values
     * @param {*} labelName
     */
    function setSearchConditionRadio(container, id, values, labelName) {
        var item = document.createElement("div");
        item.className = 'item';

        var label = document.createElement('label');
        label.className = 'search_label';
        label.appendChild(document.createTextNode(labelName));
        item.appendChild(label);

        var div = document.createElement("div");
        div.className = 'input-radio-cybozu' + ' ' + 'inputs';

        values.forEach(
            function (value, index) {

                // 入力項目
                var inpCheck = document.createElement("input");
                inpCheck.type = "radio";
                inpCheck.id = id + '_' + index;
                inpCheck.name = id;
                inpCheck.value = value;

                // ラベル
                var label = document.createElement('label');
                label.htmlFor = id + '_' + index;
                label.appendChild(document.createTextNode(value));

                var span = document.createElement('span');
                span.className = 'input-radio-item-cybozu';
                span.appendChild(inpCheck);
                span.appendChild(label);
                div.appendChild(span);
            }
        );
        item.appendChild(div);
        container.appendChild(item);
    };

    kintone.events.on([
        'app.record.index.show'
    ], function (event) {

        // return event;
        // ビューIDを指定する（指定したビューID以外は処理しない）
        // ビュー チェック
        if (configYojitsu.targetViewIds.indexOf(event.viewId) === -1) {
            return event;
        }
        var records = event.records;
        // カスタマイズビュー設定時に登録したHTMLの要素を指定します。
        var container = document.getElementById('yojitsu_search_item_area');
        // 初期化
        container.innerHTML = '';
        var elBr = document.createElement('br');

        // 検索条件を表示する
        kintone.Promise.all([
            getKintoneAppFormFields(config.yojitsuSetting.app),
            getHyojiSetteiFromYojitsuSettei()
        ]).then(function (results) {
            // console.log(results);

            return new kintone.Promise(function (resolve, reject) {
                var formFields = results[0];
                var yojitsuSetteiValues = results[1];

                if (Object.keys(formFields).length > 0
                    && yojitsuSetteiValues.length > 0) {
                    var initValues = yojitsuSetteiValues[0];
                    var kikan = initValues[cfgYojitsuSettingFields.kikan.code].value;
                    // var kakudos = initValues[cfgYojitsuSettingFields.kakudo.code].value;
                    // var uriageArari = initValues[cfgYojitsuSettingFields.uriageArari.code].value;

                    // フィールドの選択肢を昇順に並べて配列へ
                    var kakudosOptions = [];
                    sncLib.kintone.util.getFieldOptionData(formFields.properties[cfgYojitsuSettingFields.kakudo.code].options, 'index', 'asc', function (new_data) {
                        // 配列へセット
                        kakudosOptions = new_data;
                    });

                    // フィールドの選択肢を昇順に並べて配列へ
                    var uriageArariOptions = [];
                    sncLib.kintone.util.getFieldOptionData(formFields.properties[cfgYojitsuSettingFields.uriageArari.code].options, 'index', 'asc', function (new_data) {
                        // 配列へセット
                        uriageArariOptions = new_data;
                    });

                    // 表示設定
                    // データ取得処理が非同期処理のため、最後に表示される
                    setSearchConditionHyojiSettei(container, 'searchCondition-hyojiSettei');

                    // 検索条件を表示
                    var item = document.createElement("div");
                    item.className = 'item';

                    var label = document.createElement('label');
                    label.className = 'search_label';
                    label.appendChild(document.createTextNode('期間'));
                    item.appendChild(label);

                    // 年月（From）
                    var elNengetsuFrom = setSearchConditionNengetsu(container, 'searchCondition-nengetsu-from', 'from', kikan, '期間', yojitsuConfig.periodStartMonth);
                    // 年月（To）
                    var elNengetsuTo = setSearchConditionNengetsu(container, 'searchCondition-nengetsu-to', 'to', kikan, '　~', yojitsuConfig.periodStartMonth);
                    // 確度（チェックボックス）
                    var elKakudoCheck = setSearchConditionCheckBox(container, configYojitsu.searchItems.kakudo.id, kakudosOptions, /*kakudos,*/ configYojitsu.searchItems.kakudo.label);
                    // 売上/粗利（ラジオボタン）
                    var elUriageArariRadio = setSearchConditionRadio(container, configYojitsu.searchItems.uriageArari.id, uriageArariOptions, /*uriageArari,*/ configYojitsu.searchItems.uriageArari.label);
                    // 検索ボタン設置
                    var elRunButton = document.createElement('button');
                    elRunButton.id = 'nok_search_button';
                    elRunButton.className = 'nok_button_normal';
                    elRunButton.innerHTML = '検索';
                    elRunButton.onclick = function () {
                        yojitsu_search();
                    };
                    container.appendChild(elRunButton);
                }
                resolve(event);
            });
        }).then(function (event) {
            return event
        });

    });
})(jQuery, window.nokConfig, window.yojitsuConfig, window.snc);
