import React, { useState, useEffect } from "react";
import "./CreatePost.css";
import M from "materialize-css";
import { useNavigate } from "react-router-dom";

export const CreatePost = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (imageUrl) {
      fetch("/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          title,
          body: postBody,
          imageUrl: imageUrl,
        }),
      })
        .then((response) => response.json())
        .then((jsonResponse) => {
          if (jsonResponse.error) {
            M.toast({
              html: jsonResponse.error,
              classes: "#c62828 red darken-3",
            });
          } else if (jsonResponse.success) {
            M.toast({
              html: "Post created",
              classes: "#2e7d32 green darken-3",
            });
            navigate("/");
          }
        })
        .catch((error) => {
          M.toast({
            html: "Error. Contact admin",
            classes: "#c62828 red darken-3",
          });
        });
    }
  }, [imageUrl]);

  const createPost = () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "tech-medium-upload");
    formData.append("cloud_name", "dh0uqnyks");

    fetch("https://api.cloudinary.com/v1_1/dh0uqnyks/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        // cannot upload to cloudinary
        if (jsonResponse.error) {
          M.toast({
            html: "Error. Contact admin",
            classes: "#c62828 red darken-3",
          });
        }

        setImageUrl(jsonResponse.url);
      })
      .catch((err) => {
        M.toast({
          html: "Error. Contact admin",
          classes: "#c62828 red darken-3",
        });
      });
  };

  return (
    <div className="row ">
      <div className="col s12 m12 l12">
        <div className="card create-post-card">
          <span className="card-title">Create New Post</span>
          <div className="card-content "></div>

          <input
            id="post-title"
            type="text"
            className="validate"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            id="post-body"
            className="materialize-textarea"
            placeholder="Enter body"
            value={postBody}
            onChange={(e) => setPostBody(e.target.value)}
          ></textarea>

          <div className="file-field input-field">
            <div className="btn">
              <span>File</span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>

          <div className="card-action">
            <button
              onClick={() => createPost()}
              className="btn waves-effect waves-light yellow darken-4"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
