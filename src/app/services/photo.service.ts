import { Injectable, signal } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  public photos = signal<UserPhoto[]>([]);

  public async addNewToGallery() {
    // Sacar una foto
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    this.photos.update((photos) => [
      {
        filepath: 'soon...',
        webviewPath: capturedPhoto.webPath!,
      },
      ...photos,
    ]);
  }
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}