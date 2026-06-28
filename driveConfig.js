

const driveDocuments = {
  'pune-below-50': {
    fileId: '1DPdamcZnttemVN1GZTB7d4ZzG03tLaSM', // Update this with your file ID
    name: 'PUNE Cut_off list Below 50%tile'
  }
};

/**
 * Generate a shareable link for a Google Drive file
 * This creates a direct view link that doesn't expose the drive folder structure
 * @param {string} percentileRange - The percentile range (e.g., '10-30')
 * @returns {object} Object containing the file link and name
 */
function getDocumentLink(percentileRange) {
  const doc = driveDocuments[percentileRange];
  
  if (!doc || !doc.fileId || doc.fileId === 'YOUR_FILE_ID_HERE') {
    return null;
  }
  
  // Generate direct view link (not drive folder link)
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
