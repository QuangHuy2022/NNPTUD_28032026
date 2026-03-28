const ExcelJS = require('exceljs');
const path = require('path');

async function testReadExcel() {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.join(__dirname, 'user.xlsx');
    try {
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);
        console.log('Sheet name:', worksheet.name);
        worksheet.eachRow((row, rowNumber) => {
            console.log(`Row ${rowNumber}:`, row.values);
        });
    } catch (err) {
        console.error('Error reading excel:', err);
    }
}

testReadExcel();
