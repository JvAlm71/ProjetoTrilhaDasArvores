// Sample tree data extracted from the CSV file for demonstration
// In a real implementation, you would parse the actual CSV file
const sampleTreeData = `Código,Nome,espécie,Altura Geral,Altura da 1a ramificação,Diâmetro copa,PAP,Localização área,Observacao,Latitude,Longitude
5402,Jerivá,Syagrus romanzoffiana,12,0,5,0.75,Guarita Monte Alegre,,-22.71173575,-47.63148586
5403,Tipuana,Tipuana tipu,6,2,2,0.56,Gramadão Central,,-22.70995046,-47.63277402
5404,Mangueira,Mangifera indica,8,2.3,1.2,0.26,Gramadão Central,,-22.70997769,-47.63276481
5405,Jacarandá-mimoso,Jacaranda mimosifolia,6,1.7,1.5,0.33,Gramadão Central,,-22.71005036,-47.63273701
5406,Não identificado,Não identificado,6,2.1,1.5,0.3,Gramadão Central,,-22.71003183,-47.63276585`;

// Parse CSV data and create a lookup map by tree code
export const parseTreeData = () => {
  const lines = sampleTreeData.split('\n');
  const headers = lines[0].split(',');
  const trees = {};
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',');
    const treeData = {};
    
    headers.forEach((header, index) => {
      treeData[header.trim()] = values[index] ? values[index].trim() : '';
    });
    
    // Use the first column (Código) as the key
    const code = treeData['Código'] || treeData['C�digo']; // Handle encoding issues
    if (code) {
      trees[code] = {
        code: code,
        name: treeData['Nome'] || 'Nome não identificado',
        species: treeData['espécie'] || treeData['esp�cie'] || 'Espécie não identificada',
        genus: treeData['Gênero'] || treeData['G�nero'] || '',
        height: parseFloat(treeData['Altura Geral']) || 0,
        firstBranchHeight: parseFloat(treeData['Altura da 1a ramificação'] || treeData['Altura da 1a ramifica��o']) || 0,
        crownDiameter: parseFloat(treeData['Diâmetro copa'] || treeData['Di�metro copa']) || 0,
        pap: parseFloat(treeData['PAP']) || 0, // Perímetro à altura do peito
        location: treeData['Localização área'] || treeData['Localiza��o �rea'] || '',
        observations: treeData['Observacao'] || treeData['Observação'] || '',
        latitude: parseFloat(treeData['Latitude']) || 0,
        longitude: parseFloat(treeData['Longitude']) || 0,
        generalCondition: getGeneralCondition(treeData),
        ecology: getEcologyInfo(treeData),
        phenology: getPhenologyInfo(treeData)
      };
    }
  }
  
  return trees;
};

// Helper function to determine general condition
const getGeneralCondition = (data) => {
  if (data['Est geral ótimo'] === 'TRUE') return 'Ótimo';
  if (data['Est geral bom'] === 'TRUE') return 'Bom';
  if (data['Est geral regular'] === 'TRUE') return 'Regular';
  if (data['Est geral péssimo'] === 'TRUE') return 'Péssimo';
  if (data['Est geral morta'] === 'TRUE') return 'Morta';
  return 'Não informado';
};

// Helper function to get ecology information
const getEcologyInfo = (data) => {
  const ecology = [];
  if (data['Ecologia Insetos'] === 'TRUE') ecology.push('Presença de insetos');
  if (data['Ecologia Ninhos'] === 'TRUE') ecology.push('Presença de ninhos');
  if (data['Ecologia Liquens'] === 'TRUE') ecology.push('Presença de líquens');
  if (data['Ecologia Epífitas'] === 'TRUE') ecology.push('Presença de epífitas');
  if (data['Ecologia Parasitas'] === 'TRUE') ecology.push('Presença de parasitas');
  return ecology;
};

// Helper function to get phenology information
const getPhenologyInfo = (data) => {
  const phenology = [];
  if (data['Fenologia Folha'] === 'TRUE') phenology.push('Folhas');
  if (data['Fenologia Flor'] === 'TRUE') phenology.push('Flores');
  if (data['Fenologia Fruto'] === 'TRUE') phenology.push('Frutos');
  return phenology;
};

// Create the tree database on module load
export const treeDatabase = parseTreeData();

// Helper function to get tree by code
export const getTreeByCode = (code) => {
  return treeDatabase[code] || null;
};
