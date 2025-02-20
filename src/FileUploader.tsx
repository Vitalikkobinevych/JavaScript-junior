import React, { useState } from 'react';
import Papa from 'papaparse';
import "./styles.css";
import { validateData } from "./validateData";

export type Employee = {
  id: number;
  fullName: string;
  phone: string | number | null;
  email: string;
  age: number | string;
  experience: number | string;
  yearlyIncome: number | string;
  hasChildren: boolean;
  licenseStates: string;
  expirationDate: string;
  licenseNumber: string;
  duplicateWith?: number;
  errors?: string[];
};

const FileUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<Employee[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setParsedData([]); // Очистити попередні дані
      setErrorMessage(null); // Очистити повідомлення про помилки
    }
  };

  const handleFileUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const csvText = e.target.result as string;
          Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              const rawData = result.data as any[];
              const validatedData = validateData(rawData, setErrorMessage);  // Викликаємо валідацію
              setParsedData(validatedData);  // Оновлюємо стан з валідаційними даними
              console.log(validatedData); // Додаємо для перевірки
            },
          });
        }
      };
      reader.readAsText(file);  // Читання файлу як текст
    }
  };

  const handleReset = () => {
    setParsedData([]);
    setFile(null);
    setErrorMessage(null);
  };

  return (
    <div>
      <h2>Завантажте CSV файл</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleFileUpload} disabled={!file}>Завантажити</button>
      <button onClick={handleReset}>Очистити</button>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {parsedData.length > 0 && (
        <div>
          <h3>Перевірені дані:</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Age</th>
                <th>Experience</th>
                <th>Yearly Income</th>
                <th>Has Children</th>
                <th>License States</th>
                <th>Expiration Date</th>
                <th>License Number</th>
                <th>Duplicate With</th>
                <th>Errors</th>
              </tr>
            </thead>
            <tbody>
              {parsedData.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td className={employee.errors?.some(e => e.includes("Full Name")) ? "error" : ""}>{employee.fullName}</td>
                  <td className={employee.errors?.some(e => e.includes("Некоректний номер телефону")) ? "error" : ""}>
                    {employee.phone || "N/A"} 
                  </td>
                  <td className={employee.errors?.some(e => e.includes("Email")) ? "error" : ""}>{employee.email}</td>
                  <td className={employee.errors?.some(e => e.includes("Вік")) ? "error" : ""}>{employee.age}</td>
                  <td className={employee.errors?.some(e => e.includes("Некоректний досвід")) ? "error" : ""}>{employee.experience ? employee.experience : "N/A"}</td>
                  <td className={employee.errors?.some(e => e.includes("Річний дохід")) ? "error" : ""}>{employee.yearlyIncome}</td>
                  <td>{employee.hasChildren ?   "TRUE" : "FALSE"}</td>
                  <td>{employee.licenseStates}</td>
                  <td>{employee.expirationDate}</td>
                  <td className={employee.errors?.some(e => e.includes("Номер ліцензії")) ? "error" : ""}>{employee.licenseNumber}</td>
                  <td>{employee.duplicateWith}</td>
                  <td>{employee.errors?.length ? employee.errors.join(", ") : "No errors"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
