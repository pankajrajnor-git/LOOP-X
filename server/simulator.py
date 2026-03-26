"""
Simulator — Creates artificial CPU and memory load for demo purposes.
Uses threading/multiprocessing for CPU stress and memory allocation for memory stress.
"""

import threading
import time

_cpu_stress_active = False
_memory_stress_active = False
_cpu_threads = []
_memory_blocks = []
_lock = threading.Lock()


def _cpu_burn():
    """Burn CPU cycles in a tight loop."""
    while _cpu_stress_active:
        _ = sum(i * i for i in range(10000))


def start_cpu_stress(num_threads=4):
    """Start CPU stress with multiple threads."""
    global _cpu_stress_active, _cpu_threads
    with _lock:
        if _cpu_stress_active:
            return {"status": "already_running", "message": "CPU stress is already active"}
        _cpu_stress_active = True
        _cpu_threads = []
        for _ in range(num_threads):
            t = threading.Thread(target=_cpu_burn, daemon=True)
            t.start()
            _cpu_threads.append(t)
    return {"status": "started", "message": f"CPU stress started with {num_threads} threads"}


def stop_cpu_stress():
    """Stop CPU stress."""
    global _cpu_stress_active, _cpu_threads
    with _lock:
        if not _cpu_stress_active:
            return {"status": "not_running", "message": "CPU stress is not active"}
        _cpu_stress_active = False
        _cpu_threads = []
    return {"status": "stopped", "message": "CPU stress stopped"}


def start_memory_stress(size_mb=200):
    """Allocate memory blocks to simulate memory pressure."""
    global _memory_stress_active, _memory_blocks
    with _lock:
        if _memory_stress_active:
            return {"status": "already_running", "message": "Memory stress is already active"}
        _memory_stress_active = True
        try:
            # Allocate blocks of ~50MB each
            blocks = size_mb // 50
            for _ in range(blocks):
                _memory_blocks.append(bytearray(50 * 1024 * 1024))
            return {"status": "started", "message": f"Allocated ~{size_mb}MB of memory"}
        except MemoryError:
            return {"status": "partial", "message": "Partially allocated memory (system limit reached)"}


def stop_memory_stress():
    """Release allocated memory."""
    global _memory_stress_active, _memory_blocks
    with _lock:
        if not _memory_stress_active:
            return {"status": "not_running", "message": "Memory stress is not active"}
        _memory_stress_active = False
        _memory_blocks.clear()
    return {"status": "stopped", "message": "Memory released"}


def get_simulation_status():
    """Return current simulation status."""
    return {
        "cpu_stress_active": _cpu_stress_active,
        "memory_stress_active": _memory_stress_active,
        "cpu_threads": len(_cpu_threads),
        "memory_blocks_mb": len(_memory_blocks) * 50,
    }
