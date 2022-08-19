# usefulgit [](<!-- omit in toc -->) ![](https://img.shields.io/badge/platform-%EF%A3%BF-brightgreen)

> git 命令行工具

<br/>

- [Install](#Install)
- [Usage](#Usage)
- [Common command](#Common command)
- [Operation example](#Operation example)
  - [ug recent](#ug-recent)
  - [ug pr](#ug-pr)
  - [ug cleanup](#ug-cleanup)
  - [ug make](#ug-make)
  - [ug checkout](#ug-checkout)

## Install

`npm install --registry usefulgit -g`

<br/>

## Usage

> 可以使用 usefulgit，也可以使用缩写 ug

10 commands are provided:

- `ug recent` View recently submitted branches, sorted by time.
- `ug pr` To merge commit, you need to provide the information of the merged commit. The last commit information is used by default. (if you follow the branch specification, commit log will be spliced with jira ticket id [HR-100010])
- `ug mr` To merge a commit and submit it to a stable branch, you need to provide the information of the merged commit. The last commit information is used by default.
- `ug make` Merge current branch into the release branch。
- `ug cleanup` Clean up uncommitted branches within 3 months (with the natural month as the limit, for example, November cleans up branches before August, that is, July and July. Includes local and remote, excluding `develop, master, production, gray, HEAD, Release/.* `branches)
- `ug new-branch` 创建新的分支 (nb操作，详见wiki:http://confluence2.weipaitang.com/pages/viewpage.action?pageId=312097468)
- `ug home` 在浏览器中打开当前仓库
- `ug root` 切换或查看 git 仓库根目录
- `ug upgrade` 升级 usefulgit
- `ug checkout` 切换到匹配的分支，支持正则匹配，优先完整匹配，优先匹配本地分支，优先匹配最近提交分支，支持 '-' 切换到最近分支
- `ug rebase` 拉取更新并 rebase 分支，默认目标分支为 master
- `ug touch` 创建并将文件添加到暂存区
- `ug fb dev-01` 触发当前仓库 jenkins dev-01 分支构建

具体请查看命令行帮助

<br>

## Common command

```bash
# 合并推送测试分支
ug mk t1

# 重置测试分支
ug mk t1 -n

# 合并推送并触发 jenkins 构建
ug mk dev-01 -fb

# 合并 commit
ug pr master

# rebase master 分支
ug rebase master

# 触发 jenkins 指定仓库构建
ug fb dev-01 -r webApp

# 切换分支
c m
```

## Operation example

### ug recent

![ug recent](https://cdn.weipaitang.com/static/public/202011248363cdca-bb9b-cdcabb9b-316c-5272353e2d91-W1734H1180.gif)

<br>

### ug pr

![ug pr](https://cdn.weipaitang.com/static/public/20201124238d0c54-1d39-0c541d39-b361-2f3082a00496-W1734H1180.gif)

<br>

### ug cleanup

![ug cleanup](https://cdn.weipaitang.com/static/public/202011240c1c0d97-c683-0d97c683-9112-b592793efd7b-W1734H1180.gif)

<br>

### ug make

![ug make](https://cdn.weipaitang.com/static/public/20201124ac1891c3-fa57-91c3fa57-4b55-b0a12715b275-W1734H1180.gif)

### ug checkout

💡 v1.2.5 以上可以使用 `c` 命令来切换分支

![ug checkout](https://cdn.weipaitang.com/static/public/202101112d9ba8b8-e94b-a8b8e94b-baaa-bec2a54485c4-W1272H1020.gif)
