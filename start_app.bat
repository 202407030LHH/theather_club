@echo off
echo Starting Theater Club...

echo Starting Backend Server on port 5000...
start "Theater Club Backend" /min cmd /c "cd server && npm start"

echo Starting Frontend Server on port 5173...
start "Theater Club Frontend" /min cmd /c "npm run dev"

timeout /t 5 > nul
start http://localhost:5173

echo All services started!
echo Press any key to close this window (servers will keep running in background).
pause
