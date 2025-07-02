#!/bin/sh

set -o errexit
set -o nounset
set -o noglob

asciinema-scripted asciinema/diffdash-demo.asciinema-scripted.yaml

grep -E -v 'vte.shell|johnowennixon|2004l' asciinema/diffdash-demo-crufty.cast > asciinema/diffdash-demo.cast

agg asciinema/diffdash-demo.cast asciinema/diffdash-demo.gif \
  --cols 110 \
  --theme asciinema \
  --font-family 'SauceCodePro Nerd Font Mono' \
  --font-size 18

asciinema play asciinema/diffdash-demo.cast

eog asciinema/diffdash-demo.gif
