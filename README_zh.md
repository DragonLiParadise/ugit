# ugit [](<!-- omit in toc -->) ![](https://img.shields.io/badge/platform-%EF%A3%BF-brightgreen)

> git 命令行工具

<br/>

- [安装](#安装)
- [用法](#用法)
- [常用命令](#常用命令)
- [操作示例](#操作示例)
  - [ug recent](#ug-recent)
  - [ug pr](#ug-pr)
  - [ug cleanup](#ug-cleanup)
  - [ug make](#ug-make)
  - [ug checkout](#ug-checkout)

## 安装

`npm install usefulgit -g`

<br/>

## 用法

> 可以使用 ugit，也可以使用缩写 ug

提供了 10 个命令

- `ug recent` 查看最近提交的分支，按时间排序
- `ug pr` 合并 commit，需要提供合并后 commit 的信息，默认使用最后一个 commit 信息，（如果按照分支规范commit log会拼接上jira ticket id [HR-100010]）
- `ug mr` 合并 commit 并提交到稳定分支，需要提供合并后 commit 的信息，默认使用最后一个 commit 信息
- `ug make` 合并到发布分支
- `ug cleanup` 清理 3 个月未提交的分支，以自然月为界限，如 11 月份清理的是 8 月份之前也就是 7 月份及 7 月份之前的分支（包括本地和远程，不包括 `develop, master, production, gray, HEAD, Release/.* ` 分支）
- `ug nb` 创建新的分支
- `ug home` 在浏览器中打开当前仓库
- `ug root` 切换或查看 git 仓库根目录
- `ug checkout` 切换到匹配的分支，支持正则匹配，优先完整匹配，优先匹配本地分支，优先匹配最近提交分支，支持 '-' 切换到最近分支
- `ug rebase` 拉取更新并 rebase 分支，默认目标分支为 master
- `ug touch` 创建并将文件添加到暂存区

具体请查看命令行帮助

<br>

## 常用命令

```bash
# 合并推送测试分支
ug mk devlop

# 重置测试分支
ug mk devlop -n

# 合并 commit
ug pr master

# rebase master 分支
ug rebase master

# 切换分支
c m
```

## 操作示例

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

💡 也可使用 `c` 命令来切换分支

![ug checkout](https://cdn.weipaitang.com/static/public/202101112d9ba8b8-e94b-a8b8e94b-baaa-bec2a54485c4-W1272H1020.gif)
