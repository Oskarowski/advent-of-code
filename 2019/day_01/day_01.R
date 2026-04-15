setwd("c:/VSC/advent-of-code/2019")
path <- "p.txt"
data <- readLines(path)
data <- as.numeric(data)

fuel <- 0
for (num in data) {
    fuel <- sum(fuel, floor(num / 3) - 2)
}

print(fuel)

fuel <- 0
for (module in data) {
    per_module <- 0
    cal <- floor(module / 3) - 2
    while(cal > 0) {
        per_module <- sum(per_module, cal)
        cal <- floor(cal / 3) - 2
    }
    fuel <- sum(fuel, per_module)
}

print(fuel)
