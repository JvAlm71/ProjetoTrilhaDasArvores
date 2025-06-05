// Configuration file mapping trails to specific trees from the CSV database
// Each trail contains trees selected based on interesting characteristics

export const trailTreeMapping = {
  1: { // Trilha das Gigantes
    name: "Trilha das Gigantes",
    description: "Esta trilha leva você a um encontro com as árvores mais majestosas e antigas da ESALQ.",
    trees: [
      { csvCode: "5402", qrId: "QR001" }, // Jerivá - 12m height
      { csvCode: "5404", qrId: "QR002" }, // Mangueira - 8m height
      { csvCode: "5405", qrId: "QR003" }, // Jacarandá-mimoso - 6m height
    ]
  },
  2: { // Trilha das Flores Nativas
    name: "Trilha das Flores Nativas",
    description: "Um percurso encantador que destaca a beleza e a diversidade das plantas floríferas nativas da região.",
    trees: [
      { csvCode: "5403", qrId: "QR004" }, // Tipuana - 6m height
      { csvCode: "5405", qrId: "QR005" }, // Jacarandá-mimoso - flowering tree
    ]
  },
  3: { // Trilha do Pequeno Explorador
    name: "Trilha do Pequeno Explorador",
    description: "Uma aventura divertida e educativa para todas as idades, especialmente para crianças.",
    trees: [
      { csvCode: "5406", qrId: "QR006" }, // Não identificado - mystery tree for exploration
      { csvCode: "5402", qrId: "QR007" }, // Jerivá - palm tree, easy to identify
    ]
  }
};

// Helper function to get trail configuration by ID
export const getTrailConfig = (trailId) => {
  return trailTreeMapping[trailId] || null;
};

// Helper function to get tree configuration by trail ID and QR code
export const getTreeConfigByQR = (trailId, qrCode) => {
  const trail = trailTreeMapping[trailId];
  if (!trail) return null;
  
  return trail.trees.find(tree => tree.qrId === qrCode) || null;
};
