/**
 * @fileoverview 営業活動レポートアプリ　顧客管理アプリ連携の設定情報
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
 */
(function (config) {
    'use strict';

    const cfgEigyoRepotoFields = config.eigyoRepoto.fields;
    const cfgKokyakuFields = config.kokyaku.fields;

    // グローバル変数
    window.kokyakuLinkageConfig = window.kokyakuLinkageConfig || {
        // 顧客連携オプション
        //   true: on, false: off
        option: true,
        // 更新対象フィールドリスト
        //   referenceFieldCode: 営業活動レポート 参照用フィールド
        //   compareFieldCode: 顧客管理 更新比較用フィールド
        //   targetFieldCode: 顧客管理 更新用フィールド
        list: [
            // 活動日
            {
                referenceFieldCode: cfgEigyoRepotoFields.katsudobi.code,
                compareFieldCode: cfgKokyakuFields.saishuTaiobi.code,
                targetFieldCode: cfgKokyakuFields.saishuTaiobi.code
            },
            // 担当者
            {
                referenceFieldCode: cfgEigyoRepotoFields.tantoshaMei.code,
                compareFieldCode: cfgKokyakuFields.saishuTaiosha.code,
                targetFieldCode: cfgKokyakuFields.saishuTaiosha.code
            },
            // 訪問目的
            {
                referenceFieldCode: cfgEigyoRepotoFields.homonMokuteki.code,
                compareFieldCode: cfgKokyakuFields.saishuHomonMokuteki.code,
                targetFieldCode: cfgKokyakuFields.saishuHomonMokuteki.code
            },
            // 対応内容
            {
                referenceFieldCode: cfgEigyoRepotoFields.biko.code,
                compareFieldCode: cfgKokyakuFields.saishuTaioNaiyo.code,
                targetFieldCode: cfgKokyakuFields.saishuTaioNaiyo.code
            },
        ],
    };

})(window.nokConfig);
