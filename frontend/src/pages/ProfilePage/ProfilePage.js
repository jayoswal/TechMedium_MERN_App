import "./ProfilePage.css";
import { UserContext } from "../../App";
import { useContext, useState, useEffect } from "react";
import M from "materialize-css";

export const ProfilePage = () => {
  const { state, dispatch } = useContext(UserContext);

  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    fetch("/post/myPost", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        setMyPosts(jsonResponse.allPosts);
      })
      .catch((error) => {
        M.toast({
          html: "Error. Contact admin",
          classes: "#c62828 red darken-3",
        });
      });
  }, []);

  return (
    <div className="main-container">
      <div className="profile-container">
        <div>
          <img
            style={{ width: "170px", height: "170px", borderRadius: "50%" }}
            src="https://images.unsplash.com/photo-1552058544-f2b08422138a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29ufGVufDB8fDB8fHww"
          ></img>
        </div>

        <div className="details-section">
          <h4>{state.name}</h4>

          <div className="followings">
            <h6>20 Articles</h6>
            <h6>20 Views</h6>
            <h6>20 Followers</h6>
          </div>
        </div>
      </div>

      <div className="posts">
        <div className="row">
          {myPosts.map((mypost) => {
            return (
              <div className="col s12 m6 l6" key={mypost._id}>
                <div className="card">
                  <div className="card-image post-image">
                    <img src={mypost.imageUrl} />
                  </div>
                  <div className="card-content">
                    <span className="card-title">{mypost.title}</span>
                    <p>{mypost.body}</p>
                  </div>
                  <div className="card-action">
                    <a href="#">TODO</a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* <div className="row">
        <div className="col s12 m6 l8">
        POSTS
        <div className="row">
                <div className="col s12 m6 l6">
                    post1
                </div>
                <div className="col s12 m6 l6">
                    post2
                </div>
            </div>
        </div>
        <div className="col s12 m6 l4">
        PROFILE
            
        </div>

        </div> */}
    </div>
  );
};
