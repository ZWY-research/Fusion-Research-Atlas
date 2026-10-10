# 科学图谱数据模型 V0.1

数据文件：`public/data/electron-density.json`。应用经 `import.meta.env.BASE_URL` 加载，不依赖本地绝对路径；运行时与构建前共用 `src/model.ts` 的 Zod 校验。

## 科学对象

| 字段                      | 含义                                                                     |
| ------------------------- | ------------------------------------------------------------------------ |
| id                        | 稳定唯一标识；用于关系端点与 hash 链接                                   |
| label / summary / details | 简称、概要、适用条件与限制                                               |
| kind                      | question / phenomenon / knowledge / hypothesis / evidence / gap / method |
| status                    | example（示例）、hypothesis（待验证假设）、literature（文献背景）        |
| tags                      | 可搜索的关键词                                                           |
| sourceIds                 | 引用 sources 中的来源标识；文献背景必须至少有一条来源                    |
| position                  | 可编辑的初始画布位置，不是科学数值                                       |

## 关系

每条关系记录 id、source、target、relation、label、status、rationale、sourceIds。箭头表示定义的语义方向，不自动代表因果。

| relation       | 语义                            |
| -------------- | ------------------------------- |
| motivates      | 现象引出研究问题                |
| describes      | 证据拟表征对象                  |
| may_explain    | 候选解释；必须标记 hypothesis   |
| requires       | 研究问题或方法需要的对象 / 证据 |
| tests          | 方法拟检验假设或量化缺口        |
| constrains     | 拟对模型或解释施加约束          |
| contextualizes | 提供定义和建模语境              |

状态字段独立于对象类型；evidence 类型不等于已有证据。V0.1 的证据节点全部是明确标记的待获取证据种类。当前 sources 为空，所有节点和关系都是示例或待验证假设，没有已验证实验结论。

校验拒绝重复 ID、悬空端点、未知来源、无来源的文献背景和把 may_explain 标记为非假设的关系；并要求七类对象完整。示例对象不允许借用来源标识来制造文献支持。来源记录含标题、HTTPS URL 与支持范围，来源真实性与支持范围仍需人工审查，结构校验无法证明科学正确性。

## 扩展原则

增加真实材料前完成公开权限、来源与版本审查。每条主张分别核验来源支持范围；不要因论文主题相近就标记为支持。真实实验数据还需扩展测量量、单位、时间窗、误差、条件、处理链及公开许可字段，并升级 schemaVersion 与验证器。当前模型尚不承担定量证据数据库功能。
