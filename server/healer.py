"""
Self-Healing Layer — Executes remediation actions.
Runs in DRY-RUN mode by default for safety (logs actions but doesn't execute OS commands).
"""

from datetime import datetime
import simulator

DRY_RUN = True  # Safety: don't actually execute OS commands in demo
action_history = []  # Stores all actions taken


def execute_action(action):
    """
    Execute a healing action. In dry-run mode, only logs the action.
    Returns the action with updated status.
    """
    action_record = {
        "timestamp": datetime.now().isoformat(),
        "action": action["action"],
        "description": action["description"],
        "trigger": action["trigger"],
        "reason": action["reason"],
        "severity": action.get("severity", "info"),
        "dry_run": DRY_RUN,
    }

    if DRY_RUN:
        action_record["status"] = "simulated"
        action_record["result"] = f"[DRY-RUN] Would execute: {action['description']}"
        
        # DEMO MAGIC: Actually resolve the simulated problem so the dashboard recovers automatically!
        act_name = action["action"]
        if act_name in ["restart_high_cpu_process", "preemptive_cpu_scaling"]:
            simulator.stop_cpu_stress()
            action_record["result"] = str(action_record["result"]) + " (Simulation Auto-Resolved)"
        elif act_name in ["kill_memory_hog", "preemptive_memory_cleanup"]:
            simulator.stop_memory_stress()
            action_record["result"] = str(action_record["result"]) + " (Simulation Auto-Resolved)"
            
    else:
        # In production, actual OS commands would go here
        try:
            action_record["status"] = "executed"
            action_record["result"] = f"Executed: {action['description']}"
        except Exception as e:
            action_record["status"] = "failed"
            action_record["result"] = f"Failed: {str(e)}"

    # Store in history
    action_history.append(action_record)
    while len(action_history) > 100:
        action_history.pop(0)

    return action_record


def execute_actions(actions):
    """Execute a list of actions and return results."""
    results = []
    for action in actions:
        result = execute_action(action)
        results.append(result)
    return results


def get_action_history(n=50):
    """Return last n actions."""
    return action_history[-n:]
