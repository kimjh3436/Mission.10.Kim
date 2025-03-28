import { useEffect, useState } from 'react';
import './BowlersList.css';

// Interface for the bowler data structure
interface Bowler {
  bowlerId: number;
  bowlerAddress: string;
  bowlerCity: string;
  bowlerState: string;
  bowlerZip: string;
  bowlerFirstName: string;
  bowlerLastName: string;
  bowlerPhoneNumber: string;
  bowlerMiddleInit: string | null;
  teamName: string | null;
}

const BowlersList = () => {
  const [bowlers, setBowlers] = useState<Bowler[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bowler data from the backend API
  useEffect(() => {
    fetch('http://localhost:5265/api/bowlers')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setBowlers(data);
        } else {
          throw new Error('Data is not an array');
        }
      })
      .catch((err) => {
        console.error('Error fetching bowlers:', err);
        setError('Failed to load bowler data.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter only bowlers from "Marlins" or "Sharks"
  const filteredBowlers = bowlers.filter(
    (bowler) => bowler.teamName === 'Marlins' || bowler.teamName === 'Sharks'
  );

  return (
    <div>
      {loading && <p>Loading bowlers...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table className="bowler-table">
          <thead>
            <tr>
              <th>Bowler Name</th>
              <th>Team Name</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zip</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredBowlers.map((bowler) => (
              <tr key={bowler.bowlerId}>
                <td>
                  {bowler.bowlerFirstName}{' '}
                  {bowler.bowlerMiddleInit && `${bowler.bowlerMiddleInit} `}{' '}
                  {bowler.bowlerLastName}
                </td>
                <td>{bowler.teamName}</td>
                <td>{bowler.bowlerAddress}</td>
                <td>{bowler.bowlerCity}</td>
                <td>{bowler.bowlerState}</td>
                <td>{bowler.bowlerZip}</td>
                <td>{bowler.bowlerPhoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BowlersList;
