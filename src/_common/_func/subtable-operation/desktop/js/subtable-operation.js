/**
 * @fileoverview サブテーブルの拡張機能
 * - サブテーブルの行複製
 * - サブテーブルの上下移動
 *
 * @author SNC
 * @version 5.0.0
 */
jQuery.noConflict();
(async function ($, nice, commonUtils) {
    'use strict';

    // 行複製機能
    let copyFlg = true;

    // 行の移動機能
    let moveFlg = true;

    // コピー情報をテーブルフィールドコード別に保持するストア
    let copiesStore = {};

    // デフォルトのセレクタ定義（共通で使う）
    const defaultSelectors = {
        add: '.add-row-image-gaia',
        del: '.remove-row-image-gaia',
        buttons: '.subtable-operation-gaia',
        header: 'thead tr',
        rows: 'tbody tr'
    };

    // ボタンのCSSスタイル定義
    const cssObject = {
        copyButton: {
            'background': 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNy4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTM4NCAzMzZsLTE5MiAwYy04LjggMC0xNi03LjItMTYtMTZsMC0yNTZjMC04LjggNy4yLTE2IDE2LTE2bDE0MC4xIDBMNDAwIDExNS45IDQwMCAzMjBjMCA4LjgtNy4yIDE2LTE2IDE2ek0xOTIgMzg0bDE5MiAwYzM1LjMgMCA2NC0yOC43IDY0LTY0bDAtMjA0LjFjMC0xMi43LTUuMS0yNC45LTE0LjEtMzMuOUwzNjYuMSAxNC4xYy05LTktMjEuMi0xNC4xLTMzLjktMTQuMUwxOTIgMGMtMzUuMyAwLTY0IDI4LjctNjQgNjRsMCAyNTZjMCAzNS4zIDI4LjcgNjQgNjQgNjR6TTY0IDEyOGMtMzUuMyAwLTY0IDI4LjctNjQgNjRMMCA0NDhjMCAzNS4zIDI4LjcgNjQgNjQgNjRsMTkyIDBjMzUuMyAwIDY0LTI4LjcgNjQtNjRsMC0zMi00OCAwIDAgMzJjMCA4LjgtNy4yIDE2LTE2IDE2TDY0IDQ2NGMtOC44IDAtMTYtNy4yLTE2LTE2bDAtMjU2YzAtOC44IDcuMi0xNiAxNi0xNmwzMiAwIDAtNDgtMzIgMHoiLz48L3N2Zz4=) center center / contain no-repeat',
            'border': '1px solid transparent',
            'height': '24px',
            'margin-left': '4px',
            'margin-right': '8px',
            'width': '24px'
        },
        moveUpButton: {
            'background': 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNy4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTI1NiA1MTJBMjU2IDI1NiAwIDEgMCAyNTYgMGEyNTYgMjU2IDAgMSAwIDAgNTEyek0zNzcgMjcxYzkuNCA5LjQgOS40IDI0LjYgMCAzMy45cy0yNC42IDkuNC0zMy45IDBsLTg3LTg3LTg3IDg3Yy05LjQgOS40LTI0LjYgOS40LTMzLjkgMHMtOS40LTI0LjYgMC0zMy45TDIzOSAxNjdjOS40LTkuNCAyNC42LTkuNCAzMy45IDBMMzc3IDI3MXoiLz48L3N2Zz4=) center center / contain no-repeat',
            'border': '1px solid transparent',
            'height': '24px',
            'margin-left': '4px',
            'margin-right': '8px',
            'width': '24px'
        },
        moveDownButton: {
            'background': 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNy4xIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjQgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTI1NiAwYTI1NiAyNTYgMCAxIDAgMCA1MTJBMjU2IDI1NiAwIDEgMCAyNTYgMHpNMTM1IDI0MWMtOS40LTkuNC05LjQtMjQuNiAwLTMzLjlzMjQuNi05LjQgMzMuOSAwbDg3IDg3IDg3LTg3YzkuNC05LjQgMjQuNi05LjQgMzMuOSAwczkuNCAyNC42IDAgMzMuOUwyNzMgMzQ1Yy05LjQgOS40LTI0LjYgOS40LTMzLjkgMEwxMzUgMjQxeiIvPjwvc3ZnPg==) center center / contain no-repeat',
            'border': '1px solid transparent',
            'height': '24px',
            'margin-left': '4px',
            'margin-right': '8px',
            'width': '24px'
        }
    };

    // cybozuのwebページ情報取得
    const cybozuDataSubTables = cybozu.data.page.FORM_DATA.schema.subTable;

    /*--行複製機能------------------------------------------------------------------------------------*/
    let events = [
        'app.record.create.show',
        'app.record.edit.show'
    ];

    /**
     * レコード編集画面（新規・編集）の表示時イベント
     * 　サブテーブルの行複製機能
     * 　サブテーブルの上下移動機能
     */
    kintone.events.on(events, async function (event) {
        try {
            // 設定情報が取得済みかを判定
            if (!await nice.isConfigReady()) return event;

            // サブテーブルの数分ループ
            $.each(cybozuDataSubTables, function (key, values) {
                let events = [];
                let table = $('.subtable-' + key);
                let tableFieldCode = values.var;
                const targetNode = $('.subtable-' + key).find('tbody');
                const config = { childList: true };
                // 初期行追加の機能考慮
                const callback = (mutations) => {
                    // kintoneの仕様により、初期行追加の場合、1行目のみ追加される
                    if (targetNode.find('tr').length === 1) {
                        // 監視の終了
                        observer.disconnect();
                        if (copyFlg) {
                            // 行複製ボタン追加の関数呼び出し
                            $.each($(selectors.rows, table), function (index) {
                                setupCopyButton($(this), index);
                            });
                        }
                        if (moveFlg) {
                            // 上下ボタン追加の関数呼び出し
                            $.each($(selectors.rows, table), function (index) {
                                setupMovingButton($(this), index);
                            });
                        }
                    }
                };

                // MutationObserverのインスタンスを生成
                const observer = new MutationObserver(callback);
                // 監視の開始
                observer.observe(targetNode[0], config);

                // kintoneのサブテーブルのclassを保持（defaultSelectorsからコピー）
                const selectors = { ...defaultSelectors };
                // グローバルのボタン作成関数を利用
                let setupCopyButton = function (row, index) {
                    globalSetupCopyButton(row, index, tableFieldCode, selectors);
                };

                let setupMovingButton = function (row, index) {
                    globalSetupMovingButton(row, index, tableFieldCode, table, values, selectors);
                };

                // テーブルのチェンジイベントを追加
                events.push('app.record.create.change.' + tableFieldCode);
                events.push('app.record.edit.change.' + tableFieldCode);

                kintone.events.on(events, function (event) {
                    // 設定情報が未設定の場合は return event
                    if (nice.isEmptyObject(window.nokConfig)) return event;

                    if (copyFlg) {
                        // 行複製ボタン追加の関数呼び出し
                        $.each($(selectors.rows, table), function (index) {
                            setupCopyButton($(this), index);
                        });
                    }
                    if (moveFlg) {
                        // 移動ボタン追加の関数呼び出し
                        $.each($(selectors.rows, table), function (index) {
                            setupMovingButton($(this), index);
                        });
                    }

                    // 行複製機能が有効な場合
                    if (copyFlg) {
                        // copiesStore に保持された値を使う
                        const effectiveCopies = copiesStore[tableFieldCode];
                        if (effectiveCopies) {
                            // 1つ下の行に複製（disabledの情報を保持しつつ、valueのみをコピー）
                            for (let key in effectiveCopies) {
                                if (event.changes.row.value[key]) {
                                    let copyFieldinfo = effectiveCopies[key];
                                    // 値がなければ初期値セット
                                    if (copyFieldinfo.value === undefined || copyFieldinfo.value.length === 0) {
                                        switch (copyFieldinfo.type) {
                                            case 'CHECK_BOX':
                                            case 'MULTI_SELECT':
                                            case 'FILE':
                                            case 'GROUP_SELECT':
                                            case 'ORGANIZATION_SELECT':
                                            case 'USER_SELECT':
                                                event.changes.row.value[key].value = [];
                                                break;
                                            default:
                                                event.changes.row.value[key].value = null;
                                                break;
                                        }
                                    } else {
                                        // valueのみをコピー（disabledなどその他の情報は保持）
                                        event.changes.row.value[key].value = copyFieldinfo.value;
                                        // ルックアップの場合、ルックアップ取得状態にする
                                        if (copyFieldinfo.type === "SINGLE_LINE_TEXT") {
                                            if (event.changes.row.value[key].value) {
                                                event.changes.row.value[key].lookup = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // グローバルのコピー情報をクリア
                    copiesStore[tableFieldCode] = null;
                    return event;
                });

                // 行複製ボタン追加の関数呼び出し
                if (copyFlg) {
                    $.each($(selectors.rows, table), function (index) {
                        setupCopyButton($(this), index);
                    });
                }

                // 移動ボタン追加の関数呼び出し
                if (moveFlg) {
                    $.each($(selectors.rows, table), function (index) {
                        setupMovingButton($(this), index);
                    });
                }
            });
            return event;
        } catch (error) {
            console.log(error);
            return commonUtils.showErrorMessage(event);
        }
    });

    // 共通検索ダイアログのテーブル操作によるイベントのリスナー
    document.addEventListener('tableChangeSearchDialog', function (customEvent) {
        const tableFieldCode = customEvent.detail.fieldCode;
        // 対象テーブルの定義を取得（cybozuDataSubTables から一致するものを探す）
        let values = null;
        // selectors はテーブルごとに同じ構造を使う
        const selectors = defaultSelectors;
        $.each(cybozuDataSubTables, function (key, val) {
            const table = $('.subtable-' + key);
            // 対象のテーブルフィールドコードと一致するかを確認
            if (val.var === tableFieldCode) {
                values = val;

                // 各行にボタンをセット
                $.each($(selectors.rows, table), function (index) {
                    // コピー
                    if (copyFlg) {
                        globalSetupCopyButton($(this), index, tableFieldCode, selectors);
                    }
                    // 移動
                    if (moveFlg) {
                        globalSetupMovingButton($(this), index, tableFieldCode, table, values, selectors);
                    }
                });
                return;
            }
        });
        return;
    });

    // ----以下関数----

    /**
     * 共通：行複製ボタンのセットアップ
     * @param {object} row
     * @param {number} index
     * @param {string} tableFieldCode
     * @param {object} selectors
     */
    function globalSetupCopyButton(row, index, tableFieldCode, selectors) {
        // 行複製ボタンの増殖バグを防ぐ
        if ($(selectors.buttons + ' .snc-copy-row-image-gaia', row).length > 0) {
            $(selectors.buttons + ' .snc-copy-row-image-gaia', row).remove();
        }
        $(selectors.buttons, row).append(
            (function () {
                let res = $('<button>');
                res.css(cssObject.copyButton).addClass('snc-copy-row-image-gaia').attr('type', 'button').attr('title', 'この行を複製する');
                return res;
            })().on('click', makeCopyButtonHandler(tableFieldCode, index, selectors))
        );
    }

    /**
     * 共通：行複製ボタンのクリックハンドラを生成
     * @param {string} tableFieldCode
     * @param {number} index
     * @param {object} selectors
     * @returns
     */
    function makeCopyButtonHandler(tableFieldCode, index, selectors) {
        return function (e) {
            // ボタンから所在する行を取得
            const $btn = $(this);
            const $row = $btn.closest('tr');
            // kintoneのレコード情報を取得してコピー元を保存
            let record = kintone.app.record.get();
            if (record && record.record && record.record[tableFieldCode] && record.record[tableFieldCode].value[index]) {
                copiesStore[tableFieldCode] = record.record[tableFieldCode].value[index].value;
            } else {
                copiesStore[tableFieldCode] = null;
            }
            // 1つ下の行追加ボタンをクリックして追加処理を誘発
            const addBtn = $(selectors.buttons + ' ' + selectors.add, $row)[0];
            if (addBtn) addBtn.click();
        };
    }

    /**
     * 行移動ボタンのセットアップ
     * @param {object} row
     * @param {number} index
     * @param {string} tableFieldCode
     * @param {object} table
     * @param {object} values
     * @param {object} selectors
     */
    function globalSetupMovingButton(row, index, tableFieldCode, table, values, selectors) {
        // 移動ボタンの増殖バグを防ぐ
        if ($(selectors.buttons + ' .snc-moveup-row-image-gaia', row).length > 0) {
            $(selectors.buttons + ' .snc-moveup-row-image-gaia', row).remove();
        }
        if ($(selectors.buttons + ' .snc-movedown-row-image-gaia', row).length > 0) {
            $(selectors.buttons + ' .snc-movedown-row-image-gaia', row).remove();
        }
        // 最上行は上ボタンを追加しない
        if (index !== 0) {
            $(selectors.buttons, row).append(
                (function () {
                    let res = $('<button>');
                    res.css(cssObject.moveUpButton).addClass('snc-moveup-row-image-gaia').attr('type', 'button').attr('title', '上に行を移動する');
                    return res;
                })().on('click', makeMoveButtonHandler(tableFieldCode, index, 'up', values))
            );
        }

        // 最下行は下ボタンを追加しない
        if ($(selectors.rows, table).length - 1 !== index) {
            $(selectors.buttons, row).append(
                (function () {
                    let res = $('<button>');
                    res.css(cssObject.moveDownButton).addClass('snc-movedown-row-image-gaia').attr('type', 'button').attr('title', '下に行を移動する');
                    return res;
                })().on('click', makeMoveButtonHandler(tableFieldCode, index, 'down', values))
            );
        }
    }

    /**
     * 行移動ボタンのクリックハンドラを生成
     * @param {string} tableFieldCode
     * @param {number} index
     * @param {string} direction - 'up' or 'down'
     * @param {object} values - テーブルの定義情報
     * @returns
     */
    function makeMoveButtonHandler(tableFieldCode, index, direction, values) {
        return function (e) {
            let record = kintone.app.record.get();
            let tableList = structuredClone(record.record[tableFieldCode].value);
            if (direction === 'up') {
                if (index <= 0) return;
                [tableList[index - 1], tableList[index]] = [tableList[index], tableList[index - 1]];
                for (let i = 0; i < tableList.length; i++) {
                    if (i === (index - 1) || i === index) {
                        // 行の移動後、lookupを再設定、値がなければクリア
                        $.each(values.fieldList, function (num, val) {
                            if (tableList[i].value[val.var].type === 'SINGLE_LINE_TEXT') {
                                if (tableList[i].value[val.var].value) {
                                    tableList[i].value[val.var].lookup = true;
                                } else {
                                    tableList[i].value[val.var].lookup = 'CLEAR';
                                }
                            }
                        });
                    }
                }
            } else if (direction === 'down') {
                if (index >= tableList.length - 1) return;
                [tableList[index], tableList[index + 1]] = [tableList[index + 1], tableList[index]];
                for (let i = 0; i < tableList.length; i++) {
                    if (i === (index + 1) || i === index) {
                        // 行の移動後、lookupを再設定、値がなければクリア
                        $.each(values.fieldList, function (num, val) {
                            if (tableList[i].value[val.var].type === 'SINGLE_LINE_TEXT') {
                                if (tableList[i].value[val.var].value) {
                                    tableList[i].value[val.var].lookup = true;
                                } else {
                                    tableList[i].value[val.var].lookup = 'CLEAR';
                                }
                            }
                        });
                    }
                }
            }

            record.record[tableFieldCode].value = tableList;
            kintone.app.record.set(record);
        };
    }


})(jQuery, nice, window.commonUtils);
