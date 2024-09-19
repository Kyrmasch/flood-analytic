from typing import Any, Coroutine
from dask.distributed import Client
import os


class DaskManager:
    def __init__(self):
        self.client = Client("tcp://localhost:8786")

    def extract_gpu_name(self, gpu_info: str) -> str:
        lines = gpu_info.strip().split("\n")
        if len(lines) > 1:
            return lines[1].strip()
        return ""

    def _devices(self) -> (Coroutine[Any, Any, Any] | Any) | None:
        def get_gpu_info():
            return os.popen("nvidia-smi --query-gpu=gpu_name --format=csv").read()

        if self.client:
            gpu_info = self.client.run(get_gpu_info)
            devices = []
            for worker, info in gpu_info.items():
                devices.append(self.extract_gpu_name(info))

            return devices
        return None


dask_manager = DaskManager()
