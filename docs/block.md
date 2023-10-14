# 方块
## 属性
属性的值由 `static` 或 `getter` 指定

| 名称 | 含义 |
| :-: | :-: |
| `amount` | 材质的含量 |
| `bk` | 是否可以触发挖掘 |
| `brightness` | 发光亮度 |
| `hasgui` | 是否具有 GUI |
| `hastrans` | 贴图中是否有透明部分 |
| `isBurnable` | 是否可燃 |
| `id` | 辨识符 |
| `isConductable` | 是否可导电 |
| `isRock` | 是否是石 |
| `isWood` | 是否是木 |
| `material` | 材质 |
| `text` | 显示的文字 |
| `tr` | 是否可透光（应包括发光体） |

## 事件
| 名称 | 含义 |
| :-: | :-: |
| `onbegin(x, y)` | 产生时 |
| `onbroken(x, y, args)` | 破坏时 |
| `onend(x, y)` | 结束时 |
| `onguiopen()` | 打开 GUI |
| `onguiclose()` | 关闭 GUI |
| `onlighton()` | *不建议更改 |

## 函数
| 名称 | 含义 |
| :-: | :-: |
| `colbox(x, y)` | 碰撞箱 |
| `drop(args)` | 掉落物 |
| `imgsource()` | 图像资源 |
| `putextra(x, y)` | 放置时额外所为 |
| `show(x, y)` | canvas 显示 |
| `showita(d)` | 物品显示 |
| `update(x, y)` | 更新 |
| `updategui()` | 更新 GUI |
