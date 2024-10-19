import React, { useState, useEffect } from 'react';
import { ParkingZone, LogEntry } from './types';
import ZoneTable from './components/ZoneTable';
import LogForm from './components/LogForm';
import AddZoneForm from './components/AddZoneForm';
import { PlusCircle } from 'lucide-react';

const App: React.FC = () => {
  const [parkingZones, setParkingZones] = useState<ParkingZone[]>([]);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [showAddZoneForm, setShowAddZoneForm] = useState(false);

  useEffect(() => {
    // Load initial data from localStorage or use default data
    const storedZones = localStorage.getItem('parkingZones');
    const storedLogs = localStorage.getItem('logEntries');
    
    if (storedZones) {
      setParkingZones(JSON.parse(storedZones));
    } else {
      setParkingZones([
        { id: '1', name: 'Zone A', capacity: 100, carsIn: 0, carsOut: 0 },
        { id: '2', name: 'Zone B', capacity: 150, carsIn: 0, carsOut: 0 },
      ]);
    }

    if (storedLogs) {
      setLogEntries(JSON.parse(storedLogs));
    }
  }, []);

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem('parkingZones', JSON.stringify(parkingZones));
    localStorage.setItem('logEntries', JSON.stringify(logEntries));
  }, [parkingZones, logEntries]);

  const handleLogSubmit = (entry: Omit<LogEntry, 'id' | 'dateTime'>) => {
    const newEntry: LogEntry = {
      ...entry,
      id: Date.now().toString(),
      dateTime: new Date().toISOString(),
    };

    setLogEntries([...logEntries, newEntry]);

    // Update parking zone data
    setParkingZones(zones =>
      zones.map(zone => {
        if (zone.id === entry.zoneId) {
          return {
            ...zone,
            carsIn: entry.type === 'In' ? zone.carsIn + entry.carCount : zone.carsIn,
            carsOut: entry.type === 'Out' ? zone.carsOut + entry.carCount : zone.carsOut,
          };
        }
        return zone;
      })
    );
  };

  const handleAddZone = (newZone: Omit<ParkingZone, 'id'>) => {
    const zoneWithId: ParkingZone = {
      ...newZone,
      id: Date.now().toString(),
      carsIn: 0,
      carsOut: 0,
    };
    setParkingZones([...parkingZones, zoneWithId]);
    setShowAddZoneForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Parking Zone Management System</h1>
      <div className="max-w-4xl mx-auto">
        <ZoneTable zones={parkingZones} />
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Log Cars</h2>
          <LogForm zones={parkingZones} onSubmit={handleLogSubmit} />
        </div>
        <div className="mt-8">
          <button
            className="flex items-center justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setShowAddZoneForm(true)}
          >
            <PlusCircle className="mr-2" size={20} />
            Add New Zone
          </button>
        </div>
        {showAddZoneForm && (
          <div className="mt-4">
            <AddZoneForm onSubmit={handleAddZone} onCancel={() => setShowAddZoneForm(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;