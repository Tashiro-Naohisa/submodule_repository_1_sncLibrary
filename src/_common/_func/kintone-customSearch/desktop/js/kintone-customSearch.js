/**
 * @fileoverview kintone検索機能拡張
 *
 *【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * snc.min.js -v1.X.X
 * snc.kintone.min.js -v1.X.X
 * snc.nok.min.js -v1.X.X
 * config.nok.js -vX.X.X
 * config.*-customSearch.js (*=アプリ略名) -v3.0.X
 *
 * [CSS]
 * 51-us-default.css
 *
 * @version 3.0.4
 * @customer XXXXX（yyyy-mm-dd）
 */
jQuery.noConflict();
(function ($, configSearch, sncLib) {
	'use strict';

	/**
	 * 検索用オプションの追加
	 * 　特定のviewIDの場合、検索用オプションを表示する
	 * @param {int} viewId
	 */
	function setCustomSearch(viewId) {

		// カスタマイズ検索機能のON/OFFチェック
		// 指定されたviewIdのみを有効とする
		if (configSearch.targetViewIds.indexOf(viewId) == -1) {
			return;
		}
		let keyword;
		let keywordObj = {};
		if (sessionStorage.getItem('keyword')) {
			keyword = sessionStorage.getItem('keyword');
			keywordObj = JSON.parse(keyword);
		}

		// 検索項目の設定
		var searchItems = configSearch.items;
		// 検索用ボタンの設定
		var searchButtons = configSearch.buttons;
		// GET引数に格納された直前の検索キーワードを取得して再表示する
		var result = {};
		var searchCondition = window.location.search;
		var query = '';
		if (searchCondition.indexOf('view') != -1 && searchCondition.indexOf('query') != -1) {
			query = window.location.search.substring(6 + String(viewId).length + 7);  // URL固定部分(?view=(viewId)&query=)は無視
		}
		else if (searchCondition.indexOf('query') != -1) {
			query = window.location.search.substring(7);  // URL固定部分(?query=)は無視
		}

		// クエリ検索条件の区切り記号 (and/or) で分割
		var parameters = query.split(configSearch.conditionOption);
		// フィールドコード名と検索キーワードに分割する
		for (var i = 0; i < parameters.length; i++) {
			var element = parameters[i].split('like');
			var paramName = decodeURIComponent(element[0]);
			var paramValue = decodeURIComponent(element[1]);
			// スペースと''をtrimして、文字列だけにしてから、配列に格納（このとき、「"」「\」はエスケープする必要あり）
			result[paramName.replace(/^\s+|\s+$/g, '')] = sncLib.kintone.util.escapeKintoneCustomSearch(paramValue);//
		}

		// 検索キーワードその１
		var search_word1 = document.createElement('input');
		search_word1.onkeypress = function (e) {
			if (e.keyCode && e.keyCode == 13) {
				// Enterクリック時の処理
				keyword_search();
			}
		}
		if (result[searchItems.item01.fieldCode] != undefined) {
			search_word1.value = result[searchItems.item01.fieldCode];	 // GET引数に、直前の検索キーワードがあったら格納しておく
			// sessionStorageにデータが保持されているとき
			if (Object.keys(keywordObj).length !== 0) {
				search_word1.value = keywordObj.keyword1Value;
			}
		}

		// 検索キーワードその２
		var search_word2 = document.createElement('input');
		search_word2.onkeypress = function (e) {
			if (e.keyCode && e.keyCode == 13) {
				// Enterクリック時の処理
				keyword_search();
			}
		}
		if (result[searchItems.item02.fieldCode] != undefined) {
			search_word2.value = result[searchItems.item02.fieldCode];	 // GET引数に、直前の検索キーワードがあったら格納しておく
			// sessionStorageにデータが保持されているとき
			if (Object.keys(keywordObj).length !== 0) {
				search_word2.value = keywordObj.keyword2Value;
			}
		}

		// 検索ボタン
		var run_button = document.createElement('button');
		run_button.innerHTML = searchButtons.run.labelName;
		run_button.onclick = function () {
			keyword_search();
		};

		// クリアボタン
		var clear_button = document.createElement('button');
		clear_button.innerHTML = searchButtons.clear.labelName;
		clear_button.onclick = function () {
			search_word1.value = '';
			search_word2.value = '';
			//keyword_search();
		};

		// キーワード検索の関数
		function keyword_search() {
			var keyword1 = sncLib.util.escapeUrl(search_word1.value);
			var keyword2 = sncLib.util.escapeUrl(search_word2.value);
			var viewCondition = '?view=' + viewId;

			var str_query = viewCondition
				+ '&query='
				+ encodeURIComponent(searchItems.item01.fieldCode + ' like "' + keyword1 + '" ')
				+ encodeURIComponent(configSearch.conditionOption + ' ' + searchItems.item02.fieldCode + ' like "' + keyword2 + '"');

			if (keyword1 == '' && keyword2 == '') {
				str_query = viewCondition;
			}
			else if (keyword1 != '' && keyword2 == '') {
				str_query = viewCondition
					+ '&query='
					+ encodeURIComponent(searchItems.item01.fieldCode + ' like "' + keyword1 + '"');
			} else if (keyword1 == '' && keyword2 != '') {
				str_query = viewCondition
					+ '&query='
					+ encodeURIComponent(searchItems.item02.fieldCode + ' like "' + keyword2 + '"');
			}

			const data = {
				keyword1Value: keyword1,
				keyword2Value: keyword2
			}

			sessionStorage.removeItem('keyword');
			const dataStr = JSON.stringify(data);
			sessionStorage.setItem('keyword', dataStr);

			// GET変数を使って、検索結果へ
			document.location = location.origin + location.pathname + str_query;
		}

		// キーワード入力部品を、kintoneヘッダ部分に埋め込む(重複を避けるため、最初に要素をクリアしておく)
		var aNode = kintone.app.getHeaderMenuSpaceElement()
		for (var i = aNode.childNodes.length - 1; i >= 0; i--) {
			aNode.removeChild(aNode.childNodes[i]);
		}

		var label = document.createElement('label');
		label.appendChild(document.createTextNode('　'));
		label.appendChild(document.createTextNode(searchItems.item01.labelName));
		label.appendChild(search_word1);
		label.appendChild(document.createTextNode('　'));
		label.appendChild(document.createTextNode(searchItems.item02.labelName));
		label.appendChild(search_word2);
		label.appendChild(document.createTextNode('　　'));
		label.appendChild(run_button);
		label.appendChild(document.createTextNode('　'));
		label.appendChild(clear_button);
		kintone.app.getHeaderMenuSpaceElement().appendChild(label);

		// kintoneのスタイルを設定
		$(label).addClass('kintoneplugin-label');
		$(document.createTextNode(searchItems.item01.labelName)).addClass('kintoneplugin-label');
		$(document.createTextNode(searchItems.item02.labelName)).addClass('kintoneplugin-label');
		$(search_word1).addClass('kintoneplugin-input-text');
		$(search_word1).width(searchItems.item01.width);
		$(search_word2).addClass('kintoneplugin-input-text');
		$(search_word2).width(searchItems.item02.width);
		$(run_button).addClass('kintoneplugin-button-normal');
		$(run_button).css('min-width', searchButtons.run.width);
		$(clear_button).addClass('kintoneplugin-button-normal');
		$(clear_button).css('min-width', searchButtons.clear.width);
	};

	/**
	 * レコード一覧表示画面のイベント
	 * 　フィールドの表示/非表示設定
	 * 　フィールドの入力可/否 を設定
	*/
	kintone.events.on([
		'app.record.index.show'
	], function (event) {
		// 選択されている一覧のID（viewId）を取得
		var viewId = event.viewId;
		// 検索ボタンを配置
		setCustomSearch(viewId);
		return event;
	});

})(jQuery, window.customSearchConfig, window.snc);
