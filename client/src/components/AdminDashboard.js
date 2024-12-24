import React, { useState, useEffect } from 'react';
import axios from '../api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [pendingVideos, setPendingVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/admin/pending-videos')
      .then((response) => {
        setPendingVideos(response.data);
      })
      .catch(() => {
        navigate('/login');  // Redirect if not authorized
      });
  }, [navigate]);

  const approveVideo = (videoId) => {
    axios.post('/admin/approve-video', { videoId }).then(() => {
      setPendingVideos(pendingVideos.filter(video => video.videoId !== videoId));
    });
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {pendingVideos.length ? (
        <ul>
          {pendingVideos.map((video) => (
            <li key={video.videoId}>
              <iframe
                width="300"
                height="200"
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title={`Video ${video.videoId}`}  // Unique title for each iframe
              />
              <button onClick={() => approveVideo(video.videoId)}>Approve</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending videos</p>
      )}
    </div>
  );
};

export default AdminDashboard;

