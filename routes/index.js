var express = require('express');
var router = express.Router();

router.route('/scene/pageList/:sceneId')
	.get(function(req, res, next) {
		var JSON = {
			"success": true,
			"code": 200,
			"msg": "操作成功",
			"obj": null,
			"map": null,
			"list": [{
				"id": 43101838,
				"sceneId": 2915210,
				"num": 1,
				"name": null,
				"properties": null,
				"elements": null,
				"scene": null
			}, {
				"id": 49324920,
				"sceneId": 2915210,
				"num": 2,
				"name": null,
				"properties": null,
				"elements": null,
				"scene": null
			}]
		};
		res.json(JSON);
	});

router.route('/scene/createPage/:pageId')
	.get(function(req, res, next) {
		var JSONPages = {
			"P_43101838": {
				"id": 43101838,
				"sceneId": 2915210,
				"num": 1,
				"name": null,
				"properties": null,
				"elements": [{
					"id": 32,
					"pageId": 43101838,
					"sceneId": 2915210,
					"type": "3",
					"css": {
						"zIndex": "1"
					},
					"properties": {
						"imgSrc": "group1/M00/A2/F8/yq0KA1Qb6OyAGsbHAAEcu3t5djY719.jpg"
					}
				}, {
					"id": 100,
					"pageId": 43101838,
					"sceneId": 2915210,
					"type": "4",
					"css": {
						"zIndex": "2",
						"height": "129",
						"width": "128",
						"left": "18px",
						"top": "11px"
					},
					"properties": {
						"anim": {
							"type": 1,
							"direction": 2,
							"duration": 2,
							"delay": 0
						},
						"height": "100px",
						"imgStyle": {
							"width": 222,
							"height": 129,
							"marginTop": "0px",
							"marginLeft": "-47px"
						},
						"width": "100px",
						"src": "group1/M00/BB/5F/yq0KA1Ru0uiAAQ8iAABut3_qYpY389.png"
					}
				}, {
					"id": 48,
					"pageId": 43101838,
					"sceneId": 2915210,
					"type": "2",
					"content": "<font size=\"4\" color=\"#3bbc1e\"><span style=\"line-height: 18px;\"><b>Sponsors of tomorrow</b></span></font><br><div><font color=\"#333333\" size=\"4\"><span style=\"line-height: 18px;\"><br></span></font><div><font color=\"#ffffff\" size=\"6\">Look Inside</font></div><div><font color=\"#ffffff\" size=\"2\">人生就像一FDSAFDSAFDSAFDSDSFSDA场旅行,不必在乎目的地,在乎的,是沿途的风景,以及看风景的心情。</font></div></div>",
					"css": {
						"zIndex": "3",
						"height": 146,
						"width": 298,
						"left": "11px",
						"top": "142px"
					},
					"properties": {
						"anim": {
							"type": 1,
							"direction": 0,
							"duration": "2",
							"delay": "1"
						},
						"width": 298,
						"height": 146
					}
				}],
				"scene": {
					"id": 2915210,
					"name": "ss",
					"createUser": "4a2d8af94bc9d828014bfd542d520ade",
					"createTime": 1427189428000,
					"type": 101,
					"pageMode": 2,
					"image": {
						"imgSrc": "group1/M00/61/8A/yq0KA1T2vYSAEgo7AACovQVgHxk048.jpg",
						"isAdvancedUser": false
					},
					"isTpl": 0,
					"isPromotion": 0,
					"status": 1,
					"openLimit": 0,
					"startDate": null,
					"endDate": null,
					"updateTime": 1427189503000,
					"publishTime": null,
					"applyTemplate": 0,
					"applyPromotion": 0,
					"sourceId": null,
					"code": "iMZmtIa9",
					"description": null,
					"sort": 0,
					"bgAudio": null,
					"cover": null,
					"property": null,
					"pageCount": 0,
					"dataCount": 0,
					"showCount": 0,
					"userLoginName": null,
					"userName": null
				}
			}
		};
		//console.log(req);
		var pageId = req.params.pageId;
		console.log("pageId: " + pageId);
		var pageInfo = JSONPages["P_" + pageId];
		var JSON = {
			"success": true,
			"code": 200,
			"msg": "操作成功",
			"obj": {},
			"map": null,
			"list": null
		};
		JSON['obj']['id'] = '49324920';
		JSON['obj']['sceneId'] = '2915210';
		JSON['obj']['num'] = '2';

		JSON['obj']['name'] = null;
		JSON['obj']['properties'] = null;
		JSON['obj']['elements'] = null;
		JSON['obj']['scene'] = pageInfo['scene'];

		res.json(JSON);
	});

router.route('/scene/design/:pageId')
	.get(function(req, res, next) {
		var JSONPagesInfo = {
			"Info_43101838": {
				"success": true,
				"code": 200,
				"msg": "操作成功",
				"obj": {
					"id": 43101838,
					"sceneId": 2915210,
					"num": 1,
					"name": null,
					"properties": null,
					"elements": [{
						"id": 32,
						"pageId": 43101838,
						"sceneId": 2915210,
						"type": "3",
						"css": {
							"zIndex": "1"
						},
						"properties": {
							"imgSrc": "group1/M00/A2/F8/yq0KA1Qb6OyAGsbHAAEcu3t5djY719.jpg"
						}
					}, {
						"id": 100,
						"pageId": 43101838,
						"sceneId": 2915210,
						"type": "4",
						"css": {
							"zIndex": "2",
							"height": "129",
							"width": "128",
							"left": "18px",
							"top": "11px"
						},
						"properties": {
							"anim": {
								"type": 1,
								"direction": 2,
								"duration": 2,
								"delay": 0
							},
							"height": "100px",
							"imgStyle": {
								"width": 222,
								"height": 129,
								"marginTop": "0px",
								"marginLeft": "-47px"
							},
							"width": "100px",
							"src": "group1/M00/BB/5F/yq0KA1Ru0uiAAQ8iAABut3_qYpY389.png"
						}
					}, {
						"id": 48,
						"pageId": 43101838,
						"sceneId": 2915210,
						"type": "2",
						"content": "<font size=\"4\" color=\"#3bbc1e\"><span style=\"line-height: 18px;\"><b>Sponsors of tomorrow</b></span></font><br><div><font color=\"#333333\" size=\"4\"><span style=\"line-height: 18px;\"><br></span></font><div><font color=\"#ffffff\" size=\"6\">Look Inside</font></div><div><font color=\"#ffffff\" size=\"2\">人生就像一FDSAFDSAFDSAFDSDSFSDA场旅行,不必在乎目的地,在乎的,是沿途的风景,以及看风景的心情。</font></div></div>",
						"css": {
							"zIndex": "3",
							"height": 146,
							"width": 298,
							"left": "11px",
							"top": "142px"
						},
						"properties": {
							"anim": {
								"type": 1,
								"direction": 0,
								"duration": "2",
								"delay": "1"
							},
							"width": 298,
							"height": 146
						}
					}],
					"scene": {
						"id": 2915210,
						"name": "ss",
						"createUser": "4a2d8af94bc9d828014bfd542d520ade",
						"createTime": 1427189428000,
						"type": 101,
						"pageMode": 2,
						"image": {
							"imgSrc": "group1/M00/61/8A/yq0KA1T2vYSAEgo7AACovQVgHxk048.jpg",
							"isAdvancedUser": false
						},
						"isTpl": 0,
						"isPromotion": 0,
						"status": 1,
						"openLimit": 0,
						"startDate": null,
						"endDate": null,
						"updateTime": 1427189503000,
						"publishTime": null,
						"applyTemplate": 0,
						"applyPromotion": 0,
						"sourceId": null,
						"code": "iMZmtIa9",
						"description": null,
						"sort": 0,
						"bgAudio": null,
						"cover": null,
						"property": null,
						"pageCount": 0,
						"dataCount": 0,
						"showCount": 0,
						"userLoginName": null,
						"userName": null
					}
				},
				"map": null,
				"list": null
			},
			"Info_49324920": {
				"success": true,
				"code": 200,
				"msg": "操作成功",
				"obj": {
					"id": 49324920,
					"sceneId": 2915210,
					"num": 2,
					"name": null,
					"properties": null,
					"elements": null,
					"scene": {
						"id": 2915210,
						"name": "ss",
						"createUser": "4a2d8af94bc9d828014bfd542d520ade",
						"createTime": 1427189428000,
						"type": 101,
						"pageMode": 2,
						"image": {
							"imgSrc": "group1/M00/61/8A/yq0KA1T2vYSAEgo7AACovQVgHxk048.jpg",
							"isAdvancedUser": false
						},
						"isTpl": 0,
						"isPromotion": 0,
						"status": 1,
						"openLimit": 0,
						"startDate": null,
						"endDate": null,
						"updateTime": 1427855971000,
						"publishTime": null,
						"applyTemplate": 0,
						"applyPromotion": 0,
						"sourceId": null,
						"code": "iMZmtIa9",
						"description": null,
						"sort": 0,
						"bgAudio": null,
						"cover": null,
						"property": null,
						"pageCount": 0,
						"dataCount": 0,
						"showCount": 0,
						"userLoginName": null,
						"userName": null
					}
				},
				"map": null,
				"list": null
			}
		};
		var pageId = req.params.pageId;
		console.log("pageId: " + pageId);
		var JSON = JSONPagesInfo["Info_" + pageId];
		res.json(JSON);
	});

router.route('/scene/tag/sys/list')
	.get(function(req, res, next) {
		var JSON = {
			"success": true,
			"code": 200,
			"msg": "操作成功",
			"obj": null,
			"map": null,
			"list": [{
				"id": 1,
				"name": "图文",
				"bizType": 1101,
				"type": 1
			}, {
				"id": 2,
				"name": "图集",
				"bizType": 1101,
				"type": 1
			}, {
				"id": 4,
				"name": "文字",
				"bizType": 1101,
				"type": 1
			}, {
				"id": 5,
				"name": "图表",
				"bizType": 1101,
				"type": 1
			}]
		};
		res.json(JSON);
	});

router.route('/scene/tpl/page/list')
	.get(function(req, res, next) {
		var JSON = {
			"success": true,
			"code": 200,
			"msg": "操作成功",
			"obj": null,
			"map": null,
			"list": [{
				"id": 75183,
				"sceneId": 1102,
				"num": 82,
				"name": "英特尔",
				"properties": {
					"thumbSrc": "group1/M00/36/C3/yq0KA1Sr42qAA3kDAACBbo8dzx0820.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 75185,
				"sceneId": 1102,
				"num": 83,
				"name": "iWATCH",
				"properties": {
					"thumbSrc": "group1/M00/CC/39/yq0KA1UCilCALNhAAADkHdcwucY018.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 75186,
				"sceneId": 1102,
				"num": 84,
				"name": "丰田",
				"properties": {
					"thumbSrc": "group1/M00/CC/3F/yq0KA1UCioqAcnOgAAP8QbpD-wM971.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 75188,
				"sceneId": 1102,
				"num": 85,
				"name": "iPhone6",
				"properties": {
					"thumbSrc": "group1/M00/36/C3/yq0KA1Sr40yAbC6AAAM_D8XDFic750.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 75191,
				"sceneId": 1102,
				"num": 86,
				"name": "优胜美地",
				"properties": {
					"thumbSrc": "group1/M00/36/C3/yq0KA1Sr402ALWhOAAERPkwjWpU813.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 75194,
				"sceneId": 1102,
				"num": 87,
				"name": "SURFACE",
				"properties": {
					"thumbSrc": "group1/M00/36/C4/yq0KA1Sr45KAUEQYAAExsiW-yxk348.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 75201,
				"sceneId": 1102,
				"num": 88,
				"name": "福特野马",
				"properties": {
					"thumbSrc": "group1/M00/36/C4/yq0KA1Sr45KAQLlnAAFsw-oU13Y979.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 75251,
				"sceneId": 1102,
				"num": 91,
				"name": "速度艺术",
				"properties": {
					"thumbSrc": "group1/M00/CC/E0/yq0KA1UCkCuACpBDAAKBbMY84dc652.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 75308,
				"sceneId": 1102,
				"num": 92,
				"name": "世界杯",
				"properties": {
					"thumbSrc": "group1/M00/CC/E7/yq0KA1UCkGWAbDDeAAOWV9UHbN8549.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 75312,
				"sceneId": 1102,
				"num": 93,
				"name": "红苹果",
				"properties": {
					"thumbSrc": "group1/M00/36/C5/yq0KA1Sr48KAWc96AAOH-sV0hEU091.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 75367,
				"sceneId": 1102,
				"num": 96,
				"name": "倚天屠龙记",
				"properties": {
					"thumbSrc": "group1/M00/36/C5/yq0KA1Sr48iAJX4mAAKmNdbB8zc125.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 75375,
				"sceneId": 1102,
				"num": 97,
				"name": "超人",
				"properties": {
					"thumbSrc": "group1/M00/36/C6/yq0KA1Sr4_qAJONMAASZX6Umv5U662.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 106812,
				"sceneId": 1102,
				"num": 63,
				"name": "关注我们",
				"properties": {
					"thumbSrc": "group1/M00/CB/98/yq0KA1UChEiAIt9dAAIqb0yez5c185.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 117231,
				"sceneId": 1102,
				"num": 103,
				"name": "红黄蓝绿",
				"properties": {
					"thumbSrc": "group1/M00/36/C9/yq0KA1Sr5ICARtQVAACBGZ-7NDo635.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 124309,
				"sceneId": 1102,
				"num": 101,
				"name": "蓝色关门",
				"properties": {
					"thumbSrc": "group1/M00/36/C8/yq0KA1Sr5E2ALm28AADIOzyqUVE194.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 124814,
				"sceneId": 1102,
				"num": 102,
				"name": "红色封闭",
				"properties": {
					"thumbSrc": "group1/M00/36/C8/yq0KA1Sr5E2ATLwgAADMgt-yZl4178.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 132875,
				"sceneId": 1102,
				"num": 64,
				"name": "星际穿越",
				"properties": {
					"thumbSrc": "group1/M00/CB/88/yq0KA1UCg6mAQOauAAK9kkbyGTQ738.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 132905,
				"sceneId": 1102,
				"num": 65,
				"name": "泰戈尔虎",
				"properties": {
					"thumbSrc": "group1/M00/CB/92/yq0KA1UChAKAAraXAAP0A-_CnmI265.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 133231,
				"sceneId": 1102,
				"num": 68,
				"name": "星际穿越英文",
				"properties": {
					"thumbSrc": "group1/M00/CC/30/yq0KA1UCif6ATi-DAAF2l0_Xtjk378.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 133255,
				"sceneId": 1102,
				"num": 69,
				"name": "神龟新闻",
				"properties": {
					"thumbSrc": "group1/M00/CB/7D/yq0KA1UCg0iAO5ZMAAHJRunzCn8053.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 136446,
				"sceneId": 1102,
				"num": 72,
				"name": "蓝兰花",
				"properties": {
					"thumbSrc": "group1/M00/CB/5B/yq0KA1UCgfmAZwouAAJALTi2k3E731.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 137449,
				"sceneId": 1102,
				"num": 76,
				"name": "联系方式I",
				"properties": {
					"thumbSrc": "group1/M00/CB/68/yq0KA1UCgnCAdnQzAAI9WpaldyU158.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 1972996,
				"sceneId": 1102,
				"num": 53,
				"name": "圣诞快乐II",
				"properties": {
					"thumbSrc": "group1/M00/36/A0/yq0KA1Sr22mAO9Q0AAJpX6b3xvY327.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 2018399,
				"sceneId": 1102,
				"num": 52,
				"name": "致·索非亚",
				"properties": {
					"thumbSrc": "group1/M00/53/71/yq0KA1Szg3OANapnAAC_EvFcNoM814.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 2121872,
				"sceneId": 1102,
				"num": 46,
				"name": "新年快乐I",
				"properties": {
					"thumbSrc": "group1/M00/36/9E/yq0KA1Sr2vuAa-D2AAFSsrqQlWI099.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 3849068,
				"sceneId": 1102,
				"num": 35,
				"name": "白熊名片",
				"properties": {
					"thumbSrc": "group1/M00/38/44/yq0KA1Ssk3yAY5JAAAJdo3A9Kww399.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 3870227,
				"sceneId": 1102,
				"num": 38,
				"name": "神烦狗",
				"properties": {
					"thumbSrc": "group1/M00/39/26/yq0KA1Ssrm6Ac3U6AADRvY6vgVo221.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 3981925,
				"sceneId": 1102,
				"num": 39,
				"name": "水银灯",
				"properties": {
					"thumbSrc": "group1/M00/47/23/yq0KA1SvrXSAUHoGAALas7AL-5g559.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 4032624,
				"sceneId": 1102,
				"num": 41,
				"name": "NIKE",
				"properties": {
					"thumbSrc": "group1/M00/3F/5F/yq0KA1SuE-iAS6z9AAEEuyuAdWQ015.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 8298402,
				"sceneId": 1102,
				"num": 27,
				"name": "白魔法阵",
				"properties": {
					"thumbSrc": "group1/M00/B0/D3/yq0KA1TDZTGAEiALAAOiXE9n3BA175.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 8304263,
				"sceneId": 1102,
				"num": 33,
				"name": "失月",
				"properties": {
					"thumbSrc": "group1/M00/B0/CF/yq0KA1TDZMKAO58gAAMnZ7Vys-g369.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 8370240,
				"sceneId": 1102,
				"num": 34,
				"name": "长门有希",
				"properties": {
					"thumbSrc": "group1/M00/B2/55/yq0KA1TDmt-AZDpCAAJeQBQ7V-g574.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 13013290,
				"sceneId": 1102,
				"num": 21,
				"name": "大学生自习曲",
				"properties": {
					"thumbSrc": "group1/M00/23/02/yq0KA1TQRMeAF74RAAD4WL_aj5g575.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 13148781,
				"sceneId": 1102,
				"num": 21,
				"name": "扁平化联系我们",
				"properties": {
					"thumbSrc": "group1/M00/26/CF/yq0KA1TQeTGACzKsAADCkd7GQ50238.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 13760542,
				"sceneId": 1102,
				"num": 23,
				"name": "扁平摄影",
				"properties": {
					"thumbSrc": "group1/M00/36/2E/yq0KA1TRygGAPl6LAAB84tVJcMs071.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 13894315,
				"sceneId": 1102,
				"num": 21,
				"name": "EQXIU",
				"properties": {
					"thumbSrc": "group1/M00/45/D5/yq0KA1TTEYuANix_AACQ4dOarJY887.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 14311935,
				"sceneId": 1102,
				"num": 24,
				"name": "黑红",
				"properties": {
					"thumbSrc": "group1/M00/45/C7/yq0KA1TTEQKAeUJ6AACgY8kqzmE496.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 16551178,
				"sceneId": 1102,
				"num": 18,
				"name": "视频",
				"properties": {
					"thumbSrc": "group1/M00/7F/A7/yq0KA1TYbDuAM6liAAJ31w0AL3s028.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 16974775,
				"sceneId": 1102,
				"num": 48,
				"name": "年年有余",
				"properties": {
					"thumbSrc": "group1/M00/BA/8C/yq0KA1TdT8OAAhtjAAR1pmNMYrQ460.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 18334110,
				"sceneId": 1102,
				"num": 49,
				"name": "羊年春联",
				"properties": {
					"thumbSrc": "group1/M00/AE/93/yq0KA1TcRvGAQjyOAASbFq55Xb0302.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 30060463,
				"sceneId": 1102,
				"num": 32,
				"name": "hime",
				"properties": {
					"thumbSrc": "group1/M00/85/9D/yq0KA1T6r6mAEPw2AAHEKuUDhrM741.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 32023365,
				"sceneId": 1102,
				"num": 13,
				"name": "loveluv",
				"properties": {
					"thumbSrc": "group1/M00/AB/C2/yq0KA1T_seCAUKa5AAOJIulj7Ms566.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 32733405,
				"sceneId": 1102,
				"num": 17,
				"name": "NORTH",
				"properties": {
					"thumbSrc": "group1/M00/B9/C4/yq0KA1UBCA6AZPbQAAIB2A3s2gg464.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 33637805,
				"sceneId": 1102,
				"num": 117,
				"name": "doge名片",
				"properties": {
					"thumbSrc": "group1/M00/CB/50/yq0KA1UCgYKAbV32AAMxwpZW_YY238.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 34270093,
				"sceneId": 1102,
				"num": 118,
				"name": "比尔盖茨",
				"properties": {
					"thumbSrc": "group1/M00/D6/51/yq0KA1UDpdqAD0WHAAIRFKjDqpk858.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 35659996,
				"sceneId": 1102,
				"num": 122,
				"name": "MAP",
				"properties": {
					"thumbSrc": "group1/M00/F0/79/yq0KA1UGnDuARdyhAACGoZKznXc745.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 38805212,
				"sceneId": 1102,
				"num": 127,
				"name": "电影风格",
				"properties": {
					"thumbSrc": "group1/M00/28/2C/yq0KA1ULfEyADzLhAARjRPZGqhc000.png"
				},
				"elements": null,
				"scene": null
			}, {
				"id": 42497644,
				"sceneId": 1102,
				"num": 130,
				"name": "蕾芙丽",
				"properties": {
					"thumbSrc": "group1/M00/5A/8C/yq0KA1UQPfiAd-TlAAMB1iR5FDE230.png"
				},
				"elements": null,
				"scene": null
			}]
		};
		res.json(JSON);
	});

router.route('/scene/pageTpl/:pageTplId')
	.get(function(req, res, next) {
		var JSON = {
			"success": true,
			"code": 200,
			"msg": "操作成功",
			"obj": {
				"id": 75183,
				"sceneId": 1102,
				"num": 82,
				"name": "英特尔",
				"properties": {
					"thumbSrc": "group1/M00/36/C3/yq0KA1Sr42qAA3kDAACBbo8dzx0820.png"
				},
				"elements": [{
					"id": 96969,
					"pageId": 75183,
					"sceneId": 1102,
					"type": "3",
					"css": {
						"zIndex": "1"
					},
					"properties": {
						"imgSrc": "group1/M00/A2/F8/yq0KA1Qb6OyAGsbHAAEcu3t5djY719.jpg"
					}
				}, {
					"id": 96970,
					"pageId": 75183,
					"sceneId": 1102,
					"type": "4",
					"css": {
						"zIndex": "2",
						"height": "129",
						"width": "128",
						"left": "18px",
						"top": "11px"
					},
					"properties": {
						"anim": {
							"type": 1,
							"direction": 2,
							"duration": 2,
							"delay": 0
						},
						"height": "100px",
						"imgStyle": {
							"width": 222,
							"height": 129,
							"marginTop": "0px",
							"marginLeft": "-47px"
						},
						"width": "100px",
						"src": "group1/M00/BB/5F/yq0KA1Ru0uiAAQ8iAABut3_qYpY389.png"
					}
				}, {
					"id": 96971,
					"pageId": 75183,
					"sceneId": 1102,
					"type": "2",
					"content": "<font color=\"#ffffff\" size=\"4\"><span style=\"line-height: 18px;\"><b>Sponsors of tomorrow</b></span></font><br><div><font color=\"#333333\" size=\"4\"><span style=\"line-height: 18px;\"><br></span></font><div><font color=\"#ffffff\" size=\"2\">Look Inside</font></div><div><font color=\"#ffffff\" size=\"2\">人生就像一场旅行,不必在乎目的地,在乎的,是沿途的风景,以及看风景的心情。</font></div></div>",
					"css": {
						"zIndex": "3",
						"height": "147",
						"width": "309",
						"left": "11px",
						"top": "142px"
					},
					"properties": {
						"anim": {
							"type": 1,
							"direction": 0,
							"duration": "2",
							"delay": "1"
						}
					}
				}],
				"scene": null
			},
			"map": null,
			"list": null
		};
		res.json(JSON);
	});

router.route('/scene/save')
	.post(function(req, res, next) {
		var JSON = {
			"success": true,
			"code": 200,
			"msg": "操作成功",
			"obj": null,
			"map": null,
			"list": null
		};
		res.json(JSON);
	});
module.exports = router;