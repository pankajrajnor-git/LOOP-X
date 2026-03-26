"""
LOOP X
Predictive Autonomous Monitoring System
Main Flask Server — API Backend

Provides REST endpoints for the React dashboard.
Runs a background monitoring loop that continuously collects metrics,
detects anomalies, generates predictions, and triggers self-healing actions.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import time

from monitor import collect_metrics, get_history
from detector import run_detection, get_anomaly_log
from predictor import run_predictions
from decision_engine import decide_actions
from healer import execute_actions, get_action_history
from simulator import (
    start_cpu_stress, stop_cpu_stress,
    start_memory_stress, stop_memory_stress,
    get_simulation_status,
)

app = Flask(__name__)
CORS(app)

# Global state
monitoring_active = True
system_status = {"status": "healthy", "message": "All systems operational"}
latest_predictions = []
POLL_INTERVAL = 2  # seconds


def monitoring_loop():
    """Background thread: collect → detect → predict → decide → heal."""
    global system_status, latest_predictions

    while True:
        if not monitoring_active:
            time.sleep(1)
            continue

        try:
            # 1. Collect metrics
            metrics = collect_metrics()
            history = get_history(60)

            # 2. Detect anomalies
            anomalies = run_detection(metrics, history)

            # 3. Run predictions
            predictions = run_predictions(history, interval_seconds=POLL_INTERVAL)
            latest_predictions = predictions

            # 4. Decide actions
            actions = decide_actions(anomalies, predictions)

            # 5. Execute healing actions
            if actions:
                execute_actions(actions)

            # 6. Update system status
            if any(a.get("severity") == "critical" for a in anomalies):
                system_status = {"status": "critical", "message": "Critical anomalies detected!"}
            elif any(p.get("breach_predicted") for p in predictions):
                system_status = {"status": "warning", "message": "Potential issues predicted"}
            elif any(a.get("severity") == "warning" for a in anomalies):
                system_status = {"status": "warning", "message": "Warnings detected"}
            else:
                system_status = {"status": "healthy", "message": "All systems operational"}

        except Exception as e:
            print(f"Monitoring error: {e}")

        time.sleep(POLL_INTERVAL)


# ─── API ROUTES ───────────────────────────────────────────────────────

@app.route("/api/metrics", methods=["GET"])
def api_metrics():
    """Get current system metrics."""
    history = get_history(1)
    if history:
        return jsonify(history[-1])
    return jsonify({"error": "No metrics available yet"}), 503


@app.route("/api/metrics/history", methods=["GET"])
def api_metrics_history():
    """Get historical metrics."""
    n = request.args.get("n", 60, type=int)
    return jsonify(get_history(n))


@app.route("/api/predict", methods=["GET"])
def api_predict():
    """Get current predictions."""
    return jsonify(latest_predictions)


@app.route("/api/anomalies", methods=["GET"])
def api_anomalies():
    """Get anomaly log."""
    n = request.args.get("n", 50, type=int)
    return jsonify(get_anomaly_log(n))


@app.route("/api/actions", methods=["GET"])
def api_actions():
    """Get action history."""
    n = request.args.get("n", 50, type=int)
    return jsonify(get_action_history(n))


@app.route("/api/status", methods=["GET"])
def api_status():
    """Get overall system status."""
    sim = get_simulation_status()
    return jsonify({**system_status, "simulation": sim})


@app.route("/api/simulate/cpu", methods=["POST"])
def api_simulate_cpu():
    """Start or stop CPU stress simulation."""
    data = request.get_json(silent=True) or {}
    action = data.get("action", "start")
    if action == "start":
        threads = data.get("threads", 4)
        return jsonify(start_cpu_stress(threads))
    else:
        return jsonify(stop_cpu_stress())


@app.route("/api/simulate/memory", methods=["POST"])
def api_simulate_memory():
    """Start or stop memory stress simulation."""
    data = request.get_json(silent=True) or {}
    action = data.get("action", "start")
    if action == "start":
        size = data.get("size_mb", 200)
        return jsonify(start_memory_stress(size))
    else:
        return jsonify(stop_memory_stress())


@app.route("/api/simulate/stop-all", methods=["POST"])
def api_simulate_stop_all():
    """Stop all simulations."""
    cpu_result = stop_cpu_stress()
    mem_result = stop_memory_stress()
    return jsonify({"cpu": cpu_result, "memory": mem_result})


# ─── START ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Start background monitoring thread
    monitor_thread = threading.Thread(target=monitoring_loop, daemon=True)
    monitor_thread.start()
    print("✅ Monitoring loop started")
    print("🚀 Server running on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=False)
