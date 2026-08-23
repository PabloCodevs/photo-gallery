import { Injectable, signal } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import type { Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
 
  // Señal que almacena la lista de fotos de usuario
  public photos = signal<UserPhoto[]>([]);

  // Añade una clave para el almacenamiento de fotos
  private PHOTO_STORAGE: string = 'photos';

  public async addNewToGallery() {
    // Tomar una foto con la cámara
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    // Guardar la imagen y añadirla a la colección de fotos
    const savedImageFile = await this.savePicture(capturedPhoto);

    // Actualizar la señal añadiendo la nueva foto al principio de la lista
    this.photos.update((photos) => [savedImageFile, ...photos]);

    // Añadir un método para guardar en caché los datos de todas las fotos y poder recuperarlas en el futuro
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos()),
    });
  }


  private async savePicture(photo: Photo) {
    // Obtener la foto, leerla como un blob y luego convertirla al formato base64
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const base64Data = (await this.convertBlobToBase64(blob)) as string;

    // Escribir el archivo en el directorio de datos del dispositivo/navegador
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    // Usar webPath para mostrar la nueva imagen en lugar de base64,
    // ya que ya está cargada directamente en la memoria
    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  }

  private convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }

  // Añadir el método para cargar los datos de las fotos
  public async loadSaved() {
    // Recuperar los datos del array de fotos guardados en caché
    const { value: photoList } = await Preferences.get({ key: this.PHOTO_STORAGE });
    const photos = (photoList ? JSON.parse(photoList) : []) as UserPhoto[];

    for (const photo of photos) {
      // Leer los datos de cada foto guardada desde el sistema de archivos
      const file = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });

      // Mostrar la foto leyéndola en formato base64 (solo para plataforma web)
      photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
    }

    this.photos.set(photos);
  }
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}