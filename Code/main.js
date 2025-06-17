import { renderGrid, setMode } from './grid.js';

// Set button event listeners to switch modes
document.querySelector('button.assign').addEventListener('click', () => setMode('assign'));
document.querySelector('button.unassign').addEventListener('click', () => setMode('unassign'));
document.querySelector('button.transfer').addEventListener('click', () => setMode('transfer'));
document.querySelector('button.swap').addEventListener('click', () => setMode('swap'));

// Render the grid and set default mode on page load
renderGrid();
setMode('assign');
