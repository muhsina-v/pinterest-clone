import React, { useEffect, useState } from "react";
import ProfilePage from "./Profile.tsx"; 
import {
  FollowButton,
  FollowCount,
  FollowerList,
} from "../../component/follow.tsx";

const ProfileWithFollow: React.FC = () => {
  const [user, setUser] = useState<any>({});
  const [loggedInUser, setLoggedInUser] = useState<any>({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    setLoggedInUser(stored);

    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get("id") || stored._id;
    setUser({ ...stored, _id: profileId });
  }, []);

  if (!user?._id) return null;

  return (
    <div>
      <div className="pt-24 px-4 max-w-6xl mx-auto mb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <FollowCount userId={user._id} />
          {user._id !== loggedInUser._id && (
            <FollowButton targetUserId={user._id} />
          )}
        </div>
        <FollowerList userId={user._id} />
      </div>

      <ProfilePage />
    </div>
  );
};

export default ProfileWithFollow;
