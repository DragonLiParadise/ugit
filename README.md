# ugit [](<!-- omit in toc -->) ![](https://img.shields.io/badge/platform-%EF%A3%BF-brightgreen)

> git Command line tool

## [中文简介](README_zh.md)

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

> You can use `usefulgit` or the acronym `ug`

10 commands are provided:

- `ug recent` View recently submitted branches, sorted by time.
- `ug pr` To merge commit, you need to provide the information of the merged commit. The last commit information is used by default. (if you follow the branch specification, commit log will be spliced with jira ticket id [HR-100010])
- `ug mr` To merge a commit and submit it to a stable branch, you need to provide the information of the merged commit. The last commit information is used by default.
- `ug make` Merge current branch into the release branch。
- `ug cleanup` Clean up uncommitted branches within 3 months (with the natural month as the limit, for example, November cleans up branches before August, that is, July and July. Includes local and remote, excluding `develop, master, production, gray, HEAD, Release/.* `branches)
- `ug new-branch` Create a new branch.
- `ug home` Open the current warehouse in a browser.
- `ug root` Switch or view the root directory of the git repository.
- `ug checkout` Switch to matching branches, support regular matching, give priority to complete matching, give priority to matching local branches, give priority to matching recent submitted branches, and support'- 'switching to nearest branches.
- `ug rebase` Pull updates and rebase branches. The default target branch is master.
- `ug touch` Create and add files to the staging area.

Please check the command line help for details.

<br>

## Common command

```bash
# To merge a commit and submit it to a stable branch, you need to provide the information of the merged commit. The last commit information is used by default.
ug mk t1

# Reset the test branch
ug mk devlop -n

# merger branch
ug mk HR-100010

# pull request commit to master
ug pr master

# rebase master branch
ug rebase master

# switch branch
c HR-1222
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

💡 you can use the `c` command to switch branches

![ug checkout](https://cdn.weipaitang.com/static/public/202101112d9ba8b8-e94b-a8b8e94b-baaa-bec2a54485c4-W1272H1020.gif)
