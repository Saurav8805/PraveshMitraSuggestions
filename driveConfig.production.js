// Production Drive Configuration
// This file is deployed to Vercel with actual file IDs
// Google Drive file IDs are public-safe (they're just document identifiers)

const driveDocuments = {
  'pune-below-50': {
    fileId: '',  // You'll update this manually
    name: 'PUNE Cut_off list Below 50%tile'
  }
};

function getDocumentLink(percentileRange) {
  const doc = driveDocuments[percentileRange];
  
  if (!doc || !doc.fileId) {
    return null;
  }
  
  // Generate embedded preview link (opens within website, not Google Drive interface)
  const directLink = `https://drive.google.com/file/d/${doc.fileId}/preview`;
  
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
