const std = @import("std");
const Io = std.Io;

const Part1 = struct {
    puzzle_input: []const u8,
    from: []const u8,
    to: []const u8,
    start: u64,
    end: u64,

    fn solve(self: *Part1) !u64 {
        var split_iterator = std.mem.splitScalar(u8, self.puzzle_input, '-');
        self.from = split_iterator.next() orelse return error.InvalidInput;
        self.to = split_iterator.next() orelse return error.InvalidInput;

        self.start = try std.fmt.parseInt(u64, self.from, 10);
        self.end = try std.fmt.parseInt(u64, self.to, 10);

        std.debug.print("\nPassword Start: {d}", .{self.start});
        std.debug.print("\nPassword End: {d}", .{self.end});

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
};

pub fn main() !void {
    std.debug.print("\nAdvent of Code 2019 - Day 4", .{});

    const puzzle_input = "359282-820401";

    var part1 = Part1{
        .puzzle_input = puzzle_input,
        .from = "",
        .to = "",
        .start = 0,
        .end = 0,
    };
    const part1_result = try part1.solve();

    std.debug.print("\nPart 1: {d}", .{part1_result});
}
