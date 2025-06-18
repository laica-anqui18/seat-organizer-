// -------------------------------
// grid.js - Handles the classroom seat layout, seat interactions (assign/unassign/transfer/swap), and visual styling of the grid.
// -------------------------------

// Classroom layout as a 2D array:
// 1 = seat exists
// 0 = empty (no seat / pathway)
const classroom = [
  [1,1,1,1,1,0,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0],
  [1,0,1,1,0,0,0,1,1,0,1],
  [1,0,1,1,0,0,0,1,1,0,1],
  [1,0,1,1,0,0,0,1,1,0,1],
  [1,0,1,1,0,0,0,1,1,0,1],
  [1,0,1,1,0,0,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,1]
];

// Grid container in the HTML where seat divs will be rendered
const grid = document.getElementById('classroom');

// Tracks the current mode of interaction: assign, unassign, transfer, or swap
let mode = 'assign';

// Keeps track of the seat selected for transfer or swap
let selectedSeat = null;

// 2D array of classroom layout to hold seat objects (DOM + student name)
const seats = [];

// Function to create and render the seating grid dynamically
export function renderGrid() {
  grid.innerHTML = ''; // Clear any existing grid elements
  seats.length = 0; // Reset seat data
  let pcCount = 1; // Counter for labeling seats as "PC 1", "PC 2", etc.

  for (let row = 0; row < classroom.length; row++) {
    seats[row] = [];
    for (let col = 0; col < classroom[row].length; col++) {
      const cell = document.createElement('div');
      const isSeat = classroom[row][col] === 1;

      if (!isSeat) {
        // It's a walkway or empty space
        cell.className = 'w-14 h-14 border border-transparent cursor-default';
        seats[row][col] = null;
      } else {
        // It's a seat - create its div
        cell.className = 'w-14 h-14 relative text-center flex items-center justify-center text-xs cursor-pointer';

        // Apply borders manually to give the appearance of grid borders between seats only
        cell.style.borderTop = '2px solid black';
        cell.style.borderLeft = '2px solid black';
        if (col === classroom[row].length - 1 || classroom[row][col + 1] !== 1) {
          cell.style.borderRight = '2px solid black';
        }
        if (row === classroom.length - 1 || classroom[row + 1][col] !== 1) {
          cell.style.borderBottom = '2px solid black';
        }

        // Add label to top-left corner of the seat
        const label = document.createElement('span');
        label.textContent = `PC ${pcCount++}`;
        label.className = 'absolute top-0 left-0 text-[0.6rem] text-gray-500 ml-0.5';
        cell.appendChild(label);

        // Set dataset for identifying which seat was clicked
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.onclick = handleClick;

        // Save reference to seat DOM and its student data
        seats[row][col] = { student: null, element: cell };
      }

      // Append each cell (seat or empty) to the grid
      grid.appendChild(cell);
    }
  }
}

// Handles seat clicks based on current mode (assign, unassign, transfer, swap)
function handleClick(e) {
  const row = +e.target.dataset.row;
  const col = +e.target.dataset.col;
  const seat = seats[row][col];

  if (!seat) return; // Do nothing if it's a walkway

  const nameInput = document.getElementById('studentName');

  if (mode === 'assign') {
    const name = nameInput.value.trim();
    if (!name) return alert('Please enter a student name.');
    if (seat.student) return alert('Seat is already assigned.');

    // Assign student to seat
    seat.student = name;
    seat.element.textContent = name;
    updateStyle(seat);
    nameInput.value = '';
  } 
  else if (mode === 'unassign') {
    if (!seat.student) return alert('Seat is already empty.');

    // Remove student assignment
    seat.student = null;
    seat.element.textContent = '';
    updateStyle(seat);
  }
  else if (mode === 'transfer') {
    if (!selectedSeat) {
      if (!seat.student) return alert('Select an occupied seat to transfer from.');

      // Save the seat to transfer from
      selectedSeat = { row, col };
      seat.element.classList.add('ring', 'ring-blue-500', 'ring-2');
    } else {
      const fromSeat = seats[selectedSeat.row][selectedSeat.col];
      const toSeat = seat;

      if (toSeat.student) return alert('Target seat is occupied.');

      // Transfer student to target seat
      toSeat.student = fromSeat.student;
      toSeat.element.textContent = fromSeat.student;
      fromSeat.student = null;
      fromSeat.element.textContent = '';

      updateStyle(fromSeat);
      updateStyle(toSeat);

      fromSeat.element.classList.remove('ring', 'ring-blue-500', 'ring-2');
      selectedSeat = null;
    }
  }
  else if (mode === 'swap') {
    if (!seat.student) return alert('Select an occupied seat to swap.');

    if (!selectedSeat) {
      // First selection for swapping
      selectedSeat = { row, col };
      seat.element.classList.add('ring', 'ring-blue-500', 'ring-2');
    } else {
      // Swap with second selected seat
      const seat1 = seats[selectedSeat.row][selectedSeat.col];
      const seat2 = seat;

      const temp = seat1.student;
      seat1.student = seat2.student;
      seat2.student = temp;

      seat1.element.textContent = seat1.student || '';
      seat2.element.textContent = seat2.student || '';

      updateStyle(seat1);
      updateStyle(seat2);

      seat1.element.classList.remove('ring', 'ring-blue-500', 'ring-2');
      seat2.element.classList.remove('ring', 'ring-blue-500', 'ring-2');
      selectedSeat = null;
    }
  }
}

// Updates the visual style of a seat based on its assignment status
function updateStyle(seat) {
  seat.element.classList.remove('bg-green-500', 'text-white');
  if (seat.student) {
    seat.element.classList.add('bg-green-500', 'text-white');
  }
}

// Resets the selected seat state and visual indicators
function resetSelected() {
  if (selectedSeat) {
    const seat = seats[selectedSeat.row][selectedSeat.col];
    seat.element.classList.remove('ring', 'ring-blue-500', 'ring-2');
    selectedSeat = null;
  }
}

// Highlights the button that matches the current mode for visual feedback
function highlightActiveButton(activeText) {
  const buttons = document.querySelectorAll('.mode-button');
  buttons.forEach(btn => {
    if (btn.textContent.toLowerCase() === activeText.toLowerCase()) {
      btn.classList.add('bg-blue-500', 'text-white');
      btn.classList.remove('text-black');
    } else {
      btn.classList.remove('bg-blue-500', 'text-white');
      btn.classList.add('text-black');
    }
  });
}

// Sets the current mode of interaction (assign/unassign/transfer/swap)
// Also resets any selected seat and updates button highlighting
export function setMode(newMode) {
  mode = newMode;
  resetSelected();
  highlightActiveButton(newMode);
}

// Export seats array for external usage
export { seats };
