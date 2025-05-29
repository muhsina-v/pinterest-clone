import { useEffect, useState } from 'react';
import axios from 'axios';

interface Pin {
  _id: string;
  title: string;
  description: string;
  image: string;
}

const AllPins = () => {
  const [pins, setPins] = useState<Pin[]>([]); 

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/user/pin');
        setPins(res.data.pins);
      } catch (error) {
        console.error('Failed to fetch pins:', error);
      }
    };

    fetchPins();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {pins.map((pin) => (
        <div key={pin._id} className="border rounded shadow p-4">
          <img
            src={`http://localhost:3000/uploads/${pin.image}`}
            alt={pin.title}
            className="w-full h-48 object-cover rounded"
          />
          <h3 className="mt-2 font-bold text-lg">{pin.title}</h3>
          <p className="text-gray-600">{pin.description}</p>
        </div>
      ))}
    </div>
  );
};

export default AllPins;
