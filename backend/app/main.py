import random
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from .models import User, Student
from .schemas import UserCreate, UserResponse, UserLogin, LoginResponse, LoginInitiateResponse, VerifyOTPRequest, StudentCreate, StudentResponse, StudentStatsResponse, PaginatedStudentResponse, StudentUpdate, ForgotPasswordRequest, VerifyForgotOTPRequest, ResetPasswordRequest
from .auth import hash_password, verify_password
from .email import send_otp_email

# Initialize database tables on application startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="User Registration API",
    description="A basic registration API built with FastAPI and PostgreSQL",
    version="1.1.0"  # added forgot-password flow
)

# Configure CORS Middleware to allow requests from the React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://samras-96zh.vercel.app/"],  # Allows all origins for local development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)


@app.get("/", status_code=status.HTTP_200_OK)
def root():
    return {
        "message": "Welcome to the User Registration API!",
        "docs_url": "/docs",
        "redoc_url": "/redoc",
        "status": "healthy"
    }

@app.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Registers a new user inside the PostgreSQL database.
    
    1. Checks if the email is already registered.
    2. Hashes the password using bcrypt.
    3. Stores the user details securely.
    """
    # 1. Check if email is already taken
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )
    
    # 2. Hash the password before storing
    hashed_pwd = hash_password(user.password)
    
    # 3. Create the database record
    new_user = User(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed_pwd
    )
    
    # 4. Save to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@app.post("/login", response_model=LoginInitiateResponse, status_code=status.HTTP_200_OK)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticates a user and initiates the OTP flow.
    
    1. Retrieves the user by email.
    2. Verifies the password using bcrypt.
    3. Generates a 6-digit OTP code, sets its expiry, and saves to database.
    4. Simulates sending the OTP to the registered email address.
    """
    # 1. Retrieve the user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    
    # 2. Check if user exists and password matches
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
        
    # 3. Generate a 6-digit numeric OTP
    otp = f"{random.randint(100000, 999999)}"
    
    # 4. Set OTP and 5 minutes expiry
    user.otp = otp
    user.otp_expiry = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=5)
    db.commit()
    
    # Save OTP to file for automated browser agent testing
    try:
        import os
        otp_dir = r"C:\Users\Acer\.gemini\antigravity-ide\brain\b8fcfc1e-54a9-424c-8d08-2280c36b0af9\browser"
        os.makedirs(otp_dir, exist_ok=True)
        with open(os.path.join(otp_dir, "otp.txt"), "w") as f:
            f.write(otp)
    except Exception as e:
        print(f"Failed to write test OTP file: {e}")
        
    # 5. Send the OTP email via SMTP
    send_otp_email(user.email, otp)
    
    return {
        "message": "OTP sent to your registered email address.",
        "email": user.email
    }

@app.post("/verify-otp", response_model=LoginResponse, status_code=status.HTTP_200_OK)
def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    """
    Verifies the OTP code to log in the user.
    
    1. Retrieves the user by email.
    2. Checks if OTP exists and is correct.
    3. Checks if the OTP is expired.
    4. Clears OTP on success and signs in the user.
    """
    # 1. Retrieve the user by email
    user = db.query(User).filter(User.email == request.email).first()
    
    # 2. Validate session and OTP
    if not user or not user.otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active verification session found or OTP has expired."
        )
        
    if user.otp != request.otp:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid verification code."
        )
        
    # 3. Check expiration
    current_time = datetime.now(timezone.utc).replace(tzinfo=None)
    if user.otp_expiry and user.otp_expiry < current_time:
        # Clear expired OTP
        user.otp = None
        user.otp_expiry = None
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code has expired."
        )
        
    # 4. Clear OTP upon successful verification
    user.otp = None
    user.otp_expiry = None
    db.commit()
    
    return {
        "message": "Login successful",
        "user": user
    }

# --- Forgot Password Flow ---

@app.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Initiates forgot-password OTP flow.
    Generates OTP, stores with 5-min expiry, sends to email.
    Returns generic message regardless of whether email exists.
    """
    user = db.query(User).filter(User.email == request.email).first()
    if user:
        otp = f"{random.randint(100000, 999999)}"
        user.otp = otp
        user.otp_expiry = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=5)
        db.commit()
        send_otp_email(user.email, otp)
    return {"message": "If this email is registered, an OTP has been sent to it."}


@app.post("/verify-forgot-otp", status_code=status.HTTP_200_OK)
def verify_forgot_otp(request: VerifyForgotOTPRequest, db: Session = Depends(get_db)):
    """
    Validates OTP for password reset.
    OTP is kept (not cleared) so /reset-password can re-verify it.
    """
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not user.otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active OTP session found for this email."
        )
    if user.otp != request.otp:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid verification code."
        )
    current_time = datetime.now(timezone.utc).replace(tzinfo=None)
    if user.otp_expiry and user.otp_expiry < current_time:
        user.otp = None
        user.otp_expiry = None
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code has expired. Please request a new one."
        )
    return {"message": "OTP verified successfully. You may now reset your password."}


@app.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Resets user password after re-validating OTP.
    Hashes new password, saves to DB, clears OTP session.
    """
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not user.otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active OTP session found. Please start the forgot-password flow again."
        )
    if user.otp != request.otp:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid verification code."
        )
    current_time = datetime.now(timezone.utc).replace(tzinfo=None)
    if user.otp_expiry and user.otp_expiry < current_time:
        user.otp = None
        user.otp_expiry = None
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code has expired. Please start the forgot-password flow again."
        )
    user.hashed_password = hash_password(request.new_password)
    user.otp = None
    user.otp_expiry = None
    db.commit()
    return {"message": "Password has been reset successfully. You may now log in."}


# --- Student Hostel API Routes ---

@app.post("/students", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    """
    Registers a new student profile in the database.
    """
    db_student = Student(**student.model_dump())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@app.get("/students", response_model=PaginatedStudentResponse)
def get_students(page: int = 1, limit: int = 5, db: Session = Depends(get_db)):
    """
    Lists registered hostel students with pagination.
    """
    if page < 1:
        page = 1
    if limit < 1:
        limit = 5
        
    offset = (page - 1) * limit
    total = db.query(Student).count()
    students = db.query(Student).order_by(Student.id.desc()).offset(offset).limit(limit).all()
    
    return {
        "students": students,
        "total": total,
        "page": page,
        "limit": limit
    }

@app.get("/students/stats", response_model=StudentStatsResponse)
def get_student_statistics(db: Session = Depends(get_db)):
    """
    Returns total statistics (total, disabled, orphan counts).
    """
    total = db.query(Student).count()
    disabled = db.query(Student).filter(Student.disabled == True).count()
    orphan = db.query(Student).filter(Student.orphan == True).count()
    
    return {
        "total": total,
        "disabled": disabled,
        "orphan": orphan
    }

@app.get("/students/search", response_model=PaginatedStudentResponse)
def search_students(
    name: str | None = None, 
    college: str | None = None, 
    city: str | None = None, 
    page: int = 1,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    """
    Searches for students dynamically using Name, College Name, or City filters with pagination.
    """
    if page < 1:
        page = 1
    if limit < 1:
        limit = 5
        
    query = db.query(Student)
    
    if name:
        query = query.filter(Student.full_name.ilike(f"%{name}%"))
    if college:
        query = query.filter(Student.college_name.ilike(f"%{college}%"))
    if city:
        query = query.filter(Student.city.ilike(f"%{city}%"))
        
    total = query.count()
    offset = (page - 1) * limit
    students = query.order_by(Student.id.desc()).offset(offset).limit(limit).all()
    
    return {
        "students": students,
        "total": total,
        "page": page,
        "limit": limit
    }

@app.get("/students/{student_id}", response_model=StudentResponse)
def get_student_by_id(student_id: int, db: Session = Depends(get_db)):
    """
    Retrieves a single student profile by their ID.
    """
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID {student_id} not found."
        )
    return student

@app.put("/students/{student_id}", response_model=StudentResponse)
def update_student(student_id: int, updates: StudentUpdate, db: Session = Depends(get_db)):
    """
    Updates an existing student profile by their ID.
    Only the fields provided in the request body will be updated.
    """
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID {student_id} not found."
        )
    
    # Apply only the fields that were explicitly provided (partial update)
    update_data = updates.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(student, field, value)
    
    db.commit()
    db.refresh(student)
    return student
