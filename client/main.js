document.addEventListener('DOMContentLoaded', function () {
    let gridApi;
    // Define column definitions
    const columnDefs = [
      { headerName: "ID", field: "id", editable: false },
      { headerName: "Name", field: "name", editable: true },
      { headerName: "Price", field: "price", editable: true },
    ];

    // Define grid options
    const gridOptions = {
      columnDefs: columnDefs,
      rowData: null,
      onCellValueChanged: onCellValueChanged,
    };

    // Initialize the grid
      const eGridDiv = document.querySelector("#myGrid");
      // new agGrid.Grid(eGridDiv, gridOptions);
      gridApi = agGrid.createGrid(eGridDiv, gridOptions);

    // WebSocket setup
    const socket = new WebSocket("ws://localhost:6789");

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      gridApi?.setGridOption("rowData", data);
      // gridOptions.api.setRowData(data);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Function to handle cell value changes
    function onCellValueChanged(event) {
      const updatedData = {
        id: event.data.id,
        name: event.data.name,
        price: event.data.price,
      };

      // Send updated data to the WebSocket server
      socket.send(JSON.stringify(updatedData));
    }
})