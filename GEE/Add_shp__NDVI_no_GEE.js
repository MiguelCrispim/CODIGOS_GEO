// Abrindo uma FeatureCollection - um shape
// Ir nos menus da esquerda e importar o shp depois vamos crir uma variavel para inserir ele
var roi = ee.FeatureCollection('users/scriptsremoteambgeo/RS_Municipios_2021')
    .filter(ee.Filter.eq('NM_MIN','Porto Alefgre')) // Aqui filtramos dentor do GEE ou seja no ee. - pela coluna NM_MUN, atributo 'Porto Alegre'

// Adiconando o layer
Map.addLayer(roi)
Map.centerObject(roi,10)

// Selecionar nossa coleção de imagens
var collecton = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
    .select('B.*') // selecionar só as bandas "B"
    .filterBounds(roi) // Selecionar só as imagens que recobre a área de estudo
    .filterDate('2020-09-01','2022-04-01') // Período enter safra
    .filter(ee.Filter.lt('CLOUNDY_PIXELS_PERCENTAGE',1))

//Quantidade de imagens sendo geradas - contador .size
print('Quantas imgs',collection.size()) // collection é o banco de imagens e size o contador

// Precisamos aplicar o fator de escala em todas as img
// Para isso iremos o map()
// Definir uma função de looping
function scale_and_ndvi(image){
    var ndvi = image.normalizedDifference(['B8','B4']).rename('NDVI')
    //encerrar a função
    // Para ecerrar a função multiplicamos aimagem pelo fator de escala
    // Adicionamos o NDVI e copiamos as propriedades da coleção para gerar análises temporais
    return image.multiply(0.0001) // fator de escala da imagem
                .addBands(ndvi) // Adcionamos a banda NDVI a grupo de bandas
                .clip(roi) // Recortamos as imagens com base no poligono da região "uma mask"
                .copyProperties(image, image.propertyNames()) // Copiando as propriedades
                .set({data: image.date().format('YYYYY-MM-dd')}) // Adiconando a propriedade por data

}

// Agora vamos aplicar os cálculos da função na nossa coleção de imagens
var collection_scale_ndvi = colection.map(sacel_and_ndvi)
print('Quantas iamgens após aplicar a função', collection_sale_ndvi.size())
print('Quais bandas temos?', collection_sale.first().bandName())

// Criar uma lista com a propriedade data
var dias = collection_scale_ndvi.aggregate_array('data')
print('imprimir a lista de datas', dias)

// Vamos aplicar uma função que irá ser executada em cada data
var datas = dias.getInfo()  // use o getIndo com moderação (IMPOTANTE!!) - ele pode cabar trancando alguns processamentos no GEE e deixar mais lento
var serie_temporal = datas.map(loop); // função para uma lista

// Estrutura da função
function loop(data){
    
    // Aqui nós aplicamos um filtro de data em cada imagem
    var collection_scale = collection.map(scale_and_ndvi).filter(ee.Filter.eq('data', data))
    Map.addLayer(collection_scale.select('NDVI'),
                                    {palette: ['red','yellow','green'], min:-1, max:1},
                                    'NDVI'.concat(data))

// Exportando as multiplas imagens
Export.image.toDrive({
                        image: collection_scale.select('NDVI').first(),
                        folder: 'MINICURSO_GEE',
                        description: 'NDVI_'.concat(data),
                        region: roi,
                        crs: 'EPSG:4326',
                        scale: 10,
                        maxPixels: 1e13
})
} // Fim da função Loop

// Criar amostras
var amostras = ee.FeatureCollection([agricultura,vegetacao,agua,urbanizacao])

// Vamos gerar os gráficos
var chart = ui.Cahrt.image.seriesByRegion({
    ImageCollection:collection_scale_ndvi,
    regions: amostras,
    reducer: ee.Reducer.mean(), 
    band:'NDVI', 
    scale:20, 
    xProperty:'system:time_start', 
    seriesProperty:'label'
})
    .setChartType('ScatterChart') // Tipos de gráficos 'ScatterCahrt', 'LineChart', and 'ColumnChart'
        .setOptions({
            title: {title:'NDVI'},
            lineWidth: 1,
            pointSize: 5,
            series: {
                0: {pointShape: 'circle', color:'violet'},
                1: {pointShape: 'triangle', rotation: 180, color:'green'},
                2: {pointShape: 'square', color:'blue'},
                3: {pointShape: 'diamond', color:'black'},
            }
        });

  //  print (chart)

// Adiconar o gráfico "Chart" no mapa
// Add o gráficno no painel
chart.style().set({
    position:'bottom-left',
    width:'500px',
    height:'300px'
})

Map.add(chart)

