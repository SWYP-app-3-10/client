---
name: "\U0001F6E0️Fix"
about: '버그 수정 '
title: ''
labels: ''
assignees: ''

---

name: 🛠️ Bug Fix 
description: 버그 수정
title: "fix: "
labels: ["fix"]

body:
  - type: textarea
    attributes:
      label: 버그 내용
      placeholder: 어떤 문제가 있나요?
    validations:
      required: true

  - type: textarea
    attributes:
      label: 해결 방향
      placeholder: 어떻게 고칠 예정인가요?
    validations:
      required: true
