from dask.distributed import Client


class DaskManager:
    def __init__(self):
        self.client = Client("tcp://localhost:8786")


dask_manager = DaskManager()
