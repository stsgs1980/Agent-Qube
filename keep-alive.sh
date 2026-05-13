#!/bin/bash
# P-MAS Dev Server Keepalive
# Starts Next.js dev server, monitors health, auto-restarts on failure

LOG=/tmp/zdev.log
HEALTH_URL=http://localhost:3000/api/health
MAX_FAILS=3

start_server() {
  echo "[$(date)] Starting Next.js dev server..." >> $LOG
  cd /home/z/my-project
  # Redirect stdout/stderr to log, but also to dev.log
  npx next dev -p 3000 </dev/null >> $LOG 2>&1 &
  SERVER_PID=$!
  echo "[$(date)] Server PID: $SERVER_PID" >> $LOG
  # Wait for it to become ready
  sleep 8
}

# Start initially
start_server

while true; do
  # Check if server process is alive
  if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "[$(date)] Server process dead. Restarting..." >> $LOG
    start_server
    continue
  fi
  
  # Health check
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL 2>/dev/null)
  if [ "$HTTP_CODE" != "200" ]; then
    FAIL_COUNT=$((FAIL_COUNT + 1))
    echo "[$(date)] Health check failed ($FAIL_COUNT/$MAX_FAILS), HTTP $HTTP_CODE" >> $LOG
    if [ $FAIL_COUNT -ge $MAX_FAILS ]; then
      echo "[$(date)] Too many failures. Killing and restarting..." >> $LOG
      kill -9 $SERVER_PID 2>/dev/null
      pkill -f "next-server" 2>/dev/null
      sleep 3
      start_server
      FAIL_COUNT=0
    fi
  else
    FAIL_COUNT=0
  fi
  
  sleep 10
done
