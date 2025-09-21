// Export types and utilities for admin dashboard
export interface ExportData {
  headers: string[];
  rows: any[];
}

export interface ExportOptions {
  filename: string;
  sanitizeData?: boolean;
}

export async function exportToExcel(data: ExportData, options: ExportOptions): Promise<void> {
  // Simple CSV export since we don't have xlsx dependency
  const { headers, rows } = data;
  const { filename } = options;
  
  let csvContent = headers.join(',') + '\n';
  
  rows.forEach((row: any) => {
    const rowData = Array.isArray(row) ? row : Object.values(row);
    csvContent += rowData.map((field: any) => 
      typeof field === 'string' && field.includes(',') 
        ? `"${field.replace(/"/g, '""')}"` 
        : field
    ).join(',') + '\n';
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename.replace('.xlsx', '.csv'));
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default { exportToExcel };