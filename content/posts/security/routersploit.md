---
title: "Routersploit - личный взгляд"
date: 2025-05-07T09:27:36+10:00
draft: false
summary: 'впечатления от использования routersploit'
tags: ['security']
---
# Мой личный опыт использования routersploit
Почитывая книгу одну книгу, увидел инструмент routersploit. Исходники https://github.com/threat9/routersploit/   
Написан на питоне, в момент когда я пронего узнал нормальному запуску мешал открый ишью https://github.com/threat9/routersploit/issues/860  поэтому пришлось доработать напильником. В целом запустил быстро, выбрал цель.
```
use scanners/autopwn
set target <ip>
run
```
Утилита поработала, уязвимостей в моем Mikrotik(router os 6.49.10) не первой свежести кстати, найдено небыло.
Бегло пробежался по списку эксплойтов появилось впечатление что работает только со старыми роутерами и камерами, 
времени на тест 1 цели ушло минуты 2. Если еще разок воспользуюсь дополню информацию, пока впечатления не очень.
