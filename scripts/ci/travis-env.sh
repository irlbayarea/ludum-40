#!/bin/bash

if [[ -z "${TRAVIS}" ]]; then
  echo "This script can only setup the environment inside of Travis builds"
  exit 1
fi
