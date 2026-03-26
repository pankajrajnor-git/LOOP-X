"""
Monitoring Layer — Collects system metrics using psutil.
Stores history in a deque for trend analysis and charting.
"""

import psutil
import time
from collections import deque
from datetime import datetime

MAX_HISTORY = 120  # Keep last 120 readings (~4 min at 2s intervals)

metrics_history = deque(maxlen=MAX_HISTORY)


def collect_metrics():
    """Collect current system metrics and append to history."""
    net = psutil.net_io_counters()
    metric = {
        "timestamp": datetime.now().isoformat(),
        "cpu": psutil.cpu_percent(interval=0.5),
        "memory": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage("/").percent if hasattr(psutil.disk_usage("/"), "percent") else psutil.disk_usage("C:\\").percent,
        "network_sent": round(net.bytes_sent / (1024 * 1024), 2),  # MB
        "network_recv": round(net.bytes_recv / (1024 * 1024), 2),  # MB
    }
    metrics_history.append(metric)
    return metric


def get_history(n=60):
    """Return last n metric readings."""
    data = list(metrics_history)
    return data[-n:] if len(data) >= n else data


def get_disk_usage():
    """Get disk usage, handling both Linux and Windows."""
    try:
        return psutil.disk_usage("/").percent
    except Exception:
        return psutil.disk_usage("C:\\").percent
