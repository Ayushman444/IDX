import React from 'react'
import { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import "../App.css"
import useLogout from '../api/logout';
import './Home.css'

export const Home = () => {
    const navigate = useNavigate();
    const {logout} = useLogout();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & username is required');
            return;
        }

        // Redirect
        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handlelogout = async(e) => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed", error.message);
        }
    }

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    
  return (
    <div className="homePageWrapper relative">
            <div className='absolute text-xl font-bold top-3 right-[44%]'>
                <h1>Hello Dummy User</h1>
            </div>
            <div className='absolute top-1 right-10' >
                
                <button onClick={handlelogout} className="btn btn-outline btn-accent border border-rounded border-white rounded-lg">Logout</button>
            </div>
            <div className="formWrapper">
                {/* <img
                    className="homePageLogo"
                    src="/code-sync.png"
                    alt="code-sync-logo"
                /> */}
                <div className='text-5xl'>IDx</div>
                <h4 className="mainLabel">Paste invitation ROOM ID</h4>
                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="ROOM ID"
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="USERNAME"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <button className="btn joinBtn" onClick={joinRoom}>
                        Join
                    </button>
                    <span className="createInfo">
                        If you don't have an invite then create &nbsp;
                        <a
                            onClick={createNewRoom}
                            href=""
                            className="createNewBtn"
                        >
                            new room
                        </a>
                    </span>
                </div>
            </div>
        </div>
  )
}
