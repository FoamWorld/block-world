# 物品
## 属性
属性的值由 `static` 或 `getter` 指定

| 名称 | 含义 |
| :-: | :-: |
| `amount` | 材质的含量 |
| `canuse` | 能否使用 |
| `id` | 辨识符 |
| `material` | 材质（无为 `""`） |
| `stack` | 堆叠数 |
| `text` | 显示的文字 |
| `useonce` | 是否只能用一次 |

## 事件
| 名称 | 含义 |
| :-: | :-: |
| `onuse()` | 使用开始 |
| `onunuse()` | 使用停止（不适用 `useonce = true`） |

## 函数
| 名称 | 含义 |
| :-: | :-: |
| `formblock()` | 成块（不能为 `null`） |
| `observe(d)` | 靠近观察时显示物品 |
| `showit(d)` | 物品栏显示物品 |
| `showita(d)` | 辅助 `showit` |
| `strength(tar)` | 作用于 `tar` 的强度 |
