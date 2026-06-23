#!/bin/bash
# WS Service Keepalive
# Starts and monitors the P-MAS WebSocket service on port 3003

LOG=/tmp/ws-service.log
MAX_FAILS=3
FAIL_COUNT=0

start_ws() {
  echo "[$(date)] Starting WS service..." >> $LOG
  cd /home/z/my-project/mini-services/ws-service
  bun index.ts >> $LOG 2>&1 &
  WS_PID=$!
  echo "[$(date)] WS PID: $WS_PID" >> $LOG
  sleep 3
}

# Start initially
start_ws

while true; do
  if ! kill -0 $WS_PID 2>/dev/null; then
    echo "[$(date)] WS service dead. Restarting..." >> $LOG
    start_ws
    FAIL_COUNT=0
    continue
  fi

  # Check if port is responding
  PORT_CHECK=$(lsof -i :3003 -sTCP:LISTEN 2>/dev/null | wc -l)
  if [ "$PORT_CHECK" -eq 0 ]; then
    FAIL_COUNT=$((FAIL_COUNT + 1))
    echo "[$(date)] Port 3003 not listening ($FAIL_COUNT/$MAX_FAILS)" >> $LOG
    if [ $FAIL_COUNT -ge $MAX_FAILS ]; then
      echo "[$(date)] Restarting WS service..." >> $LOG
      kill -9 $WS_PID 2>/dev/null
      start_ws
      FAIL_COUNT=0
    fi
  else
    FAIL_COUNT=0
  fi

  sleep 10
done
