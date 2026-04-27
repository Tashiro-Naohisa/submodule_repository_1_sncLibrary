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
 *
 * @author SNC
 * @version 4.5.1
 * @customer XXXXX（yyyy-mm-dd）
*/
jQuery.noConflict();
(function ($, nokChart, sncLib) {
    'use strict';
    const DATA_DURATION = 12;    // months

    let config = null;

    let cfgYojitsu = null;
    let cfgYojitsuFields = null;

    let cfgAnken = null;
    let cfgAnkenFields = null;

    let cfgTantosha = null;
    let cfgTantoshaFields = null;

    let cfgGraph = null;
    let cfgGraphFields = null;
    let cfgGraphTypes = null;

    let cfgPortalSetting = null;
    let cfgPortalSettingFields = null;

    let configPortal = null;

    const hyojiTaisho = {
        KOJIN: '個人',
        SOSIKI: '組織',
        ALL: '全体'
    }

    const jiku = {
        MONTH: '月',
        TANTOSHA: '担当者',
        SOSIKI: '組織'
    }

    const atai = {
        URIAGE: '売上',
        ARARI: '粗利',
        KENSU: '件数'
    }

    const summaryPatternToGetsu = {
        MIKOMI: 0,
        JISSEKI_MIKOMI: 1
    }

    // グローバル変数
    window.portal = window.portal || {
        processRenderPortal: function (event, cfg, cfgPortal) {

            config = cfg;   // アプリ全体コンフィグ

            configPortal = cfgPortal;   // ポータルのコンフィグ

            // コンフィグを取得
            cfgYojitsu = config.yojitsu;
            cfgYojitsuFields = cfgYojitsu.fields;

            cfgAnken = config.anken;
            cfgAnkenFields = cfgAnken.fields;

            cfgTantosha = config.tantosha;
            cfgTantoshaFields = cfgTantosha.fields;

            cfgGraph = config.graph;
            cfgGraphFields = cfgGraph.fields;
            cfgGraphTypes = cfgGraph.types;

            cfgPortalSetting = config.portalSetting;
            cfgPortalSettingFields = cfgPortalSetting.fields;


            // アプリとグラフ表示処理
            // ログインユーザーのIDを取得する
            const loginUser = kintone.getLoginUser();
            const loginId = loginUser.code;
            new kintone.Promise(function (resolve, reject) {
                resolve(getTantoshaRecord(loginId))
            }).then(function (results) {
                if (results.length < 1) {
                    showErrorMessage('担当者レコードを取得できませんでした。');
                    return false;
                }

                const activeTantosha = results[0];
                const activePortalId = activeTantosha[cfgTantoshaFields.portalId.code].value;

                // ポータル設定アプリから設定した情報
                //  担当者マスタに登録されている「nok_ポータルID」フィールドを元に、
                //   ポータル設定アプリのメニュー情報、グラフ情報を取得する
                return new kintone.Promise(function (resolve, reject) {
                    resolve(getPortalSettingRecord(activePortalId))
                }).then(function (results) {

                    if (results.length < 1) {
                        return false;
                    }

                    const portalSettingRecord = results[0];

                    // 1-1. メニュー管理情報を取得
                    // ポータル設定アプリのメニューパターンの情報（表示順を含め）を取得
                    const menuPatternSubTable = portalSettingRecord[cfgPortalSettingFields.menuPattern.code].value;
                    // メニュー情報（具体的に、メニュー検索キー）があるレコードのみ、抽出する
                    const filteredMenuPatternSubTable = menuPatternSubTable.filter(function (menuRow) {
                        return (menuRow.value[cfgPortalSettingFields.menuSearch.code].value);
                    });

                    // 1-２. メニューのアイコン表示
                    renderMenu(filteredMenuPatternSubTable);

                    // 2-1. グラフ管理情報を取得
                    // ポータル設定アプリのグラフパターンレコード（グラフの段、表示順と大きさを含め）を取得
                    const graphPatternSubTable = portalSettingRecord[cfgPortalSettingFields.graphPattern.code].value;
                    // グラフ情報（具体的に、グラフ検索キー）があるレコードのみ、抽出する
                    const filteredGraphPatternSubTable = graphPatternSubTable.filter(function (graphRow) {
                        return (graphRow.value[cfgPortalSettingFields.graphSearch.code].value);
                    });

                    // 2-２. グラフ表示
                    renderGraph(filteredGraphPatternSubTable, loginId);
                }).catch(function (error) {
                    showErrorMessage(error);
                });
            }).catch(function (error) {
                showErrorMessage(error);
            });

            return event;
        },



        /**
         * 検索項目と結果表示のレイアウト作成
         * @returns HTMLレイアウト
         */
        createHeaderLayout: function () {
            return `
                <div>
                <div class="w3-bar w3-black nok-tab-switch">
                    <button class="tab-button active" data-tabname="nok-portal-tab">個人ポータル</button>
                    <button class="tab-button" data-tabname="kintone-portal-tab">既存ポータル</button>
                </div>
                <div class="nok-portal-outer">
                    <div class="nok-portal-middle">
                        <div class="nok-portal-inner">
                            <div id="tab1" class="dashboard-layout">
                            <div id="nok-app-list"></div>
                            </div>
                        </div>
                    </div>
                    <div class="nok-portal-middle">
                        <div class="nok-portal-inner">
                            <div id="nok-graph-list"></div>
                        </div>
                    </div>
                </div>
                </div>
            `
        }
    }

    /**
     * 担当者マスタの「nok_ポータルID」フィールドと一致するレコードを取得する
     * @param {string} loginId
     * @returns 担当者マスターレコードのPromiseオブジェクト
     */
    function getTantoshaRecord(loginId) {
        let query = cfgTantoshaFields.tantoshaId.code + ' = "' + loginId + '"';

        return sncLib.kintone.rest.getRecord(cfgTantosha.app, query);
    }

    /**
     * ・取得したレコードの「nok_ポータルID」フィールドを元に、ポータル設定アプリ情報を取得
     * @param {string} portalId
     * @returns ポータル設定レコードのPromiseオブジェクト
     */
    function getPortalSettingRecord(portalId) {
        let query = cfgPortalSettingFields.portalId.code + ' = "' + portalId + '"';

        return sncLib.kintone.rest.getRecord(cfgPortalSetting.app, query);
    }

    /**
     * スペースのトップ画面の上側の空白部分に取得したメニューパターン情報を表示順でスペースに表示する
     * @param {array} menuPatternSubTable
     */
    function renderMenu(menuPatternSubTable) {
        // メニューが設定されない場合、表示しない
        if (menuPatternSubTable.length === 0) {
            $('#nok-app-list').parents('.nok-portal-middle').hide();
            return;
        }

        // 表示段でレコードをグループする
        const menuGroupedByHyojidan = menuPatternSubTable.reduce(function (groupedObj, currentObj) {
            const valueObj = currentObj.value;
            let key = valueObj[cfgPortalSettingFields.menuDan.code].value;
            if (!groupedObj[key]) {
                groupedObj[key] = [];
            }
            groupedObj[key].push(valueObj);
            return groupedObj;
        }, {});

        // オブジェクトのキーリスト（段のリスト）を取得（キーリストはデフォルト昇順で並ばれている）
        const hyojiDans = Object.keys(menuGroupedByHyojidan);

        // 段ごとにメニューを配置する
        hyojiDans.forEach(function (menuDan) {
            const menuList = menuGroupedByHyojidan[menuDan];
            showMenu(menuList);
        });
    }

    /**
     * 段ごとにアプリを配置する
     * @param {array} menuList
     */
    function showMenu(menuList) {
        // 表示順で並び変える
        menuList.sort(function (a, b) {
            let aHyojijun = sncLib.util.toInt(a[cfgPortalSettingFields.menuHyojijun.code].value);
            let bHyojijun = sncLib.util.toInt(b[cfgPortalSettingFields.menuHyojijun.code].value);
            if (aHyojijun < bHyojijun) return -1;
            if (aHyojijun > bHyojijun) return 1;
            return 0;
        });

        // ポータルの上部に表示する
        let outDiv = $('<div class="nok-grid"></div>');
        let middleDiv = $('<div class="nok-span"></div>');
        let innerDiv = $('<div class="nok-span__inner"></div>');
        for (let menu of menuList) {
            let menuUrl = menu[cfgPortalSettingFields.menuIchiranUrl.code].value;
            let menuIcon = menu[cfgPortalSettingFields.menuBase64Mojiretsu.code].value;
            let menuName = menu[cfgPortalSettingFields.menuIchiranMei.code].value;

            const appEle = $('<a href="' + menuUrl + '"><img src="' + menuIcon + '" style="height: 110px;" title="' + menuName + '"></a>');
            innerDiv.append(appEle);
        }
        middleDiv.append(innerDiv);
        outDiv.append(middleDiv);
        $('#nok-app-list').append(outDiv);
    }

    /**
     * メニューリスト表示の部分の下に取得したグラフ情報を表示順と大きさで表示する
     * @param {array} graphPatternSubTable
     * @param {string} loginId
     */
    function renderGraph(graphPatternSubTable, loginId) {
        // グラフが設定されない場合、表示しない
        if (graphPatternSubTable.length === 0) {
            $('#nok-graph-list').parents('.nok-portal-middle').hide();
            return;
        }

        // 表示段でレコードをグループする
        const graphGroupedByHyojidan = graphPatternSubTable.reduce(function (groupedObj, currentObj) {
            const valueObj = currentObj.value;
            let key = valueObj[cfgPortalSettingFields.graphDan.code].value;
            if (!groupedObj[key]) {
                groupedObj[key] = [];
            }
            groupedObj[key].push(valueObj);
            return groupedObj;
        }, {});

        // オブジェクトのキーリストはデフォルト昇順で並ぶ
        const hyojiDans = Object.keys(graphGroupedByHyojidan);

        // 段ごとにグラフを配置する
        hyojiDans.forEach(function (graphDan) {
            const graphList = graphGroupedByHyojidan[graphDan];
            showGraph(graphDan, graphList, loginId);
        });

    }

    /**
     * 段ごとにグラフを配置する
     * @param {int} graphDan
     * @param {array} graphList
     * @param {string} loginId
     */
    function showGraph(graphDan, graphList, loginId) {

        // 表示順で並び変える
        graphList.sort(function (a, b) {
            let aHyojijun = sncLib.util.toInt(a[cfgPortalSettingFields.graphHyojijun.code].value);
            let bHyojijun = sncLib.util.toInt(b[cfgPortalSettingFields.graphHyojijun.code].value);
            if (aHyojijun < bHyojijun) return -1;
            if (aHyojijun > bHyojijun) return 1;
            return 0;
        });

        const outDiv = $('<div class="nok-grid for-chart"></div>');

        // グラフリストを配置する
        graphList.forEach(function (graphInfo, i) {

            // グラフを表示する領域を確保する
            let canvasId = 'nok-chart-' + graphDan + '-' + i;
            let graphDivId = canvasId + '-content';

            const contentDiv = $('<div id="' + graphDivId + '" class="nok-chart"></div>');
            contentDiv.append('<h2 class="graph-title"></h2>');     // グラフタイトル
            contentDiv.append('<p class="graph-description"></p>'); // グラフ説明
            contentDiv.append('<div class="nok-graph-container"><div id="' + graphDivId + '__container" class="nok-canvas-warp"><canvas id="' + canvasId + '"></canvas></div></div>');

            outDiv.append(contentDiv);

            $('#nok-graph-list').append(outDiv);

            // グラフを描画する
            const graphId = graphInfo[cfgPortalSettingFields.graphId.code].value;

            let query = cfgGraphFields.graphId.code + ' = "' + graphId + '"';

            /**
             * グラフ設定情報取得
             */
            sncLib.kintone.rest.getRecord(cfgGraph.app, query).then(function (records) {
                if (records.length < 1) {
                    return false;
                }

                const graphRecord = records[0];

                let graphSize = graphInfo[cfgPortalSettingFields.graphSize.code].value;
                let divSize = graphSize === '中' ? 'md' : (graphSize === '小' ? 'sm' : 'lg');
                let graphContainerDiv = $('#' + graphDivId + '__container');
                graphContainerDiv.addClass('nok-chart-' + divSize);

                /*
                 * ここでローディングスピナーを表示する
                 * ローディングスピナーを非表示するのは２か所がある
                 * 1.グラフデータがない時、メッセージを表示する
                 * 2.グラフを完全に描画されたあと
                 */
                nokChart.showSpinner(canvasId);

                // グラフタイトル表示
                let graphTitle = graphInfo[cfgPortalSettingFields.graphName.code].value;
                let graphContentDiv = $('#' + graphDivId);

                // グラフ説明表示
                let graphDescription = graphInfo[cfgPortalSettingFields.graphSetsumei.code].value;

                if (!graphTitle && !graphDescription) {
                    graphTitle = '　';
                }

                $('.graph-title', graphContentDiv).text(graphTitle);
                $('.graph-description', graphContentDiv).text(graphDescription);

                // グラフ表示
                let graphType = graphInfo[cfgPortalSettingFields.graphType.code].value;
                // 2-2-1. グラフタイプはパイプラインの場合、
                if (graphType === cfgGraphTypes.paipurain.code) {
                    getDataAndDrawPipelineChart(canvasId, graphRecord, loginId);
                }
                // 2-2-2. グラフタイプは積み上げの場合、
                else if (graphType === cfgGraphTypes.tsumiage.code) {
                    getDataAndDrawStackedBarChart(canvasId, graphRecord, loginId);
                }
                // 2-2-3. グラフタイプは半ドーナツの場合、
                else if (graphType === cfgGraphTypes.handonatsu.code) {
                    getDataAndDrawHalfDonutChart(canvasId, graphRecord, loginId);
                }
                // 2-2-4. グラフタイプは縦棒の場合、
                else if (graphType === cfgGraphTypes.tatebo.code) {
                    getDataAndDrawVerticalBarChart(canvasId, graphRecord, loginId);
                }
            }).catch(function (error) {
                showErrorMessage(error);
            });
        });
    }

    /**
     * 案件情報アプリから、一年のデータを取得し、活動結果を基づき、パイプライングラフを描画する
     *
     * @param {string} canvasId
     * @param {object} graphRecord
     * @param {string} loginId
     */
    function getDataAndDrawPipelineChart(canvasId, graphRecord, loginId) {
        // 2-2-1-1.以下のフィールドの値を取得する
        // 「nok_パイプライン_表示対象」フィールド
        // 「nok_パイプライン_組織選択」フィールド
        // 「nok_パイプライン_開始年月」フィールド
        // 「nok_パイプライン_値」フィールド	        // 件数
        // 「nok_パイプライン_凡例」フィールド	        // 訪問結果
        const paipurainTaisho = graphRecord[cfgGraphFields.paipurainTaisho.code].value;
        const paipurainSoshiki = graphRecord[cfgGraphFields.paipurainSoshiki.code].value;
        const paipurainNengetsu = graphRecord[cfgGraphFields.paipurainNengetsu.code].value;

        let sosikies = null;
        let searchLoginId = loginId;
        if (paipurainTaisho === hyojiTaisho.SOSIKI) {
            searchLoginId = null;
            sosikies = [];
            paipurainSoshiki.forEach(function (sosiki) {
                sosikies.push(sosiki.code);
            });
        }

        // 今回凡例は一つの値しかない (確度)
        // if(tsumiageHanrei == '確度') {
        const hanreiCode = cfgAnkenFields.homonkekka.code;
        // }

        // 2-2-1-4. データを取得
        //     取得元アプリ：案件情報
        return new kintone.Promise(function (resolve, reject) {
            resolve(getOneYearAnkenData(paipurainNengetsu, null, searchLoginId, sosikies))
        }).then(function (ankenData) {
            const summaryData = {};

            // 案件管理.nok_活動結果フィールドの値をグループにして、件数を取得する
            ankenData.forEach(function (data) {
                let count = sncLib.util.toInt(summaryData[data[hanreiCode].value]);
                summaryData[data[hanreiCode].value] = count + 1;
            });

            // グラフデータがない場合、
            if ($.isEmptyObject(summaryData)) {
                nokChart.showNoDataMessage(canvasId);
                return;
            }

            drawPipelineChart(canvasId, summaryData);
        }).catch(function (error) {
            showErrorMessage(error);
        });
    }

    /**
     * パイプライングラフデータ作成し、表示する
     * @param {string} canvasId
     * @param {object} rawData
     */
    function drawPipelineChart(canvasId, rawData) {

        const labels = configPortal.graph.pipeline.labels;

        // 2-2-1-5. 取得したデータを成形する
        // 「案件管理.nok_活動結果」フィールドの値をグループにして、件数を取得する
        //「納品」の件数を取得する
        //「受注」の件数を取得し、更に①の件数をプラスにする
        //「見積提示」の件数を取得し、更に②の件数をプラスにする
        //「商談進展」の件数を取得し、更に③の件数をプラスにする
        //「商談発生」の件数を取得し、更に④の件数をプラスにする
        let preValue = 0;
        const rawValues = [];
        for (let i = labels.length - 1; i >= 0; i--) {
            let label = labels[i];
            let value = preValue + sncLib.util.toInt(rawData[label]);
            rawValues.push(value);
            preValue = value;
        }
        const values = rawValues.reverse(); // 順番を逆にする　商談発生　→　... → 納品

        // パイプライン用のデータを成形
        const graphData = [];
        for (let i = 0; i < values.length; i++) {
            let gap = values[0] - values[i];
            let start = gap / 2;
            let end = start + values[i];
            graphData.push([start, end]);
        }

        // グラフデータオブジェクト作成
        const graphColors = configPortal.graph.pipeline.colors;
        const data = {
            labels: labels,
            unit: 'matter',
            datasets: [
                {
                    data: graphData,
                    backgroundColor: graphColors.backgroundColor,
                    borderColor: graphColors.borderColor,
                    borderWidth: 1,
                    borderSkipped: false,
                }
            ]
        };

        nokChart.pipelineChart(canvasId, data);
    }

    /**
     * 案件情報アプリから、一年のデータを取得し、角度ごにとデータを積み立てて、グラフを表示する
     * @param {string} canvasId
     * @param {object} graphRecord
     * @param {string} loginId
     */
    function getDataAndDrawStackedBarChart(canvasId, graphRecord, loginId) {

        // 2-2-2-1. 以下のフィールドの値を取得する
        // 「nok_積み上げ_表示対象」フィールド  // 個人・組織
        // 「nok_積み上げ_組織選択」フィールド  //
        // 「nok_積み上げ_開始年月」フィールド
        // 「nok_積み上げ_軸」フィールド       // 月
        // 「nok_積み上げ_値」フィールド       // 件数/売上/粗利
        // 「nok_積み上げ_凡例」フィールド     // 確度
        const tsumiageTaisho = graphRecord[cfgGraphFields.tsumiageTaisho.code].value;
        const tsumiageSoshiki = graphRecord[cfgGraphFields.tsumiageSoshiki.code].value;
        const tsumiageNengetsu = graphRecord[cfgGraphFields.tsumiageNengetsu.code].value;
        const tsumiageAtai = graphRecord[cfgGraphFields.tsumiageAtai.code].value;

        let sosikies = null;
        let searchLoginId = loginId;
        if (tsumiageTaisho === hyojiTaisho.SOSIKI) {
            searchLoginId = null;
            sosikies = [];
            tsumiageSoshiki.forEach(function (sosiki) {
                sosikies.push(sosiki.code);
            });
        }

        // 今回凡例は一つの値しかない (確度)
        const hanreiCode = cfgAnkenFields.kakudo.code;

        // 2-2-2-3.データを取得
        // 取得元アプリ：案件情報
        return new kintone.Promise(function (resolve, reject) {
            resolve(getOneYearAnkenData(tsumiageNengetsu, null, searchLoginId, sosikies))
        }).then(function (ankenData) {

            // 角度ごにとデータを集計する
            /*
            {
                '受注':
                {
                    1: 29011690,
                    2: 29011690,
                    ...
                    12: 29011690
                },
                '確度A':
                {
                    1: 29011690,
                    2: 29011690,
                    ...
                    12: 29011690
                },
                '確度B':
                {
                    1: 29011690,
                    2: 29011690,
                    ...
                    12: 29011690
                },
                '確度C':
                {
                    1: 29011690,
                    2: 29011690,
                    ...
                    12: 29011690
                },
                '失注':
                {
                    1: 29011690,
                    2: 29011690,
                    ...
                    12: 29011690
                }
            }
            */
            const summaryData = {};

            // 2-2-2-4. 取得したデータを成形する
            //   2-2-2-4-1. 取得したデータの「検収予定日」の年月と「nok_確度」」フィールドの値をグループする
            //     2-2-2-4-2. 合計値を計算する
            ankenData.forEach(function (data) {
                let hanrei = data[hanreiCode].value;
                // 月ごにとデータを集計する
                let hanreiSummaryData = summaryData[hanrei];
                if (!hanreiSummaryData) {
                    hanreiSummaryData = {};
                }

                let targetDateCode = configPortal.fields.anken.targetDate;
                let targetDate = data[targetDateCode].value;
                let monthLabel = luxon.DateTime.fromISO(targetDate.replace(/\//g, '-')).toFormat('MM');

                let summaryAmount = sncLib.util.toInt(hanreiSummaryData[monthLabel]);

                if (tsumiageAtai === atai.KENSU) {
                    summaryAmount++;
                } else if (tsumiageAtai === atai.URIAGE) {
                    summaryAmount += sncLib.util.toInt(data[cfgAnkenFields.uriage.code].value);
                } else if (tsumiageAtai === atai.ARARI) {
                    summaryAmount += sncLib.util.toInt(data[cfgAnkenFields.fukakachi.code].value);
                }
                hanreiSummaryData[monthLabel] = summaryAmount;

                summaryData[hanrei] = hanreiSummaryData;
            });

            // グラフデータがない場合、
            if ($.isEmptyObject(summaryData)) {
                nokChart.showNoDataMessage(canvasId);
                return;
            }

            drawStackedBarChart(canvasId, tsumiageNengetsu, summaryData, tsumiageAtai);
        }).catch(function (error) {
            showErrorMessage(error);
        });

    }

    /**
     * 積み上げグラフデータ作成し、グラフを表示する
     * @param {string} canvasId
     * @param {string} fromYearMonth
     * @param {object} summaryData
     * @param {string} graphAtai
     */
    function drawStackedBarChart(canvasId, fromYearMonth, summaryData, graphAtai) {

        // Graph data作成
        // create labels
        const xLabels = createMonthLabelsForOneYear(fromYearMonth);
        const yearMonthLabels = createYearMonthLabelsForOneYear(fromYearMonth);
        const datasets = [];

        // Create dataset
        // 2-2-2-4-3. 確度ごとのデータを積み立て処理を行う
        configPortal.graph.stackedBar.kakudoOrder.forEach(function (kakudo, i) {
            let kakudoSummaryData = summaryData[kakudo];

            if (!kakudoSummaryData) {
                kakudoSummaryData = {};
            }

            // 確度ごとのデータを積み立つ
            const data = [];
            let preValue = 0;
            xLabels.forEach(function (month) {
                let value = preValue + sncLib.util.toInt(kakudoSummaryData[month]);
                data.push(value);
                preValue = value;
            });

            const graphColors = configPortal.graph.stackedBar.colors;
            const dataset = {
                label: kakudo,
                data: data,
                backgroundColor: graphColors.backgroundColor[i],
                borderColor: graphColors.borderColor[i],
                borderWidth: 1,
            }

            datasets.push(dataset);
        });

        /*
        * GRAPH DATA FORMAT
        * {
        *   labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], // Ｘ軸のラベル
        *   unit: 'money',
        *   datasets: [
        *     {
        *       label: '受注',
        *       data: [51, 143, 173, 262, 352, 438, 523, 581, 678, 741, 839, 841],
        *       backgroundColor: color,
        *       borderColor: borderColor,
        *       borderWidth: 1,
        *     },
        *     ...
        *     {
        *       label: '失注',
        *       data: [63, 83, 100, 137, 225, 302, 339, 360, 447, 467, 479, 529],
        *       backgroundColor: color,
        *       borderColor: borderColor,
        *       borderWidth: 1,
        *     }
        *   ]
        * };
        */
        const graphData = {
            yTitle: configPortal.graph.titles[graphAtai],
            labels: yearMonthLabels,
            datasets: datasets
        };

        nokChart.stackedBarChart(canvasId, graphData);
    }

    /**
     * 案件情報アプリ、予算実績アプリから、一年のデータを取得し、半ドーナツを表示する
     * @param {string} canvasId
     * @param {object} graphRecord
     * @param {string} loginId
     */
    function getDataAndDrawHalfDonutChart(canvasId, graphRecord, loginId) {

        // 2-2-3-1.以下の」フィールドの値を取得する
        // 「nok_半ドーナツ_表示対象」フィールド
        // 「nok_半ドーナツ_組織選択」フィールド
        // 「nok_半ドーナツ_開始年月」フィールド
        // 「nok_半ドーナツ_値」フィールド	    // 売上 粗利
        // 「nok_半ドーナツ_確度」フィールド    // 受注 確度A 確度B 確度C
        const handonatsuTaisho = graphRecord[cfgGraphFields.handonatsuTaisho.code].value;
        const handonatsuSoshiki = graphRecord[cfgGraphFields.handonatsuSoshiki.code].value;
        const handonatsuNengetsu = graphRecord[cfgGraphFields.handonatsuNengetsu.code].value;
        const handonatsuAtai = graphRecord[cfgGraphFields.handonatsuAtai.code].value;
        const handonatsuKakudo = graphRecord[cfgGraphFields.handonatsuKakudo.code].value;

        let sosikies = null;
        let searchLoginId = loginId;
        if (handonatsuTaisho === hyojiTaisho.SOSIKI) {
            searchLoginId = null;
            sosikies = [];
            handonatsuSoshiki.forEach(function (sosiki) {
                sosikies.push(sosiki.code);
            });
        } else if (handonatsuTaisho === hyojiTaisho.ALL) {
            searchLoginId = null;
        }

        const searchInfo = createYojitsuSearchData(handonatsuNengetsu, handonatsuKakudo);

        // データ取得処理
        //  1.予実アプリより、予算情報を取得
        //  2.予実アプリより、実績情報を取得
        //  3.案件アプリより、見込情報を取得
        kintone.Promise.all([
            getMokuhyoJisseki(searchInfo.searchInfoKikanStart, searchInfo.searchInfoKikanEnd, searchLoginId, sosikies),
            getMokuhyoJisseki(searchInfo.mjKikanStart, searchInfo.mjKikanEnd, searchLoginId, sosikies),
            getAnkenData(searchInfo.anKikanStart, searchInfo.anKikanEnd, searchInfo.kakudo, searchLoginId, sosikies)
        ]).then(function (results) {

            // 予算用データ
            var yosanData = results[0];

            // 実績用データ
            var jissekiDataRaw = results[1];

            // 見込用データ
            var ankenDataRaw = results[2];

            // 集計パターンを考慮し、実績と見込みデータを取得する
            const jissekiAnkenData = processJissekiAnkenData(jissekiDataRaw, ankenDataRaw);

            // 集計パターンを考慮した実績用データ
            var jissekiData = jissekiAnkenData['jisseki'];

            // 集計パターンを考慮した見込用データ
            var ankenData = jissekiAnkenData['anken'];

            // グラフデータがない場合、
            if (jissekiData.length === 0 && ankenData.length === 0) {
                nokChart.showNoDataMessage(canvasId);
                return;
            }

            let yosanValueField = cfgYojitsuFields.mokuhyoUriageKingaku.code;
            let jissekiValueField = cfgYojitsuFields.jissekiUriageKingaku.code;
            let mikomiValueField = cfgAnkenFields.uriage.code;
            if (handonatsuAtai === atai.ARARI) {
                yosanValueField = cfgYojitsuFields.mokuhyoArariKingaku.code;
                jissekiValueField = cfgYojitsuFields.jissekiArariKingaku.code;
                mikomiValueField = cfgAnkenFields.fukakachi.code;
            }

            // 予算データのnok_予算売上金額を合計
            let yosanAmount = 0;
            yosanData.forEach(function (data) {
                yosanAmount += sncLib.util.toInt(data[yosanValueField].value);
            });

            // 実績データのnok_実績売上金額、見込みデータのnok_売上を合計
            let jissekiAmount = 0;
            jissekiData.forEach(function (data) {
                jissekiAmount += sncLib.util.toInt(data[jissekiValueField].value);
            });

            // 見込みデータのnok_売上を合計
            ankenData.forEach(function (data) {
                jissekiAmount += sncLib.util.toInt(data[mikomiValueField].value);
            });

            drawHalfDonutChart(canvasId, yosanAmount, jissekiAmount, handonatsuAtai);
        }).catch(function (error) {
            showErrorMessage(error);
        });
    }

    /**
     * 半ドーナツグラフのデータ作成し、グラフを表示する
     * @param {string} canvasId
     * @param {double} yosanAmount
     * @param {double} jissekiAmount
     * @param {string} graphAtai 半ドーナツ_値
     */
    function drawHalfDonutChart(canvasId, yosanAmount, jissekiAmount, graphAtai) {

        let remainYosan = yosanAmount - jissekiAmount > 0 ? yosanAmount - jissekiAmount : 0;
        let percent = 0;
        if (yosanAmount !== 0) { // 予算達成率
            percent = (jissekiAmount / yosanAmount * 100).toFixed(2);
        }

        //
        const graphLabels = ['実績金額', '残予算金額'];
        // setup
        const graphColors = configPortal.graph.halfDonut.colors;
        const data = {
            labels: graphLabels,
            yTitle: graphAtai,
            datasets: [{
                data: [jissekiAmount, remainYosan],
                percent: percent,
                estimatedValue: yosanAmount,
                backgroundColor: [graphColors.backgroundColor[0], graphColors.backgroundColor[1]],
                borderColor: [graphColors.borderColor[0], graphColors.borderColor[1]],
                borderWidth: 1,
                cutout: '70%',
                circumference: 180,
                rotation: 270
            }
            ]
        };

        nokChart.halfDonutChart(canvasId, data);
    }

    /**
     * 案件情報アプリ、予算実績アプリから、一年のデータおよびその前年のデータを取得し、対前年比グラフを表示する
     * @param {string} canvasId
     * @param {object} graphRecord
     * @param {string} loginId
     * @returns
     */
    function getDataAndDrawVerticalBarChart(canvasId, graphRecord, loginId) {
        // 2-2-4-1.以下のフィールドの値を取得する
        // 「nok_縦棒_表示対象」フィールド
        // 「nok_縦棒_組織選択」フィールド
        // 「nok_縦棒_開始年月」フィールド
        // 「nok_縦棒_軸」フィールド	    // 月 担当者 組織
        // 「nok_縦棒_値」フィールド
        // 「nok_縦棒_確度」フィールド
        const tateboTaisho = graphRecord[cfgGraphFields.tateboTaisho.code].value;
        const tateboSoshiki = graphRecord[cfgGraphFields.tateboSoshiki.code].value;
        const tateboNengetsu = graphRecord[cfgGraphFields.tateboNengetsu.code].value;
        const tateboJiku = graphRecord[cfgGraphFields.tateboJiku.code].value;
        const tateboAtai = graphRecord[cfgGraphFields.tateboAtai.code].value;
        const tateboKakudo = graphRecord[cfgGraphFields.tateboKakudo.code].value;

        // 日付項目での検索とするため、'yyyy/MM'から'yyyy-MM'とする。
        let fromDate = (tateboNengetsu + '/01').replace(/\//g, '-');
        let previousNengetsuFrom = luxon.DateTime.fromISO(fromDate).minus({ 'year': 1 }).toFormat('yyyy/MM');

        let sosikies = null;
        let searchLoginId = loginId;
        if (tateboTaisho === hyojiTaisho.SOSIKI) {
            searchLoginId = null;
            sosikies = [];
            tateboSoshiki.forEach(function (sosiki) {
                sosikies.push(sosiki.code);
            });
        }

        // 今年度の予算と実績を取得する検索条件を処理する
        const searchInfo = createYojitsuSearchData(tateboNengetsu, tateboKakudo);

        // 前年度の予算と実績を取得する検索条件を処理する
        const previousSearchInfo = createYojitsuSearchData(previousNengetsuFrom, tateboKakudo);

        // 今年度のデータおよび前年度のデータを取得する
        // 1.今年度の実績データを取得　（今年度実績取得期間）
        // 2.今年度の見込データを取得　（今年度見込み取得期間、確度は複数）
        // 3.前年度の実績データを取得　（前年度実績取得期間）
        // 4.前年度の見込データを取得　（前年度見込み取得期間、確度は複数）
        return kintone.Promise.all([
            getMokuhyoJisseki(searchInfo.mjKikanStart, searchInfo.mjKikanEnd, searchLoginId, sosikies),
            getAnkenData(searchInfo.anKikanStart, searchInfo.anKikanEnd, searchInfo.kakudo, searchLoginId, sosikies),
            getMokuhyoJisseki(previousSearchInfo.mjKikanStart, previousSearchInfo.mjKikanEnd, searchLoginId, sosikies),
            getAnkenData(previousSearchInfo.anKikanStart, previousSearchInfo.anKikanEnd, previousSearchInfo.kakudo, searchLoginId, sosikies),
        ]).then(function (results) {

            // 実績用データ
            var jissekiDataRaw = results[0];
            // 見込用データ
            var ankenDataRaw = results[1];

            // 前年度の実績用データ
            var previousJissekiDataRaw = results[2];
            // 前年度の見込用データ
            var previousAnkenDataRaw = results[3];

            // 集計パターンを考慮し、実績と見込みデータを取得する
            const jissekiAnkenData = processJissekiAnkenData(jissekiDataRaw, ankenDataRaw);
            const previousJissekiAnkenData = processJissekiAnkenData(previousJissekiDataRaw, previousAnkenDataRaw);

            // 集計パターンを考慮した実績用データ
            var jissekiData = jissekiAnkenData['jisseki'];
            // 集計パターンを考慮した見込用データ
            var ankenData = jissekiAnkenData['anken'];

            // 集計パターンを考慮した前年度の実績用データ
            var previousJissekiData = previousJissekiAnkenData['jisseki'];
            // 集計パターンを考慮した前年度の見込用データ
            var previousAnkenData = previousJissekiAnkenData['anken'];

            // グラフデータがない場合、
            if (jissekiData.length === 0 && ankenData.length === 0 && previousJissekiData.length === 0 && previousAnkenData.length === 0) {
                nokChart.showNoDataMessage(canvasId);
                return;
            }

            // 2-2-4-4.フィルターしたデータを成形する
            //  2-2-4-4-1.「nok_縦棒_軸」フィールドの値が「月」の場合
            const jissekiSummaryData = summaryJissekiData(tateboNengetsu, jissekiData, ankenData, tateboJiku, tateboAtai);
            const previousJissekiSummaryData = summaryJissekiData(previousNengetsuFrom, previousJissekiData, previousAnkenData, tateboJiku, tateboAtai);

            if (!jissekiSummaryData || !previousJissekiSummaryData) {
                return false;
            }

            const keys = jissekiSummaryData.labels;
            const previousKeys = previousJissekiSummaryData.labels;

            // 配列をマージする
            const mergedKeys = [...keys, ...previousKeys];      // same as keys.concat(previousKeys);
            const labels = [...new Set(mergedKeys)];        // 重複削除

            const jissekiValues = [];
            const previousJissekiValues = [];
            labels.forEach(function (label) {
                jissekiValues.push(sncLib.util.toInt(jissekiSummaryData.summaryData[label]));
                previousJissekiValues.push(sncLib.util.toInt(previousJissekiSummaryData.summaryData[label]));
            });

            let graphLabels = labels;
            if (tateboJiku === jiku.MONTH) {
                graphLabels = jissekiSummaryData.formattedLabels;
            }

            drawVerticalBarChart(canvasId, tateboNengetsu, previousNengetsuFrom, graphLabels, jissekiValues, previousJissekiValues, tateboJiku, tateboAtai);

        });
    }

    /**
     * =======================================================
     * Vertical Chart
     * =======================================================
     */
    function drawVerticalBarChart(canvasId, nengetsuFrom, previousNengetsuFrom, labels, data, previousData, graphJiku, graphAtai) {

        /*
        * OUTPUT DATA
        *{
        *	labels: ['佐藤英次', '崔　坊主', '中島　一郎', '田畑　俊幸', '清水　勇太', '谷本　尚紀', '中島　潤', '下見　公人', '臼井　洋一', '長谷川　佳代', '原田　洋', '藤田　裕三', '梶原　景太郎', '平松　正光', 'snc名越', '村上英之'], // Ｘ軸のラベル
        *	datasets: [
        *	{
        *		label: '2021年度',
        *		data: [32031999, 266434813, 170462619, 287818544, 104215264, 233310772, 225374863, 216785943, 273933130, 196431656, 77665238, 139066036, 170805510, 54820204, 81001380, 45401772],
        *		backgroundColor: 'rgba(255, 26, 104, 0.2)', // 系列Ａの棒の色
        *		borderColor: 'rgba(255, 26, 104, 1)',
        *		borderWidth: 1,
        *	},
        *	{
        *		label: '2022年度',
        *		data: [55639470, 198307846, 30192340, 82893118, 176035493, 167557902, 121280577, 21275533, 77477589, 109926072, 219752498, 285550534, 18873818, 102333418, 35927101, 51555454],
        *		backgroundColor: 'rgba(54, 162, 235, 0.2)',
        *		borderColor: 'rgba(54, 162, 235, 1)',
        *		borderWidth: 1,
        *	}
        *	]
        *}
        */
        const graphColors = configPortal.graph.verticalBar.colors;
        const dataset = {
            label: luxon.DateTime.fromISO((nengetsuFrom + '/01').replace(/\//g, '-')).toFormat('yyyy') + '年度',
            data: data,
            backgroundColor: graphColors.backgroundColor[0],
            borderColor: graphColors.borderColor[0],
            borderWidth: 1,
        }
        const previousDataset = {
            label: luxon.DateTime.fromISO((previousNengetsuFrom + '/01').replace(/\//g, '-')).toFormat('yyyy') + '年度',
            data: previousData,
            backgroundColor: graphColors.backgroundColor[1],
            borderColor: graphColors.borderColor[1],
            borderWidth: 1,
        }
        const graphTitle = configPortal.graph.titles;
        const graphData = {
            xTitle: graphTitle[graphJiku],
            yTitle: graphTitle[graphAtai],
            labels: labels,
            datasets: [
                previousDataset,
                dataset
            ]
        }

        nokChart.verticalBarChart(canvasId, graphData);
    }

    /**
     * 指定の年月から予算・実績を取得する
     * @param {*} year
     * @param {*} month
     */
    function getMokuhyoJisseki(fromDate, toDate, loginId, sosikies = null) {

        if (!fromDate || !toDate) {
            return [];
        }

        // 指定月の予算・実績を取得
        var query = cfgYojitsuFields.shukeiyoNengetsu.code + ' >= "' + fromDate + '" and ' + cfgYojitsuFields.shukeiyoNengetsu.code + ' <= "' + toDate + '"';

        // 表示対象が個人の場合
        if (loginId) {
            query += ' and ' + cfgYojitsuFields.tantoshaId.code + ' = "' + loginId + '"';
        } else if (sosikies && sosikies.length >= 1) { // 表示対象が組織の場合
            query += ' and ' + cfgYojitsuFields.tantoshaSosiki.code + ' in ("' + sosikies.join('","') + '")';
        }

        return sncLib.kintone.rest.getAllRecordsOnRecordId(config.yojitsu.app, query);
    }

    /**
     * 案件管理アプリよりレコードを取得
     * @param {*} fromYearMonth
     * @param {*} toYearMonth
     * @param {*} kakudo
     */
    function getAnkenData(fromDate, toDate, kakudos, loginId, sosikies) {

        if (!fromDate || !toDate) {
            return [];
        }

        var targetDateCode = configPortal.fields.anken.targetDate;
        var kakudoCode = configPortal.fields.anken.kakudo;

        // 指定月の予算・実績を取得
        var query = targetDateCode + ' >= "' + fromDate + '" and ' + targetDateCode + ' <= "' + toDate + '"';

        // 表示対象が個人の場合
        if (loginId) {
            query += ' and ' + cfgAnkenFields.tantoshaId.code + ' = "' + loginId + '"';
        } else if (sosikies && sosikies.length >= 1) { // 表示対象が組織の場合
            query += ' and ' + cfgAnkenFields.tantoshaSosiki.code + ' in ("' + sosikies.join('","') + '")';
        }

        // 確度でフィルタする
        if (kakudos && kakudos.length >= 1) {
            query += ' and ' + kakudoCode + ' in ("' + kakudos.join('","') + '") '
        }

        // TODO sosikiが多すぎの場合、文字分割して、複数回データを取得する必要  クエリの長さ制限を考慮
        // https://jp.cybozu.help/k/ja/admin/limitation/limit.html
        return sncLib.kintone.rest.getAllRecordsOnRecordId(config.anken.app, query);
    }

    /**
     * 案件管理アプリよりレコードを取得
     * @param {string} fromYearMonth
     * @param {string} loginId
     * @param {array} sosikies
     * @returns
     */
    function getOneYearAnkenData(fromYearMonth, kakudo, loginId, sosikies = null) {

        if (!fromYearMonth) {
            return [];
        }

        // 日付項目での検索とするため、'yyyy/MM'から'yyyy-MM-01'とする。
        let fromDate = (fromYearMonth + '/01').replace(/\//g, '-');
        // 末日を設定
        let toDate = luxon.DateTime.fromISO(fromDate).plus({ 'months': DATA_DURATION - 1 }).endOf('month').toFormat('yyyy-MM-dd');

        return getAnkenData(fromDate, toDate, kakudo, loginId, sosikies);
    }

    /**
     * 縦棒グラフ専用データ作成
     * @param {string} nengetsuFrom
     * @param {array} jissekiData
     * @param {array} ankenData
     * @param {string} graphJiku
     * @param {string} graphAtai
     * @returns ラベルリストとグラフ用データオブジェクト
     */
    function summaryJissekiData(nengetsuFrom, jissekiData, ankenData, graphJiku, graphAtai) {
        // 2-2-4-4.フィルターしたデータを成形する
        //  2-2-4-4-1.「nok_縦棒_軸」フィールドの値が「月」の場合
        if (graphJiku === jiku.MONTH) {
            // 月ごとに合計値を計算する
            return summaryJissekiByMonth(nengetsuFrom, jissekiData, ankenData, graphAtai);
        }

        // 2-2-4-4-2.「nok_縦棒_軸」フィールドの値が「担当者」の場合
        if (graphJiku === jiku.TANTOSHA) {
            // 担当者ごとに合計値を計算する
            return summaryJissekiByStaff(jissekiData, ankenData, graphAtai);
        }

        // 2-2-4-4-3.「nok_縦棒_軸」フィールドの値が「組織」の場合
        if (graphJiku === jiku.SOSIKI) {
            // 組織ごとに合計値を計算する
            return summaryJissekiByOrg(jissekiData, ankenData, graphAtai);
        }

        return null;
    }

    /**
     * 月ごとに合計値を計算する
     * @param {string} nengetsuFrom
     * @param {array} jissekiData
     * @param {array} ankenData
     * @param {string} graphAtai
     * @returns 月のラベルリストと月ごとで集計したグラフ用データオブジェクト
     */
    function summaryJissekiByMonth(nengetsuFrom, jissekiData, ankenData, graphAtai) {
        const summaryData = {};

        // 売上か粗利かのフィールド定義
        let jissekiKingakuCode = cfgYojitsuFields.jissekiUriageKingaku.code;
        let mikomiKingakuCode = cfgAnkenFields.uriage.code;
        if (graphAtai === atai.ARARI) {
            jissekiKingakuCode = cfgYojitsuFields.jissekiArariKingaku.code;
            mikomiKingakuCode = cfgAnkenFields.fukakachi.code;
        }

        // 今年度の実績データの「nok_実績売上金額」フィールドの値を合計
        jissekiData.forEach(function (data) {
            let month = data[cfgYojitsuFields.shukeiyoNengetsu.code].value;
            let key = luxon.DateTime.fromISO(month.replace(/\//g, '-')).toFormat('MM');
            let jissekiAmount = sncLib.util.toInt(summaryData[key]);
            jissekiAmount += sncLib.util.toInt(data[jissekiKingakuCode].value);    // 同じ月の値は合計にする
            summaryData[key] = jissekiAmount;
        });

        // 今年度の見込データの「nok_売上」フィールドの値を合計
        let targetDateCode = configPortal.fields.anken.targetDate;
        ankenData.forEach(function (data) {
            let month = data[targetDateCode].value;
            let key = luxon.DateTime.fromISO(month.replace(/\//g, '-')).toFormat('MM');
            let mikomiAmount = sncLib.util.toInt(summaryData[key]);
            mikomiAmount += sncLib.util.toInt(data[mikomiKingakuCode].value);
            summaryData[key] = mikomiAmount;
        });

        const labels = createMonthLabelsForOneYear(nengetsuFrom);
        const formattedLabels = createYearMonthLabelsForOneYear(nengetsuFrom);

        return {
            labels: labels,
            formattedLabels: formattedLabels,
            summaryData: summaryData
        };
    }

    /**
     * 個人ごとに合計値を計算する
     * @param {array} jissekiData
     * @param {array} ankenData
     * @param {string} graphAtai
     * @returns 個人名のラベルリストと個人ごとで集計したグラフ用データオブジェクト
     */
    function summaryJissekiByStaff(jissekiData, ankenData, graphAtai) {
        const labels = [];
        const summaryData = {};

        let jissekiValueField = cfgYojitsuFields.jissekiUriageKingaku.code;
        let mikomiValueField = cfgAnkenFields.uriage.code;
        if (graphAtai === atai.ARARI) {
            jissekiValueField = cfgYojitsuFields.jissekiArariKingaku.code;
            mikomiValueField = cfgAnkenFields.fukakachi.code;
        }

        // 今年度の実績データの「nok_実績売上金額」フィールドの値を合計
        jissekiData.forEach(function (data) {
            let tantoshamei = data[cfgYojitsuFields.tantoshaMei.code].value;
            let jissekiAmount = 0;
            if (!(tantoshamei in summaryData)) { // key not exists in object
                labels.push(tantoshamei);
            } else {
                jissekiAmount = summaryData[tantoshamei];
            }
            jissekiAmount += sncLib.util.toInt(data[jissekiValueField].value);
            summaryData[tantoshamei] = jissekiAmount;
        });

        // 今年度の見込データの「nok_売上」フィールドの値を合計
        ankenData.forEach(function (data) {
            let tantoshamei = data[cfgAnkenFields.tantoshaMei.code].value;
            let mikomiAmount = 0;
            if (!(tantoshamei in summaryData)) { // key not exists in object
                labels.push(tantoshamei);
            } else {
                mikomiAmount = summaryData[tantoshamei];
            }
            mikomiAmount += sncLib.util.toInt(data[mikomiValueField].value);
            summaryData[tantoshamei] = mikomiAmount;
        });

        return {
            labels: labels,
            summaryData: summaryData
        };
    }

    /**
     * 組織ごとに合計値を計算する
     * @param {array} jissekiData
     * @param {array} ankenData
     * @param {string} graphAtai
     * @returns 組織名のラベルリストと組織ごとで集計したグラフ用データオブジェクト
     */
    function summaryJissekiByOrg(jissekiData, ankenData, graphAtai) {
        const labels = [];
        const summaryData = {};

        let jissekiValueField = cfgYojitsuFields.jissekiUriageKingaku.code;
        let mikomiValueField = cfgAnkenFields.uriage.code;
        if (graphAtai === atai.ARARI) {
            jissekiValueField = cfgYojitsuFields.jissekiArariKingaku.code;
            mikomiValueField = cfgAnkenFields.fukakachi.code;
        }

        // 今年度の実績データの「nok_実績売上金額」フィールドの値を合計
        jissekiData.forEach(function (data) {
            let tantoshaSosikis = data[cfgYojitsuFields.tantoshaSosiki.code].value;
            tantoshaSosikis.forEach(function (tantoshaSosikiObj) {
                let tantoshaSosiki = tantoshaSosikiObj.name;
                let jissekiAmount = 0;
                if (!(tantoshaSosiki in summaryData)) { // key not exists in object
                    labels.push(tantoshaSosiki);
                } else {
                    jissekiAmount = summaryData[tantoshaSosiki];
                }
                jissekiAmount += sncLib.util.toInt(data[jissekiValueField].value);
                summaryData[tantoshaSosiki] = jissekiAmount;
            });
        });

        // 今年度の見込データの「nok_売上」フィールドの値を合計
        ankenData.forEach(function (data) {
            let tantoshaSosikis = data[cfgAnkenFields.tantoshaSosiki.code].value;
            tantoshaSosikis.forEach(function (tantoshaSosikiObj) {
                let tantoshaSosiki = tantoshaSosikiObj.name;
                let mikomiAmount = 0;
                if (!(tantoshaSosiki in summaryData)) { // key not exists in object
                    labels.push(tantoshaSosiki);
                } else {
                    mikomiAmount = summaryData[tantoshaSosiki];
                }
                mikomiAmount += sncLib.util.toInt(data[mikomiValueField].value);
                summaryData[tantoshaSosiki] = mikomiAmount;
            });
        });

        return {
            labels: labels,
            summaryData: summaryData
        };
    }

    /**
     * 開始年月から期間内に月のラベルリストを作成
     * @param {string} nengetsuFrom フォーマットがyyyy-MMの文字列
     * @returns 月のラベルリスト
     */
    function createMonthLabelsForOneYear(nengetsuFrom) {
        return createDateTimeLabelsForOneYear(nengetsuFrom, 'MM');
    }

    /**
     * 開始年月から期間内に年月のラベルリストを作成
     * @param {string} nengetsuFrom フォーマットがyyyy-MMの文字列
     * @returns 年月のラベルリスト
     */
    function createYearMonthLabelsForOneYear(nengetsuFrom) {
        return createDateTimeLabelsForOneYear(nengetsuFrom, 'yyyy年M月');
    }

    /**
     * 開始年月から期間内にラベルリストを作成
     * @param {string} nengetsuFrom フォーマットがyyyy-MMの文字列
     * @param {string} format luxon用の日付フォーマット
     * @returns ラベルリスト
     */
    function createDateTimeLabelsForOneYear(nengetsuFrom, format) {
        const labels = [];
        let fromDate = luxon.DateTime.fromFormat(nengetsuFrom.replace(/\//g, '-'), 'yyyy-MM').startOf('month'); // 月の始め
        for (let i = 0; i < DATA_DURATION; i++) {
            let date = fromDate.plus({ 'months': i });
            let label = date.toFormat(format);
            labels.push(label);
        }
        return labels;
    }

    /**
     * 検索条件のオブジェクト情報を生成
     * @param {*} start
     * @param {*} end
     * @param {*} kakudo
     * @param {*} arariUriage
     */
    function createYojitsuSearchData(elNengetsuFrom, checkedKakudos) {

        if (!elNengetsuFrom) {
            return [];
        }

        // 日付項目での検索とするため、フォーマットを問わず、'yyyy-MM'に統一する
        let fromDate = luxon.DateTime.fromFormat(elNengetsuFrom.replace(/\//g, '-'), 'yyyy-MM').startOf('month');
        // 末日を設定
        let toDate = fromDate.plus({ 'months': DATA_DURATION - 1 }).endOf('month');

        // 当月
        var today = luxon.DateTime.local();
        var toGetsu = today.startOf('month');

        var mjKikanStart = '';
        var mjKikanEnd = '';
        var anKikanStart = '';
        var anKikanEnd = '';
        // 当月が検索期間の前か、範囲内か後かを判定
        if (toGetsu.startOf('day') < fromDate.startOf('day')) {
            // 　１．当月が検索期間-開始以前の場合、見込のみを集計
            //　　　　　予算実績の範囲指定は、ブランク
            //　　　　　案件管理の範囲指定は、検索期間と同一とする
            mjKikanStart = '';
            mjKikanEnd = '';
            anKikanStart = fromDate.toFormat('yyyy-MM-dd');
            anKikanEnd = toDate.toFormat('yyyy-MM-dd');
        } else if (toDate.startOf('day') < toGetsu.startOf('day')) {
            // 　２．当月が検索期間-終了以降の場合、実績のみを集計
            //　　　　　予算実績の範囲指定は、検索期間と同一
            //　　　　　案件管理の範囲指定は、ブランクとする
            mjKikanStart = fromDate.toFormat('yyyy-MM-dd');
            mjKikanEnd = toDate.toFormat('yyyy-MM-dd');
            anKikanStart = '';
            anKikanEnd = '';
        } else {
            // 　３．当月が検索期間範囲内の場合、実績と見込より集計
            //　　　　　予算実績の範囲指定は、検索期間-開始 ～ 当月末
            //　　　　　案件管理の範囲指定は、当月一日～検索期間-終了
            //　　　　　　　※予算実績アプリの当月レコードの実績集計期間（至）の考慮は集計時に実装
            mjKikanStart = fromDate.toFormat('yyyy-MM-dd');
            mjKikanEnd = toGetsu.endOf('month').toFormat('yyyy-MM-dd');

            anKikanStart = toGetsu.startOf('month').toFormat('yyyy-MM-dd');
            anKikanEnd = toDate.toFormat('yyyy-MM-dd');
        }

        // 予実情報
        // 予算 売上:粗利
        return {
            'searchInfoKikanStart': fromDate.toFormat('yyyy-MM-dd'),
            'searchInfoKikanEnd': toDate.toFormat('yyyy-MM-dd'),
            'mjKikanStart': mjKikanStart,
            'mjKikanEnd': mjKikanEnd,
            'anKikanStart': anKikanStart,
            'anKikanEnd': anKikanEnd,
            'kakudo': checkedKakudos
        }
    }

    /**
     * 集計パターンを考慮して、実績用データと案件データを取得
     * @param {array} jissekiDataRaw
     * @param {array} ankenDataRaw
     * @returns object 集計パターンを考慮した実績用データと案件データ
     */
    function processJissekiAnkenData(jissekiDataRaw, ankenDataRaw) {
        const jissekiData = [];
        const ankenData = [];

        const summaryPattern = configPortal.summaryPattern;

        // 実績集計日（至）の初期値として当月の1日をセット
        let today = luxon.DateTime.local();
        let jissekiShukeisumiBi = today.startOf('month');

        jissekiDataRaw.forEach(function (data) {
            let shukeiyoNengetsu = data[cfgYojitsuFields.shukeiyoNengetsu.code].value;
            if (!isCurrentMonth(shukeiyoNengetsu)) {
                jissekiData.push(data);
            } else {
                // 当月のデータの場合
                // 集計フラグが当月=実績+見込み時
                if (summaryPattern === summaryPatternToGetsu.JISSEKI_MIKOMI) {
                    // 実績集計期間（至）に値が存在する場合のみ実績に加算
                    const jissekiShukeiKikanItaru = data[cfgYojitsuFields.jissekiShukeiKikanItaru.code].value;
                    if (jissekiShukeiKikanItaru) {
                        jissekiData.push(data);
                        // 見込みの判定で使用する実績集計期間（至）の値を更新
                        const jissekiShukeiKikanItaruObj = luxon.DateTime.fromFormat(jissekiShukeiKikanItaru.replace(/\//g, '-'), 'yyyy-MM-dd');
                        jissekiShukeisumiBi = jissekiShukeiKikanItaruObj;
                    }
                }
            }
        });

        ankenDataRaw.forEach(function (data) {
            // 当月の集計対象が実績＋見込の場合
            if (summaryPattern === summaryPatternToGetsu.JISSEKI_MIKOMI) {
                var anTargetDateStr = data[configPortal.fields.anken.targetDate].value;
                // 案件管理アプリの集計対象日と目標実績管理アプリの実績の集計済日付と比較
                var anTargetDate = luxon.DateTime.fromFormat(anTargetDateStr.replace(/\//g, '-'), 'yyyy-MM-dd');
                if (anTargetDate.startOf('day') >= jissekiShukeisumiBi.startOf('day')) {
                    ankenData.push(data);
                }
            } else {
                ankenData.push(data);
            }
        });

        return {
            'jisseki': jissekiData,
            'anken': ankenData
        }
    }

    /**
     * ある日付が当月であるかどうかを判定する
     * @param {string} date
     * @returns 当月の場合、trueを返す
     */
    function isCurrentMonth(date) {
        // 当月
        let today = luxon.DateTime.local();
        let compareDate = luxon.DateTime.fromISO(date.replace(/\//g, '-'));

        return compareDate.toFormat('yyyyMM') === today.toFormat('yyyyMM');
    }

    /**
     * エラーメッセージを表示
     * @param {string} textMessage
     * @returns SweetAlert Object
     */
    function showErrorMessage(textMessage) {
        console.log(textMessage);
        showMessage('error', textMessage);
    }

    /**
     * メッセージを表示
     * @param {string} iconMessage メッセージのアイコン
     * @param {string} textMessage メッセージのタイトル
     * @returns SweetAlert Object
     */
    function showMessage(iconMessage, textMessage) {
        Swal.fire({
            icon: iconMessage,
            title: textMessage
        });
    }

})(jQuery, window.nokChart, window.snc);
