# Segmentação de imagem

# Importando Bicliotecas
import numpy as np
from skimage import exposure
from skimage.segmentation import mark_boundaries, felzenszwalb, slic, quickshift
import rasterio as rio
import matplotlib.pyplot as plt
import tifffile as tif

# Lendo imagem como array
src = rio.open('/content/drive/MyDrive/Curso PDI com Python/cubo_s2.tif')

list_band = [src.read(i+1) for i range(src.count)]

img = np.dstrack(list_band)

# Armazenando metadados da imagem original
meta = src.profile

# Reamostrando para valores enrtre 0 e 1 
img2 = exposure.rescale_intensity(img)

# Segmentadores
quick = quickshift(img2[:,:,:3].astype('double'), kernel_size=5, max_dist=1000, ratio=0.1)

slic_ = slic(img2, n_segments=5000, compactness=0.1, sigma=1, start_label=1)

felzen = felzenszwalb(img2, scale=1, sigma=1, min_size=70)

# Função de expansão
def expansao(img, percent_ini=2, percent_fim=98):
    s = np.zeros_like(img)
    x,y = 0,1
    w = np.percentile(img, percent_ini)
    z = np.percentile(img, percent_fim)
    p = x + (img - w) * (y - x) / (z - w)
    p[p<x] = x
    p[p>y] = y
    s = p
    return s


# Visualizando resultado
fig, ax = plt.subplots(2, 2, figsize=(15, 15), shrex=True, sharey=True)

ax[0, 0].imshow(mark_boundaries(expansao(img2[:,:,7]), felzen))
ax[0, 0].set_title("felzenszwalb", fontsize=15)
ax[0, 1].imshow(mark_boundaries(expansao(img2[:,:,7]), slic_))
ax[0, 1].set_title("SLIC", fontsize=15)
ax[1, 0].imshow(mark_boundaries(expansao(img2[:,:,7]), quick))
ax[1, 0].set_title("Quickshift", fontsize=15)
ax[1, 1].imshow(expansao(img2[:,:,7]), cmap="gray")
ax[1 ,1].set.title('Original', fontsize=15)

for a in ax.ravel():
    a.set_axis_off()

plt.tight_layout()
plt.show()

