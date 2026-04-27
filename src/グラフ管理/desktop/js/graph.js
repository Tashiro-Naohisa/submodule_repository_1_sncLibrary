/**
 * @fileoverview グラフ管理アプリ カスタマイズ
 *
 *【必要ライブラリ】
 * [JavaScript]
 * config.nok.js -v4.0.1
 * config.graph.js -v4.0.1
 * graph-main.js -v4.0.1
 *
 * [CSS]
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
*/
jQuery.noConflict();
(function ($, config, graphConfig, graphMain) {
    'use strict';
    const cfgGraphFields = config.graph.fields;
    const deviceConfig = graphConfig.device;
    /**
     * レコード追加画面の表示後イベント
     * レコード編集画面の表示後イベント
     * レコード詳細画面の表示後イベント
     * レコード追加画面のグラフタイプ値変更イベント
     * レコード編集画面のグラフタイプ値変更イベント
     *    グラフタイプに応じてグラフグループを表示
    */
    kintone.events.on([
        'app.record.create.show',
        'app.record.edit.show',
        'app.record.detail.show',
        'app.record.create.change.' + cfgGraphFields.graphType.code,
        'app.record.edit.change.' + cfgGraphFields.graphType.code,
    ], function (event) {
        return graphMain.processInitialGraph(event, deviceConfig.desktop);
    });

    /**
     * レコード追加画面の保存実行前イベント
     * レコード編集画面の保存実行前イベント
     * レコード一覧画面のインライン編集の保存実行前イベント
     *    submitの前にデータを処理
    */
    kintone.events.on([
        'app.record.create.submit',
        'app.record.edit.submit',
        'app.record.index.edit.submit'
    ], function (event) {
        return graphMain.processDataBeforeSubmit(event);
    });

    /**
     * レコード一覧画面のインライン編集開始イベント
     * レコード編集画面の表示後
     *    グラフタイプを入力不可にする
     *　　表示しているレコードを取得
    */
    kintone.events.on([
        'app.record.edit.show',
        'app.record.index.edit.show'
    ], function (event) {
        const record = event.record;
        if (event.type === 'app.record.index.edit.show') {
            record[cfgGraphFields.graphType.code].disabled = true;
        }
        return graphMain.getCurrentRecord(event);
    });

    /**
     * レコード編集画面の表示後イベント
     * レコード追加画面の客グラフの表示対象フィールド値変更イベント
     * レコード編集画面の客グラフの表示対象フィールド値変更イベント
     *    組織選択の表示有無
    */
    kintone.events.on([
        'app.record.create.show',
        'app.record.create.change.' + cfgGraphFields.paipurainTaisho.code,
        'app.record.create.change.' + cfgGraphFields.tsumiageTaisho.code,
        'app.record.create.change.' + cfgGraphFields.handonatsuTaisho.code,
        'app.record.create.change.' + cfgGraphFields.tateboTaisho.code,
        'app.record.create.change.' + cfgGraphFields.graphType.code,
        'app.record.edit.change.' + cfgGraphFields.paipurainTaisho.code,
        'app.record.edit.change.' + cfgGraphFields.tsumiageTaisho.code,
        'app.record.edit.change.' + cfgGraphFields.handonatsuTaisho.code,
        'app.record.edit.change.' + cfgGraphFields.tateboTaisho.code,
        'app.record.edit.change.' + cfgGraphFields.graphType.code,
        'app.record.edit.show',
        'app.record.detail.show'
    ], function (event) {
        return graphMain.processShowSoshiki(event, deviceConfig.desktop);
    });

    /**
     * レコード編集画面の保存成功後イベント
     * レコード一覧画面のインライン編集の保存成功後イベント
     *    ポータル設定アプリから更新対象のレコードを取得
     *    ポータル設定アプリを更新
    */
    kintone.events.on([
        'app.record.edit.submit.success',
        'app.record.index.edit.submit.success'
    ], function (event) {
        return graphMain.processUpdateRecord(event);
    });

    /**
     * レコード一覧画面のレコード削除前イベント
     * レコード詳細画面の削除前イベント
     *   ポータル設定アプリから更新対象のレコードを取得
     * 　レスポンスの中にポータル設定レコードデータがある場合: 削除中断
    */
    kintone.events.on([
        'app.record.index.delete.submit',
        'app.record.detail.delete.submit'
    ], function (event) {
        return graphMain.processDeleteRecord(event);
    });

})(jQuery, window.nokConfig, window.graphConfig, window.graphMain);
