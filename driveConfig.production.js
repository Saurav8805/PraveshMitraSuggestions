// Production Drive Configuration
// This file can be deployed to Vercel
// It uses environment variables for file IDs instead of hardcoding them

const driveDocuments = {
  '10-30': {
    fileId: process.env.DRIVE_10_30 || '',
    name: '10-30 Percentile College List'
  },
  '30-40': {
    fileId: process.env.DRIVE_30_40 || '',
    name: '30-40 Percentile College List'
  },
  '40-50': {
    fileId: process.env.DRIVE_40_50 || '',
    name: '40-50 Percentile College List'
  },
  '50-60': {
    fileId: process.env.DRIVE_50_60 || '',
    name: '50-60 Percentile College List'
  },
  '60-70': {
    fileId: process.env.DRIVE_60_70 || '',
    name: '60-70 Percentile College List'
  },
  '70-80': {
    fileId: process.env.DRIVE_70_80 || '',
    name: '70-80 Percentile College List'
  },
  '80-90': {
    fileId: process.env.DRIVE_80_90 || '',
    name: '80-90 Percentile College List'
  },
  '90-100': {
    fileId: process.env.DRIVE_90_100 || '',
    name: '90-100 Percentile College List (Top Tier)'
  }
};

function getDocumentLink(percentileRange) {
  const doc = driveDocuments[percentileRange];
  
  if (!doc || !doc.fileId || doc.fileId === '') {
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
