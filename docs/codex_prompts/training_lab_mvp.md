
你现在要在现有项目基础上完成“智见航语 NOTAM 智能训练室”的前后端改造。

## 一、项目与分支信息

请基于当前分支 `feat/training-mvp` 修改。

本次不是重做整个系统，而是重建训练室页面，并修复训练相关后端接口。

重点文件：

```text
apps/frontend/src/views/TrainingLab.vue
apps/frontend/src/services/training.ts
apps/backend/app/api/routes/training.py
apps/backend/app/services/training_service.py
apps/backend/app/services/training/
apps/backend/app/data/cases.json
apps/backend/app/data/gold_answers.json
apps/backend/app/data/user_records.json
```

## 二、核心目标

我要把 `apps/frontend/src/views/TrainingLab.vue` 直接推翻重建。

但是注意：

1. 不要改全局 App 布局。
    
2. 不要改左侧导航侧边栏。
    
3. 不要改路由结构，除非当前训练页无法访问。
    
4. 训练室只是“智见航语”的一个功能页面。
    
5. 不要引入知识图谱。
    
6. 不要做复杂 RAG。
    
7. 不要做多 Agent。
    
8. 不要前端 mock 数据。
    
9. 如果后端接口不完整，必须补后端接口，由后端返回默认数据。
    
10. 旧接口如果仍然服务训练室功能，就修复；如果不再需要，就删除前端调用，必要时清理后端废弃逻辑。
    

最终训练室有两个页面：

```text
刷题页
错题集页
```

训练室内部顶部居中放两个按钮：

```text
[刷题页] [错题集页]
```

通过这两个按钮切换页面。

## 三、当前数据结构说明

当前最终题库和答案文件是：
这两个json文件会很大，为了避免浪费上下文，我给你描述一下，不要去读具体json文件了。

```text
apps/backend/app/data/cases.json
apps/backend/app/data/gold_answers.json
```

### 1. cases.json

`cases.json` 是题库文件，用于训练页面展示题目。

它是一个数组，每一项是一道 NOTAM 训练题。

示例结构：

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
case_id: 唯一题目 ID，用来关联标准答案
category: 题目类别，比如 light、runway、area
source: 数据来源，比如 knots 或 notam_evolve
original_id: 原始数据里的 ID
raw_text: 展示给学生看的原始 NOTAM 文本
answer_shape: 标准答案的结构类型
```

### 2. gold_answers.json

`gold_answers.json` 是标准答案文件，用于标准答案展示和自动批改。

它是一个字典，key 是 `case_id`。

示例结构：

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

注意：`gold_answers.json` 不是列表，而是字典。

正确读取方式：

```python
gold_answers = load_json("gold_answers.json")
gold_answer = gold_answers[case_id]
```

不要再用：

```python
for answer in gold_answers:
    ...
```

### 3. cases.json 和 gold_answers.json 的关系

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

### 4. answer_shape 类型

当前有三类：

#### single_dict

原始答案是普通对象。

```json
{
  "airport": "KSMF",
  "runway": "35L"
}
```

统一后：

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

#### rows_dict

原始答案是：

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

统一后：

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

#### list_of_dict

原始答案是列表。

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

统一后：

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

### 5. 前后端统一作答结构

学生作答也要统一成：

```json
{
  "case_id": "xxx",
  "student_answer_units": [
    {
      "unit_id": "unit_0",
      "fields": {
        "airport": "KSMF",
        "runway": "35L"
      }
    }
  ]
}
```

后端批改时比较：

```text
student_answer_units vs gold_answer_units
```

不要再用旧的 `student_answer: dict` 作为主要提交结构。

## 四、后端改造要求

### 1. 修复训练路由

检查并修改：

```text
apps/backend/app/api/routes/training.py
```

最终需要提供这些接口：

```text
GET  /api/v1/training/cases
GET  /api/v1/training/cases/{case_id}
POST /api/v1/training/submit
GET  /api/v1/training/mistakes
GET  /api/v1/training/progress
GET  /api/v1/training/profile
```

如果已有旧接口，能复用就修复，不能复用就清理。

### 2. 请求模型

新增或修改 Pydantic 模型：

```python
from typing import Any
from pydantic import BaseModel

class AnswerUnit(BaseModel):
    unit_id: str
    fields: dict[str, Any]

class TrainingSubmission(BaseModel):
    case_id: str
    student_answer_units: list[AnswerUnit]
```

### 3. GET /training/cases

返回题目列表。

返回结构建议：

```json
{
  "cases": [],
  "total": 0
}
```

每个 case 使用 `cases.json` 里的结构：

```json
{
  "case_id": "",
  "category": "",
  "source": "",
  "original_id": "",
  "raw_text": "",
  "answer_shape": ""
}
```

### 4. GET /training/cases/{case_id}

返回单题详情和标准答案。

返回结构建议：

```json
{
  "case": {},
  "gold_answer": {
    "answer_shape": "",
    "gold_answer_original": {},
    "gold_answer_units": []
  }
}
```

注意：

前端可以拿 `gold_answer_units` 生成动态字段表单，但默认不要直接显示标准答案。点击“查看标准答案”或提交后再展示。

### 5. POST /training/submit

请求：

```json
{
  "case_id": "xxx",
  "student_answer_units": [
    {
      "unit_id": "unit_0",
      "fields": {
        "airport": "KSMF"
      }
    }
  ]
}
```

后端流程：

```text
1. 根据 case_id 读取 case
2. 根据 case_id 从 gold_answers.json 读取 gold_answer
3. 调用 grading_service.grade_answer(student_answer_units, gold_answer["gold_answer_units"])
4. 保存作答记录到 user_records.json
5. 如果 score < 100 或 errors 非空，则该记录进入错题集
6. 返回 grading_result、progress、profile、recommended_cases
```

返回结构建议：

```json
{
  "case": {},
  "grading_result": {},
  "record": {},
  "progress": {},
  "profile": {},
  "recommended_cases": []
}
```

### 6. GET /training/mistakes

返回错题记录。

返回结构建议：

```json
{
  "records": []
}
```

错题判定：

```text
score < 100
或 errors.length > 0
```

没有错题时，后端返回空数组，不要让前端 mock。

### 7. GET /training/progress

返回训练进度。

结构：

```json
{
  "total_cases": 0,
  "answered_count": 0,
  "correct_count": 0,
  "mistake_count": 0,
  "average_score": 0,
  "latest_score": null
}
```

没有作答记录时也由后端返回默认值。

### 8. GET /training/profile

返回个人画像。

能力维度固定为：

```text
格式识别
时间解析
地点/设施识别
缩写理解
字段结构化
规则推理
运行影响判断
证据定位
```

返回结构建议：

```json
{
  "abilities": [
    {
      "ability": "时间解析",
      "mastery": 0.72,
      "level": "基本掌握",
      "error_count": 3
    }
  ],
  "weakest_abilities": ["时间解析", "运行影响判断"],
  "recommended_cases": []
}
```

没有作答记录时，后端返回默认画像：

```json
{
  "abilities": [
    {
      "ability": "格式识别",
      "mastery": 1.0,
      "level": "暂无数据",
      "error_count": 0
    }
  ],
  "weakest_abilities": [],
  "recommended_cases": []
}
```

### 9. 新增或修复 grading_service

建议新增：

```text
apps/backend/app/services/training/grading_service.py
```

函数签名：

```python
from typing import Any

def grade_answer(
    student_answer_units: list[dict[str, Any]],
    gold_answer_units: list[dict[str, Any]],
) -> dict[str, Any]:
    ...
```

返回结构：

```json
{
  "case_id": "",
  "total_score": 85,
  "summary": {
    "level": "good",
    "message": "基本正确",
    "error_count": 2,
    "related_abilities": ["时间解析", "运行影响判断"]
  },
  "unit_results": [
    {
      "unit_id": "unit_0",
      "field_results": [
        {
          "field": "airport",
          "student_value": "KSMF",
          "gold_value": "KSMF",
          "score": 100,
          "is_correct": true,
          "error_type": null,
          "message": "正确"
        }
      ]
    }
  ],
  "errors": [
    {
      "field": "runway",
      "error_type": "VALUE_ERROR",
      "message": "字段值与标准答案不一致",
      "ability": "字段结构化"
    }
  ],
  "feedback": [],
  "suggestions": [],
  "student_answer_units": [],
  "gold_answer_units": []
}
```

批改原则：

```text
不要依赖 LLM。
先做规则比较。
支持字段归一化比较。
字符串比较时忽略首尾空格，统一大小写。
空字段判定为 MISSING_FIELD。
字段值不一致判定为 VALUE_ERROR。
时间字段格式问题判定为 TIME_FORMAT_ERROR。
机场、跑道、滑行道、灯光等对象字段错误可判定为 OBJECT_CONFUSION。
运行影响相关字段错误可判定为 IMPACT_ERROR。
证据字段缺失可判定为 EVIDENCE_MISSING。
格式解析失败可判定为 FORMAT_ERROR。
```

错误类型固定：

```text
MISSING_FIELD
VALUE_ERROR
TIME_FORMAT_ERROR
OBJECT_CONFUSION
IMPACT_ERROR
EVIDENCE_MISSING
FORMAT_ERROR
```

错误类型到能力维度映射：

```python
ERROR_TO_ABILITY = {
    "MISSING_FIELD": "字段结构化",
    "VALUE_ERROR": "字段结构化",
    "TIME_FORMAT_ERROR": "时间解析",
    "OBJECT_CONFUSION": "地点/设施识别",
    "IMPACT_ERROR": "运行影响判断",
    "EVIDENCE_MISSING": "证据定位",
    "FORMAT_ERROR": "格式识别",
}
```

### 10. user_records.json

如果不存在，请创建：

```text
apps/backend/app/data/user_records.json
```

初始结构：

```json
{
  "users": {}
}
```

建议记录格式：

```json
{
  "users": {
    "demo_user": [
      {
        "record_id": "uuid",
        "case_id": "xxx",
        "student_answer_units": [],
        "grading_result": {},
        "score": 80,
        "errors": [],
        "created_at": "2026-05-23T12:00:00"
      }
    ]
  }
}
```

目前可以固定使用：

```text
demo_user
```

不需要做登录系统。

## 五、前端改造要求

### 1. 修复 services/training.ts

修改：

```text
apps/frontend/src/services/training.ts
```

这个文件作为训练 API 的唯一封装。

不要在组件里直接写 axios。

类型定义建议：

```ts
export type AnswerShape = "single_dict" | "rows_dict" | "list_of_dict"

export interface TrainingCase {
  case_id: string
  category: string
  source: string
  original_id?: string
  raw_text: string
  answer_shape: AnswerShape
}

export interface AnswerUnit {
  unit_id: string
  source_path?: string
  fields: Record<string, string | number | boolean | null>
}

export interface GoldAnswer {
  answer_shape: AnswerShape
  gold_answer_original: unknown
  gold_answer_units: AnswerUnit[]
}

export interface FieldResult {
  field: string
  student_value: string | number | boolean | null
  gold_value: string | number | boolean | null
  score: number
  is_correct: boolean
  error_type?: string | null
  message?: string
}

export interface UnitResult {
  unit_id: string
  field_results: FieldResult[]
}

export interface GradingError {
  field: string
  error_type: string
  message: string
  ability?: string
}

export interface GradingResult {
  case_id?: string
  total_score: number
  summary?: {
    level: "excellent" | "good" | "partial" | "weak" | string
    message: string
    error_count: number
    related_abilities: string[]
  }
  unit_results: UnitResult[]
  errors: GradingError[]
  feedback: string[]
  suggestions: string[]
  student_answer_units: AnswerUnit[]
  gold_answer_units: AnswerUnit[]
}

export interface TrainingProgress {
  total_cases: number
  answered_count: number
  correct_count: number
  mistake_count: number
  average_score: number
  latest_score: number | null
}

export interface MistakeRecord {
  record_id: string
  case_id: string
  case?: TrainingCase
  student_answer_units: AnswerUnit[]
  grading_result: GradingResult
  score: number
  errors: GradingError[]
  created_at: string
}

export interface AbilityItem {
  ability: string
  mastery: number
  level: string
  error_count: number
}

export interface AbilityProfile {
  abilities: AbilityItem[]
  weakest_abilities: string[]
  recommended_cases: TrainingCase[]
}

export interface SubmitTrainingRequest {
  case_id: string
  student_answer_units: AnswerUnit[]
}
```

API 方法建议：

```ts
export const trainingAPI = {
  listCases,
  getCase,
  submit,
  listMistakes,
  getProgress,
  getProfile,
}
```

接口路径：

```text
GET  /training/cases
GET  /training/cases/{case_id}
POST /training/submit
GET  /training/mistakes
GET  /training/progress
GET  /training/profile
```

注意前端 baseURL 已经是 `/api/v1`，所以这里写 `/training/...` 即可。

### 2. 重建 TrainingLab.vue

重写：

```text
apps/frontend/src/views/TrainingLab.vue
```

要求：

1. 直接推翻旧训练页。
    
2. 但不要动全局左侧导航。
    
3. 不要动全局 App 布局。
    
4. 页面内部顶部居中放两个按钮：刷题页、错题集页。
    
5. 使用 `trainingAPI` 加载后端数据。
    
6. 不使用前端 mock。
    
7. 后端返回空数据时，前端显示空状态。
    
8. 页面风格要和当前项目整体风格保持一致。
    

页面结构：

```text
TrainingLab.vue
├── 页面标题区
│   ├── 智见航语 · NOTAM 智能训练室
│   └── 基于 NOTAM 深层解析的结构化训练与反馈
│
├── 顶部切换栏
│   ├── 刷题页
│   └── 错题集页
│
├── 刷题页
│   ├── QuestionPracticePanel
│   ├── AnswerFeedbackPanel
│   └── TrainingProgressPanel
│
└── 错题集页
    ├── MistakeBookPanel
    ├── AnswerFeedbackPanel
    └── AbilityProfilePanel
```

### 3. 新增训练组件目录

新增目录：

```text
apps/frontend/src/components/training/
```

新增组件：

```text
QuestionPracticePanel.vue
AnswerFeedbackPanel.vue
TrainingProgressPanel.vue
MistakeBookPanel.vue
AbilityProfilePanel.vue
```

### 4. QuestionPracticePanel.vue

职责：

```text
展示当前题目
展示 raw_text
展示 category/source/original_id/answer_shape
根据 gold_answer.gold_answer_units 动态生成字段表单
支持多 AnswerUnit
支持添加答案单元
支持删除答案单元
提交 student_answer_units
提供 JSON 预览，默认折叠
```

不要让学生主要写 JSON。

主作答方式是动态字段表单。

字段来源：

```ts
goldAnswer.gold_answer_units[0].fields
```

如果是多 unit，按每个 unit 显示。

提交 emit：

```ts
submit: [student_answer_units: AnswerUnit[]]
```

其他 emit：

```ts
next-case
```

### 5. AnswerFeedbackPanel.vue

职责：

```text
统一展示批改反馈。
刷题页提交后使用。
错题集详情也复用。
```

props：

```ts
mode: "practice" | "mistake"
result: GradingResult | null
caseItem?: TrainingCase | null
showActions?: boolean
```

emit：

```ts
next
retry
revealGold
```

展示内容：

```text
1. 总览卡片
   - 总分
   - 等级
   - 错误数
   - 涉及能力

2. 字段级批改表
   - 字段
   - 学生答案
   - 标准答案
   - 得分
   - 问题

3. 错误诊断
   - 错误类型
   - 关联字段
   - 说明
   - 能力维度

4. 反馈与建议
   - feedback
   - suggestions

5. 操作按钮
   - 下一题
   - 重新作答
   - 查看标准答案
```

如果 `result` 为空，显示空状态：

```text
提交答案后，这里会展示字段级批改、错误诊断和改进建议。
```

错题页没有选中错题时显示：

```text
点击左侧错题，查看当时的答案、标准答案和诊断反馈。
```

### 6. TrainingProgressPanel.vue

职责：

```text
展示整体刷题进度
```

props：

```ts
progress: TrainingProgress | null
```

展示：

```text
总题数
已完成
正确数
错题数
平均分
最近得分
完成进度条
```

没有数据时显示后端默认值或空状态。

### 7. MistakeBookPanel.vue

职责：

```text
展示错题列表
支持点击单条错题查看详情
支持简单筛选
```

props：

```ts
records: MistakeRecord[]
selectedRecordId?: string
```

emit：

```ts
select: [record: MistakeRecord]
```

每张错题卡显示：

```text
category
original_id
score
错误类型
created_at
raw_text 摘要
```

筛选项：

```text
全部错题
按 category 筛选
按 error_type 筛选
```

没有错题时显示：

```text
暂无错题，完成刷题后这里会自动收集需要复习的题目。
```

### 8. AbilityProfilePanel.vue

职责：

```text
展示个人画像
展示掌握情况
展示推荐题目
```

props：

```ts
profile: AbilityProfile | null
recommendedCases?: TrainingCase[]
```

展示：

```text
掌握情况：
- 能力名称
- mastery 进度条
- level
- error_count

推荐题目：
- category
- source
- raw_text 摘要
- 推荐理由
```

如果没有推荐题目，显示：

```text
暂无推荐题目。完成更多训练后，系统会根据薄弱能力推荐下一题。
```

## 六、TrainingLab.vue 的数据流

页面加载：

```text
onMounted:
1. trainingAPI.listCases()
2. trainingAPI.getProgress()
3. trainingAPI.listMistakes()
4. trainingAPI.getProfile()
```

选择题目：

```text
1. 根据当前 case_id 调 trainingAPI.getCase(case_id)
2. 得到 case + gold_answer
3. 把 gold_answer 传给 QuestionPracticePanel
4. QuestionPracticePanel 动态生成字段表单
```

提交答案：

```text
1. QuestionPracticePanel emit submit
2. TrainingLab.vue 调 trainingAPI.submit({
     case_id,
     student_answer_units
   })
3. 后端返回 grading_result、record、progress、profile、recommended_cases
4. 更新当前 gradingResult
5. 更新 progress
6. 重新拉取 mistakes，或使用返回 record 更新本地列表
7. 更新 profile
8. 更新 recommendedCases
```

切换到错题集页：

```text
1. 显示 MistakeBookPanel
2. 点击错题后 selectedMistake = record
3. 右侧 AnswerFeedbackPanel 复用 selectedMistake.grading_result
4. 下方 AbilityProfilePanel 显示 profile 和 recommended_cases
```

## 七、页面布局建议

刷题页布局：

```text
左侧主区域：
- 当前题目
- 作答表单
- 批改反馈

右侧辅助区域：
- 整体刷题进度
```

错题集页布局：

```text
左侧：
- 错题列表

右侧：
- 错题详情反馈
- 个人画像
```

内部顶栏：

```text
居中按钮：
[刷题页] [错题集页]
```

按钮高亮当前页。

## 八、样式要求

1. 页面要简洁。
    
2. 使用当前项目已有 UI 风格。
    
3. 不要做花哨大屏。
    
4. 卡片式布局即可。
    
5. 字段级批改表要清晰。
    
6. 原始 NOTAM 文本要突出显示，建议用等宽字体或浅色代码块。
    
7. 移动端不是重点，但不能完全崩。
    
8. 不要影响全局左侧导航。
    

## 九、旧接口处理原则

请检查旧训练接口和旧前端调用。

规则：

```text
旧接口如果仍然对应当前训练室需要的功能：
  修复它，使它适配新的 cases.json / gold_answers.json / student_answer_units。

旧接口如果不再需要：
  删除前端调用。
  后端可以保留但不要再被新页面依赖；如果明显废弃，可以清理。
```

特别注意：

1. 不要保留旧的 `student_answer: dict` 为主要提交结构。
    
2. 不要让前端依赖旧的 `airport/object_type/start_time/operational_impact` 类型作为 TrainingCase。
    
3. `TrainingCase` 现在只表示题目信息，不等于标准答案 Schema。
    
4. 标准答案来自 `gold_answers.json`。
    

## 十、默认数据原则

不允许前端 mock。

如果后端没有真实数据，请由后端返回默认数据。

例如：

### progress 默认值

```json
{
  "total_cases": 11510,
  "answered_count": 0,
  "correct_count": 0,
  "mistake_count": 0,
  "average_score": 0,
  "latest_score": null
}
```

`total_cases` 应该从 `cases.json` 实际长度读取，不要写死。

### mistakes 默认值

```json
{
  "records": []
}
```

### profile 默认值

```json
{
  "abilities": [
    {
      "ability": "格式识别",
      "mastery": 1.0,
      "level": "暂无数据",
      "error_count": 0
    }
  ],
  "weakest_abilities": [],
  "recommended_cases": []
}
```

能力维度要包含全部 8 个：

```text
格式识别
时间解析
地点/设施识别
缩写理解
字段结构化
规则推理
运行影响判断
证据定位
```

## 十一、验收标准

请完成后确保：

1. 前端能正常进入训练室页面。
    
2. 左侧全局导航仍然存在。
    
3. 训练室内部有两个切换按钮：刷题页、错题集页。
    
4. 刷题页能从后端加载 cases。
    
5. 选择题目后能从后端加载 case + gold_answer。
    
6. 作答区根据 gold_answer_units 动态生成字段输入框。
    
7. 可以提交 student_answer_units。
    
8. 后端能返回 grading_result。
    
9. 反馈区能展示总分、字段级结果、错误诊断、建议。
    
10. 错题会自动进入错题集。
    
11. 错题集页能显示错题列表。
    
12. 点击错题能复用 AnswerFeedbackPanel 查看详情。
    
13. 个人画像能显示 8 个能力维度的掌握情况。
    
14. 推荐题目由后端返回。
    
15. 前端没有 mock 数据。
    
16. 旧接口如果损坏但仍需要，已经修复。
    
17. 不需要的旧接口调用已经删除。
    
18. TypeScript 无明显类型错误。
    
19. 后端接口能启动。
    
20. 前端能通过 `npm run dev` 正常运行。
    

## 十二、开发顺序建议

请按这个顺序做：

```text
1. 阅读当前 training.py、training_service.py、training.ts、TrainingLab.vue。
2. 确认旧接口哪些还在用。
3. 修复后端数据读取逻辑，尤其是 gold_answers.json 字典读取。
4. 实现 grading_service.py。
5. 修复 /training/submit。
6. 新增 /training/mistakes 和 /training/progress。
7. 修复 /training/profile 默认返回。
8. 修改 frontend services/training.ts 类型和 API 方法。
9. 重建 TrainingLab.vue。
10. 新增 components/training 下的 5 个组件。
11. 联调页面。
12. 检查没有前端 mock。
13. 检查不影响全局布局和左侧导航。
```

## 十三、不要做的事

不要做这些：

```text
不要引入知识图谱。
不要做复杂 RAG。
不要做多 Agent。
不要做 LLM 批改。
不要重构整个项目。
不要改全局侧边栏。
不要改 App.vue 的整体布局。
不要把所有逻辑堆在 TrainingLab.vue。
不要前端写 mock 数据。
不要把 gold_answers.json 当成列表。
不要把 TrainingCase 继续写成旧的统一标准答案 Schema。
```

本次目标是做一个稳定的两周 MVP：

```text
选择 NOTAM 题目
→ 动态结构化作答
→ 提交批改
→ 字段级反馈
→ 自动进入错题集
→ 错题复盘
→ 能力画像
→ 推荐下一题
```
