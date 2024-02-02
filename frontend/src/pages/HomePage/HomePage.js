import "./HomePage.css";
import M from "materialize-css";
import React, { useState, useEffect } from "react";

export const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/post/all", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        setPosts(jsonResponse.allPosts);
      })
      .catch((error) => {
        M.toast({
          html: "Error getting all posts",
          classes: "#c62828 red darken-3",
        });
      });
  }, []);

  return (
    <div className="home-container">
      <div className="row">
        {posts.map((post) => {
          return (
            <div className="col s12 m12 l12" key={post._id}>
              <div className="card home-card">
                <h6 style={{ padding: "2%" }}>{post.author.name}</h6>
                <div className="card-image">
                  <img src={post.imageUrl}></img>
                </div>
                <div className="card-content">
                  <h6 className="card-title">{post.title}</h6>
                  <p>{post.body}</p>
                </div>
                <div className="card-action">
                  <i className="material-icons" style={{ color: "red" }}>
                    favorite
                  </i>
                  <input
                    type="text"
                    placeholder="Enter your comment ..."
                  ></input>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
