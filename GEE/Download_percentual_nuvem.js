// Realizando filtro de imagens by select por % de nuvem

// Deginição de variavel da regiãod e interesse
var região = geometry;

// A vamos abrir nossa primeira imagem
var collection = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
                .select('B.*') // Selecionar todas as bandas 'B'
                .filterBounds(regiao) // Filtrar as bordas/delimitação a partir da variável 'regiao'
                .filterDate('2021-01-01','2022-01-01') // Filtrar pela data
                .filter(ee.Filter.lt('CLOUDY_PIXELS_PERCENTAGE',0,5)) // O prefixo "ee" é para a pataforma da google saber q é para processar na nuvem do GEE, e aqui dentro da biblioteca dessa imagem esse filtro seleciona as imagens com base no % de nuvem dentro da imagem desejado
                // o "lt" significa uma lista menor que o valor colocarod já o "gt" seria uam lista que indica valor apartir do valor colocado ou maior que
                .sort('CLOUDY_PIXELS_PERCENTAGE') // Aqui vai ordenar as imagens pelo % de nuvens

// Quantas imagens eu tenho
print('qtds', collection)

// A melhor imagem da lista
var melhor_imagem = collection.first()

// Qual o ID da imagem
// Extraindo as propriedades da imagem
print('Qual o ID', melhor_imagem.get('system:id'))
print('% de nuvem', melhor_imagem.get(CLOUDY_PIXEL_PERCENTAGE))

// Visualizações em cores diferentes (composições difetenstes)
Map.addLayer(melhor_imagem, {bands:['B4', 'B3', 'B2'],
                             Min:136, max:1765,},'RGB')

// Centralizar imagem - centralizar na variável região com zoom 8
// Dentro da plataforma do GEE, da para ir em Layer e cofigurações - Stretch:100% e então consegue ver os valores minimos e maximos da imagem para poder definir no código
Map.centerObject(regiao,8)
