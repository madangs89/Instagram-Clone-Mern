import React, { useState } from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  addPost,
  addReel,
  addStory,
} from "../../Redux/Services/mediaUploadThunk";

import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const UploadComponent = () => {
  const [activeTab, setActiveTab] = useState("story");
  const [storyFile, setStoryFile] = useState(null);
  const [reelFile, setReelFile] = useState(null);
  const [postFiles, setPostFiles] = useState([]);
  const [caption, setCaption] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sliceData = useSelector((state) => state.mediaUpload);

  const handleStoryChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setStoryFile(file);
    }
  };

  const handleReelChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type.startsWith("video/")) {
      setReelFile(file);
    } else {
      alert("Only video files are allowed for Reels.");
    }
  };

  const handlePostChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const isAllImages = files.every((file) => file.type.startsWith("image/"));
    const isAllVideos = files.every((file) => file.type.startsWith("video/"));
    if (!isAllImages && !isAllVideos) {
      alert("Please upload either all images or all videos (not both).");
      return;
    }
    setPostFiles(files);
  };

  const getMediaType = (file) => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    return "unknown";
  };

  const getPostMediaType = () => {
    if (postFiles.length === 0) return "none";
    return postFiles[0].type.startsWith("image/") ? "image" : "video";
  };

  const renderPreview = (file) => {
    const type = getMediaType(file);
    const url = URL.createObjectURL(file);

    if (type === "image") {
      return (
        <img
          src={url}
          alt="preview"
          className="w-full max-h-80 object-contain rounded"
        />
      );
    } else if (type === "video") {
      return <video src={url} controls className="w-full max-h-80 rounded" />;
    } else {
      return <p className="text-sm text-red-500">Unsupported file</p>;
    }
  };

  const handleUpload = async () => {
    switch (activeTab) {
      case "story":
        if (storyFile && caption) {
          const mediaType = getMediaType(storyFile);
          const formData = new FormData();
          formData.append("media", storyFile);
          formData.append("caption", caption);
          formData.append("mediaType", mediaType);
          try {
            const data = await dispatch(addStory(formData));
            if (data.payload.success) {
              toast.success("Story uploaded successfully.");
              setCaption("");
              setStoryFile(null);
              navigate("/");
              return;
            }
            toast.error("Failed to upload story. Please Try Again");
          } catch (error) {
            console.error("Error uploading story:", error);
          }
        }
        break;
      case "reel":
        if (reelFile && caption) {
          const formData = new FormData();
          formData.append("reel", reelFile);
          formData.append("caption", caption);
          try {
            const data = await dispatch(addReel(formData));
            if (data.payload.success) {
              toast.success("Reel uploaded successfully.");
              setCaption("");
              setReelFile(null);
              navigate("/");
              return;
            }
            console.log(data, "reel data");
            toast.error("Failed to Reel story. Please Try Again");
          } catch (error) {
            console.error("Error uploading Reel:", error);
          }
        }
        break;
      case "post":
        if (postFiles.length > 0 && caption) {
          const formData = new FormData();
          formData.append("caption", caption);
          postFiles.forEach((file) => {
            formData.append("media", file); // same key name for all
          });
          formData.append("mediaType", getPostMediaType());
          try {
            const data = await dispatch(addPost(formData));
            if (data.payload.success) {
              toast.success("Post uploaded successfully.");
              setCaption("");
              setPostFiles([]);
              navigate("/");
              return;
            }
            console.log(data, "Post data");
            toast.error("Failed to Post story. Please Try Again");
          } catch (error) {
            console.error("Error uploading Post:", error);
          }
        }
        break;
      default:
        break;
    }
  };
  return (
    <div className=" overflow-y-auto bg-black text-white p-4">
      {/* Tab Selector */}
      <div className="flex justify-around mb-4 border-b border-gray-700">
        {["story", "reel", "post"].map((tab) => (
          <button
            key={tab}
            className={`py-2 px-4 capitalize ${
              activeTab === tab
                ? "border-b-2 border-white font-semibold"
                : "text-gray-400"
            }`}
            onClick={() => {
              setActiveTab(tab);
              setCaption("");
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Caption */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400"
        />
      </div>

      {/* Upload Area */}
      <div className="space-y-4">
        {activeTab === "story" && (
          <div>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleStoryChange}
              className="block w-full text-sm text-gray-300"
            />
            {storyFile && (
              <div className="mt-4 space-y-2">
                {renderPreview(storyFile)}
                <p className="text-sm text-gray-400">
                  Type: {getMediaType(storyFile)}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "reel" && (
          <div>
            <input
              type="file"
              accept="video/*"
              onChange={handleReelChange}
              className="block w-full text-sm text-gray-300"
            />
            {reelFile && (
              <div className="mt-4 space-y-2">
                {renderPreview(reelFile)}
                <p className="text-sm text-gray-400">Type: video</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "post" && (
          <div>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handlePostChange}
              className="block w-full text-sm text-gray-300"
            />
            {postFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-400">
                  Type: {getPostMediaType()}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {postFiles.map((file, idx) => (
                    <div key={idx} className="rounded overflow-hidden">
                      {renderPreview(file)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {((activeTab === "story" && storyFile && caption) ||
        (activeTab === "reel" && reelFile && caption) ||
        (activeTab === "post" && postFiles.length > 0 && caption)) && (
        <div className="mt-6">
          <Button
            onClick={handleUpload}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            {sliceData.story.loading ||
            sliceData.reel.loading ||
            sliceData.post.loading ? (
              <Loader />
            ) : (
              `Upload ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadComponent;
