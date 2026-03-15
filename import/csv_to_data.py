import csv
import datetime
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
STUDENTS_CSV = ROOT / "students.csv"
PROGRESS_CSV = ROOT / "progress.csv"
LEVELS_CSV = ROOT / "levels.csv"
OUTPUT_JS = ROOT.parent / "data.js"


def read_csv(path):
    with path.open("r", encoding="utf-8-sig") as file:
        return list(csv.DictReader(file))


def main():
    students_rows = read_csv(STUDENTS_CSV)
    progress_rows = read_csv(PROGRESS_CSV)
    levels_rows = read_csv(LEVELS_CSV)

    classes = {}
    students = {}

    for row in students_rows:
        class_id = row["class_id"].strip()
        class_name = row["class_name"].strip()
        student_id = row["student_id"].strip()
        student_name = row["student_name"].strip()

        classes.setdefault(class_id, {"id": class_id, "name": class_name, "students": []})
        students[student_id] = {
            "id": student_id,
            "name": student_name,
            "progress": [],
            "levels": [],
            "class_id": class_id,
        }

    for row in progress_rows:
        student_id = row["student_id"].strip()
        if student_id not in students:
            continue
        students[student_id]["progress"].append({
            "book": row["book"].strip(),
            "total": int(row["total"]),
            "done": int(row["done"]),
            "homework": int(row["homework"]),
        })

    for row in levels_rows:
        student_id = row["student_id"].strip()
        if student_id not in students:
            continue
        students[student_id]["levels"].append({
            "week": row["week"].strip(),
            "score": int(row["score"]),
        })

    for student in students.values():
        class_id = student["class_id"]
        class_entry = classes.get(class_id)
        if class_entry:
            class_entry["students"].append({
                "id": student["id"],
                "name": student["name"],
                "progress": student["progress"],
                "levels": student["levels"],
            })

    data = {
        "updatedAt": datetime.date.today().isoformat(),
        "classes": list(classes.values()),
    }

    output = "const STUDENT_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"
    OUTPUT_JS.write_text(output, encoding="utf-8")

    print(f"Wrote {OUTPUT_JS}")


if __name__ == "__main__":
    main()
