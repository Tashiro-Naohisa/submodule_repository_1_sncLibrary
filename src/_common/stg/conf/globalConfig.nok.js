/**
 * @fileoverview NICE営業 on kintone 設定情報（kintone全体のカスタマイズに配置）
 * @author SNC
 * @version 4.5.1
 * @customer （yyyy-mm-dd）
 */
(function () {
    'use strict';
    // グローバル変数
    window.nokConfigGlobal = window.nokConfigGlobal || {
        // 【ヤマカミ】 20240327 NICE V4.5 出荷用の設定
        spaceId_2: {
            // リード情報アプリの設定
            lead: {
                app: 19,
                fields: {
                    //--担当者----------------------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaSoshiki': {
                        'code': 'nok_担当者組織',
                        'shown': true,
                        'disabled': true
                    },
                    // --対応者----------------------------------------------------------------
                    'taioshaSearch': {
                        'code': 'nok_対応者検索',
                        'shown': true,
                        'disabled': false
                    },
                    'taioshaId': {
                        'code': 'nok_対応者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'taioshaMei': {
                        'code': 'nok_対応者名',
                        'shown': true,
                        'disabled': true
                    },
                    'taioshaKyoten': {
                        'code': 'nok_対応者拠点',
                        'shown': true,
                        'disabled': true
                    },
                    'taioshaBusho': {
                        'code': 'nok_対応者部署',
                        'shown': true,
                        'disabled': true
                    },
                    'taioshaUser': {
                        'code': 'nok_対応者ユーザ',
                        'shown': true,
                        'disabled': true
                    },
                    'taioshaSoshiki': {
                        'code': 'nok_対応者組織',
                        'shown': true,
                        'disabled': true
                    },
                    //--リード----------------------------------------------------------------
                    'leadTantoJigyoKubun': {
                        'code': 'nok_リード担当事業区分',
                        'shown': true,
                        'disabled': false,
                    },
                    'taioJokyo': {
                        'code': 'nok_対応状況',
                        'shown': true,
                        'disabled': false,
                    },
                    //--対応履歴TB------------------------------------------------------------
                    'taioRirekiTable': {
                        'code': 'nok_対応履歴TB',
                        'shown': true,
                    },
                    'taiobi_table': {
                        'code': 'nok_対応履歴TB_対応日',
                        'shown': true,
                    },
                    'taioKubun_table': {
                        'code': 'nok_対応履歴TB_対応区分',
                        'shown': true,
                    },
                    'taioJokyo_table': {
                        'code': 'nok_対応履歴TB_対応状況',
                        'shown': true,
                    },
                    'taiosha_table': {
                        'code': 'nok_対応履歴TB_対応者',
                        'shown': true,
                    },
                    //--顧客------------------------------------------------------------------
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    //--キーマン----------------------------------------------------------------
                    'keymanSearch': {
                        'code': 'nok_キーマン検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'keymanId': {
                        'code': 'nok_キーマンID',
                        'shown': true,
                        'disabled': true,
                    },
                    'keymanmei': {
                        'code': 'nok_氏名',
                        'shown': true,
                        'disabled': true,
                    },
                    //--問い合わせ情報--------------------------------------------------------------
                    'toiawaseId': {
                        'code': 'nok_問い合わせID',
                        'shown': true,
                        'disabled': false,
                    },
                    'toiawaseShubetsu': {
                        'code': 'nok_問い合わせ種別',
                        'shown': true,
                        'disabled': false,
                    },
                    'toiawaseSeihin': {
                        'code': 'nok_問い合わせ製品',
                        'shown': true,
                        'disabled': false,
                    },
                    'kaishamei': {
                        'code': 'nok_会社名',
                        'shown': true,
                        'disabled': false,
                    },
                    'bumonmei': {
                        'code': 'nok_部門名',
                        'shown': true,
                        'disabled': false,
                    },
                    'name': {
                        'code': 'nok_お名前',
                        'shown': true,
                        'disabled': false,
                    },
                    'yubinBango': {
                        'code': 'nok_郵便番号',
                        'shown': true,
                        'disabled': false,
                    },
                    'todohuken': {
                        'code': 'nok_都道府県',
                        'shown': true,
                        'disabled': false,
                    },
                    'jusho': {
                        'code': 'nok_ご住所',
                        'shown': true,
                        'disabled': false,
                    },
                    'mail': {
                        'code': 'nok_メールアドレス',
                        'shown': true,
                        'disabled': false,
                    },
                    'tel': {
                        'code': 'nok_電話番号',
                        'shown': true,
                        'disabled': false,
                    },
                    'shitsumonNaiyo': {
                        'code': 'nok_ご質問内容',
                        'shown': true,
                        'disabled': false,
                    },
                    'toiawaseNichiji': {
                        'code': 'nok_問い合わせ日時',
                        'shown': true,
                        'disabled': false,
                    },
                    //--システム--------------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                },
            },

            // グラフ管理アプリの設定
            graph: {
                app: 20,
                fields: {
                    // パイプライングラフ
                    'graphId': {
                        'code': 'nok_グラフID',
                    },
                    'graphType': {
                        'code': 'nok_グラフタイプ',
                    },
                    'graphMei': {
                        'code': 'nok_グラフ名',
                    },
                    'graphSetsumei': {
                        'code': 'nok_グラフ説明',
                    },
                    'graphIdKey': {
                        'code': 'nok_グラフIDKey'
                    },
                    'paipurainGraph': {
                        'code': 'nok_パイプライングラフ',
                    },
                    'paipurainTaisho': {
                        'code': 'nok_パイプライン_表示対象',
                    },
                    'paipurainSoshiki': {
                        'code': 'nok_パイプライン_組織選択',
                    },
                    'paipurainCalendarSpace': {
                        'code': 'calendar_space_0',
                    },
                    'paipurainNengetsu': {
                        'code': 'nok_パイプライン_開始年月',
                    },
                    'paipurainAtai': {
                        'code': 'nok_パイプライン_値',
                    },
                    'paipurainHanrei': {
                        'code': 'nok_パイプライン_凡例',
                    },
                    // 積み上げ縦棒グラフ
                    'tsumiageGraph': {
                        'code': 'nok_積み上げ縦棒グラフ',
                    },
                    'tsumiageTaisho': {
                        'code': 'nok_積み上げ_表示対象',
                    },
                    'tsumiageSoshiki': {
                        'code': 'nok_積み上げ_組織選択',
                    },
                    'tsumiageCalendarSpace': {
                        'code': 'calendar_space_1',
                    },
                    'tsumiageNengetsu': {
                        'code': 'nok_積み上げ_開始年月',
                    },
                    'tsumiageJiku': {
                        'code': 'nok_積み上げ_軸',
                    },
                    'tsumiageAtai': {
                        'code': 'nok_積み上げ_値',
                    },
                    'tsumiageHanrei': {
                        'code': 'nok_積み上げ_凡例',
                    },
                    // 半ドーナツグラフ
                    'handonatsuGraph': {
                        'code': 'nok_半ドーナツグラフ',
                    },
                    'handonatsuTaisho': {
                        'code': 'nok_半ドーナツ_表示対象',
                    },
                    'handonatsuSoshiki': {
                        'code': 'nok_半ドーナツ_組織選択',
                    },
                    'handonatsuCalendarSpace': {
                        'code': 'calendar_space_2',
                    },
                    'handonatsuNengetsu': {
                        'code': 'nok_半ドーナツ_開始年月',
                    },
                    'handonatsuAtai': {
                        'code': 'nok_半ドーナツ_値',
                    },
                    'handonatsuKakudo': {
                        'code': 'nok_半ドーナツ_確度',
                    },
                    // 縦棒グラフ
                    'tateboGraph': {
                        'code': 'nok_縦棒グラフ',
                    },
                    'tateboTaisho': {
                        'code': 'nok_縦棒_表示対象',
                    },
                    'tateboSoshiki': {
                        'code': 'nok_縦棒_組織選択',
                    },
                    'tateboCalendarSpace': {
                        'code': 'calendar_space_3',
                    },
                    'tateboNengetsu': {
                        'code': 'nok_縦棒_開始年月',
                    },
                    'tateboJiku': {
                        'code': 'nok_縦棒_軸',
                    },
                    'tateboAtai': {
                        'code': 'nok_縦棒_値',
                    },
                    'tateboKakudo': {
                        'code': 'nok_縦棒_確度',
                    },
                },
                types: {
                    'paipurain': {
                        'code': 'パイプライングラフ',
                    },
                    'tsumiage': {
                        'code': '積み上げ縦棒グラフ',
                    },
                    'handonatsu': {
                        'code': '半ドーナツグラフ',
                    },
                    'tatebo': {
                        'code': '前年対比棒グラフ',
                    },
                }
            },

            // ポータル設定アプリの設定
            portalSetting: {
                app: 21,
                fields: {
                    'portalId': {
                        'code': 'nok_ポータルID'
                    },
                    // メニューテーブル
                    'menuPattern': {
                        'code': 'nok_メニューパターン'
                    },
                    'menuDan': {
                        'code': 'nok_メニュー_段',
                    },
                    'menuHyojijun': {
                        'code': 'nok_メニュー_表示順',
                    },
                    'menuSearch': {
                        'code': 'nok_メニュー検索',
                    },
                    'menuAppMei': {
                        'code': 'nok_アプリ名',
                    },
                    'menuAppId': {
                        'code': 'nok_アプリID',
                    },
                    'menuIchiranMei': {
                        'code': 'nok_一覧名',
                    },
                    'menuIchiranUrl': {
                        'code': 'nok_一覧URL',
                    },
                    'menuBase64Mojiretsu': {
                        'code': 'nok_base64文字列',
                    },
                    'menuId': {
                        'code': 'nok_メニューID'
                    },
                    // グラフテーブル
                    'graphPattern': {
                        'code': 'nok_グラフパターン'
                    },
                    'graphDan': {
                        'code': 'nok_グラフ_段',
                    },
                    'graphHyojijun': {
                        'code': 'nok_グラフ_表示順',
                    },
                    'graphSize': {
                        'code': 'nok_大きさ',
                    },
                    'graphSearch': {
                        'code': 'nok_グラフ検索',
                    },
                    'graphType': {
                        'code': 'nok_グラフタイプ',
                    },
                    'graphName': {
                        'code': 'nok_グラフ名',
                    },
                    'graphSetsumei': {
                        'code': 'nok_グラフ説明',
                    },
                    'graphId': {
                        'code': 'nok_グラフID',
                    }
                },
                menu: {
                    'maxHyojijun': {
                        'code': 10,
                    },
                    'maxHyojidan': {
                        'code': 3,
                    },
                },
                graph: {
                    'maxHyojijun': {
                        'code': 3,
                    },
                    'maxHyojidan': {
                        'code': 5,
                    },
                }
            },

            // メニュー管理アプリの設定
            menu: {
                app: 22,
                fields: {
                    'menuId': {
                        'code': 'nok_メニューID',
                    },
                    'menuAppMei': {
                        'code': 'nok_アプリ名',
                    },
                    'menuAppId': {
                        'code': 'nok_アプリID',
                    },
                    'menuIchiranMei': {
                        'code': 'nok_一覧名',
                    },
                    'menuIchiranUrl': {
                        'code': 'nok_一覧URL',
                    },
                    'menuIcon': {
                        'code': 'nok_メニューアイコン'
                    },
                    'menuBase64Mojiretsu': {
                        'code': 'nok_base64文字列',
                    },
                }
            },

            // 見積管理アプリの設定
            mitsumori: {
                app: 23,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': false,
                        'disabled': true
                    },
                    //--顧客----------------------------------------------------------------
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    //--案件----------------------------------------------------------------
                    'ankenSearch': {
                        'code': 'nok_案件検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'ankenId': {
                        'code': 'nok_案件ID',
                        'shown': true,
                        'disabled': true
                    },
                    'ankenmei': {
                        'code': 'nok_案件名',
                        'shown': true,
                        'disabled': false,
                    },
                    'mitsumoriId': {
                        'code': 'nok_見積ID',
                        'shown': false,
                        'disabled': true,
                    },
                    'mitsumoriIDKey': {
                        'code': 'nok_見積IDKey',
                        'shown': false,
                        'disabled': true,
                    },
                    //--システム案件--------------------------------------------------------
                    'shimeSaito': {
                        'code': 'nok_締サイト',
                        'shown': true,
                        'disabled': false,
                    },
                    'shimebi': {
                        'code': 'nok_締日',
                        'shown': true,
                        'disabled': false,
                    },
                    'shiharaiSaito': {
                        'code': 'nok_支払サイト',
                        'shown': true,
                        'disabled': false,
                    },
                    'shiharaibi': {
                        'code': 'nok_支払日',
                        'shown': true,
                        'disabled': false,
                    },
                    'shiharaiHoho': {
                        'code': 'nok_支払方法',
                        'shown': true,
                        'disabled': false,
                    },
                    'juchubi': {
                        'code': 'nok_受注日',
                        'shown': true,
                        'disabled': false,
                    },
                    'kenshubi': {
                        'code': 'nok_検収日',
                        'shown': true,
                        'disabled': false,
                    },
                    'seikyubi': {
                        'code': 'nok_請求日',
                        'shown': true,
                        'disabled': false,
                    },
                    'nyukinYoteibi': {
                        'code': 'nok_入金予定日',
                        'shown': true,
                        'disabled': true,
                    },
                    'jhuchuShori': {
                        'code': 'nok_受注処理',
                        'taishoValue': '受注',
                        'shown': true,
                        'disabled': false,
                    },
                    'meisaiRenkeiFlag': {
                        'code': 'nok_受注処理フラグ',
                        'shown': true,
                        'disabled': false,
                        'text': '連携済',
                    },
                    'mitsumoriGokeikingaku': {
                        'code': 'nok_合計金額',
                        'shown': true,
                        'disabled': false,
                    },
                    'mitsumoriNo': {
                        'code': 'nok_見積No',
                        'shown': true,
                        'disabled': true,
                    },
                    'mitsumoribi': {
                        'code': 'nok_見積日',
                        'shown': true,
                        'disabled': false,
                    },
                    'nendo': {
                        'code': 'nok_年度',
                        'shown': true,
                        'disabled': true,
                    },
                    //明細----------------------------------------------------------
                    'mitsumoriMeisaiTB': {
                        'code': 'nok_明細TB',
                        'length': '12'
                    },
                    'meisaiNo_T': {
                        'code': 'nok_明細TB_明細No',
                        'shown': true,
                    },
                    'meisaiTableNo_T': {
                        'code': 'nok_明細TB_明細テーブル番号',
                        'shown': true,
                    },
                    'shohinSearch_T': {
                        'code': 'nok_明細TB_商品検索',
                        'shown': true,
                    },
                    'shohinMei_T': {
                        'code': 'nok_明細TB_商品名',
                        'shown': true,
                    },
                    'shohinId_T': {
                        'code': 'nok_明細TB_商品ID',
                        'shown': true,
                    },
                    'teika_T': {
                        'code': 'nok_明細TB_定価',
                        'shown': true,
                    },
                    'tanka_T': {
                        'code': 'nok_明細TB_単価',
                        'shown': true,
                    },
                    'suryo_T': {
                        'code': 'nok_明細TB_数量',
                        'shown': true,
                    },
                    'kingaku_T': {
                        'code': 'nok_明細TB_金額',
                        'shown': true,
                    },
                    'genkaTanka_T': {
                        'code': 'nok_明細TB_原価単価',
                        'shown': true,
                    },
                    'genka_T': {
                        'code': 'nok_明細TB_原価',
                        'shown': true,
                    },
                    'hanbaiTankaCheck_T': {
                        'code': 'nok_明細TB_販売単価チェック',
                        'shown': true,
                    },
                    'shinseiFlag': {
                        'code': 'nok_要確認',
                        'shown': true,
                        'disabled': false,
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'anken_recordNo': {
                        'code': 'nok_見積レコード番号'
                    },
                },
                // 末日
                matujitu: {
                    'day': {
                        'value': '末日'
                    }
                },
                messages: {
                    'failGetSerialNumber': '見積番号の取得に失敗しました。',
                }
            },

            // 見積管理サブテーブル追加用
            mitumoriKanriSubTable: {
                // フィールド
                value: {
                    'nok_明細TB_明細No': {
                        'type': 'SINGLE_LINE_TEXT',
                        'value': ''
                    },
                    'nok_明細TB_商品検索': {
                        'type': 'SINGLE_LINE_TEXT',
                        'value': ''
                    },
                    'nok_明細TB_商品名': {
                        'type': 'SINGLE_LINE_TEXT',
                        'value': ''
                    },
                    'nok_明細TB_商品ID': {
                        'type': 'SINGLE_LINE_TEXT',
                        'value': ''
                    },
                    'nok_明細TB_定価': {
                        'type': 'NUMBER',
                        'value': '0'
                    },
                    'nok_明細TB_単価': {
                        'type': 'NUMBER',
                        'value': '0'
                    },
                    'nok_明細TB_数量': {
                        'type': 'NUMBER',
                        'value': '0'
                    },
                    'nok_明細TB_金額': {
                        'type': 'CALC',
                        'value': '0'
                    },
                    'nok_明細TB_原価単価': {
                        'type': 'NUMBER',
                        'value': '0'
                    },
                    'nok_明細TB_原価': {
                        'type': 'CALC',
                        'value': '0'
                    },
                    'nok_明細TB_販売単価チェック': {
                        'type': 'CALC',
                        'value': '0'
                    },
                },
            },

            // 祝日・休日アプリの設定
            holiday: {
                app: 24,
                fields: {
                    'hiduke': {
                        'code': 'nok_日付',
                        'shown': true,
                        'disabled': false
                    },
                    'kyuujitumei': {
                        'code': 'nok_休日・祝日名',
                        'shown': true,
                        'disabled': false
                    },
                }
            },

            // 商品マスタアプリの設定
            shohinMaster: {
                app: 25,
                // フィールド
                fields: {
                    'shohinId': {
                        'code': 'nok_商品ID',
                        'shown': true,
                        'disabled': true
                    },
                    'shohinMei': {
                        'code': 'nok_商品名'
                    },
                    'shohinTeika': {
                        'code': 'nok_定価'
                    },
                    'shohinTanka': {
                        'code': 'nok_標準単価'
                    },
                    'shohinBiko': {
                        'code': 'nok_商品備考',
                        'shown': true,
                        'disabled': false
                    },
                    'shohinSearch': {
                        'code': 'nok_商品検索コード',
                        'shown': true,
                        'disabled': true
                    },
                    'shohinSuryo': {
                        'code': 'nok_標準数量',
                        'shown': true,
                        'disabled': false
                    },
                    'shohinGenkaTanka': {
                        'code': 'nok_原価単価'
                    },
                    'kanrenShohinCode': {
                        'code': 'nok_関連商品TB_関連商品コード'
                    },
                    'kanrenShohinTb': {
                        'code': 'nok_関連商品TB'
                    },
                    'recordId': {
                        'code': '$id'
                    },
                },
                messages: {
                    'failGetSerialNumber': '商品IDの取得に失敗しました。'
                },
            },

            // 顧客マスタアプリの設定
            kokyaku: {
                app: 26,
                fields: {
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuIDKey': {
                        'code': 'nok_顧客IDKey',
                        'shown': false,
                        'disabled': true,
                    },
                    'yubinBango': {
                        'code': 'nok_郵便番号',
                        'shown': true,
                        'disabled': false,
                    },
                    'jusho': {
                        'code': 'nok_顧客住所',
                        'shown': true,
                        'disabled': false,
                    },
                    'tatemonomei': {
                        'code': 'nok_顧客建物名',
                        'shown': true,
                        'disabled': false,
                    },
                    'tel': {
                        'code': 'nok_TEL',
                        'shown': true,
                        'disabled': false,
                    },
                    'fax': {
                        'code': 'nok_FAX',
                        'shown': true,
                        'disabled': false,
                    },
                    'saishuTaiosha': {
                        'code': 'nok_最終対応者',
                        'shown': true,
                        'disabled': true,
                    },
                    'saishuTaiobi': {
                        'code': 'nok_最終対応日',
                        'shown': true,
                        'disabled': true,
                    },
                    'saishuTaioNaiyo': {
                        'code': 'nok_最終活動内容',
                        'shown': true,
                        'disabled': true,
                    },
                    'saishuHomonMokuteki': {
                        'code': 'nok_最終活動目的',
                        'shown': true,
                        'disabled': true,
                    },
                    'eigyoKakunin': {
                        'code': 'nok_営業確認',
                        'shown': false,
                        'disabled': false,
                    },
                    'ankenKakunin': {
                        'code': 'nok_案件確認',
                        'shown': false,
                        'disabled': false,
                    },
                    'keymanKakunin': {
                        'code': 'nok_キーマン確認',
                        'shown': false,
                        'disabled': false,
                    },
                    'claimKakunin': {
                        'code': 'nok_お問合せ確認',
                        'shown': false,
                        'disabled': false,
                    },
                    'nippoKakunin': {
                        'code': 'nok_報告一括確認',
                        'shown': false,
                        'disabled': false,
                    },
                    'kokyakuRank': {
                        'code': 'nok_顧客ランク',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuTarget': {
                        'code': 'nok_ターゲット分類',
                        'shown': true,
                        'disabled': false,
                    },
                    //--訪問景計画要------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': false,
                    },
                    //--システム----------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'nok_顧客レコード番号'
                    },
                },
                //--案件管理ダイアログ設定-------------------------------------------------------
                kokyakuKanriDaialog: {
                    messages: {
                        'nippoNone': '顧客アプリを呼び出した日報が存在しません。',
                        'registration': '登録しました。'
                    }
                },
                messages: {
                    'failGetSerialNumber': '顧客番号情報の取得に失敗しました。'
                },
            },

            // 案件管理アプリの設定
            anken: {
                app: 18,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': false,
                        'disabled': true
                    },
                    //--顧客----------------------------------------------------------------
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    //--案件----------------------------------------------------------------
                    'ankenId': {
                        'code': 'nok_案件ID',
                        'shown': true,
                        'disabled': true
                    },
                    'ankenmei': {
                        'code': 'nok_案件名',
                        'shown': true,
                        'disabled': false,
                    },
                    'ankenIDKey': {
                        'code': 'nok_案件IDKey',
                        'shown': false,
                        'disabled': true,
                    },
                    'kakudo': {
                        'code': 'nok_確度',
                        'shown': true,
                        'disabled': false,
                    },
                    'homonkekka': {
                        'code': 'nok_活動結果',
                        'shown': true,
                        'disabled': false,
                    },
                    'uriage': {
                        'code': 'nok_売上',
                        'shown': true,
                        'disabled': false,
                    },
                    'fukakachi': {
                        'code': 'nok_粗利',
                        'shown': true,
                        'disabled': false,
                    },
                    'mitsumoriGokeikingaku': {
                        'code': 'nok_見積金額',
                        'shown': false,
                        'disabled': true,
                    },
                    'juchuyoteibi': {
                        'code': 'nok_受注予定日',
                        'shown': true,
                        'disabled': false,
                    },
                    'kenshuyoteibi': {
                        'code': 'nok_検収予定日',
                        'shown': true,
                        'disabled': false,
                    },
                    'eigyoKakunin': {
                        'code': 'nok_営業確認',
                        'shown': false
                    },
                    'mitsumoriKakunin': {
                        'code': 'nok_見積確認',
                        'shown': false
                    },
                    //--システム案件--------------------------------------------------------
                    'shodanProcess01': {
                        'code': 'nok_商談プロセス01',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess02': {
                        'code': 'nok_商談プロセス02',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess03': {
                        'code': 'nok_商談プロセス03',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess04': {
                        'code': 'nok_商談プロセス04',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess05': {
                        'code': 'nok_商談プロセス05',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess06': {
                        'code': 'nok_商談プロセス06',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess07': {
                        'code': 'nok_商談プロセス07',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess08': {
                        'code': 'nok_商談プロセス08',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess09': {
                        'code': 'nok_商談プロセス09',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess10': {
                        'code': 'nok_商談プロセス10',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID01': {
                        'code': 'nok_商談プロセスID01',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID02': {
                        'code': 'nok_商談プロセスID02',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID03': {
                        'code': 'nok_商談プロセスID03',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID04': {
                        'code': 'nok_商談プロセスID04',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID05': {
                        'code': 'nok_商談プロセスID05',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID06': {
                        'code': 'nok_商談プロセスID06',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID07': {
                        'code': 'nok_商談プロセスID07',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID08': {
                        'code': 'nok_商談プロセスID08',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID09': {
                        'code': 'nok_商談プロセスID09',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID10': {
                        'code': 'nok_商談プロセスID10',
                        'shown': false,
                        'disabled': true
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'anken_recordNo': {
                        'code': 'nok_案件レコード番号'
                    },

                },
                //--案件管理ダイアログ設定-------------------------------------------------------
                ankenkanriDaialog: {
                    messages: {
                        'nippoNone': '案件アプリを呼び出した日報が存在しません。',
                        'registration': '登録しました。'
                    }
                },
                messages: {
                    'failGetSerialNumber': '案件ID情報の取得に失敗しました。',
                }
            },

            // 営業レポートアプリの設定
            eigyoRepoto: {
                app: 28,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': false,
                        'disabled': true
                    },
                    //--顧客----------------------------------------------------------------
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': true,
                        'disabled': false,
                    },
                    //--活動報告------------------------------------------------------------
                    'katsudobi': {
                        'code': 'nok_活動日',
                        'shown': true,
                        'disabled': false,
                    },
                    'kaishijikoku': {
                        'code': 'nok_開始時刻',
                        'shown': true,
                        'disabled': false,
                    },
                    'shuryojikoku': {
                        'code': 'nok_終了時刻',
                        'shown': true,
                        'disabled': false,
                    },
                    'yoteiJisseki': {
                        'code': 'nok_予定・実績',
                        'shown': true,
                        'disabled': false,
                    },
                    'homonMokuteki': {
                        'code': 'nok_活動目的',
                        'shown': true,
                        'disabled': false,
                    },
                    'biko': {
                        'code': 'nok_活動内容',
                        'shown': true,
                        'disabled': false,
                    },
                    'nippoId': {
                        'code': 'nok_日報ID',
                        'shown': false,
                        'disabled': true
                    },
                    //--案件----------------------------------------------------------------
                    'ankenmei': {
                        'code': 'nok_案件名',
                        'shown': true,
                        'disabled': true,
                    },
                    'ankenSearch': {
                        'code': 'nok_案件検索',
                        'keyset': false,
                        'shown': true,
                        'disabled': false,
                    },
                    'ankenId': {
                        'code': 'nok_案件ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'ankenRecordId': {
                        'code': 'nok_案件レコード番号',
                        'shown': true,
                        'disabled': true,
                    },
                    'kakudo': {
                        'code': 'nok_確度',
                        'shown': true,
                        'disabled': true,
                    },
                    'homonkekka': {
                        'code': 'nok_活動結果',
                        'shown': true,
                        'disabled': true,
                    },
                    'uriage': {
                        'code': 'nok_売上',
                        'shown': true,
                        'disabled': true,
                    },
                    'fukakachi': {
                        'code': 'nok_粗利',
                        'shown': true,
                        'disabled': true,
                    },
                    'juchuyoteibi': {
                        'code': 'nok_受注予定日',
                        'shown': true,
                        'disabled': true,
                    },
                    'kenshuyoteibi': {
                        'code': 'nok_検収予定日',
                        'shown': true,
                        'disabled': true,
                    },
                    'homongoKakudo': {
                        'code': 'nok_訪問後_確度',
                        'shown': true,
                        'disabled': false,
                    },
                    'homongoKekka': {
                        'code': 'nok_訪問後_結果',
                        'shown': true,
                        'disabled': false,
                    },
                    'homongoUriage': {
                        'code': 'nok_訪問後_売上',
                        'shown': true,
                        'disabled': false,
                    },
                    'homongoFukakachi': {
                        'code': 'nok_訪問後_粗利',
                        'shown': true
                    },
                    'homongoJuchuyoteibi': {
                        'code': 'nok_訪問後_受注予定日',
                        'shown': true,
                        'disabled': false,
                    },
                    'homongoKenshuyoteibi': {
                        'code': 'nok_訪問後_検収予定日',
                        'shown': true,
                        'disabled': false,
                    },
                    //--キーマン連携関連項目------------------------------------------------
                    'keymanTable': {
                        'code': 'nok_キーマンTB'
                    },
                    'keymanSearch': {
                        'code': 'nok_キーマンTB_キーマン検索',
                        'keyset': false,
                        'shown': false,
                    },
                    'keymanmei': {
                        'code': 'nok_キーマンTB_面談者',
                    },
                    'keymanBusho': {
                        'code': 'nok_キーマンTB_面談者部署',
                    },
                    'keymanYakushoku': {
                        'code': 'nok_キーマンTB_面談者役職',
                    },
                    'keymanId': {
                        'code': 'nok_キーマンTB_キーマンID',
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'nok_営業レポートレコード番号'
                    },
                },
                messages: {
                    'saveError': '案件情報の更新に失敗しました。',
                    'getViewError': 'スケジュール表示情報の取得に失敗しました。',
                    'exceptionError': 'エラーが発生しました。\n管理者に問い合わせて下さい。'
                },
                offsetMinutes: 60
            },

            // 報告一括登録（日報登録）アプリの設定
            nippo: {
                app: 29,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': false,
                        'disabled': true
                    },
                    //--日報------------------------------------------------------------
                    'katsudobi': {
                        'code': 'nok_活動日',
                        'shown': true,
                        'disabled': false,
                    },
                    'yoteiJisseki': {
                        'code': 'nok_予定・実績',
                        'shown': true,
                        'disabled': false,
                    },
                    'komento': {
                        'code': 'nok_コメント',
                        'shown': true,
                        'disabled': false,
                    },
                    'nippoId': {
                        'code': 'nok_日報ID',
                        'shown': true,
                        'disabled': true
                    },
                    'eigyoRepotoSpace': {
                        'code': 'nok_eigyoRepotoSpace'
                    },
                    //--活動TB----------------------------------------------------------
                    'eigyoRepoto': {
                        'code': 'nok_営業報告TB',
                        'name': '活動登録',
                    },
                    'kaishijikoku': {
                        'code': 'nok_開始時刻',
                    },
                    'shuryojikoku': {
                        'code': 'nok_終了時刻',
                    },
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                    },
                    'homonMokuteki': {
                        'code': 'nok_活動目的',
                    },
                    'homongoKekka': {
                        'code': 'nok_訪問後_結果',
                    },
                    'biko': {
                        'code': 'nok_活動内容',
                    },
                    //--システム--------------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'レコード番号'
                    },
                    'revision': {
                        'code': '$revision'
                    },
                },
                messages: {
                    'requiredError': '営業活動レポートの登録に必要な情報が入力されていません。入力項目を確認してください。',
                    'inputCheckError': '入力項目を確認してください。',
                    'inputCheckJikoku': '開始時刻、終了時刻を確認してください。',
                    'emptyError': '値が入力されていません。',
                    'postError': '営業活動レポートの登録に失敗しました。\n営業活動レポート情報を登録するため、日報の更新をお願いします。',
                    'exceptionError': 'エラーが発生しました。\n管理者に問い合わせて下さい。'
                },
                offsetMinutes: 60
            },

            // キーマン管理アプリの設定
            keyman: {
                app: 30,
                fields: {
                    'keymanId': {
                        'code': 'nok_キーマンID',
                        'shown': true,
                        'disabled': true
                    },
                    'keymanIDKey': {
                        'code': 'nok_キーマンIDKey',
                        'shown': false,
                        'disabled': true,
                    },
                    'keymanmei': {
                        'code': 'nok_氏名',
                        'shown': true,
                        'disabled': false
                    },
                    'busho': {
                        'code': 'nok_部署',
                        'shown': true,
                        'disabled': false
                    },
                    'yakushoku': {
                        'code': 'nok_役職',
                        'shown': true,
                        'disabled': false
                    },
                    'yubinBango': {
                        'code': 'nok_郵便番号',
                        'shown': true,
                        'disabled': false
                    },
                    'jusho': {
                        'code': 'nok_住所',
                        'shown': true,
                        'disabled': false
                    },
                    'tatemonomei': {
                        'code': 'nok_建物名',
                        'shown': true,
                        'disabled': false
                    },
                    'tel': {
                        'code': 'nok_TEL',
                        'shown': true,
                        'disabled': false
                    },
                    'fax': {
                        'code': 'nok_FAX',
                        'shown': true,
                        'disabled': false
                    },
                    'mail': {
                        'code': 'nok_メールアドレス',
                        'shown': true,
                        'disabled': false
                    },
                    'meishiKaishamei': {
                        'code': 'nok_会社名名刺情報'
                    },
                    'meishiId': {
                        'code': 'nok_ID名刺情報'
                    },
                    'meishiKoshinNichiji': {
                        'code': 'nok_更新日時名刺情報'
                    },
                    'updatedTime': {
                        'code': 'nok_更新日時'
                    },
                    'eigyoKakunin': {
                        'code': 'nok_営業確認',
                        'shown': false
                    },
                    //--顧客----------------------------------------------------------------
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    //--カスタマイズ項目----------------------------------------------------
                    'layerTable': {
                        'code': 'nok_履歴TB',
                        'shown': true,
                        'disabled': false,
                    },
                    'lyakushokuTB': {
                        'code': 'nok_履歴TB_役職',
                    },
                    'ShozokuTB': {
                        'code': 'nok_履歴TB_所属',
                    },
                    'startDateTB': {
                        'code': 'nok_履歴TB_始',
                    },
                    'endDateTB': {
                        'code': 'nok_履歴TB_終',
                    },
                    'mendansyaTable': {
                        'code': 'mendansya_table',
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'nok_キーマンレコード番号'
                    },
                },
                //--カスタマイズ項目----------------------------------------------------
                // レイヤー変更判定リスト
                layerChangeList: {
                    // テーブルにレイヤー履歴を登録する機能
                    layerHistory: [
                        'yakushoku',
                        'busho',
                    ],
                },
                messages: {
                    'failGetSerialNumber': 'キーマンIDの取得に失敗しました。'
                },
            },

            // お問合せアプリの設定
            toiawase: {
                app: 31,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': false,
                        'disabled': true
                    },
                    //--顧客----------------------------------------------------------------
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': false,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    'toiawaseId': {
                        'code': 'nok_お問合せID',
                        'shown': true,
                        'disabled': true,
                    },
                    'toiawaseIDKey': {
                        'code': 'nok_お問合せIDKey',
                        'shown': false,
                        'disabled': true,
                    },
                    'title': {
                        'code': 'nok_タイトル',
                        'shown': true,
                        'disabled': false,
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'nok_クレームレコード番号'
                    },
                    'revision': {
                        'code': '$revision'
                    },
                }
            },

            // 担当者マスタアプリの設定
            tantosha: {
                app: 32,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaSearchId': {
                        'code': 'nok_担当者検索コード',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': false
                    },
                    'kyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': true,
                        'disabled': false
                    },
                    'busho': {
                        'code': 'nok_担当者部署',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': true,
                        'disabled': false
                    },
                    //--顧客スケジュール表示フラグ----------------------------------
                    'hyouji': {
                        'code': 'nok_顧客スケジュール表示設定',
                        'shown': true,
                        'disabled': false
                    },
                    'hyoujiflag': {
                        'value': '表示する',
                    },
                    //--予実用--------------------------------------------------------------
                    'yojitsuYoTantoshaSearchId': {
                        'code': 'nok_予実用担当者コード',
                        'disabled': true
                    },
                    //--ポータル設定---------------------------------------------------------
                    'portalId': {
                        'code': 'nok_ポータルID'
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'nok_担当者レコード番号'
                    },
                }
            },

            // カレンダー表示設定アプリの設定
            view: {
                app: 33,
                fields: {
                    //--表示設定------------------------------------------------------------
                    'hyojiMeisho': {
                        'code': 'nok_表示名称',
                        'shown': true,
                        'disabled': false
                    },
                    'acountId': {
                        'code': 'nok_アカウント情報',
                        'shown': true,
                        'disabled': false
                    },
                    //--担当者TB------------------------------------------------------------
                    'tantoshaTable': {
                        'code': 'nok_担当者TB',
                        'shown': true,
                    },
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                    },
                    'name': {
                        'code': 'nok_担当者名',
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                    },
                    'shozoku01': {
                        'code': 'nok_担当者拠点',
                    },
                    'shozoku02': {
                        'code': 'nok_担当者部署',
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'レコード番号'
                    },
                }
            },

            // 予算・実績管理アプリの設定
            yojitsu: {
                app: 34,
                fields: {
                    'tantoshaId': {
                        'code': 'nok_担当者ID'
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者'
                    },
                    'kyoten': {
                        'code': 'nok_担当者拠点'
                    },
                    'busho': {
                        'code': 'nok_担当者部署'
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                    },
                    'tantoshaCodeYojisseki': {
                        'code': 'nok_担当者コード_予実績用'
                    },
                    'mokuhyoUriageKingaku': {
                        'code': 'nok_目標売上金額'
                    },
                    'mokuhyoArariKingaku': {
                        'code': 'nok_目標粗利金額'
                    },
                    'jissekiUriageKingaku': {
                        'code': 'nok_実績売上金額'
                    },
                    'jissekiArariKingaku': {
                        'code': 'nok_実績粗利金額'
                    },
                    'shukeiyoNengetsu': {
                        'code': 'nok_集計用年月'
                    },
                    'jissekiShukeiKikanItaru': {
                        'code': 'nok_実績集計期間_至'
                    },
                    //--システム--------------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'レコード番号'
                    },
                }
            },

            // 予算・実績表設定アプリの設定
            yojitsuSetting: {
                app: 27,
                fields: {
                    'hyojimei': {
                        'code': 'nok_表示名'
                    },
                    'accountId': {
                        'code': 'nok_アカウント情報'
                    },
                    'hyojijun': {
                        'code': 'nok_表示順'
                    },
                    'kikan': {
                        'code': 'nok_期間'
                    },
                    'kakudo': {
                        'code': 'nok_確度'
                    },
                    'uriageArari': {
                        'code': 'nok_売上_粗利'
                    },
                    //--拠点テーブル--------------------------------------------------------
                    'kyotenTable': {
                        'code': 'nok_拠点TB'
                    },
                    'kyoten': {
                        'code': 'nok_拠点テーブル_拠点'
                    },
                    'tsuki': {
                        'code': 'nok_月'
                    },
                    'kiNendo': {
                        'code': 'nok_期・年度'
                    },
                    //--部署テーブル--------------------------------------------------------
                    'bushoTable': {
                        'code': 'nok_部署TB'
                    },
                    'busho': {
                        'code': 'nok_部署テーブル_部署'
                    },
                    'bushoKyoten': {
                        'code': 'nok_部署テーブル_拠点'
                    },
                    //--担当者テーブル------------------------------------------------------
                    'tantoshaTable': {
                        'code': 'nok_担当者TB'
                    },
                    'tantoshaSearch': {
                        'code': 'nok_担当者テーブル_担当者検索'
                    },
                    'tantoshamei': {
                        'code': 'nok_担当者テーブル_担当者名'
                    },
                    'tantoshaCode': {
                        'code': 'nok_担当者テーブル_担当者コード'
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者テーブル_拠点'
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者テーブル_部署'
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'レコード番号'
                    },
                }
            },

            // 管理ユーザー情報
            kanriUsers: [
                //			'Administrator',
            ],
            // 管理者（名寄せ）
            nayose_kanriUsers: [
                'snc00397', 'Nagoshi', 'snc00441',
            ],
        },

        // （変更後）20240327 NICE V4.5 出荷用の設定
        spaceId_3: {
            // リード情報アプリの設定
            lead: {
                app: 51,
                fields: {
                    //--担当者----------------------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaSoshiki': {
                        'code': 'nok_担当者組織',
                        'shown': true,
                        'disabled': true
                    },
                    // --対応者----------------------------------------------------------------
                    'taioshaSearch': {
                        'code': 'nok_対応者検索',
                        'shown': true,
                        'disabled': false
                    },
                    'taioshaId': {
                        'code': 'nok_対応者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'taioshaMei': {
                        'code': 'nok_対応者名',
                        'shown': true,
                        'disabled': true
                    },
                    'taioshaKyoten': {
                        'code': 'nok_対応者拠点',
                        'shown': true,
                        'disabled': true
                    },
                    'taioshaBusho': {
                        'code': 'nok_対応者部署',
                        'shown': true,
                        'disabled': true
                    },
                    'taioshaUser': {
                        'code': 'nok_対応者ユーザ',
                        'shown': true,
                        'disabled': true
                    },
                    'taioshaSoshiki': {
                        'code': 'nok_対応者組織',
                        'shown': true,
                        'disabled': true
                    },
                    //--リード----------------------------------------------------------------
                    'leadTantoJigyoKubun': {
                        'code': 'nok_リード担当事業区分',
                        'shown': true,
                        'disabled': false,
                    },
                    'taioJokyo': {
                        'code': 'nok_対応状況',
                        'shown': true,
                        'disabled': false,
                    },
                    //--対応履歴TB------------------------------------------------------------
                    'taioRirekiTable': {
                        'code': 'nok_対応履歴TB',
                        'shown': true,
                    },
                    'taiobi_table': {
                        'code': 'nok_対応履歴TB_対応日',
                        'shown': true,
                    },
                    'taioKubun_table': {
                        'code': 'nok_対応履歴TB_対応区分',
                        'shown': true,
                    },
                    'taioJokyo_table': {
                        'code': 'nok_対応履歴TB_対応状況',
                        'shown': true,
                    },
                    'taiosha_table': {
                        'code': 'nok_対応履歴TB_対応者',
                        'shown': true,
                    },
                    //--顧客------------------------------------------------------------------
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    //--キーマン----------------------------------------------------------------
                    'keymanSearch': {
                        'code': 'nok_キーマン検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'keymanId': {
                        'code': 'nok_キーマンID',
                        'shown': true,
                        'disabled': true,
                    },
                    'keymanmei': {
                        'code': 'nok_氏名',
                        'shown': true,
                        'disabled': true,
                    },
                    //--問い合わせ情報--------------------------------------------------------------
                    'toiawaseId': {
                        'code': 'nok_問い合わせID',
                        'shown': true,
                        'disabled': false,
                    },
                    'toiawaseShubetsu': {
                        'code': 'nok_問い合わせ種別',
                        'shown': true,
                        'disabled': false,
                    },
                    'toiawaseSeihin': {
                        'code': 'nok_問い合わせ製品',
                        'shown': true,
                        'disabled': false,
                    },
                    'kaishamei': {
                        'code': 'nok_会社名',
                        'shown': true,
                        'disabled': false,
                    },
                    'bumonmei': {
                        'code': 'nok_部門名',
                        'shown': true,
                        'disabled': false,
                    },
                    'name': {
                        'code': 'nok_お名前',
                        'shown': true,
                        'disabled': false,
                    },
                    'yubinBango': {
                        'code': 'nok_郵便番号',
                        'shown': true,
                        'disabled': false,
                    },
                    'todohuken': {
                        'code': 'nok_都道府県',
                        'shown': true,
                        'disabled': false,
                    },
                    'jusho': {
                        'code': 'nok_ご住所',
                        'shown': true,
                        'disabled': false,
                    },
                    'mail': {
                        'code': 'nok_メールアドレス',
                        'shown': true,
                        'disabled': false,
                    },
                    'tel': {
                        'code': 'nok_電話番号',
                        'shown': true,
                        'disabled': false,
                    },
                    'shitsumonNaiyo': {
                        'code': 'nok_ご質問内容',
                        'shown': true,
                        'disabled': false,
                    },
                    'toiawaseNichiji': {
                        'code': 'nok_問い合わせ日時',
                        'shown': true,
                        'disabled': false,
                    },
                    //--システム--------------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                },
            },

            // グラフ管理アプリの設定
            graph: {
                app: 50,
                fields: {
                    // パイプライングラフ
                    'graphId': {
                        'code': 'nok_グラフID',
                    },
                    'graphType': {
                        'code': 'nok_グラフタイプ',
                    },
                    'graphMei': {
                        'code': 'nok_グラフ名',
                    },
                    'graphSetsumei': {
                        'code': 'nok_グラフ説明',
                    },
                    'graphIdKey': {
                        'code': 'nok_グラフIDKey'
                    },
                    'paipurainGraph': {
                        'code': 'nok_パイプライングラフ',
                    },
                    'paipurainTaisho': {
                        'code': 'nok_パイプライン_表示対象',
                    },
                    'paipurainSoshiki': {
                        'code': 'nok_パイプライン_組織選択',
                    },
                    'paipurainCalendarSpace': {
                        'code': 'calendar_space_0',
                    },
                    'paipurainNengetsu': {
                        'code': 'nok_パイプライン_開始年月',
                    },
                    'paipurainAtai': {
                        'code': 'nok_パイプライン_値',
                    },
                    'paipurainHanrei': {
                        'code': 'nok_パイプライン_凡例',
                    },
                    // 積み上げ縦棒グラフ
                    'tsumiageGraph': {
                        'code': 'nok_積み上げ縦棒グラフ',
                    },
                    'tsumiageTaisho': {
                        'code': 'nok_積み上げ_表示対象',
                    },
                    'tsumiageSoshiki': {
                        'code': 'nok_積み上げ_組織選択',
                    },
                    'tsumiageCalendarSpace': {
                        'code': 'calendar_space_1',
                    },
                    'tsumiageNengetsu': {
                        'code': 'nok_積み上げ_開始年月',
                    },
                    'tsumiageJiku': {
                        'code': 'nok_積み上げ_軸',
                    },
                    'tsumiageAtai': {
                        'code': 'nok_積み上げ_値',
                    },
                    'tsumiageHanrei': {
                        'code': 'nok_積み上げ_凡例',
                    },
                    // 半ドーナツグラフ
                    'handonatsuGraph': {
                        'code': 'nok_半ドーナツグラフ',
                    },
                    'handonatsuTaisho': {
                        'code': 'nok_半ドーナツ_表示対象',
                    },
                    'handonatsuSoshiki': {
                        'code': 'nok_半ドーナツ_組織選択',
                    },
                    'handonatsuCalendarSpace': {
                        'code': 'calendar_space_2',
                    },
                    'handonatsuNengetsu': {
                        'code': 'nok_半ドーナツ_開始年月',
                    },
                    'handonatsuAtai': {
                        'code': 'nok_半ドーナツ_値',
                    },
                    'handonatsuKakudo': {
                        'code': 'nok_半ドーナツ_確度',
                    },
                    // 縦棒グラフ
                    'tateboGraph': {
                        'code': 'nok_縦棒グラフ',
                    },
                    'tateboTaisho': {
                        'code': 'nok_縦棒_表示対象',
                    },
                    'tateboSoshiki': {
                        'code': 'nok_縦棒_組織選択',
                    },
                    'tateboCalendarSpace': {
                        'code': 'calendar_space_3',
                    },
                    'tateboNengetsu': {
                        'code': 'nok_縦棒_開始年月',
                    },
                    'tateboJiku': {
                        'code': 'nok_縦棒_軸',
                    },
                    'tateboAtai': {
                        'code': 'nok_縦棒_値',
                    },
                    'tateboKakudo': {
                        'code': 'nok_縦棒_確度',
                    },
                },
                types: {
                    'paipurain': {
                        'code': 'パイプライングラフ',
                    },
                    'tsumiage': {
                        'code': '積み上げ縦棒グラフ',
                    },
                    'handonatsu': {
                        'code': '半ドーナツグラフ',
                    },
                    'tatebo': {
                        'code': '前年対比棒グラフ',
                    },
                }
            },

            // ポータル設定アプリの設定
            portalSetting: {
                app: 49,
                fields: {
                    'portalId': {
                        'code': 'nok_ポータルID'
                    },
                    // メニューテーブル
                    'menuPattern': {
                        'code': 'nok_メニューパターン'
                    },
                    'menuDan': {
                        'code': 'nok_メニュー_段',
                    },
                    'menuHyojijun': {
                        'code': 'nok_メニュー_表示順',
                    },
                    'menuSearch': {
                        'code': 'nok_メニュー検索',
                    },
                    'menuAppMei': {
                        'code': 'nok_アプリ名',
                    },
                    'menuAppId': {
                        'code': 'nok_アプリID',
                    },
                    'menuIchiranMei': {
                        'code': 'nok_一覧名',
                    },
                    'menuIchiranUrl': {
                        'code': 'nok_一覧URL',
                    },
                    'menuBase64Mojiretsu': {
                        'code': 'nok_base64文字列',
                    },
                    'menuId': {
                        'code': 'nok_メニューID'
                    },
                    // グラフテーブル
                    'graphPattern': {
                        'code': 'nok_グラフパターン'
                    },
                    'graphDan': {
                        'code': 'nok_グラフ_段',
                    },
                    'graphHyojijun': {
                        'code': 'nok_グラフ_表示順',
                    },
                    'graphSize': {
                        'code': 'nok_大きさ',
                    },
                    'graphSearch': {
                        'code': 'nok_グラフ検索',
                    },
                    'graphType': {
                        'code': 'nok_グラフタイプ',
                    },
                    'graphName': {
                        'code': 'nok_グラフ名',
                    },
                    'graphSetsumei': {
                        'code': 'nok_グラフ説明',
                    },
                    'graphId': {
                        'code': 'nok_グラフID',
                    }
                },
                menu: {
                    'maxHyojijun': {
                        'code': 10,
                    },
                    'maxHyojidan': {
                        'code': 3,
                    },
                },
                graph: {
                    'maxHyojijun': {
                        'code': 3,
                    },
                    'maxHyojidan': {
                        'code': 5,
                    },
                }
            },

            // メニュー管理アプリの設定
            menu: {
                app: 48,
                fields: {
                    'menuId': {
                        'code': 'nok_メニューID',
                    },
                    'menuAppMei': {
                        'code': 'nok_アプリ名',
                    },
                    'menuAppId': {
                        'code': 'nok_アプリID',
                    },
                    'menuIchiranMei': {
                        'code': 'nok_一覧名',
                    },
                    'menuIchiranUrl': {
                        'code': 'nok_一覧URL',
                    },
                    'menuIcon': {
                        'code': 'nok_メニューアイコン'
                    },
                    'menuBase64Mojiretsu': {
                        'code': 'nok_base64文字列',
                    },
                }
            },

            // 見積管理アプリの設定
            mitsumori: {
                app: 47,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': false,
                        'disabled': true
                    },
                    //--顧客----------------------------------------------------------------
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    //--案件----------------------------------------------------------------
                    'ankenSearch': {
                        'code': 'nok_案件検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'ankenId': {
                        'code': 'nok_案件ID',
                        'shown': true,
                        'disabled': true
                    },
                    'ankenmei': {
                        'code': 'nok_案件名',
                        'shown': true,
                        'disabled': false,
                    },
                    'mitsumoriId': {
                        'code': 'nok_見積ID',
                        'shown': false,
                        'disabled': true,
                    },
                    'mitsumoriIDKey': {
                        'code': 'nok_見積IDKey',
                        'shown': false,
                        'disabled': true,
                    },
                    //--システム案件--------------------------------------------------------
                    'shimeSaito': {
                        'code': 'nok_締サイト',
                        'shown': true,
                        'disabled': false,
                    },
                    'shimebi': {
                        'code': 'nok_締日',
                        'shown': true,
                        'disabled': false,
                    },
                    'shiharaiSaito': {
                        'code': 'nok_支払サイト',
                        'shown': true,
                        'disabled': false,
                    },
                    'shiharaibi': {
                        'code': 'nok_支払日',
                        'shown': true,
                        'disabled': false,
                    },
                    'shiharaiHoho': {
                        'code': 'nok_支払方法',
                        'shown': true,
                        'disabled': false,
                    },
                    'juchubi': {
                        'code': 'nok_受注日',
                        'shown': true,
                        'disabled': false,
                    },
                    'kenshubi': {
                        'code': 'nok_検収日',
                        'shown': true,
                        'disabled': false,
                    },
                    'seikyubi': {
                        'code': 'nok_請求日',
                        'shown': true,
                        'disabled': false,
                    },
                    'nyukinYoteibi': {
                        'code': 'nok_入金予定日',
                        'shown': true,
                        'disabled': true,
                    },
                    'jhuchuShori': {
                        'code': 'nok_受注処理',
                        'taishoValue': '受注',
                        'shown': true,
                        'disabled': false,
                    },
                    'meisaiRenkeiFlag': {
                        'code': 'nok_受注処理フラグ',
                        'shown': true,
                        'disabled': false,
                        'text': '連携済',
                    },
                    'mitsumoriGokeikingaku': {
                        'code': 'nok_合計金額',
                        'shown': true,
                        'disabled': false,
                    },
                    'mitsumoriNo': {
                        'code': 'nok_見積No',
                        'shown': true,
                        'disabled': true,
                    },
                    'mitsumoribi': {
                        'code': 'nok_見積日',
                        'shown': true,
                        'disabled': false,
                    },
                    'nendo': {
                        'code': 'nok_年度',
                        'shown': true,
                        'disabled': true,
                    },
                    //明細----------------------------------------------------------
                    'mitsumoriMeisaiTB': {
                        'code': 'nok_明細TB',
                        'length': '12'
                    },
                    'meisaiNo_T': {
                        'code': 'nok_明細TB_明細No',
                        'shown': true,
                    },
                    'meisaiTableNo_T': {
                        'code': 'nok_明細TB_明細テーブル番号',
                        'shown': true,
                    },
                    'shohinSearch_T': {
                        'code': 'nok_明細TB_商品検索',
                        'shown': true,
                    },
                    'shohinMei_T': {
                        'code': 'nok_明細TB_商品名',
                        'shown': true,
                    },
                    'shohinId_T': {
                        'code': 'nok_明細TB_商品ID',
                        'shown': true,
                    },
                    'teika_T': {
                        'code': 'nok_明細TB_定価',
                        'shown': true,
                    },
                    'tanka_T': {
                        'code': 'nok_明細TB_単価',
                        'shown': true,
                    },
                    'suryo_T': {
                        'code': 'nok_明細TB_数量',
                        'shown': true,
                    },
                    'kingaku_T': {
                        'code': 'nok_明細TB_金額',
                        'shown': true,
                    },
                    'genkaTanka_T': {
                        'code': 'nok_明細TB_原価単価',
                        'shown': true,
                    },
                    'genka_T': {
                        'code': 'nok_明細TB_原価',
                        'shown': true,
                    },
                    'hanbaiTankaCheck_T': {
                        'code': 'nok_明細TB_販売単価チェック',
                        'shown': true,
                    },
                    'shinseiFlag': {
                        'code': 'nok_要確認',
                        'shown': true,
                        'disabled': false,
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'anken_recordNo': {
                        'code': 'nok_見積レコード番号'
                    },
                },
                // 末日
                matujitu: {
                    'day': {
                        'value': '末日'
                    }
                },
                messages: {
                    'failGetSerialNumber': '見積番号の取得に失敗しました。',
                }
            },

            // 見積管理サブテーブル追加用
            mitumoriKanriSubTable: {
                // フィールド
                value: {
                    'nok_明細TB_明細No': {
                        'type': 'SINGLE_LINE_TEXT',
                        'value': ''
                    },
                    'nok_明細TB_商品検索': {
                        'type': 'SINGLE_LINE_TEXT',
                        'value': ''
                    },
                    'nok_明細TB_商品名': {
                        'type': 'SINGLE_LINE_TEXT',
                        'value': ''
                    },
                    'nok_明細TB_商品ID': {
                        'type': 'SINGLE_LINE_TEXT',
                        'value': ''
                    },
                    'nok_明細TB_定価': {
                        'type': 'NUMBER',
                        'value': '0'
                    },
                    'nok_明細TB_単価': {
                        'type': 'NUMBER',
                        'value': '0'
                    },
                    'nok_明細TB_数量': {
                        'type': 'NUMBER',
                        'value': '0'
                    },
                    'nok_明細TB_金額': {
                        'type': 'CALC',
                        'value': '0'
                    },
                    'nok_明細TB_原価単価': {
                        'type': 'NUMBER',
                        'value': '0'
                    },
                    'nok_明細TB_原価': {
                        'type': 'CALC',
                        'value': '0'
                    },
                    'nok_明細TB_販売単価チェック': {
                        'type': 'CALC',
                        'value': '0'
                    },
                },
            },

            // 祝日・休日アプリの設定
            holiday: {
                app: 46,
                fields: {
                    'hiduke': {
                        'code': 'nok_日付',
                        'shown': true,
                        'disabled': false
                    },
                    'kyuujitumei': {
                        'code': 'nok_休日・祝日名',
                        'shown': true,
                        'disabled': false
                    },
                }
            },

            // 商品マスタアプリの設定
            shohinMaster: {
                app: 45,
                // フィールド
                fields: {
                    'shohinId': {
                        'code': 'nok_商品ID',
                        'shown': true,
                        'disabled': true
                    },
                    'shohinMei': {
                        'code': 'nok_商品名'
                    },
                    'shohinTeika': {
                        'code': 'nok_定価'
                    },
                    'shohinTanka': {
                        'code': 'nok_標準単価'
                    },
                    'shohinBiko': {
                        'code': 'nok_商品備考',
                        'shown': true,
                        'disabled': false
                    },
                    'shohinSearch': {
                        'code': 'nok_商品検索コード',
                        'shown': true,
                        'disabled': true
                    },
                    'shohinSuryo': {
                        'code': 'nok_標準数量',
                        'shown': true,
                        'disabled': false
                    },
                    'shohinGenkaTanka': {
                        'code': 'nok_原価単価'
                    },
                    'kanrenShohinCode': {
                        'code': 'nok_関連商品TB_関連商品コード'
                    },
                    'kanrenShohinTb': {
                        'code': 'nok_関連商品TB'
                    },
                    'recordId': {
                        'code': '$id'
                    },
                },
                messages: {
                    'failGetSerialNumber': '商品IDの取得に失敗しました。'
                },
            },

            // 顧客マスタアプリの設定
            kokyaku: {
                app: 44,
                fields: {
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuIDKey': {
                        'code': 'nok_顧客IDKey',
                        'shown': false,
                        'disabled': true,
                    },
                    'yubinBango': {
                        'code': 'nok_郵便番号',
                        'shown': true,
                        'disabled': false,
                    },
                    'jusho': {
                        'code': 'nok_顧客住所',
                        'shown': true,
                        'disabled': false,
                    },
                    'tatemonomei': {
                        'code': 'nok_顧客建物名',
                        'shown': true,
                        'disabled': false,
                    },
                    'tel': {
                        'code': 'nok_TEL',
                        'shown': true,
                        'disabled': false,
                    },
                    'fax': {
                        'code': 'nok_FAX',
                        'shown': true,
                        'disabled': false,
                    },
                    'saishuTaiosha': {
                        'code': 'nok_最終対応者',
                        'shown': true,
                        'disabled': true,
                    },
                    'saishuTaiobi': {
                        'code': 'nok_最終対応日',
                        'shown': true,
                        'disabled': true,
                    },
                    'saishuTaioNaiyo': {
                        'code': 'nok_最終活動内容',
                        'shown': true,
                        'disabled': true,
                    },
                    'saishuHomonMokuteki': {
                        'code': 'nok_最終活動目的',
                        'shown': true,
                        'disabled': true,
                    },
                    'eigyoKakunin': {
                        'code': 'nok_営業確認',
                        'shown': false,
                        'disabled': false,
                    },
                    'ankenKakunin': {
                        'code': 'nok_案件確認',
                        'shown': false,
                        'disabled': false,
                    },
                    'keymanKakunin': {
                        'code': 'nok_キーマン確認',
                        'shown': false,
                        'disabled': false,
                    },
                    'claimKakunin': {
                        'code': 'nok_お問合せ確認',
                        'shown': false,
                        'disabled': false,
                    },
                    'nippoKakunin': {
                        'code': 'nok_報告一括確認',
                        'shown': false,
                        'disabled': false,
                    },
                    'kokyakuRank': {
                        'code': 'nok_顧客ランク',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuTarget': {
                        'code': 'nok_ターゲット分類',
                        'shown': true,
                        'disabled': false,
                    },
                    //--訪問景計画要------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': false,
                    },
                    //--システム----------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'nok_顧客レコード番号'
                    },
                },
                //--案件管理ダイアログ設定-------------------------------------------------------
                kokyakuKanriDaialog: {
                    messages: {
                        'nippoNone': '顧客アプリを呼び出した日報が存在しません。',
                        'registration': '登録しました。'
                    }
                },
                messages: {
                    'failGetSerialNumber': '顧客番号情報の取得に失敗しました。'
                },
            },

            // 案件管理アプリの設定
            anken: {
                app: 43,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': false,
                        'disabled': true
                    },
                    //--顧客----------------------------------------------------------------
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    //--案件----------------------------------------------------------------
                    'ankenId': {
                        'code': 'nok_案件ID',
                        'shown': true,
                        'disabled': true
                    },
                    'ankenmei': {
                        'code': 'nok_案件名',
                        'shown': true,
                        'disabled': false,
                    },
                    'ankenIDKey': {
                        'code': 'nok_案件IDKey',
                        'shown': false,
                        'disabled': true,
                    },
                    'kakudo': {
                        'code': 'nok_確度',
                        'shown': true,
                        'disabled': false,
                    },
                    'homonkekka': {
                        'code': 'nok_活動結果',
                        'shown': true,
                        'disabled': false,
                    },
                    'uriage': {
                        'code': 'nok_売上',
                        'shown': true,
                        'disabled': false,
                    },
                    'fukakachi': {
                        'code': 'nok_粗利',
                        'shown': true,
                        'disabled': false,
                    },
                    'mitsumoriGokeikingaku': {
                        'code': 'nok_見積金額',
                        'shown': false,
                        'disabled': true,
                    },
                    'juchuyoteibi': {
                        'code': 'nok_受注予定日',
                        'shown': true,
                        'disabled': false,
                    },
                    'kenshuyoteibi': {
                        'code': 'nok_検収予定日',
                        'shown': true,
                        'disabled': false,
                    },
                    'eigyoKakunin': {
                        'code': 'nok_営業確認',
                        'shown': false
                    },
                    'mitsumoriKakunin': {
                        'code': 'nok_見積確認',
                        'shown': false
                    },
                    //--システム案件--------------------------------------------------------
                    'shodanProcess01': {
                        'code': 'nok_商談プロセス01',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess02': {
                        'code': 'nok_商談プロセス02',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess03': {
                        'code': 'nok_商談プロセス03',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess04': {
                        'code': 'nok_商談プロセス04',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess05': {
                        'code': 'nok_商談プロセス05',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess06': {
                        'code': 'nok_商談プロセス06',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess07': {
                        'code': 'nok_商談プロセス07',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess08': {
                        'code': 'nok_商談プロセス08',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess09': {
                        'code': 'nok_商談プロセス09',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess10': {
                        'code': 'nok_商談プロセス10',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID01': {
                        'code': 'nok_商談プロセスID01',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID02': {
                        'code': 'nok_商談プロセスID02',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID03': {
                        'code': 'nok_商談プロセスID03',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID04': {
                        'code': 'nok_商談プロセスID04',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID05': {
                        'code': 'nok_商談プロセスID05',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID06': {
                        'code': 'nok_商談プロセスID06',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID07': {
                        'code': 'nok_商談プロセスID07',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID08': {
                        'code': 'nok_商談プロセスID08',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID09': {
                        'code': 'nok_商談プロセスID09',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID10': {
                        'code': 'nok_商談プロセスID10',
                        'shown': false,
                        'disabled': true
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'anken_recordNo': {
                        'code': 'nok_案件レコード番号'
                    },

                },
                //--案件管理ダイアログ設定-------------------------------------------------------
                ankenkanriDaialog: {
                    messages: {
                        'nippoNone': '案件アプリを呼び出した日報が存在しません。',
                        'registration': '登録しました。'
                    }
                },
                messages: {
                    'failGetSerialNumber': '案件ID情報の取得に失敗しました。',
                }
            },

            // 営業レポートアプリの設定
            eigyoRepoto: {
                app: 42,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': false,
                        'disabled': true
                    },
                    //--顧客----------------------------------------------------------------
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': true,
                        'disabled': false,
                    },
                    //--活動報告------------------------------------------------------------
                    'katsudobi': {
                        'code': 'nok_活動日',
                        'shown': true,
                        'disabled': false,
                    },
                    'kaishijikoku': {
                        'code': 'nok_開始時刻',
                        'shown': true,
                        'disabled': false,
                    },
                    'shuryojikoku': {
                        'code': 'nok_終了時刻',
                        'shown': true,
                        'disabled': false,
                    },
                    'yoteiJisseki': {
                        'code': 'nok_予定・実績',
                        'shown': true,
                        'disabled': false,
                    },
                    'homonMokuteki': {
                        'code': 'nok_活動目的',
                        'shown': true,
                        'disabled': false,
                    },
                    'biko': {
                        'code': 'nok_活動内容',
                        'shown': true,
                        'disabled': false,
                    },
                    'nippoId': {
                        'code': 'nok_日報ID',
                        'shown': false,
                        'disabled': true
                    },
                    //--案件----------------------------------------------------------------
                    'ankenmei': {
                        'code': 'nok_案件名',
                        'shown': true,
                        'disabled': true,
                    },
                    'ankenSearch': {
                        'code': 'nok_案件検索',
                        'keyset': false,
                        'shown': true,
                        'disabled': false,
                    },
                    'ankenId': {
                        'code': 'nok_案件ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'ankenRecordId': {
                        'code': 'nok_案件レコード番号',
                        'shown': true,
                        'disabled': true,
                    },
                    'kakudo': {
                        'code': 'nok_確度',
                        'shown': true,
                        'disabled': true,
                    },
                    'homonkekka': {
                        'code': 'nok_活動結果',
                        'shown': true,
                        'disabled': true,
                    },
                    'uriage': {
                        'code': 'nok_売上',
                        'shown': true,
                        'disabled': true,
                    },
                    'fukakachi': {
                        'code': 'nok_粗利',
                        'shown': true,
                        'disabled': true,
                    },
                    'juchuyoteibi': {
                        'code': 'nok_受注予定日',
                        'shown': true,
                        'disabled': true,
                    },
                    'kenshuyoteibi': {
                        'code': 'nok_検収予定日',
                        'shown': true,
                        'disabled': true,
                    },
                    'homongoKakudo': {
                        'code': 'nok_訪問後_確度',
                        'shown': true,
                        'disabled': false,
                    },
                    'homongoKekka': {
                        'code': 'nok_訪問後_結果',
                        'shown': true,
                        'disabled': false,
                    },
                    'homongoUriage': {
                        'code': 'nok_訪問後_売上',
                        'shown': true,
                        'disabled': false,
                    },
                    'homongoFukakachi': {
                        'code': 'nok_訪問後_粗利',
                        'shown': true
                    },
                    'homongoJuchuyoteibi': {
                        'code': 'nok_訪問後_受注予定日',
                        'shown': true,
                        'disabled': false,
                    },
                    'homongoKenshuyoteibi': {
                        'code': 'nok_訪問後_検収予定日',
                        'shown': true,
                        'disabled': false,
                    },
                    //--キーマン連携関連項目------------------------------------------------
                    'keymanTable': {
                        'code': 'nok_キーマンTB'
                    },
                    'keymanSearch': {
                        'code': 'nok_キーマンTB_キーマン検索',
                        'keyset': false,
                        'shown': false,
                    },
                    'keymanmei': {
                        'code': 'nok_キーマンTB_面談者',
                    },
                    'keymanBusho': {
                        'code': 'nok_キーマンTB_面談者部署',
                    },
                    'keymanYakushoku': {
                        'code': 'nok_キーマンTB_面談者役職',
                    },
                    'keymanId': {
                        'code': 'nok_キーマンTB_キーマンID',
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'nok_営業レポートレコード番号'
                    },
                },
                messages: {
                    'saveError': '案件情報の更新に失敗しました。',
                    'getViewError': 'スケジュール表示情報の取得に失敗しました。',
                    'exceptionError': 'エラーが発生しました。\n管理者に問い合わせて下さい。'
                },
                offsetMinutes: 60
            },

            // 報告一括登録（日報登録）アプリの設定
            nippo: {
                app: 41,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': false,
                        'disabled': true
                    },
                    //--日報------------------------------------------------------------
                    'katsudobi': {
                        'code': 'nok_活動日',
                        'shown': true,
                        'disabled': false,
                    },
                    'yoteiJisseki': {
                        'code': 'nok_予定・実績',
                        'shown': true,
                        'disabled': false,
                    },
                    'komento': {
                        'code': 'nok_コメント',
                        'shown': true,
                        'disabled': false,
                    },
                    'nippoId': {
                        'code': 'nok_日報ID',
                        'shown': true,
                        'disabled': true
                    },
                    'eigyoRepotoSpace': {
                        'code': 'nok_eigyoRepotoSpace'
                    },
                    //--活動TB----------------------------------------------------------
                    'eigyoRepoto': {
                        'code': 'nok_営業報告TB',
                        'name': '活動登録',
                    },
                    'kaishijikoku': {
                        'code': 'nok_開始時刻',
                    },
                    'shuryojikoku': {
                        'code': 'nok_終了時刻',
                    },
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': false,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                    },
                    'homonMokuteki': {
                        'code': 'nok_活動目的',
                    },
                    'homongoKekka': {
                        'code': 'nok_訪問後_結果',
                    },
                    'biko': {
                        'code': 'nok_活動内容',
                    },
                    //--システム--------------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'レコード番号'
                    },
                    'revision': {
                        'code': '$revision'
                    },
                },
                messages: {
                    'requiredError': '営業活動レポートの登録に必要な情報が入力されていません。入力項目を確認してください。',
                    'inputCheckError': '入力項目を確認してください。',
                    'inputCheckJikoku': '開始時刻、終了時刻を確認してください。',
                    'emptyError': '値が入力されていません。',
                    'postError': '営業活動レポートの登録に失敗しました。\n営業活動レポート情報を登録するため、日報の更新をお願いします。',
                    'exceptionError': 'エラーが発生しました。\n管理者に問い合わせて下さい。'
                },
                offsetMinutes: 60
            },

            // キーマン管理アプリの設定
            keyman: {
                app: 40,
                fields: {
                    'keymanId': {
                        'code': 'nok_キーマンID',
                        'shown': true,
                        'disabled': true
                    },
                    'keymanIDKey': {
                        'code': 'nok_キーマンIDKey',
                        'shown': false,
                        'disabled': true,
                    },
                    'keymanmei': {
                        'code': 'nok_氏名',
                        'shown': true,
                        'disabled': false
                    },
                    'busho': {
                        'code': 'nok_部署',
                        'shown': true,
                        'disabled': false
                    },
                    'yakushoku': {
                        'code': 'nok_役職',
                        'shown': true,
                        'disabled': false
                    },
                    'yubinBango': {
                        'code': 'nok_郵便番号',
                        'shown': true,
                        'disabled': false
                    },
                    'jusho': {
                        'code': 'nok_住所',
                        'shown': true,
                        'disabled': false
                    },
                    'tatemonomei': {
                        'code': 'nok_建物名',
                        'shown': true,
                        'disabled': false
                    },
                    'tel': {
                        'code': 'nok_TEL',
                        'shown': true,
                        'disabled': false
                    },
                    'fax': {
                        'code': 'nok_FAX',
                        'shown': true,
                        'disabled': false
                    },
                    'mail': {
                        'code': 'nok_メールアドレス',
                        'shown': true,
                        'disabled': false
                    },
                    'meishiKaishamei': {
                        'code': 'nok_会社名名刺情報'
                    },
                    'meishiId': {
                        'code': 'nok_ID名刺情報'
                    },
                    'meishiKoshinNichiji': {
                        'code': 'nok_更新日時名刺情報'
                    },
                    'updatedTime': {
                        'code': 'nok_更新日時'
                    },
                    'eigyoKakunin': {
                        'code': 'nok_営業確認',
                        'shown': false
                    },
                    //--顧客----------------------------------------------------------------
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    //--カスタマイズ項目----------------------------------------------------
                    'layerTable': {
                        'code': 'nok_履歴TB',
                        'shown': true,
                        'disabled': false,
                    },
                    'lyakushokuTB': {
                        'code': 'nok_履歴TB_役職',
                    },
                    'ShozokuTB': {
                        'code': 'nok_履歴TB_所属',
                    },
                    'startDateTB': {
                        'code': 'nok_履歴TB_始',
                    },
                    'endDateTB': {
                        'code': 'nok_履歴TB_終',
                    },
                    'mendansyaTable': {
                        'code': 'mendansya_table',
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'nok_キーマンレコード番号'
                    },
                },
                //--カスタマイズ項目----------------------------------------------------
                // レイヤー変更判定リスト
                layerChangeList: {
                    // テーブルにレイヤー履歴を登録する機能
                    layerHistory: [
                        'yakushoku',
                        'busho',
                    ],
                },
                messages: {
                    'failGetSerialNumber': 'キーマンIDの取得に失敗しました。'
                },
            },

            // お問合せアプリの設定
            toiawase: {
                app: 39,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': false,
                        'disabled': true
                    },
                    //--顧客----------------------------------------------------------------
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': false,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    'toiawaseId': {
                        'code': 'nok_お問合せID',
                        'shown': true,
                        'disabled': true,
                    },
                    'toiawaseIDKey': {
                        'code': 'nok_お問合せIDKey',
                        'shown': false,
                        'disabled': true,
                    },
                    'title': {
                        'code': 'nok_タイトル',
                        'shown': true,
                        'disabled': false,
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'nok_クレームレコード番号'
                    },
                    'revision': {
                        'code': '$revision'
                    },
                }
            },

            // 担当者マスタアプリの設定
            tantosha: {
                app: 38,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaSearchId': {
                        'code': 'nok_担当者検索コード',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': false
                    },
                    'kyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': true,
                        'disabled': false
                    },
                    'busho': {
                        'code': 'nok_担当者部署',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': true,
                        'disabled': false
                    },
                    //--顧客スケジュール表示フラグ----------------------------------
                    'hyouji': {
                        'code': 'nok_顧客スケジュール表示設定',
                        'shown': true,
                        'disabled': false
                    },
                    'hyoujiflag': {
                        'value': '表示する',
                    },
                    //--予実用--------------------------------------------------------------
                    'yojitsuYoTantoshaSearchId': {
                        'code': 'nok_予実用担当者コード',
                        'disabled': true
                    },
                    //--ポータル設定---------------------------------------------------------
                    'portalId': {
                        'code': 'nok_ポータルID'
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'nok_担当者レコード番号'
                    },
                }
            },

            // カレンダー表示設定アプリの設定
            view: {
                app: 37,
                fields: {
                    //--表示設定------------------------------------------------------------
                    'hyojiMeisho': {
                        'code': 'nok_表示名称',
                        'shown': true,
                        'disabled': false
                    },
                    'acountId': {
                        'code': 'nok_アカウント情報',
                        'shown': true,
                        'disabled': false
                    },
                    //--担当者TB------------------------------------------------------------
                    'tantoshaTable': {
                        'code': 'nok_担当者TB',
                        'shown': true,
                    },
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                    },
                    'name': {
                        'code': 'nok_担当者名',
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                    },
                    'shozoku01': {
                        'code': 'nok_担当者拠点',
                    },
                    'shozoku02': {
                        'code': 'nok_担当者部署',
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'レコード番号'
                    },
                }
            },

            // 予算・実績管理アプリの設定
            yojitsu: {
                app: 36,
                fields: {
                    'tantoshaId': {
                        'code': 'nok_担当者ID'
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者'
                    },
                    'kyoten': {
                        'code': 'nok_担当者拠点'
                    },
                    'busho': {
                        'code': 'nok_担当者部署'
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                    },
                    'tantoshaCodeYojisseki': {
                        'code': 'nok_担当者コード_予実績用'
                    },
                    'mokuhyoUriageKingaku': {
                        'code': 'nok_目標売上金額'
                    },
                    'mokuhyoArariKingaku': {
                        'code': 'nok_目標粗利金額'
                    },
                    'jissekiUriageKingaku': {
                        'code': 'nok_実績売上金額'
                    },
                    'jissekiArariKingaku': {
                        'code': 'nok_実績粗利金額'
                    },
                    'shukeiyoNengetsu': {
                        'code': 'nok_集計用年月'
                    },
                    'jissekiShukeiKikanItaru': {
                        'code': 'nok_実績集計期間_至'
                    },
                    //--システム--------------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'レコード番号'
                    },
                }
            },

            // 予算・実績表設定アプリの設定
            yojitsuSetting: {
                app: 35,
                fields: {
                    'hyojimei': {
                        'code': 'nok_表示名'
                    },
                    'accountId': {
                        'code': 'nok_アカウント情報'
                    },
                    'hyojijun': {
                        'code': 'nok_表示順'
                    },
                    'kikan': {
                        'code': 'nok_期間'
                    },
                    'kakudo': {
                        'code': 'nok_確度'
                    },
                    'uriageArari': {
                        'code': 'nok_売上_粗利'
                    },
                    //--拠点テーブル--------------------------------------------------------
                    'kyotenTable': {
                        'code': 'nok_拠点TB'
                    },
                    'kyoten': {
                        'code': 'nok_拠点テーブル_拠点'
                    },
                    'tsuki': {
                        'code': 'nok_月'
                    },
                    'kiNendo': {
                        'code': 'nok_期・年度'
                    },
                    //--部署テーブル--------------------------------------------------------
                    'bushoTable': {
                        'code': 'nok_部署TB'
                    },
                    'busho': {
                        'code': 'nok_部署テーブル_部署'
                    },
                    'bushoKyoten': {
                        'code': 'nok_部署テーブル_拠点'
                    },
                    //--担当者テーブル------------------------------------------------------
                    'tantoshaTable': {
                        'code': 'nok_担当者TB'
                    },
                    'tantoshaSearch': {
                        'code': 'nok_担当者テーブル_担当者検索'
                    },
                    'tantoshamei': {
                        'code': 'nok_担当者テーブル_担当者名'
                    },
                    'tantoshaCode': {
                        'code': 'nok_担当者テーブル_担当者コード'
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者テーブル_拠点'
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者テーブル_部署'
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'レコード番号'
                    },
                }
            },

            // 管理ユーザー情報
            kanriUsers: [
                //			'Administrator',
            ],
            // 管理者（名寄せ）
            nayose_kanriUsers: [
                'snc00397', 'Nagoshi', 'snc00441',
            ],
        },

        // （変更後）20231011 NICE V4.0 出荷用の設定
        spaceId_7: {
            // リード情報アプリの設定
            lead: {
                app: 51,
                fields: {
                    //--担当者----------------------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaSoshiki': {
                        'code': 'nok_担当者組織',
                        'shown': true,
                        'disabled': true
                    },
                    // --対応者----------------------------------------------------------------
                    'taioshaSearch': {
                        'code': 'nok_対応者検索',
                        'shown': true,
                        'disabled': false
                    },
                    'taioshaId': {
                        'code': 'nok_対応者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'taioshaMei': {
                        'code': 'nok_対応者名',
                        'shown': true,
                        'disabled': true
                    },
                    'taioshaKyoten': {
                        'code': 'nok_対応者拠点',
                        'shown': true,
                        'disabled': true
                    },
                    'taioshaBusho': {
                        'code': 'nok_対応者部署',
                        'shown': true,
                        'disabled': true
                    },
                    'taioshaUser': {
                        'code': 'nok_対応者ユーザ',
                        'shown': true,
                        'disabled': true
                    },
                    'taioshaSoshiki': {
                        'code': 'nok_対応者組織',
                        'shown': true,
                        'disabled': true
                    },
                    //--リード----------------------------------------------------------------
                    'leadTantoJigyoKubun': {
                        'code': 'nok_リード担当事業区分',
                        'shown': true,
                        'disabled': false,
                    },
                    'taioJokyo': {
                        'code': 'nok_対応状況',
                        'shown': true,
                        'disabled': false,
                    },
                    //--対応履歴TB------------------------------------------------------------
                    'taioRirekiTable': {
                        'code': 'nok_対応履歴TB',
                        'shown': true,
                    },
                    'taiobi_table': {
                        'code': 'nok_対応履歴TB_対応日',
                        'shown': true,
                    },
                    'taioKubun_table': {
                        'code': 'nok_対応履歴TB_対応区分',
                        'shown': true,
                    },
                    'taioJokyo_table': {
                        'code': 'nok_対応履歴TB_対応状況',
                        'shown': true,
                    },
                    'taiosha_table': {
                        'code': 'nok_対応履歴TB_対応者',
                        'shown': true,
                    },
                    //--顧客------------------------------------------------------------------
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    //--キーマン----------------------------------------------------------------
                    'keymanSearch': {
                        'code': 'nok_キーマン検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'keymanId': {
                        'code': 'nok_キーマンID',
                        'shown': true,
                        'disabled': true,
                    },
                    'keymanmei': {
                        'code': 'nok_氏名',
                        'shown': true,
                        'disabled': true,
                    },
                    //--問い合わせ情報--------------------------------------------------------------
                    'toiawaseId': {
                        'code': 'nok_問い合わせID',
                        'shown': true,
                        'disabled': false,
                    },
                    'toiawaseShubetsu': {
                        'code': 'nok_問い合わせ種別',
                        'shown': true,
                        'disabled': false,
                    },
                    'toiawaseSeihin': {
                        'code': 'nok_問い合わせ製品',
                        'shown': true,
                        'disabled': false,
                    },
                    'kaishamei': {
                        'code': 'nok_会社名',
                        'shown': true,
                        'disabled': false,
                    },
                    'bumonmei': {
                        'code': 'nok_部門名',
                        'shown': true,
                        'disabled': false,
                    },
                    'name': {
                        'code': 'nok_お名前',
                        'shown': true,
                        'disabled': false,
                    },
                    'yubinBango': {
                        'code': 'nok_郵便番号',
                        'shown': true,
                        'disabled': false,
                    },
                    'todohuken': {
                        'code': 'nok_都道府県',
                        'shown': true,
                        'disabled': false,
                    },
                    'jusho': {
                        'code': 'nok_ご住所',
                        'shown': true,
                        'disabled': false,
                    },
                    'mail': {
                        'code': 'nok_メールアドレス',
                        'shown': true,
                        'disabled': false,
                    },
                    'tel': {
                        'code': 'nok_電話番号',
                        'shown': true,
                        'disabled': false,
                    },
                    'shitsumonNaiyo': {
                        'code': 'nok_ご質問内容',
                        'shown': true,
                        'disabled': false,
                    },
                    'toiawaseNichiji': {
                        'code': 'nok_問い合わせ日時',
                        'shown': true,
                        'disabled': false,
                    },
                    //--システム--------------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                },
            },

            // グラフ管理アプリの設定
            graph: {
                app: 112,
                fields: {
                    // パイプライングラフ
                    'graphId': {
                        'code': 'nok_グラフID',
                    },
                    'graphType': {
                        'code': 'nok_グラフタイプ',
                    },
                    'graphMei': {
                        'code': 'nok_グラフ名',
                    },
                    'graphSetsumei': {
                        'code': 'nok_グラフ説明',
                    },
                    'graphIdKey': {
                        'code': 'nok_グラフIDKey'
                    },
                    'paipurainGraph': {
                        'code': 'nok_パイプライングラフ',
                    },
                    'paipurainTaisho': {
                        'code': 'nok_パイプライン_表示対象',
                    },
                    'paipurainSoshiki': {
                        'code': 'nok_パイプライン_組織選択',
                    },
                    'paipurainCalendarSpace': {
                        'code': 'calendar_space_0',
                    },
                    'paipurainNengetsu': {
                        'code': 'nok_パイプライン_開始年月',
                    },
                    'paipurainAtai': {
                        'code': 'nok_パイプライン_値',
                    },
                    'paipurainHanrei': {
                        'code': 'nok_パイプライン_凡例',
                    },
                    // 積み上げ縦棒グラフ
                    'tsumiageGraph': {
                        'code': 'nok_積み上げ縦棒グラフ',
                    },
                    'tsumiageTaisho': {
                        'code': 'nok_積み上げ_表示対象',
                    },
                    'tsumiageSoshiki': {
                        'code': 'nok_積み上げ_組織選択',
                    },
                    'tsumiageCalendarSpace': {
                        'code': 'calendar_space_1',
                    },
                    'tsumiageNengetsu': {
                        'code': 'nok_積み上げ_開始年月',
                    },
                    'tsumiageJiku': {
                        'code': 'nok_積み上げ_軸',
                    },
                    'tsumiageAtai': {
                        'code': 'nok_積み上げ_値',
                    },
                    'tsumiageHanrei': {
                        'code': 'nok_積み上げ_凡例',
                    },
                    // 半ドーナツグラフ
                    'handonatsuGraph': {
                        'code': 'nok_半ドーナツグラフ',
                    },
                    'handonatsuTaisho': {
                        'code': 'nok_半ドーナツ_表示対象',
                    },
                    'handonatsuSoshiki': {
                        'code': 'nok_半ドーナツ_組織選択',
                    },
                    'handonatsuCalendarSpace': {
                        'code': 'calendar_space_2',
                    },
                    'handonatsuNengetsu': {
                        'code': 'nok_半ドーナツ_開始年月',
                    },
                    'handonatsuAtai': {
                        'code': 'nok_半ドーナツ_値',
                    },
                    'handonatsuKakudo': {
                        'code': 'nok_半ドーナツ_確度',
                    },
                    // 縦棒グラフ
                    'tateboGraph': {
                        'code': 'nok_縦棒グラフ',
                    },
                    'tateboTaisho': {
                        'code': 'nok_縦棒_表示対象',
                    },
                    'tateboSoshiki': {
                        'code': 'nok_縦棒_組織選択',
                    },
                    'tateboCalendarSpace': {
                        'code': 'calendar_space_3',
                    },
                    'tateboNengetsu': {
                        'code': 'nok_縦棒_開始年月',
                    },
                    'tateboJiku': {
                        'code': 'nok_縦棒_軸',
                    },
                    'tateboAtai': {
                        'code': 'nok_縦棒_値',
                    },
                    'tateboKakudo': {
                        'code': 'nok_縦棒_確度',
                    },
                },
                types: {
                    'paipurain': {
                        'code': 'パイプライングラフ',
                    },
                    'tsumiage': {
                        'code': '積み上げ縦棒グラフ',
                    },
                    'handonatsu': {
                        'code': '半ドーナツグラフ',
                    },
                    'tatebo': {
                        'code': '前年対比棒グラフ',
                    },
                }
            },

            // ポータル設定アプリの設定
            portalSetting: {
                app: 111,
                fields: {
                    'portalId': {
                        'code': 'nok_ポータルID'
                    },
                    // メニューテーブル
                    'menuPattern': {
                        'code': 'nok_メニューパターン'
                    },
                    'menuDan': {
                        'code': 'nok_メニュー_段',
                    },
                    'menuHyojijun': {
                        'code': 'nok_メニュー_表示順',
                    },
                    'menuSearch': {
                        'code': 'nok_メニュー検索',
                    },
                    'menuAppMei': {
                        'code': 'nok_アプリ名',
                    },
                    'menuAppId': {
                        'code': 'nok_アプリID',
                    },
                    'menuIchiranMei': {
                        'code': 'nok_一覧名',
                    },
                    'menuIchiranUrl': {
                        'code': 'nok_一覧URL',
                    },
                    'menuBase64Mojiretsu': {
                        'code': 'nok_base64文字列',
                    },
                    'menuId': {
                        'code': 'nok_メニューID'
                    },
                    // グラフテーブル
                    'graphPattern': {
                        'code': 'nok_グラフパターン'
                    },
                    'graphDan': {
                        'code': 'nok_グラフ_段',
                    },
                    'graphHyojijun': {
                        'code': 'nok_グラフ_表示順',
                    },
                    'graphSize': {
                        'code': 'nok_大きさ',
                    },
                    'graphSearch': {
                        'code': 'nok_グラフ検索',
                    },
                    'graphType': {
                        'code': 'nok_グラフタイプ',
                    },
                    'graphName': {
                        'code': 'nok_グラフ名',
                    },
                    'graphSetsumei': {
                        'code': 'nok_グラフ説明',
                    },
                    'graphId': {
                        'code': 'nok_グラフID',
                    }
                },
                menu: {
                    'maxHyojijun': {
                        'code': 10,
                    },
                    'maxHyojidan': {
                        'code': 3,
                    },
                },
                graph: {
                    'maxHyojijun': {
                        'code': 3,
                    },
                    'maxHyojidan': {
                        'code': 5,
                    },
                }
            },

            // メニュー管理アプリの設定
            menu: {
                app: 110,
                fields: {
                    'menuId': {
                        'code': 'nok_メニューID',
                    },
                    'menuAppMei': {
                        'code': 'nok_アプリ名',
                    },
                    'menuAppId': {
                        'code': 'nok_アプリID',
                    },
                    'menuIchiranMei': {
                        'code': 'nok_一覧名',
                    },
                    'menuIchiranUrl': {
                        'code': 'nok_一覧URL',
                    },
                    'menuIcon': {
                        'code': 'nok_メニューアイコン'
                    },
                    'menuBase64Mojiretsu': {
                        'code': 'nok_base64文字列',
                    },
                }
            },

            // 見積管理アプリの設定
            mitsumori: {
                app: 109,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': false,
                        'disabled': true
                    },
                    //--顧客----------------------------------------------------------------
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    //--案件----------------------------------------------------------------
                    'ankenSearch': {
                        'code': 'nok_案件検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'ankenId': {
                        'code': 'nok_案件ID',
                        'shown': true,
                        'disabled': true
                    },
                    'ankenmei': {
                        'code': 'nok_案件名',
                        'shown': true,
                        'disabled': false,
                    },
                    'mitsumoriId': {
                        'code': 'nok_見積ID',
                        'shown': false,
                        'disabled': true,
                    },
                    'mitsumoriIDKey': {
                        'code': 'nok_見積IDKey',
                        'shown': false,
                        'disabled': true,
                    },
                    //--システム案件--------------------------------------------------------
                    'shimeSaito': {
                        'code': 'nok_締サイト',
                        'shown': true,
                        'disabled': false,
                    },
                    'shimebi': {
                        'code': 'nok_締日',
                        'shown': true,
                        'disabled': false,
                    },
                    'shiharaiSaito': {
                        'code': 'nok_支払サイト',
                        'shown': true,
                        'disabled': false,
                    },
                    'shiharaibi': {
                        'code': 'nok_支払日',
                        'shown': true,
                        'disabled': false,
                    },
                    'shiharaiHoho': {
                        'code': 'nok_支払方法',
                        'shown': true,
                        'disabled': false,
                    },
                    'juchubi': {
                        'code': 'nok_受注日',
                        'shown': true,
                        'disabled': false,
                    },
                    'kenshubi': {
                        'code': 'nok_検収日',
                        'shown': true,
                        'disabled': false,
                    },
                    'seikyubi': {
                        'code': 'nok_請求日',
                        'shown': true,
                        'disabled': false,
                    },
                    'nyukinYoteibi': {
                        'code': 'nok_入金予定日',
                        'shown': true,
                        'disabled': true,
                    },
                    'jhuchuShori': {
                        'code': 'nok_受注処理',
                        'taishoValue': '受注',
                        'shown': true,
                        'disabled': false,
                    },
                    'meisaiRenkeiFlag': {
                        'code': 'nok_受注処理フラグ',
                        'shown': true,
                        'disabled': false,
                        'text': '連携済',
                    },
                    'mitsumoriGokeikingaku': {
                        'code': 'nok_合計金額',
                        'shown': true,
                        'disabled': false,
                    },
                    'mitsumoriNo': {
                        'code': 'nok_見積No',
                        'shown': true,
                        'disabled': true,
                    },
                    'mitsumoribi': {
                        'code': 'nok_見積日',
                        'shown': true,
                        'disabled': false,
                    },
                    'nendo': {
                        'code': 'nok_年度',
                        'shown': true,
                        'disabled': true,
                    },
                    //明細----------------------------------------------------------
                    'mitsumoriMeisaiTB': {
                        'code': 'nok_明細TB',
                        'length': '12'
                    },
                    'meisaiNo_T': {
                        'code': 'nok_明細TB_明細No',
                        'shown': true,
                    },
                    'meisaiTableNo_T': {
                        'code': 'nok_明細TB_明細テーブル番号',
                        'shown': true,
                    },
                    'shohinSearch_T': {
                        'code': 'nok_明細TB_商品検索',
                        'shown': true,
                    },
                    'shohinMei_T': {
                        'code': 'nok_明細TB_商品名',
                        'shown': true,
                    },
                    'shohinId_T': {
                        'code': 'nok_明細TB_商品ID',
                        'shown': true,
                    },
                    'teika_T': {
                        'code': 'nok_明細TB_定価',
                        'shown': true,
                    },
                    'tanka_T': {
                        'code': 'nok_明細TB_単価',
                        'shown': true,
                    },
                    'suryo_T': {
                        'code': 'nok_明細TB_数量',
                        'shown': true,
                    },
                    'kingaku_T': {
                        'code': 'nok_明細TB_金額',
                        'shown': true,
                    },
                    'genkaTanka_T': {
                        'code': 'nok_明細TB_原価単価',
                        'shown': true,
                    },
                    'genka_T': {
                        'code': 'nok_明細TB_原価',
                        'shown': true,
                    },
                    'hanbaiTankaCheck_T': {
                        'code': 'nok_明細TB_販売単価チェック',
                        'shown': true,
                    },
                    'shinseiFlag': {
                        'code': 'nok_要確認',
                        'shown': true,
                        'disabled': false,
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'anken_recordNo': {
                        'code': 'nok_見積レコード番号'
                    },
                },
                // 末日
                matujitu: {
                    'day': {
                        'value': '末日'
                    }
                },
                messages: {
                    'failGetSerialNumber': '見積番号の取得に失敗しました。',
                }
            },

            // 見積管理サブテーブル追加用
            mitumoriKanriSubTable: {
                // フィールド
                value: {
                    'nok_明細TB_明細No': {
                        'type': 'SINGLE_LINE_TEXT',
                        'value': ''
                    },
                    'nok_明細TB_商品検索': {
                        'type': 'SINGLE_LINE_TEXT',
                        'value': ''
                    },
                    'nok_明細TB_商品名': {
                        'type': 'SINGLE_LINE_TEXT',
                        'value': ''
                    },
                    'nok_明細TB_商品ID': {
                        'type': 'SINGLE_LINE_TEXT',
                        'value': ''
                    },
                    'nok_明細TB_定価': {
                        'type': 'NUMBER',
                        'value': '0'
                    },
                    'nok_明細TB_単価': {
                        'type': 'NUMBER',
                        'value': '0'
                    },
                    'nok_明細TB_数量': {
                        'type': 'NUMBER',
                        'value': '0'
                    },
                    'nok_明細TB_金額': {
                        'type': 'CALC',
                        'value': '0'
                    },
                    'nok_明細TB_原価単価': {
                        'type': 'NUMBER',
                        'value': '0'
                    },
                    'nok_明細TB_原価': {
                        'type': 'CALC',
                        'value': '0'
                    },
                    'nok_明細TB_販売単価チェック': {
                        'type': 'CALC',
                        'value': '0'
                    },
                },
            },

            // 祝日・休日アプリの設定
            holiday: {
                app: 108,
                fields: {
                    'hiduke': {
                        'code': 'nok_日付',
                        'shown': true,
                        'disabled': false
                    },
                    'kyuujitumei': {
                        'code': 'nok_休日・祝日名',
                        'shown': true,
                        'disabled': false
                    },
                }
            },

            // 商品マスタアプリの設定
            shohinMaster: {
                app: 107,
                // フィールド
                fields: {
                    'shohinId': {
                        'code': 'nok_商品ID',
                        'shown': true,
                        'disabled': true
                    },
                    'shohinMei': {
                        'code': 'nok_商品名'
                    },
                    'shohinTeika': {
                        'code': 'nok_定価'
                    },
                    'shohinTanka': {
                        'code': 'nok_標準単価'
                    },
                    'shohinBiko': {
                        'code': 'nok_商品備考',
                        'shown': true,
                        'disabled': false
                    },
                    'shohinSearch': {
                        'code': 'nok_商品検索コード',
                        'shown': true,
                        'disabled': true
                    },
                    'shohinSuryo': {
                        'code': 'nok_標準数量',
                        'shown': true,
                        'disabled': false
                    },
                    'shohinGenkaTanka': {
                        'code': 'nok_原価単価'
                    },
                    'kanrenShohinCode': {
                        'code': 'nok_関連商品TB_関連商品コード'
                    },
                    'kanrenShohinTb': {
                        'code': 'nok_関連商品TB'
                    },
                    'recordId': {
                        'code': '$id'
                    },
                },
                messages: {
                    'failGetSerialNumber': '商品IDの取得に失敗しました。'
                },
            },

            // 顧客マスタアプリの設定
            kokyaku: {
                app: 106,
                fields: {
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuIDKey': {
                        'code': 'nok_顧客IDKey',
                        'shown': false,
                        'disabled': true,
                    },
                    'yubinBango': {
                        'code': 'nok_郵便番号',
                        'shown': true,
                        'disabled': false,
                    },
                    'jusho': {
                        'code': 'nok_顧客住所',
                        'shown': true,
                        'disabled': false,
                    },
                    'tatemonomei': {
                        'code': 'nok_顧客建物名',
                        'shown': true,
                        'disabled': false,
                    },
                    'tel': {
                        'code': 'nok_TEL',
                        'shown': true,
                        'disabled': false,
                    },
                    'fax': {
                        'code': 'nok_FAX',
                        'shown': true,
                        'disabled': false,
                    },
                    'saishuTaiosha': {
                        'code': 'nok_最終対応者',
                        'shown': true,
                        'disabled': true,
                    },
                    'saishuTaiobi': {
                        'code': 'nok_最終対応日',
                        'shown': true,
                        'disabled': true,
                    },
                    'saishuTaioNaiyo': {
                        'code': 'nok_最終活動内容',
                        'shown': true,
                        'disabled': true,
                    },
                    'saishuHomonMokuteki': {
                        'code': 'nok_最終活動目的',
                        'shown': true,
                        'disabled': true,
                    },
                    'eigyoKakunin': {
                        'code': 'nok_営業確認',
                        'shown': false,
                        'disabled': false,
                    },
                    'ankenKakunin': {
                        'code': 'nok_案件確認',
                        'shown': false,
                        'disabled': false,
                    },
                    'keymanKakunin': {
                        'code': 'nok_キーマン確認',
                        'shown': false,
                        'disabled': false,
                    },
                    'claimKakunin': {
                        'code': 'nok_お問合せ確認',
                        'shown': false,
                        'disabled': false,
                    },
                    'nippoKakunin': {
                        'code': 'nok_報告一括確認',
                        'shown': false,
                        'disabled': false,
                    },
                    'kokyakuRank': {
                        'code': 'nok_顧客ランク',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuTarget': {
                        'code': 'nok_ターゲット分類',
                        'shown': true,
                        'disabled': false,
                    },
                    //--訪問景計画要------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': false,
                    },
                    //--システム----------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'nok_顧客レコード番号'
                    },
                },
                //--案件管理ダイアログ設定-------------------------------------------------------
                kokyakuKanriDaialog: {
                    messages: {
                        'nippoNone': '顧客アプリを呼び出した日報が存在しません。',
                        'registration': '登録しました。'
                    }
                },
                messages: {
                    'failGetSerialNumber': '顧客番号情報の取得に失敗しました。'
                },
            },

            // 案件管理アプリの設定
            anken: {
                app: 105,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': false,
                        'disabled': true
                    },
                    //--顧客----------------------------------------------------------------
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    //--案件----------------------------------------------------------------
                    'ankenId': {
                        'code': 'nok_案件ID',
                        'shown': true,
                        'disabled': true
                    },
                    'ankenmei': {
                        'code': 'nok_案件名',
                        'shown': true,
                        'disabled': false,
                    },
                    'ankenIDKey': {
                        'code': 'nok_案件IDKey',
                        'shown': false,
                        'disabled': true,
                    },
                    'kakudo': {
                        'code': 'nok_確度',
                        'shown': true,
                        'disabled': false,
                    },
                    'homonkekka': {
                        'code': 'nok_活動結果',
                        'shown': true,
                        'disabled': false,
                    },
                    'uriage': {
                        'code': 'nok_売上',
                        'shown': true,
                        'disabled': false,
                    },
                    'fukakachi': {
                        'code': 'nok_粗利',
                        'shown': true,
                        'disabled': false,
                    },
                    'mitsumoriGokeikingaku': {
                        'code': 'nok_見積金額',
                        'shown': false,
                        'disabled': true,
                    },
                    'juchuyoteibi': {
                        'code': 'nok_受注予定日',
                        'shown': true,
                        'disabled': false,
                    },
                    'kenshuyoteibi': {
                        'code': 'nok_検収予定日',
                        'shown': true,
                        'disabled': false,
                    },
                    'eigyoKakunin': {
                        'code': 'nok_営業確認',
                        'shown': false
                    },
                    'mitsumoriKakunin': {
                        'code': 'nok_見積確認',
                        'shown': false
                    },
                    //--システム案件--------------------------------------------------------
                    'shodanProcess01': {
                        'code': 'nok_商談プロセス01',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess02': {
                        'code': 'nok_商談プロセス02',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess03': {
                        'code': 'nok_商談プロセス03',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess04': {
                        'code': 'nok_商談プロセス04',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess05': {
                        'code': 'nok_商談プロセス05',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess06': {
                        'code': 'nok_商談プロセス06',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess07': {
                        'code': 'nok_商談プロセス07',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess08': {
                        'code': 'nok_商談プロセス08',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess09': {
                        'code': 'nok_商談プロセス09',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcess10': {
                        'code': 'nok_商談プロセス10',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID01': {
                        'code': 'nok_商談プロセスID01',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID02': {
                        'code': 'nok_商談プロセスID02',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID03': {
                        'code': 'nok_商談プロセスID03',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID04': {
                        'code': 'nok_商談プロセスID04',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID05': {
                        'code': 'nok_商談プロセスID05',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID06': {
                        'code': 'nok_商談プロセスID06',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID07': {
                        'code': 'nok_商談プロセスID07',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID08': {
                        'code': 'nok_商談プロセスID08',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID09': {
                        'code': 'nok_商談プロセスID09',
                        'shown': false,
                        'disabled': true
                    },
                    'shodanProcessID10': {
                        'code': 'nok_商談プロセスID10',
                        'shown': false,
                        'disabled': true
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'anken_recordNo': {
                        'code': 'nok_案件レコード番号'
                    },

                },
                //--案件管理ダイアログ設定-------------------------------------------------------
                ankenkanriDaialog: {
                    messages: {
                        'nippoNone': '案件アプリを呼び出した日報が存在しません。',
                        'registration': '登録しました。'
                    }
                },
                messages: {
                    'failGetSerialNumber': '案件ID情報の取得に失敗しました。',
                }
            },

            // 営業レポートアプリの設定
            eigyoRepoto: {
                app: 104,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': false,
                        'disabled': true
                    },
                    //--顧客----------------------------------------------------------------
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': true,
                        'disabled': false,
                    },
                    //--活動報告------------------------------------------------------------
                    'katsudobi': {
                        'code': 'nok_活動日',
                        'shown': true,
                        'disabled': false,
                    },
                    'kaishijikoku': {
                        'code': 'nok_開始時刻',
                        'shown': true,
                        'disabled': false,
                    },
                    'shuryojikoku': {
                        'code': 'nok_終了時刻',
                        'shown': true,
                        'disabled': false,
                    },
                    'yoteiJisseki': {
                        'code': 'nok_予定・実績',
                        'shown': true,
                        'disabled': false,
                    },
                    'homonMokuteki': {
                        'code': 'nok_活動目的',
                        'shown': true,
                        'disabled': false,
                    },
                    'biko': {
                        'code': 'nok_活動内容',
                        'shown': true,
                        'disabled': false,
                    },
                    'nippoId': {
                        'code': 'nok_日報ID',
                        'shown': false,
                        'disabled': true
                    },
                    //--案件----------------------------------------------------------------
                    'ankenmei': {
                        'code': 'nok_案件名',
                        'shown': true,
                        'disabled': true,
                    },
                    'ankenSearch': {
                        'code': 'nok_案件検索',
                        'keyset': false,
                        'shown': true,
                        'disabled': false,
                    },
                    'ankenId': {
                        'code': 'nok_案件ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'ankenRecordId': {
                        'code': 'nok_案件レコード番号',
                        'shown': true,
                        'disabled': true,
                    },
                    'kakudo': {
                        'code': 'nok_確度',
                        'shown': true,
                        'disabled': true,
                    },
                    'homonkekka': {
                        'code': 'nok_活動結果',
                        'shown': true,
                        'disabled': true,
                    },
                    'uriage': {
                        'code': 'nok_売上',
                        'shown': true,
                        'disabled': true,
                    },
                    'fukakachi': {
                        'code': 'nok_粗利',
                        'shown': true,
                        'disabled': true,
                    },
                    'juchuyoteibi': {
                        'code': 'nok_受注予定日',
                        'shown': true,
                        'disabled': true,
                    },
                    'kenshuyoteibi': {
                        'code': 'nok_検収予定日',
                        'shown': true,
                        'disabled': true,
                    },
                    'homongoKakudo': {
                        'code': 'nok_訪問後_確度',
                        'shown': true,
                        'disabled': false,
                    },
                    'homongoKekka': {
                        'code': 'nok_訪問後_結果',
                        'shown': true,
                        'disabled': false,
                    },
                    'homongoUriage': {
                        'code': 'nok_訪問後_売上',
                        'shown': true,
                        'disabled': false,
                    },
                    'homongoFukakachi': {
                        'code': 'nok_訪問後_粗利',
                        'shown': true
                    },
                    'homongoJuchuyoteibi': {
                        'code': 'nok_訪問後_受注予定日',
                        'shown': true,
                        'disabled': false,
                    },
                    'homongoKenshuyoteibi': {
                        'code': 'nok_訪問後_検収予定日',
                        'shown': true,
                        'disabled': false,
                    },
                    //--キーマン連携関連項目------------------------------------------------
                    'keymanTable': {
                        'code': 'nok_キーマンTB'
                    },
                    'keymanSearch': {
                        'code': 'nok_キーマンTB_キーマン検索',
                        'keyset': false,
                        'shown': false,
                    },
                    'keymanmei': {
                        'code': 'nok_キーマンTB_面談者',
                    },
                    'keymanBusho': {
                        'code': 'nok_キーマンTB_面談者部署',
                    },
                    'keymanYakushoku': {
                        'code': 'nok_キーマンTB_面談者役職',
                    },
                    'keymanId': {
                        'code': 'nok_キーマンTB_キーマンID',
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'nok_営業レポートレコード番号'
                    },
                },
                messages: {
                    'saveError': '案件情報の更新に失敗しました。',
                    'getViewError': 'スケジュール表示情報の取得に失敗しました。',
                    'exceptionError': 'エラーが発生しました。\n管理者に問い合わせて下さい。'
                },
                offsetMinutes: 60
            },

            // 報告一括登録（日報登録）アプリの設定
            nippo: {
                app: 103,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': false,
                        'disabled': true
                    },
                    //--日報------------------------------------------------------------
                    'katsudobi': {
                        'code': 'nok_活動日',
                        'shown': true,
                        'disabled': false,
                    },
                    'yoteiJisseki': {
                        'code': 'nok_予定・実績',
                        'shown': true,
                        'disabled': false,
                    },
                    'komento': {
                        'code': 'nok_コメント',
                        'shown': true,
                        'disabled': false,
                    },
                    'nippoId': {
                        'code': 'nok_日報ID',
                        'shown': true,
                        'disabled': true
                    },
                    'eigyoRepotoSpace': {
                        'code': 'nok_eigyoRepotoSpace'
                    },
                    //--活動TB----------------------------------------------------------
                    'eigyoRepoto': {
                        'code': 'nok_営業報告TB',
                        'name': '活動登録',
                    },
                    'kaishijikoku': {
                        'code': 'nok_開始時刻',
                    },
                    'shuryojikoku': {
                        'code': 'nok_終了時刻',
                    },
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': false,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                    },
                    'homonMokuteki': {
                        'code': 'nok_活動目的',
                    },
                    'homongoKekka': {
                        'code': 'nok_訪問後_結果',
                    },
                    'biko': {
                        'code': 'nok_活動内容',
                    },
                    //--システム--------------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'レコード番号'
                    },
                    'revision': {
                        'code': '$revision'
                    },
                },
                messages: {
                    'requiredError': '営業活動レポートの登録に必要な情報が入力されていません。入力項目を確認してください。',
                    'inputCheckError': '入力項目を確認してください。',
                    'inputCheckJikoku': '開始時刻、終了時刻を確認してください。',
                    'emptyError': '値が入力されていません。',
                    'postError': '営業活動レポートの登録に失敗しました。\n営業活動レポート情報を登録するため、日報の更新をお願いします。',
                    'exceptionError': 'エラーが発生しました。\n管理者に問い合わせて下さい。'
                },
                offsetMinutes: 60
            },

            // キーマン管理アプリの設定
            keyman: {
                app: 102,
                fields: {
                    'keymanId': {
                        'code': 'nok_キーマンID',
                        'shown': true,
                        'disabled': true
                    },
                    'keymanIDKey': {
                        'code': 'nok_キーマンIDKey',
                        'shown': false,
                        'disabled': true,
                    },
                    'keymanmei': {
                        'code': 'nok_氏名',
                        'shown': true,
                        'disabled': false
                    },
                    'busho': {
                        'code': 'nok_部署',
                        'shown': true,
                        'disabled': false
                    },
                    'yakushoku': {
                        'code': 'nok_役職',
                        'shown': true,
                        'disabled': false
                    },
                    'yubinBango': {
                        'code': 'nok_郵便番号',
                        'shown': true,
                        'disabled': false
                    },
                    'jusho': {
                        'code': 'nok_住所',
                        'shown': true,
                        'disabled': false
                    },
                    'tatemonomei': {
                        'code': 'nok_建物名',
                        'shown': true,
                        'disabled': false
                    },
                    'tel': {
                        'code': 'nok_TEL',
                        'shown': true,
                        'disabled': false
                    },
                    'fax': {
                        'code': 'nok_FAX',
                        'shown': true,
                        'disabled': false
                    },
                    'mail': {
                        'code': 'nok_メールアドレス',
                        'shown': true,
                        'disabled': false
                    },
                    'meishiKaishamei': {
                        'code': 'nok_会社名名刺情報'
                    },
                    'meishiId': {
                        'code': 'nok_ID名刺情報'
                    },
                    'meishiKoshinNichiji': {
                        'code': 'nok_更新日時名刺情報'
                    },
                    'updatedTime': {
                        'code': 'nok_更新日時'
                    },
                    'eigyoKakunin': {
                        'code': 'nok_営業確認',
                        'shown': false
                    },
                    //--顧客----------------------------------------------------------------
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': true,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    //--カスタマイズ項目----------------------------------------------------
                    'layerTable': {
                        'code': 'nok_履歴TB',
                        'shown': true,
                        'disabled': false,
                    },
                    'lyakushokuTB': {
                        'code': 'nok_履歴TB_役職',
                    },
                    'ShozokuTB': {
                        'code': 'nok_履歴TB_所属',
                    },
                    'startDateTB': {
                        'code': 'nok_履歴TB_始',
                    },
                    'endDateTB': {
                        'code': 'nok_履歴TB_終',
                    },
                    'mendansyaTable': {
                        'code': 'mendansya_table',
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'nok_キーマンレコード番号'
                    },
                },
                //--カスタマイズ項目----------------------------------------------------
                // レイヤー変更判定リスト
                layerChangeList: {
                    // テーブルにレイヤー履歴を登録する機能
                    layerHistory: [
                        'yakushoku',
                        'busho',
                    ],
                },
                messages: {
                    'failGetSerialNumber': 'キーマンIDの取得に失敗しました。'
                },
            },

            // お問合せアプリの設定
            toiawase: {
                app: 101,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者部署',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaUser': {
                        'code': 'nok_担当者ユーザ',
                        'shown': false,
                        'disabled': true
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': false,
                        'disabled': true
                    },
                    //--顧客----------------------------------------------------------------
                    'kokyakuSearch': {
                        'code': 'nok_顧客検索',
                        'shown': true,
                        'disabled': false,
                    },
                    'kokyakuId': {
                        'code': 'nok_顧客ID',
                        'shown': false,
                        'disabled': true,
                    },
                    'kokyakumei': {
                        'code': 'nok_顧客名',
                        'shown': true,
                        'disabled': true,
                    },
                    'toiawaseId': {
                        'code': 'nok_お問合せID',
                        'shown': true,
                        'disabled': true,
                    },
                    'toiawaseIDKey': {
                        'code': 'nok_お問合せIDKey',
                        'shown': false,
                        'disabled': true,
                    },
                    'title': {
                        'code': 'nok_タイトル',
                        'shown': true,
                        'disabled': false,
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'nok_クレームレコード番号'
                    },
                    'revision': {
                        'code': '$revision'
                    },
                }
            },

            // 担当者マスタアプリの設定
            tantosha: {
                app: 100,
                fields: {
                    //--担当者--------------------------------------------------------------
                    'tantoshaSearchId': {
                        'code': 'nok_担当者検索コード',
                        'shown': true,
                        'disabled': true
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者名',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                        'shown': true,
                        'disabled': false
                    },
                    'kyoten': {
                        'code': 'nok_担当者拠点',
                        'shown': true,
                        'disabled': false
                    },
                    'busho': {
                        'code': 'nok_担当者部署',
                        'shown': true,
                        'disabled': false
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                        'shown': true,
                        'disabled': false
                    },
                    //--顧客スケジュール表示フラグ----------------------------------
                    'hyouji': {
                        'code': 'nok_顧客スケジュール表示設定',
                        'shown': true,
                        'disabled': false
                    },
                    'hyoujiflag': {
                        'value': '表示する',
                    },
                    //--予実用--------------------------------------------------------------
                    'yojitsuYoTantoshaSearchId': {
                        'code': 'nok_予実用担当者コード',
                        'disabled': true
                    },
                    //--ポータル設定---------------------------------------------------------
                    'portalId': {
                        'code': 'nok_ポータルID'
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'nok_担当者レコード番号'
                    },
                }
            },

            // カレンダー表示設定アプリの設定
            view: {
                app: 99,
                fields: {
                    //--表示設定------------------------------------------------------------
                    'hyojiMeisho': {
                        'code': 'nok_表示名称',
                        'shown': true,
                        'disabled': false
                    },
                    'acountId': {
                        'code': 'nok_アカウント情報',
                        'shown': true,
                        'disabled': false
                    },
                    //--担当者TB------------------------------------------------------------
                    'tantoshaTable': {
                        'code': 'nok_担当者TB',
                        'shown': true,
                    },
                    'tantoshaSearch': {
                        'code': 'nok_担当者検索',
                    },
                    'name': {
                        'code': 'nok_担当者名',
                    },
                    'tantoshaId': {
                        'code': 'nok_担当者ID',
                    },
                    'shozoku01': {
                        'code': 'nok_担当者拠点',
                    },
                    'shozoku02': {
                        'code': 'nok_担当者部署',
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'レコード番号'
                    },
                }
            },

            // 予算・実績管理アプリの設定
            yojitsu: {
                app: 98,
                fields: {
                    'tantoshaId': {
                        'code': 'nok_担当者ID'
                    },
                    'tantoshaMei': {
                        'code': 'nok_担当者'
                    },
                    'kyoten': {
                        'code': 'nok_担当者拠点'
                    },
                    'busho': {
                        'code': 'nok_担当者部署'
                    },
                    'tantoshaSosiki': {
                        'code': 'nok_担当者組織',
                    },
                    'tantoshaCodeYojisseki': {
                        'code': 'nok_担当者コード_予実績用'
                    },
                    'mokuhyoUriageKingaku': {
                        'code': 'nok_目標売上金額'
                    },
                    'mokuhyoArariKingaku': {
                        'code': 'nok_目標粗利金額'
                    },
                    'jissekiUriageKingaku': {
                        'code': 'nok_実績売上金額'
                    },
                    'jissekiArariKingaku': {
                        'code': 'nok_実績粗利金額'
                    },
                    'shukeiyoNengetsu': {
                        'code': 'nok_集計用年月'
                    },
                    'jissekiShukeiKikanItaru': {
                        'code': 'nok_実績集計期間_至'
                    },
                    //--システム--------------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'レコード番号'
                    },
                }
            },

            // 予算・実績表設定アプリの設定
            yojitsuSetting: {
                app: 97,
                fields: {
                    'hyojimei': {
                        'code': 'nok_表示名'
                    },
                    'accountId': {
                        'code': 'nok_アカウント情報'
                    },
                    'hyojijun': {
                        'code': 'nok_表示順'
                    },
                    'kikan': {
                        'code': 'nok_期間'
                    },
                    'kakudo': {
                        'code': 'nok_確度'
                    },
                    'uriageArari': {
                        'code': 'nok_売上_粗利'
                    },
                    //--拠点テーブル--------------------------------------------------------
                    'kyotenTable': {
                        'code': 'nok_拠点TB'
                    },
                    'kyoten': {
                        'code': 'nok_拠点テーブル_拠点'
                    },
                    'tsuki': {
                        'code': 'nok_月'
                    },
                    'kiNendo': {
                        'code': 'nok_期・年度'
                    },
                    //--部署テーブル--------------------------------------------------------
                    'bushoTable': {
                        'code': 'nok_部署TB'
                    },
                    'busho': {
                        'code': 'nok_部署テーブル_部署'
                    },
                    'bushoKyoten': {
                        'code': 'nok_部署テーブル_拠点'
                    },
                    //--担当者テーブル------------------------------------------------------
                    'tantoshaTable': {
                        'code': 'nok_担当者TB'
                    },
                    'tantoshaSearch': {
                        'code': 'nok_担当者テーブル_担当者検索'
                    },
                    'tantoshamei': {
                        'code': 'nok_担当者テーブル_担当者名'
                    },
                    'tantoshaCode': {
                        'code': 'nok_担当者テーブル_担当者コード'
                    },
                    'tantoshaKyoten': {
                        'code': 'nok_担当者テーブル_拠点'
                    },
                    'tantoshaBusho': {
                        'code': 'nok_担当者テーブル_部署'
                    },
                    //--システム------------------------------------------------------------
                    'systemInfoGroup': {
                        'code': 'nok_グループ',
                        'shown': false
                    },
                    'recordId': {
                        'code': '$id'
                    },
                    'recordNo': {
                        'code': 'レコード番号'
                    },
                }
            },

            // 管理ユーザー情報
            kanriUsers: [
                //			'Administrator',
            ],
            // 管理者（名寄せ）
            nayose_kanriUsers: [
                'snc00397', 'Nagoshi', 'snc00441',
            ],
        },
    }
})();
