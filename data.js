const DEFAULT_STUDENT_DATA = {
  updatedAt: "2026-03-10",
  classes: [
    {
      id: "A",
      name: "A반",
      students: [
        {
          id: "seo-yeon",
          name: "서연",
          curriculum: {
            steps: ["기초", "핵심", "적용", "심화", "완성"],
            current: 3
          },
          progress: [
            { book: "기본 개념 1권", total: 120, done: 78, homework: 12 },
            { book: "기본 개념 2권", total: 100, done: 64, homework: 10 },
            { book: "실전 모의 1권", total: 80, done: 52, homework: 6 },
            { book: "실전 모의 2권", total: 90, done: 41, homework: 12 },
            { book: "심화 문제집", total: 110, done: 69, homework: 8 }
          ]
        },
        {
          id: "ji-hoo",
          name: "지후",
          curriculum: {
            steps: ["기초", "핵심", "적용", "심화", "완성"],
            current: 2
          },
          progress: [
            { book: "기본 개념 1권", total: 120, done: 66, homework: 14 },
            { book: "기본 개념 2권", total: 100, done: 58, homework: 12 },
            { book: "실전 모의 1권", total: 80, done: 47, homework: 8 },
            { book: "실전 모의 2권", total: 90, done: 39, homework: 10 },
            { book: "심화 문제집", total: 110, done: 61, homework: 10 }
          ]
        },
        {
          id: "min-jae",
          name: "민재",
          curriculum: {
            steps: ["기초", "핵심", "적용", "심화", "완성"],
            current: 4
          },
          progress: [
            { book: "기본 개념 1권", total: 120, done: 84, homework: 10 },
            { book: "기본 개념 2권", total: 100, done: 70, homework: 9 },
            { book: "실전 모의 1권", total: 80, done: 55, homework: 6 },
            { book: "실전 모의 2권", total: 90, done: 49, homework: 7 },
            { book: "심화 문제집", total: 110, done: 75, homework: 6 }
          ]
        }
      ]
    },
    {
      id: "B",
      name: "B반",
      students: [
        {
          id: "ha-eun",
          name: "하은",
          curriculum: {
            steps: ["기초", "핵심", "적용", "심화", "완성"],
            current: 2
          },
          progress: [
            { book: "기본 개념 1권", total: 120, done: 52, homework: 10 },
            { book: "기본 개념 2권", total: 100, done: 46, homework: 11 },
            { book: "실전 모의 1권", total: 80, done: 33, homework: 9 },
            { book: "실전 모의 2권", total: 90, done: 29, homework: 10 },
            { book: "심화 문제집", total: 110, done: 44, homework: 9 }
          ]
        },
        {
          id: "yoon-seo",
          name: "윤서",
          curriculum: {
            steps: ["기초", "핵심", "적용", "심화", "완성"],
            current: 3
          },
          progress: [
            { book: "기본 개념 1권", total: 120, done: 60, homework: 12 },
            { book: "기본 개념 2권", total: 100, done: 54, homework: 12 },
            { book: "실전 모의 1권", total: 80, done: 40, homework: 8 },
            { book: "실전 모의 2권", total: 90, done: 33, homework: 9 },
            { book: "심화 문제집", total: 110, done: 58, homework: 8 }
          ]
        }
      ]
    }
  ]
};
