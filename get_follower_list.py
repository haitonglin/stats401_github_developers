import json
import os
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List
import math

followers = {}
N_JOBS = 8


def get_followers(dev_ids: List[int]):
    for dev_id in dev_ids:
        file_path = os.path.join('cleaned', f'{dev_id}.json')
        data = json.load(open(file_path, encoding='utf-8'))

        followers[dev_id] = data['follower_list']


def main():
    all_ids = json.load(open('all_ids.json'))
    batch_size = math.ceil(len(all_ids) / N_JOBS)

    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = []
        for i in range(N_JOBS):
            batch_ids = all_ids[i * batch_size:(i + 1) * batch_size]
            futures.append(executor.submit(get_followers, batch_ids))

        # wait for threads to complete
        for _ in as_completed(futures):
            continue

    json.dump(followers, open('followers.json', 'w', encoding='utf-8'))


if __name__ == '__main__':
    main()
