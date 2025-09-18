/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const App = () => {
  // Set the target date for the countdown based on the school calendar
  const countdownDate = new Date('2025-12-24T00:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [schoolDaysLeft, setSchoolDaysLeft] = useState(0);

  useEffect(() => {
    const calculateTime = () => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            setIsTimeUp(true);
            return null;
        }
        
        return {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
        };
    };
    
    // Set initial time
    const initialTime = calculateTime();
    if(initialTime) {
        setTimeLeft(initialTime);
    } else {
        setIsTimeUp(true);
    }

    const interval = setInterval(() => {
      const newTime = calculateTime();
      if(newTime) {
        setTimeLeft(newTime);
      } else {
        clearInterval(interval);
      }
    }, 1000);

    const calculateSchoolDays = () => {
        let count = 0;
        const today = new Date();
        // Last day of classes is Dec 19, 2025, according to the calendar's trimester dates.
        const lastSchoolDay = new Date('2025-12-19T23:59:59');

        if (today > lastSchoolDay) {
            return 0;
        }

        // Holidays and recess days from the calendar until vacation
        const nonSchoolDays = new Set([
            '2025-10-15', // Recesso Escolar
            '2025-11-20', // Feriado - Zumbi e Consciência Negra
            '2025-11-21', // Recesso Escolar
        ]);

        let currentDate = new Date(today);
        currentDate.setHours(0, 0, 0, 0); // Start calculation from the beginning of today

        while (currentDate <= lastSchoolDay) {
            const dayOfWeek = currentDate.getDay(); // Sunday - 0, Saturday - 6
            const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;
            
            // Format date to 'YYYY-MM-DD' to check against the Set
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;
            
            if (isWeekday && !nonSchoolDays.has(dateString)) {
                count++;
            }
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return count;
    };

    setSchoolDaysLeft(calculateSchoolDays());

    return () => clearInterval(interval);
  }, [countdownDate]);

  const padNumber = (num) => String(num).padStart(2, '0');

  return (
    <main className="container" role="main" aria-live="polite">
      <header>
        <h1 className="title">Contagem Regressiva para as Férias!</h1>
        
      </header>
      
      {isTimeUp ? (
        <div className="end-message-container">
            <span className="end-message">Felizes Férias!</span>
        </div>
      ) : (
        <>
            <div className="countdown-timer" aria-label="Contador regressivo para as férias">
              <div className="countdown-item">
                <span className="countdown-number" aria-label={`${timeLeft.days} dias`}>{padNumber(timeLeft.days)}</span>
                <span className="countdown-label">Dias</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number" aria-label={`${timeLeft.hours} horas`}>{padNumber(timeLeft.hours)}</span>
                <span className="countdown-label">Horas</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number" aria-label={`${timeLeft.minutes} minutos`}>{padNumber(timeLeft.minutes)}</span>
                <span className="countdown-label">Minutos</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number" aria-label={`${timeLeft.seconds} segundos`}>{padNumber(timeLeft.seconds)}</span>
                <span className="countdown-label">Segundos</span>
              </div>
            </div>
            <div className="school-days-container">
                <div className="countdown-item">
                    <span className="countdown-number" aria-label={`${schoolDaysLeft} dias letivos`}>{padNumber(schoolDaysLeft)}</span>
                    <span className="countdown-label">Dias Letivos</span>
                </div>
            </div>
        </>
      )}

      <footer>
        <p className="footer-text">As férias começam em 24 de Dezembro de 2025.</p>
      </footer>
    </main>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}