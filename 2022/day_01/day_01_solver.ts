const rawCalorieData = await Bun.file(new URL('../data/day_01/t01.txt', import.meta.url)).text();

const totalCaloriesPerElf = rawCalorieData.split('\n\n').map((calorieGroup: string) => {
    return calorieGroup.split('\n').reduce((total: number, calorieStr: string) => {
        const calorieValue = parseInt(calorieStr, 10);
        return isNaN(calorieValue) ? total : total + calorieValue;
    }, 0);
});

const highestCalories = Math.max(...totalCaloriesPerElf);

console.log(`Total calories carried by the elf with the most calories: ${highestCalories}`);

const topThreeCalories = totalCaloriesPerElf
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((total: number, calories: number) => total + calories, 0);

console.log(`Total calories carried by the top three elves: ${topThreeCalories}`);
