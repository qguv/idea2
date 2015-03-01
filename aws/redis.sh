#!/usr/bin/env bash

ssh -i key.pem `cat user`@`cat dns` 'echo "Redis awaits input. Type!"; redis-cli'
