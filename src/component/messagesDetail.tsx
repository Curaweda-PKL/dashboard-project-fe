import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const MessageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Ambil ID dari URL
  const navigate = useNavigate();

  // Simulasi data pesan berdasarkan ID
  const messages = [
    { 
      id: 1, 
      name: "Randy Mango", 
      content: "For the TourO Web Development team", 
      date: "10 Des", 
      avatar: "https://via.placeholder.com/40", 
      note: "This is an additional note for the message. It contains more details or instructions related to the message, such as follow-up tasks or information that may be relevant. This note might be quite long as well and will be tested for how it wraps inside the card without overflowing or distorting the layout. This is a very long message that goes on and on to test how the content will behave when there is a lot of text. Let's see if the text overflows and how it will handle such a long message. Also, let's test if it fits within the card properly and wraps accordingly. hhshdfhsodhdf hosdhohsdu hioshffdsoiuh hiosdhogsh hoshdfhs hsohfosh oshdoghos uohshgfo s"
    },
    { 
      id: 2, 
      name: "Jaydon Press", 
      content: "For the Designing team", 
      date: "10 Jan", 
      avatar: "https://via.placeholder.com/40", 
      note: "The design review meeting is scheduled at 3 PM."
    },
    // Tambahkan data lainnya
  ];

  const message = messages.find((msg) => msg.id === Number(id));

  if (!message) {
    return <p>Message not found.</p>; // Tampilkan jika ID tidak valid
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        {/* Nama dan Foto Profil */}
        <div className="flex items-center space-x-4">
          <img
            src={message.avatar} // Foto profil
            alt={message.name}
            className="w-10 h-10 rounded-full border border-gray-300"
          />
          <h2 className="text-lg font-bold text-gray-800">{message.name}</h2>
        </div>
        {/* Tanggal */}
        <p className="text-lg font-bold text-gray-800">{message.date}</p>
      </div>

      {/* Pesan */}
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="bg-[#D9D9D9] border border-gray-300 rounded-lg p-6 w-[400px] h-auto flex flex-col justify-start">
          {/* Content yang berada di atas */}
          <p className="text-black text-center font-bold mb-4">{message.content}</p>

          {/* Pesan tambahan (Note) yang panjang */}
          <p className="text-gray-700 text-left text-sm italic">{message.note}</p>
        </div>
      </div>

      {/* Tombol Kembali */}
      <button
        onClick={() => navigate(-1)} // Navigasi kembali
        className="absolute bottom-14 right-14 bg-[#02CCFF] hover:bg-blue-400 text-black font-bold py-3 px-10 rounded-full"
      >
        Back
      </button>
    </div>
  );
};

export default MessageDetail;
