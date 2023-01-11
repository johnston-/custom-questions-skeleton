console.log(`
==============================================================================================
THE SCRIPT BELOW IS BEING USED TO TEST THE SERVER SIDE SCORING FOR YOUR CUSTOM QUESTION
----
Update the questionResponseJson with your question json & response
==============================================================================================
`);

// QuestionResponseJson that will be used to test your Scorer logic
const questionResponseJson = {
    question: {
        stimulus: 'This is stimulus',
        type: 'custom',
        js: {
            question: '/dist/question.js',
            scorer: '/dist/scorer.js'
        },
        css: '/dist/question.css',
        instant_feedback: true
        // TODO - requires implementation - add the rest of your question json
    },
    response: {
      "type": "skeleton-map",
      "name": "ske 9.23",
      "bank": [],
      "nodes": [
            {
              "id": "m655-f51",
              "type": "concept",
              "value": "cells",
              "x": 556.5827649278305,
              "y": 9,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 35,
              "formattedText": [
                {
                  "width": 28,
                  "chunks": [
                    "cells"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 0,
              "vy": 0,
              "vx": 0,
              "fx": 556.5827649278305,
              "fy": 9
            },
            {
              "id": "m855-x103",
              "type": "relation",
              "value": "give rise to",
              "x": 709.5214019156901,
              "y": 70,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "height": 24,
              "width": 73.78334045410156,
              "formattedText": [
                {
                  "width": 61,
                  "chunks": [
                    "give",
                    "rise",
                    "to"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 1,
              "vy": 0,
              "vx": 0,
              "fx": 709.5214019156901,
              "fy": 70
            },
            {
              "id": "h419-d98",
              "type": "relation",
              "value": "are important because they",
              "x": 403.6441279399709,
              "y": 70,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 38,
              "width": 89.88333129882812,
              "formattedText": [
                {
                  "width": 80,
                  "chunks": [
                    "are",
                    "important"
                  ],
                  "yPosition": 4
                },
                {
                  "width": 81,
                  "chunks": [
                    "because",
                    "they"
                  ],
                  "yPosition": 18
                }
              ],
              "index": 2,
              "vy": 0,
              "vx": 0,
              "fx": 403.6441279399709,
              "fy": 70
            },
            {
              "id": "a634-k26",
              "type": "concept",
              "value": "prokaryotes (before-nucleus)",
              "x": 985.3100922052741,
              "y": 137.99999618530273,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 40,
              "width": 109,
              "formattedText": [
                {
                  "width": 75,
                  "chunks": [
                    "prokaryotes"
                  ],
                  "yPosition": 4
                },
                {
                  "width": 104,
                  "chunks": [
                    "(before-nucleus)"
                  ],
                  "yPosition": 18
                }
              ],
              "index": 3,
              "vy": 0,
              "vx": 0,
              "fx": 985.3100922052741,
              "fy": 137.99999618530273
            },
            {
              "id": "h512-s124",
              "type": "concept",
              "value": "carry out functions",
              "x": 177.2625954096199,
              "y": 138,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 38,
              "width": 64,
              "formattedText": [
                {
                  "width": 52,
                  "chunks": [
                    "carry",
                    "out"
                  ],
                  "yPosition": 4
                },
                {
                  "width": 57,
                  "chunks": [
                    "functions"
                  ],
                  "yPosition": 18
                }
              ],
              "index": 4,
              "vy": 0,
              "vx": 0,
              "fx": 177.2625954096199,
              "fy": 138
            },
            {
              "id": "i1014-a99",
              "type": "concept",
              "value": "carry out reproduction",
              "x": 587.5369827692391,
              "y": 146.459228515625,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 38,
              "width": 87,
              "formattedText": [
                {
                  "width": 52,
                  "chunks": [
                    "carry",
                    "out"
                  ],
                  "yPosition": 4
                },
                {
                  "width": 80,
                  "chunks": [
                    "reproduction"
                  ],
                  "yPosition": 18
                }
              ],
              "index": 5,
              "vy": 0,
              "vx": 0,
              "fx": 587.5369827692391,
              "fy": 146.459228515625
            },
            {
              "id": "l555-j89",
              "type": "concept",
              "value": "give structure",
              "x": 456.4561302606942,
              "y": 150.08462524414062,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 26,
              "width": 92.88333129882812,
              "formattedText": [
                {
                  "width": 82,
                  "chunks": [
                    "give",
                    "structure"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 6,
              "vy": 0,
              "vx": 0,
              "fx": 456.4561302606942,
              "fy": 150.08462524414062
            },
            {
              "id": "b346-i92",
              "type": "concept",
              "value": "consumes nutrients",
              "x": 326.18297810004964,
              "y": 150.0846405029297,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 38,
              "width": 71,
              "formattedText": [
                {
                  "width": 64,
                  "chunks": [
                    "consumes"
                  ],
                  "yPosition": 4
                },
                {
                  "width": 55,
                  "chunks": [
                    "nutrients"
                  ],
                  "yPosition": 18
                }
              ],
              "index": 7,
              "vy": 0,
              "vx": 0,
              "fx": 326.18297810004964,
              "fy": 150.0846405029297
            },
            {
              "id": "l896-m102",
              "type": "concept",
              "value": "eukaryotes (true-nucleus)",
              "x": 788.6507797663091,
              "y": 162.4559097290039,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 40,
              "width": 93,
              "formattedText": [
                {
                  "width": 70,
                  "chunks": [
                    "eukaryotes"
                  ],
                  "yPosition": 4
                },
                {
                  "width": 88,
                  "chunks": [
                    "(true-nucleus)"
                  ],
                  "yPosition": 18
                }
              ],
              "index": 8,
              "vy": 0,
              "vx": 0,
              "fx": 788.6507797663091,
              "fy": 162.4559097290039
            },
            {
              "id": "j400-k9",
              "type": "relation",
              "value": "make up",
              "x": 100.34900467121018,
              "y": 199,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 58.91667175292969,
              "formattedText": [
                {
                  "width": 50,
                  "chunks": [
                    "make",
                    "up"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 9,
              "vy": 0,
              "vx": 0,
              "fx": 100.34900467121018,
              "fy": 199,
              "style": "directionRelation",
              "assessmentItem": "directionRelation",
              "assessmentId": "f1231-j70"
            },
            {
              "id": "a874-q52",
              "type": "relation",
              "value": "with",
              "x": 473.99151371136963,
              "y": 211.82516479492188,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 22,
              "width": 29,
              "formattedText": [
                {
                  "width": 24,
                  "chunks": [
                    "with"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 10,
              "vy": 0,
              "vx": 0,
              "fx": 473.99151371136963,
              "fy": 211.82516479492188
            },
            {
              "id": "c1381-d41",
              "type": "relation",
              "value": "is acquired by",
              "x": 321.0449211261234,
              "y": 212.2930908203125,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 92.78334045410156,
              "formattedText": [
                {
                  "width": 80,
                  "chunks": [
                    "is",
                    "acquired",
                    "by"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 11,
              "vy": 0,
              "vx": 0,
              "fx": 321.0449211261234,
              "fy": 212.2930908203125
            },
            {
              "id": "a293-h91",
              "type": "relation",
              "value": "is acquired by",
              "x": 654.8198119374456,
              "y": 217.12692260742188,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 92.78334045410156,
              "formattedText": [
                {
                  "width": 80,
                  "chunks": [
                    "is",
                    "acquired",
                    "by"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 12,
              "vy": 0,
              "vx": 0,
              "fx": 654.8198119374456,
              "fy": 217.12692260742188
            },
            {
              "id": "g904-u45",
              "type": "relation",
              "value": "consist of",
              "x": 827.261492255125,
              "y": 219.31694793701172,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 65.28334045410156,
              "formattedText": [
                {
                  "width": 56,
                  "chunks": [
                    "consist",
                    "of"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 13,
              "vy": 0,
              "vx": 0,
              "fx": 827.261492255125,
              "fy": 219.31694793701172
            },
            {
              "id": "g633-j58",
              "type": "relation",
              "value": "consist of",
              "x": 1000.4087669583505,
              "y": 222.45410537719727,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 65.28334045410156,
              "formattedText": [
                {
                  "width": 56,
                  "chunks": [
                    "consist",
                    "of"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 14,
              "vy": 0,
              "vx": 0,
              "fx": 1000.4087669583505,
              "fy": 222.45410537719727
            },
            {
              "id": "l367-d37",
              "type": "concept",
              "value": "tissues",
              "x": 25.766666412353516,
              "y": 260,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 51,
              "formattedText": [
                {
                  "width": 44,
                  "chunks": [
                    "tissues"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 15,
              "vy": 0,
              "vx": 0,
              "fx": 25.766666412353516,
              "fy": 260
            },
            {
              "id": "a401-l65",
              "type": "concept",
              "value": "DNA seperation",
              "x": 612.2181659698487,
              "y": 266.04229736328125,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 26,
              "width": 105.88333129882812,
              "formattedText": [
                {
                  "width": 95,
                  "chunks": [
                    "DNA",
                    "seperation"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 16,
              "vy": 0,
              "vx": 0,
              "fx": 612.2181659698487,
              "fy": 266.04229736328125
            },
            {
              "id": "j723-v48",
              "type": "concept",
              "value": "cell wall",
              "x": 505.672772598267,
              "y": 280.41322326660156,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 26,
              "width": 54.91667175292969,
              "formattedText": [
                {
                  "width": 44,
                  "chunks": [
                    "cell",
                    "wall"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 18,
              "vy": 0,
              "vx": 0,
              "fx": 505.672772598267,
              "fy": 280.41322326660156,
              "style": "fillIn",
              "assessmentItem": "fill-in",
              "assessmentId": "l422-g89",
              "showHint": false,
              "displayValue": "cell wall"
            },
            {
              "id": "e1314-o30",
              "type": "concept",
              "value": "endocytosis",
              "x": 355.50655899047877,
              "y": 281.75233459472656,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 82,
              "formattedText": [
                {
                  "width": 75,
                  "chunks": [
                    "endocytosis"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 19,
              "vy": 0,
              "vx": 0,
              "fx": 355.50655899047877,
              "fy": 281.75233459472656
            },
            {
              "id": "e1009-v95",
              "type": "relation",
              "value": "happens in the",
              "x": 638.4316059112554,
              "y": 311.9678039550781,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 98.78334045410156,
              "formattedText": [
                {
                  "width": 86,
                  "chunks": [
                    "happens",
                    "in",
                    "the"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 20,
              "vy": 0,
              "vx": 0,
              "fx": 638.4316059112554,
              "fy": 311.9678039550781
            },
            {
              "id": "i286-a99",
              "type": "concept",
              "value": "skeletal tissues",
              "x": 400.7879905700687,
              "y": 320.4231414794922,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 26,
              "width": 102.88333129882812,
              "formattedText": [
                {
                  "width": 92,
                  "chunks": [
                    "skeletal",
                    "tissues"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 21,
              "vy": 0,
              "vx": 0,
              "fx": 400.7879905700687,
              "fy": 320.4231414794922
            },
            {
              "id": "h928-s59",
              "type": "concept",
              "value": "Unicellular organisms",
              "x": 1006.5390579223638,
              "y": 331.0521240234375,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 38,
              "width": 72,
              "formattedText": [
                {
                  "width": 65,
                  "chunks": [
                    "Unicellular"
                  ],
                  "yPosition": 4
                },
                {
                  "width": 65,
                  "chunks": [
                    "organisms"
                  ],
                  "yPosition": 18
                }
              ],
              "index": 22,
              "vy": 0,
              "vx": 0,
              "fx": 1006.5390579223638,
              "fy": 331.0521240234375
            },
            {
              "id": "j920-k35",
              "type": "concept",
              "value": "multicellular organisms",
              "x": 832.7605714431602,
              "y": 340.33179473876953,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 38,
              "width": 81,
              "formattedText": [
                {
                  "width": 74,
                  "chunks": [
                    "multicellular"
                  ],
                  "yPosition": 4
                },
                {
                  "width": 65,
                  "chunks": [
                    "organisms"
                  ],
                  "yPosition": 18
                }
              ],
              "index": 23,
              "vy": 0,
              "vx": 0,
              "fx": 832.7605714431602,
              "fy": 340.33179473876953
            },
            {
              "id": "m1206-k129",
              "type": "concept",
              "value": "cytoplasm",
              "x": 560.8217063903817,
              "y": 428.1539306640625,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 70,
              "formattedText": [
                {
                  "width": 63,
                  "chunks": [
                    "cytoplasm"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 24,
              "vy": 0,
              "vx": 0,
              "fx": 560.8217063903817,
              "fy": 428.1539306640625,
              "style": "multiChoice",
              "assessmentItem": "multi-choice",
              "assessmentId": "a549-d78",
              "displayValue": "cytoplasm"
            },
            {
              "id": "f1044-e109",
              "type": "concept",
              "value": "nucleus",
              "x": 653.2673355102547,
              "y": 432.29290771484375,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 56,
              "formattedText": [
                {
                  "width": 49,
                  "chunks": [
                    "nucleus"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 25,
              "vy": 0,
              "vx": 0,
              "fx": 653.2673355102547,
              "fy": 432.29290771484375
            },
            {
              "id": "l713-l76",
              "type": "relation",
              "value": "are recognized as",
              "x": 867.2321237757255,
              "y": 433.1655807495117,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 36,
              "width": 98.88333129882812,
              "formattedText": [
                {
                  "width": 90,
                  "chunks": [
                    "are",
                    "recognized"
                  ],
                  "yPosition": 4
                },
                {
                  "width": 15,
                  "chunks": [
                    "as"
                  ],
                  "yPosition": 18
                }
              ],
              "index": 26,
              "vy": 0,
              "vx": 0,
              "fx": 867.2321237757255,
              "fy": 433.1655807495117,
              "assessmentItem": "error-detection",
              "assessmentId": "g1083-r97",
              "displayValue": "are recognized as"
            },
            {
              "id": "c672-w41",
              "type": "relation",
              "value": "are recognized as",
              "x": 1108.6531989491723,
              "y": 441.1314239501953,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 36,
              "width": 98.88333129882812,
              "formattedText": [
                {
                  "width": 90,
                  "chunks": [
                    "are",
                    "recognized"
                  ],
                  "yPosition": 4
                },
                {
                  "width": 15,
                  "chunks": [
                    "as"
                  ],
                  "yPosition": 18
                }
              ],
              "index": 27,
              "vy": 0,
              "vx": 0,
              "fx": 1108.6531989491723,
              "fy": 441.1314239501953
            },
            {
              "id": "g1254-g97",
              "type": "relation",
              "value": "is found only in",
              "x": 665.6841445922867,
              "y": 504.9181823730469,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 99.66667175292969,
              "formattedText": [
                {
                  "width": 83,
                  "chunks": [
                    "is",
                    "found",
                    "only",
                    "in"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 28,
              "vy": 0,
              "vx": 0,
              "fx": 665.6841445922867,
              "fy": 504.9181823730469
            },
            {
              "id": "j1266-s113",
              "type": "concept",
              "value": "fungi",
              "x": 1011.7260340209891,
              "y": 535.2228927612305,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 38,
              "formattedText": [
                {
                  "width": 31,
                  "chunks": [
                    "fungi"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 29,
              "vy": 0,
              "vx": 0,
              "fx": 1011.7260340209891,
              "fy": 535.2228927612305
            },
            {
              "id": "f1040-a70",
              "type": "concept",
              "value": "animals",
              "x": 837.4644022460868,
              "y": 541.431266784668,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 55,
              "formattedText": [
                {
                  "width": 48,
                  "chunks": [
                    "animals"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 30,
              "vy": 0,
              "vx": 0,
              "fx": 837.4644022460868,
              "fy": 541.431266784668
            },
            {
              "id": "f316-e122",
              "type": "concept",
              "value": "yeast",
              "x": 1295.586764001458,
              "y": 546.2803649902344,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 41,
              "formattedText": [
                {
                  "width": 34,
                  "chunks": [
                    "yeast"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 31,
              "vy": 0,
              "vx": 0,
              "fx": 1295.586764001458,
              "fy": 546.2803649902344
            },
            {
              "id": "c511-r54",
              "type": "concept",
              "value": "archea",
              "x": 1182.1061983581471,
              "y": 549.9209289550781,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 51,
              "formattedText": [
                {
                  "width": 44,
                  "chunks": [
                    "archea"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 32,
              "vy": 0,
              "vx": 0,
              "fx": 1182.1061983581471,
              "fy": 549.9209289550781
            },
            {
              "id": "i696-u60",
              "type": "concept",
              "value": "plants",
              "x": 946.7430651184013,
              "y": 558.8481369018555,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 45,
              "formattedText": [
                {
                  "width": 38,
                  "chunks": [
                    "plants"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 33,
              "vy": 0,
              "vx": 0,
              "fx": 946.7430651184013,
              "fy": 558.8481369018555
            },
            {
              "id": "f819-n109",
              "type": "concept",
              "value": "amobae",
              "x": 1052.7148043151783,
              "y": 581.4615478515625,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 58,
              "formattedText": [
                {
                  "width": 51,
                  "chunks": [
                    "amobae"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 34,
              "vy": 0,
              "vx": 0,
              "fx": 1052.7148043151783,
              "fy": 581.4615478515625
            },
            {
              "id": "e323-l30",
              "type": "concept",
              "value": "bacteria",
              "x": 1127.0471773620534,
              "y": 618.5763854980469,
              "settings": {
                "dim": false,
                "superConcept-initial": false,
                "superConcept-select": false,
                "SKEItemNumber": []
              },
              "set": true,
              "height": 24,
              "width": 58,
              "formattedText": [
                {
                  "width": 51,
                  "chunks": [
                    "bacteria"
                  ],
                  "yPosition": 4
                }
              ],
              "index": 35,
              "vy": 0,
              "vx": 0,
              "fx": 1127.0471773620534,
              "fy": 618.5763854980469
            },
            {
              "id": "l511-r76",
              "value": "photosynthesis",
              "x": 216.13843853192608,
              "y": 276.9653118756286,
              "width": 102,
              "height": 24,
              "formattedText": [
                {
                  "width": 95,
                  "chunks": [
                    "photosynthesis"
                  ],
                  "yPosition": 4
                }
              ],
              "style": "dragDrop",
              "assessmentItem": "drag-drop",
              "type": "concept",
              "assessmentId": "d621-x68",
              "distractor": false
            }
          ],
      "links": [
        {
          "id": "i798-s86",
          "type": "source",
          "source": "m655-f51",
          "target": "m855-x103",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 0,
          "style": "link"
        },
        {
          "id": "h760-g98",
          "type": "target",
          "source": "m855-x103",
          "target": "l896-m102",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 1,
          "style": "link"
        },
        {
          "id": "d797-r29",
          "type": "source",
          "source": "l896-m102",
          "target": "g904-u45",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 2,
          "style": "link"
        },
        {
          "id": "m756-c25",
          "type": "target",
          "source": "g904-u45",
          "target": "j920-k35",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 3,
          "style": "link"
        },
        {
          "id": "f705-d44",
          "type": "source",
          "source": "a634-k26",
          "target": "g633-j58",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 4,
          "style": "link"
        },
        {
          "id": "m642-s25",
          "type": "target",
          "source": "g633-j58",
          "target": "h928-s59",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 5,
          "style": "link"
        },
        {
          "id": "h549-d33",
          "type": "source",
          "source": "h928-s59",
          "target": "c672-w41",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 6,
          "style": "link"
        },
        {
          "id": "k563-r36",
          "type": "target",
          "source": "c672-w41",
          "target": "e323-l30",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 7,
          "style": "link"
        },
        {
          "id": "b510-q53",
          "type": "target",
          "source": "c672-w41",
          "target": "c511-r54",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 8,
          "style": "link"
        },
        {
          "id": "d520-a81",
          "type": "source",
          "source": "j920-k35",
          "target": "l713-l76",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 9,
          "style": "link"
        },
        {
          "id": "i525-f73",
          "type": "target",
          "source": "l713-l76",
          "target": "i696-u60",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 10,
          "style": "link"
        },
        {
          "id": "h834-c85",
          "type": "target",
          "source": "l713-l76",
          "target": "f1040-a70",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 11,
          "style": "link"
        },
        {
          "id": "d984-w107",
          "type": "target",
          "source": "g904-u45",
          "target": "h928-s59",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 12,
          "style": "link"
        },
        {
          "id": "b1296-w105",
          "type": "target",
          "source": "c672-w41",
          "target": "j1266-s113",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 13,
          "style": "link"
        },
        {
          "id": "e61-j108",
          "type": "target",
          "source": "c672-w41",
          "target": "f316-e122",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 14,
          "style": "link"
        },
        {
          "id": "a932-w130",
          "type": "target",
          "source": "c672-w41",
          "target": "f819-n109",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 15,
          "style": "link"
        },
        {
          "id": "f1046-g44",
          "type": "target",
          "source": "l713-l76",
          "target": "j1266-s113",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 16,
          "style": "link"
        },
        {
          "id": "i823-r47",
          "type": "target",
          "source": "m855-x103",
          "target": "a634-k26",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 17,
          "style": "link"
        },
        {
          "id": "k463-v101",
          "type": "source",
          "source": "m655-f51",
          "target": "h419-d98",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 18,
          "style": "link"
        },
        {
          "id": "i379-p60",
          "type": "source",
          "source": "i1014-a99",
          "target": "a293-h91",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 23,
          "style": "link"
        },
        {
          "id": "e512-s69",
          "type": "target",
          "source": "a293-h91",
          "target": "a401-l65",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 24,
          "style": "link"
        },
        {
          "id": "k1225-d127",
          "type": "source",
          "source": "a401-l65",
          "target": "e1009-v95",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 25,
          "style": "link"
        },
        {
          "id": "i1013-z99",
          "type": "target",
          "source": "e1009-v95",
          "target": "m1206-k129",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 26,
          "style": "link"
        },
        {
          "id": "e1228-g121",
          "type": "target",
          "source": "e1009-v95",
          "target": "f1044-e109",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 27,
          "style": "link"
        },
        {
          "id": "f1363-l44",
          "type": "source",
          "source": "b346-i92",
          "target": "c1381-d41",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 28,
          "style": "link"
        },
        {
          "id": "c1110-s54",
          "type": "target",
          "source": "c1381-d41",
          "target": "e1314-o30",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 29,
          "style": "link"
        },
        {
          "id": "a327-p26",
          "type": "target",
          "source": "j400-k9",
          "target": "h512-s124",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 31,
          "style": "ad_unselect",
          "assessmentItem": "arrow-direction",
          "assessmentId": "f1231-j70"
        },
        {
          "id": "e212-e43",
          "type": "target",
          "source": "j400-k9",
          "target": "l367-d37",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 32,
          "style": "ad_select",
          "assessmentItem": "arrow-direction",
          "assessmentId": "f1231-j70",
          "directionItem": true
        },
        {
          "id": "e837-f43",
          "type": "source",
          "source": "l555-j89",
          "target": "a874-q52",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 33,
          "style": "link"
        },
        {
          "id": "d923-n68",
          "type": "target",
          "source": "a874-q52",
          "target": "j723-v48",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 34,
          "style": "link"
        },
        {
          "id": "c394-e93",
          "type": "target",
          "source": "a874-q52",
          "target": "i286-a99",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 35,
          "style": "link"
        },
        {
          "id": "f1200-e83",
          "type": "source",
          "source": "f1044-e109",
          "target": "g1254-g97",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 36,
          "style": "link"
        },
        {
          "id": "g894-k97",
          "type": "target",
          "source": "g1254-g97",
          "target": "l896-m102",
          "settings": {
            "dim": false,
            "superConcept-select": false,
            "undefinedNode": false
          },
          "index": 37,
          "style": "link"
        },
        {
          "id": "m949-n38",
          "type": "target",
          "source": "h419-d98",
          "target": "h512-s124",
          "assessmentItem": "connect-link",
          "assessmentId": "e882-y95",
          "style": "connect-link",
          "connectNode": {
            "id": "h419-d98-->",
            "value": "-->",
            "type": "relation",
            "x": 403.6441279399709,
            "y": 106.70258712768555,
            "returnCoors": [
              403.6441279399709,
              106.70258712768555
            ],
            "width": 10,
            "height": 10,
            "assessmentId": "e882-y95",
            "assessmentItem": "connect-to",
            "parentNode": "h419-d98"
          },
          "connectLink": {
            "id": "h419-d98-selector",
            "source": "h419-d98",
            "target": "h419-d98-->",
            "type": "source",
            "assessmentId": "e882-y95",
            "assessmentItem": "selector-link"
          }
        },
        {
          "id": "g401-l58",
          "type": "target",
          "source": "h419-d98",
          "target": "b346-i92",
          "assessmentItem": "connect-link",
          "assessmentId": "e882-y95",
          "style": "connect-link",
          "connectNode": {
            "id": "h419-d98-->",
            "value": "-->",
            "type": "relation",
            "x": 403.6441279399709,
            "y": 106.70258712768555,
            "returnCoors": [
              403.6441279399709,
              106.70258712768555
            ],
            "width": 10,
            "height": 10,
            "assessmentId": "e882-y95",
            "assessmentItem": "connect-to",
            "parentNode": "h419-d98"
          },
          "connectLink": {
            "id": "h419-d98-selector",
            "source": "h419-d98",
            "target": "h419-d98-->",
            "type": "source",
            "assessmentId": "e882-y95",
            "assessmentItem": "selector-link"
          }
        },
        {
          "id": "b409-t40",
          "type": "target",
          "source": "h419-d98",
          "target": "l555-j89",
          "assessmentItem": "connect-link",
          "assessmentId": "e882-y95",
          "style": "connect-link",
          "connectNode": {
            "id": "h419-d98-->",
            "value": "-->",
            "type": "relation",
            "x": 403.6441279399709,
            "y": 106.70258712768555,
            "returnCoors": [
              403.6441279399709,
              106.70258712768555
            ],
            "width": 10,
            "height": 10,
            "assessmentId": "e882-y95",
            "assessmentItem": "connect-to",
            "parentNode": "h419-d98"
          },
          "connectLink": {
            "id": "h419-d98-selector",
            "source": "h419-d98",
            "target": "h419-d98-->",
            "type": "source",
            "assessmentId": "e882-y95",
            "assessmentItem": "selector-link"
          }
        },
        {
          "id": "b752-y40",
          "type": "target",
          "source": "h419-d98",
          "target": "i1014-a99",
          "assessmentItem": "connect-link",
          "assessmentId": "e882-y95",
          "style": "connect-link",
          "connectNode": {
            "id": "h419-d98-->",
            "value": "-->",
            "type": "relation",
            "x": 403.6441279399709,
            "y": 106.70258712768555,
            "returnCoors": [
              403.6441279399709,
              106.70258712768555
            ],
            "width": 10,
            "height": 10,
            "assessmentId": "e882-y95",
            "assessmentItem": "connect-to",
            "parentNode": "h419-d98"
          },
          "connectLink": {
            "id": "h419-d98-selector",
            "source": "h419-d98",
            "target": "h419-d98-->",
            "type": "source",
            "assessmentId": "e882-y95",
            "assessmentItem": "selector-link"
          }
        },
        {
          "id": "a652-c78",
          "type": "target",
          "source": "c1381-d41",
          "target": "l511-r76",
          "assessmentItem": "connect-link",
          "assessmentId": "d621-x68",
          "style": "connect-link"
        }
      ],
      "triples": [
        {
          "id": "i728-a99",
          "value": [
            "cells",
            "give rise to",
            "eukaryotes (true-nucleus)"
          ],
          "config": {
            "subId": "m655-f51",
            "relId": "m855-x103",
            "objId": "l896-m102",
            "sourceId": "i798-s86",
            "targetId": "h760-g98"
          }
        },
        {
          "id": "k891-h49",
          "value": [
            "eukaryotes (true-nucleus)",
            "consist of",
            "multicellular organisms"
          ],
          "config": {
            "subId": "l896-m102",
            "relId": "g904-u45",
            "objId": "j920-k35",
            "sourceId": "d797-r29",
            "targetId": "m756-c25"
          }
        },
        {
          "id": "e819-n30",
          "value": [
            "prokaryotes (before-nucleus)",
            "consist of",
            "Unicellular organisms"
          ],
          "config": {
            "subId": "a634-k26",
            "relId": "g633-j58",
            "objId": "h928-s59",
            "sourceId": "f705-d44",
            "targetId": "m642-s25"
          }
        },
        {
          "id": "b297-l66",
          "value": [
            "Unicellular organisms",
            "are recognized as",
            "bacteria"
          ],
          "config": {
            "subId": "h928-s59",
            "relId": "c672-w41",
            "objId": "e323-l30",
            "sourceId": "h549-d33",
            "targetId": "k563-r36"
          }
        },
        {
          "id": "b644-u53",
          "value": [
            "Unicellular organisms",
            "are recognized as",
            "archea"
          ],
          "config": {
            "subId": "h928-s59",
            "relId": "c672-w41",
            "objId": "c511-r54",
            "sourceId": "h549-d33",
            "targetId": "b510-q53"
          }
        },
        {
          "id": "m796-q64",
          "value": [
            "multicellular organisms",
            "are recognized as",
            "plants"
          ],
          "config": {
            "subId": "j920-k35",
            "relId": "l713-l76",
            "objId": "i696-u60",
            "sourceId": "d520-a81",
            "targetId": "i525-f73"
          }
        },
        {
          "id": "c893-j67",
          "value": [
            "multicellular organisms",
            "are recognized as",
            "animals"
          ],
          "config": {
            "subId": "j920-k35",
            "relId": "l713-l76",
            "objId": "f1040-a70",
            "sourceId": "d520-a81",
            "targetId": "h834-c85"
          }
        },
        {
          "id": "g1084-s84",
          "value": [
            "eukaryotes (true-nucleus)",
            "consist of",
            "Unicellular organisms"
          ],
          "config": {
            "subId": "l896-m102",
            "relId": "g904-u45",
            "objId": "h928-s59",
            "sourceId": "d797-r29",
            "targetId": "d984-w107"
          }
        },
        {
          "id": "i1191-v86",
          "value": [
            "Unicellular organisms",
            "are recognized as",
            "fungi"
          ],
          "config": {
            "subId": "h928-s59",
            "relId": "c672-w41",
            "objId": "j1266-s113",
            "sourceId": "h549-d33",
            "targetId": "b1296-w105"
          }
        },
        {
          "id": "h42-q98",
          "value": [
            "Unicellular organisms",
            "are recognized as",
            "yeast"
          ],
          "config": {
            "subId": "h928-s59",
            "relId": "c672-w41",
            "objId": "f316-e122",
            "sourceId": "h549-d33",
            "targetId": "e61-j108"
          }
        },
        {
          "id": "d968-g120",
          "value": [
            "Unicellular organisms",
            "are recognized as",
            "amobae"
          ],
          "config": {
            "subId": "h928-s59",
            "relId": "c672-w41",
            "objId": "f819-n109",
            "sourceId": "h549-d33",
            "targetId": "a932-w130"
          }
        },
        {
          "id": "a1146-c52",
          "value": [
            "multicellular organisms",
            "are recognized as",
            "fungi"
          ],
          "config": {
            "subId": "j920-k35",
            "relId": "l713-l76",
            "objId": "j1266-s113",
            "sourceId": "d520-a81",
            "targetId": "f1046-g44"
          }
        },
        {
          "id": "l1128-k37",
          "value": [
            "cells",
            "give rise to",
            "prokaryotes (before-nucleus)"
          ],
          "config": {
            "subId": "m655-f51",
            "relId": "m855-x103",
            "objId": "a634-k26",
            "sourceId": "i798-s86",
            "targetId": "i823-r47"
          }
        },
        {
          "id": "m415-z103",
          "value": [
            "cells",
            "are important because they",
            "give structure"
          ],
          "config": {
            "subId": "m655-f51",
            "relId": "h419-d98",
            "objId": "l555-j89",
            "sourceId": "k463-v101",
            "targetId": "a620-w91"
          }
        },
        {
          "id": "c626-c106",
          "value": [
            "cells",
            "are important because they",
            "consumes nutrients"
          ],
          "config": {
            "subId": "m655-f51",
            "relId": "h419-d98",
            "objId": "b346-i92",
            "sourceId": "k463-v101",
            "targetId": "d384-u94"
          }
        },
        {
          "id": "i1255-h112",
          "value": [
            "cells",
            "are important because they",
            "carry out reproduction"
          ],
          "config": {
            "subId": "m655-f51",
            "relId": "h419-d98",
            "objId": "i1014-a99",
            "sourceId": "k463-v101",
            "targetId": "g1073-h123"
          }
        },
        {
          "id": "f166-k135",
          "value": [
            "cells",
            "are important because they",
            "carry out functions"
          ],
          "config": {
            "subId": "m655-f51",
            "relId": "h419-d98",
            "objId": "h512-s124",
            "sourceId": "k463-v101",
            "targetId": "j547-b113"
          }
        },
        {
          "id": "e681-f82",
          "value": [
            "carry out reproduction",
            "is acquired by",
            "DNA seperation"
          ],
          "config": {
            "subId": "i1014-a99",
            "relId": "a293-h91",
            "objId": "a401-l65",
            "sourceId": "i379-p60",
            "targetId": "e512-s69"
          }
        },
        {
          "id": "e1102-k121",
          "value": [
            "DNA seperation",
            "happens in the",
            "cytoplasm"
          ],
          "config": {
            "subId": "a401-l65",
            "relId": "e1009-v95",
            "objId": "m1206-k129",
            "sourceId": "k1225-d127",
            "targetId": "i1013-z99"
          }
        },
        {
          "id": "a1199-d104",
          "value": [
            "DNA seperation",
            "happens in the",
            "nucleus"
          ],
          "config": {
            "subId": "a401-l65",
            "relId": "e1009-v95",
            "objId": "f1044-e109",
            "sourceId": "k1225-d127",
            "targetId": "e1228-g121"
          }
        },
        {
          "id": "b1278-e27",
          "value": [
            "consumes nutrients",
            "is acquired by",
            "endocytosis"
          ],
          "config": {
            "subId": "b346-i92",
            "relId": "c1381-d41",
            "objId": "e1314-o30",
            "sourceId": "f1363-l44",
            "targetId": "c1110-s54"
          }
        },
        {
          "id": "k608-k75",
          "value": [
            "consumes nutrients",
            "is acquired by",
            "photosynthesis"
          ],
          "config": {
            "subId": "b346-i92",
            "relId": "c1381-d41",
            "objId": "l511-r76",
            "sourceId": "f1363-l44",
            "targetId": "a499-f78"
          }
        },
        {
          "id": "e396-g30",
          "value": [
            "carry out functions",
            "make up",
            "tissues"
          ],
          "config": {
            "subId": "h512-s124",
            "relId": "j400-k9",
            "objId": "l367-d37",
            "sourceId": "a327-p26",
            "targetId": "e212-e43"
          }
        },
        {
          "id": "a696-u52",
          "value": [
            "give structure",
            "with",
            "cell wall"
          ],
          "config": {
            "subId": "l555-j89",
            "relId": "a874-q52",
            "objId": "j723-v48",
            "sourceId": "e837-f43",
            "targetId": "d923-n68"
          }
        },
        {
          "id": "j506-m87",
          "value": [
            "give structure",
            "with",
            "skeletal tissues"
          ],
          "config": {
            "subId": "l555-j89",
            "relId": "a874-q52",
            "objId": "i286-a99",
            "sourceId": "e837-f43",
            "targetId": "c394-e93"
          }
        },
        {
          "id": "g1200-e84",
          "value": [
            "nucleus",
            "is found only in",
            "eukaryotes (true-nucleus)"
          ],
          "config": {
            "subId": "f1044-e109",
            "relId": "g1254-g97",
            "objId": "l896-m102",
            "sourceId": "f1200-e83",
            "targetId": "g894-k97"
          }
        }
      ],
      "settings": {
        "displayResults": true,
        "holdGrades": false,
        "hideScore": false,
        "hideItemResults": false,
        "hideMasterMap": false,
        "instructions": null
      },
      "items": [
        {
          "id": "e882-y95",
          "targetId": "h419-d98",
          "type": "connectTo",
          "config": {
            "correctAnswer": "are important because they",
            "choicesMetadata": {
              "automatedOriginal": [],
              "automatedNotSelected": [],
              "automatedNotSelectedList": [],
              "automatedOriginalList": []
            },
            "choices": [
              "give structure",
              "consumes nutrients",
              "carry out reproduction",
              "carry out functions"
            ],
            "correctLinks": [
              {
                "source": "h419-d98",
                "target": "l555-j89"
              },
              {
                "source": "h419-d98",
                "target": "b346-i92"
              },
              {
                "source": "h419-d98",
                "target": "i1014-a99"
              },
              {
                "source": "h419-d98",
                "target": "h512-s124"
              }
            ],
            "showHint": false,
            "suggestedLinks": {
              "give structure": "a620-w91",
              "consumes nutrients": "d384-u94",
              "carry out reproduction": "g1073-h123",
              "carry out functions": "j547-b113"
            },
            "userLinks": [
              "m949-n38",
              "g401-l58",
              "b409-t40",
              "b752-y40"
            ]
          },
          "styles": {
            "h419-d98": "connectTo",
            "a620-w91": "hidden",
            "d384-u94": "hidden",
            "g1073-h123": "hidden",
            "j547-b113": "hidden"
          }
        },
        {
          "id": "f1231-j70",
          "targetId": "j400-k9",
          "type": "arrowDirection",
          "config": {
            "correctAnswer": "make up",
            "choicesMetadata": {
              "automatedOriginal": [],
              "automatedNotSelected": [],
              "automatedNotSelectedList": [],
              "automatedOriginalList": []
            },
            "choices": [],
            "correctLinks": [
              {
                "source": "j400-k9",
                "target": "l367-d37"
              }
            ],
            "showHint": false,
            "userLinks": [
              "e212-e43"
            ]
          },
          "styles": {
            "e212-e43": "directionless",
            "a327-p26": "directionless"
          }
        },
        {
          "id": "d621-x68",
          "targetId": "l511-r76",
          "type": "dragDrop",
          "config": {
            "correctAnswer": "photosynthesis",
            "choicesMetadata": {
              "automatedOriginal": [],
              "automatedNotSelected": [],
              "automatedNotSelectedList": [],
              "automatedOriginalList": []
            },
            "choices": [],
            "correctLinks": [
              {
                "source": "c1381-d41",
                "target": "l511-r76"
              }
            ],
            "showHint": false,
            "userLinks": [
              "a652-c78"
            ]
          },
          "styles": {
            "l511-r76": "dragDrop",
            "a499-f78": "hidden"
          }
        },
        {
          "id": "l422-g89",
          "targetId": "j723-v48",
          "type": "fillIn",
          "config": {
            "correctAnswer": "cell wall",
            "choicesMetadata": {
              "automatedOriginal": [],
              "automatedNotSelected": [],
              "automatedNotSelectedList": [],
              "automatedOriginalList": []
            },
            "choices": [],
            "correctLinks": [],
            "showHint": false,
            "userAnswer": "cell wall"
          },
          "styles": {
            "j723-v48": "fillIn"
          }
        },
        {
          "id": "a549-d78",
          "targetId": "m1206-k129",
          "type": "multiChoice",
          "config": {
            "correctAnswer": "cytoplasm",
            "choicesMetadata": {
              "automatedOriginal": [],
              "automatedNotSelected": [],
              "automatedNotSelectedList": [],
              "automatedOriginalList": []
            },
            "choices": [
              "b"
            ],
            "correctLinks": [],
            "showHint": false,
            "userAnswer": "cytoplasm"
          },
          "styles": {
            "m1206-k129": "multiChoice"
          }
        },
        {
          "id": "g1083-r97",
          "targetId": "l713-l76",
          "type": "errorDetection",
          "config": {
            "correctAnswer": "are recognized as",
            "choicesMetadata": {
              "automatedOriginal": [],
              "automatedNotSelected": [],
              "automatedNotSelectedList": [],
              "automatedOriginalList": []
            },
            "choices": [
              "b"
            ],
            "correctLinks": [],
            "showHint": false,
            "userAnswer": "are recognized as"
          },
          "styles": {
            "l713-l76": "errorDetection"
          }
        }
      ]
    }
};

// Path to the scorer file that you need to debug
 const scorerUrl = './dist/scorer.js';
//const scorerUrl = './src/scorer/index.js';

// Mock LearnosityAmd object that will be used to transform the scorer into a class that we can use to debug later on
global.LearnosityAmd = {
    define: ([], resolveCallback) => {
        if (!resolveCallback) {
            throw new Error('No callback to resolve Scorer exists');
        }

        const result = resolveCallback();

        if (!result.Scorer) {
            throw new Error('No Scorer class');
        }

        runTest(result.Scorer, questionResponseJson.question, questionResponseJson.response);
    }
};

// Load the Scorer
require(scorerUrl);

function runTest(Scorer, question, response) {
    const scorer = new Scorer(question, response);

    console.log(`
**************
TEST OUTPUT
**************
    `);

    console.log('isValid:', scorer.isValid());
    console.log('validateIndividualResponses:', scorer.validateIndividualResponses());
    console.log('score:', scorer.score());
    console.log('max score:', scorer.maxScore());
}
