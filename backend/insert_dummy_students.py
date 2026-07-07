import requests
import random
from datetime import date

url = "http://localhost:8000/students"

for i in range(1, 11):
    payload = {
        "new_gr": f"NEW-GR-{random.randint(1000, 9999)}",
        "old_gr": f"OLD-GR-{random.randint(100, 999)}",
        "old_new": random.choice(["Old", "New"]),
        "full_name": f"Dummy Student {i}",
        "dob": "2000-01-01",
        "city": random.choice(["Ahmedabad", "Surat", "Vadodara", "Rajkot"]),
        "taluka": "Dummy Taluka",
        "district": "Dummy District",
        "caste": "Dummy Caste",
        "category": random.choice(["General", "OBC", "SC", "ST"]),
        "block": random.choice(["A", "B", "C"]),
        "room_no": str(random.randint(100, 500)),
        "last_exam": "HSC",
        "last_exam_year": str(random.randint(2020, 2024)),
        "percentage": str(round(random.uniform(50.0, 99.9), 2)),
        "current_year_of_study": random.choice(["FY", "SY", "TY"]),
        "college_name": "Dummy Engineering College",
        "parents_income": str(random.randint(100000, 500000)),
        "student_mobile_number": f"9876543{i:03d}",
        "parents_mobile_number": f"9876542{i:03d}",
        "disabled": random.choice([True, False]),
        "father_is_deceased": random.choice([True, False]),
        "orphan": random.choice([True, False]),
        "curr_date": date.today().isoformat(),
        "special_note": "This is a dummy entry.",
        "date_of_leaving_the_hostel": None
    }
    
    response = requests.post(url, json=payload)
    if response.status_code == 201:
        print(f"Successfully added {payload['full_name']}")
    else:
        print(f"Failed to add {payload['full_name']}: {response.text}")
