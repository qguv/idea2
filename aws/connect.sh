#!/usr/bin/env bash

ssh -ti key.pem `cat user`@`cat dns` "tmux attach || tmux"
