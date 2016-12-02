# huiyuanit-ar

自动写徽源esap系统工作日报草稿和提交工作日报。默认提交当前系统时间当月的，截止至今天的日报（草稿），日报的内容可以通过参数修改。使用`-s`参数提交草稿状态的日报。

- 提交之前务必登录到系统中确认草稿是否无误
- 提交草稿时一次只能提交一页，如果有超过10个未提交的草稿，请运行多次直到提示`Nothing to submit`

## Quick Start

```
$ npm install -g huiyuanit-ar
```
```
$ huiyuanit-ar
Options:
  -u, --username    The esap.huiyuanit.com login username             [required]
  -p, --password    The esap.huiyuanit.com login password             [required]
  -s, --submit      Do submit draft                                    [boolean]
  -i, --project-id  The project id                     [required] [default: 144]
  -t, --trip        The trip is true                                   [boolean]
  -c, --city        The trip city, if trip is true                      [string]
  -v, --version     Print the current version                          [boolean]

Missing required arguments: u, p
```

## Sample

```
$ huiyuanit-ar -u <your username> -p <your password>
DRAFT: 2016-12-1 添加成功
DRAFT: 2016-12-2 添加成功
```
```
$ huiyuanit-ar -u <your username> -p <your password> -s
SUBMIT: 382 提交成功！
SUBMIT: 383 提交成功！
```
