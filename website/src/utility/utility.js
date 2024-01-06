import ExcelJS from "exceljs/dist/exceljs";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import _ from "lodash";
import { Alert } from "./alert";

const excelPattern = /^.*.(xlsx|XLSX)$/;
const csvPattern = /^.*.(csv|CSV)$/;

export const createExcel = async (filename, sheetData = {}) => {
  const workbook = new ExcelJS.Workbook();

  _.each(sheetData, (data, sheetName) => {
    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.addRows(data);

    worksheet.columns.forEach((column, i) => {
      const cellLengths = column.values.map((v) => {
        let len = v.toString().length || 0;
        if (len > 24) return 24;
        return len;
      });
      const maxLength = Math.max(
        ...cellLengths.filter((v) => typeof v === "number"),
      );
      column.width = maxLength * 1.5;
    });
  });
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer]);
  saveAs(blob, `${filename}.xlsx`);
};

export const createCsv = async (filename, data) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv]);
  saveAs(blob, `${filename}.csv`);
};

export const handleFileUpdate = async (fileObj) => {
  const filename = fileObj.name;

  if (!fileObj) {
    return handleUploadFail(
      "No file uploaded, please choose a file to upload.",
    );
  }

  const matchExcel = filename.match(excelPattern);
  const matchCsv = filename.match(csvPattern);

  if (!matchExcel && !matchCsv) {
    return handleUploadFail("The file must be in xlsx or csv format.");
  }

  let uploadData = [];

  if (matchExcel) {
    uploadData = await hadleExcelUpdate(fileObj);
  }

  if (matchCsv) {
    uploadData = await handleCsvUpdate(fileObj);
  }

  if (!uploadData) {
    return handleUploadFail("The file format is not compatible.");
  }

  if (uploadData.length <= 0) {
    return handleUploadFail("No data found in the uploaded file.");
  }

  return uploadData;
};

export const hadleExcelUpdate = async (fileObj) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(fileObj);

  let data = [];
  try {
    const worksheet = workbook.worksheets[0];
    worksheet.eachRow((row) => {
      const rowValues = row.values[1];
      data.push(rowValues);
    });
  } catch (error) {
    return false;
  }
  return data;
};

const handleUploadFail = (msg) => {
  Alert.error(msg);
  return null;
};

export const parseExcelFile = async (file) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file);

  let data = [];
  try {
    const worksheet = workbook.worksheets[0];
    worksheet.eachRow((row) => {
      const rowValues = row.values[1];
      data.push(rowValues);
    });
  } catch (error) {
    return false;
  }
  return data;
};

export const handleCsvUpdate = (fileObj) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, {
        header: false,
        skipEmptyLines: true,
      });
      const csvData = _.map(csv?.data || [], (v) => v[0]);
      resolve(csvData);
    };
    reader.readAsText(fileObj);
  });
};
