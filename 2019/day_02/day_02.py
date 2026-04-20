from pathlib import Path

input_path = Path(__file__).with_name("p.txt")

with input_path.open("r", encoding="utf-8") as f:
    puzzle_data = f.read().split(",")
    puzzle_data = list(map(int, puzzle_data))


def execute_program(memory_block):
    pointer = 0
    while True:
        instruction = memory_block[pointer]
        if instruction == 99:
            return memory_block

        idx1 = memory_block[pointer + 1]
        idx2 = memory_block[pointer + 2]
        target_idx = memory_block[pointer + 3]

        if instruction == 1:
            memory_block[target_idx] = memory_block[idx1] + memory_block[idx2]
        elif instruction == 2:
            memory_block[target_idx] = memory_block[idx1] * memory_block[idx2]

        pointer += 4


def solve_part_1(init_memory):
    init_memory[1] = 12
    init_memory[2] = 2

    return execute_program(init_memory)

program_state = solve_part_1(puzzle_data.copy())
print(f"PART 1: Value at position 0: {program_state[0]}, when program halts")


def solve_part_2(init_memory):
    target = 19690720

    for noun in range(0, 100):
        for verb in range (0, 100):
            mem_copy = init_memory.copy()
            mem_copy[1] = noun
            mem_copy[2] = verb
            execute_program(mem_copy)
            if mem_copy[0] == target:
                return mem_copy


    return [-1, -1, -1]

program_state = solve_part_2(puzzle_data.copy())
print(f"PART 2: Noun: {program_state[1]}, Verb: {program_state[2]} | {100 * program_state[1] +  program_state[2]}")


