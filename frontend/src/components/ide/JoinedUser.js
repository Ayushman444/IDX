import React, { useState } from 'react';
import { FaCheck, FaTimes, FaVolumeMute, FaVolumeUp, FaUserTimes } from 'react-icons/fa';
import { LuArrowUpRightFromCircle } from "react-icons/lu";


// export const JoinedUser = ({ username, access }) => {
//   const [muted, setMuted] = useState(false);

//   const handleMuteToggle = () => {
//     setMuted(!muted);
//   };

//   return (
//     <div className={`joined-user ${access ? 'access-granted' : 'access-denied'}`}>
//       <div>{username}</div>
//       <div className="icons">
//         {access ? (
//           <FaCheck className="access-icon" />
//         ) : (
//           <FaTimes className="access-icon" />
//         )}
//         {muted ? (
//           <FaVolumeMute className="mute-icon" onClick={handleMuteToggle} />
//         ) : (
//           <FaVolumeUp className="mute-icon" onClick={handleMuteToggle} />
//         )}
//         <FaUserTimes className="kick-icon" />
//       </div>
//     </div>
//   );
// };
export const JoinedUser = ({ client }) => {
  return (
    <div className='flex flex-col items-center justify-between p-1 border border-gray-300 rounded w-full'>
      <span className='text-lg truncate'>{client}</span>
      <div className='flex justify-around w-full mt-2'>
        <FaCheck className='text-green-500 cursor-pointer text-lg' onClick={() => console.log(`Access granted to ${client}`)} />
        <LuArrowUpRightFromCircle className='text-red-500 cursor-pointer text-lg' onClick={() => console.log(`User ${client} kicked`)} />
      </div>
    </div>
  );
};