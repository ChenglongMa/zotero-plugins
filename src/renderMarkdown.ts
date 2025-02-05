import { Align, getMarkdownTable } from "markdown-table-ts";
import { PluginInfo } from "./plugins";

export async function renderMarkdown(plugins: PluginInfo[]) {
  let body = Array();
  plugins.forEach((plugin) => {
    let name = `[${plugin.name}](https://github.com/${plugin.repo}) </br>`;
    name += `![GitHub Repo stars ${plugin.star}](https://img.shields.io/github/stars/${plugin.repo})`;
    plugin.releases.forEach((release, index) => {
      if (release.assetId == undefined) {
        console.log(`  ${plugin.name} ${release.currentVersion} 不存在`);
        return;
      }

      // let releaseInfo = `[![适配 Zotero ${release.targetZoteroVersion}](https://img.shields.io/badge/Zotero-${release.targetZoteroVersion}-green?&logo=zotero&logoColor=CC2936)](https://www.zotero.org) </br>`;
      // releaseInfo += `![版本 ${release.currentVersion}](https://img.shields.io/badge/版本-${release.targetZoteroVersion}-green) </br>`;
      // releaseInfo += `![发布日期 ${new Date(release.releaseData ?? "").toLocaleString("zh-CN")}](https://img.shields.io/badge/日期-${encodeURI(new Date(release.releaseData ?? "").toLocaleString("zh-CN"))}-green) </br>`;
      // releaseInfo += `![下载量 ${release.downloadCount}](https://img.shields.io/badge/下载量-${release.downloadCount}-green)`;
      let downloadUrl = `<ul>`;
      downloadUrl += `<li>[GitHub](${release.xpiDownloadUrl?.github}) </li>`;
      downloadUrl += `<li>[Gitee](${release.xpiDownloadUrl?.gitee})</li>`;
      downloadUrl += `<li>[GitHub Proxy](${release.xpiDownloadUrl?.ghProxy}) </li>`;
      downloadUrl += `<li>[JsDeliver](${release.xpiDownloadUrl?.jsdeliver}) </li>`;
      downloadUrl += `<li>[KGitHub](${release.xpiDownloadUrl?.kgithub}) </li>`;
      downloadUrl += `</ul>`;

      const row = [
        !index ? name : "",
        !index ? plugin.description : "",
        !index ? `[${plugin.author?.name}](${plugin.author?.url})` : "",
        release.targetZoteroVersion,
        release.currentVersion,
        new Date(release.releaseData ?? "").toLocaleString("zh-CN") +
          `</br>![下载量 ${release.downloadCount}](https://img.shields.io/github/downloads/${plugin.repo}/${release.currentVersion}/total?label=下载量)`,
        // releaseInfo,
        downloadUrl,
      ];
      body.push(row);
    });
  });
  const table = getMarkdownTable({
    table: {
      head: [
        "插件名称",
        "描述",
        "作者",
        "目标 Zotero 版本",
        "插件版本",
        "发布时间",
        // "版本信息",
        "下载链接",
      ],
      body: body,
    },
    alignment: [
      Align.Left,
      Align.Left,
      Align.Center,
      Align.Center,
      Align.Center,
      Align.Center,
      Align.Left,
    ],
  });
  return table;
}
