#!/usr/bin/env bash

is_build() {
  [[ "${MODE}" = "build" ]]
}

is_format() {
  [[ "${MODE}" = "format" ]]
}

is_lint() {
  [[ "${MODE}" = "lint" ]]
}

is_test() {
  [[ "${MODE}" = "test" ]]
}
