# Nature references | Nature 引用

复用 `public/data/electron-density.json` 的来源、sourceId、DOI 与 citation/finding；没有第二套文献数据库。编号只属于当前渲染范围，不写回 JSON，不改变科学核验状态。

## 格式依据 | Format basis

- [Nature 官方格式指南](https://www.nature.com/nature/for-authors/formatting-guide?trk=public_post-text)：首次引用顺序编号、正文上标、期刊名缩写斜体及加粗卷号。
- [官方 Nature CSL](https://github.com/citation-style-language/styles/blob/094133926c5dbc3f91d17619db1ae6dfa4a07fa2/nature.csl) 与 [citeproc-js](https://citeproc-js.readthedocs.io/en/latest/running.html)；直接使用其 bibliography 输出，不重写作者缩写、et al.、页码范围或标点规则。固定资源来源及 SHA-256 在 `src/csl/provenance.json`。
- 补充的 `journalAbbreviation` 来自各 DOI 的 Crossref short-container-title。Phys. Rev. Lett. / Nucl. Fusion。Mordijck 与前两篇使用同一期刊缩写。作者、题名、DOI、ID 和核验状态不变。

## 网站范围 | Website scope

每次选定科学节点或关系，其实际展示的 citation 数组按顺序组成一个独立范围，从 1 开始。相同 sourceId 的不同 finding 共享编号；仅列该范围实际引用的来源。切换对象重新编号，语言切换不改编号。上标跳到本范围 References，文末链接跳转 DOI（无 DOI 时使用已登记来源 URL），原 finding、适用条件和核验标识保留。

Each selected scientific object/relationship is a separate display scope. Its citation-array order is first-use order. Different findings from one source share a number. Only cited sources appear; changing objects creates a new scope. Language changes do not renumber. Superscripts navigate to local References; DOI/source links and original finding/verification details remain available.

## 本地 Markdown 渲染 | Local Markdown rendering

```bash
npm ci
npm run render:references -- docs/literature/examples/citation-example.md citation-example.html
```

输入使用 `[@paper-angioni-2003]` 等稳定标记，输出可直接用浏览器打开的独立 HTML：正文上标、文末 Nature 书目及 DOI。每个输入文件独立编号；重复引用不新增书目。不覆盖输入。不需要网络 DOI 查询；旧文献页无需手动重编序号。

Use stable markers such as `[@paper-angioni-2003]`. Output is standalone HTML with superscript citations, Nature bibliography and DOI links. Each input document numbers independently. Repeated citations reuse numbers. Rendering is offline and does not overwrite input. Existing studies need no manual renumbering.

只有普通 Markdown 文本中的单一标记被处理，代码块、行内代码和转义标记保持原样。暂不提供 Pandoc 的多来源/定位符语法、文献管理界面或 Word 导出；链接/图片标签中的引用标记会报告不支持。未知 sourceId 会报错，CLI 返回非零且不写输出。

Only single-source markers in normal Markdown text are processed; code and escaped syntax remain literal. Pandoc citation clusters/locators, reference-manager UI and Word export are outside this minimal implementation. Markers inside link/image labels are reported as unsupported. Unknown IDs fail with a nonzero CLI exit and no output written.

## 元数据边界 | Metadata boundaries

当前适配已登记的 journal_article，作者格式为原始 initials + family；团队按 collectiveAuthors 原序作为 CSL literal author 追加。因此团队也计入 CSL 的作者数量，六个及以上使用第一作者 et al.。保留全部作者底层顺序，显示截断由官方 CSL 决定。页码/文章号按已有记录输入，CSL 处理范围破折号。

The adapter supports the registered journal articles and their initials-plus-family names. Teams are appended as CSL literal authors in collectiveAuthors order and count towards CSL's six-author et-al threshold. Original author order is retained even when display is abbreviated. CSL formats existing page ranges/article numbers.

缺少可靠期刊缩写、卷或页码、不能解析的姓名，以及未支持的来源类型必须明确报错，不猜测、不查网补造、不改变已核验状态。后续复杂姓名需显式结构化书目元数据后再扩展。不能将成功格式化理解为全文研读或独立验证。

Missing verified journal abbreviations, volumes/pages, ambiguous author names and unsupported source types fail explicitly. No metadata is guessed or fetched during rendering; verification states stay unchanged. Complex names need explicit structured metadata before extending the adapter. Successful formatting does not establish reading or scientific verification.

资源和处理器授权见 [CSL NOTICE](../../src/csl/NOTICE.md)。
