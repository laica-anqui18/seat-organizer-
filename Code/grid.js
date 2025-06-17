export function renderGrid() {
      grid.innerHTML = '';
      seats.length = 0;

      let pcCount = 1; // Counter for PC labels

      for (let row = 0; row < classroom.length; row++) {
        seats[row] = [];
        for (let col = 0; col < classroom[row].length; col++) {
          const cell = document.createElement('div');
          const isSeat = classroom[row][col] === 1;

          if (!isSeat) {
            cell.className = 'w-14 h-14 border border-transparent cursor-default';
            seats[row][col] = null;
          } else {
            cell.className = 'w-14 h-14 relative text-center flex items-center justify-center text-xs cursor-pointer';

            cell.style.borderTop = '2px solid black';
            cell.style.borderLeft = '2px solid black';

            if (col === classroom[row].length - 1 || classroom[row][col + 1] !== 1) {
              cell.style.borderRight = '2px solid black';
            }

            if (row === classroom.length - 1 || classroom[row + 1][col] !== 1) {
              cell.style.borderBottom = '2px solid black';
            }

            // Add PC label in the corner
            const label = document.createElement('span');
            label.textContent = `PC ${pcCount++}`;
            label.className = 'absolute top-0 left-0 text-[0.6rem] text-gray-500 ml-0.5 mt-0.5';
            cell.appendChild(label);

            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.onclick = handleClick;
            seats[row][col] = { student: null, element: cell };
          }

          grid.appendChild(cell);
        }
      }
    }
