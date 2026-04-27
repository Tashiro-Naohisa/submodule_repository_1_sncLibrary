/**
 * @fileoverview NICE営業 on kintone 設定情報（各アプリ配置）
 * @author SNC
 * @version 4.5.1
 * @customer （yyyy-mm-dd）
 */
(function (globalConfig) {
	'use strict';
	// spaceId_の数字をアプリのスペースIDに変更。
	const spaceId = 3;
	// グローバル変数
	window.nokConfig = window.nokConfig || globalConfig['spaceId_' + spaceId];

})(window.nokConfigGlobal);
