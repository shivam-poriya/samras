from datetime import datetime, date
from sqlalchemy import String, DateTime, Boolean, Date, Text
from sqlalchemy.orm import Mapped, mapped_column
from .database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    otp: Mapped[str | None] = mapped_column(String(6), nullable=True)
    otp_expiry: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    new_gr: Mapped[str] = mapped_column(Text, nullable=False)
    old_gr: Mapped[str] = mapped_column(Text, nullable=False)
    old_new: Mapped[str] = mapped_column(Text, nullable=False)
    full_name: Mapped[str] = mapped_column(Text, index=True, nullable=False)
    dob: Mapped[str] = mapped_column(Text, nullable=False)
    city: Mapped[str] = mapped_column(Text, index=True, nullable=False)
    taluka: Mapped[str] = mapped_column(Text, nullable=False)
    district: Mapped[str] = mapped_column(Text, nullable=False)
    caste: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(Text, nullable=False)
    block: Mapped[str] = mapped_column(Text, nullable=False)
    room_no: Mapped[str] = mapped_column(Text, nullable=False)
    last_exam: Mapped[str] = mapped_column(Text, nullable=False)
    last_exam_year: Mapped[str] = mapped_column(Text, nullable=False)
    percentage: Mapped[str] = mapped_column(Text, nullable=False)
    current_year_of_study: Mapped[str] = mapped_column(Text, nullable=False)
    college_name: Mapped[str] = mapped_column(Text, index=True, nullable=False)
    parents_income: Mapped[str] = mapped_column(Text, nullable=False)
    student_mobile_number: Mapped[str] = mapped_column(Text, nullable=False)
    parents_mobile_number: Mapped[str] = mapped_column(Text, nullable=False)
    disabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    father_is_deceased: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    orphan: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    curr_date: Mapped[date] = mapped_column(Date, nullable=False)
    special_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    date_of_leaving_the_hostel: Mapped[date | None] = mapped_column(Date, nullable=True)


