---
name: "✨Feature"
about: 새로운 기능 추가
title: ''
labels: ''
assignees: ''

---

name: ✨ Feature (feat)
description: 새로운 기능 추가
title: "feat: "
labels: ["feat"]

body:
  - type: textarea
    attributes:
      label: 기능 설명
      placeholder: 무엇을 추가하나요?
    validations:
      required: true

  - type: textarea
    attributes:
      label: 작업 내용
      placeholder: |
        - [ ] 할 일 1
        - [ ] 할 일 2
    validations:
      required: true
