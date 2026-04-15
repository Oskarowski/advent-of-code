import math
from pathlib import Path

input_path = Path(__file__).with_name("p.txt")

with input_path.open("r", encoding="utf-8") as f:
    puzzle_data = f.read().splitlines()
    puzzle_data = list(map(int, puzzle_data))

def solve_part_1():
    total_fuel = []
    for mass in puzzle_data:
        total_fuel.append(math.floor(mass / 3) - 2)
    return sum(total_fuel)

print("Part 1:", solve_part_1())

def solve_part_2():
    def compute_model_fuel(mass):
        temp = math.floor(mass / 3) - 2
        if temp <= 0:
            return 0
        else:
            return temp + compute_model_fuel(temp)

    total_fuel = 0
    for module in puzzle_data:
        total_fuel += compute_model_fuel(module)

    return total_fuel

print("Part 2:", solve_part_2())




