/**
 * @fileoverview 営業活動レポートアプリ　カレンダー表示設定情報
 * @author SNC
 * @version 4.0.1
 * @customer XXXXX（2023-01-31）
 */
(function (config) {
	'use strict';
	// 色設定
	var colorValue = {
		"black": "#000000",
		"silver": "#c0c0c0",
		"gray": "#808080",
		"white": "#FFFFFF",
		"maroon": "#800000",
		"red": "#A40000",
		"purple": "#800080",
		"fuchsia": "#ff00ff",
		"green": "#008000",
		"lime": "#00ff00",
		"olive": "#808000",
		"orange": "#F0670F",
		"yellow": "#f8b500",
		"navy": "#000080",
		"blue": "#0000ff",
		"teal": "#008080",
		"aqua": "#00ffff"
	};

	const cfgEigyoRepotoFields = config.eigyoRepoto.fields;

	// グローバル変数 カレンダー設定
	window.calendarConfig = window.calendarConfig || {
		// FullCalendar設定
		FullCalendarSetting: {
			//customViewID: 5289689,
			// 個人スケジュール
			personalCustomViewID: 5708009,
			// パターンスケジュール
			patternCustomViewID: 5708011,
			customViewName: '#calendar',
			viewName: 'timelineWeek',
			changeViewName: 'timelineWeek',
			schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
			nowIndicator: true,
			//editable : true, // enable draggable events
			lazyFetching: false,
			height: 'auto',
			contentHeight: 'auto',
			aspectRatio: 1.7,
			scrollTime: '00:00', // undo default 6am scrollTime
			editable: false,
			selectable: false,
			lang: 'ja',
			header: {
				left: 'today prev,next',
				center: 'title',
				right: 'month,timelineWeek,timelineDay'
			},
			views: {
				timelineDay: {
					type: 'timeline',
					titleFormat: 'YYYY年 M月 D日[(]ddd[)]',
					slotLabelFormat: ['H時']
				},
				timeline2Week: {
					type: 'timeline',
					duration: { days: 90 },
					slotDuration: { days: 1 },
					titleFormat: 'YYYY年 M月 D日',
					slotLabelFormat: ['D日 [(]ddd[)]']
				},
				timelineWeek: {
					type: 'timeline',
					duration: { days: 7 },
					slotDuration: { days: 1 },
					titleFormat: 'YYYY年 M月 D日',
					slotLabelFormat: ['D日 [(]ddd[)]']
				},
				timelineMonth: {
					type: 'timeline',
					titleFormat: 'YYYY年 M月',
					slotDuration: { days: 1 },
					slotLabelFormat: ['D日 [(]ddd[)]']
				}
			},
			// 各カレンダーの１日毎の表記方法
			columnFormat: {
				month: 'ddd',
				week: 'D[(]ddd[)]',
				day: 'M/D[(]ddd[)]'
			},
			// 各カレンダーのタイトル
			titleFormat: {
				month: 'YYYY年 M月',
				week: "YYYY年 M月 D日",
				day: "YYYY年 M月 D日[(]ddd[)]"
			},
			// ボタン文字列の表記
			buttonText: {
				prev: '＜',
				next: '＞',
				prevYear: '前年',
				nextYear: '翌年',
				today: '今日',
				month: '月',
				week: '週',
				day: '日',
				timelineDay: '日',
				timelineWeek: '週',
				timelineMonth: '月',
			},
			//開始する曜日の設定(0：日曜日、1：月曜日、2：火曜日、3：水曜日、4：木曜日、5：金曜日、6：土曜日)
			firstDay: '0',
			// 週末（土日）を表示
			weekends: true,
			// 月の表記（名称）
			monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			// 月の表記（略称）
			monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			// 曜日の表記（名称）
			dayNames: ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'],
			// 曜日の表記（略称）
			dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
			// スロットの時間の書式
			axisFormat: 'H:mm',
			// 時間の書式
			timeFormat: 'H:mm',
			// 時間の表示
			displayEventTime: true,
			// 終了時間の表示
			displayEventEnd: {
				month: false,
				basicweek: false,
				"default": false
			},
			// スケジュールが重なったときの表示方法（true：重ねて表示、 false：重ねずに表示）
			slotEventOverlap: false,
			//agendaWeek、agendaDayの1時間4セル（15分間隔）で表示
			slotDuration: '00:15:00',
			//開始（終了）時間がない場合の設定
			defaultTimedEventDuration: '08:00:00',
			//スクロール開始時間
			scrollTime: '08:00:00',
			//スクロール時間の最大、最小の設定
			minTime: '00:00:00',
			maxTime: '24:00:00',
			resourceLabelText: '顧客担当者',
			// 終日予定の表示（true：表示、 false：非表示）
			allDaySlot: true,
			allDayText: '終日',
			// 幅表示
			resourceAreaWidth: '330',
			columnHeader: [
				{
					group: true,
					labelText: '拠点',
					field: 'col1',
					width: '70'
				},
				{
					group: true,
					labelText: '部署',
					field: 'col2',
					width: '130'
				},
				{
					labelText: '担当者',
					field: 'col3',
					width: '130'
				}
			],
			fcTitle: {
				fontSize: '1.2em'
			},
			fcToolbar: {
				fontSize: '18pt',
				fontWeight: 'bold'
			},
			// オブジェクトへ表示する項目
			titleOption: {
				separator: " : ",
				items: [
					cfgEigyoRepotoFields.kokyakumei.code,			// 顧客名
					cfgEigyoRepotoFields.homonMokuteki.code,		// 訪問目的
				]
			},
			itemOption: {
				eventDataColor: colorValue.teal,
				eventDataTextColor: colorValue.white,
				eventDataBorderColor: colorValue.white,
				items: [
					{
						value: "予定",
						color: colorValue.green,       // 背景色
						textColor: colorValue.white,   // 文字色
						borderColor: colorValue.white, // 枠色
					},
					{
						value: "実績",
						color: colorValue.blue,
						textColor: colorValue.white,
						borderColor: colorValue.white,
					},
					{
						value: "未定",
						color: colorValue.black,
						textColor: colorValue.white,
						borderColor: colorValue.white,
					}
				]
			}
		}
	};
})(window.nokConfig);
