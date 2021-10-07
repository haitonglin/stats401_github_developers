import json
import pandas as pd
import numpy as np
from typing import List


def main():
    df = pd.read_csv('cleaned.csv')
    agg_list_str = lambda x: json.loads(list(x)[0])

    group_by_id = df.groupby('id')
    id2following = group_by_id['following_list'].apply(agg_list_str).to_dict()
    # id2follower = group_by_id['followed_list'].apply(agg_list_str).to_dict()

    id2n_commits = pd.cut(
        group_by_id['commit_n'].apply(int), bins=[100, 200, 500, 700, 1000, np.inf],
        labels=['100-200', '200-500', '500-700', '700-1000', '1000+'],
    ).to_dict()

    id2public_repos = pd.cut(
        group_by_id['public_repos'].apply(int), bins=[0, 20, 50, 100, np.inf],
        labels=['0-20', '20-50', '50-100', '100+'],
    ).to_dict()

    id2public_gists = pd.cut(
        group_by_id['public_gists'].apply(int), bins=[0, 20, 50, 100, np.inf],
        labels=['0-20', '20-50', '50-100', '100+'],
    ).to_dict()
    id2n_followers = pd.cut(
        group_by_id['followed_n'].apply(int), bins=[0, 50, 100, 500, 1000, np.inf],
        labels=['0-50', '50-100', '100-500', '500-1000', '1000+'],
    ).to_dict()

    data = {
        'n_commits': id2n_commits,
        'public_repos': id2public_repos,
        'public_gists': id2public_gists,
        'n_followers': id2n_followers,
    }

    nodes = []
    group_id = 0
    for feat_name, v in data.items():
        # nodes
        column_vals = list(v.values())
        unique_counts = np.asarray(
            np.unique(np.asarray(column_vals), return_counts=True)
        )
        for uniq_idx, val in enumerate(unique_counts[0]):
            col_id = f'{feat_name} {val}'
            nodes.append(
                dict(
                    name=col_id, id=col_id,
                    # adjust n to make circle size look normal
                    n=np.clip(unique_counts[1, uniq_idx].astype(int) / 5, 5, np.inf),
                    grp=group_id,
                )
            )

        group_id += 1

    # links
    link_counts = {}
    for feat_name1, v1 in data.items():
        for dev_id, followings in id2following.items():
            src_col_id = f'{feat_name1} {v1[dev_id]}'

            for feat_name2, v2 in data.items():
                for f_id in followings:
                    if f_id not in v2:  # the person being followed might not be in data
                        continue

                    dest_col_id = f'{feat_name2} {v2[f_id]}'
                    link_counts.setdefault((src_col_id, dest_col_id), 0)
                    link_counts[(src_col_id, dest_col_id)] += 1

    # print(link_counts)
    links = []
    for pair, count in link_counts.items():
        # TODO: filter links based on counts?
        # if count >= 20:
        links.append(dict(source=pair[0], target=pair[1], value=count))

    ret = dict(nodes=nodes, links=links)
    json.dump(ret, open('characteristic_relationship.json', 'w', encoding='utf-8'), ensure_ascii=False)


if __name__ == '__main__':
    main()
