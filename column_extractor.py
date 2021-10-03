import json
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List
import math


class ColumnExtractor:
    def __init__(self, n_jobs=10):
        self.pool = ThreadPoolExecutor(max_workers=n_jobs)
        self.res = {}
        self.n_jobs = n_jobs

    def reset(self):
        self.res = {}

    def __call__(self, column_name: str, out_path: str):
        all_ids = json.load(open('all_ids.json'))
        batch_size = math.ceil(len(all_ids) / self.n_jobs)

        futures = []
        for i in range(self.n_jobs):
            batch_ids = all_ids[i * batch_size:(i + 1) * batch_size]
            futures.append(self.pool.submit(self.worker, batch_ids, column_name))

        # wait for threads to complete
        for _ in as_completed(futures):
            continue

        json.dump(self.res, open(out_path, 'w', encoding='utf-8'), ensure_ascii=False)

    def worker(self, dev_ids: List[int], column_name: str):
        for dev_id in dev_ids:
            file_path = os.path.join('cleaned', f'{dev_id}.json')
            data = json.load(open(file_path, encoding='utf-8'))
            self.res[dev_id] = data[column_name]
