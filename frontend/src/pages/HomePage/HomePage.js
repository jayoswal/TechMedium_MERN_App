import "./HomePage.css";
import M from "materialize-css";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";

export const HomePage = () => {
  const [posts, setPosts] = useState([]);

  const { state, dispatch } = useContext(UserContext);

  // since patch returned object only contains author's id and not name
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
        // intialize modal here
        M.Modal.init(document.querySelectorAll(".modal"));
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

  const [comments, setComments] = useState([]);

  function fetchComments(postId) {
    fetch(`/comment/get/${postId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        setComments(jsonResponse.postComment.comment);
      })
      .catch((error) => {
        M.toast({
          html: error,
          classes: "#c62828 red darken-3",
        });
      });
  }

  const CommentModal = (props) => {
    const addNewComment = (event, postId) => {
      event.preventDefault();
      console.log(
        "Adding new comment for post: ",
        postId,
        "Comment: ",
        event.target[0].value
      );
      event.target[0].value = "";
    };

    return (
      <div className="col s12 m10 l6 offset-m1 offset-l3">
        <ul className="collection">
          <li className="collection-item avatar">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGUlMjBkZWZhdWx0fGVufDB8fDB8fHww"
              alt=""
              className="circle"
            />
            <p>
              <form onSubmit={(event) => addNewComment(event, props.postId)}>
                <input type="text" placeholder="Enter your comment ..."></input>

                <button
                  className="secondary-content btn waves-effect waves-light"
                  type="submit"
                  name="action"
                >
                  <i className="material-icons ">send</i>
                </button>
              </form>
            </p>
          </li>

          {/* loop should start */}
          {comments.map((comment) => {
            return (
              <li className="collection-item avatar" key={comment._id}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHByb2ZpbGUlMjBkZWZhdWx0fGVufDB8fDB8fHww"
                  alt=""
                  className="circle"
                />
                <span className="title">{comment.commentedBy.name}</span>
                <p>{comment.commentBody}</p>
              </li>
            );
          })}

          {/* loop should end here */}
        </ul>
      </div>
    );
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

                  {/* Modal start */}
                  {/* <!-- Modal Trigger --> */}
                  <a
                    className="waves-effect waves-light  modal-trigger"
                    href="#modal1"
                  >
                    <i
                      onClick={() => fetchComments(post._id)}
                      className="material-icons"
                    >
                      insert_comment
                    </i>
                  </a>

                  {/* Modal Content */}
                  <div id="modal1" className="modal bottom-sheet">
                    <div className="modal-content">
                      <div className="row">
                        <CommentModal postId={post._id} />
                      </div>
                    </div>
                  </div>

                  {/* Modal end */}

                  {/* <input
                    type="text"
                    placeholder="Enter your comment ..."
                  ></input> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
