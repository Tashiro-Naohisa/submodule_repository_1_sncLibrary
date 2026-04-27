/**
 * @fileoverview 営業活動レポートのスケジュール表示
 * - リソース：ビューアプリを参照し、ログインユーザーに紐づく人員を取得
 * - イベント：リソースとして取得した人員の営業活動レポート内のレコード
 *
 * 【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * moment.min.js 2.13.0
 * luxon.min.js -v3.1.1
 * fullcalendar.min.js -v2.7.1
 * scheduler.min.js -v1.3.1
 * lang-all.js
 * config.nok.js -v4.0.1
 * config.eigyoRepoto-schedule.js -v4.0.1
 *
 * [CSS]
 * fullcalendar.min.css -v2.7.1
 * scheduler.min.css -v1.3.1
 * 51-us-default.css
 *
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（yyyy-mm-dd）
*/
jQuery.noConflict();
(function ($, config, configCal, sncLib) {
	'use strict';

	var appPathArray = location.pathname.split('/');
	appPathArray.splice(-1);
	var appPath = appPathArray.join('/') + '/';
	// イベントデータ格納用配列
	var evt = [];
	// リソースデータ格納用配列
	var rsrcs = [];
	// ID格納用配列
	var ids = [];
	// スケジュール表示用マップ
	// キー：recordNo、バリュー：[リソースデータのオブジェクト]
	var scheduleResourceMap = {};
	// カレンダーの日付
	var viewDate;
	// カレンダーの表示タイプ
	var viewType;
	var tzOffset = (new Date()).getTimezoneOffset() / 60;

	/**
	 * 一覧表示イベント
	 * 指定したカスタマイズビューの場合、カレンダーを表示
	 */
	kintone.events.on(
		'app.record.index.show'
		, function (event) {
			// リソース情報の初期化
			rsrcs = [];
			// セレクトボックスの設定
			setTargetSelectBox(event.viewId);
		});

	/**
	 * イベント情報（カレンダー表示情報）の取得
	 * @param {string} startDate
	 * @param {string} endDate
	 * @param {Object} callback
	 * @param {number} offset
	 */
	function getEventsData(startDate, endDate, callback, offset) {
		var limit = 500;
		var s_startDate, s_endDate;

		const startYear = startDate.getFullYear();
		const startMonth = startDate.getMonth();
		const startDay = startDate.getDate();
		const startHour = startDate.getHours();
		const startMinute = startDate.getMinutes();
		const startSecond = startDate.getSeconds();
		const endYear = endDate.getFullYear();
		const endMonth = endDate.getMonth();
		const endDay = endDate.getDate();
		const endHour = endDate.getHours();
		const endMinute = endDate.getMinutes();
		const endSecond = endDate.getSeconds();

		s_startDate = startYear + '-' + Number(startMonth + 1) + '-' + startDay + 'T00' + ':0' + startMinute + ':0' + startSecond + '+0' + startHour + ':0' + startMinute;
		s_endDate = endYear + '-' + Number(endMonth + 1) + '-' + endDay + 'T00' + ':0' + endMinute + ':0' + endSecond + '+0' + endHour + ':0' + endMinute;

		// クエリ文字列を取得するを取得
		var condition = kintone.app.getQueryCondition();
		if (condition) {
			// クエリ文字列が存在する場合
			condition += ' and ';
		}
		var appId = kintone.app.getId();
		var fields = config.eigyoRepoto.fields;
		var query = condition + fields.katsudobi.code + ' >= "' + s_startDate + '" '
			+ 'and ' + fields.katsudobi.code + ' <= "' + s_endDate + '" ';
		var queryShainId = '';
		for (var i = 0; i < rsrcs.length; i++) {
			if (queryShainId == '') {
				queryShainId = 'and ( ';
			} else {
				queryShainId += 'or ';
			}
			queryShainId += fields.tantoshaId.code + ' = "' + rsrcs[i]['id'] + '" ';

			if (i == rsrcs.length - 1) {
				queryShainId += ' ) ';
			}
		}

		var order = 'order by ' + fields.katsudobi.code + ' asc limit ' + limit + ' offset ' + offset;
		query = query + queryShainId + order;

		kintone.api(kintone.api.url('/k/v1/records', true), 'GET', { app: appId, query: query }, function (resp) {
			for (var i = 0; i < resp.records.length; i++) {
				var record = resp.records[i];
				// スケジュール表示用　開始時刻、終了時刻を設定
				var kaishijikoku = (record[fields.kaishijikoku.code].value) ? record[fields.kaishijikoku.code].value : '00:00';
				var shuryojikoku = (record[fields.shuryojikoku.code].value) ? record[fields.shuryojikoku.code].value : '24:00';
				var refStartDate = record[fields.katsudobi.code].value + 'T' + kaishijikoku + ':00';
				var refEndDate = record[fields.katsudobi.code].value + 'T' + shuryojikoku + ':00';

				if (!refStartDate) {
				} else {
					var objUrl = appPath + 'show#record=' + record[fields.recordId.code].value;
					var objTitle = '';
					objTitle = createTitle(record, configCal.FullCalendarSetting.titleOption);
					// 背景色の設定
					var color = configCal.FullCalendarSetting.itemOption.eventDataColor;
					// 枠色設定
					var borderColor = configCal.FullCalendarSetting.itemOption.eventDataBorderColor;
					// 文字色の設定
					var textColor = configCal.FullCalendarSetting.itemOption.eventDataTextColor;
					// 色変更用のオブジェクト設定
					var calItems = configCal.FullCalendarSetting.itemOption.items;
					var colors = {};
					colors = getEventDataColors(record, fields.yoteiJisseki.code, calItems, color, textColor, borderColor);

					var obj = {
						'id': record[fields.recordId.code].value,
						'title': objTitle,
						'start': refStartDate,
						'end': refEndDate,
						'color': colors.color,
						'borderColor': borderColor,
						'resourceId': record[fields.tantoshaId.code].value,
						'url': objUrl,
						'textColor': colors.textColor,
					};
					evt.push(obj);
				}
			}
			if (resp.records.length == limit) {
				getEventsData(startDate, endDate, callback, offset + limit);
			} else {
				callback(evt);
			}
		}, function (resp) {
			return false;
		});
	};

	/**
	 * カレンダー内の要素へ表示する文字列を設定
	 * @param {Object} kintoneRecord
	 * @param {Object} titleOption
	 */
	function createTitle(kintoneRecord, titleOption) {
		var titleItems = titleOption.items;
		var separator = titleOption.separator;
		var title = '';
		for (var i = 0; i < titleItems.length; i++) {
			// 表示項目がセットされているかを確認
			if (kintoneRecord[titleItems[i]].value) {
				if (title != '') {
					// 表示項目がある場合は、セパレーターを追加
					title += separator;
				}
				title += kintoneRecord[titleItems[i]].value;
			}
		}
		return title;
	};

	/**
	 * カレンダー内の要素へ設定する背景色を設定
	 * @param {Object} kintoneRecord
	 * @param {string} targetFieldCode
	 * @param {Object} items
	 * @param {string} color
	 * @param {string} textColor
	 * @return {Object}
	 */
	function getEventDataColors(kintoneRecord, targetFieldCode, items, color, textColor, borderColor) {
		var colors = {
			'color': color,
			'textColor': textColor,
			'borderColor': borderColor,
		}
		for (var i = 0; i < items.length; i++) {
			if (kintoneRecord[targetFieldCode].value === items[i].value) {
				checkObjectExist(colors, items[i]);
				break;
			}
		}
		return colors;
	};

	/**
	 * items内にkeyが存在している場合に、confnigに設定した色をセット
	 * @param {Object} colors
	 * @param {string} items
	 */
	function checkObjectExist(colors, items) {
		let itemKeys = Object.keys(items);
		for (let i = 0; i < itemKeys.length; i++) {
			let key = itemKeys[i];
			if (items[key]) {
				colors[key] = items[key];
			}
		}
	};

	/**
	 * スケジュール表示対象を選択するセレクトボックスのイベント設定
	 * @param {*} select
	 * @param {*} viewId
	 */
	function setChangeTargetSelectEvent(select, viewId) {
		// セレクトチェンジイベント
		select.onchange = function () {
			rsrcs = [];
			switch (viewId) {
				case configCal.FullCalendarSetting.personalCustomViewID:
					rsrcs.push(scheduleResourceMap[$(this).val()][0]);
					break;
				case configCal.FullCalendarSetting.patternCustomViewID:
					var users = scheduleResourceMap[$(this).val()];
					for (var i = 0; i < users.length; i++) {
						rsrcs.push(users[i]);
					}
					break;
				default:
					break;
			}
			// 表示しているカレンダーの表示タイプ
			viewType = $(configCal.FullCalendarSetting.customViewName).fullCalendar('getView').type;
			// 表示しているカレンダーの日付
			viewDate = $(configCal.FullCalendarSetting.customViewName).fullCalendar('getDate');
			$(configCal.FullCalendarSetting.customViewName).fullCalendar('destroy');
			showFullCalendar();
		};
	};

	/**
	 * スケジュール表示対象を選択するセレクトボックス要素を取得
	 */
	function getTargetSeletBoxElm() {

		// kintoneヘッダ部分に埋め込む要素の重複を避けるため、最初に要素をクリア
		var aNode = kintone.app.getHeaderMenuSpaceElement()
		for (var i = aNode.childNodes.length - 1; i >= 0; i--) {
			aNode.removeChild(aNode.childNodes[i]);
		}

		var outerDiv = document.createElement('div');
		$(outerDiv).addClass('kintoneplugin-select-outer');
		var selectDiv = document.createElement('div');
		$(selectDiv).addClass('kintoneplugin-select');
		outerDiv.appendChild(selectDiv);
		var select = document.createElement('select');
		selectDiv.appendChild(select);

		kintone.app.getHeaderMenuSpaceElement().appendChild(document.createTextNode('　'));
		kintone.app.getHeaderMenuSpaceElement().appendChild(document.createTextNode('　'));
		kintone.app.getHeaderMenuSpaceElement().appendChild(outerDiv);

		return select;
	};

	/**
	 * スケジュール表示対象を選択するセレクトボックスを設定
	 * @param {*} viewId
	 */
	function setTargetSelectBox(viewId) {
		// ログインユーザーのアカウントを取得
		var loginUserCode = kintone.getLoginUser().code;
		// リソースマップの初期化
		scheduleResourceMap = {};

		// 個人スケジュール
		if (viewId === configCal.FullCalendarSetting.personalCustomViewID) {
			var select = getTargetSeletBoxElm();
			return new kintone.Promise(function (resolve, reject) {
				// 担当者アプリより選択肢に表示する社員情報を取得
				resolve(sncLib.kintone.rest.getAllRecordsOnRecordId(config.tantosha.app, ''));
			}).then(function (resp) {
				var respRecords = resp;
				for (var i = 0; i < respRecords.length; i++) {
					var user = respRecords[i];
					var recordNo = user[config.tantosha.fields.recordNo.code].value;
					// スケジュール表示用ID
					var userId = user[config.tantosha.fields.tantoshaId.code].value;
					// スケジュール表示用タイトル
					var userTitle = user[config.tantosha.fields.tantoshaMei.code].value;
					// id, 表示する列情報をセット
					var obj = {
						'id': userId,
						'col1': user[config.tantosha.fields.kyoten.code].value,
						'col2': user[config.tantosha.fields.busho.code].value,
						'col3': userTitle
					};
					// 初期表示時はログインユーザー表示
					if (userId === loginUserCode) {
						rsrcs.push(obj);
						$(select).append($('<option value="' + recordNo + '" selected = "selected">' + userTitle + '</option>'));
					} else {
						$(select).append($('<option value="' + recordNo + '">' + userTitle + '</option>'));
					}
					scheduleResourceMap[recordNo] = [obj];
				}
				// セレクトチェンジイベント
				setChangeTargetSelectEvent(select, viewId);
				// カレンダー表示
				showFullCalendar();
			}).catch(function (error) {
				alert(error.message);
			});
		}
		// パターンスケジュール
		else if (viewId === configCal.FullCalendarSetting.patternCustomViewID) {
			var select = getTargetSeletBoxElm();
			return new kintone.Promise(function (resolve, reject) {
				// スケジュール表示設定アプリからパターン情報を取得
				var query = config.view.fields.acountId.code + ' in ( "' + loginUserCode + '" )';
				resolve(sncLib.kintone.rest.getAllRecordsOnRecordId(config.view.app, query));
			}).then(function (resp) {
				var respRecords = resp;
				for (var i = 0; i < respRecords.length; i++) {
					var record = respRecords[i];
					var recordNo = record[config.view.fields.recordNo.code].value;
					var patternName = record[config.view.fields.hyojiMeisho.code].value;

					// レコード内のサブテーブルを指定
					var userList = record[config.view.fields.tantoshaTable.code].value;
					var userRsrcsList = []
					for (var j = 0; j < userList.length; j++) {
						var user = userList[j].value;
						// スケジュール表示用ID
						var userId = user[config.view.fields.tantoshaId.code].value;
						// スケジュール表示用タイトル
						var userTitle = user[config.view.fields.name.code].value;
						// id, 表示する列情報をセット
						var obj = {
							'id': userId,
							'col1': user[config.view.fields.shozoku01.code].value,
							'col2': user[config.view.fields.shozoku02.code].value,
							'col3': userTitle
						};
						// 初期表示時は先頭を表示
						if (i === 0) {
							rsrcs.push(obj);
						}
						userRsrcsList.push(obj);
					}

					$(select).append($('<option value="' + recordNo + '">' + patternName + '</option>'));
					scheduleResourceMap[recordNo] = userRsrcsList;
				}
				// セレクトチェンジイベント
				setChangeTargetSelectEvent(select, viewId);
				// カレンダー表示
				showFullCalendar();
			}).catch(function (error) {
				alert(error.message);
			});
		}
	};

	/**
	 * カレンダーを表示する
	 */
	function showFullCalendar() {
		if (rsrcs.length == 0) {
			alert(window.messageList.schedule.getViewError);
			return;
		}

		// schedulerの一日表示
		var viewName = configCal.FullCalendarSetting.viewName;
		$(configCal.FullCalendarSetting.customViewName).fullCalendar({
			schedulerLicenseKey: configCal.FullCalendarSetting.schedulerLicenseKey,
			header: configCal.FullCalendarSetting.header,
			views: configCal.FullCalendarSetting.views,
			editable: configCal.FullCalendarSetting.editable,
			lang: configCal.FullCalendarSetting.lang,
			// 列の書式
			//columnFormat : configCal.FullCalendarSetting.columnFormat,
			// タイトルの書式
			titleFormat: configCal.FullCalendarSetting.titleFormat,
			// 月名称
			monthNames: configCal.FullCalendarSetting.monthNames,
			// 月略称
			monthNamesShort: configCal.FullCalendarSetting.monthNamesShort,
			// 曜日名称
			dayNames: configCal.FullCalendarSetting.dayNames,
			// 曜日略称
			dayNamesShort: configCal.FullCalendarSetting.dayNamesShort,
			// スロットの時間の書式
			axisFormat: configCal.FullCalendarSetting.axisFormat,
			// 時間の書式
			timeFormat: configCal.FullCalendarSetting.timeFormat,
			// 時間の表示
			displayEventTime: configCal.FullCalendarSetting.displayEventTime,
			// 終了時間の表示
			displayEventEnd: configCal.FullCalendarSetting.displayEventEnd,
			// ボタン文字列
			buttonText: configCal.FullCalendarSetting.buttonText,
			//開始する曜日の設定
			firstDay: configCal.FullCalendarSetting.firstDay,
			//土日表示
			weekends: configCal.FullCalendarSetting.weekends,
			//終日スロットル表示
			allDaySlot: configCal.FullCalendarSetting.allDaySlot,
			//終日スロットルタイトル
			allDayText: configCal.FullCalendarSetting.allDayText,
			//agendaWeek、agendaDayの1時間の分割数
			slotDuration: configCal.FullCalendarSetting.slotDuration,
			//開始（終了）時間がない場合の設定
			defaultTimedEventDuration: configCal.FullCalendarSetting.defaultTimedEventDuration,
			//スクロール開始時間
			scrollTime: configCal.FullCalendarSetting.scrollTime,
			//スクロール時間の最大の設定
			minTime: configCal.FullCalendarSetting.minTime,
			//スクロール時間の最小の設定
			maxTime: configCal.FullCalendarSetting.maxTime,
			selectable: configCal.FullCalendarSetting.selectable,
			nowIndicator: configCal.FullCalendarSetting.nowIndicator,
			lazyFetching: configCal.FullCalendarSetting.lazyFetching,
			height: configCal.FullCalendarSetting.height,
			contentHeight: configCal.FullCalendarSetting.contentHeight,
			aspectRatio: configCal.FullCalendarSetting.aspectRatio,
			//scrollTime : configCal.FullCalendarSetting.scrollTime, // undo default 6am scrollTime
			defaultView: viewName,
			//views : configCal.FullCalendarSetting.views,
			slotEventOverlap: configCal.FullCalendarSetting.slotEventOverlap,
			//resourceLabelText : configCal.FullCalendarSetting.resourceLabelText,

			// リソースの表示幅
			resourceAreaWidth: configCal.FullCalendarSetting.resourceAreaWidth,
			// リソースのカラム情報を表示
			resourceColumns: configCal.FullCalendarSetting.columnHeader,
			// リソース情報を表示
			resources: rsrcs,
			// イベント情報を表示
			events: function (start, end, timezone, callback) {

				// タイトル部分の表示を変更
				$('.fc-title').css('font-size', configCal.FullCalendarSetting.fcTitle.fontSize);
				$('#calendar .fc-toolbar h2').css({
					fontSize: configCal.FullCalendarSetting.fcToolbar.fontSize,
					fontWeight: configCal.FullCalendarSetting.fcToolbar.fontWeight
				});
				// 登録レコードを取得
				evt = [];
				getEventsData(start._d, end._d, callback, 0);
			},
			// イベントをクリックしたときに実行
			eventClick: function (event) {
				if (event.url) {
					window.open(event.url);
					return false;
				}
			},
			// イベント外（日）をクリックしたときに実行
			dayClick: function (date, jsEvent, view) {
				if (
					view.type == 'month'
					//	|| view.type == 'timelineMonth'
					//	|| view.type == 'timelineWeek'
				) {
					// 月表示の場合は、クリックした日へ遷移
					$('#calendar').fullCalendar('gotoDate', date);
					$('#calendar').fullCalendar('changeView', configCal.FullCalendarSetting.changeViewName);
				}
			},
			eventAfterAllRender: function (view) {
				if (view.type == 'month') {
					// 月表示の場合は、height、contentHeightを初期化
					$('#calendar').fullCalendar('option', 'height', '');
					$('#calendar').fullCalendar('option', 'contentHeight', '');
				}
				else {
					// 月表示以外は、height、contentHeightを自動調整
					$('#calendar').fullCalendar('option', 'height', 'auto');
					$('#calendar').fullCalendar('option', 'contentHeight', 'auto');
				}
			},
			viewRender: function (view, element) {
			}

		});

		// 前回表示していた日付、表示タイプを設定
		if (viewDate) {
			// 日付
			const Year = viewDate._i[0];
			const Month = viewDate._i[1];
			var MonthPlus = Number(Month + 1);
			var Months = ('00' + MonthPlus).slice(-2);
			const Day = viewDate._i[2];
			var Days = ('00' + Day).slice(-2);
			const Hour = viewDate._i[3];
			const Minute = viewDate._i[4];
			const Second = viewDate._i[5];
			var s_viewDate1 = Year + '-' + Months + '-' + Days + 'T' + Hour + ':' + Minute + ':' + Second + '+09:00';

			$(configCal.FullCalendarSetting.customViewName).fullCalendar('gotoDate', s_viewDate1);
			// 表示タイプ
			$(configCal.FullCalendarSetting.customViewName).fullCalendar('changeView', viewType);
		};
	};

})(jQuery, window.nokConfig, window.calendarConfig, window.snc);
