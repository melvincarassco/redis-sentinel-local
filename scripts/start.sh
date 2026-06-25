#!/bin/bash
redis-server ~/redis-sentinel/sentinel-26379.conf --sentinel &
redis-server ~/redis-sentinel/sentinel-26380.conf --sentinel &
echo "Sentinels started."
