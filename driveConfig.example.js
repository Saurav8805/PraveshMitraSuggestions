// Google Drive Document Mapping - EXAMPLE FILE
// Copy this file to driveConfig.js and add your actual Google Drive file IDs

const driveDocuments = {
  '10-30': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '10-30 Percentile College List'
  },
  '30-40': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '30-40 Percentile College List'
  },
  '40-50': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '40-50 Percentile College List'
  },
  '50-60': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '50-60 Percentile College List'
  },
  '60-70': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '60-70 Percentile College List'
  },
  '70-80': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '70-80 Percentile College List'
  },
  '80-90': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '80-90 Percentile College List'
  },
  '90-100': {
    fileId: 'PASTE_YOUR_FILE_ID_HERE',
    name: '90-100 Percentile College List (Top Tier)'
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
