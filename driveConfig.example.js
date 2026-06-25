// Google Drive Document Mapping - EXAMPLE FILE
// Copy this file to driveConfig.js and add your actual Google Drive file IDs

const driveDocuments = {
  '10-30': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '10-30 Percentile College List'
  },
  '20-40': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '20-40 Percentile College List'
  },
  '30-50': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '30-50 Percentile College List'
  },
  '40-60': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '40-60 Percentile College List'
  },
  '50-70': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '50-70 Percentile College List'
  },
  '60-80': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '60-80 Percentile College List'
  },
  '70-90': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '70-90 Percentile College List'
  },
  '80-100': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '80-100 Percentile College List'
  },
  '90-99': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '90-99 Percentile College List'
  },
  '99-100': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '99-100 Percentile College List (Top Tier)'
  }
};

function getDocumentLink(percentileRange) {
  const doc = driveDocuments[percentileRange];
  
  if (!doc || !doc.fileId || doc.fileId === 'PASTE_YOUR_FILE_ID_HERE') {
    return null;
  }
  
  const directLink = `https://drive.google.com/file/d/${doc.fileId}/view`;
  
  return {
    link: directLink,
    name: doc.name,
    percentileRange: percentileRange
  };
}

module.exports = {
  driveDocuments,
  getDocumentLink
};
