//Vamos começar

//Região de interesse = roi
//Foi criado um poligono na mão da área, 
//e foi na area superir de import e copiou o dógio que continha 
//as coordenada do polygono
var roi = ee.Geometru.Polygon(
    [[[-51.37450909153935, -29.696137073956553],
      [-51.37450909153935, -30.172172087646718],
      [-50.83617901341435, -30.172172087646718],
      [-50.83617901341435, -29.696137073956553]]], null, false)

//Adicionando Imagem
var srtm  = ee.Image("USGS/SRTMGL1_003")

//Visualizar o mapa
Map.addLayer(srtm,{palett:['white','green','yellow','pink','red','darkred'],
            min:0 , max:350}, 'SRTM POA')

//Download da imagem para o drive

Export.image.toDrive({image:srtm,
    description:'SRMT_POA',
    folder:'MINICURSO_GEE',
    fileNamePrefix:'SRTM_POA',
    region:roi,
    scale:30,
    crs:'EPSG:4326',
    maxPixels:1e13,
    fileformat:'GeoTIFF'})
    