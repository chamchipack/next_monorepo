#!/bin/bash

# 선택을 위한 메뉴 출력
echo "개발모드를 실행할 프로젝트를 선택해주세요:"
echo "1) studio"
echo "2) voca"

# 사용자로부터 입력 받기
read -p "Enter the number (1 or 2): " selection

# 입력 값에 따라 studio 또는 voca workspace 실행
if [ "$selection" -eq 1 ]; then
  echo "Running 'studio' project in dev mode..."
  npm run --workspace=studio dev
elif [ "$selection" -eq 2 ]; then
  echo "Running 'voca' project in dev mode..."
  npm run --workspace=voca dev
else
  echo "Invalid selection. Please choose 1 or 2."
  exit 1
fi
