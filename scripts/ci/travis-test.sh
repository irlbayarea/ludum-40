#!/bin/bash

if [[ -z "$TRAVIS" ]]; then
  echo "This script can only run inside of Travis build jobs."
  exit 1
fi

# The script should immediately exit if any command in the script fails.
set -e

echo ""
echo "Building sources and running tests. Running mode: ${MODE}"
echo ""

# Go to project dir
cd $(dirname $0)/../..

# Get commit diff
if [ "$TRAVIS_PULL_REQUEST" = "false" ]; then
  fileDiff=$(git diff --name-only $TRAVIS_COMMIT_RANGE)
else
  fileDiff=$(git diff --name-only $TRAVIS_BRANCH...HEAD)
fi

# Check if tests can be skipped
if [[ ${fileDiff} =~ ^(.*\.md\s*)*$ ]]; then
  echo "Skipping tests since only markdown files changed."
  exit 0
fi

if is_lint; then
  npm run lint
elif is_build; then
  npm run build
elif is_test; then
  npm run test
fi

# Upload coverage results if those are present.
if [ -f dist/coverage/coverage-summary.json ]; then
  npm run coverage
fi
