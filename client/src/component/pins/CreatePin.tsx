import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreatePin: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  // Create and revoke object URL for image preview
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      setMessage('Please upload an image');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('link', link);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token');

      await axios.post('http://localhost:3000/api/user/pin', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Pin uploaded successfully!');
      setTitle('');
      setDescription('');
      setLink('');
      setImage(null);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-start p-10 mt-24">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-5xl bg-white border rounded-lg shadow-md p-6 gap-8"
      >
        {/* Left side: Image upload */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 w-[320px] h-[480px] rounded-lg overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <label className="flex flex-col items-center justify-center h-full cursor-pointer px-4 text-center text-gray-500">
              <input
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setImage(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
              <span className="text-4xl mb-2">⬆️</span>
              <span>Choose a file or drag and drop it here</span>
              <p className="text-xs mt-2">Recommended: .jpg files under 20MB</p>
            </label>
          )}
        </div>

        {/* Right side: Details */}
        <div className="flex-1 space-y-4">
          <input
            type="text"
            placeholder="Add a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
          <textarea
            placeholder="Add a detailed description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-3 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
          <input
            type="text"
            placeholder="Add a link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg text-lg font-medium"
          >
            Upload Pin
          </button>
          {message && (
            <p className="text-sm text-gray-700 mt-2">{message}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreatePin;
