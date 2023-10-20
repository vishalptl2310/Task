import { useEffect, useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";

const CsvColumns = {
  PONumber: 1,
  Supplier: 11,
  Description: 15,
};

function App() {
  const [data, setData] = useState([]);
  const [uniqueSuppliers, setUniqueSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState({});
  const [PONumberList, setPONumberList] = useState([]);
  const [selectedPONumberData, setSelectedPONumberData] = useState({});

  const fillAllData = (dataToUpdate) => {
    let lastNonEmptyData = {};
    let uniqueSup = [];
    const updatedData = dataToUpdate.map((row) => {
      const supplierInfo = row["Supplier"];
      if (supplierInfo) {
        if (!uniqueSup.includes(supplierInfo.trim())) {
          uniqueSup.push(row);
        }
        lastNonEmptyData = row;
        return row;
      } else {
        return { ...row, Supplier: lastNonEmptyData["Supplier"] };
      }
    });
    setUniqueSuppliers([...new Set(uniqueSup)]);
    return updatedData;
  };

  useEffect(() => {
    if (selectedSupplier) {
      const POList = uniqueSuppliers.filter(
        (po) => po["Supplier"] === selectedSupplier
      );
      setPONumberList(POList);
    }
  }, [selectedSupplier]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      // const headers = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const data = XLSX.utils.sheet_to_json(ws);
      setData(fillAllData(data));
    };
    reader.readAsBinaryString(file);
  };
  return (
    <div className="App">
      <input type="file" onChange={handleFileUpload} />
      <select
        value={selectedSupplier}
        onChange={(e) => setSelectedSupplier(e.target.value)}
      >
        <option value="">Select a supplier</option>
        {uniqueSuppliers.map((column) => (
          <option key={column.index} value={column.Supplier}>
            {column.Supplier}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => {
          const selectedData = JSON.parse(e.target.value);
          setSelectedPONumberData(selectedData);
          console.log("Here is description row data ==>>" )
          console.log(selectedData)
          console.log("*******************")
        }}
      >
        <option value="">Select a PONumber</option>
        {PONumberList.map((column, i) => (
          <option key={i} value={JSON.stringify(column)}>
            {column["PO Number"]}
          </option>
        ))}
      </select>
    </div>
  );
}

export default App;
