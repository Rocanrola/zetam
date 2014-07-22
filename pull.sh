#!/bin/bash

firstime=false

while test $# -gt 0; do
        case "$1" in
                -ft|--first-time)
                      	firstime=true
                      	shift
                        ;;
                *)
                        break
                        ;;
        esac
done


if [ "$firstime" = true ]; then
 	git submodule update --init --remote --recursive
	git submodule foreach git checkout master
fi

git pull origin HEAD
git submodule foreach git pull origin HEAD