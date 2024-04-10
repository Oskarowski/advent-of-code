const cl = console.log;

import { Maze } from './visualization/Maze.js';
import {displayModal } from './visualization/modal.js';

document.addEventListener('DOMContentLoaded', function () {
    cl('DOM fully loaded');


    const maze = Maze.getInstance();
    
    const mazeStartTileShapeInput = document.getElementById('maze-start-shape');

    mazeStartTileShapeInput.addEventListener('change', function () {
        const startTileStringInput = this.value;

        if (startTileStringInput.length !== 1) {
            return;
        }

        console.log('{event} Start tile shape: \n ', startTileStringInput);
        
        maze.setMazeStartTilePipeShape(startTileStringInput);
    });
    
    
    const mazeTextInput = document.getElementById('maze-text');
    
    mazeTextInput.addEventListener('change', function () {
        const puzzleText = this.value;
        
        if (!puzzleText.length) {
            return;
        }
        
        console.log('\n {event} Set Puzzle Input:', puzzleText);

        maze.setPuzzleInput(puzzleText);
    });

    const generateMazeBtn = document.getElementById('generate-maze-btn');

    generateMazeBtn.addEventListener('click', function () {

        if(maze.solver.puzzleInput === undefined){
            return displayModal("Puzzle input is missing");
        }

        if(maze.solver.pipeTypeOfStart === undefined){
            return displayModal("Type of start pipe is missing");
        }

        maze.processPuzzle();
        maze.generateTilesElementsGrid();

        updateMazeStatsHud();
    })

    function updateMazeStatsHud(){
        const enclosedTilesCountSpan = document.getElementById("enclosed-tiles-count");
        const farthestPointSpan = document.getElementById("farthest-point");

        enclosedTilesCountSpan.textContent = maze.solver.countTilesEnclosedByLoop.toString();
        farthestPointSpan.textContent = maze.solver.farthestPointFromStart.toString();
    }
});

