#!/bin/bash
redis-cli -p 6379 ping >/dev/null 2>&1 && echo "Redis: UP" || echo "Redis: DOWN"
redis-cli -p 26379 ping >/dev/null 2>&1 && echo "Sentinel26379: UP" || echo "Sentinel26379: DOWN"
redis-cli -p 26380 ping >/dev/null 2>&1 && echo "Sentinel26380: UP" || echo "Sentinel26380: DOWN"
