    import { renderGrid } from './grid.js';
    
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

    const grid = document.getElementById('classroom');
    const seats = [];
    let mode = 'assign';
    let selectedSeat = null;

    
    function handleClick(e) {
      const row = +e.target.dataset.row;
      const col = +e.target.dataset.col;
      const seat = seats[row][col];
      if (!seat) return;

      const nameInput = document.getElementById('studentName');

      if (mode === 'assign') {
        const name = nameInput.value.trim();
        if (!name) return alert('Please enter a student name.');
        if (seat.student) return alert('Seat is already assigned.');

        seat.student = name;
        seat.element.textContent = name;
        updateStyle(seat);
        nameInput.value = '';
      }

      else if (mode === 'unassign') {
        if (!seat.student) return alert('Seat is already empty.');

        seat.student = null;
        seat.element.textContent = '';
        updateStyle(seat);
      }

      else if (mode === 'transfer') {
        if (!selectedSeat) {
          if (!seat.student) return alert('Select an occupied seat to transfer from.');
          selectedSeat = { row, col };
          seat.element.classList.add('ring', 'ring-blue-500', 'ring-2');
        } else {
          const fromSeat = seats[selectedSeat.row][selectedSeat.col];
          const toSeat = seat;

          if (toSeat.student) return alert('Target seat is occupied.');

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
          selectedSeat = { row, col };
          seat.element.classList.add('ring', 'ring-blue-500', 'ring-2');
        } else {
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

    function updateStyle(seat) {
      seat.element.classList.remove('bg-green-500', 'text-white');
      if (seat.student) {
        seat.element.classList.add('bg-green-500', 'text-white');
      }
    }

    function setAssignMode() {
      mode = 'assign';
      resetSelected();
      highlightActiveButton('Assign');
    }

    function setUnassignMode() {
      mode = 'unassign';
      resetSelected();
      highlightActiveButton('Unassign');
    }

    function setTransferMode() {
      mode = 'transfer';
      resetSelected();
      highlightActiveButton('Transfer');
    }

    function setSwapMode() {
      mode = 'swap';
      resetSelected();
      highlightActiveButton('Swap');
    }

    function resetSelected() {
      if (selectedSeat) {
        const seat = seats[selectedSeat.row][selectedSeat.col];
        seat.element.classList.remove('ring', 'ring-blue-500', 'ring-2');
        selectedSeat = null;
      }
    }

    function highlightActiveButton(activeText) {
      const buttons = document.querySelectorAll('.mode-button');
      buttons.forEach(btn => {
        if (btn.textContent === activeText) {
          btn.classList.add('bg-blue-500', 'text-white');
          btn.classList.remove('text-black');
        } else {
          btn.classList.remove('bg-blue-500', 'text-white');
          btn.classList.add('text-black');
        }
      });
    }

    renderGrid();
    highlightActiveButton('Assign'); // highlight default mode on page load
