from pathlib import Path

# input_path = Path(__file__).with_name("p.txt")

slwire = ("R8,U5,L5,D3").split(",")
srwire = ("U7,R6,D4,L4").split(",")

def compute_move_points(position, cmd):
    move_points = [position.copy()]

    for move in cmd:
        direction = move[0]
        amount = int(move[1:len(move)])
        if direction == "U":
            position[1] += amount
        elif direction == "R":
            position[0] += amount
        elif direction == "D":
            position[1] -= amount
        elif direction == "L":
            position[0] -= amount
        move_points.append(position.copy())

    return move_points

def compute_wire_segments(wire_move_points):
    wire_segments = []
    for i in range(len(wire_move_points) - 1):
        p1 = wire_move_points[i]
        p2 = wire_move_points[i+1]
        is_vertical = p1[0] == p2[0]
        wire_segments.append([p1, p2, is_vertical])
    return wire_segments


def compute_segments_crossing(l_segments, r_segments):
    crossings = []

    for s1 in l_segments:
        for s2 in r_segments:
            (x1, y1), (x2, y2), flv = s1
            (x3, y3), (x4, y4), slv = s2

            if flv == slv:
                continue

            h_x_min = -1
            h_x_max = -1
            h_y = -1
            v_y_min = -1
            v_y_max = -1
            v_x = -1

            if flv == False:
                h_x_min = min(x1, x2)
                h_x_max = max(x1, x2)
                h_y = y1
            elif slv == False:
                h_x_min = min(x3, x4)
                h_x_max = max(x3, x4)
                h_y = y3

            if flv == True:
                v_y_min = min(y1, y2)
                v_y_max = max(y1, y2)
                v_x = x1
            elif slv == True:
                v_y_min = min(y3, y4)
                v_y_max = max(y3, y4)
                v_x = x3

            if (h_x_min <= v_x <= h_x_max) and (v_y_min <= h_y <=  v_y_max):
                crossings.append([v_x, h_y])

    return crossings

def find_smallest_manhattan_distance(crossings):
    distances = []
    for crossing in crossings:
        distance = abs(1 - crossing[0]) + abs(1 - crossing[1])
        distances.append(distance)

    distances.sort()
    return distances[0]

crossings = compute_segments_crossing(
    compute_wire_segments(compute_move_points([1,1], slwire)),
    compute_wire_segments(compute_move_points([1,1], srwire))
)[1:]

print(f"Manhattan distance is {find_smallest_manhattan_distance(crossings)}")
