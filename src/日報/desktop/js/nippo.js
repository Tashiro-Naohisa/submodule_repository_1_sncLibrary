/**
 * @fileoverview 一括報告アプリ
 * - 営業活動レポートの一括登録
 *   日報登録アプリより、営業活動レポートの複数登録を実施
 *
 * 【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * snc.min.js -v1.0.5
 * snc.kintone.min.js -v1.1.0
 * snc.nok.min.js -v1.0.5
 * config.nok.js -v4.0.1
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
*/
jQuery.noConflict();
(function ($, config, configEigyoRepotoLinkage, configLinkage, sncLib) {
	'use strict';

	const cfgNippo = config.nippo;
	const cfgNippoFields = config.nippo.fields;
	const cfgNippoMessages = config.nippo.messages;

	/**
	 * 営業活動レポートへ登録する情報を作成
	 * 「営業報告TB」内の顧客ごとの最新データを格納
	 * @param {Object} record
	 * @param {Object} table
	 * @param {Object} postFields
	 */
	function createEigyoRepotoData(record, table, postFields) {
		// ヘッダー部の設定
		const headerData = postFields.header;
		// 明細部の設定
		const detailData = postFields.detail;
		// 顧客連携の設定
		const mappingData = configEigyoRepotoLinkage.mappings;
		// リクエストを格納
		let requests = [];
		// サブテーブルの行数
		const rowCount = table.length;
		// 最新顧客データを格納
		let latestKokyakuData = [];
		// 顧客検索ごとの最新データを管理するマップ
		let kokyakuLatestMap = new Map();
		// 登録用データのテンプレート
		let post_template = {
			'app': config.eigyoRepoto.app,
			'records': []
		};

		let postDatas = $.extend(true, {}, post_template);

		// 登録用データの作成
		for (let i = 0; i < rowCount; i++) {
			// 営業活動データを格納
			let eigyoRecord = {};
			// 顧客データを格納
			let kokyakuData = {};

			// ヘッダー部
			for (let j = 0; j < headerData.length; j++) {
				const sCode = headerData[j].source.code;
				const tType = headerData[j].target.type;
				const tCode = headerData[j].target.code;
				const tValue = record[sCode].value;
				// 登録用データ作成
				eigyoRecord[tCode] = sncLib.kintone.util.setKintoneRecordValue(tType, tCode, tValue);
			}

			// 明細部
			for (let j = 0; j < detailData.length; j++) {
				const sCode = detailData[j].source.code;
				const tType = detailData[j].target.type;
				const tCode = detailData[j].target.code;
				const tValue = table[i].value[sCode].value;
				// 登録用データ作成
				eigyoRecord[tCode] = sncLib.kintone.util.setKintoneRecordValue(tType, tCode, tValue);
			}

			// 登録用データを格納
			postDatas.records.push(eigyoRecord);


			// 営業活動レポートアプリのフィールドコードを使用して、顧客連携データを作成
			for (const mapping of Object.values(mappingData)) {
				// 日報登録アプリのフィールドコード
				const nippoCode = mapping.nippoCode;
				// 営業活動レポートアプリのフィールドコード
				const eigyoCode = mapping.eigyoCode;

				// 日報アプリのフィールドコードに対するvalueとtypeを格納
				let nippoRecordData = {};
				if (table[i].value[nippoCode]) {
					// サブテーブルに存在する場合
					nippoRecordData = table[i].value[nippoCode];
				} else {
					// ヘッダー部に存在する場合
					nippoRecordData = record[nippoCode];
				}

				// 営業活動レポートアプリのフィールドコードをキーとして日報登録アプリの値をセット
				kokyakuData[eigyoCode] = nippoRecordData;
			}

			// 「予定・実績」が実績の場合かつ「顧客検索」IDが存在する場合のみ最新顧客データを格納
			if (kokyakuData[mappingData.yoteiJisseki.eigyoCode].value === "実績"
				&& kokyakuData[mappingData.kokyakuId.eigyoCode]?.value
			) {

				// 「顧客検索」ごとに最新データを保持する
				// 「顧客検索」の値を取得
				const kokyakuValue = kokyakuData[mappingData.kokyakuId.eigyoCode].value;

				// 「開始時刻」と「終了時刻」を取得
				const kaishiJikoku = kokyakuData[mappingData.kaishijikoku.eigyoCode]?.value || '00:00';
				const shuryoJikoku = kokyakuData[mappingData.shuryojikoku.eigyoCode]?.value || '00:00';

				// 格納されてるか確認
				const existing = kokyakuLatestMap.get(kokyakuValue);

				if (!existing) {
					// 格納されていない（初回）場合は格納
					kokyakuLatestMap.set(kokyakuValue, {
						record: kokyakuData,
						kaishiJikoku: kaishiJikoku,
						shuryoJikoku: shuryoJikoku,
						rowIndex: i
					});
				} else {
					// 「開始時刻」で比較
					const cmpStart = sncLib.util.compareTime(existing.kaishiJikoku, kaishiJikoku);

					if (cmpStart > 0) {
						// 現在の行の方が「開始時刻」が新しい（遅い）場合、更新
						kokyakuLatestMap.set(kokyakuValue, {
							record: kokyakuData,
							kaishiJikoku: kaishiJikoku,
							shuryoJikoku: shuryoJikoku,
							rowIndex: i
						});
					} else if (cmpStart === 0) {
						// 「開始時刻」が同じ場合、「終了時刻」で比較
						const cmpEnd = sncLib.util.compareTime(existing.shuryoJikoku, shuryoJikoku);

						if (cmpEnd > 0) {
							// 現在の行の方が「終了時刻」が新しい（遅い）場合、更新
							kokyakuLatestMap.set(kokyakuValue, {
								record: kokyakuData,
								kaishiJikoku: kaishiJikoku,
								shuryoJikoku: shuryoJikoku,
								rowIndex: i
							});
						} else if (cmpEnd === 0) {
							// 「開始時刻」も「終了時刻」も同じ場合、後の行を採用
							if (i > existing.rowIndex) {
								kokyakuLatestMap.set(kokyakuValue, {
									record: kokyakuData,
									kaishiJikoku: kaishiJikoku,
									shuryoJikoku: shuryoJikoku,
									rowIndex: i
								});
							}
						}
					}
				}
			}

			// 登録用データを100件ずつを格納
			if (postDatas.records.length === 100) {
				requests.push({
					'method': 'POST',
					'api': '/k/v1/records.json',
					'payload': postDatas
				});
				// 初期化
				postDatas = $.extend(true, {}, post_template);
			}
		}

		// 残りのデータがある場合、リクエストに追加
		if (postDatas.records.length > 0) {
			requests.push({
				'method': 'POST',
				'api': '/k/v1/records.json',
				'payload': postDatas
			});
		}

		// 最新データのみを配列に変換
		kokyakuLatestMap.forEach((value) => {
			latestKokyakuData.push(value.record);
		});

		const nippoLinkageData = {
			'requests': requests,
			'latestKokyakuData': latestKokyakuData
		}

		return nippoLinkageData;
	};

	/**
	 * 必須入力チェック
	 * 　各フィールドの必須入力チェック設定は、config側で指定
	 * @param {Object} event
	 * @param {Object} postFields
	 * @return {boolean}
	*/
	function isErrorRequiredCheck(event, postFields) {
		var record = event.record;
		var table = record[cfgNippoFields.eigyoRepoto.code].value;
		var headerData = postFields.header;
		var detailData = postFields.detail;
		var isError = false;
		var rowCount = table.length;

		// ヘッダー部
		for (var i = 0; i < headerData.length; i++) {
			var code = headerData[i].source.code;
			var value = record[code].value;
			// 必須項目、かつ、値がセットされていない場合
			if (headerData[i].source.required && !value) {
				isError = true;
				//console.log('error : code [' + code + '] value [' + value + ']');
				record[code].error = cfgNippoMessages.emptyError;
			}
		}

		// 明細部の行
		for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
			var isBlankRow = true;

			// ブランク行かをチェック
			for (var colIndex = 0; colIndex < detailData.length; colIndex++) {
				var code = detailData[colIndex].source.code;
				var value = table[rowIndex].value[code].value;
				// 値が配列の場合
				if (sncLib.util.isArray(value)) {
					if (value.length > 0) {
						isBlankRow = false;
						break;
					}
				}
				else {
					if (value) {
						isBlankRow = false;
						break;
					}
				}
			}

			// 明細部のカラム
			for (var colIndex = 0; colIndex < detailData.length; colIndex++) {
				var code = detailData[colIndex].source.code;
				var value = table[rowIndex].value[code].value;

				// ブランク行ではない、かつ
				// 必須項目と設定されている、かつ、値が入力されていない場合、エラーとする
				if (!isBlankRow
					&& detailData[colIndex].source.required && !value) {
					isError = true;
					table[rowIndex].value[code].error = cfgNippoMessages.emptyError;
				}
			}
		}
		return isError;
	}

	/**
	 * 必須入力チェック
	 * 　各フィールドの必須入力チェック設定は、config側で指定
	 * @param {Object} record
	 * @return {boolean}
	*/
	function isErrorInputValue(record) {
		var table = record[cfgNippoFields.eigyoRepoto.code].value;
		var isError = false;
		var rowCount = table.length;
		var isError = false;

		// 明細部の行
		for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
			// 開始時刻
			var kaishiJikoku = table[rowIndex].value[cfgNippoFields.kaishijikoku.code].value;
			// 終了時刻
			var shuryoJikoku = table[rowIndex].value[cfgNippoFields.shuryojikoku.code].value;

			if (kaishiJikoku && shuryoJikoku) {
				if (sncLib.util.compareTime(kaishiJikoku, shuryoJikoku) < 0) {
					isError = true;
					table[rowIndex].value[cfgNippoFields.kaishijikoku.code].error = cfgNippoMessages.inputCheckJikoku;
					table[rowIndex].value[cfgNippoFields.shuryojikoku.code].error = cfgNippoMessages.inputCheckJikoku;
				}
			}
		}
		//console.log('isError : ');
		//console.log(isError);
		return isError;
	}

	/**
	 * スペースへラベルを表示
	 * @param {string} spaceFieldCode
	 * @param {string} labelName
	 */
	function setLabelOnSpace(spaceFieldCode, labelName) {
		// 営業活動レポートの情報がアプリ内に存在する場合、ラベルを表示
		var eigyoRepotoLabel = document.createElement('label');
		eigyoRepotoLabel.innerHTML = labelName;
		$(eigyoRepotoLabel).addClass('kintoneplugin-label');
		kintone.app.record.getSpaceElement(spaceFieldCode).appendChild(eigyoRepotoLabel);
	}

	/**
	 *
	 * レコード編集画面（新規、追加）の表示イベント
	 * レコード詳細画面、印刷画面の表示イベント
	 * 　フィールドの表示/非表示設定
	 * 　フィールドの入力可/否 を設定
	 *
	*/
	kintone.events.on([
		'app.record.create.show',
		'app.record.edit.show',
		'app.record.index.edit.show',
		'app.record.index.show',
		'app.record.detail.show',
		'app.record.print.show'
	], function (event) {
		var record = event.record;
		var loginUser = kintone.getLoginUser();
		// 詳細画面、印刷画面の場合
		if (event.type == 'app.record.detail.show' || event.type == 'app.record.print.show') {
			if (record[cfgNippoFields.eigyoRepoto.code].value.length == 0) {
				// 営業活動レポートの情報がアプリ内に存在しない場合、フィールドを非表示
				kintone.app.record.setFieldShown(cfgNippoFields.eigyoRepoto.code, false);
			} else {
				// 営業活動レポートの情報がアプリ内に存在する場合、ラベルを表示
				setLabelOnSpace(cfgNippoFields.eigyoRepotoSpace.code, cfgNippoFields.eigyoRepoto.name);
			}
		} else if (event.type == 'app.record.create.show' || event.type == 'app.record.edit.show') {
			if (event.type == 'app.record.create.show') {
				// ログインユーザーを担当者検索コードへセット
				record[cfgNippoFields.tantoshaSearch.code].value = loginUser.code;
				// ルックアップの値を取得
				record[cfgNippoFields.tantoshaSearch.code].lookup = true;
			}
			// 営業活動レポートの情報がアプリ内に存在する場合、ラベルを表示
			setLabelOnSpace(cfgNippoFields.eigyoRepotoSpace.code, cfgNippoFields.eigyoRepoto.name);
		}

		// ログインユーザーが管理アカウントではない場合
		if (config.kanriUsers.indexOf(loginUser.code) == -1) {
			// フィールドの表示/非表示設定
			sncLib.nok.util.setAppFieldsShown(cfgNippoFields);
			// レコード編集画面（新規、追加）の場合、
			// フィールドの入力可/否も設定する
			if (
				event.type == 'app.record.create.show'
				|| event.type == 'app.record.edit.show'
				|| event.type == 'app.record.index.edit.show'
			) {
				sncLib.nok.util.setAppFieldsDisabled(event.record, cfgNippoFields);
			}
		}
		return event;
	});

	/**
	 *
	 * レコード追加完了後、レコード編集完了後イベント
	 *   営業活動レポートアプリへの登録する情報の入力チェック
	 *
	*/
	kintone.events.on([
		'app.record.create.submit',
		'app.record.edit.submit'
	], function (event) {
		// 営業稼動レポートへの登録情報の入力チェック
		if (isErrorRequiredCheck(event, configEigyoRepotoLinkage.fields)) {
			event.error = cfgNippoMessages.requiredError;
			return event;
		}

		// 入力チェック
		if (isErrorInputValue(event.record)) {
			event.error = cfgNippoMessages.inputCheckError;
			return event;
		}
	});

	/**
	 *
	 * レコード追加完了後、レコード編集完了後イベント
	 *   営業活動レポートアプリへの登録処理
	 *   営業活動レポートアプリからの取得処理
	 *   顧客管理アプリへの更新処理
	 *
	*/
	kintone.events.on([
		'app.record.create.submit.success',
		'app.record.edit.submit.success'
	], async function (event) {
		try {
			let record = event.record;
			// 日報アプリからの連携データを定義
			let nippoLinkageData = {
				'requests': [],
				'latestKokyakuData': []
			};

			// 営業活動レポートアプリへの連携項目が「営業報告TB」に1つでも存在する場合
			// 営業レポートアプリへの更新情報を作成及び「営業報告TB」内の顧客ごとの最新データを作成して格納
			nippoLinkageData = createEigyoRepotoData(record, record[cfgNippoFields.eigyoRepoto.code].value, configEigyoRepotoLinkage.fields);

			// 日報登録アプリの更新情報を格納
			// サブテーブルの情報を削除する
			nippoLinkageData.requests.push({
				'method': 'PUT',
				'api': '/k/v1/record.json',
				'payload': {
					'app': cfgNippo.app,
					'id': record[cfgNippoFields.recordId.code].value,
					'revision': record[cfgNippoFields.revision.code].value,
					'record': {
						[cfgNippoFields.eigyoRepoto.code]: {
							'value': []
						}
					}
				}
			});

			// 以下リクエストを実行
			// ・営業活動レポートアプリへの登録
			// ・日報登録アプリのサブテーブル更新
			// 以下リクエストを作成して、リクエストを実行
			// ・営業活動レポートアプリからの取得⇒顧客管理アプリへの更新
			await sncLib.eigyoKokyakuLinkage(event, config, configLinkage, '', nippoLinkageData);

		} catch (error) {
			console.log(error);
			return Swal.fire({
				icon: 'error',
				title: cfgNippoMessages.exceptionError
			}).then(function () {
				return event;
			});
		}

		return event;

	});

	/**
	 * フィールド変更イベント（新規、編集、一覧編集）
	 *   「開始時刻」が変更されたタイミング
	 *   「終了時刻」へ「開始時刻＋N分」の値をセット
	 * 　　　Nはconfig側のoffsetMinutesにて設定
	 *    ※関連レコード一覧の条件に文字列（自動計算）を指定している場合、
	 * 　　 return eventにより関連レコード一覧の内容がクリアされる。
	 * 　　 自動計算の変わりにJSにて自動計算を実装
	*/
	kintone.events.on([
		'app.record.create.change.' + cfgNippoFields.kaishijikoku.code,
		'app.record.edit.change.' + cfgNippoFields.kaishijikoku.code,
		'app.record.index.edit.change.' + cfgNippoFields.kaishijikoku.code
	], function (event) {
		//console.log(event);
		var row = event.changes.row;
		//console.log(row);
		var kaishi = row.value[cfgNippoFields.kaishijikoku.code].value;

		// 「開始時刻」の入力、数値チェック
		if (kaishi) {
			var min = sncLib.util.strToMin(kaishi) + cfgNippo.offsetMinutes;
			// 開始時刻+N分が24時を超えるかを設定
			if (min >= 24 * 60) {
				// 23時59分となるように調整
				min = 24 * 60 - 1;
			}
			var shuryo = sncLib.util.minToStr(min);
			//console.log(shuryo);
			row.value[cfgNippoFields.shuryojikoku.code].value = shuryo;
			return event;
		}
	});

	/**
	 * フィールド変更イベント（新規、編集、一覧編集）
	 *   「活動日」、「社員ID」が変更されたタイミング
	 *   「日報ID」へ「活動日＋社員ID」の値をセット
	*/
	kintone.events.on([
		'app.record.create.change.' + cfgNippoFields.katsudobi.code,
		'app.record.edit.change.' + cfgNippoFields.katsudobi.code,
		'app.record.index.edit.change.' + cfgNippoFields.katsudobi.code,
		'app.record.create.change.' + cfgNippoFields.tantoshaId.code,
		'app.record.edit.change.' + cfgNippoFields.tantoshaId.code,
		'app.record.index.edit.change.' + cfgNippoFields.tantoshaId.code
	], function (event) {
		var record = event.record;
		var katsudobi = record[cfgNippoFields.katsudobi.code].value;
		var tantoshaId = record[cfgNippoFields.tantoshaId.code].value;
		var nippoId = '';
		if (katsudobi && tantoshaId) {
			nippoId = sncLib.nok.data.createNippoId(katsudobi, tantoshaId);
		}
		record[cfgNippoFields.nippoId.code].value = nippoId;
		return event;
	});

})(jQuery, window.nokConfig, window.eigyoRepotoLinkageConfig, window.kokyakuLinkageConfig, window.snc);
