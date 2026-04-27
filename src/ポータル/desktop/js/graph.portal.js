/**
 * @fileoverview グラフ表示
 *
 * 【必要ライブラリ】
 * [JavaScript]
 * jquery.min.js -v2.2.3
 * Chart.min.js -v3.9.1
 * spin.min.js -v2.3.2
 * chartjs-plugin-datalabels-2.1.0.min.js
 * chartjs-plugin-doughnutlabel-customized.js
 *
 * [CSS]
 *
 * @author SNC
 * @version 4.5.1
 * @customer XXXXX（yyyy-mm-dd）
*/
jQuery.noConflict();
(function ($) {

    // グローバル変数
    window.nokChart = window.nokChart || {

        /**
         * =======================================================
         * Half Donut Chart
         * =======================================================
         */
        halfDonutChart: function (canvasId, data) {
            // config
            const config = {
                type: 'doughnut',
                data,
                options: {
                    // aspectRatio: 2,
                    maintainAspectRatio: false,
                    animation: {
                        onProgress: function (context) {

                        },
                        onComplete: function (context) {
                            if (context.initial) {
                                window.nokChart.hideSpinner(canvasId); // Hide the spinner
                            }
                        }
                    },
                    plugins: {
                        legend: { // 凡例の表示位置
                            position: 'bottom'
                        },
                        datalabels: {
                            formatter: function (value, ctx) {
                                if (value > 10)
                                    return new Intl.NumberFormat('ja-JP', {
                                        style: 'currency',
                                        currency: 'JPY'
                                    }).format(value);
                                return '';
                            }
                        },
                        doughnutlabel: {
                            labels: [{
                                text: data.datasets[0].percent + '%',
                                font: {
                                    size: 40,
                                    weight: 'bold'
                                }
                            }, {
                                text: data.yTitle + '予算達成（予算： ' + Intl.NumberFormat('ja-JP', {
                                    style: 'currency',
                                    currency: 'JPY'
                                }).format(data.datasets[0].estimatedValue) + '）' // 予算達成（予算）：estimatedValue
                            }
                            ]
                        },
                        tooltip: {
                            enabled: false
                        }
                    }
                },
                plugins: [ChartDataLabels],
            };

            // render chart block
            if (document.getElementById(canvasId)) {
                new Chart(document.getElementById(canvasId), config);
            }
        },

        /**
         * =======================================================
         * Pipeline Chart
         * =======================================================
         */
        pipelineChart: function (canvasId, data) {

            // Get largest number of data
            const graphData = data.datasets[0].data;
            const lastElement = graphData[0];
            const total = lastElement[1] - lastElement[0];

            // config
            const config = {
                type: 'bar',
                data,
                plugins: [ChartDataLabels],
                options: {
                    indexAxis: 'y',
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            grid: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                display: false
                            }
                        },
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: false,
                                drawBorder: false
                            }
                        }
                    },
                    animation: {
                        onComplete: function (context) {
                            if (context.initial) {
                                window.nokChart.hideSpinner(canvasId); // Hide the spinner
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: top
                        },
                        tooltip: {
                            enabled: false
                        },
                        datalabels: {
                            display: true,
                            font: {
                                size: 12,
                            },
                            formatter: function (values, ctx) {
                                let value = values[1] - values[0];
                                if (total === 0) return '';

                                let percent = (value / total * 100);
                                if (percent % 2 !== 0) percent = percent.toFixed(2); // 小数点がある場合、フォーマットする
                                let displayText = '';
                                if (ctx.chart.data.unit === 'money') {
                                    displayText = Intl.NumberFormat('ja-JP', {
                                        style: 'currency',
                                        currency: 'JPY'
                                    }).format(value);
                                }

                                displayText = value + '件';
                                return displayText + ' (' + percent + '%)';
                            }
                        },
                    },
                    /*
                    scales: {
                    x: {
                    title: {
                    display: true,
                    text: '件数'
                    }
                    }
                    }
                     */
                }
            };

            // render chart block
            if (document.getElementById(canvasId)) {
                new Chart(document.getElementById(canvasId), config);
            }
        },

        /**
         * =======================================================
         * Stacked Bar Chart
         * =======================================================
         */
        stackedBarChart: function (canvasId, data, isShowLabel = false) {

            const config = {
                type: 'bar',
                data: data,
                options: {
                    animation: {
                        onComplete: function (context) {
                            if (context.initial) {
                                window.nokChart.hideSpinner(canvasId); // Hide the spinner
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    },
                    scales: {
                        x: {
                            stacked: true,
                        },
                        y: {
                            stacked: true,
                            title: {
                                display: true,
                                text: data.yTitle
                            }
                        }
                    },
                    interaction: {
                        mode: 'index',
                    },
                    maintainAspectRatio: false,
                }
            };

            if (isShowLabel) {
                config.plugins = [ChartDataLabels];
                config.options.plugins.datalabels = {
                    display: true,
                    borderRadius: 3,
                    font: {
                        size: 14,
                    },
                    formatter: function (value, ctx) {
                        if (value > 20)
                            return value;
                        return '';
                    }
                };
            }

            // render chart block
            if (document.getElementById(canvasId)) {
                const chart = new Chart(
                    document.getElementById(canvasId).getContext('2d'), config);
                return chart;
            }
        },

        /**
         * =======================================================
         * Vertical Chart
         * =======================================================
         */
        verticalBarChart: function (canvasId, data) {

            const config = {
                type: 'bar',
                data: data,
                options: {
                    //responsive: true, // canvasサイズ自動設定機能を使わない。HTMLで指定したサイズに固定
                    maintainAspectRatio: false,
                    animation: {
                        onComplete: function (context) {
                            if (context.initial) {
                                window.nokChart.hideSpinner(canvasId); // Hide the spinner
                            }
                        }
                    },
                    plugins: {
                        /*
                        title: { // 図のタイトル表示
                        display: true,
                        fontSize: 20,
                        text: '複系列棒グラフ'
                        },
                         */
                        legend: { // 凡例の表示位置
                            position: 'bottom'
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: data.xTitle
                            }
                        },
                        y: {
                            ticks: {
                                min: 0
                            },
                            title: {
                                display: true,
                                text: data.yTitle
                            }
                        }
                    }
                }
            };

            // render chart block
            if (document.getElementById(canvasId)) {
                new Chart(document.getElementById(canvasId), config);
            }
        },

        showSpinner: function (chartId) {

            let spinnerClass = chartId + '-kintone-spinner';
            let spinnerId = chartId + '-kintone-spin';

            // Initialize
            if ($('.' + spinnerClass).length === 0) {
                // Create elements for the spinner and the background of the spinner
                const spin_div = $('<div id ="' + spinnerId + '" class="' + spinnerClass + '"></div>');
                const spin_bg_div = $('<div id ="kintone-spin-bg" class="' + spinnerClass + '"></div>');

                // Append spinner to the outer div of chart canvas
                const outerDiv = $('#' + chartId).parent('div');
                outerDiv.css('position', 'relative');
                outerDiv.append(spin_div, spin_bg_div);

                // Set a style for the spinner
                $(spin_div).css({
                    'position': 'absolute',
                    'top': '50%',
                    'left': '50%',
                    'z-index': '510',
                    'background-color': '#fff',
                    'padding': '26px',
                    '-moz-border-radius': '4px',
                    '-webkit-border-radius': '4px',
                    'border-radius': '4px'
                });
                $(spin_bg_div).css({
                    'position': 'absolute',
                    'top': '0px',
                    'left': '0px',
                    'z-index': '500',
                    'width': '100%',
                    'height': '100%',
                    'background-color': '#000',
                    'opacity': '0.5',
                    'filter': 'alpha(opacity=50)',
                    '-ms-filter': 'alpha(opacity=50)'
                });

                // Set options for the spinner
                const opts = {
                    'color': '#000'
                };

                // Create the spinner
                new Spinner(opts).spin(document.getElementById(spinnerId));
            }

            // Display the spinner
            $('.' + spinnerClass).show();
        },

        showNoDataMessage: function (chartId) {

            let noDataClass = chartId + '-no-data';

            // Initialize
            if ($('.' + noDataClass).length === 0) {
                // Create elements for the spinner and the background of the spinner
                const message_div = $('<div class="' + noDataClass + '">データがありません。</div>');

                // Append spinner to the outer div of chart canvas
                const outerDiv = $('#' + chartId).parent('div');
                outerDiv.css('position', 'relative');
                outerDiv.append(message_div);

                // Set a style for the spinner
                $(message_div).css({
                    'position': 'absolute',
                    'top': '40%',
                    'left': '30%',
                    'z-index': '8',
                    'background-color': '#fff',
                    'padding': '26px',
                    '-moz-border-radius': '4px',
                    '-webkit-border-radius': '4px',
                    'border-radius': '4px'
                });
            }

            // Display the spinner
            $('.' + noDataClass).show();
            window.nokChart.hideSpinner(chartId);
        },

        hideSpinner(chartId) {
            let spinnerClass = chartId + '-kintone-spinner';
            // Hide the spinner
            $('.' + spinnerClass).hide();
        }
    }

})(jQuery);
