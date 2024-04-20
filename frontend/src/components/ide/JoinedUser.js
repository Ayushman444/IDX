import React, { useState } from 'react';
import { FaCheck, FaTimes, FaVolumeMute, FaVolumeUp, FaUserTimes } from 'react-icons/fa';

export const JoinedUser = ({ username, access }) => {
  const [muted, setMuted] = useState(false);

  const handleMuteToggle = () => {
    setMuted(!muted);
  };

  return (
    <div className={`joined-user ${access ? 'bg-green-400' : 'bg-red-300'}`}>
      <div>{username}</div>
      <div className="icons">
        {access ? (
          <FaCheck className="access-icon" />
        ) : (
          <FaTimes className="access-icon" />
        )}
        {muted ? (
          <FaVolumeMute className="mute-icon" onClick={handleMuteToggle} />
        ) : (
          <FaVolumeUp className="mute-icon" onClick={handleMuteToggle} />
        )}
        <FaUserTimes className="kick-icon" />
      </div>
    </div>
  );
};
