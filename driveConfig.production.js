// Production Drive Configuration
// This file is deployed to Vercel with actual file IDs
// Google Drive file IDs are public-safe (they're just document identifiers)

const driveDocuments = {
  '10-30': {
    fileId: '19Afgf08pqj-H8q1zVs65NeeMKKjBoUkq',
    name: '10-30 Percentile College List'
  },
  '30-40': {
    fileId: '164Gal0Aan-VmzPpxfDldZVA8cxe84JmI',
    name: '30-40 Percentile College List'
  },
  '40-50': {
    fileId: '164Gal0Aan-VmzPpxfDldZVA8cxe84JmI',
    name: '40-50 Percentile College List'
  },
  '50-60': {
    fileId: '164Gal0Aan-VmzPpxfDldZVA8cxe84JmI',
    name: '50-60 Percentile College List'
  },
  '60-70': {
    fileId: '164Gal0Aan-VmzPpxfDldZVA8cxe84JmI',
    name: '60-70 Percentile College List'
  },
  '70-80': {
    fileId: '164Gal0Aan-VmzPpxfDldZVA8cxe84JmI',
    name: '70-80 Percentile College List'
  },
  '80-90': {
    fileId: '164Gal0Aan-VmzPpxfDldZVA8cxe84JmI',
    name: '80-90 Percentile College List'
  },
  '90-100': {
    fileId: '164Gal0Aan-VmzPpxfDldZVA8cxe84JmI',
    name: '90-100 Percentile College List (Top Tier)'
  }
};

function getDocumentLink(percentileRange) {
  const doc = driveDocuments[percentileRange];
  
  if (!doc || !doc.fileId) {
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
