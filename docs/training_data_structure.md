
```text
apps/backend/app/data/cases.json
apps/backend/app/data/gold_answers.json
```

---

# 1. cases.json：最终题库文件

作用：**给训练页面展示题目用**。

它是一个列表，每一项是一道 NOTAM 训练题。

结构：

```json
[
  {
    "case_id": "knots_light_KZOA_A0001_23",
    "category": "light",
    "source": "knots",
    "original_id": "KZOA_A0001/23",
    "raw_text": "A) KSMF E)SMF RWY 35L ALS U/S",
    "answer_shape": "single_dict"
  }
]
```

字段含义：

```text
case_id
唯一题目 ID，用来关联标准答案。

category
题目类别，比如 light、runway、area。

source
数据来源，比如 knots 或 notam_evolve。

original_id
原始数据里的 ID。如果原数据没有 ID，就用脚本生成的 ID。

raw_text
展示给学生看的原始 NOTAM 文本。

answer_shape
标准答案的结构类型，用来提示前端/批改模块该题答案是什么形态。
```

---

# 2. gold_answers.json：最终标准答案文件

作用：**给标准答案展示和自动批改用**。

它是一个字典，key 是 `case_id`。

结构：

```json
{
  "knots_light_KZOA_A0001_23": {
    "answer_shape": "single_dict",
    "gold_answer_original": {
      "airport": "KSMF",
      "runway": "35L",
      "lightcategory": "ALS",
      "unavailable/downgrade": "unavailable"
    },
    "gold_answer_units": [
      {
        "unit_id": "unit_0",
        "source_path": "",
        "fields": {
          "airport": "KSMF",
          "runway": "35L",
          "lightcategory": "ALS",
          "unavailable/downgrade": "unavailable"
        }
      }
    ]
  }
}
```

字段含义：

```text
answer_shape
答案结构类型，和 cases.json 里的 answer_shape 对应。

gold_answer_original
原始标准答案，保留论文数据原来的标注格式。
主要用于页面展示、教师调试、人工检查。

gold_answer_units
统一后的批改单元列表。
后续 grading_service.py 应该主要比较 student_answer_units 和 gold_answer_units。
```

---

# 3. 两个 JSON 的关系

核心关系是：

```text
cases.json 里的 case_id
        ↓
gold_answers.json 里同名 key
```

例如：

```json
{
  "case_id": "knots_light_KZOA_A0001_23"
}
```

对应：

```json
{
  "knots_light_KZOA_A0001_23": {
    "gold_answer_original": {},
    "gold_answer_units": []
  }
}
```

所以后续代码里一般这样取：

```python
case_id = case["case_id"]
gold_answer = gold_answers[case_id]
```

---

# 4. answer_shape 的几种类型

## single_dict

表示原始答案是一个普通对象：

```json
{
  "airport": "KSMF",
  "runway": "35L"
}
```

统一后 `gold_answer_units` 是：

```json
[
  {
    "unit_id": "unit_0",
    "fields": {
      "airport": "KSMF",
      "runway": "35L"
    }
  }
]
```

常见于 light 类题目。

---

## rows_dict

表示原始答案是：

```json
{
  "rows": [
    {
      "runway": "13"
    },
    {
      "runway": "31"
    }
  ]
}
```

统一后 `gold_answer_units` 是：

```json
[
  {
    "unit_id": "row_0",
    "fields": {
      "runway": "13"
    }
  },
  {
    "unit_id": "row_1",
    "fields": {
      "runway": "31"
    }
  }
]
```

常见于 runway 类题目，因为一条 NOTAM 可能影响多个跑道方向。

---

## list_of_dict

表示原始答案是：

```json
[
  {
    "category": "area",
    "type": "圆",
    "atc": 0,
    "fpl": 0,
    "desc_s": "RADIUS 5NM ON 161918N1004312E"
  }
]
```

统一后 `gold_answer_units` 是：

```json
[
  {
    "unit_id": "item_0",
    "fields": {
      "category": "area",
      "type": "圆",
      "atc": 0,
      "fpl": 0,
      "desc_s": "RADIUS 5NM ON 161918N1004312E"
    }
  }
]
```

常见于 NOTAM-Evolve 的 area 类题目。

---

# 5. 后续使用方式

训练页面显示题目：

```python
cases = load_json("cases.json")
```

学生选择某题后，根据 `case_id` 找标准答案：

```python
golds = load_json("gold_answers.json")

case_id = selected_case["case_id"]
gold = golds[case_id]
```

展示标准答案用：

```python
gold["gold_answer_original"]
```

自动批改用：

```python
gold["gold_answer_units"]
```

---

一句话总结：

```text
cases.json
负责“有什么题、题目原文是什么”。

gold_answers.json
负责“这道题的标准答案是什么、怎么批改”。
```