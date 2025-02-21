// import React from "react";
// import UserContext from "../../Hooks/UserContext";
// import Loading from "../Layouts/Loading";
// import axios from "../../config/api/axios";
// import { PiUserThin, PiStudentThin } from "react-icons/pi";

// const Profile = () => {
//   const { user } = React.useContext(UserContext);
//   const [profile, setProfile] = React.useState({});

//   React.useEffect(() => {
//     const getProfile = async () => {
//       const response = await axios.get(`${user.userType}/${user._id}`);
//       setProfile(response.data);
//     };
//     getProfile();
//   }, [user]);

//   return (
//     <main className="flex w-full flex-col justify-center md:w-fit">
//       {profile.name ? (
//         <>
//           <div className=" my-4 flex w-full justify-center overflow-auto dark:border-slate-500 dark:p-[1px]">
//             {user.userType === "staff" ? (
//               <PiUserThin className="m-2 rounded-full border-2 border-slate-900 p-1 text-6xl dark:border-slate-300 md:p-2 md:text-9xl lg:text-[12rem]" />
//             ) : (
//               <PiStudentThin className="m-2 rounded-full border-2 border-slate-900 p-1 text-6xl font-light dark:border-slate-300 md:p-2 md:text-9xl lg:text-[12rem]" />
//             )}
//             <div className="flex flex-col items-start justify-center">
//               <h2 className=" whitespace-break-spaces text-3xl font-bold text-violet-950 underline decoration-inherit decoration-2 underline-offset-4 dark:mt-0 dark:text-slate-400 md:text-6xl">
//                 {user?.name}
//               </h2>
//               <p className="text-lg capitalize sm:text-xl md:text-2xl">
//                 {user?.role}
//               </p>
//             </div>
//           </div>
//           <div className=" w-full overflow-auto rounded-md border-2 border-slate-900 dark:border-slate-500 dark:p-[1px]">
//             <table className="w-full ">
//               <tbody>
//                 {Object.keys(profile).map((key, index) => (
//                   <tr
//                     key={index}
//                     className="border-t first:border-t-0 border-slate-400 last:border-b-0 "
//                   >
//                     <th className="bg-slate-900 p-4 text-base capitalize text-slate-100">
//                       {key}
//                     </th>
//                     <td className="px-4 py-2">{profile[key]}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       ) : (
//         <Loading />
//       )}
//     </main>
//   );
// };

// export default Profile;

import React, { useState, useEffect } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockUser = {
    userType: "student",
    name: "John Smith",
    role: "Student",
    _id: "123",
  };

  const mockProfile = {
    name: "John Smith",
    email: "john.smith@university.edu",
    studentId: "ST2024001",
    division: "Division A",
    department: "Electronics & Telecommunication",
    course: "B.Tech",
    semester: "6th Semester",
    batch: "2021-2025",
    contactNumber: "+1 (555) 123-4567",
    address: "123 University Avenue, Academic City",
    attendance: "85%",
    cgpa: "8.9",
  };

  useEffect(() => {
    setTimeout(() => {
      setProfile(mockProfile);
      setIsLoading(false);
    }, 1000);
  }, []);

  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3">
      <div className="w-5 h-5 mt-1 text-violet-500">{icon}</div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base text-gray-900">{value}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="h-24 w-24 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="mt-4 h-6 w-full bg-gray-300 rounded animate-pulse"></div>
          <div className="mt-2 h-4 w-full bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-24 w-24 md:h-32 md:w-32 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center text-xl font-bold">
              🎓
            </div>
            <div className="absolute bottom-2 right-2 bg-violet-500 text-white px-2 py-1 text-xs rounded">
              {mockUser.userType}
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-sm bg-gray-200 rounded">
                {mockUser.role}
              </span>
              <span className="px-2 py-1 text-sm bg-gray-200 rounded">
                {profile.studentId}
              </span>
              <span className="px-2 py-1 text-sm bg-gray-200 rounded">
                CGPA: {profile.cgpa}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold text-lg">Academic Information</h3>
          <div className="space-y-4 mt-4">
            <InfoRow label="Department" value={profile.department} />
            <InfoRow label="Course" value={profile.course} />
            <InfoRow label="Division" value={profile.division} />
            <InfoRow label="Batch" value={profile.batch} />
            <InfoRow label="Semester" value={profile.semester} />
          </div>
        </div>
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold text-lg">Contact Information</h3>
          <div className="space-y-4 mt-4">
            <InfoRow label="Email" value={profile.email} />
            <InfoRow label="Phone" value={profile.contactNumber} />
            <InfoRow label="Address" value={profile.address} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
