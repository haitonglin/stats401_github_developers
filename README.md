# Quick Start

## Overview

Dashboard that contains all the visualizations: dash.html


## Data Preparing

- Download cleaned data and unzip it in the project root directory
- the folder structure should look like this:

```
- cleaned
    - xx.json
    - xx.json
    - ...
- preprocess.py
- README.md
- ...
```

# Files

- [`preprocess.py`](preprocess.py): separate the raw [`data.json`](data.json) into individual developer's json file
- [`get_all_developer_ids.py`](get_all_developer_ids.py): get the ids of all developers that have more than 9 followers,
  saved in [`all_ids.json`](all_ids.json)
- [`get_follower_list.py`](get_follower_list.py): get a list of followers of all developer
  in [`all_ids.json`](all_ids.json), saved in [`followers.json`](followers.json)
