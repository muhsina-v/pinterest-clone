import React from "react";
import axiosInstance from "../../utils/axios";


interface Pin {
  _id: string;
  title: string;
  image: string;
  description?: string;
  link?: string;
}

interface EditFormData {
  title: string;
  description: string;
  link: string;
}

interface EditPinModalProps {
  pin: Pin;
  editFormData: EditFormData;
  isEditLoading: boolean;
  onEditSubmit: (e: React.FormEvent) => void;
  onEditCancel: () => void;
  onEditFormChange: (field: keyof EditFormData, value: string) => void;
  onDelete: (pinId: string) => void;
}

const EditPinModal: React.FC<EditPinModalProps> = ({
  pin,
  editFormData,
  isEditLoading,
  onEditSubmit,
  onEditCancel,
  onEditFormChange,
  onDelete,
}) => {
  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this pin? This action cannot be undone.")) {
      onDelete(pin._id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Edit Pin</h2>
            <button
              onClick={onEditCancel}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Pin Preview */}
          <div className="mb-6">
            <img
              src={pin.image || "https://via.placeholder.com/200"}
              alt={pin.title || "Pin"}
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>

          {/* Edit Form */}
          <form onSubmit={onEditSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={editFormData.title}
                onChange={(e) => onEditFormChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-colors"
                placeholder="Add a title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={editFormData.description}
                onChange={(e) => onEditFormChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-colors resize-none"
                placeholder="What's your Pin about?"
              />
            </div>

            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                Link
              </label>
              <input
                type="url"
                id="link"
                value={editFormData.link}
                onChange={(e) => onEditFormChange('link', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-colors"
                placeholder="Add a destination link"
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onEditCancel}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-full transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEditLoading}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
              <button
                type="button"
                onClick={handleDeleteClick}
                className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-full transition-colors duration-200"
              >
                Delete Pin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPinModal;