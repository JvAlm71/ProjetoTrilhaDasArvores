// Sample tree data extracted from the CSV file for demonstration
// In a real implementation, you would parse the actual CSV file
const sampleTreeData = `Código,Nome,espécie,Altura Geral,Altura da 1a ramificação,Diâmetro copa,PAP,Localização área,Observacao,Latitude,Longitude
3481,Pinheiro do paraná,,10.5,0,4,1.200000048,Gramadão Central,,-22.70956252,-47.63221199
4929,Não identificado,,10,2.099999905,5,1.440000057,Gramadão Central,,-22.70956188,-47.6322509
4928,Pata-de-vaca,,6.5,2,5,0.7900000215,Gramadão Central,,-22.70955206,-47.63229936
5311,Arariba rosa,,6.5,4,2,0.2899999917,Gramadão Central,,-22.70956028,-47.63234817
4930,Cedro rosa,,20,2.799999952,7.5,1.899999976,Gramadão Central,,-22.70956818,-47.63241643
4927,Arariba rosa,,8,4.5,4.5,0.7200000286,Gramadão Central,,-22.70959445,-47.63246558
5310,Morta,,9,3.5,3,0.4099999964,Gramadão Central,,-22.70962185,-47.63244664
4916,Pau jacaré,,3,0,3.25,0.3899999857,Gramadão Central,,-22.70962105,-47.63249528
4915,Pau jacaré,,5,0,4.389999866,0.9499999881,Gramadão Central,MORTA,-22.70964828,-47.63248607
4910,Palmeira,,16,0,2,0.5299999714,Gramadão Central,,-22.70966665,-47.63246696
4914,Ipê roxo,,10,1.700000048,4,0.4600000083,Gramadão Central,,-22.70968502,-47.63244785
5862,Catiguá,,9,2.799999952,6,0.4499999881,Gramadão Central,,-22.70971506,-47.63238584
3633,Saguaragi,,14,5.300000191,5,1.049999952,Gramadão Central,,-22.70971385,-47.63234138
4922,Não identificado,,13,5,3,0.349999994,Gramadão Central,,-22.70972015,-47.6325069
4911,Ipê-amarelo,,13,4.5,3,0.7300000191,Gramadão Central,,-22.70972063,-47.63247772
4912,Alecrim-de-campinas,,12,1.75,2.5,0.5199999809,Gramadão Central,,-22.70973868,-47.63247807
4926,Cordia,,11,2.299999952,4,0.4699999988,Gramadão Central,,-22.70975721,-47.63244923
5744,Tipuana,,14,0,12,2.799999952,Gramadão Central,,-22.70976032,-47.63241758
5860,Não identificado,,12,3.5,3.5,0.3899999857,Gramadão Central,,-22.70977476,-47.63239586
5600,Jatobá,,9.5,3.799999952,1,0.8399999738,Gramadão Central,,-22.7097796,-47.63234277
`;



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
