import { Employee } from "./FileUploader";

  
  export const validateData = (data: any[], setErrorMessage: (msg: string | null) => void): Employee[] => {
    const requiredFields = [
      "Full Name", "phone", "Email", "Age", "Experience", "Yearly Income", 
      "Has Children", "License states", "Expiration Date", "License Number"
    ];
  
    const validatePhoneNumber = (phone: string): string | null => {
        // Видаляємо всі символи, крім цифр
        const cleanedPhone = phone.replace(/\D/g, "");
    
        // Якщо номер має 10 цифр, додаємо +1
        if (cleanedPhone.length === 10) {
            return `+1${cleanedPhone}`;
        }
        
        // Якщо номер має 11 цифр і починається з "1", залишаємо його та додаємо +
        if (cleanedPhone.length === 11 && cleanedPhone.startsWith("1")) {
            return `+${cleanedPhone}`;
        }
        
        // Якщо номер має 11 цифр і починається з "0", замінюємо "0" на "+1"
        if (cleanedPhone.length === 11 && cleanedPhone.startsWith("0")) {
            return `+1${cleanedPhone.slice(1)}`;
        }
    
        // Якщо номер вже в форматі "+1" з 11 цифрами, просто повертаємо його
        if (cleanedPhone.length === 12 && cleanedPhone.startsWith("+1")) {
            return cleanedPhone;
        }
    
        return null; // Якщо номер не відповідає жодному з форматів
    };
    
      
      
      
  
    const emails = new Map<string, number>();
    const phones = new Map<string, number>();
    const validatedData: Employee[] = [];
  
    data.forEach((row, index) => {
      let errors: string[] = [];
  
      // Перевірка на відсутність обов'язкових полів
      requiredFields.forEach((field) => {
        if (!row[field] || row[field].toString().trim() === "") {
          errors.push(`Відсутнє поле: ${field}`);
        }
      });
  
      const fullName = row["Full Name"]?.trim() || "";
      const phoneRaw = row["phone"]?.trim() || ""; 
      const phone = validatePhoneNumber(phoneRaw);
      const email = row["Email"]?.trim().toLowerCase() || "";
      const age = row["Age"] ? parseInt(row["Age"].toString()) : NaN;
      const experience = row["Experience"] ? parseInt(row["Experience"].toString()) : NaN;
      const yearlyIncome = row["Yearly Income"] ? parseFloat(row["Yearly Income"].toString()) : NaN;
      const hasChildren = row["Has Children"]?.trim().toUpperCase() === "TRUE";
      const licenseStates = row["License states"]?.trim() || "";
      const expirationDate = row["Expiration Date"]?.trim() || "";
      const licenseNumber = row["License Number"]?.trim() || "";
  
      let duplicateWith: number | undefined;
  
      // Перевірка унікальності email
      if (emails.has(email)) {
        duplicateWith = emails.get(email);
      } else if (email) {
        emails.set(email, index + 1);
      }
  
      // Перевірка унікальності та валідності номера телефону
      // Перевірка унікальності та валідності номера телефону
if (phone === null) {  // Виправлено!
    errors.push("Некоректний номер телефону");
  } else {
    if (phones.has(phone)) {
      duplicateWith = phones.get(phone);
    } else {
      phones.set(phone, index + 1);
    }
  }
  
      // Додаткові перевірки
      if (isNaN(age) || age < 21) errors.push("Вік повинен бути числом не менше 21");
      if (isNaN(experience) || experience < 0 || experience > (age - 21)) errors.push("Некоректний досвід");
      if (isNaN(yearlyIncome) || yearlyIncome > 1000000 || yearlyIncome < 0) errors.push("Річний дохід має бути від 0 до 1 000 000");
      if (!/^[a-zA-Z0-9]{6}$/.test(licenseNumber)) errors.push("Номер ліцензії має містити рівно 6 символів");
  
      validatedData.push({
        id: index + 1,
        fullName,
        phone,
        email,
        age: isNaN(age) ? "" : age,
        experience: isNaN(experience) ? "" : experience,
        yearlyIncome: isNaN(yearlyIncome) ? "" : yearlyIncome,
        hasChildren,
        licenseStates,
        expirationDate,
        licenseNumber,
        duplicateWith,
        errors,
      });
    });
  
    return validatedData;
  };
  