import { useState, useEffect } from "react";
// import tripsData from "./data/trips.js"; // ใช้ data local 
import "./App.css";

function App() {
const [searchText, setSearchText] = useState("");
const [trips, setTrips] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchTrips = async () => {
    if (!searchText.trim()) {
      setTrips([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:4001/trips?keywords=${encodeURIComponent(searchText)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }
      
      const data = await response.json();
      setTrips(data.data || []);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  fetchTrips();
}, [searchText]);

return (

  <div className="App bg-gray-50 min-h-screen">
      <div className="container mx-auto p-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-blue-600 mb-4">
            เที่ยวไหนดี
          </h1>
          <div className="relative w-full max-w-2xl mx-auto ">
            <input
              type="text"
              //className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 transition-colors shadow-sm"
              className="w-full p-4 text-lg border-2 border-0 border-b-2 border-gray-300 
              focus:outline-none focus:outline-non focus:border-blue-500 text-center placeholder:text-center"
              placeholder="หาที่เที่ยวแล้วไปกัน..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </header>

        <main>
          {/* แสดง loading state */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">กำลังค้นหา...</p>
            </div>
          )}

          {/* แสดง error state */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</p>
            </div>
          )}

          {/* แสดงข้อความเมื่อไม่มีการค้นหา */}
          {!searchText.trim() && !loading && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                ค้นหาสถานที่ท่องเที่ยวที่คุณสนใจ
              </h2>
              <p className="text-gray-500">พิมพ์คำที่คุณต้องการค้นหาในช่องด้านบน</p>
            </div>
          )}

          {/* แสดงผลลัพธ์การค้นหา */}
          {searchText.trim() && !loading && !error && trips.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                ไม่พบสถานที่ท่องเที่ยวที่ตรงกับการค้นหา
              </h2>
              <p className="text-gray-500">ลองเปลี่ยนคำค้นหาใหม่</p>
            </div>
          )}

          <div className="grid gap-8">
            {/* วนลูปแสดงผลลัพธ์ */}
            {trips.map((trip) => (
              <div
                key={trip.eid} // ใช้ eid เป็น key
                className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row transform hover:scale-105 transition-transform duration-300 ease-in-out"
              >
                {/* Main Picture */}
                <img
                  src={trip.photos[0]}
                  alt={trip.title}
                  className="w-full md:w-1/3 h-64 md:h-auto object-cover"
                />

                <div className="p-6 flex flex-col justify-between w-full">
                  <div>
                    {/* Trip Name */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {trip.title}
                    </h2>
                    {/* Description */}
                    <p className="text-gray-600 mb-4">
                      {trip.description.substring(0, 100)}...{" "}
                      <a href={trip.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        อ่านต่อ
                      </a>
                    </p>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="font-semibold text-gray-700">Tags:</span>
                      {trip.tags.map((tag, index) => (
                        <span key={index} className=" text-gray-700 text-sm text-opacity-75 underline ">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 2nd Picture */}
                  <div className="flex gap-2 mt-4">
                    {trip.photos.slice(1).map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`${trip.title} ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
