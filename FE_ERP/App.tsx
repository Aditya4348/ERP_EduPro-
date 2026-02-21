import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardLayoutMobile } from './layouts/DashboardLayoutMobile';
import { UserRole } from './types';
import { Card, Button } from './components/UI';
import { ShieldCheck } from 'lucide-react';

// ================= AUTH PAGES =================
import { Login } from './modules/auth/Login';
import { ForgotPassword } from './modules/auth/ForgotPassword';
import { VerifyOTP } from './modules/auth/VerifyOTP';

// ================= DASHBOARD MODULES =================
import { Dashboard } from './modules/Dashboard';
import { FinanceSPP } from './modules/finance/FinanceSPP';

// Core Management
import { MasterStudents } from './modules/core/MasterStudents';
import { MasterTeachers } from './modules/core/MasterTeachers';
import { MasterStaff } from './modules/core/MasterStaff';
import { ClassManagement } from './modules/core/ClassManagement';
import { SchoolProfile } from './modules/core/SchoolProfile';
import { PromotionEngine } from './modules/core/PromotionEngine';
import { MasterInsights } from './modules/core/MasterInsights';

// Details
import { StudentDetail } from './modules/core/StudentDetail';
import { TeacherDetail } from './modules/core/TeacherDetail';
import { StaffDetail } from './modules/core/StaffDetail';
import { ClassDetail } from './modules/core/ClassDetail';

// Sub Menu
import { SubMenuAcademic } from './modules/academic/SubMenuAcademic';
import { SubMenuCore } from './modules/core/SubMenuCore';
import { SubMenuStudentAffairs } from './modules/StudentAffairs/SubMenuStudentAffairs';
import { SubMenuFinance } from './modules/finance/SubMenuFinance';
import { SubMenuComms } from './modules/communications/SubMenuComms';
import { SubMenuVocational } from './modules/vocational/SubMenuVocational';



// Academic
import { AcademicLMS } from './modules/academic/AcademicLMS';
import { AcademicGrades } from './modules/academic/AcademicGrades';
import { AcademicCBT } from './modules/academic/AcademicCBT';
import { AcademicAttendance } from './modules/academic/AcademicAttendance';
import { AcademicJournal } from './modules/academic/AcademicJournal';
import { AcademicCurriculum } from './modules/academic/AcademicCurriculum';
import { AcademicPortfolio } from './modules/academic/AcademicPortfolio';
import { AcademicCalendar } from './modules/academic/AcademicCalendar';
import { Announcements } from './modules/communications/Announcements';
import { Schedule } from './modules/academic/Schedule';
import { Inventory } from './modules/Inventory';
import { HelpCenter } from './modules/HelpCenter';

// Student Affairs
import { Counseling } from './modules/StudentAffairs/Counseling';
import { OSIS } from './modules/StudentAffairs/OSIS';
import { OSISSections } from './modules/StudentAffairs/OSISSections';
import { OSISProgramDetail } from './modules/StudentAffairs/OSISProgramDetail';
import { Extracurricular } from './modules/StudentAffairs/Extracurricular';
import { ExtracurricularDetail } from './modules/StudentAffairs/ExtracurricularDetail';
import { DashboardLayout } from './layouts/DashboardLayout';


// ================= LOADING =================
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-slate-500">Memuat EduPro ERP...</p>
  </div>
);


// ================= FORBIDDEN =================
const ForbiddenAccess = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
      <ShieldCheck size={48} />
    </div>
    <h3 className="text-2xl font-black">Akses Dibatasi</h3>
    <p className="text-slate-500 max-w-md mt-2">
      Maaf, akun Anda tidak memiliki izin untuk mengakses halaman ini.
    </p>
    <Button onClick={() => window.location.href = '/'} className="mt-8">
      Ke Dashboard Utama
    </Button>
  </div>
);


// ================= DASHBOARD ROUTES =================
const DashboardRoutes = () => {
  const { user } = useAuth();

  const hasAccess = (allowedRoles: UserRole[]) => {
    return user && allowedRoles.includes(user.role);
  };

  return (
    <Suspense fallback={<div className="p-12 text-center">Memuat fitur...</div>}>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        {/* Core */}
        <Route path="/core" element={<SubMenuCore />} />
        <Route path="/core/insights" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.KEPALA_SEKOLAH, UserRole.YAYASAN]) ? <MasterInsights /> : <ForbiddenAccess />} />
        <Route path="/core/profile" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.KEPALA_SEKOLAH]) ? <SchoolProfile /> : <ForbiddenAccess />} />
        <Route path="/core/students" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.TATA_USAHA, UserRole.WAKASEK, UserRole.BK, UserRole.KEPALA_SEKOLAH]) ? <MasterStudents /> : <ForbiddenAccess />} />
        <Route path="/core/students/:id" element={<StudentDetail />} />
        <Route path="/core/teachers" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.TATA_USAHA, UserRole.WAKASEK, UserRole.KEPALA_SEKOLAH]) ? <MasterTeachers /> : <ForbiddenAccess />} />
        <Route path="/core/teachers/:id" element={<TeacherDetail />} />
        <Route path="/core/staff" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.TATA_USAHA]) ? <MasterStaff /> : <ForbiddenAccess />} />
        <Route path="/core/staff/:id" element={<StaffDetail />} />
        <Route path="/core/classes" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.TATA_USAHA, UserRole.WAKASEK]) ? <ClassManagement /> : <ForbiddenAccess />} />
        <Route path="/core/classes/:id" element={<ClassDetail />} />
        <Route path="/core/promotion" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.TATA_USAHA]) ? <PromotionEngine /> : <ForbiddenAccess />} />

        {/* Academic */}
        <Route path="/academic" element={<SubMenuAcademic />} />
        <Route path="/academic/attendance" element={hasAccess([UserRole.GURU, UserRole.SUPER_ADMIN, UserRole.WAKASEK]) ? <AcademicAttendance /> : <ForbiddenAccess />} />
        <Route path="/academic/journal" element={hasAccess([UserRole.GURU, UserRole.SUPER_ADMIN, UserRole.KEPALA_SEKOLAH]) ? <AcademicJournal /> : <ForbiddenAccess />} />
        <Route path="/academic/schedule" element={<Schedule />} />
        <Route path="/academic/lms" element={<AcademicLMS />} />
        <Route path="/academic/grades" element={hasAccess([UserRole.GURU, UserRole.WALI_KELAS, UserRole.SISWA, UserRole.ORANG_TUA, UserRole.SUPER_ADMIN]) ? <AcademicGrades /> : <ForbiddenAccess />} />
        <Route path="/academic/cbt" element={hasAccess([UserRole.GURU, UserRole.SUPER_ADMIN]) ? <AcademicCBT /> : <ForbiddenAccess />} />
        <Route path="/academic/curriculum" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.WAKASEK, UserRole.KEPALA_SEKOLAH]) ? <AcademicCurriculum /> : <ForbiddenAccess />} />
        <Route path="/academic/portfolio" element={<AcademicPortfolio />} />
        <Route path="/academic/calendar" element={<AcademicCalendar />} />

        {/* Student Affairs */}
        <Route path="/student-affairs" element={<SubMenuStudentAffairs />} />
        <Route path="/student-affairs/counseling" element={hasAccess([UserRole.BK, UserRole.WAKASEK, UserRole.SUPER_ADMIN, UserRole.KEPALA_SEKOLAH]) ? <Counseling /> : <ForbiddenAccess />} />
        <Route path="/student-affairs/osis" element={<OSIS />} />
        <Route path="/student-affairs/osis/sections" element={<OSISSections />} />
        <Route path="/student-affairs/osis/program/:id" element={<OSISProgramDetail />} />
        <Route path="/student-affairs/extracurricular" element={<Extracurricular />} />
        <Route path="/student-affairs/extracurricular/:id" element={<ExtracurricularDetail />} />

        {/* Finance */}
        <Route path="/finance" element={<SubMenuFinance />} />
        <Route path="/finance/spp" element={<FinanceSPP />} />

        {/* Vocational */}
        <Route path="/vocational" element={<SubMenuVocational />} />

        {/* Others */}
        <Route path="/assets/inventory" element={hasAccess([UserRole.SUPER_ADMIN, UserRole.TATA_USAHA]) ? <Inventory /> : <ForbiddenAccess />} />
        <Route path="/comms" element={<SubMenuComms />} />
        <Route path="/comms/announcements" element={<Announcements />} />
        <Route path="/help-center" element={<HelpCenter />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};


// ================= MAIN APP ROUTES =================
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [ isMobile, setIsMobile ] = React.useState(false);


  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  if (isLoading) return <LoadingScreen />;

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/verify-otp" element={<VerifyOTP />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </>
      ) : (
        <Route element={isMobile ? <DashboardLayoutMobile /> : <DashboardLayout />}>
          <Route path="/*" element={<DashboardRoutes />} />
        </Route>
      )}
    </Routes>
  );
};


// ================= ROOT =================
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;