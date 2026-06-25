#!/bin/bash
set -e
mkdir -p ~/redis-sentinel/logs
cp sentinel/*.conf ~/redis-sentinel/
REDIS_SERVER=$(which redis-server)
echo "Detected redis-server: $REDIS_SERVER"
echo "Installation complete."
