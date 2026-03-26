"""
Decision Engine — Maps anomalies and predictions to healing actions.
"""

from datetime import datetime


def decide_actions(anomalies, predictions):
    """
    Given current anomalies and predictions, decide what actions to take.
    Returns a list of action objects.
    """
    actions = []

    # React to current anomalies
    for anomaly in anomalies:
        metric = anomaly["metric"]
        severity = anomaly["severity"]

        if metric == "cpu" and anomaly.get("value", 0) > 90:
            actions.append({
                "timestamp": datetime.now().isoformat(),
                "trigger": "detection",
                "reason": anomaly["message"],
                "action": "restart_high_cpu_process",
                "description": "Restart the highest CPU-consuming process",
                "severity": "critical",
                "status": "pending",
            })
        elif metric == "memory" and anomaly.get("value", 0) > 85:
            actions.append({
                "timestamp": datetime.now().isoformat(),
                "trigger": "detection",
                "reason": anomaly["message"],
                "action": "kill_memory_hog",
                "description": "Terminate the highest memory-consuming process",
                "severity": "critical",
                "status": "pending",
            })
        elif metric == "disk" and anomaly.get("value", 0) > 90:
            actions.append({
                "timestamp": datetime.now().isoformat(),
                "trigger": "detection",
                "reason": anomaly["message"],
                "action": "clear_temp_files",
                "description": "Clear temporary and cache files",
                "severity": "high",
                "status": "pending",
            })

    # React to predictions (pre-emptive actions)
    for pred in predictions:
        if pred.get("breach_predicted") and pred.get("steps_to_breach", 999) < 15:
            metric = pred["metric"]
            if metric == "cpu":
                actions.append({
                    "timestamp": datetime.now().isoformat(),
                    "trigger": "prediction",
                    "reason": pred.get("warning", "CPU breach predicted"),
                    "action": "preemptive_cpu_scaling",
                    "description": "Pre-emptive CPU load balancing / process optimization",
                    "severity": "warning",
                    "status": "pending",
                })
            elif metric == "memory":
                actions.append({
                    "timestamp": datetime.now().isoformat(),
                    "trigger": "prediction",
                    "reason": pred.get("warning", "Memory breach predicted"),
                    "action": "preemptive_memory_cleanup",
                    "description": "Pre-emptive memory cleanup and garbage collection",
                    "severity": "warning",
                    "status": "pending",
                })

    return actions
