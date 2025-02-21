// // import { Link } from "react-router-dom";
// // import { GiBookshelf } from "react-icons/gi";
// // import { IoCalendarOutline } from "react-icons/io5";
// // import { HiOutlineDocumentReport } from "react-icons/hi";
// // import { AiOutlineSchedule } from "react-icons/ai";
// // import { BiBookAdd } from "react-icons/bi";
// // import { RiUserAddLine } from "react-icons/ri";
// // import { PiBooks, PiUser, PiStudent } from "react-icons/pi";
// // import { MdOutlineGroups, MdEventSeat } from "react-icons/md";
// // import { FaUtensils } from "react-icons/fa";
// // import { useContext, useEffect } from "react";
// // import UserContext from "../../Hooks/UserContext";
// // import axios from "../../config/api/axios";

// // const Dash = () => {
// //   const { user, setPaperList } = useContext(UserContext);

// //   useEffect(() => {
// //     const getPapers = async () => {
// //       const response = await axios.get(`paper/${user.userType}/${user._id}`);
// //       setPaperList(response.data);
// //     };
// //     getPapers();
// //   }, [setPaperList, user]);

// //   const CardLink = ({ to, icon: Icon, title, description }) => (
// //     <Link
// //       to={to}
// //       className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 
// //                  shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl
// //                  hover:shadow-violet-500/20 backdrop-blur-sm
// //                  border border-slate-700/50 hover:border-violet-500/50"
// //     >
// //       {/* Animated background gradient */}
// //       <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20 
// //                       opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-gradient" />
      
// //       {/* Animated border gradient */}
// //       <div className="absolute inset-0 animate-border-glow bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 
// //                       opacity-0 group-hover:opacity-100" style={{ padding: '1px' }} />
      
// //       {/* Card content */}
// //       <div className="relative flex gap-3 z-10">
// //         <div className="relative">
// //           <Icon className="text-[2.5rem] text-violet-400 transition-all duration-500 
// //                           group-hover:scale-110 group-hover:text-violet-300 lg:text-[4rem]" />
// //           <div className="absolute inset-0 animate-pulse-slow opacity-0 
// //                           group-hover:opacity-100 blur-xl bg-violet-500/30" />
// //         </div>
// //         <div className="font-semibold text-slate-200 group-hover:text-white transition-colors duration-300">
// //           {title}
// //           <p className="text-sm font-normal text-slate-400 group-hover:text-slate-300 lg:text-base">
// //             {description}
// //           </p>
// //         </div>
// //       </div>
// //     </Link>
// //   );

// //   return (
// //     <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8 relative overflow-hidden">
// //       {/* Animated background effects */}
// //       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,40,200,0.1),transparent_50%)] animate-pulse-slow" />
// //       <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(80,40,200,0.1),transparent_40%)] animate-pulse-slower" />
// //       <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(120,40,200,0.05),transparent)] animate-wave" />
      
// //       {/* Enhanced Animated Header */}
// //       <div className="relative mb-12 overflow-hidden">
// //         {/* Header background glow */}
// //         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-96 
// //                         bg-gradient-to-r from-violet-500/0 via-fuchsia-500/20 to-violet-500/0
// //                         blur-3xl animate-glow-pulse" />
        
// //         {/* Title with animations */}
// //         <h2 className="relative z-10 text-center">
// //           <span className="relative inline-block font-spectral text-6xl font-bold tracking-tight">
// //             <span className="relative inline-block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400 
// //                             bg-[length:200%_auto] bg-clip-text text-transparent animate-shine">
// //               edu
// //             </span>
// //             <span className="relative inline-block bg-gradient-to-r from-fuchsia-400 via-violet-400 to-fuchsia-400 
// //                             bg-[length:200%_auto] bg-clip-text text-transparent animate-shine delay-150">
// //               sphere
// //             </span>
// //             {/* Animated underline */}
// //             <div className="absolute -bottom-2 left-0 h-[2px] w-full scale-x-0 
// //                            bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400
// //                            animate-scale-x" />
// //           </span>
// //         </h2>
// //       </div>
      
// //       {/* Dashboard Grid */}
// //       <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 gap-4 
// //                       lg:grid-cols-2 xl:grid-cols-3">
// //         <CardLink
// //           to="./paper"
// //           icon={GiBookshelf}
// //           title="Student Election"
// //           description="Real time voting and results"
// //         />
// //         <CardLink
// //           to="./attendance"
// //           icon={IoCalendarOutline}
// //           title="Automated Sick Leave"
// //           description="leave notification with email facility"
// //         />
// //         <CardLink
// //           to="./internal"
// //           icon={HiOutlineDocumentReport}
// //           title="Complaint system"
// //           description="Anonymous complaint submission"
// //         />
// //         <CardLink
// //           to="./time_schedule"
// //           icon={AiOutlineSchedule}
// //           title="Time Schedule"
// //           description="View or Edit Time Schedule"
// //         />
// //         <CardLink
// //           to="./club_management"
// //           icon={MdOutlineGroups}
// //           title="Club Management"
// //           description="Manage College Clubs"
// //         />
        
// //         {user.role === "HOD" && (
// //           <>
// //             <CardLink
// //               to="./add_paper"
// //               icon={BiBookAdd}
// //               title="Add Paper"
// //               description="Add a New Paper"
// //             />
// //             <CardLink
// //               to="./approve_staff"
// //               icon={RiUserAddLine}
// //               title="Approve Staff"
// //               description="Approve registered staff(s)"
// //             />
// //           </>
// //         )}

// //         {user.role === "teacher" && (
// //           <CardLink
// //             to="./teacher_request_acceptance"
// //             icon={RiUserAddLine}
// //             title="Teacher Request Acceptance"
// //             description="Accept or manage teacher requests"
// //           />
// //         )}

// //         {user.role === "student" && (
// //           <CardLink
// //             to="./join_paper"
// //             icon={PiBooks}
// //             title="Manage Paper"
// //             description="Join or Leave Paper"
// //           />
// //         )}

// //         <CardLink
// //           to="./messmanagement"
// //           icon={FaUtensils}
// //           title="Mess Management"
// //           description="Manage Mess and Dining"
// //         />
        
// //         <CardLink
// //           to="./bookingsystem"
// //           icon={MdEventSeat}
// //           title="Booking System"
// //           description="Manage Bookings"
// //         />

// //         <CardLink
// //           to="./profile"
// //           icon={user.role === "student" ? PiStudent : PiUser}
// //           title="Profile"
// //           description="View or Edit Profile"
// //         />
// //       </div>
// //     </main>
// //   );
// // };

// // export default Dash;


// import { Link } from "react-router-dom";
// import { GiBookshelf } from "react-icons/gi";
// import { IoCalendarOutline } from "react-icons/io5";
// import { HiOutlineDocumentReport } from "react-icons/hi";
// import { AiOutlineSchedule } from "react-icons/ai";
// import { BiBookAdd } from "react-icons/bi";
// import { RiUserAddLine, RiFileListLine } from "react-icons/ri";
// import { PiBooks, PiUser, PiStudent } from "react-icons/pi";
// import { MdOutlineGroups, MdEventSeat } from "react-icons/md";
// import { FaUtensils, FaUpload } from "react-icons/fa";
// import { useContext, useEffect, useState } from "react";
// import UserContext from "../../Hooks/UserContext";
// import axios from "../../config/api/axios";

// const Dash = () => {
//   const { user, setPaperList } = useContext(UserContext);
//   // State for branch/department prompt (only for teacher/staff)
//   const [branch, setBranch] = useState("");
//   const [department, setDepartment] = useState("");
//   const [infoSubmitted, setInfoSubmitted] = useState(false);

//   useEffect(() => {
//     const getPapers = async () => {
//       const response = await axios.get(`paper/${user.userType}/${user._id}`);
//       setPaperList(response.data);
//     };
//     getPapers();
//   }, [setPaperList, user]);

//   const CardLink = ({ to, icon: Icon, title, description }) => (
//     <Link
//       to={to}
//       className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6
//                    shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl
//                    hover:shadow-violet-500/20 backdrop-blur-sm
//                    border border-slate-700/50 hover:border-violet-500/50"
//     >
//       {/* Animated background gradient */}
//       <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20
//                         opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-gradient" />
//       {/* Animated border gradient */}
//       <div
//         className="absolute inset-0 animate-border-glow bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500
//                         opacity-0 group-hover:opacity-100"
//         style={{ padding: "1px" }}
//       />
//       {/* Card content */}
//       <div className="relative flex gap-3 z-10">
//         <div className="relative">
//           <Icon
//             className="text-[2.5rem] text-violet-400 transition-all duration-500
//                             group-hover:scale-110 group-hover:text-violet-300 lg:text-[4rem]"
//           />
//           <div className="absolute inset-0 animate-pulse-slow opacity-0
//                             group-hover:opacity-100 blur-xl bg-violet-500/30" />
//         </div>
//         <div className="font-semibold text-slate-200 group-hover:text-white transition-colors duration-300">
//           {title}
//           <p className="text-sm font-normal text-slate-400 group-hover:text-slate-300 lg:text-base">
//             {description}
//           </p>
//         </div>
//       </div>
//     </Link>
//   );

//   // If user is a teacher and branch/department info has not been provided,
//   // show the prompt form instead of the dashboard grid.
//   if (user.role === "teacher" && !infoSubmitted) {
//     return (
//       <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8 relative overflow-hidden">
//         <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
//           <h2 className="text-center text-2xl font-bold text-slate-200 mb-4">
//             Please enter your branch and department
//           </h2>
//           <div className="flex flex-col gap-4">
//             <select
//               value={branch}
//               onChange={(e) => setBranch(e.target.value)}
//               className="p-2 rounded bg-slate-700 text-slate-200"
//             >
//               <option value="">Select Branch</option>
//               <option value="CSE">CSE</option>
//               <option value="ECE">ECE</option>
//               <option value="ME">ME</option>
//               {/* Add additional branch options as needed */}
//             </select>
//             <select
//               value={department}
//               onChange={(e) => setDepartment(e.target.value)}
//               className="p-2 rounded bg-slate-700 text-slate-200"
//             >
//               <option value="">Select Department</option>
//               <option value="Engineering">Engineering</option>
//               <option value="Science">Science</option>
//               <option value="Arts">Arts</option>
//               {/* Add additional department options as needed */}
//             </select>
//             <button
//               onClick={() => {
//                 if (branch && department) {
//                   setInfoSubmitted(true);
//                 } else {
//                   alert("Please select both branch and department.");
//                 }
//               }}
//               className="mt-4 px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-400 transition-colors"
//             >
//               Submit
//             </button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8 relative overflow-hidden">
//       {/* Animated background effects */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,40,200,0.1),transparent_50%)] animate-pulse-slow" />
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(80,40,200,0.1),transparent_40%)] animate-pulse-slower" />
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(120,40,200,0.05),transparent)] animate-wave" />

//       {/* Enhanced Animated Header */}
//       <div className="relative mb-12 overflow-hidden">
//         {/* Header background glow */}
//         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-96
//                           bg-gradient-to-r from-violet-500/0 via-fuchsia-500/20 to-violet-500/0
//                           blur-3xl animate-glow-pulse" />
//         <h2 className="relative z-10 text-center">
//           <span className="relative inline-block font-spectral text-6xl font-bold tracking-tight">
//             <span className="relative inline-block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400
//                               bg-[length:200%_auto] bg-clip-text text-transparent animate-shine">
//               edu
//             </span>
//             <span className="relative inline-block bg-gradient-to-r from-fuchsia-400 via-violet-400 to-fuchsia-400
//                               bg-[length:200%_auto] bg-clip-text text-transparent animate-shine delay-150">
//               sphere
//             </span>
//             {/* Animated underline */}
//             <div className="absolute -bottom-2 left-0 h-[2px] w-full scale-x-0
//                              bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400
//                              animate-scale-x" />
//           </span>
//         </h2>
//       </div>

//       {/* Optional: Display teacher branch & department info */}
//       {user.role === "teacher" && infoSubmitted && (
//         <div className="mb-8 text-center text-slate-200">
//           <h3 className="text-xl">
//             Branch: {branch} | Department: {department}
//           </h3>
//         </div>
//       )}

//       {/* Dashboard Grid */}
//       <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 gap-4
//                         lg:grid-cols-2 xl:grid-cols-3">
//         <CardLink
//           to="./paper"
//           icon={GiBookshelf}
//           title="Papers"
//           description="View Papers and Notes"
//         />
//         <CardLink
//           to="./attendance"
//           icon={IoCalendarOutline}
//           title="Attendance"
//           description="Add or Edit Attendance"
//         />
//         <CardLink
//           to="./internal"
//           icon={HiOutlineDocumentReport}
//           title="Internal Mark"
//           description="View or Edit Internal Marks"
//         />
//         <CardLink
//           to="./time_schedule"
//           icon={AiOutlineSchedule}
//           title="Time Schedule"
//           description="View or Edit Time Schedule"
//         />
//         <CardLink
//           to="./club_management"
//           icon={MdOutlineGroups}
//           title="Club Management"
//           description="Manage College Clubs"
//         />

//         {user.role === "HOD" && (
//           <>
//             <CardLink
//               to="./add_paper"
//               icon={BiBookAdd}
//               title="Add Paper"
//               description="Add a New Paper"
//             />
//             <CardLink
//               to="./approve_staff"
//               icon={RiUserAddLine}
//               title="Approve Staff"
//               description="Approve registered staff(s)"
//             />
//           </>
//         )}

//         {user.role === "teacher" && (
//           <>
//             <CardLink
//               to="./teacher_request_acceptance"
//               icon={RiUserAddLine}
//               title="Teacher Request Acceptance"
//               description="Accept or manage teacher requests"
//             />
//             <CardLink
//               to="./assignment"
//               icon={RiFileListLine}
//               title="Assignment"
//               description="Manage assignments"
//             />
//           </>
//         )}

//         {user.role === "student" && (
//           <>
//             <CardLink
//               to="./join_paper"
//               icon={PiBooks}
//               title="Manage Paper"
//               description="Join or Leave Paper"
//             />
//             <CardLink
//               to="./upload_assignment"
//               icon={FaUpload}
//               title="Upload Assignment"
//               description="Submit your assignments"
//             />
//           </>
//         )}

//         <CardLink
//           to="./messmanagement"
//           icon={FaUtensils}
//           title="Mess Management"
//           description="Manage Mess and Dining"
//         />

//         <CardLink
//           to="./bookingsystem"
//           icon={MdEventSeat}
//           title="Booking System"
//           description="Manage Bookings"
//         />

//         <CardLink
//           to="./profile"
//           icon={user.role === "student" ? PiStudent : PiUser}
//           title="Profile"
//           description="View or Edit Profile"
//         />
//       </div>
//     </main>
//   );
// };

// export default Dash;

import { Link } from "react-router-dom";
import { GiBookshelf } from "react-icons/gi";
import { IoCalendarOutline } from "react-icons/io5";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { AiOutlineSchedule, AiOutlineBarChart } from "react-icons/ai";
import { BiBookAdd } from "react-icons/bi";
import { RiUserAddLine, RiFileListLine } from "react-icons/ri";
import { PiBooks, PiUser, PiStudent } from "react-icons/pi";
import { MdOutlineGroups, MdEventSeat } from "react-icons/md";
import { FaUtensils, FaUpload } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../Hooks/UserContext";
import axios from "../../config/api/axios";

const Dash = () => {
  const { user, setPaperList } = useContext(UserContext);
  // State for branch/department prompt (only for teacher/staff)
  const [branch, setBranch] = useState("");
  const [department, setDepartment] = useState("");
  const [infoSubmitted, setInfoSubmitted] = useState(false);

  // New state for student prompt
  const [studentDepartment, setStudentDepartment] = useState("");
  const [studentDivision, setStudentDivision] = useState("");
  const [studentYear, setStudentYear] = useState("");
  const [studentInfoSubmitted, setStudentInfoSubmitted] = useState(false);

  useEffect(() => {
    const getPapers = async () => {
      const response = await axios.get(`paper/${user.userType}/${user._id}`);
      setPaperList(response.data);
    };
    getPapers();
  }, [setPaperList, user]);

  const CardLink = ({ to, icon: Icon, title, description }) => (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-6
                   shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl
                   hover:shadow-violet-500/20 backdrop-blur-sm
                   border border-slate-700/50 hover:border-violet-500/50"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20
                        opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-gradient" />
      {/* Animated border gradient */}
      <div
        className="absolute inset-0 animate-border-glow bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500
                        opacity-0 group-hover:opacity-100"
        style={{ padding: "1px" }}
      />
      {/* Card content */}
      <div className="relative flex gap-3 z-10">
        <div className="relative">
          <Icon
            className="text-[2.5rem] text-violet-400 transition-all duration-500
                            group-hover:scale-110 group-hover:text-violet-300 lg:text-[4rem]"
          />
          <div className="absolute inset-0 animate-pulse-slow opacity-0
                            group-hover:opacity-100 blur-xl bg-violet-500/30" />
        </div>
        <div className="font-semibold text-slate-200 group-hover:text-white transition-colors duration-300">
          {title}
          <p className="text-sm font-normal text-slate-400 group-hover:text-slate-300 lg:text-base">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );

  // If user is a teacher and branch/department info has not been provided,
  // show the prompt form instead of the dashboard grid.
  if (user.role === "teacher" && !infoSubmitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8 relative overflow-hidden">
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-center text-2xl font-bold text-slate-200 mb-4">
            Please enter your branch and department
          </h2>
          <div className="flex flex-col gap-4">
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="p-2 rounded bg-slate-700 text-slate-200"
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              {/* Add additional branch options as needed */}
            </select>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="p-2 rounded bg-slate-700 text-slate-200"
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Science">Science</option>
              <option value="Arts">Arts</option>
              {/* Add additional department options as needed */}
            </select>
            <button
              onClick={() => {
                if (branch && department) {
                  setInfoSubmitted(true);
                } else {
                  alert("Please select both branch and department.");
                }
              }}
              className="mt-4 px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-400 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </main>
    );
  }

  // If user is a student and required info has not been provided,
  // show the prompt form instead of the dashboard grid.
  if (user.role === "student" && !studentInfoSubmitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8 relative overflow-hidden">
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-center text-2xl font-bold text-slate-200 mb-4">
            Please enter your department, division, and year
          </h2>
          <div className="flex flex-col gap-4">
            <select
              value={studentDepartment}
              onChange={(e) => setStudentDepartment(e.target.value)}
              className="p-2 rounded bg-slate-700 text-slate-200"
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Science">Science</option>
              <option value="Arts">Arts</option>
              {/* Add additional department options as needed */}
            </select>
            <select
              value={studentDivision}
              onChange={(e) => setStudentDivision(e.target.value)}
              className="p-2 rounded bg-slate-700 text-slate-200"
            >
              <option value="">Select Division</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              {/* Add additional division options as needed */}
            </select>
            <select
              value={studentYear}
              onChange={(e) => setStudentYear(e.target.value)}
              className="p-2 rounded bg-slate-700 text-slate-200"
            >
              <option value="">Select Year</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              {/* Add additional year options as needed */}
            </select>
            <button
              onClick={() => {
                if (studentDepartment && studentDivision && studentYear) {
                  setStudentInfoSubmitted(true);
                } else {
                  alert("Please select your department, division, and year.");
                }
              }}
              className="mt-4 px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-400 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,40,200,0.1),transparent_50%)] animate-pulse-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(80,40,200,0.1),transparent_40%)] animate-pulse-slower" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(120,40,200,0.05),transparent)] animate-wave" />

      {/* Enhanced Animated Header */}
      <div className="relative mb-12 overflow-hidden">
        {/* Header background glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-96
                          bg-gradient-to-r from-violet-500/0 via-fuchsia-500/20 to-violet-500/0
                          blur-3xl animate-glow-pulse" />
        <h2 className="relative z-10 text-center">
          <span className="relative inline-block font-spectral text-6xl font-bold tracking-tight">
            <span className="relative inline-block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400
                              bg-[length:200%_auto] bg-clip-text text-transparent animate-shine">
              edu
            </span>
            <span className="relative inline-block bg-gradient-to-r from-fuchsia-400 via-violet-400 to-fuchsia-400
                              bg-[length:200%_auto] bg-clip-text text-transparent animate-shine delay-150">
              sphere
            </span>
            {/* Animated underline */}
            <div className="absolute -bottom-2 left-0 h-[2px] w-full scale-x-0
                             bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400
                             animate-scale-x" />
          </span>
        </h2>
      </div>

      {/* Optional: Display teacher branch & department info */}
      {user.role === "teacher" && infoSubmitted && (
        <div className="mb-8 text-center text-slate-200">
          <h3 className="text-xl">
            Branch: {branch} | Department: {department}
          </h3>
        </div>
      )}

      {/* Optional: Display student info */}
      {user.role === "student" && studentInfoSubmitted && (
        <div className="mb-8 text-center text-slate-200">
          <h3 className="text-xl">
            Department: {studentDepartment} | Division: {studentDivision} | Year: {studentYear}
          </h3>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 gap-4
                        lg:grid-cols-2 xl:grid-cols-3">
        <CardLink
          to="./paper"
          icon={GiBookshelf}
          title="Papers"
          description="View Papers and Notes"
        />
        <CardLink
          to="./attendance"
          icon={IoCalendarOutline}
          title="Attendance"
          description="Add or Edit Attendance"
        />
        <CardLink
          to="./internal"
          icon={HiOutlineDocumentReport}
          title="Internal Mark"
          description="View or Edit Internal Marks"
        />
        <CardLink
          to="./time_schedule"
          icon={AiOutlineSchedule}
          title="Time Schedule"
          description="View or Edit Time Schedule"
        />
        <CardLink
          to="./club_management"
          icon={MdOutlineGroups}
          title="Club Management"
          description="Manage College Clubs"
        />

        {user.role === "HOD" && (
          <>
            <CardLink
              to="./add_paper"
              icon={BiBookAdd}
              title="Add Paper"
              description="Add a New Paper"
            />
            <CardLink
              to="./approve_staff"
              icon={RiUserAddLine}
              title="Approve Staff"
              description="Approve registered staff(s)"
            />
          </>
        )}

        {user.role === "teacher" && (
          <>
            <CardLink
              to="./teacher_request_acceptance"
              icon={RiUserAddLine}
              title="Teacher Request Acceptance"
              description="Accept or manage teacher requests"
            />
            <CardLink
              to="./assignment"
              icon={RiFileListLine}
              title="Assignment"
              description="Manage assignments"
            />
            <CardLink
              to="./department_statistics"
              icon={AiOutlineBarChart}
              title="Department Statistics"
              description="View department statistics"
            />
          </>
        )}

        {user.role === "student" && (
          <>
            <CardLink
              to="./join_paper"
              icon={PiBooks}
              title="Manage Paper"
              description="Join or Leave Paper"
            />
            <CardLink
              to="./upload_assignment"
              icon={FaUpload}
              title="Upload Assignment"
              description="Submit your assignments"
            />
          </>
        )}

        <CardLink
          to="./messmanagement"
          icon={FaUtensils}
          title="Mess Management"
          description="Manage Mess and Dining"
        />

        <CardLink
          to="./bookingsystem"
          icon={MdEventSeat}
          title="Booking System"
          description="Manage Bookings"
        />

        <CardLink
          to="./profile"
          icon={user.role === "student" ? PiStudent : PiUser}
          title="Profile"
          description="View or Edit Profile"
        />
      </div>
    </main>
  );
};

export default Dash;
