#!/usr/bin/env bash

is_build() {
  [[ "${MODE}" = "build" ]]
}

is_lint() {
  [[ "${MODE}" = "lint" ]]
}

is_test() {
  [[ "${MODE}" = "test" ]]
}
