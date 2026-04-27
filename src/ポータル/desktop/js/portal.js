/**
 * @fileoverview ポータルスペースにメニュー一覧とグラフ表示
 * - リソース：
 * - イベント：
 *
 * 【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * luxon.min.js -v3.1.1
 * snc.min.js -v1.0.5
 * snc.kintone.min.js -v1.1.0
 * snc.nok.min.js -v1.0.5
 * config.nok.js -v4.5.0
 * graph.portal.js -v4.5.0
 * config.portal.js -v4.5.0
 * portal-main.js -v4.5.0
 *
 * [CSS]
 * portal-space.css
 *
 * @author SNC
 * @version 4.5.1
 * @customer XXXXX（yyyy-mm-dd）
*/
jQuery.noConflict();
(function ($, globalConfig, portalGlobalConfig, portal) {
    'use strict';

    /**
     * スペース画面表示後 イベント
     */
    kintone.events.on([
        'space.portal.show',
    ], function (event) {
        const spaceKey = 'spaceId_' + event.spaceId;

        // コンフィグを動的に取得する場合
        const config = globalConfig[spaceKey];

        // ポータルのコンフィグ取得
        const configPortal = portalGlobalConfig[spaceKey];

        // 有効のスペースのみ表示する
        if (!config || !configPortal) {
            return event;
        }

        // スペース上側の要素を取得
        var el = kintone.space.portal.getContentSpaceElement();

        // カスタマイズポータル表示
        var headerDiv = document.createElement('div');
        headerDiv.innerHTML = portal.createHeaderLayout();

        // カスタマイズポータルを設置
        el.appendChild(headerDiv);

        // タブ制御
        openTab('nok-portal-tab');
        $('.tab-button').click(function (e) {
            const tabName = $(this).attr('data-tabname');
            $('.tab-button').removeClass('active');
            $(this).addClass('active');
            openTab(tabName);
        });

        return portal.processRenderPortal(event, config, configPortal);
    });

    /**
     * カスタマイズポータルと標準ポータルの切り替えを制御
     * @param {string} tabName
     */
    function openTab(tabName) {
        if (tabName === 'nok-portal-tab') {
            $('.nok-portal-outer').show();
            $('.gaia-argoui-page-space-show-left').hide();
            $('.gaia-argoui-page-space-show-right').hide();
        } else {
            $('.nok-portal-outer').hide();
            $('.gaia-argoui-page-space-show-left').show();
            $('.gaia-argoui-page-space-show-right').show();
        }
    }

})(jQuery, window.nokConfigGlobal, window.portalConfigGlobal, window.portal);
