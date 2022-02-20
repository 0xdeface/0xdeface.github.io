---
title: "Стандарт удобной консольки"
date: "2022-01-01"
tags: ['linux', 'performance']
draft: false
summary: "Набор этих компонентов стал для меня стандартом, возвращаться к классическому bash теперь не очень хочется"
---

1. ZSH - совместима с bash, лучше автодополнение и коррекция ошибок
1. Oh My Zsh  - коллекция плагинов тюнит ваш шелл
1. powerlevel10k/powerlevel10k - моя любимая zsh тема
1. https://github.com/junegunn/fzf - fuzzy поиск, очень удобно
1. fzf-tab автодополнение фази поиском

```bash
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="powerlevel10k/powerlevel10k"
plugins=(git fzf-tab zsh-autosuggestions archlinux cp docker fzf gatsby github golang man npm npx)
# BIND
bindkey '^ ' autosuggest-accept
source $ZSH/oh-my-zsh.sh

[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

```