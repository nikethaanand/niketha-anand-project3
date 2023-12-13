import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Topbar from '../Navbar/topBar';
import axios from 'axios';
import ImageUploadForm from './input';
import './homepage.css';
import moment from 'moment';
import Allposts from './allposts';
import EditIcon from '@mui/icons-material/Edit';

const HomePage = () => {
  const [userName, setUsername] = useState('');
  const [fetchedImages, setFetchedImages] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getUsernamefromCookie() {
    try {
      const response = await axios.get('/api/twitter/isLoggedIn');
      if (response.data.username) {
        setUsername(response.data.username);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUsernamefromCookie().then(() => {
      setLoading(false); // Set loading to false after getting the username
    });
  }, []);

  useEffect(() => {
    if (!loading && userName) {
      handleGetImages();
    }
  }, [loading, userName]);

  const handleGetImages = async () => {
    try {
      const response = await axios.get('/api/posts/all');
      setFetchedImages(response.data);
    } catch (error) {
      console.error('Error fetching images', error);
    }
  };

  const calculateJoinDuration = (timeCreated) => {
    const postDate = moment(timeCreated);
    const currentDate = moment();
    const duration = moment.duration(currentDate.diff(postDate));
    return duration.humanize();
  };

  if (!userName) {
    return <Allposts />;
  }

  return (
    <>
       <Topbar />
    <div className="container">
      <div className="side-line" />
      <div className="content">
        <div className="nameStyle"> Welcome </div>
        <ImageUploadForm style="createboxstyle" />
        {fetchedImages.length > 0 ? (
          fetchedImages.map((post, index) => (
            <div key={post._id} className="postContainer">
              <div className="postHeader">
                <div className="leftContent">
                  <h3>{post.username}</h3>
                </div>
                <div className="rightContent">
                  {post.username === userName && (
                    <IconButton onClick={() => handleEditPost(post._id)} className="editButton">
                      <EditIcon />
                    </IconButton>
                  )}
                  <p>{calculateJoinDuration(post.timeCreated)} Ago</p>
                </div>
              </div>
              <p className="postContent">{post.postContent}</p>
              {post.selectedImage ? (
                <div className="imageContainer">
                  <img
                    src={`data:image/jpeg;base64,${post.selectedImage}`}
                    alt="Post Image"
                    className="postImage"
                  />
                </div>
              ) : null}
              
              {index < fetchedImages.length - 1 && <hr className="horizontalLine" />}
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="side-line" />
    </div>
    </>
  );
};

export default HomePage;
