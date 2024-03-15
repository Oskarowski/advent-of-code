#!/bin/bash

# Get the day number as input argument
day_number="$1"

# Check if the input is provided
if [ -z "$day_number" ]; then
    echo "Usage: ./next_day.sh [day_number]"
    exit 1
fi

# Pad the day number with leading zero if it's less than 10
padded_day_number=$(printf "%02d" "$day_number")

# Create the directory day_{number}
dir_name="day_${padded_day_number}"
mkdir "$dir_name"

# Create the solution.ts file
touch "${dir_name}/solution.ts"

# Check if the directory 'data' exists, if not create it
if [ ! -d "data" ]; then
    mkdir "data"
fi

# Create the input files in the 'data' directory
touch "data/day_${padded_day_number}_input.txt"
touch "data/day_${padded_day_number}_t_input.txt"

echo "Files and directories created successfully."
