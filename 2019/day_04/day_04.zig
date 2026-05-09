const std = @import("std");
const Io = std.Io;

const puzzle = struct {
    puzzle_input: []const u8,
    from: []const u8,
    to: []const u8,
    start: u64,
    end: u64,

    fn parse_input(self: *puzzle) !void {
        var split_iterator = std.mem.splitScalar(u8, self.puzzle_input, '-');
        self.from = split_iterator.next() orelse return error.InvalidInput;
        self.to = split_iterator.next() orelse return error.InvalidInput;

        self.start = try std.fmt.parseInt(u64, self.from, 10);
        self.end = try std.fmt.parseInt(u64, self.to, 10);
    }

    fn solve_part_1(self: *puzzle) !u64 {
        var different_passwords_count: u64 = 0;

        var password = self.start;
        while (password <= self.end) : (password += 1) {
            if (password < 100000 or password > 999999) continue;

            var buf: [6]u8 = undefined;
            _ = try std.fmt.bufPrint(&buf, "{d}", .{password});

            var has_double = false;
            var never_decrease = true;

            for (0..5) |i| {
                const left = buf[i];
                const right = buf[i + 1];

                if (left == right) {
                    has_double = true;
                }
                if (left > right) {
                    never_decrease = false;
                    break;
                }
            }

            if (has_double and never_decrease) {
                different_passwords_count += 1;
            }
        }

        return different_passwords_count;
    }

    fn solve_part_2(self: *puzzle) !u64 {
        var different_passwords_count: u64 = 0;

        var password = self.start;
        while (password <= self.end) : (password += 1) {
            if (password < 100000 or password > 999999) continue;

            var buf: [6]u8 = undefined;
            _ = try std.fmt.bufPrint(&buf, "{d}", .{password});

            var has_independent_double = false;
            var never_decrease = true;

            for (0..5) |i| {
                const left = buf[i];
                const right = buf[i + 1];

                if (left > right) {
                    never_decrease = false;
                    break;
                }
            }

            if (!never_decrease) continue;

            var i: usize = 0;
            while (i < buf.len) {
                const current_digit = buf[i];
                var running_length: usize = 0;

                while (i < buf.len and buf[i] == current_digit) {
                    running_length += 1;
                    i += 1;
                }

                if (running_length == 2) {
                    has_independent_double = true;
                }
            }

            if (has_independent_double) {
                different_passwords_count += 1;
            }
        }

        return different_passwords_count;
    }
};

pub fn main() !void {
    std.debug.print("\nAdvent of Code 2019 - Day 4", .{});

    const puzzle_input = "359282-820401";

    var puzzle_solver = puzzle{
        .puzzle_input = puzzle_input,
        .from = "",
        .to = "",
        .start = 0,
        .end = 0,
    };
    try puzzle_solver.parse_input();
    const part1_result = try puzzle_solver.solve_part_1();
    const part2_result = try puzzle_solver.solve_part_2();

    std.debug.print("\nPart 1: {d}", .{part1_result});
    std.debug.print("\nPart 2: {d}", .{part2_result});
}
