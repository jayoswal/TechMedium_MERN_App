import "./HomePage.css";
import M from "materialize-css";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";

export const HomePage = () => {
  const [posts, setPosts] = useState([]);

  const { state, dispatch } = useContext(UserContext);

  // since pathch returned object only contains author's id and not name
  // used .populate instead in banckend post route
  const updatedPostWithAuthorInfo = (updatedPost, oldPost) => {
    const { author: oldAuthor, ...restOfOldPost } = oldPost;

    const updatedPostWithOldAuthor = {
      ...updatedPost,
      author: oldAuthor,
    };
    return updatedPostWithOldAuthor;
  };

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

  const voting = (postId, apiEndpoint) => {
    fetch(apiEndpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        postId: postId,
      }),
    })
      .then((response) => response.json())
      .then((updatedPost) => {
        setPosts((posts) => {
          return posts.map((oldPost) =>
            oldPost._id === updatedPost.success._id
              ? updatedPost.success
              : oldPost
          );
        });
      })
      .catch((error) => {
        M.toast({
          html: "Error Voting",
          classes: "#c62828 red darken-3",
        });
      });
  };

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
                  <i
                    className="material-icons"
                    style={{ marginRight: "1%", cursor: "pointer" }}
                  >
                    turned_in_not
                  </i>

                  {/* if user in upvote */}
                  {post.upvote.includes(state._id) ? (
                    <>
                      <i
                        className="material-icons"
                        style={{
                          marginRight: "1%",
                          color: "#000000",
                        }}
                      >
                        arrow_upward
                      </i>
                      <i
                        onClick={() => voting(post._id, "/post/downvote")}
                        className="material-icons"
                        style={{ cursor: "pointer", color: "#bdbdbd" }}
                      >
                        arrow_downward
                      </i>
                    </>
                  ) : post.downvote.includes(state._id) ? (
                    <>
                      <i
                        onClick={() => voting(post._id, "/post/upvote")}
                        className="material-icons"
                        style={{
                          marginRight: "1%",
                          cursor: "pointer",
                          color: "#bdbdbd",
                        }}
                      >
                        arrow_upward
                      </i>
                      <i
                        className="material-icons"
                        style={{ color: "#000000" }}
                      >
                        arrow_downward
                      </i>
                    </>
                  ) : (
                    <>
                      <i
                        onClick={() => voting(post._id, "/post/upvote")}
                        className="material-icons"
                        style={{
                          marginRight: "1%",
                          cursor: "pointer",
                          color: "#bdbdbd",
                        }}
                      >
                        arrow_upward
                      </i>
                      <i
                        onClick={() => voting(post._id, "/post/downvote")}
                        className="material-icons"
                        style={{ cursor: "pointer", color: "#bdbdbd" }}
                      >
                        arrow_downward
                      </i>
                    </>
                  )}

                  <h6>{post.upvote.length - post.downvote.length} Vote</h6>
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
