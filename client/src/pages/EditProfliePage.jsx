import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../Redux/Services/UserThunk";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Deloper/Loader";
const EditProfile = () => {
  const user = useSelector((state) => state.user); // Assuming user slice has current user data
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    userName: user?.userName || "",
    bio: user?.bio || "",
    website: user?.website || "",
    gender: user?.gender || "",
  });
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(user?.avatar || null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [disable, setDisable] = useState(false);

  // Handle text and select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); // preview
      setSelectedFile(file); // save actual file for upload
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    if (formData.name != user.name) {
      data.append("name", formData.name);
    }
    if (formData.userName != user.userName) {
      data.append("userName", formData.userName);
    }
    if (formData.bio != user.bio) {
      data.append("bio", formData.bio);
    }
    if (formData.website != user.website) {
      data.append("website", formData.website);
    }
    if (formData.gender != user.gender) {
      data.append("gender", formData.gender);
    }
    if (selectedFile) {
      data.append("avatar", selectedFile); // File for backend multer/cloudinary
    }
    console.log("FormData ready to send:", formData, selectedFile);
    try {
      const newData = await dispatch(updateUser(data));
      if (newData?.payload?.success) {
        toast.success("Profile updated successfully.");
        navigate("/profile"); // Redirect to profile page after update
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  function checkButtonDisabled() {
    return (
      user.loading ||
      (formData.name == user.name &&
        formData.userName == user.userName &&
        formData.bio == user.bio &&
        formData.website == user.website &&
        formData.gender == user.gender &&
        !selectedFile)
    );
  }

  useEffect(() => {
    setDisable(checkButtonDisabled());
  }, [formData,  user , selectedFile]);

  return (
    <div className="bg-black text-white overflow-x-hidden flex-1 overflow-y-scroll h-screen w-full flex items-center justify-center">
      <div className="w-full max-w-md px-4 mt-24 py-24 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Edit Profile
        </h1>

        {/* Profile image */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white"
            />
            <label className="absolute bottom-0 right-0 bg-white text-black px-2 py-1 text-xs rounded cursor-pointer">
              Change
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm block mb-1">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-neutral-900 border border-neutral-700 px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Username</label>
            <input
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full bg-neutral-900 border border-neutral-700 px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full bg-neutral-900 border border-neutral-700 px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Website</label>
            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full bg-neutral-900 border border-neutral-700 px-4 py-2 rounded"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-neutral-900 border border-neutral-700 px-4 py-2 rounded"
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <Button
            disabled={disable}
            type="submit"
            className="w-full mt-4 flex items-center justify-center bg-blue-600 hover:bg-blue-700"
          >
            {user.loading ? <Loader /> : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
