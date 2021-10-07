"""
Get the ids of all developers that have more than 9 followers
"""
import json
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List
from pathlib import Path

N_JOBS = 10
INTERVALS = [(0, 100), (100, 500), (500, 1000), (1000, 2000), (2000, float('inf'))]
interval2ids = {i: [] for i in INTERVALS}
NUM_PER_INTERVAL = 100


def find_interval(val: int):
    ret = None
    for interval in interval2ids.keys():
        if interval[0] < val < interval[1]:
            ret = interval
    return ret


def filter_dev_ids(files: List[Path]):
    for file in files:
        data = json.load(open(file, encoding='utf-8'))

        interval = find_interval(data['followers'])
        if interval is not None and len(interval2ids[interval]) < NUM_PER_INTERVAL:
            interval2ids[interval].append(data['id'])


def main():
    all_files: List[Path] = []
    with os.scandir('cleaned') as it:
        for file in it:  # type: Path
            if file.is_file() and file.name.endswith('.json'):
                all_files.append(file)

    batch_size = 100
    n_batches = int(len(all_files) / batch_size)
    batches = [all_files[i * batch_size:(i + 1) * batch_size] for i in range(n_batches)]
    with ThreadPoolExecutor(max_workers=N_JOBS) as executor:
        for b in range(0, n_batches, N_JOBS):
            finished = True
            for ids in interval2ids.values():
                if len(ids) < NUM_PER_INTERVAL:
                    finished = False
                    break
            if finished:
                break

            futures = [
                executor.submit(filter_dev_ids, batches[i]) for i in range(b, b + N_JOBS) if i < n_batches
            ]

            # wait for threads to complete
            for _ in as_completed(futures):
                continue

    all_ids = []
    for ids in interval2ids.values():
        all_ids += ids
    json.dump(all_ids, open('all_ids.json', 'w', encoding='utf-8'))


if __name__ == '__main__':
    main()
