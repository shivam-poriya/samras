from pydantic import BaseModel, EmailStr, Field, ConfigDict

class UserBase(BaseModel):
    email: EmailStr = Field(..., description="User's unique email address")
    first_name: str = Field(..., min_length=1, max_length=100, description="User's first name")
    last_name: str = Field(..., min_length=1, max_length=100, description="User's last name")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="User's password (minimum 6 characters)")

class UserResponse(UserBase):
    id: int

    # Pydantic V2 configuration to support SQLAlchemy models (former orm_mode = True)
    model_config = ConfigDict(from_attributes=True)

from datetime import date

class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="User's registered email address")
    password: str = Field(..., description="User's password")

class LoginResponse(BaseModel):
    message: str = Field("Login successful", description="Status message")
    user: UserResponse = Field(..., description="User details")

class LoginInitiateResponse(BaseModel):
    message: str = Field("OTP sent to your registered email address.", description="Status message")
    email: EmailStr = Field(..., description="The user email for OTP step verification")

class VerifyOTPRequest(BaseModel):
    email: EmailStr = Field(..., description="User's registered email address")
    otp: str = Field(..., min_length=6, max_length=6, description="6-digit OTP verification code")

class StudentBase(BaseModel):
    new_gr: str = Field(..., description="New G.R. Number")
    old_gr: str = Field(..., description="Old G.R. Number")
    old_new: str = Field(..., description="Old/New Status")
    full_name: str = Field(..., description="Student Full Name")
    dob: str = Field(..., description="Date of Birth")
    city: str = Field(..., description="City")
    taluka: str = Field(..., description="Taluka")
    district: str = Field(..., description="District")
    caste: str = Field(..., description="Caste")
    category: str = Field(..., description="Category")
    block: str = Field(..., description="Block")
    room_no: str = Field(..., description="Room Number")
    last_exam: str = Field(..., description="Last Exam Taken")
    last_exam_year: str = Field(..., description="Last Exam Year")
    percentage: str = Field(..., description="Last Exam Percentage")
    current_year_of_study: str = Field(..., description="Current Year of Study")
    college_name: str = Field(..., description="College Name")
    parents_income: str = Field(..., description="Parents Annual Income")
    student_mobile_number: str = Field(..., description="Student Mobile Number")
    parents_mobile_number: str = Field(..., description="Parents Mobile Number")
    disabled: bool = Field(False, description="Is Student Disabled?")
    father_is_deceased: bool = Field(False, description="Is Student's Father Deceased?")
    orphan: bool = Field(False, description="Is Student an Orphan?")
    curr_date: date = Field(default_factory=date.today, description="Registration Date")
    special_note: str | None = Field(None, description="Special Optional Notes")
    date_of_leaving_the_hostel: date | None = Field(None, description="Hostel Leaving Date (Optional)")

class StudentCreate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)

class StudentStatsResponse(BaseModel):
    total: int = Field(..., description="Total student count")
    disabled: int = Field(..., description="Disabled student count")
    orphan: int = Field(..., description="Orphan student count")

class PaginatedStudentResponse(BaseModel):
    students: list[StudentResponse]
    total: int
    page: int
    limit: int

class StudentUpdate(BaseModel):
    """All fields are optional to allow partial updates."""
    new_gr: str | None = None
    old_gr: str | None = None
    old_new: str | None = None
    full_name: str | None = None
    dob: str | None = None
    city: str | None = None
    taluka: str | None = None
    district: str | None = None
    caste: str | None = None
    category: str | None = None
    block: str | None = None
    room_no: str | None = None
    last_exam: str | None = None
    last_exam_year: str | None = None
    percentage: str | None = None
    current_year_of_study: str | None = None
    college_name: str | None = None
    parents_income: str | None = None
    student_mobile_number: str | None = None
    parents_mobile_number: str | None = None
    disabled: bool | None = None
    father_is_deceased: bool | None = None
    orphan: bool | None = None
    curr_date: date | None = None
    special_note: str | None = None
    date_of_leaving_the_hostel: date | None = None


class ForgotPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="User's registered email address")

class VerifyForgotOTPRequest(BaseModel):
    email: EmailStr = Field(..., description="User's registered email address")
    otp: str = Field(..., min_length=6, max_length=6, description="6-digit OTP code sent to email")

class ResetPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="User's registered email address")
    otp: str = Field(..., min_length=6, max_length=6, description="6-digit OTP code for verification")
    new_password: str = Field(..., min_length=6, description="New password (minimum 6 characters)")
