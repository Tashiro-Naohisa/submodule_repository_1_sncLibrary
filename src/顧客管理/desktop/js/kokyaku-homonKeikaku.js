/**
 * @fileoverview 顧客管理アプリ 訪問計画
 *【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * luxon.min.js -v3.1.1
 * https://js.cybozu.com/font-awesome/v5.15.4/js/all.min.js
 * snc.kintone.min.js -v1.0.8
 * config.nok.js -v4.0.1
 *
 * [CSS]
 * https://js.cybozu.com/font-awesome/v5.15.4/css/fontawesome.min.css
 * homonKeikaku.css
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
(function ($, config, configHomonKeikaku, sncLib) {
    'use strict';

    const dateTime = luxon.DateTime.local();

    const cfgKokyaku = config.kokyaku;
    const cfgKokyakuFields = config.kokyaku.fields;
    const cfgEigyoRepoto = config.eigyoRepoto;
    const cfgEigyoRepotoFields = config.eigyoRepoto.fields;
    const cfgHoliday = config.holiday;
    const cfgHolidayFields = config.holiday.fields;
    const cfgHomonKeikakuHeader = configHomonKeikaku.headerItems;
    const cfgHomonKeikakuCellColor = configHomonKeikaku.cellColor;
    const cfgHomonKeikakuDayColor = configHomonKeikaku.dayColor;
    const cfgHomonKeikakuCalendarSetting = configHomonKeikaku.calendarSetting;

    // 登録するセルの数
    let postCount = 0;
    // 削除するセルの数
    let deleteCount = 0;
    // 月送りカウンタ
    let preMonthCount = 0;
    let nextMonthCount = 0;

    // configの月初or当日表示のFlag
    let displayDayFlag = cfgHomonKeikakuCalendarSetting.startingToday;

    // レコード一覧画面の表示後イベント
    kintone.events.on([
        'app.record.index.show'
    ], function (event) {
        // ビュー チェック
        if (configHomonKeikaku.targetViewIds.indexOf(event.viewId) === -1) {
            return event;
        }

        if (document.getElementById('hk_button') === null) {
            // 保存ボタン
            let submitButton = document.createElement('button');
            submitButton.id = 'hk_button';
            submitButton.className = 'submitButton';
            submitButton.innerText = '保存';
            submitButton.style.cssText = 'margin-left: 20px'
            submitButton.onclick = function () {
                nippoCreate();
            };
            kintone.app.getHeaderMenuSpaceElement().appendChild(submitButton);
        }
        // 現在年月日取得
        let now = new Date();
        let today = dateTime.toFormat('yyyy-MM-dd');

        // ボタン格納場所取得
        let hkHeaderSpace = kintone.app.getHeaderSpaceElement();

        if (document.getElementById('nextButton') === null && document.getElementById('preButton') === null && document.getElementById('monthArea')) {

            // 月表示
            let monthArea = document.createElement('span');
            monthArea.id = 'monthArea';
            monthArea.className = 'headerArea';

            // 先月ボタン設置
            let preMonthBtn = document.createElement('button');
            preMonthBtn.id = 'preButton';
            preMonthBtn.className = 'monthArea';
            preMonthBtn.title = '前';
            let preIElement = document.createElement('i');
            preIElement.className = 'fa fa-chevron-left';
            preMonthBtn.onclick = function () {
                // 連続クリック防止
                preMonthBtn.disabled = true;
                preMonthCount--;
                // チェック状況取得
                let checkCount = checkMethod(postCount, deleteCount);
                let monthCount = checkMethod(nextMonthCount, preMonthCount);
                let baseDate = getBaseDate(today, monthCount);
                if (checkCount === 0) {
                    resetRow();
                    // テーブル描画処理
                    createSchedule(baseDate, today, displayDayFlag);
                } else {
                    Swal.fire({
                        text: '画面を切り替えると編集内容が失われます。\n保存する場合は、キャンセル後、保存ボタンを押してください。',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3498db',
                        cancelButtonColor: '#aaa',
                        confirmButtonText: 'OK',
                        cancelButtonText: 'キャンセル'
                    }).then(function (result) {
                        if (result.value) {
                            // 登録件数、削除件数削除
                            postCount = 0;
                            deleteCount = 0;
                            resetRow();
                            createSchedule(baseDate, today, displayDayFlag);
                        } else {
                            preMonthCount++;
                            preMonthBtn.disabled = false;
                        }
                    });
                }
                return event;
            };

            // 翌月ボタン設置
            let nextMonthBtn = document.createElement('button');
            nextMonthBtn.id = 'nextButton';
            nextMonthBtn.className = 'monthArea';
            nextMonthBtn.title = '次';
            let nextIElement = document.createElement('i');
            nextIElement.className = 'fa fa-chevron-right';
            nextMonthBtn.onclick = function () {
                // 連続クリック防止
                nextMonthBtn.disabled = true;
                nextMonthCount++;
                // チェック状況取得
                let checkCount = checkMethod(postCount, deleteCount);
                let monthCount = checkMethod(nextMonthCount, preMonthCount);
                let baseDate = getBaseDate(today, monthCount);
                if (checkCount === 0) {
                    resetRow();
                    // テーブル描画処理
                    createSchedule(baseDate, today, displayDayFlag);
                } else {
                    Swal.fire({
                        text: '画面を切り替えると編集内容が失われます。\n保存する場合は、キャンセル後、保存ボタンを押してください。',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3498db',
                        cancelButtonColor: '#aaa',
                        confirmButtonText: 'OK',
                        cancelButtonText: 'キャンセル'
                    }).then(function (result) {
                        if (result.value) {
                            // 登録件数、削除件数削除
                            postCount = 0;
                            deleteCount = 0;
                            resetRow();
                            createSchedule(baseDate, today, displayDayFlag);
                        } else {
                            nextMonthCount--;
                            nextMonthBtn.disabled = false;
                        }
                    });
                }
                return event;
            };

            let divEl = document.createElement('div');
            divEl.className = 'monthArea';
            preMonthBtn.appendChild(preIElement);
            nextMonthBtn.appendChild(nextIElement);
            divEl.appendChild(preMonthBtn);
            divEl.appendChild(monthArea);
            divEl.appendChild(nextMonthBtn);

            // ノード設定
            hkHeaderSpace.appendChild(divEl);
        }

        // 操作説明表示
        if (document.getElementById('setsumei') === null) {
            let divElement = document.createElement('div');
            divElement.id = 'setsumei';
            // 説明文作成処理
            createDescription(cfgHomonKeikakuCellColor.yoteiBefore.color, cfgHomonKeikakuCellColor.yoteiBefore.description, divElement);
            createDescription(cfgHomonKeikakuCellColor.yoteiAfter.color, cfgHomonKeikakuCellColor.yoteiAfter.description, divElement);
            createDescription(cfgHomonKeikakuCellColor.delete.color, cfgHomonKeikakuCellColor.delete.description, divElement);
            createDescription(cfgHomonKeikakuCellColor.jisseki.color, cfgHomonKeikakuCellColor.jisseki.description, divElement);
            divElement.style.width = '100%';
            divElement.style.position = 'relative';
            divElement.style.left = '10px';
            divElement.style.top = '20px';
            hkHeaderSpace.appendChild(divElement);
        }

        // 画面リロード時初期化
        let monthCount = checkMethod(nextMonthCount, preMonthCount);
        let baseDate = getBaseDate(today, monthCount);
        postCount = 0;
        deleteCount = 0;
        resetRow();
        createSchedule(baseDate, today, displayDayFlag);

        return event;
    });

    //以下処理関数
    /*----------------------------------------------------------------------------------------------------------------------*/

    /**
     * スケジュールのセル選択をカウントする関数
     * @returns
     */
    function checkMethod(addCount, subtractCount) {
        let checkCount = addCount + subtractCount;
        return checkCount;
    };

    /**
     * 基準日取得関数
     * @param {*} today
     * @param {*} monthCount
     */
    function getBaseDate(today, monthCount) {
        let baseDate;
        if (monthCount === 0) {
            baseDate = today;
            preMonthCount = 0;
            nextMonthCount = 0;
        } else {
            baseDate = luxon.DateTime.fromSQL(today).plus({ months: monthCount }).toFormat('yyyy-MM-dd');
        }
        return baseDate;
    };

    /**
     * 説明文作成処理関数
     * @param {*} color config.kokyaku-homonKeikakuのcellColorのcolor
     * @param {*} description config.kokyaku-homonKeikakuのcellColorのdescription
     * @param {*} divElement 対象の要素
     */
    function createDescription(color, description, divElement) {
        let colorSpanElement = document.createElement('span');
        colorSpanElement.innerText = ' ■';
        colorSpanElement.style.color = color;
        let descriptionSpanElement = document.createElement('span');
        descriptionSpanElement.innerText = description;
        descriptionSpanElement.style.color = 'black';
        divElement.appendChild(colorSpanElement);
        divElement.appendChild(descriptionSpanElement);
    };

    /**
     * テーブル初期化関数
     */
    function resetRow() {
        // 見出し初期化
        let midashiId = document.getElementById('hk_head');
        midashiId.innerHTML = '';
        // レコード初期化
        let hkRecord = document.getElementById('hk_tbody');
        hkRecord.innerHTML = '';
    };

    /**
     * スケジュール作成関数
     * @param {*} baseDate 基準日
     * @param {*} today 今日
     * @returns
     */
    function createSchedule(baseDate, today, displayDayFlag) {
        let baseDateResetTime = luxon.DateTime.fromSQL(baseDate);

        // 月初を取得
        let startMonthDate = luxon.DateTime.fromSQL(baseDate).startOf('month').toFormat('yyyy-MM-dd');
        let startMonthDateResetTime = luxon.DateTime.fromSQL(startMonthDate);

        // 月末を取得
        let lastMonthDate = luxon.DateTime.fromSQL(startMonthDate).plus({ months: 1 }).toFormat('yyyy-MM-dd');
        let lastMonthDateResetTime = luxon.DateTime.fromSQL(lastMonthDate);

        // 基準日から一ヶ月後の日付取得
        let laterMonthDate = luxon.DateTime.fromSQL(baseDate).plus({ months: 1 }).toFormat('yyyy-MM-dd');
        let laterMonthDateResetTime = luxon.DateTime.fromSQL(laterMonthDate);

        // 1ヶ月の日数を取得
        let lastDateCount;
        if (displayDayFlag !== false) {
            var DateCount = laterMonthDateResetTime.diff(baseDateResetTime, 'days');
            lastDateCount = DateCount.days;
        } else {
            var DateCount = lastMonthDateResetTime.diff(startMonthDateResetTime, 'days');
            lastDateCount = DateCount.days;
        }

        // 月送り年月のヘッダーの作成
        // 年月の取得
        let headerFirstDate = baseDateResetTime.toFormat('yyyy-MM');
        let headerLastDate = laterMonthDateResetTime.toFormat('yyyy-MM');

        // 表示範囲が同月なら一つの月のみ表示
        if (headerFirstDate === headerLastDate || displayDayFlag !== true) {
            document.getElementById('monthArea').innerHTML = headerFirstDate;
        } else {
            document.getElementById('monthArea').innerHTML = headerFirstDate + ' ～ ' + headerLastDate;
        }

        // スケジュールヘッダー要素作成（固定）
        let midashiSpace = document.getElementById('hk_head');
        let tr = document.createElement('tr');
        tr.id = 'hkmidashiTr';
        midashiSpace.appendChild(tr);

        // アプリIdの取得
        let appId = kintone.app.getId();
        // 現在の検索クエリ
        let currentQuery = kintone.app.getQuery();
        let orderNum = currentQuery.indexOf('order');
        let correctQuery = currentQuery.substring(0, orderNum);
        let sortQuery = currentQuery.slice(orderNum);
        let result = sortQuery.split(/,|\s/);
        let removeValue = ['', 'order', 'by']
        result = result.filter(function (value) {
            return !removeValue.includes(value);
        });
        let add_Query = '';
        // ソート条件のデータ作成
        let sortConditions = [];
        for (let i = 0; i < result.length; i++) {
            let sortItem = {};
            if (i % 2 === 0) {
                sortItem = {
                    'code': result[i],
                    'order': result[i + 1]
                }
                sortConditions.push(sortItem);
            }
        }
        // 絞込み条件に対応するクエリの生成
        if (correctQuery) {
            add_Query = 'and ' + correctQuery;
        }
        let kokyakuQuery = cfgKokyakuFields.tantoshaId.code + ' = "' + kintone.getLoginUser().code + '" ' + add_Query;

        let kokyakuRecords = [];

        // データの追加取得と表示
        return new kintone.Promise(function (resolve, reject) {
            resolve(sncLib.kintone.rest.getAllRecordsWithSortConditions(appId, kokyakuQuery, sortConditions));
        }).then(function (resp) {
            kokyakuRecords = resp;
            // ボタン格納場所取得
            let hkHeaderSpace = kintone.app.getHeaderSpaceElement();
            // 顧客件数表示
            if (document.getElementById('kokyakuKensu') === null) {
                let kensuDivEl = document.createElement('div');
                kensuDivEl.style.width = '100%';
                kensuDivEl.style.textAlign = 'right';
                kensuDivEl.style.color = 'black';
                kensuDivEl.style.position = 'relative';
                kensuDivEl.style.right = '40px';
                kensuDivEl.id = 'kokyakuKensu';
                kensuDivEl.innerText = kokyakuRecords.length + '件';
                hkHeaderSpace.appendChild(kensuDivEl);
            }
            //日付の祝日・休日設定
            // 祝日・休日アプリのアプリID
            let holidayQuery = '';
            if (displayDayFlag !== false) {
                holidayQuery = cfgHolidayFields.hiduke.code + ' >= "' + baseDate
                    + '" and ' + cfgHolidayFields.hiduke.code + ' <= "' + laterMonthDate + '"';
            } else {
                holidayQuery = cfgHolidayFields.hiduke.code + ' >= "' + startMonthDate
                    + '" and ' + cfgHolidayFields.hiduke.code + ' <= "' + lastMonthDate + '"';
            }
            const holidayBody = {
                'app': cfgHoliday.app,
                'query': holidayQuery,
                'fields': [cfgHolidayFields.hiduke.code]
            }
            // 祝日・休日アプリから休日を取得
            return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', holidayBody);
        }).then(function (holidayResp) {
            // ヘッダー項目作成
            for (let i = 0; i <= cfgHomonKeikakuHeader.length; i++) {
                let midashi = document.createElement('th');
                midashi.className = 'hk_midashi';
                if (i === 0) {
                    midashi.innerHTML = '';
                    midashi.style.cssText = 'width : 2.5%;'
                } else {
                    midashi.innerHTML = cfgHomonKeikakuHeader[i - 1].label;
                    midashi.style.cssText = cfgHomonKeikakuHeader[i - 1].css
                }
                tr.appendChild(midashi);
            }
            // 日付見出し格納
            let holidayArray = [];
            for (let i = 0; i < holidayResp.records.length; i++) {
                holidayArray.push(holidayResp.records[i][cfgHolidayFields.hiduke.code].value);
            }
            // 月末までの見出しを設定
            for (let j = 0; j < lastDateCount; j++) {
                let midashiDate = document.createElement('th');
                midashiDate.innerHTML = luxon.DateTime.fromSQL(displayDayFlag !== false ? baseDate : startMonthDate).plus({ days: j }).toFormat('dd');
                let checkDate = luxon.DateTime.fromSQL(displayDayFlag !== false ? baseDate : startMonthDate).plus({ days: j });
                let checkDay = checkDate.weekday;
                let checkHoliday = checkDate.toFormat('yyyy-MM-dd');

                let holiday = holidayArray.includes(checkHoliday);
                // カレンダーの曜日で色分け
                if (checkHoliday === today) {
                    midashiDate.className = 'today';
                    midashiDate.style.backgroundColor = cfgHomonKeikakuDayColor.today;
                } else if (checkDay === 6) {
                    midashiDate.className = 'saturday';
                    midashiDate.style.backgroundColor = cfgHomonKeikakuDayColor.saturday;
                    // } else if (checkDay === 0) {
                } else if (checkDay === 7) {
                    midashiDate.className = 'sunday';
                    midashiDate.style.backgroundColor = cfgHomonKeikakuDayColor.sunday;
                } else if (holiday) {
                    midashiDate.className = 'holiday';
                    midashiDate.style.backgroundColor = cfgHomonKeikakuDayColor.holiday;
                } else {
                    midashiDate.className = 'weekday';
                    midashiDate.style.backgroundColor = cfgHomonKeikakuDayColor.weekday;
                }
                tr.appendChild(midashiDate);
            }

            let eigyoNippoQuery = '';
            if (!displayDayFlag) {
                eigyoNippoQuery = cfgEigyoRepotoFields.tantoshaId.code + ' = "' + kintone.getLoginUser().code
                    + '" and ' + cfgEigyoRepotoFields.katsudobi.code + ' >= "' + startMonthDate
                    + '" and ' + cfgEigyoRepotoFields.katsudobi.code + ' < "' + lastMonthDate + '" ';
            } else {
                // 営業報告活動アプリデータ取得(基準月から一ヶ月後を対象)
                eigyoNippoQuery = cfgEigyoRepotoFields.tantoshaId.code + ' = "' + kintone.getLoginUser().code
                    + '" and ' + cfgEigyoRepotoFields.katsudobi.code + ' >= "' + baseDate
                    + '" and ' + cfgEigyoRepotoFields.katsudobi.code + ' < "' + laterMonthDate + '" ';
            }

            // スケジュールセル作成
            return sncLib.kintone.rest.getAllRecordsOnRecordId(cfgEigyoRepoto.app, eigyoNippoQuery);

        }).then(function (eigyoNippoResp) {
            let hkRecordSpace = document.getElementById('hk_tbody');
            // 顧客情報がある場合
            if (kokyakuRecords.length > 0) {
                // 顧客情報の数レコード作成
                for (let j = 0; j < kokyakuRecords.length; j++) {
                    let record = kokyakuRecords[j];
                    let row = hkRecordSpace.insertRow(hkRecordSpace.rows.length);
                    // 項目分のcellに値埋め込む
                    for (let k = 0; k <= cfgHomonKeikakuHeader.length; k++) {
                        let cell = row.insertCell(k);
                        cell.className = 'hk_color';
                        //列の一番初めは詳細画面に遷移できるリンクを張り付ける
                        if (k === 0) {
                            let defaultUrl = kintone.api.url('/k/v1/records.json');
                            defaultUrl = defaultUrl.replace('v1/records.json', '');
                            let url = defaultUrl + kintone.app.getId() + '/show#record=' + record.$id.value;
                            // 詳細画面に遷移する要素を作成
                            let aElement = document.createElement('a');
                            aElement.href = url;
                            aElement.target = '_blank';
                            aElement.title = 'レコードの詳細を表示する';
                            let iElement = document.createElement('i');
                            iElement.className = 'fa fa-file';
                            aElement.appendChild(iElement);
                            cell.appendChild(aElement);
                            cell.style.cssText = 'width : 2.5%;'
                        } else {
                            if (record[cfgHomonKeikakuHeader[k - 1].code] === undefined) {
                                cell.innerHTML = 'フィールドが存在しません。';
                                cell.style.cssText = cfgHomonKeikakuHeader[k - 1].css;
                            } else {
                                cell.innerHTML = record[cfgHomonKeikakuHeader[k - 1].code].value;
                                cell.style.cssText = cfgHomonKeikakuHeader[k - 1].css;
                            }
                        }
                    }
                    // 顧客名検索コード取得
                    let kokyakuKokyakuId = record[cfgKokyakuFields.kokyakuId.code].value;
                    // 担当者コード取得
                    let tantoshaId = record[cfgKokyakuFields.tantoshaId.code].value;
                    // 担当者検索コード
                    let tantoshaSearch = record[cfgKokyakuFields.tantoshaSearch.code].value;

                    // 活動日取得用配列作成
                    let katsudobiPast = {};
                    let katsudobiYoteiFuture = {};
                    let katsudobiJissekiFuture = {};

                    //顧客ごとの営業の活動日のみ取得
                    for (let k = 0; k < eigyoNippoResp.length; k++) {
                        let eigyoKokyakuId = eigyoNippoResp[k][cfgEigyoRepotoFields.kokyakuId.code].value;
                        let katsudobi = eigyoNippoResp[k][cfgEigyoRepotoFields.katsudobi.code].value;
                        let yoteiJisseki = eigyoNippoResp[k][cfgEigyoRepotoFields.yoteiJisseki.code].value;
                        // 今日より過去の場合、実績のみ抽出
                        if (katsudobi < today && yoteiJisseki === '実績') {
                            getKatsudobi(katsudobiPast, eigyoKokyakuId, katsudobi);
                        }
                        if (today <= katsudobi && yoteiJisseki === '予定') {
                            getKatsudobi(katsudobiYoteiFuture, eigyoKokyakuId, katsudobi);

                        }
                        if (today === katsudobi && yoteiJisseki === '実績') {
                            getKatsudobi(katsudobiJissekiFuture, eigyoKokyakuId, katsudobi);
                        }
                    }

                    // 営業報告データがない場合
                    if (eigyoNippoResp.length === 0) {
                        // 日付(1ヶ月分)のセル作成 idとclick時の処理をcellに埋め込む
                        for (let l = 1; l <= lastDateCount; l++) {
                            let cell = row.insertCell(l + cfgHomonKeikakuHeader.length);
                            // セルの表示日付の取得
                            let cellDate = luxon.DateTime.fromSQL(displayDayFlag !== false ? baseDate : startMonthDate).plus({ days: l - 1 }).toFormat('yyyy-MM-dd');
                            // セルにデータ属性を追加
                            cell.dataset.date = cellDate; // 日付
                            cell.dataset.kokyakuId = kokyakuKokyakuId; // 顧客ID
                            cell.dataset.tantoshaId = tantoshaId; // 担当者ID
                            cell.dataset.tantoshaSearchCode = tantoshaSearch; // 担当者検索コード
                            cell.onclick = function () {
                                changeColor(this);
                            }
                        }
                    } else {
                        // 営業報告データがある場合
                        for (let l = 1; l <= lastDateCount; l++) {
                            let cell = row.insertCell(l + cfgHomonKeikakuHeader.length);
                            // セルの日付
                            let cellDate = luxon.DateTime.fromSQL(displayDayFlag !== false ? baseDate : startMonthDate).plus({ days: l - 1 }).toFormat('yyyy-MM-dd');
                            // 今日より過去か今日か未来かで判定
                            if (cellDate < today) {
                                // 活動実績があれば色付
                                if (Object.keys(katsudobiPast).length > 0) {
                                    // 過去の実績に対象の顧客があるか確認
                                    if (katsudobiPast[kokyakuKokyakuId]) {
                                        let eigyoKatsudobi = katsudobiPast[kokyakuKokyakuId];
                                        // 活動日の実績の値とセルの列の値が一致すればセルの色付け
                                        if (eigyoKatsudobi.indexOf(cellDate) !== -1) {
                                            cell.style.backgroundColor = cfgHomonKeikakuCellColor.jisseki.color;
                                        }
                                    }
                                }
                            } else if (cellDate === today) {
                                //今日の実績があるか確認
                                if (Object.keys(katsudobiJissekiFuture).length > 0) {
                                    if (katsudobiJissekiFuture[kokyakuKokyakuId]) {
                                        let eigyoKatsudobi = katsudobiJissekiFuture[kokyakuKokyakuId];
                                        // 活動日の実績が今日のがあれば色付け
                                        if (eigyoKatsudobi.indexOf(cellDate) !== -1) {
                                            cell.style.backgroundColor = cfgHomonKeikakuCellColor.jisseki.color;
                                        }
                                    } else if (Object.keys(katsudobiYoteiFuture).length > 0) {
                                        // セルにデータ属性を追加
                                        cell.dataset.date = cellDate; // 日付
                                        cell.dataset.kokyakuId = kokyakuKokyakuId; // 顧客ID
                                        cell.dataset.tantoshaId = tantoshaId; // 担当者ID
                                        cell.dataset.tantoshaSearchCode = tantoshaSearch; // 担当者検索コード
                                        cell.onclick = function () {
                                            changeColor(this);
                                        }
                                        // 予定の色、idを設定
                                        setCellYotei(katsudobiYoteiFuture, cell, cellDate, eigyoNippoResp, kokyakuKokyakuId, tantoshaId, tantoshaSearch, cfgHomonKeikakuCellColor.yoteiAfter.color);
                                    } else {
                                        // セルにデータ属性を追加
                                        cell.dataset.date = cellDate; // 日付
                                        cell.dataset.kokyakuId = kokyakuKokyakuId; // 顧客ID
                                        cell.dataset.tantoshaId = tantoshaId; // 担当者ID
                                        cell.dataset.tantoshaSearchCode = tantoshaSearch; // 担当者検索コード
                                        cell.onclick = function () {
                                            changeColor(this);
                                        }
                                    }
                                } else if (Object.keys(katsudobiYoteiFuture).length > 0) {
                                    // セルにデータ属性を追加
                                    cell.dataset.date = cellDate; // 日付
                                    cell.dataset.kokyakuId = kokyakuKokyakuId; // 顧客ID
                                    cell.dataset.tantoshaId = tantoshaId; // 担当者ID
                                    cell.dataset.tantoshaSearchCode = tantoshaSearch; // 担当者検索コード
                                    cell.onclick = function () {
                                        changeColor(this);
                                    }
                                    setCellYotei(katsudobiYoteiFuture, cell, cellDate, eigyoNippoResp, kokyakuKokyakuId, tantoshaId, tantoshaSearch, cfgHomonKeikakuCellColor.yoteiAfter.color);
                                } else {
                                    // セルにデータ属性を追加
                                    cell.dataset.date = cellDate; // 日付
                                    cell.dataset.kokyakuId = kokyakuKokyakuId; // 顧客ID
                                    cell.dataset.tantoshaId = tantoshaId; // 担当者ID
                                    cell.dataset.tantoshaSearchCode = tantoshaSearch; // 担当者検索コード
                                    cell.onclick = function () {
                                        changeColor(this);
                                    }
                                }
                            } else if (cellDate > today) {
                                // 今日より未来は予定のみカウント
                                // セルにデータ属性を追加
                                cell.dataset.date = cellDate; // 日付
                                cell.dataset.kokyakuId = kokyakuKokyakuId; // 顧客ID
                                cell.dataset.tantoshaId = tantoshaId; // 担当者ID
                                cell.dataset.tantoshaSearchCode = tantoshaSearch; // 担当者検索コード
                                cell.onclick = function () {
                                    changeColor(this);
                                }
                                // 活動日が未来で予定があれば
                                if (Object.keys(katsudobiYoteiFuture).length > 0) {
                                    setCellYotei(katsudobiYoteiFuture, cell, cellDate, eigyoNippoResp, kokyakuKokyakuId, tantoshaId, tantoshaSearch, cfgHomonKeikakuCellColor.yoteiAfter.color);
                                }
                            }
                        }
                    }
                }
            }
            return;
        }).then(function (resp) {
            // 連続クリック防止
            let nextButton = document.getElementById('nextButton');
            nextButton.disabled = false;
            let preButton = document.getElementById('preButton');
            preButton.disabled = false;
            return;
        }).catch(function (err) {
            console.log(err);
            return;
        });
    };

    /**
     * セルの判別処理
     * @param {*} Cell セル情報
     */
    function changeColor(Cell) {
        // 今日の日付
        let today = new Date();
        today.setDate(today.getDate() - 1);

        // セルの日付取得
        let day = Cell.dataset.date;
        let cellDay = new Date(day);

        //　セルの色変更
        if (Cell.style.backgroundColor === '' && today < cellDay) {
            //登録前
            Cell.style.backgroundColor = cfgHomonKeikakuCellColor.yoteiBefore.color;
            postCount++;
        } else if (Cell.style.backgroundColor === cfgHomonKeikakuCellColor.yoteiBefore.color) {
            //登録キャンセル
            Cell.style.backgroundColor = '';
            postCount--;
        } else if (Cell.style.backgroundColor === cfgHomonKeikakuCellColor.yoteiAfter.color) {
            //削除
            Cell.style.backgroundColor = cfgHomonKeikakuCellColor.delete.color;
            deleteCount++;
        } else if (Cell.style.backgroundColor === cfgHomonKeikakuCellColor.delete.color) {
            //登録有り
            Cell.style.backgroundColor = cfgHomonKeikakuCellColor.yoteiAfter.color;
            deleteCount--;
        }
    };

    /**
     * 顧客ごとの活動日を取得する関数
     * @param {*} getKatsudobi object {}
     * @param {*} eigyoKokyakuId 顧客ID
     * @param {*} katsudobi 活動日
     */
    function getKatsudobi(getKatsudobi, eigyoKokyakuId, katsudobi) {
        if (getKatsudobi[eigyoKokyakuId]) {
            let katsudobiArray = getKatsudobi[eigyoKokyakuId];
            if (katsudobiArray.indexOf(katsudobi) === -1) {
                katsudobiArray.push(katsudobi);
            }
        } else {
            getKatsudobi[eigyoKokyakuId] = [katsudobi];
        }
    };

    /**
     * 予定の情報をセルに設定する関数
     * @param {*} katsudobiYoteiFuture　活動予定配列
     * @param {*} cell セル
     * @param {*} cellDate セルの日付
     * @param {*} eigyoNippoResp 営業報告レコード
     * @param {*} kokyakuKokyakuId 顧客アプリ　顧客ID
     * @param {*} tantoshaId 顧客アプリ　担当者ID
     * @param {*} tantoshaSearch 顧客アプリ　担当者検索コード
     * @param {*} color 予定セルの色
     */
    function setCellYotei(katsudobiYoteiFuture, cell, cellDate, eigyoNippoResp, kokyakuKokyakuId, tantoshaId, tantoshaSearch, color) {
        if (katsudobiYoteiFuture[kokyakuKokyakuId]) {
            let eigyoKatsudobi = katsudobiYoteiFuture[kokyakuKokyakuId];
            if (eigyoKatsudobi.indexOf(cellDate) !== -1) {
                let recordIdArray = getRecordId(eigyoNippoResp, kokyakuKokyakuId, cellDate, tantoshaSearch);
                let recordId;
                if (recordIdArray.length > 0) {
                    recordId = recordIdArray[0];
                    // セルにデータ属性を追加
                    cell.dataset.date = cellDate; // 日付
                    cell.dataset.kokyakuId = kokyakuKokyakuId; // 顧客ID
                    cell.dataset.tantoshaId = tantoshaId; // 担当者ID
                    cell.dataset.tantoshaSearchCode = tantoshaSearch; // 担当者検索コード
                    cell.dataset.recordId = recordId; // レコード番号
                }
                cell.style.backgroundColor = color;
            }
        }
    };

    /**
      * 営業報告アプリの$idを取得する関数
      * @param {*} eigyoRecords 営業報告レコード
      * @param {*} kokyakuKokyakuId 顧客アプリの顧客ID
      * @param {*} cellDate セルの日付
      * @param {*} tantoshaSearch 顧客アプリの担当者検索コード
      * @returns
      */
    function getRecordId(eigyoRecords, kokyakuKokyakuId, cellDate, tantoshaSearch) {
        let idArray = [];
        for (let i = 0; i < eigyoRecords.length; i++) {
            let kokyakuId = eigyoRecords[i][cfgEigyoRepotoFields.kokyakuId.code].value;
            let katsudobi = eigyoRecords[i][cfgEigyoRepotoFields.katsudobi.code].value;
            let yotei = eigyoRecords[i][cfgEigyoRepotoFields.yoteiJisseki.code].value;
            let eigyotantoshaSearch = eigyoRecords[i][cfgKokyakuFields.tantoshaSearch.code].value;
            if (kokyakuId === kokyakuKokyakuId && katsudobi === cellDate && yotei === '予定' && eigyotantoshaSearch === tantoshaSearch) {
                idArray.push(eigyoRecords[i].$id.value);
            }
        }
        return idArray;
    };

    /**
     * 営業報告アプリに日報を作成する関数
     * @returns
     */
    function nippoCreate() {
        let deleteArray = [];
        let postArray = [];
        let scheduletable = document.getElementById('hk_tbody');
        // セルの位置取得
        for (let i = 0; i < scheduletable.rows.length; i++) {
            // tr内のtdをループ。行内セル位置取得。
            for (let j = 0; j < scheduletable.rows[i].cells.length; j++) {
                // i番行のj番列のセル "td"
                let Cells = scheduletable.rows[i].cells[j];
                // 登録対象のセルのidを格納
                if (Cells.style.backgroundColor === cfgHomonKeikakuCellColor.yoteiBefore.color) {
                    // セルの要素ごとpush
                    postArray.push(Cells);
                }
                // 削除対象のセルのidを格納
                if (Cells.style.backgroundColor === cfgHomonKeikakuCellColor.delete.color) {
                    // セルの要素ごとpush
                    deleteArray.push(Cells);
                }
            }
        }

        // セルが選択されていない場合は終了
        if (postArray.length === 0 && deleteArray.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'セルが選択されていません。',
                text: 'セルを選択してください。',
                width: '25%'
            }).then(function (result) {
                return;
            });
            return;
        }

        Swal.fire({
            title: '予定登録・削除',
            text: '編集内容を保存します。よろしいですか？',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3498db',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'OK',
            cancelButtonText: 'キャンセル'
        }).then(function (result) {
            if (result.value) {
                // 登録処理
                if (postArray.length > 0) {
                    postSchedule(postArray);
                }
                // 削除処理
                if (deleteArray.length > 0) {
                    deleteSchedule(deleteArray);
                }
                Swal.fire({
                    icon: 'success',
                    text: '保存しました。'
                }).then(function (resp) {
                    document.location.reload();
                    return;
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    text: 'キャンセルしました。'
                });
                return;
            }
        });
    };

    /**
     * 登録処理
     * @param {*} postArray セルのid
     */
    function postSchedule(postArray) {
        let dayArray = [];
        let kokyakuArray = [];
        let tantoshaArray = [];
        let tantoshaSearchArray = [];
        let nippoIdArray = [];
        for (let i = 0; i < postArray.length; i++) {
            // data属性より取得
            let day = postArray[i].dataset.date;
            let kokyakuId = postArray[i].dataset.kokyakuId;
            let tantoshaId = postArray[i].dataset.tantoshaId;
            let tantoshaSearch = postArray[i].dataset.tantoshaSearchCode;
            let nippoId = day + tantoshaId;
            dayArray.push(day);
            kokyakuArray.push(kokyakuId);
            tantoshaArray.push(tantoshaId);
            tantoshaSearchArray.push(tantoshaSearch);
            nippoIdArray.push(nippoId);
        }
        // 登録リクエスト作成
        let apiRequests = []
        let post_template = {
            'app': cfgEigyoRepoto.app,
            'records': []
        };
        let postDatas = $.extend(true, {}, post_template);
        for (let i = 0; i < postArray.length; i++) {
            postDatas.records.push({
                [cfgEigyoRepotoFields.katsudobi.code]: {
                    'value': dayArray[i]
                },
                [cfgEigyoRepotoFields.yoteiJisseki.code]: {
                    'value': '予定'
                },
                [cfgEigyoRepotoFields.kokyakuSearch.code]: {
                    'value': kokyakuArray[i]
                },
                [cfgEigyoRepotoFields.tantoshaSearch.code]: {
                    'value': tantoshaSearchArray[i]
                },
                [cfgEigyoRepotoFields.nippoId.code]: {
                    'value': nippoIdArray[i]
                }
            });
            //100件までデータ格納
            if (postDatas.records.length === 100) {
                apiRequests.push({
                    'method': 'POST',
                    'api': '/k/v1/records.json',
                    'payload': postDatas
                });
                // 初期化
                postDatas = $.extend(true, {}, post_template);
            }
        }
        if (postDatas.records.length > 0) {
            apiRequests.push({
                'method': 'POST',
                'api': '/k/v1/records.json',
                'payload': postDatas
            });
        }
        // 一括登録処理
        sncLib.kintone.rest.execBulkRequest(apiRequests);
    };

    /**
     * 削除処理
     * @param {*} deleteArray セルのid
     */
    function deleteSchedule(deleteArray) {
        let delrecArray = [];
        for (let i = 0; i < deleteArray.length; i++) {
            // let deleteInfo = deleteArray[i].recordId;
            // if (deleteInfo.length === 5) {
            let recordId = deleteArray[i].dataset.recordId;
            delrecArray.push(recordId);
            // }
        }
        // 削除リクエスト作成
        let apiRequests = [];
        let delete_template = {
            'app': cfgEigyoRepoto.app,
            'ids': []
        };
        let deleteDatas = $.extend(true, {}, delete_template);
        for (let i = 0; i < delrecArray.length; i++) {
            deleteDatas.ids.push(delrecArray[i]);
            if (deleteDatas.ids.length === 100) {
                apiRequests.push({
                    'method': 'DELETE',
                    'api': '/k/v1/records.json',
                    'payload': deleteDatas
                });
                // 初期化
                deleteDatas = $.extend(true, {}, delete_template);
            }
        }
        if (deleteDatas.ids.length > 0) {
            apiRequests.push({
                'method': 'DELETE',
                'api': '/k/v1/records.json',
                'payload': deleteDatas
            });
        }
        // 一括削除処理
        sncLib.kintone.rest.execBulkRequest(apiRequests);
    };

})(jQuery, window.nokConfig, window.koyakuHomonKeikakuConfig, window.snc);
