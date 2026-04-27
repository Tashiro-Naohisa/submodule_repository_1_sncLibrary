/**
 * @fileoverview NICE営業物語 on kintone
 * 営業報告アプリと顧客アプリの連携
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
(async function (sncLib) {
    'use strict';

    window.snc = window.snc || {};

    /**
     * 顧客管理アプリへの更新リクエスト作成関数
     * @param {Object} config
     * @param {Object} configLinkage
     * @param {String} targetKokyakuId
     * @param {String} kokyakuAppId
     * @param {Object} records
     * @returns {object} 顧客管理アプリへの更新リクエスト
     */
    async function createKokyakuLinkageUpdateRecord(config, configLinkage, targetKokyakuId, kokyakuAppId, records) {
        try {
            // 顧客アプリのクエリ
            const kokyakuQuery = config.kokyaku.fields.kokyakuId.code + '="' + targetKokyakuId + '"';
            // 顧客アプリの連携対象のレコード取得
            const kokyakuRecords = await sncLib.kintone.rest.getRecordAsync(kokyakuAppId, kokyakuQuery);

            // 顧客アプリの連携対象のレコードが存在しない場合、nullを返す
            if (kokyakuRecords.length === 0) return null;

            // 更新内容を格納するオブジェクト
            let updateRecord = {
                id: kokyakuRecords[0].$id.value,
                record: {}
            };

            // 連携設定のリストを元に更新内容を作成
            for (const linkageItem of configLinkage.list) {
                // 比較元フィールドコードの値
                const referenceValue = records[linkageItem.referenceFieldCode].value;
                // 比較先フィールドコードの値
                const compareValue = kokyakuRecords[0][linkageItem.compareFieldCode].value;
                // 更新対象フィールドコード
                const targetFieldCode = linkageItem.targetFieldCode;

                // 両方とも値が存在しない場合はスキップ
                if (!referenceValue && !compareValue) continue;

                // 値が異なる場合のみ更新対象とする
                if (referenceValue !== compareValue) {
                    updateRecord.record[targetFieldCode] = { value: referenceValue };
                }
            }

            return updateRecord;
        } catch (err) {
            console.error(err);
            throw new Error('顧客管理アプリへの更新リクエスト作成に失敗しました', { cause: err });
        }
    }


    /**
     * 顧客管理アプリへの取得クエリ作成関数
     * @param {Object} event
     * @param {Object} config
     * @param {String} targetKokyakuId
     * @returns {Object} 営業活動レポートの最新のレコード
     */
    async function getEigyoData(event, config, targetKokyakuId) {
        try {
            const eigyoAppId = config.eigyoRepoto.app;
            const cfgEigyoRepotoFields = config.eigyoRepoto.fields;
            let selfRecordId = '';
            let eigyoQuery = '';

            // イベントに応じてクエリの変更
            if ((event.type === 'app.record.index.delete.submit') || (event.type === 'app.record.detail.delete.submit')) {
                selfRecordId = event.recordId;
                eigyoQuery = cfgEigyoRepotoFields.kokyakuId.code + '="' + targetKokyakuId
                    + '" and ' + cfgEigyoRepotoFields.yoteiJisseki.code + ' in ("実績")'
                    + ' and $id != "' + selfRecordId + '"'
                    + ' order by ' + cfgEigyoRepotoFields.katsudobi.code + ' desc, '
                    + cfgEigyoRepotoFields.kaishijikoku.code + ' desc, '
                    + cfgEigyoRepotoFields.shuryojikoku.code + ' desc, '
                    + '$id desc';
            } else {
                // 活動日、開始時間、終了時間、$idの降順のソート条件で顧客IDが対象のレコードかつ予定・実績が実績のレコードを1件取得
                eigyoQuery = cfgEigyoRepotoFields.kokyakuId.code + '="' + targetKokyakuId
                    + '" and ' + cfgEigyoRepotoFields.yoteiJisseki.code + ' in ("実績")'
                    + ' order by ' + cfgEigyoRepotoFields.katsudobi.code + ' desc, '
                    + cfgEigyoRepotoFields.kaishijikoku.code + ' desc, '
                    + cfgEigyoRepotoFields.shuryojikoku.code + ' desc, '
                    + '$id desc';
            }

            // 顧客データに紐づく営業活動レポートの最新のレコードを取得して返す
            return await sncLib.kintone.rest.getRecordAsync(eigyoAppId, eigyoQuery);
        } catch (err) {
            console.error(err);
            throw new Error('営業活動レポートの取得に失敗しました', { cause: err });
        }
    }

    /**
     * 顧客管理アプリへの更新リクエスト作成関数
     * @param {Object} event
     * @param {Object} config
     * @param {Object} configLinkage
     * @param {Object} sourceAppData // 名寄せ時と一括アプリの登録の時、動的に作成
     * @returns {Array} 更新リクエストの配列
     */
    async function createKokyakuLinkageRequest(event, config, configLinkage, opt_sourceAppData) {
        try {
            // 営業活動レポートアプリのフィールドコード
            const cfgEigyoRepotoFields = config.eigyoRepoto.fields;

            // 名寄せ後の顧客ID
            const remainKokyakuId = opt_sourceAppData.remainKokyakuId || '';
            const latestNippoEigyoRecords = opt_sourceAppData.latestNippoEigyoRecords || [];
            const nippoLinkage = opt_sourceAppData.nippoLinkage || false;
            const kokyakuAppId = config.kokyaku.app;
            let kokyakuLinkageRequests = [];

            // 更新用データを格納
            let putDatas = [];

            if (nippoLinkage) {
                // 日報アプリからの登録の場合
                // 顧客管理アプリへの連携データの数分（一括アプリの登録時は、判定が存在）
                for (let i = 0; i < latestNippoEigyoRecords.length; i++) {
                    // 最新の顧客データをtargetKokyakuIdに設定
                    const targetKokyakuId = latestNippoEigyoRecords[i][cfgEigyoRepotoFields.kokyakuId.code].value;

                    // 顧客データに紐づく営業活動レポートを取得
                    const eigyoRecords = await getEigyoData(event, config, targetKokyakuId);

                    // 同じ顧客IDで紐づく営業活動レポートアプリのデータが存在する場合は、最新データの比較を行う
                    if (eigyoRecords.length > 0) {
                        // 一括アプリの活動日を定義
                        const nippoKatsudobi = latestNippoEigyoRecords[i][cfgEigyoRepotoFields.katsudobi.code].value;

                        // 営業活動レポートの活動日が日報の活動日より新しい場合、連携しない
                        if (nippoKatsudobi < eigyoRecords[0][cfgEigyoRepotoFields.katsudobi.code].value) {
                            continue;
                        }

                        // 営業活動レポートにおける最新データの活動日が日報データの活動日と同じ場合、開始時刻及び終了時刻で比較
                        if (nippoKatsudobi === eigyoRecords[0][cfgEigyoRepotoFields.katsudobi.code].value) {
                            // 開始時刻で比較
                            // nippo.jsで保持した最新顧客データの開始時刻と取得した開始時刻を比較
                            const eigyoKaishiJikoku = eigyoRecords[0][cfgEigyoRepotoFields.kaishijikoku.code].value;
                            const nippoKaishiJikoku = latestNippoEigyoRecords[i][cfgEigyoRepotoFields.kaishijikoku.code].value;

                            // 営業活動レポートアプリのデータの方が最新の場合、更新リクエストを作成しない
                            if (eigyoKaishiJikoku > nippoKaishiJikoku) continue;

                            // 開始時刻が同じである場合、nippo.jsで保持した最新顧客データの終了時刻と取得した終了時刻を比較
                            if (eigyoKaishiJikoku === nippoKaishiJikoku) {
                                const eigyoShuryoJikoku = eigyoRecords[0][cfgEigyoRepotoFields.shuryojikoku.code].value;
                                const nippoShuryoJikoku = latestNippoEigyoRecords[i][cfgEigyoRepotoFields.shuryojikoku.code].value;

                                // 営業活動レポートアプリのデータの方が最新の場合、更新リクエストを作成しない
                                if (eigyoShuryoJikoku > nippoShuryoJikoku) continue;
                            }
                        }
                    }

                    // 顧客管理アプリへの更新リクエストを作成
                    const updateRecord = await createKokyakuLinkageUpdateRecord(config, configLinkage, targetKokyakuId, kokyakuAppId, latestNippoEigyoRecords[i]);

                    // 更新内容が存在する場合のみ追加（nullの場合はスキップ）
                    if (updateRecord && Object.keys(updateRecord.record).length > 0) {
                        putDatas.push(updateRecord);
                    }

                    // 100件に達したらrequestsに追加
                    if (putDatas.length === 100) {
                        kokyakuLinkageRequests.push({
                            'method': 'PUT',
                            'api': '/k/v1/records.json',
                            'payload': {
                                'app': kokyakuAppId,
                                'records': putDatas
                            }
                        });
                        // 配列を初期化
                        putDatas = [];
                    }
                }
            } else {
                // 日報アプリ以外（営業報告アプリ及び顧客管理アプリ）からの登録の場合
                // remainKokyakuIdの有無によって、targetKokyakuIdを設定
                const targetKokyakuId = remainKokyakuId === ''
                    ? event.record[cfgEigyoRepotoFields.kokyakuId.code].value
                    : remainKokyakuId;

                // 顧客データに紐づく営業活動レポートを取得
                const eigyoRecords = await getEigyoData(event, config, targetKokyakuId);

                // 営業活動レポートのデータが存在する場合のみ、更新リクエストを作成する
                if (eigyoRecords.length > 0) {
                    const updateRecord = await createKokyakuLinkageUpdateRecord(config, configLinkage, targetKokyakuId, kokyakuAppId, eigyoRecords[0]);

                    // 更新内容が存在する場合のみ追加（nullの場合はスキップ）
                    if (updateRecord && Object.keys(updateRecord.record).length > 0) {
                        putDatas.push(updateRecord);
                    }
                }
            }

            // 更新する内容に残りのデータがある場合、リクエストに追加
            if (putDatas.length > 0) {
                kokyakuLinkageRequests.push({
                    'method': 'PUT',
                    'api': '/k/v1/records.json',
                    'payload': {
                        'app': kokyakuAppId,
                        'records': putDatas
                    }
                });
            }

            return kokyakuLinkageRequests;
        } catch (err) {
            console.error(err);
            throw new Error('顧客連携リクエストの作成に失敗しました', { cause: err });
        }
    }

    /**
     * バルクリクエストを実行する関数
     * @param {object} event
     * @param {object} configLinkage
     * @param {object} config
     * @param {string} remainKokyakuId // 名寄せのみ使用(残す顧客ID)
     * @param {object} nippoLinkageData // 一括アプリからの呼び出し時のみの使用（作成済みのリクエストと最新の顧客データ）
     * @returns {object} イベント
     */
    window.snc.eigyoKokyakuLinkage = async function eigyoKokyakuLinkage(event, config, configLinkage, opt_remainKokyakuId, opt_nippoLinkageData = {}) {
        try {
            // 呼び出し元のアプリを特定するためのオブジェクト
            let sourceAppData = {};

            // 名寄せ時に使用する対象の顧客IDを入れる変数
            const remainKokyakuId = opt_remainKokyakuId || '';
            let requests = opt_nippoLinkageData.requests || [];
            // 日報アプリからの更新時に使用する最新顧客データが格納されている配列
            const latestNippoEigyoRecords = opt_nippoLinkageData.latestKokyakuData || [];

            // 名寄せ時と一括アプリの登録の時、キーを動的に作る
            if (remainKokyakuId) { // 名寄せ時
                sourceAppData = {
                    'remainKokyakuId': remainKokyakuId,
                };
            } else if (latestNippoEigyoRecords.length >= 0 && requests.length > 0) { // 一括アプリの登録時
                sourceAppData = {
                    'latestNippoEigyoRecords': latestNippoEigyoRecords,
                    'nippoLinkage': true
                };
            }

            // 顧客連携が有効な場合のみ顧客管理アプリへの更新リクエスト作成処理を実行
            if (configLinkage.option) {
                // 顧客管理アプリへの更新リクエストを作成
                const kokyakuLinkageRequests = await createKokyakuLinkageRequest(event, config, configLinkage, sourceAppData);

                if (kokyakuLinkageRequests.length > 0) {
                    requests = requests.concat(kokyakuLinkageRequests);
                }
            }

            // リクエストが存在する場合、バルクリクエストで実行
            if (requests.length > 0) {
                await sncLib.kintone.rest.execBulkRequestAsync(requests);
            }
            // 処理を終了
            return;
        } catch (err) {
            console.error(err);
            throw new Error('営業報告と顧客管理の連携処理に失敗しました', { cause: err });
        }
    }

})(window.snc);
