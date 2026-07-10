import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import {
  Mail, Lock, User, AlertCircle, CheckCircle, ArrowRight, LogOut, Key,
  LayoutDashboard, Users, Search, UserPlus, ShieldAlert, GraduationCap, MapPin, Inbox,
  Info, Calendar, Phone, DollarSign, BookOpen, Layers, Award, Pencil, X, Eye, EyeOff, Download,
  FileText, Upload, Trash2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [view, setView] = useState('login'); // 'login' | 'forgot-password' | 'verify-otp' | 'dashboard'
  const [portalTab, setPortalTab] = useState('dashboard'); // 'dashboard' | 'students' | 'search' | 'register_student' | 'edit_student'
  const [sessionExpired, setSessionExpired] = useState(false); // shown when 2h session auto-expires

  // Auth Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState('email'); // 'email' | 'otp' | 'reset'

  // Show/hide password toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Feedback & Loading
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Student Directory State
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, disabled: 0, orphan: 0 });
  const [studentsPage, setStudentsPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const STUDENTS_LIMIT = 5;

  // Student Registration Form Fields State
  const [newGr, setNewGr] = useState('');
  const [oldGr, setOldGr] = useState('');
  const [oldNew, setOldNew] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [city, setCity] = useState('');
  const [taluka, setTaluka] = useState('');
  const [district, setDistrict] = useState('');
  const [caste, setCaste] = useState('');
  const [category, setCategory] = useState('');
  const [block, setBlock] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [lastExam, setLastExam] = useState('');
  const [lastExamYear, setLastExamYear] = useState('');
  const [percentage, setPercentage] = useState('');
  const [currentYearOfStudy, setCurrentYearOfStudy] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [parentsIncome, setParentsIncome] = useState('');
  const [studentMobileNumber, setStudentMobileNumber] = useState('');
  const [parentsMobileNumber, setParentsMobileNumber] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [fatherIsDeceased, setFatherIsDeceased] = useState(false);
  const [orphan, setOrphan] = useState(false);
  const [currDate, setCurrDate] = useState(new Date().toISOString().split('T')[0]);
  const [specialNote, setSpecialNote] = useState('');
  const [dateOfLeavingTheHostel, setDateOfLeavingTheHostel] = useState('');

  // PDF Upload States
  const [pdfFile, setPdfFile] = useState(null);         // File object
  const [pdfLoading, setPdfLoading] = useState(false);  // parsing in progress
  const [pdfError, setPdfError] = useState('');         // error message
  const [pdfSuccess, setPdfSuccess] = useState(false);  // parse succeeded
  const [isDragOver, setIsDragOver] = useState(false);  // drag hover state
  const pdfInputRef = useRef(null);                     // hidden file input ref

  // Student Search Filters State
  const [searchGr, setSearchGr] = useState('');
  const [searchCollege, setSearchCollege] = useState('');
  const [searchMobile, setSearchMobile] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalMatches, setSearchTotalMatches] = useState(0);

  // Student Detail Modal State
  const [selectedStudent, setSelectedStudent] = useState(null);
  // Edit Student State
  const [editStudentId, setEditStudentId] = useState(null); // Keep ID for backend PUT
  const [editStudentGrInput, setEditStudentGrInput] = useState('');
  const [editStudent, setEditStudent] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  // Edit form fields mirror register fields
  const [editNewGr, setEditNewGr] = useState('');
  const [editOldGr, setEditOldGr] = useState('');
  const [editOldNew, setEditOldNew] = useState('');
  const [editFullName, setEditFullName] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editTaluka, setEditTaluka] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editCaste, setEditCaste] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editBlock, setEditBlock] = useState('');
  const [editRoomNo, setEditRoomNo] = useState('');
  const [editLastExam, setEditLastExam] = useState('');
  const [editLastExamYear, setEditLastExamYear] = useState('');
  const [editPercentage, setEditPercentage] = useState('');
  const [editCurrentYearOfStudy, setEditCurrentYearOfStudy] = useState('');
  const [editCollegeName, setEditCollegeName] = useState('');
  const [editParentsIncome, setEditParentsIncome] = useState('');
  const [editStudentMobileNumber, setEditStudentMobileNumber] = useState('');
  const [editParentsMobileNumber, setEditParentsMobileNumber] = useState('');
  const [editDisabled, setEditDisabled] = useState(false);
  const [editFatherIsDeceased, setEditFatherIsDeceased] = useState(false);
  const [editOrphan, setEditOrphan] = useState(false);
  const [editCurrDate, setEditCurrDate] = useState('');
  const [editSpecialNote, setEditSpecialNote] = useState('');
  const [editDateOfLeavingTheHostel, setEditDateOfLeavingTheHostel] = useState('');

  // Fetch all students from backend with pagination
  const fetchStudents = async (page = 1) => {
    try {
      const response = await fetch(`${API_URL}/students?page=${page}&limit=${STUDENTS_LIMIT}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
        setTotalStudents(data.total || 0);
        setStudentsPage(data.page || 1);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // Fetch stats count from backend
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/students/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // ── Session persistence: restore from localStorage on first mount ──────────
  useEffect(() => {
    const stored = localStorage.getItem('samras_session');
    if (stored) {
      try {
        const { user, expiry } = JSON.parse(stored);
        if (user && expiry && Date.now() < expiry) {
          // Valid session — restore without asking for login again
          setCurrentUser(user);
          setView('dashboard');
          setPortalTab('dashboard');
        } else {
          // Session found but already expired
          localStorage.removeItem('samras_session');
          setSessionExpired(true);
        }
      } catch {
        localStorage.removeItem('samras_session');
      }
    }
  }, []); // runs once on mount

  // ── Session expiry watcher: check every 30 seconds while app is open ──────
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem('samras_session');
      if (!stored) return;
      try {
        const { expiry } = JSON.parse(stored);
        if (expiry && Date.now() >= expiry) {
          // Session has expired — auto-logout
          localStorage.removeItem('samras_session');
          setCurrentUser(null);
          setView('login');
          setPortalTab('dashboard');
          setSessionExpired(true);
        }
      } catch {
        localStorage.removeItem('samras_session');
      }
    }, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Trigger data fetch when logged in
  useEffect(() => {
    if (currentUser) {
      fetchStudents(studentsPage);
      fetchStats();
    }
  }, [currentUser, portalTab, studentsPage]);

  const clearNotifications = () => {
    setError('');
    setSuccess('');
  };

  // Forgot Password Handlers
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    clearNotifications();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong.');
      }
      setSuccess('If this email is registered, an OTP has been sent to it.');
      setForgotStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyForgotOtp = async (e) => {
    e.preventDefault();
    clearNotifications();
    if (forgotOtp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/verify-forgot-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Invalid or expired OTP.');
      }
      setSuccess('OTP verified! Please set your new password.');
      setForgotStep('reset');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    clearNotifications();
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp, new_password: newPassword })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Password reset failed.');
      }
      setSuccess('Password reset successfully! Please sign in with your new password.');
      // Clean up and redirect to login
      setForgotEmail('');
      setForgotOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
      setForgotStep('email');
      setView('login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    clearNotifications();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password.");
      }

      setSuccess("Verification OTP sent to your email!");
      setView('verify-otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerifySubmit = async (e) => {
    e.preventDefault();
    clearNotifications();

    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          otp: otpCode
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Invalid verification code.");
      }

      // ── Persist session to localStorage with 2-hour expiry ────────────────
      const expiry = Date.now() + 2 * 60 * 60 * 1000; // 2 hours from now
      localStorage.setItem('samras_session', JSON.stringify({ user: data.user, expiry }));

      setSessionExpired(false);
      setCurrentUser(data.user);
      setView('dashboard');
      setPortalTab('dashboard');
      setOtpCode('');
      setLoginPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearNotifications();
    // ── Clear persisted session so refresh goes back to login ────────────────
    localStorage.removeItem('samras_session');
    setSessionExpired(false);
    setCurrentUser(null);
    setLoginEmail('');
    setLoginPassword('');
    setView('login');
  };

  // ----- PDF Parsing Handlers -----

  // Apply parsed PDF data to form state; only sets fields that have a value
  const applyPdfData = (data) => {
    if (data.full_name)             setFullName(data.full_name);
    if (data.dob)                   setDob(data.dob);
    if (data.student_mobile_number) setStudentMobileNumber(data.student_mobile_number);
    if (data.city)                  setCity(data.city);
    if (data.taluka)                setTaluka(data.taluka);
    if (data.district)              setDistrict(data.district);
    if (data.caste)                 setCaste(data.caste);
    if (data.category)              setCategory(data.category);
    if (data.college_name)          setCollegeName(data.college_name);
    if (data.current_year_of_study) setCurrentYearOfStudy(data.current_year_of_study);
    if (data.percentage)            setPercentage(data.percentage);
    if (data.parents_income)        setParentsIncome(data.parents_income);
    if (data.old_new)               setOldNew(data.old_new);
    // Boolean flags — always apply (false is a valid value)
    setDisabled(Boolean(data.disabled));
    setOrphan(Boolean(data.orphan));
    setFatherIsDeceased(Boolean(data.father_is_deceased));
  };

  // Reset all PDF state and clear auto-filled fields
  const clearPdf = () => {
    setPdfFile(null);
    setPdfError('');
    setPdfSuccess(false);
    setIsDragOver(false);
    // Reset every auto-filled field back to empty
    setFullName('');
    setDob('');
    setStudentMobileNumber('');
    setCity('');
    setTaluka('');
    setDistrict('');
    setCaste('');
    setCategory('');
    setCollegeName('');
    setCurrentYearOfStudy('');
    setPercentage('');
    setParentsIncome('');
    setOldNew('');
    setDisabled(false);
    setOrphan(false);
    setFatherIsDeceased(false);
    setSpecialNote('');
  };

  // Core upload handler — validates file, calls backend, applies results
  const handlePdfUpload = async (file) => {
    if (!file) return;
    // Validate type
    if (!file.name.toLowerCase().endsWith('.pdf') || file.type && !file.type.includes('pdf')) {
      setPdfError('Invalid file type. Please upload a PDF file.');
      setPdfFile(null);
      setPdfSuccess(false);
      return;
    }
    setPdfFile(file);
    setPdfError('');
    setPdfSuccess(false);
    setPdfLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_URL}/parse-pdf`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to parse PDF.');
      }
      applyPdfData(data);
      setPdfSuccess(true);
    } catch (err) {
      setPdfError(err.message || 'An error occurred while processing the PDF.');
      setPdfSuccess(false);
    } finally {
      setPdfLoading(false);
    }
  };

  // Drag-and-drop event handlers
  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handlePdfUpload(dropped);
  };
  const handleZoneClick = () => {
    if (!pdfFile && pdfInputRef.current) pdfInputRef.current.click();
  };
  const handleFileInputChange = (e) => {
    const picked = e.target.files?.[0];
    if (picked) handlePdfUpload(picked);
    // Reset input so same file can be re-uploaded
    e.target.value = '';
  };

  // Student Registration API Handler
  const handleRegisterStudent = async (e) => {
    e.preventDefault();
    clearNotifications();

    setLoading(true);
    try {
      const payload = {
        new_gr: newGr,
        old_gr: oldGr,
        old_new: oldNew,
        full_name: fullName,
        dob: dob,
        city: city,
        taluka: taluka,
        district: district,
        caste: caste,
        category: category,
        block: block,
        room_no: roomNo,
        last_exam: lastExam,
        last_exam_year: lastExamYear,
        percentage: percentage,
        current_year_of_study: currentYearOfStudy,
        college_name: collegeName,
        parents_income: parentsIncome,
        student_mobile_number: studentMobileNumber,
        parents_mobile_number: parentsMobileNumber,
        disabled: disabled,
        father_is_deceased: fatherIsDeceased,
        orphan: orphan,
        curr_date: currDate,
        special_note: specialNote || null,
        date_of_leaving_the_hostel: dateOfLeavingTheHostel || null
      };

      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to register student.");
      }

      setSuccess(`Student "${fullName}" registered successfully!`);

      // Reset form states
      setNewGr('');
      setOldGr('');
      setOldNew('');
      setFullName('');
      setDob('');
      setCity('');
      setTaluka('');
      setDistrict('');
      setCaste('');
      setCategory('');
      setBlock('');
      setRoomNo('');
      setLastExam('');
      setLastExamYear('');
      setPercentage('');
      setCurrentYearOfStudy('');
      setCollegeName('');
      setParentsIncome('');
      setStudentMobileNumber('');
      setParentsMobileNumber('');
      setDisabled(false);
      setFatherIsDeceased(false);
      setOrphan(false);
      setCurrDate(new Date().toISOString().split('T')[0]);
      setSpecialNote('');
      setDateOfLeavingTheHostel('');
      // Reset PDF upload state too
      setPdfFile(null);
      setPdfError('');
      setPdfSuccess(false);

      // Redirect to list and reset to first page
      setStudentsPage(1);
      setPortalTab('students');
    } catch (err) {
      setError(err.message);
      if (err.message.toLowerCase().includes("already exists")) {
        alert(err.message);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  // Search API fetcher
  const handleSearchSubmit = async (page = 1) => {
    try {
      const queryParams = new URLSearchParams();
      if (searchGr) queryParams.append('gr_number', searchGr);
      if (searchCollege) queryParams.append('college', searchCollege);
      if (searchMobile) queryParams.append('mobile', searchMobile);
      queryParams.append('page', page);
      queryParams.append('limit', STUDENTS_LIMIT);

      const response = await fetch(`${API_URL}/students/search?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.students || []);
        setSearchTotalMatches(data.total || 0);
        setSearchPage(data.page || 1);
      }
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  // Trigger search when page or search tab changes
  useEffect(() => {
    if (currentUser && portalTab === 'search') {
      handleSearchSubmit(searchPage);
    }
  }, [searchPage, portalTab]);

  // Reset page to 1 when filters change (automatically triggers search via searchPage change or direct call)
  useEffect(() => {
    if (searchPage === 1) {
      if (currentUser && portalTab === 'search') {
        handleSearchSubmit(1);
      }
    } else {
      setSearchPage(1);
    }
  }, [searchGr, searchCollege, searchMobile]);

  const clearSearchFilters = () => {
    setSearchGr('');
    setSearchCollege('');
    setSearchMobile('');
    setSearchResults([]);
    setSearchPage(1);
    setSearchTotalMatches(0);
  };

  // Load a student by GR number and populate the edit form
  const fetchStudentByGr = async (gr) => {
    if (!gr) return;
    setEditLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/students/by-gr/${gr}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || `Student with GR #${gr} not found.`);
      }
      setEditStudentId(data.id); // Save the actual database ID for updating later
      setEditStudent(data);
      setEditNewGr(data.new_gr || '');
      setEditOldGr(data.old_gr || '');
      setEditOldNew(data.old_new || '');
      setEditFullName(data.full_name || '');
      setEditDob(data.dob || '');
      setEditCity(data.city || '');
      setEditTaluka(data.taluka || '');
      setEditDistrict(data.district || '');
      setEditCaste(data.caste || '');
      setEditCategory(data.category || '');
      setEditBlock(data.block || '');
      setEditRoomNo(data.room_no || '');
      setEditLastExam(data.last_exam || '');
      setEditLastExamYear(data.last_exam_year || '');
      setEditPercentage(data.percentage || '');
      setEditCurrentYearOfStudy(data.current_year_of_study || '');
      setEditCollegeName(data.college_name || '');
      setEditParentsIncome(data.parents_income || '');
      setEditStudentMobileNumber(data.student_mobile_number || '');
      setEditParentsMobileNumber(data.parents_mobile_number || '');
      setEditDisabled(data.disabled || false);
      setEditFatherIsDeceased(data.father_is_deceased || false);
      setEditOrphan(data.orphan || false);
      setEditCurrDate(data.curr_date || '');
      setEditSpecialNote(data.special_note || '');
      setEditDateOfLeavingTheHostel(data.date_of_leaving_the_hostel || '');
    } catch (err) {
      setError(err.message);
      setEditStudent(null);
    } finally {
      setEditLoading(false);
    }
  };

  // Submit updated student data
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    if (!editStudentId) return;
    clearNotifications();
    setLoading(true);
    try {
      const payload = {
        new_gr: editNewGr,
        old_gr: editOldGr,
        old_new: editOldNew,
        full_name: editFullName,
        dob: editDob,
        city: editCity,
        taluka: editTaluka,
        district: editDistrict,
        caste: editCaste,
        category: editCategory,
        block: editBlock,
        room_no: editRoomNo,
        last_exam: editLastExam,
        last_exam_year: editLastExamYear,
        percentage: editPercentage,
        current_year_of_study: editCurrentYearOfStudy,
        college_name: editCollegeName,
        parents_income: editParentsIncome,
        student_mobile_number: editStudentMobileNumber,
        parents_mobile_number: editParentsMobileNumber,
        disabled: editDisabled,
        father_is_deceased: editFatherIsDeceased,
        orphan: editOrphan,
        curr_date: editCurrDate || null,
        special_note: editSpecialNote || null,
        date_of_leaving_the_hostel: editDateOfLeavingTheHostel || null,
      };

      const response = await fetch(`${API_URL}/students/${editStudentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to update student.');
      }
      // setSuccess(`Student "${data.full_name}" updated successfully!`);
      setSuccess('');
      setEditStudent(data);
      fetchStats();
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      Swal.fire({
        title: 'Updated Successfully!',
        html: `Student <b>${data.full_name}</b>'s profile has been updated.`,
        icon: 'success',
        confirmButtonText: 'Awesome!',
        confirmButtonColor: '#EA580C',
        background: '#FFFFFF',
        color: '#1F2937',
        customClass: {
          popup: 'rounded-xl border border-gray-200 shadow-lg',
          title: 'text-xl font-bold',
          confirmButton: 'rounded-lg px-6 py-2.5 font-semibold transition-all hover:scale-105'
        }
      }).then((result) => {
        if (result.isConfirmed || result.isDismissed) {
          setEditStudent(null);
          // the GR number remains in the input field
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
      
    } catch (err) {
      setError(err.message);
      if (err.message.toLowerCase().includes("already exists")) {
        alert(err.message);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (e, id) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/students/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
           const data = await response.json();
           throw new Error(data.detail || 'Failed to delete student.');
        }

        Swal.fire(
          'Deleted!',
          'Student has been deleted.',
          'success'
        );

        handleSearchSubmit(searchPage);
        fetchStats();
        fetchStudents(studentsPage);
      } catch (err) {
        Swal.fire(
          'Error!',
          err.message,
          'error'
        );
      }
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetch(`${API_URL}/students/export`);
      if (!response.ok) throw new Error('Export failed.');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students_export_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export Excel file. Please try again.');
    }
  };

  const handleExportPdf = async () => {
    try {
      const response = await fetch(`${API_URL}/students/export-pdf`);
      if (!response.ok) throw new Error('PDF Export failed.');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students_export_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to export PDF file. Please try again.');
    }
  };

  return (
    <>
      {/* 1. Login Screen */}
      {view === 'login' && (
        <div className="auth-layout-wrapper">
          <div className="auth-container">
            <h1>Welcome Back</h1>
            <p className="subtitle">Sign in to initialize secure OTP verification</p>

            {sessionExpired && !error && !success && (
              <div className="alert alert-error"><AlertCircle size={18} /> <span>Your session has expired. Please sign in again.</span></div>
            )}
            {error && <div className="alert alert-error"><AlertCircle size={18} /> <span>{error}</span></div>}
            {success && <div className="alert alert-success"><CheckCircle size={18} /> <span>{success}</span></div>}

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <div className="input-container">
                  <input
                    id="login-email"
                    type="email"
                    placeholder="name@domain.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                  <Mail className="input-icon" size={18} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <div className="input-container">
                  <input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    className="has-right-icon"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <span
                    className="input-icon-right"
                    onClick={() => setShowLoginPassword(v => !v)}
                  >
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Authenticating..." : (
                  <>
                    <span>Sign In</span> <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="auth-switch">
              <span className="auth-link" onClick={() => { clearNotifications(); setForgotStep('email'); setView('forgot-password'); }}>Forgot Password?</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Forgot Password Screen (3-step flow) */}
      {view === 'forgot-password' && (
        <div className="auth-layout-wrapper">
          <div className="auth-container">

            {/* Step indicators */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
              {['email', 'otp', 'reset'].map((s, i) => (
                <div key={s} style={{
                  width: 32, height: 32, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', fontWeight: 600,
                  background: forgotStep === s ? 'var(--accent)' : ((['email', 'otp', 'reset'].indexOf(forgotStep) > i) ? 'var(--accent-muted)' : 'var(--surface-2)'),
                  color: forgotStep === s ? '#fff' : 'var(--text-muted)',
                  border: forgotStep === s ? '2px solid var(--accent)' : '2px solid transparent',
                  transition: 'all 0.3s'
                }}>{i + 1}</div>
              ))}
            </div>

            {error && <div className="alert alert-error"><AlertCircle size={18} /> <span>{error}</span></div>}
            {success && <div className="alert alert-success"><CheckCircle size={18} /> <span>{success}</span></div>}

            {/* Step 1: Email */}
            {forgotStep === 'email' && (
              <>
                <h1>Forgot Password</h1>
                <p className="subtitle">Enter your registered email to receive an OTP</p>
                <form onSubmit={handleForgotPasswordSubmit}>
                  <div className="form-group">
                    <label htmlFor="forgot-email">Email Address</label>
                    <div className="input-container">
                      <input
                        id="forgot-email"
                        type="email"
                        placeholder="name@domain.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                      <Mail className="input-icon" size={18} />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}>
                    {loading ? 'Sending OTP...' : (<><span>Send OTP</span> <ArrowRight size={18} /></>)}
                  </button>
                </form>
              </>
            )}

            {/* Step 2: OTP Verification */}
            {forgotStep === 'otp' && (
              <>
                <h1>Enter OTP</h1>
                <p className="subtitle">Enter the 6-digit code sent to <strong>{forgotEmail}</strong></p>
                <form onSubmit={handleVerifyForgotOtp}>
                  <div className="form-group">
                    <label htmlFor="forgot-otp">Verification Code</label>
                    <div className="input-container">
                      <input
                        id="forgot-otp"
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        value={forgotOtp}
                        onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                        required
                        style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.25rem', paddingLeft: '16px' }}
                      />
                      <Key className="input-icon" size={18} style={{ display: forgotOtp ? 'none' : 'block' }} />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}>
                    {loading ? 'Verifying...' : (<><span>Verify OTP</span> <ArrowRight size={18} /></>)}
                  </button>
                </form>
                <div className="auth-switch">
                  <span className="auth-link" onClick={handleForgotPasswordSubmit}>Resend OTP</span>
                </div>
              </>
            )}

            {/* Step 3: New Password */}
            {forgotStep === 'reset' && (
              <>
                <h1>Reset Password</h1>
                <p className="subtitle">Choose a strong new password for your account</p>
                <form onSubmit={handleResetPassword}>
                  <div className="form-group">
                    <label htmlFor="new-password">New Password</label>
                    <div className="input-container">
                      <input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        className="has-right-icon"
                        placeholder="Min 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <span
                        className="input-icon-right"
                        onClick={() => setShowNewPassword(v => !v)}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </span>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirm-new-password">Confirm New Password</label>
                    <div className="input-container">
                      <input
                        id="confirm-new-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="has-right-icon"
                        placeholder="Re-enter new password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                      />
                      <span
                        className="input-icon-right"
                        onClick={() => setShowConfirmPassword(v => !v)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </span>
                    </div>
                  </div>
                  <button type="submit" disabled={loading}>
                    {loading ? 'Resetting...' : (<><span>Reset Password</span> <ArrowRight size={18} /></>)}
                  </button>
                </form>
              </>
            )}

            <div className="auth-switch" style={{ marginTop: '20px' }}>
              <span className="auth-link" onClick={() => { clearNotifications(); setForgotStep('email'); setView('login'); }}>Back to Login</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. OTP Verification Screen */}
      {view === 'verify-otp' && (
        <div className="auth-layout-wrapper">
          <div className="auth-container">
            <h1>OTP Verification</h1>
            <p className="subtitle">Enter the 6-digit verification code sent to <strong>{loginEmail}</strong></p>

            {error && <div className="alert alert-error"><AlertCircle size={18} /> <span>{error}</span></div>}
            {success && <div className="alert alert-success"><CheckCircle size={18} /> <span>{success}</span></div>}

            <form onSubmit={handleOtpVerifySubmit}>
              <div className="form-group">
                <label htmlFor="otp-input">Verification Code</label>
                <div className="input-container">
                  <input
                    id="otp-input"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    required
                    style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.25rem', paddingLeft: '16px' }}
                  />
                  <Key className="input-icon" size={18} style={{ display: otpCode ? 'none' : 'block' }} />
                </div>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Log In"}
              </button>
            </form>

            <div className="auth-switch">
              Did not receive the code?
              <span className="auth-link" onClick={handleLoginSubmit}>Resend code</span>
              <br />
              <span className="auth-link" onClick={() => { clearNotifications(); setView('login'); }} style={{ marginTop: '12px', display: 'inline-block' }}>
                Back to Login
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Portal Dashboard (Sidebar Layout - Matches GitRAG reference) */}
      {view === 'dashboard' && currentUser && (
        <div className="portal-layout">

          {/* Side Navbar */}
          <div className="sidebar">
            <div>
              {/* Brand Logo & Name */}
              <div className="brand-section">
                <div className="brand-logo">H</div>
                <div className="brand-name">HostelHub</div>
              </div>

              {/* Navigation Links */}
              <div className="nav-section-title">Navigation</div>
              <div className="nav-menu">
                <div
                  className={`nav-item ${portalTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => { clearNotifications(); setPortalTab('dashboard'); }}
                >
                  <LayoutDashboard className="nav-icon" size={18} />
                  <span>Dashboard</span>
                </div>

                <div
                  className={`nav-item ${portalTab === 'students' ? 'active' : ''}`}
                  onClick={() => { clearNotifications(); setPortalTab('students'); }}
                >
                  <Users className="nav-icon" size={18} />
                  <span>Students</span>
                </div>

                <div
                  className={`nav-item ${portalTab === 'search' ? 'active' : ''}`}
                  onClick={() => { clearNotifications(); setPortalTab('search'); }}
                >
                  <Search className="nav-icon" size={18} />
                  <span>Search</span>
                </div>

                <div
                  className={`nav-item ${portalTab === 'register_student' ? 'active' : ''}`}
                  onClick={() => { clearNotifications(); setPortalTab('register_student'); }}
                >
                  <UserPlus className="nav-icon" size={18} />
                  <span>Register Student</span>
                </div>

                <div
                  className={`nav-item ${portalTab === 'edit_student' ? 'active' : ''}`}
                  onClick={() => { clearNotifications(); setPortalTab('edit_student'); setEditStudent(null); setEditStudentIdInput(''); setEditStudentId(null); }}
                >
                  <Pencil className="nav-icon" size={18} />
                  <span>Edit Student</span>
                </div>
              </div>
            </div>

            {/* Sidebar Bottom Account Footer */}
            <div className="sidebar-footer">
              <div className="user-profile-widget">
                <div className="user-avatar">
                  {currentUser.first_name[0]?.toUpperCase()}{currentUser.last_name[0]?.toUpperCase()}
                </div>
                <div className="user-info">
                  <div className="user-name">{currentUser.first_name} {currentUser.last_name}</div>
                  <div className="user-email">{currentUser.email}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-signout">
                <LogOut size={16} /> <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Main Area Content */}
          <div className="main-content">

            {/* View A: Dashboard Tab */}
            {portalTab === 'dashboard' && (
              <div>
                <div className="page-header">
                  <div>
                    <h2 className="page-title">Dashboard Overview</h2>
                    <p className="page-description">Overview of hostel occupancies and student profiles</p>
                  </div>
                  <div className="page-header-actions">
                    <button
                      id="export-pdf-btn"
                      onClick={handleExportPdf}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 20px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                        color: '#fff', fontWeight: 600, fontSize: '0.9rem',
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(220,38,38,0.35)',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <Download size={16} /> Export to PDF
                    </button>
                    <button
                      id="export-excel-btn"
                      onClick={handleExportExcel}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 20px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #16a34a, #15803d)',
                        color: '#fff', fontWeight: 600, fontSize: '0.9rem',
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(22,163,74,0.35)',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <Download size={16} /> Export to Excel
                    </button>
                  </div>
                </div>

                {/* 3 Metric Card Boxes (Hostel, Disabled, Orphan counts) */}
                <div className="kpi-grid">
                  <div className="kpi-card">
                    <div className="kpi-details">
                      <span className="kpi-label">Total Students</span>
                      <span className="kpi-value">{stats.total}</span>
                      <span className="kpi-subtext">Currently in Hostel</span>
                    </div>
                    <div className="kpi-icon-wrapper blue">
                      <Users size={24} />
                    </div>
                  </div>

                  <div className="kpi-card">
                    <div className="kpi-details">
                      <span className="kpi-label">Disabled Students</span>
                      <span className="kpi-value">{stats.disabled}</span>
                      <span className="kpi-subtext">Specially abled youth</span>
                    </div>
                    <div className="kpi-icon-wrapper purple">
                      <ShieldAlert size={24} />
                    </div>
                  </div>

                  <div className="kpi-card">
                    <div className="kpi-details">
                      <span className="kpi-label">Orphan Students</span>
                      <span className="kpi-value">{stats.orphan}</span>
                      <span className="kpi-subtext">Supported youths</span>
                    </div>
                    <div className="kpi-icon-wrapper orange">
                      <GraduationCap size={24} />
                    </div>
                  </div>
                </div>

                {/* Quick actions widget section */}
                <div className="dashboard-widget">
                  <h3 className="widget-title">Quick Actions</h3>
                  <div className="quick-actions-list">
                    <div className="action-card" onClick={() => setPortalTab('register_student')}>
                      <div className="action-icon">
                        <UserPlus size={20} />
                      </div>
                      <span className="action-title">Add Student</span>
                      <p className="action-desc">Register a new student into the hostel registry.</p>
                    </div>

                    <div className="action-card" onClick={() => setPortalTab('students')}>
                      <div className="action-icon">
                        <Users size={20} />
                      </div>
                      <span className="action-title">View Directory</span>
                      <p className="action-desc">Browse through the list of currently registered students.</p>
                    </div>

                    <div className="action-card" onClick={handleExportPdf}>
                      <div className="action-icon" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626' }}>
                        <Download size={20} />
                      </div>
                      <span className="action-title">Export to PDF</span>
                      <p className="action-desc">Download all student records as a printable PDF report.</p>
                    </div>

                    <div className="action-card" onClick={handleExportExcel}>
                      <div className="action-icon" style={{ background: 'rgba(22, 163, 74, 0.1)', color: '#16a34a' }}>
                        <Download size={20} />
                      </div>
                      <span className="action-title">Export to Excel</span>
                      <p className="action-desc">Download all student records as a formatted Excel spreadsheet.</p>
                    </div>

                    <div className="action-card" onClick={() => setPortalTab('search')}>
                      <div className="action-icon">
                        <Search size={20} />
                      </div>
                      <span className="action-title">Advanced Search</span>
                      <p className="action-desc">Filter students by name, college, or city parameters.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View B: Students Listing Tab */}
            {portalTab === 'students' && (
              <div>
                <div className="page-header">
                  <h2 className="page-title">Students Directory</h2>
                  <p className="page-description">Complete listing of all registered students in the hostel</p>
                </div>

                {success && <div className="alert alert-success"><CheckCircle size={18} /> <span>{success}</span></div>}

                {students.length === 0 ? (
                  <div className="empty-state">
                    <Inbox className="empty-state-icon" size={48} />
                    <h3>No Students Registered</h3>
                    <p>There are no student profiles found in the database registry. Register one now.</p>
                    <button onClick={() => setPortalTab('register_student')} style={{ width: 'auto', padding: '10px 20px' }}>
                      Register First Student
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="student-table-container">
                      <table className="student-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>College Name</th>
                            <th>City</th>
                            <th>G.R. (New/Old)</th>
                            <th>Contact</th>
                            <th>Disabled?</th>
                            <th>Orphan?</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr
                              key={student.id}
                              onClick={() => setSelectedStudent(student)}
                              style={{ cursor: 'pointer' }}
                              title="Click to view full profile"
                            >
                              <td><strong>#{student.id}</strong></td>
                              <td>
                                <div style={{ fontWeight: 600 }}>{student.full_name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>DOB: {student.dob}</div>
                              </td>
                              <td>
                                <div style={{ fontSize: '0.85rem' }}>{student.college_name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Yr: {student.current_year_of_study}</div>
                              </td>
                              <td>{student.city}</td>
                              <td>
                                <div style={{ fontSize: '0.85rem' }}>New: {student.new_gr}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Old: {student.old_gr || 'N/A'} ({student.old_new})</div>
                              </td>
                              <td>
                                <div style={{ fontSize: '0.85rem' }}>Std: {student.student_mobile_number}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Par: {student.parents_mobile_number}</div>
                              </td>
                              <td>
                                <span className={`status-badge ${student.disabled ? 'yes' : 'no'}`}>
                                  {student.disabled ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td>
                                <span className={`status-badge ${student.orphan ? 'yes' : 'no'}`}>
                                  {student.orphan ? 'Yes' : 'No'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="pagination-controls">
                      <button
                        onClick={() => setStudentsPage(Math.max(1, studentsPage - 1))}
                        disabled={studentsPage === 1}
                      >
                        Previous Page
                      </button>
                      <span className="pagination-info">
                        Page <strong>{studentsPage}</strong> of {Math.ceil(totalStudents / STUDENTS_LIMIT) || 1}
                      </span>
                      <button
                        onClick={() => setStudentsPage(studentsPage + 1)}
                        disabled={studentsPage >= Math.ceil(totalStudents / STUDENTS_LIMIT)}
                      >
                        Next Page
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* View C: Advanced Search Tab */}
            {portalTab === 'search' && (
              <div>
                <div className="page-header">
                  <h2 className="page-title">Search Students</h2>
                  <p className="page-description">Find students by combining GR number, college, and mobile filters</p>
                </div>

                {/* Filter Input Grid */}
                <div className="search-filter-panel">
                  <form onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(); }}>
                    <div className="search-grid">
                      <div className="search-field">
                        <label htmlFor="search-gr">GR Number</label>
                        <div className="search-input-wrapper">
                          <input
                            id="search-gr"
                            type="text"
                            placeholder="e.g. NG-2024-001"
                            value={searchGr}
                            onChange={(e) => setSearchGr(e.target.value)}
                          />
                          <Key className="search-icon" size={16} />
                        </div>
                      </div>

                      <div className="search-field">
                        <label htmlFor="search-college">Search College</label>
                        <div className="search-input-wrapper">
                          <input
                            id="search-college"
                            type="text"
                            placeholder="e.g. Delhi University"
                            value={searchCollege}
                            onChange={(e) => setSearchCollege(e.target.value)}
                          />
                          <GraduationCap className="search-icon" size={16} />
                        </div>
                      </div>

                      <div className="search-field">
                        <label htmlFor="search-mobile">Mobile Number</label>
                        <div className="search-input-wrapper">
                          <input
                            id="search-mobile"
                            type="text"
                            placeholder="e.g. 9876543210"
                            value={searchMobile}
                            onChange={(e) => setSearchMobile(e.target.value)}
                          />
                          <Phone className="search-icon" size={16} />
                        </div>
                      </div>

                      <button className="btn-clear" onClick={clearSearchFilters} type="button">
                        Reset
                      </button>
                    </div>
                  </form>
                </div>

                {/* Filter Results Listing Table */}
                {searchResults.length === 0 ? (
                  <div className="empty-state">
                    <Inbox className="empty-state-icon" size={48} />
                    <h3>No Search Matches</h3>
                    <p>No students match the criteria you entered. Try resetting or adjusting the filters.</p>
                    <button onClick={clearSearchFilters} style={{ width: 'auto', padding: '10px 20px' }}>
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="student-table-container">
                      <table className="student-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>College Name</th>
                            <th>City</th>
                            <th>G.R. (New/Old)</th>
                            <th>Contact</th>
                            <th>Disabled?</th>
                            <th>Orphan?</th>
                            {(searchGr.trim() !== '' || searchCollege.trim() !== '' || searchMobile.trim() !== '') && (
                              <th>Action</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {searchResults.map((student) => (
                            <tr
                              key={student.id}
                              onClick={() => setSelectedStudent(student)}
                              style={{ cursor: 'pointer' }}
                              title="Click to view full profile"
                            >
                              <td><strong>#{student.id}</strong></td>
                              <td>
                                <div style={{ fontWeight: 600 }}>{student.full_name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>DOB: {student.dob}</div>
                              </td>
                              <td>
                                <div style={{ fontSize: '0.85rem' }}>{student.college_name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Yr: {student.current_year_of_study}</div>
                              </td>
                              <td>{student.city}</td>
                              <td>
                                <div style={{ fontSize: '0.85rem' }}>New: {student.new_gr}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Old: {student.old_gr || 'N/A'} ({student.old_new})</div>
                              </td>
                              <td>
                                <div style={{ fontSize: '0.85rem' }}>Std: {student.student_mobile_number}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Par: {student.parents_mobile_number}</div>
                              </td>
                              <td>
                                <span className={`status-badge ${student.disabled ? 'yes' : 'no'}`}>
                                  {student.disabled ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td>
                                <span className={`status-badge ${student.orphan ? 'yes' : 'no'}`}>
                                  {student.orphan ? 'Yes' : 'No'}
                                </span>
                              </td>
                              {(searchGr.trim() !== '' || searchCollege.trim() !== '' || searchMobile.trim() !== '') && (
                                <td>
                                  <button
                                    onClick={(e) => handleDeleteStudent(e, student.id)}
                                    className="btn-danger"
                                    style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <Trash2 size={16} /> Delete
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="pagination-controls">
                      <button
                        onClick={() => setSearchPage(Math.max(1, searchPage - 1))}
                        disabled={searchPage === 1}
                      >
                        Previous Page
                      </button>
                      <span className="pagination-info">
                        Page <strong>{searchPage}</strong> of {Math.ceil(searchTotalMatches / STUDENTS_LIMIT) || 1}
                      </span>
                      <button
                        onClick={() => setSearchPage(searchPage + 1)}
                        disabled={searchPage >= Math.ceil(searchTotalMatches / STUDENTS_LIMIT)}
                      >
                        Next Page
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* View D: Register Student Tab (Real Form with 26 Fields) */}
            {portalTab === 'register_student' && (
              <div>
                <div className="page-header">
                  <h2 className="page-title">Register New <span style={{ color: 'var(--primary)' }}>Student</span></h2>
                  <p className="page-description">Fill out the student's personal, academic, and hostel details</p>
                </div>

                {error && <div className="alert alert-error"><AlertCircle size={18} /> <span>{error}</span></div>}

                <form onSubmit={handleRegisterStudent} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                  {/* ── PDF Upload Section ─────────────────────────────── */}
                  <div className="dashboard-widget" style={{ padding: '24px' }}>
                    <h3 className="widget-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px', marginBottom: '16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={16} style={{ color: 'var(--primary)' }} />
                        Auto-Fill from PDF Application
                      </span>
                    </h3>

                    {/* Hidden file input */}
                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept=".pdf,application/pdf"
                      style={{ display: 'none' }}
                      onChange={handleFileInputChange}
                    />

                    {/* Drop Zone */}
                    <div
                      className={[
                        'pdf-upload-zone',
                        isDragOver ? 'drag-over' : '',
                        pdfSuccess ? 'has-file' : '',
                        pdfError && !pdfLoading ? 'error-state' : '',
                      ].filter(Boolean).join(' ')}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={pdfFile ? undefined : handleZoneClick}
                    >
                      {/* ─ Idle / Drag-over State ─ */}
                      {!pdfLoading && !pdfFile && (
                        <>
                          <div className="pdf-upload-icon">
                            <Upload size={24} />
                          </div>
                          <p className="pdf-upload-title">Drag &amp; Drop your PDF here</p>
                          <p className="pdf-upload-subtitle">
                            Upload the student's Samras application PDF to auto-fill all available fields.<br />
                            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Click to browse</span> or drag the file.
                          </p>
                          {pdfError && <p className="pdf-upload-error"><AlertCircle size={14} style={{ display: 'inline', marginRight: 4 }} />{pdfError}</p>}
                        </>
                      )}

                      {/* ─ Loading State ─ */}
                      {pdfLoading && (
                        <>
                          <div className="pdf-spinner" />
                          <p className="pdf-loading-text">Reading PDF and extracting student data…</p>
                        </>
                      )}

                      {/* ─ Success State ─ */}
                      {!pdfLoading && pdfFile && pdfSuccess && (
                        <>
                          <div className="pdf-upload-icon">
                            <FileText size={24} />
                          </div>
                          <p className="pdf-upload-filename">
                            <CheckCircle size={16} />
                            {pdfFile.name}
                          </p>
                          <p className="pdf-upload-subtitle" style={{ color: 'var(--success)' }}>
                            Student data extracted and form fields populated successfully.
                          </p>
                          <button
                            type="button"
                            className="pdf-remove-btn"
                            onClick={(e) => { e.stopPropagation(); clearPdf(); }}
                          >
                            <Trash2 size={13} /> Remove PDF &amp; Reset Fields
                          </button>
                        </>
                      )}

                      {/* ─ Error after file selected ─ */}
                      {!pdfLoading && pdfFile && !pdfSuccess && (
                        <>
                          <div className="pdf-upload-icon">
                            <AlertCircle size={24} />
                          </div>
                          <p className="pdf-upload-filename" style={{ color: 'var(--error)' }}>
                            {pdfFile.name}
                          </p>
                          <p className="pdf-upload-error">{pdfError}</p>
                          <button
                            type="button"
                            className="pdf-remove-btn"
                            onClick={(e) => { e.stopPropagation(); clearPdf(); }}
                          >
                            <Trash2 size={13} /> Clear &amp; Try Again
                          </button>
                        </>
                      )}
                    </div>

                    {/* Info note when PDF is loaded */}
                    {pdfSuccess && (
                      <div style={{
                        marginTop: '14px',
                        padding: '12px 16px',
                        background: 'rgba(251, 146, 60, 0.08)',
                        border: '1px solid rgba(251, 146, 60, 0.25)',
                        borderRadius: '10px',
                        fontSize: '0.83rem',
                        color: '#fb923c',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        lineHeight: 1.5,
                      }}>
                        <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '1px' }} />
                        <span>
                          Fields highlighted in <strong style={{ color: '#fb923c' }}>amber</strong> require manual entry — they are not present in the uploaded PDF.
                          All auto-filled values can be freely edited before submitting.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Category 1: G.R. Info */}
                  <div className="dashboard-widget" style={{ padding: '24px' }}>
                    <h3 className="widget-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>
                      General Register (G.R.) Details
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
                      {/* NEW GR — manual required */}
                      <div className={`form-group ${pdfSuccess ? 'pdf-manual-highlight' : ''}`}>
                        <label htmlFor="std-newgr" className={pdfSuccess ? 'pdf-manual-label' : ''}>
                          NEW G.R. Number
                          {pdfSuccess && <span className="pdf-manual-badge">Manual</span>}
                        </label>
                        <input
                          id="std-newgr"
                          type="text"
                          placeholder="e.g. GR-2026/05"
                          value={newGr}
                          onChange={(e) => setNewGr(e.target.value)}
                          required
                          style={{ paddingLeft: '16px' }}
                        />
                      </div>
                      {/* OLD GR — manual required */}
                      <div className={`form-group ${pdfSuccess ? 'pdf-manual-highlight' : ''}`}>
                        <label htmlFor="std-oldgr" className={pdfSuccess ? 'pdf-manual-label' : ''}>
                          OLD G.R. Number
                          {pdfSuccess && <span className="pdf-manual-badge">Manual</span>}
                        </label>
                        <input
                          id="std-oldgr"
                          type="text"
                          placeholder="e.g. GR-2025/11"
                          value={oldGr}
                          onChange={(e) => setOldGr(e.target.value)}
                          required
                          style={{ paddingLeft: '16px' }}
                        />
                      </div>
                      {/* Old/New Status — auto-filled */}
                      <div className={`form-group ${pdfSuccess && oldNew ? 'pdf-autofilled' : ''}`}>
                        <label htmlFor="std-oldnew">Old / New Status</label>
                        <input
                          id="std-oldnew"
                          type="text"
                          placeholder="e.g. New Admission"
                          value={oldNew}
                          onChange={(e) => setOldNew(e.target.value)}
                          required
                          style={{ paddingLeft: '16px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category 2: Personal Info */}
                  <div className="dashboard-widget" style={{ padding: '24px' }}>
                    <h3 className="widget-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>
                      Personal & Contact Details
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
                      <div className={`form-group ${pdfSuccess && fullName ? 'pdf-autofilled' : ''}`}>
                        <label htmlFor="std-name">Full Name</label>
                        <input
                          id="std-name"
                          type="text"
                          placeholder="e.g. Rahul Ramesh Sharma"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                      <div className={`form-group ${pdfSuccess && dob ? 'pdf-autofilled' : ''}`}>
                        <label htmlFor="std-dob">Date of Birth</label>
                        <input
                          id="std-dob"
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          required
                        />
                      </div>
                      <div className={`form-group ${pdfSuccess && studentMobileNumber ? 'pdf-autofilled' : ''}`}>
                        <label htmlFor="std-phone">Student Mobile Number</label>
                        <input
                          id="std-phone"
                          type="text"
                          placeholder="e.g. 9876543210"
                          value={studentMobileNumber}
                          onChange={(e) => setStudentMobileNumber(e.target.value)}
                          required
                        />
                      </div>
                      {/* Parents Mobile — manual required */}
                      <div className={`form-group ${pdfSuccess ? 'pdf-manual-highlight' : ''}`}>
                        <label htmlFor="std-pphone" className={pdfSuccess ? 'pdf-manual-label' : ''}>
                          Parents Mobile Number
                          {pdfSuccess && <span className="pdf-manual-badge">Manual</span>}
                        </label>
                        <input
                          id="std-pphone"
                          type="text"
                          placeholder="e.g. 9876500000"
                          value={parentsMobileNumber}
                          onChange={(e) => setParentsMobileNumber(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category 3: Address & Demographics */}
                  <div className="dashboard-widget" style={{ padding: '24px' }}>
                    <h3 className="widget-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>
                      Address & Caste Demographics
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
                      <div className={`form-group ${pdfSuccess && city ? 'pdf-autofilled' : ''}`}>
                        <label htmlFor="std-city">City / Village</label>
                        <input
                          id="std-city"
                          type="text"
                          placeholder="e.g. Pune"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                        />
                      </div>
                      <div className={`form-group ${pdfSuccess && taluka ? 'pdf-autofilled' : ''}`}>
                        <label htmlFor="std-taluka">Taluka</label>
                        <input
                          id="std-taluka"
                          type="text"
                          placeholder="e.g. Haveli"
                          value={taluka}
                          onChange={(e) => setTaluka(e.target.value)}
                          required
                          style={{ paddingLeft: '16px' }}
                        />
                      </div>
                      <div className={`form-group ${pdfSuccess && district ? 'pdf-autofilled' : ''}`}>
                        <label htmlFor="std-district">District</label>
                        <input
                          id="std-district"
                          type="text"
                          placeholder="e.g. Pune"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          required
                          style={{ paddingLeft: '16px' }}
                        />
                      </div>
                      <div className={`form-group ${pdfSuccess && caste ? 'pdf-autofilled' : ''}`} style={{ gridColumn: 'span 2' }}>
                        <label htmlFor="std-caste">Caste</label>
                        <input
                          id="std-caste"
                          type="text"
                          placeholder="e.g. Maratha"
                          value={caste}
                          onChange={(e) => setCaste(e.target.value)}
                          required
                          style={{ paddingLeft: '16px' }}
                        />
                      </div>
                      <div className={`form-group ${pdfSuccess && category ? 'pdf-autofilled' : ''}`}>
                        <label htmlFor="std-category">Category</label>
                        <input
                          id="std-category"
                          type="text"
                          placeholder="e.g. General / OBC / SC"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          required
                          style={{ paddingLeft: '16px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category 4: Academics */}
                  <div className="dashboard-widget" style={{ padding: '24px' }}>
                    <h3 className="widget-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>
                      Academic Information
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
                      <div className={`form-group ${pdfSuccess && collegeName ? 'pdf-autofilled' : ''}`} style={{ gridColumn: 'span 2' }}>
                        <label htmlFor="std-college">College Name</label>
                        <input
                          id="std-college"
                          type="text"
                          placeholder="e.g. Fergusson College, Pune"
                          value={collegeName}
                          onChange={(e) => setCollegeName(e.target.value)}
                          required
                        />
                      </div>
                      <div className={`form-group ${pdfSuccess && currentYearOfStudy ? 'pdf-autofilled' : ''}`}>
                        <label htmlFor="std-year">Current Year of Study</label>
                        <input
                          id="std-year"
                          type="text"
                          placeholder="e.g. 3"
                          value={currentYearOfStudy}
                          onChange={(e) => setCurrentYearOfStudy(e.target.value)}
                          required
                        />
                      </div>
                      {/* Last Exam — manual required */}
                      <div className={`form-group ${pdfSuccess ? 'pdf-manual-highlight' : ''}`}>
                        <label htmlFor="std-lastexam" className={pdfSuccess ? 'pdf-manual-label' : ''}>
                          Last Exam Taken
                          {pdfSuccess && <span className="pdf-manual-badge">Manual</span>}
                        </label>
                        <input
                          id="std-lastexam"
                          type="text"
                          placeholder="e.g. FY B.Sc Semester 2"
                          value={lastExam}
                          onChange={(e) => setLastExam(e.target.value)}
                          required
                        />
                      </div>
                      {/* Last Exam Year — manual required */}
                      <div className={`form-group ${pdfSuccess ? 'pdf-manual-highlight' : ''}`}>
                        <label htmlFor="std-lastexamyr" className={pdfSuccess ? 'pdf-manual-label' : ''}>
                          Last Exam Year
                          {pdfSuccess && <span className="pdf-manual-badge">Manual</span>}
                        </label>
                        <input
                          id="std-lastexamyr"
                          type="text"
                          placeholder="e.g. 2025"
                          value={lastExamYear}
                          onChange={(e) => setLastExamYear(e.target.value)}
                          required
                        />
                      </div>
                      <div className={`form-group ${pdfSuccess && percentage ? 'pdf-autofilled' : ''}`}>
                        <label htmlFor="std-percentage">Percentage Obtained</label>
                        <input
                          id="std-percentage"
                          type="text"
                          placeholder="e.g. 78.5%"
                          value={percentage}
                          onChange={(e) => setPercentage(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category 5: Room & Income */}
                  <div className="dashboard-widget" style={{ padding: '24px' }}>
                    <h3 className="widget-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>
                      Hostel Placement & Income Details
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
                      {/* Block — manual required */}
                      <div className={`form-group ${pdfSuccess ? 'pdf-manual-highlight' : ''}`}>
                        <label htmlFor="std-block" className={pdfSuccess ? 'pdf-manual-label' : ''}>
                          Block
                          {pdfSuccess && <span className="pdf-manual-badge">Manual</span>}
                        </label>
                        <input
                          id="std-block"
                          type="text"
                          placeholder="e.g. Block A"
                          value={block}
                          onChange={(e) => setBlock(e.target.value)}
                          required
                          style={{ paddingLeft: '16px' }}
                        />
                      </div>
                      {/* Room Number — manual required */}
                      <div className={`form-group ${pdfSuccess ? 'pdf-manual-highlight' : ''}`}>
                        <label htmlFor="std-room" className={pdfSuccess ? 'pdf-manual-label' : ''}>
                          Room Number
                          {pdfSuccess && <span className="pdf-manual-badge">Manual</span>}
                        </label>
                        <input
                          id="std-room"
                          type="text"
                          placeholder="e.g. Room 204"
                          value={roomNo}
                          onChange={(e) => setRoomNo(e.target.value)}
                          required
                          style={{ paddingLeft: '16px' }}
                        />
                      </div>
                      <div className={`form-group ${pdfSuccess && parentsIncome ? 'pdf-autofilled' : ''}`}>
                        <label htmlFor="std-income">Parents Annual Income</label>
                        <input
                          id="std-income"
                          type="text"
                          placeholder="e.g. Rs. 1,20,000"
                          value={parentsIncome}
                          onChange={(e) => setParentsIncome(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category 6: Support Toggles */}
                  <div className="dashboard-widget" style={{ padding: '24px' }}>
                    <h3 className="widget-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>
                      Hostel Support Eligibility Toggles
                    </h3>
                    <div className="toggle-switch-container" style={{ margin: '16px 0 0 0' }}>
                      <div
                        className={`toggle-item ${disabled ? 'checked' : ''}`}
                        onClick={() => setDisabled(!disabled)}
                      >
                        <div className="checkbox-custom">
                          {disabled && <CheckCircle size={14} color="white" />}
                        </div>
                        <span className="toggle-label">Is Disabled</span>
                      </div>

                      <div
                        className={`toggle-item ${fatherIsDeceased ? 'checked' : ''}`}
                        onClick={() => setFatherIsDeceased(!fatherIsDeceased)}
                      >
                        <div className="checkbox-custom">
                          {fatherIsDeceased && <CheckCircle size={14} color="white" />}
                        </div>
                        <span className="toggle-label">Father is Deceased</span>
                      </div>

                      <div
                        className={`toggle-item ${orphan ? 'checked' : ''}`}
                        onClick={() => setOrphan(!orphan)}
                      >
                        <div className="checkbox-custom">
                          {orphan && <CheckCircle size={14} color="white" />}
                        </div>
                        <span className="toggle-label">Is Orphan</span>
                      </div>
                    </div>
                  </div>

                  {/* Category 7: Date & Optional Note */}
                  <div className="dashboard-widget" style={{ padding: '24px' }}>
                    <h3 className="widget-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>
                      Registration Date & Extra Information
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
                      <div className="form-group">
                        <label htmlFor="std-currdate">Registration Date (Today)</label>
                        <input
                          id="std-currdate"
                          type="date"
                          value={currDate}
                          onChange={(e) => setCurrDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="std-leavedate">Hostel Leaving Date (Optional)</label>
                        <input
                          id="std-leavedate"
                          type="date"
                          value={dateOfLeavingTheHostel}
                          onChange={(e) => setDateOfLeavingTheHostel(e.target.value)}
                        />
                      </div>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label htmlFor="std-note">Special Notes (Optional)</label>
                        <textarea
                          id="std-note"
                          placeholder="e.g. Any special medical condition or guardian info..."
                          value={specialNote}
                          onChange={(e) => setSpecialNote(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '14px 16px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1.5px solid var(--border-card)',
                            border_radius: '12px',
                            color: 'var(--text-primary)',
                            fontFamily: 'var(--font-family)',
                            fontSize: '1rem',
                            height: '100px',
                            resize: 'none',
                            outline: 'none',
                            transition: 'var(--transition-smooth)'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} style={{ padding: '16px' }}>
                    {loading ? "Registering Student..." : "Register Student Hostel Profile"}
                  </button>
                </form>
              </div>
            )}

            {/* View E: Edit Student Tab */}
            {portalTab === 'edit_student' && (
              <div>
                <div className="page-header">
                  <h2 className="page-title">Edit Student Details</h2>
                  <p className="page-description">Search for a student by their GR Number, then update their information</p>
                </div>



                {/* Step 1: GR Lookup */}
                <div className="dashboard-widget" style={{ padding: '24px', marginBottom: '24px' }}>
                  <h3 className="widget-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>
                    Step 1 — Find Student by GR Number
                  </h3>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', marginTop: '16px' }}>
                    <div className="form-group" style={{ marginBottom: 0, flexGrow: 1 }}>
                      <label htmlFor="edit-student-gr">Student GR Number</label>
                      <input
                        id="edit-student-gr"
                        type="text"
                        placeholder="Enter student GR Number (e.g. GR-2023-001)"
                        value={editStudentGrInput}
                        onChange={(e) => setEditStudentGrInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { fetchStudentByGr(editStudentGrInput); } }}
                      />
                    </div>
                    <button
                      type="button"
                      disabled={editLoading || !editStudentGrInput}
                      style={{
                        width: 'auto',
                        padding: '14px 28px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        background: editLoading || !editStudentGrInput
                          ? 'rgba(139,92,246,0.35)'
                          : 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: editLoading || !editStudentGrInput ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 12px rgba(139,92,246,0.3)',
                        transition: 'all 0.25s ease',
                        flexShrink: 0,
                      }}
                      onMouseEnter={e => { if (!editLoading && editStudentGrInput) { e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed, #b59dfb)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(139,92,246,0.45)'; } }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6, #a78bfa)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(139,92,246,0.3)'; }}
                      onClick={() => { fetchStudentByGr(editStudentGrInput); }}
                    >
                      {editLoading ? 'Loading...' : 'Load Student'}
                    </button>
                  </div>
                </div>

                {error && <div className="alert alert-error" style={{ marginBottom: '24px' }}><AlertCircle size={18} /> <span>{error}</span></div>}
                {success && <div className="alert alert-success" style={{ marginBottom: '24px' }}><CheckCircle size={18} /> <span>{success}</span></div>}

                {/* Step 2: Edit Form – shown only after student is loaded */}
                {editStudent && (
                  <form onSubmit={handleUpdateStudent} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="dashboard-widget" style={{ padding: '16px 24px', background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '16px' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Editing: <strong style={{ color: 'var(--text-primary)' }}>#{editStudent.id} — {editStudent.full_name}</strong>
                      </p>
                    </div>

                    {/* G.R. Info */}
                    <div className="dashboard-widget" style={{ padding: '24px' }}>
                      <h3 className="widget-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>General Register (G.R.) Details</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
                        <div className="form-group">
                          <label htmlFor="edit-newgr">NEW G.R. Number</label>
                          <input id="edit-newgr" type="text" value={editNewGr} onChange={(e) => setEditNewGr(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="edit-oldgr">OLD G.R. Number</label>
                          <input id="edit-oldgr" type="text" value={editOldGr} onChange={(e) => setEditOldGr(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="edit-oldnew">Old / New Status</label>
                          <input id="edit-oldnew" type="text" value={editOldNew} onChange={(e) => setEditOldNew(e.target.value)} required />
                        </div>
                      </div>
                    </div>

                    {/* Personal Info */}
                    <div className="dashboard-widget" style={{ padding: '24px' }}>
                      <h3 className="widget-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>Personal & Contact Details</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
                        <div className="form-group">
                          <label htmlFor="edit-name">Full Name</label>
                          <input id="edit-name" type="text" value={editFullName} onChange={(e) => setEditFullName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="edit-dob">Date of Birth</label>
                          <input id="edit-dob" type="text" value={editDob} onChange={(e) => setEditDob(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="edit-phone">Student Mobile Number</label>
                          <input id="edit-phone" type="text" value={editStudentMobileNumber} onChange={(e) => setEditStudentMobileNumber(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="edit-pphone">Parents Mobile Number</label>
                          <input id="edit-pphone" type="text" value={editParentsMobileNumber} onChange={(e) => setEditParentsMobileNumber(e.target.value)} required />
                        </div>
                      </div>
                    </div>

                    {/* Address & Demographics */}
                    <div className="dashboard-widget" style={{ padding: '24px' }}>
                      <h3 className="widget-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>Address & Caste Demographics</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
                        <div className="form-group">
                          <label htmlFor="edit-city">City / Village</label>
                          <input id="edit-city" type="text" value={editCity} onChange={(e) => setEditCity(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="edit-taluka">Taluka</label>
                          <input id="edit-taluka" type="text" value={editTaluka} onChange={(e) => setEditTaluka(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="edit-district">District</label>
                          <input id="edit-district" type="text" value={editDistrict} onChange={(e) => setEditDistrict(e.target.value)} required />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                          <label htmlFor="edit-caste">Caste</label>
                          <input id="edit-caste" type="text" value={editCaste} onChange={(e) => setEditCaste(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="edit-category">Category</label>
                          <input id="edit-category" type="text" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} required />
                        </div>
                      </div>
                    </div>

                    {/* Academics */}
                    <div className="dashboard-widget" style={{ padding: '24px' }}>
                      <h3 className="widget-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>Academic Information</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                          <label htmlFor="edit-college">College Name</label>
                          <input id="edit-college" type="text" value={editCollegeName} onChange={(e) => setEditCollegeName(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="edit-year">Current Year of Study</label>
                          <input id="edit-year" type="text" value={editCurrentYearOfStudy} onChange={(e) => setEditCurrentYearOfStudy(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="edit-lastexam">Last Exam Taken</label>
                          <input id="edit-lastexam" type="text" value={editLastExam} onChange={(e) => setEditLastExam(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="edit-lastexamyr">Last Exam Year</label>
                          <input id="edit-lastexamyr" type="text" value={editLastExamYear} onChange={(e) => setEditLastExamYear(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="edit-percentage">Percentage Obtained</label>
                          <input id="edit-percentage" type="text" value={editPercentage} onChange={(e) => setEditPercentage(e.target.value)} required />
                        </div>
                      </div>
                    </div>

                    {/* Hostel Placement */}
                    <div className="dashboard-widget" style={{ padding: '24px' }}>
                      <h3 className="widget-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>Hostel Placement & Income Details</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
                        <div className="form-group">
                          <label htmlFor="edit-block">Block</label>
                          <input id="edit-block" type="text" value={editBlock} onChange={(e) => setEditBlock(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="edit-room">Room Number</label>
                          <input id="edit-room" type="text" value={editRoomNo} onChange={(e) => setEditRoomNo(e.target.value)} required />
                        </div>
                        <div className="form-group">
                          <label htmlFor="edit-income">Parents Annual Income</label>
                          <input id="edit-income" type="text" value={editParentsIncome} onChange={(e) => setEditParentsIncome(e.target.value)} required />
                        </div>
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="dashboard-widget" style={{ padding: '24px' }}>
                      <h3 className="widget-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>Hostel Support Eligibility</h3>
                      <div className="toggle-switch-container" style={{ margin: '16px 0 0 0' }}>
                        <div className={`toggle-item ${editDisabled ? 'checked' : ''}`} onClick={() => setEditDisabled(!editDisabled)}>
                          <div className="checkbox-custom">{editDisabled && <CheckCircle size={14} color="white" />}</div>
                          <span className="toggle-label">Is Disabled</span>
                        </div>
                        <div className={`toggle-item ${editFatherIsDeceased ? 'checked' : ''}`} onClick={() => setEditFatherIsDeceased(!editFatherIsDeceased)}>
                          <div className="checkbox-custom">{editFatherIsDeceased && <CheckCircle size={14} color="white" />}</div>
                          <span className="toggle-label">Father is Deceased</span>
                        </div>
                        <div className={`toggle-item ${editOrphan ? 'checked' : ''}`} onClick={() => setEditOrphan(!editOrphan)}>
                          <div className="checkbox-custom">{editOrphan && <CheckCircle size={14} color="white" />}</div>
                          <span className="toggle-label">Is Orphan</span>
                        </div>
                      </div>
                    </div>

                    {/* Date & Notes */}
                    <div className="dashboard-widget" style={{ padding: '24px' }}>
                      <h3 className="widget-title" style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '10px' }}>Registration Date & Extra Information</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
                        <div className="form-group">
                          <label htmlFor="edit-currdate">Registration Date</label>
                          <input id="edit-currdate" type="date" value={editCurrDate} onChange={(e) => setEditCurrDate(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="edit-leavedate">Hostel Leaving Date (Optional)</label>
                          <input id="edit-leavedate" type="date" value={editDateOfLeavingTheHostel} onChange={(e) => setEditDateOfLeavingTheHostel(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                          <label htmlFor="edit-note">Special Notes (Optional)</label>
                          <textarea
                            id="edit-note"
                            placeholder="e.g. Any updates or special notes..."
                            value={editSpecialNote}
                            onChange={(e) => setEditSpecialNote(e.target.value)}
                            style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: '1.5px solid var(--border-card)', borderRadius: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-family)', fontSize: '1rem', height: '100px', resize: 'none', outline: 'none', transition: 'var(--transition-smooth)' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inline save feedback area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {error && (
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '14px 18px',
                          background: 'rgba(239,68,68,0.12)',
                          border: '1px solid rgba(239,68,68,0.35)',
                          borderRadius: '12px', color: '#f87171', fontSize: '0.95rem'
                        }}>
                          <AlertCircle size={18} />
                          <span>{error}</span>
                        </div>
                      )}
                      {success && (
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '14px 18px',
                          background: 'rgba(34,197,94,0.12)',
                          border: '1px solid rgba(34,197,94,0.35)',
                          borderRadius: '12px', color: '#4ade80', fontSize: '0.95rem'
                        }}>
                          <CheckCircle size={18} />
                          <span>{success}</span>
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: '18px', fontSize: '1.05rem', fontWeight: '600', letterSpacing: '0.02em' }}
                      >
                        {loading ? (
                          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                            Saving Changes...
                          </span>
                        ) : 'Save Student Changes'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      )}
      {/* Student Detail Modal */}
      {selectedStudent && (
        <div
          className="student-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedStudent(null); }}
        >
          <div className="student-modal">
            {/* Modal Header */}
            <div className="student-modal-header">
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                  Student Profile — ID #{selectedStudent.id}
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {selectedStudent.full_name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '10px',
                  color: 'var(--text-secondary)',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-card)'; }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="student-modal-body">

              {/* Status badges row */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                {selectedStudent.disabled && <span className="modal-badge badge-warning">⚠ Disabled</span>}
                {selectedStudent.father_is_deceased && <span className="modal-badge badge-warning">⚠ Father Deceased</span>}
                {selectedStudent.orphan && <span className="modal-badge badge-warning">⚠ Orphan</span>}
                {!selectedStudent.disabled && !selectedStudent.father_is_deceased && !selectedStudent.orphan && (
                  <span className="modal-badge badge-ok">✓ No special support flags</span>
                )}
              </div>

              {/* Section: G.R. Numbers */}
              <div className="modal-section">
                <div className="modal-section-title">General Register Numbers</div>
                <div className="modal-grid-3">
                  <div className="modal-field"><span className="modal-label">NEW G.R.</span><span className="modal-value">{selectedStudent.new_gr || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">OLD G.R.</span><span className="modal-value">{selectedStudent.old_gr || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">Old / New Status</span><span className="modal-value">{selectedStudent.old_new || '—'}</span></div>
                </div>
              </div>

              {/* Section: Personal */}
              <div className="modal-section">
                <div className="modal-section-title">Personal Details</div>
                <div className="modal-grid-2">
                  <div className="modal-field"><span className="modal-label">Full Name</span><span className="modal-value">{selectedStudent.full_name || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">Date of Birth</span><span className="modal-value">{selectedStudent.dob || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">Student Mobile</span><span className="modal-value">{selectedStudent.student_mobile_number || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">Parents Mobile</span><span className="modal-value">{selectedStudent.parents_mobile_number || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">Parents Annual Income</span><span className="modal-value">{selectedStudent.parents_income || '—'}</span></div>
                </div>
              </div>

              {/* Section: Address */}
              <div className="modal-section">
                <div className="modal-section-title">Address & Demographics</div>
                <div className="modal-grid-3">
                  <div className="modal-field"><span className="modal-label">City / Village</span><span className="modal-value">{selectedStudent.city || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">Taluka</span><span className="modal-value">{selectedStudent.taluka || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">District</span><span className="modal-value">{selectedStudent.district || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">Caste</span><span className="modal-value">{selectedStudent.caste || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">Category</span><span className="modal-value">{selectedStudent.category || '—'}</span></div>
                </div>
              </div>

              {/* Section: Academic */}
              <div className="modal-section">
                <div className="modal-section-title">Academic Information</div>
                <div className="modal-grid-2">
                  <div className="modal-field" style={{ gridColumn: 'span 2' }}><span className="modal-label">College Name</span><span className="modal-value">{selectedStudent.college_name || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">Current Year of Study</span><span className="modal-value">{selectedStudent.current_year_of_study || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">Last Exam Taken</span><span className="modal-value">{selectedStudent.last_exam || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">Last Exam Year</span><span className="modal-value">{selectedStudent.last_exam_year || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">Percentage Obtained</span><span className="modal-value">{selectedStudent.percentage || '—'}</span></div>
                </div>
              </div>

              {/* Section: Hostel */}
              <div className="modal-section">
                <div className="modal-section-title">Hostel Placement</div>
                <div className="modal-grid-3">
                  <div className="modal-field"><span className="modal-label">Block</span><span className="modal-value">{selectedStudent.block || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">Room Number</span><span className="modal-value">{selectedStudent.room_no || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">Registration Date</span><span className="modal-value">{selectedStudent.curr_date || '—'}</span></div>
                  <div className="modal-field"><span className="modal-label">Date of Leaving Hostel</span><span className="modal-value">{selectedStudent.date_of_leaving_the_hostel || 'Still Enrolled'}</span></div>
                </div>
              </div>

              {/* Section: Notes */}
              {selectedStudent.special_note && (
                <div className="modal-section">
                  <div className="modal-section-title">Special Notes</div>
                  <div style={{ padding: '14px 16px', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '10px', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {selectedStudent.special_note}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="student-modal-footer">
              <button
                type="button"
                onClick={() => {
                  setEditStudentIdInput(String(selectedStudent.id));
                  setEditStudentId(String(selectedStudent.id));
                  setSelectedStudent(null);
                  setPortalTab('edit_student');
                  fetchStudentById(String(selectedStudent.id));
                }}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed, #b59dfb)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6, #a78bfa)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Pencil size={15} /> Edit This Student
              </button>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
