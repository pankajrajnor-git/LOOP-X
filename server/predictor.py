"""
Predictive Engine — Predicts future system failures.
Uses moving average, trend detection, and rate-of-change extrapolation.
"""

from datetime import datetime

DANGER_THRESHOLDS = {
    "cpu": 90,
    "memory": 85,
    "disk": 95,
}


def moving_average(values, window=5):
    """Compute moving average of the last `window` values."""
    if len(values) < window:
        return sum(values) / len(values) if values else 0
    return sum(values[-window:]) / window


def detect_trend(values, min_points=5):
    """
    Check if values are consistently increasing.
    Returns: trend direction ('rising', 'falling', 'stable') and rate per step.
    """
    if len(values) < min_points:
        return "stable", 0.0

    recent = values[-min_points:]
    increases = sum(1 for i in range(1, len(recent)) if recent[i] > recent[i - 1])
    decreases = sum(1 for i in range(1, len(recent)) if recent[i] < recent[i - 1])

    rate = (recent[-1] - recent[0]) / (len(recent) - 1)

    if increases >= min_points - 1:
        return "rising", rate
    elif decreases >= min_points - 1:
        return "falling", rate
    else:
        return "stable", rate


def predict_time_to_breach(current_value, rate, threshold):
    """Estimate how many steps until threshold is breached."""
    if rate <= 0:
        return None  # Not rising, no breach predicted
    remaining = threshold - current_value
    if remaining <= 0:
        return 0  # Already breached
    return round(remaining / rate, 1)


def run_predictions(history, interval_seconds=2):
    """
    Analyze metric history and generate predictions.
    Returns a list of prediction objects.
    """
    if len(history) < 5:
        return []

    predictions = []

    for metric_name, threshold in DANGER_THRESHOLDS.items():
        values = [m[metric_name] for m in history]

        # Moving average
        ma = moving_average(values, window=5)

        # Trend detection
        trend, rate = detect_trend(values, min_points=5)

        # Current value
        current = values[-1]

        # Time to breach
        steps_to_breach = predict_time_to_breach(current, rate, threshold)

        # Build prediction
        prediction = {
            "timestamp": datetime.now().isoformat(),
            "metric": metric_name,
            "current_value": round(current, 1),
            "moving_average": round(ma, 1),
            "trend": trend,
            "rate_per_interval": round(rate, 2),
            "threshold": threshold,
            "predicted_value_5": round(current + rate * 5, 1) if rate > 0 else round(current, 1),
            "predicted_value_10": round(current + rate * 10, 1) if rate > 0 else round(current, 1),
        }

        # Add breach warning if applicable
        if trend == "rising" and steps_to_breach is not None:
            time_to_breach_seconds = steps_to_breach * interval_seconds
            prediction["breach_predicted"] = True
            prediction["steps_to_breach"] = steps_to_breach
            prediction["time_to_breach_seconds"] = round(time_to_breach_seconds, 1)
            prediction["confidence"] = min(95, max(40, int(60 + (rate * 10))))
            prediction["warning"] = (
                f"{metric_name.upper()} is rising at {rate:.1f}%/interval. "
                f"Predicted to breach {threshold}% in ~{time_to_breach_seconds:.0f}s"
            )
        else:
            prediction["breach_predicted"] = False
            prediction["confidence"] = 0

        predictions.append(prediction)

    return predictions
