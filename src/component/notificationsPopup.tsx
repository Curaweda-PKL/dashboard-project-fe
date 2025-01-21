import { IoAlertCircleOutline } from "react-icons/io5";

interface Notification {
  id: number;
  message: string;
}

const notifications: Notification[] = [
  { id: 1, message: "New user registered" },
  { id: 2, message: "System update completed" },
  { id: 3, message: "New message from Sarah" },
  { id: 4, message: "Meeting scheduled for 2025-01-10" },
  { id: 5, message: "Password changed successfully" },
  { id: 6, message: "New comment on your post" },
  { id: 7, message: "Database backup completed" },
  { id: 8, message: "Error report received" },
  { id: 9, message: "Server maintenance scheduled" },
  { id: 10, message: "New update available" },
  { id: 11, message: "Security alert: Suspicious login attempt" },
  { id: 12, message: "Invoice #1023 generated" },
  { id: 13, message: "User account deactivated" },
  { id: 14, message: "New user registered" },
  { id: 15, message: "System update completed" },
  { id: 16, message: "New message from Sarah" },
  { id: 17, message: "Meeting scheduled for 2025-01-10" },
  { id: 18, message: "Password changed successfully" },
  { id: 19, message: "New comment on your post" },
  { id: 20, message: "Database backup completed" },
  // Add more notifications here
];

const NotificationsPopup = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        {/* Title with black background full width */}
        <div className="absolute top-0 left-0 right-0 bg-black text-white py-2 flex justify-center items-center rounded-lg">
          <h3 className="text-xl font-semibold">Notifications</h3>
        </div>

        {/* Notifications Wrapper with no top border */}
        <div className="pt-10 border-l border-r border-b border-gray-300 p-4 space-y-4 rounded-b-lg w-full max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div key={notification.id} className="border-b pb-2 flex items-start space-x-2">
              {/* Warning Icon */}
              <IoAlertCircleOutline className="text-black-500 text-lg mt-1" />
              <div>
                <p className="text-sm">{notification.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Ok Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="bg-[#6D6D6D] text-white font-bold px-10 py-2 rounded-full hover:bg-[#494949]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPopup;
