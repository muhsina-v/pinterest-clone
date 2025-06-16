import React, { useEffect, useState } from "react";
import ProfilePage from "./Profile";
import {
  FollowButton,
  FollowCount,
  FollowerList,
  FollowingList,
} from "../../component/follow";
import { useLocation } from "react-router-dom";

const ProfileWithFollow: React.FC = () => {
  const location = useLocation();
  const [profileId, setProfileId] = useState<string>();
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    setLoggedInUser(stored);

    const urlParams = new URLSearchParams(location.search);
    const id = urlParams.get("id") || stored._id;
    setProfileId(id);
  }, [location.search]);

  if (!profileId || !loggedInUser) {
    return <div className="pt-24 px-4 max-w-6xl mx-auto text-center">Loading...</div>;
  }

  return (
    <div className="pt-24 px-4 max-w-6xl mx-auto mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <FollowCount userId={profileId} />
        {profileId !== loggedInUser._id && (
          <FollowButton targetUserId={profileId} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FollowerList userId={profileId} />
        <FollowingList userId={profileId} />
      </div>

      <div className="mt-10">
        <ProfilePage profileId={profileId} loggedInUserId={loggedInUser._id} />
      </div>
    </div>
  );
};

export default ProfileWithFollow;
