import { Injectable, inject, signal } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import type { Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
 
  // Señal que almacena la lista de fotos de usuario
  public photos = signal<UserPhoto[]>([]);

  // Añade una clave para el almacenamiento de fotos
  private PHOTO_STORAGE: string = 'photos';

  // Inyecta la API de plataforma para rastrear la plataforma en la que se ejecuta la aplicación.
  private platform = inject(Platform);

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
    let base64Data: string | Blob;

    // "hybrid" detectará si estamos en móvil (iOS o Android)
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!,
      });
      base64Data = file.data;
    } else {
      // Obtener la foto, leerla como un blob y luego convertirla al formato base64 (para web)
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      base64Data = (await this.convertBlobToBase64(blob)) as string;
    }

    // Escribir el archivo en el directorio de datos del dispositivo/navegador
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    // Comprobar la plataforma para devolver la ruta correcta de la imagen
    if (this.platform.is('hybrid')) {
      // Mostrar la nueva imagen reescribiendo la ruta 'file://' a HTTP
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      // Usar webPath para mostrar la nueva imagen en lugar de base64,
      // ya que ya está cargada directamente en la memoria
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    }
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

    // Si estamos ejecutando en la web (no en plataforma híbrida/móvil)
    if (!this.platform.is('hybrid')) {
      for (const photo of photos) {
        // Leer los datos de cada foto guardada desde el sistema de archivos
        const file = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });

        // Solo para la plataforma web: cargar la foto como datos base64
        photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
      }
    }

    // Actualizar la señal para que la vista de la galería se refresque
    this.photos.set(photos);
  }

  // Eliminar imagenes
  public async deletePhoto(photo: UserPhoto, position: number){
    // Eliminar esta foto de la lista reactiva de fotos
    this.photos.update((photos) => photos.filter((_, index) => index !== position));

    // Actualiza la caché del array de fotos sobreescribiendo el array existente
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos()),
    }) 

    // Elimina la imagen del sistema de archivos
    const filename = photo.filepath.slice(photo.filepath.lastIndexOf('/')+1);

    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  }
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}