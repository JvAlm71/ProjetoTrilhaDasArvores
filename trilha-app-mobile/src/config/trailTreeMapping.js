// Configuration file mapping trails to specific trees from the CSV database
// Each trail contains trees selected based on interesting characteristics

export const trailTreeMapping = {
  1: { // Trilha das Gigantes
    name: "Trilha no Gramadão",
    description: "Esta trilha leva você a um encontro com as árvores mais majestosas e antigas da ESALQ.",
    trees: [
      { csvCode: "3481", qrId: "725" },
      { csvCode: "4929", qrId: "702" },
      { csvCode: "4928", qrId: "701" },
      { csvCode: "5311", qrId: "5488" },
      { csvCode: "4930", qrId: "703" },
      { csvCode: "4927", qrId: "699" },
      { csvCode: "5310", qrId: "5487" },
      { csvCode: "4916", qrId: "684" },
      { csvCode: "4915", qrId: "683" },
      { csvCode: "4910", qrId: "677" },
      { csvCode: "4914", qrId: "682" },
      { csvCode: "5862", qrId: "5500" },
      { csvCode: "3633", qrId: "711" },
      { csvCode: "4922", qrId: "692" },
      { csvCode: "4911", qrId: "678" },
      { csvCode: "4912", qrId: "679" },
      { csvCode: "4926", qrId: "698" },
      { csvCode: "5744", qrId: "5507" },
      { csvCode: "5860", qrId: "5498" },
      { csvCode: "5600", qrId: "5501" },
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
