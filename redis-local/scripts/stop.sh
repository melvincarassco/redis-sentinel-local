#!/bin/bash
pkill -f sentinel-26379.conf || true
pkill -f sentinel-26380.conf || true
echo "Sentinels stopped."
