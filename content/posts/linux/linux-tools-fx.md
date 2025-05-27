---
title: Удобный просмотр JSON в консоле
date: '2022-02-06'
tags: ['linux', 'performance', 'tools']
draft: false
summary: 'Рекомендую когда хочеться поклацать мышкой по json с большой вложенностью'
---

## FX - open source cli json viewer

для установки используйте 
```
npm install -g fx
```

Теперь можете использовать fx через пайп например
```
curl ... | fx
```

или в обычном режиме 
```
fx filename.json
```

Штука удобная в некоторых кейсах. Есть аналог на go (gofx) но я не использовал.

<Image alt="signal" src="/static/images/post-assets/1.gif" width={700} height={500}/>
