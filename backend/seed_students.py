"""
Direct psycopg2 seed script — inserts 10 realistic dummy students into PostgreSQL.
Run from: backend/
  python seed_students.py
"""
import os
import psycopg2
from datetime import date
from dotenv import load_dotenv
from urllib.parse import urlparse, unquote

load_dotenv()

# Parse the DATABASE_URL from .env
raw_url = os.getenv("DATABASE_URL", "postgresql://postgres:123@localhost:5432/postgres")
# urllib expects postgresql:// but psycopg2 is fine with it
p = urlparse(raw_url)

conn_params = {
    "host": p.hostname,
    "port": p.port or 5432,
    "dbname": p.path.lstrip("/"),
    "user": p.username,
    "password": unquote(p.password) if p.password else "",
}

TODAY = date.today().isoformat()

STUDENTS = [
    ("NG-2024-001", "OG-101", "New",  "Aarav Sharma",    "2002-03-15", "Ahmedabad",    "Daskroi",          "Ahmedabad",    "Brahmin", "General", "A", "101", "HSC", "2022", "87.40", "SY", "L.D. College of Engineering",              "380000", "9876543001", "9876542001", False, False, False, TODAY, "Merit student", None),
    ("NG-2024-002", "OG-102", "Old",  "Priya Patel",     "2001-07-22", "Surat",        "Surat City",       "Surat",        "Patel",   "OBC",     "B", "205", "HSC", "2021", "76.80", "TY", "SVNIT Surat",                              "210000", "9876543002", "9876542002", False, False, False, TODAY, None,           None),
    ("NG-2024-003", "OG-103", "New",  "Ravi Chauhan",    "2003-01-10", "Vadodara",     "Vadodara City",    "Vadodara",     "Chauhan", "SC",      "C", "312", "HSC", "2023", "64.20", "FY", "M.S. University Baroda",                   "95000",  "9876543003", "9876542003", True,  False, False, TODAY, "PH category - wheelchair user", None),
    ("NG-2024-004", "OG-104", "New",  "Sneha Desai",     "2002-11-05", "Rajkot",       "Rajkot City",      "Rajkot",       "Desai",   "General", "A", "118", "HSC", "2022", "92.10", "SY", "Dhirubhai Ambani Institute of IT",         "550000", "9876543004", "9876542004", False, False, False, TODAY, "Rank holder",  None),
    ("NG-2024-005", "OG-105", "Old",  "Mohit Jadav",     "2000-05-30", "Bhavnagar",    "Bhavnagar City",   "Bhavnagar",    "Jadav",   "ST",      "B", "220", "HSC", "2020", "58.50", "TY", "Bhavnagar University",                     "75000",  "9876543005", "9876542005", False, True,  False, TODAY, "Father deceased - needs support", None),
    ("NG-2024-006", "OG-106", "New",  "Kavya Mehta",     "2003-09-18", "Gandhinagar",  "Gandhinagar",      "Gandhinagar",  "Mehta",   "OBC",     "A", "130", "HSC", "2023", "81.30", "FY", "Pandit Deendayal Energy University",       "300000", "9876543006", "9876542006", False, False, False, TODAY, None,           None),
    ("NG-2024-007", "OG-107", "Old",  "Arjun Solanki",   "2001-02-14", "Jamnagar",     "Jamnagar City",    "Jamnagar",     "Solanki", "SC",      "C", "340", "SSC", "2021", "70.00", "SY", "Government Polytechnic Jamnagar",          "120000", "9876543007", "9876542007", False, False, False, TODAY, None,           None),
    ("NG-2024-008", "OG-108", "New",  "Nidhi Trivedi",   "2002-06-25", "Anand",        "Anand City",       "Anand",        "Trivedi", "General", "B", "214", "HSC", "2022", "89.70", "SY", "Anand Agricultural University",            "430000", "9876543008", "9876542008", False, False, False, TODAY, "Agriculture scholarship", None),
    ("NG-2024-009", "OG-109", "New",  "Yash Parmar",     "2003-12-01", "Navsari",      "Navsari City",     "Navsari",      "Parmar",  "ST",      "A", "105", "HSC", "2023", "55.90", "FY", "Veer Narmad South Gujarat University",     "60000",  "9876543009", "9876542009", False, False, True,  TODAY, "Orphan - both parents deceased", None),
    ("NG-2024-010", "OG-110", "Old",  "Pooja Rathod",    "2000-08-08", "Surendranagar","Wadhwan",          "Surendranagar","Rathod",  "OBC",     "C", "321", "HSC", "2020", "67.50", "TY", "Shree Sahajanand College of Computer Science","180000","9876543010","9876542010", False, False, False, TODAY, None, None),
]

INSERT_SQL = """
INSERT INTO students (
    new_gr, old_gr, old_new, full_name, dob, city, taluka, district,
    caste, category, block, room_no, last_exam, last_exam_year, percentage,
    current_year_of_study, college_name, parents_income,
    student_mobile_number, parents_mobile_number,
    disabled, father_is_deceased, orphan,
    curr_date, special_note, date_of_leaving_the_hostel
) VALUES (
    %s, %s, %s, %s, %s, %s, %s, %s,
    %s, %s, %s, %s, %s, %s, %s,
    %s, %s, %s,
    %s, %s,
    %s, %s, %s,
    %s, %s, %s
)
"""

def seed():
    print("[*] Connecting to PostgreSQL...\n")
    conn = psycopg2.connect(**conn_params)
    cur = conn.cursor()
    count = 0
    try:
        for row in STUDENTS:
            cur.execute(INSERT_SQL, row)
            print(f"  [+] Added: {row[3]:<20}  City: {row[5]:<15}  Category: {row[9]}")
            count += 1
        conn.commit()
        print(f"\n[OK] Successfully inserted {count} dummy students into the database.")
    except Exception as e:
        conn.rollback()
        print(f"\n[ERROR] Failed: {e}")
        raise
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    seed()
