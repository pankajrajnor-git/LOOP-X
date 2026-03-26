"""
Detection Engine — Detects anomalies in system metrics.
Uses threshold-based rules and Z-score statistical anomaly detection.
"""

from datetime import datetime

# Thresholds
THRESHOLDS = {
    "cpu": 85,
    "memory": 80,
    "disk": 90,
}

anomaly_log = []  # Stores detected anomalies


def detect_threshold_anomalies(metrics):
    """Check if any metric exceeds its threshold."""
    anomalies = []
    for metric_name, threshold in THRESHOLDS.items():
        value = metrics.get(metric_name, 0)
        if value > threshold:
            severity = "critical" if value > threshold + 10 else "warning"
            anomaly = {
                "timestamp": datetime.now().isoformat(),
                "metric": metric_name,
                "value": round(value, 1),
                "threshold": threshold,
                "severity": severity,
                "type": "threshold_breach",
                "message": f"{metric_name.upper()} at {value:.1f}% (threshold: {threshold}%)",
            }
            anomalies.append(anomaly)
    return anomalies


def detect_zscore_anomalies(history, window=10):
    """Detect sudden spikes using Z-score analysis."""
    if len(history) < window + 1:
        return []

    anomalies = []
    latest = history[-1]
    recent = history[-(window + 1):-1]

    for metric_name in ["cpu", "memory"]:
        values = [m[metric_name] for m in recent]
        mean = sum(values) / len(values)
        variance = sum((v - mean) ** 2 for v in values) / len(values)
        std = variance ** 0.5

        if std > 0:
            z_score = (latest[metric_name] - mean) / std
            if abs(z_score) > 2.5:
                anomaly = {
                    "timestamp": datetime.now().isoformat(),
                    "metric": metric_name,
                    "value": round(latest[metric_name], 1),
                    "z_score": round(z_score, 2),
                    "severity": "warning",
                    "type": "statistical_anomaly",
                    "message": f"{metric_name.upper()} sudden spike detected (z-score: {z_score:.2f})",
                }
                anomalies.append(anomaly)
    return anomalies


def run_detection(metrics, history):
    """Run all detection methods and return combined anomalies."""
    threshold_anomalies = detect_threshold_anomalies(metrics)
    zscore_anomalies = detect_zscore_anomalies(history)

    all_anomalies = threshold_anomalies + zscore_anomalies

    # Add to persistent log (keep last 100)
    anomaly_log.extend(all_anomalies)
    while len(anomaly_log) > 100:
        anomaly_log.pop(0)

    return all_anomalies


def get_anomaly_log(n=50):
    """Return last n anomalies."""
    return anomaly_log[-n:]
