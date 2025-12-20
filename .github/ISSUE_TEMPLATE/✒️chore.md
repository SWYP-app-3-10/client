---
name: "✒️Chore"
about: 설정, 의존성, 빌드, 스타일 변경
title: ''
labels: ''
assignees: ''

---

name: ✒️ Chore
description: 설정, 의존성, 빌드, 스타일 변경
title: "chore: "
labels: ["chore"]

body:
  - type: textarea
    attributes:
      label: 작업 내용
      placeholder: 예) eslint 설정 수정, 라이브러리 버전 변경
    validations:
      required: true
